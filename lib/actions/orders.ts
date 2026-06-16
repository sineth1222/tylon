'use server'

import { createAdminClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { z } from 'zod'
import { sendOrderConfirmationEmail, sendOrderStatusUpdateEmail } from '@/lib/email'
import { CartItem, OrderStatus, ShippingAddress } from '@/types'

const SHIPPING_FEE = parseInt(process.env.SHIPPING_FEE || '250')

const checkoutSchema = z.object({
  customer_name: z.string().min(2),
  customer_email: z.string().email(),
  customer_phone: z.string().min(9),
  address_line1: z.string().min(5),
  address_line2: z.string().optional(),
  city: z.string().min(2),
  district: z.string().min(2),
  postal_code: z.string().optional(),
  payment_method: z.enum(['cod', 'online']),
  notes: z.string().optional(),
})

export async function createOrder(
  items: CartItem[],
  userId: string | null,
  formData: FormData
) {
  const supabase = await createAdminClient()

  const rawData = {
    customer_name: formData.get('customer_name') as string,
    customer_email: formData.get('customer_email') as string,
    customer_phone: formData.get('customer_phone') as string,
    address_line1: formData.get('address_line1') as string,
    address_line2: formData.get('address_line2') as string || undefined,
    city: formData.get('city') as string,
    district: formData.get('district') as string,
    postal_code: formData.get('postal_code') as string || undefined,
    payment_method: formData.get('payment_method') as string,
    notes: formData.get('notes') as string || undefined,
  }

  const parsed = checkoutSchema.safeParse(rawData)
  if (!parsed.success) {
    return { error: parsed.error.errors[0].message }
  }

  const subtotal = items.reduce((sum, item) => sum + item.product.price * item.quantity, 0)
  const shipping_fee = SHIPPING_FEE
  const total = subtotal + shipping_fee

  const shippingAddress: ShippingAddress = {
    full_name: parsed.data.customer_name,
    phone: parsed.data.customer_phone,
    address_line1: parsed.data.address_line1,
    address_line2: parsed.data.address_line2,
    city: parsed.data.city,
    district: parsed.data.district,
    postal_code: parsed.data.postal_code,
  }

  const statusHistory = [{
    status: 'pending',
    timestamp: new Date().toISOString(),
    note: 'Order placed successfully',
  }]

  // ── Save items with colorName + colorHex properly ──────────────
  const serialisedItems = items.map(item => ({
    product: {
      id: item.product.id,
      name: item.product.name,
      price: item.product.price,
      images: item.product.images,
    },
    quantity: item.quantity,
    size: item.size,
    colorName: item.colorName,
    colorHex: item.colorHex,
    image: item.image,
  }))

  const { data: order, error } = await supabase
    .from('orders')
    .insert({
      user_id: userId,
      customer_email: parsed.data.customer_email,
      customer_name: parsed.data.customer_name,
      customer_phone: parsed.data.customer_phone,
      shipping_address: shippingAddress,
      items: serialisedItems,
      subtotal,
      shipping_fee,
      discount_amount: 0,
      total,
      payment_method: parsed.data.payment_method,
      payment_status: 'pending',
      order_status: 'pending',
      notes: parsed.data.notes || null,
      status_history: statusHistory,
    })
    .select()
    .single()

  if (error) return { error: error.message }

  try {
    await sendOrderConfirmationEmail(order)
  } catch (err) {
    console.error('Failed to send order confirmation email:', err)
  }

  revalidatePath('/admin/orders')
  return { success: true, orderId: order.id, orderNumber: order.order_number }
}

export async function getOrderById(id: string) {
  const supabase = await createAdminClient()
  const { data, error } = await supabase
    .from('orders')
    .select('*')
    .eq('id', id)
    .single()
  if (error) return null
  return data
}

export async function getUserOrders(userId: string) {
  const supabase = await createAdminClient()
  const { data, error } = await supabase
    .from('orders')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
  if (error) return []
  return data || []
}

export async function getAllOrders(filters?: {
  status?: OrderStatus
  search?: string
  limit?: number
  offset?: number
}) {
  const supabase = await createAdminClient()

  let query = supabase
    .from('orders')
    .select('*', { count: 'exact' })
    .order('created_at', { ascending: false })

  if (filters?.status) query = query.eq('order_status', filters.status)
  if (filters?.search) {
    query = query.or(
      `order_number.ilike.%${filters.search}%,customer_name.ilike.%${filters.search}%,customer_email.ilike.%${filters.search}%`
    )
  }
  if (filters?.limit)  query = query.limit(filters.limit)
  if (filters?.offset) query = query.range(filters.offset, filters.offset + (filters.limit || 20) - 1)

  const { data, error, count } = await query
  if (error) return { orders: [], count: 0 }
  return { orders: data || [], count: count || 0 }
}

export async function updateOrderStatus(
  orderId: string,
  status: OrderStatus,
  note?: string,
  trackingNumber?: string
) {
  const supabase = await createAdminClient()

  const { data: existingOrder } = await supabase
    .from('orders')
    .select('status_history')
    .eq('id', orderId)
    .single()

  const statusHistory = [
    ...(existingOrder?.status_history || []),
    { status, timestamp: new Date().toISOString(), note: note || `Status updated to ${status}` },
  ]

  const updateData: Record<string, unknown> = {
    order_status: status,
    status_history: statusHistory,
  }
  if (trackingNumber) updateData.tracking_number = trackingNumber
  if (status === 'delivered') updateData.payment_status = 'paid'

  const { data: order, error } = await supabase
    .from('orders')
    .update(updateData)
    .eq('id', orderId)
    .select()
    .single()

  if (error) return { error: error.message }

  try {
    await sendOrderStatusUpdateEmail(order)
  } catch (err) {
    console.error('Failed to send status update email:', err)
  }

  revalidatePath('/admin/orders')
  revalidatePath(`/orders/${orderId}`)
  return { success: true, order }
}

export async function getDashboardStats() {
  const supabase = await createAdminClient()

  const [
    { count: totalOrders },
    { data: revenueData },
    { count: totalProducts },
    { count: totalCustomers },
    { data: recentOrders },
    { data: ordersByStatusData },
  ] = await Promise.all([
    supabase.from('orders').select('*', { count: 'exact', head: true }),
    supabase.from('orders').select('total, created_at').neq('order_status', 'cancelled'),
    supabase.from('products').select('*', { count: 'exact', head: true }).eq('is_active', true),
    supabase.from('users').select('*', { count: 'exact', head: true }).eq('role', 'customer'),
    supabase.from('orders').select('*').order('created_at', { ascending: false }).limit(5),
    supabase.from('orders').select('order_status'),
  ])

  const totalRevenue = revenueData?.reduce((sum, o) => sum + (o.total || 0), 0) || 0

  const ordersByStatus: Record<string, number> = {}
  ordersByStatusData?.forEach(o => {
    ordersByStatus[o.order_status] = (ordersByStatus[o.order_status] || 0) + 1
  })

  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const date = new Date()
    date.setDate(date.getDate() - (6 - i))
    return date.toISOString().split('T')[0]
  })

  const revenueByDay = last7Days.map(date => ({
    date,
    revenue: revenueData
      ?.filter(o => o.created_at.startsWith(date))
      ?.reduce((sum, o) => sum + (o.total || 0), 0) || 0,
  }))

  return {
    totalOrders: totalOrders || 0,
    totalRevenue,
    totalProducts: totalProducts || 0,
    totalCustomers: totalCustomers || 0,
    recentOrders: recentOrders || [],
    ordersByStatus,
    revenueByDay,
  }
}
