import { notFound } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { ArrowLeft } from 'lucide-react'
import { getOrderById } from '@/lib/actions/orders'
import { formatPrice, formatDate, getOrderStatusColor, getOrderStatusLabel, getPaymentStatusColor } from '@/lib/utils'
import { cn } from '@/lib/utils'
import AdminOrderActions from '../AdminOrderActions'

interface AdminOrderDetailProps {
  params: Promise<{ id: string }>
}

export default async function AdminOrderDetailPage({ params }: AdminOrderDetailProps) {
  const { id } = await params
  const order = await getOrderById(id)
  if (!order) notFound()

  return (
    <div className="max-w-5xl">
      <div className="flex items-center gap-4 mb-8">
        <Link href="/admin/orders" className="flex items-center gap-2 text-sm text-stone-400 hover:text-stone-700">
          <ArrowLeft size={16} />
          Orders
        </Link>
        <span className="text-stone-300">/</span>
        <span className="font-mono-zora text-sm font-medium text-stone-700">{order.order_number}</span>
      </div>

      <div className="flex items-start justify-between mb-8">
        <div>
          <h1 className="font-display text-4xl font-semibold text-stone-800">{order.order_number}</h1>
          <p className="text-stone-400 text-sm mt-1">{formatDate(order.created_at)}</p>
        </div>
        <div className="flex items-center gap-3">
          <span className={cn('px-3 py-1.5 rounded-full text-xs font-bold', getOrderStatusColor(order.order_status))}>
            {getOrderStatusLabel(order.order_status)}
          </span>
          <span className={cn('px-3 py-1.5 rounded-full text-xs font-bold', getPaymentStatusColor(order.payment_status))}>
            Payment: {order.payment_status}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-cream-50 border border-cream-200 rounded-2xl p-6">
            <h2 className="text-xs font-semibold tracking-[0.2em] uppercase text-stone-500 mb-5">Order Items</h2>
            <div className="space-y-4">
              {order.items.map((item: any, idx: number) => (
                <div key={idx} className="flex items-center gap-4 pb-4 border-b border-cream-100 last:border-0 last:pb-0">
                  <div className="relative w-16 h-20 rounded-xl overflow-hidden bg-cream-200 shrink-0">
                    {(item.image || item.product?.images?.[0]) && (
                      <Image src={item.image || item.product.images[0]} alt={item.product?.name || ''} fill className="object-cover" sizes="64px" />
                    )}
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-stone-800">{item.product?.name}</p>
                    <p className="text-xs text-stone-400 mt-0.5">
                      {item.colorName || item.color?.name} · Size {item.size} · Qty {item.quantity}
                    </p>
                    <p className="font-semibold text-sm mt-1">
                      {formatPrice(item.product?.price)} × {item.quantity} = {formatPrice(item.product?.price * item.quantity)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
            <div className="border-t border-cream-200 mt-4 pt-4 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-stone-400">Subtotal</span>
                <span>{formatPrice(order.subtotal)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-stone-400">Shipping</span>
                <span>{order.shipping_fee === 0 ? 'Free' : formatPrice(order.shipping_fee)}</span>
              </div>
              <div className="flex justify-between font-bold text-base border-t border-cream-200 pt-2">
                <span>Total</span>
                <span>{formatPrice(order.total)}</span>
              </div>
            </div>
          </div>

          {order.status_history?.length > 0 && (
            <div className="bg-cream-50 border border-cream-200 rounded-2xl p-6">
              <h2 className="text-xs font-semibold tracking-[0.2em] uppercase text-stone-500 mb-5">Timeline</h2>
              <div className="space-y-4">
                {[...order.status_history].reverse().map((h: any, i: number) => (
                  <div key={i} className="flex items-start gap-3">
                    <div className={cn('w-2.5 h-2.5 rounded-full mt-1.5 shrink-0', getOrderStatusColor(h.status).split(' ')[0])} />
                    <div>
                      <p className="text-sm font-semibold capitalize text-stone-700">{h.status}</p>
                      <p className="text-xs text-stone-400">{h.note}</p>
                      <p className="text-[11px] text-stone-300 mt-0.5">{new Date(h.timestamp).toLocaleString('en-LK')}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="space-y-5">
          <div className="bg-cream-50 border border-cream-200 rounded-2xl p-5">
            <h2 className="text-xs font-semibold tracking-[0.2em] uppercase text-stone-500 mb-4">Customer</h2>
            <div className="space-y-2 text-sm">
              <p className="font-semibold text-stone-800">{order.customer_name}</p>
              <p className="text-stone-500">{order.customer_email}</p>
              <p className="text-stone-500">{order.customer_phone}</p>
            </div>
          </div>
          <div className="bg-cream-50 border border-cream-200 rounded-2xl p-5">
            <h2 className="text-xs font-semibold tracking-[0.2em] uppercase text-stone-500 mb-4">Delivery Address</h2>
            <address className="not-italic text-sm text-stone-600 leading-relaxed">
              {order.shipping_address.address_line1}<br />
              {order.shipping_address.address_line2 && <>{order.shipping_address.address_line2}<br /></>}
              {order.shipping_address.city}, {order.shipping_address.district}
              {order.shipping_address.postal_code && <>, {order.shipping_address.postal_code}</>}
            </address>
          </div>
          <div className="bg-cream-50 border border-cream-200 rounded-2xl p-5">
            <h2 className="text-xs font-semibold tracking-[0.2em] uppercase text-stone-500 mb-4">Payment</h2>
            <div className="text-sm space-y-2">
              <div className="flex justify-between">
                <span className="text-stone-400">Method</span>
                <span className="capitalize font-medium">{order.payment_method === 'cod' ? 'Cash on Delivery' : 'Online'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-stone-400">Status</span>
                <span className={cn('text-xs font-bold px-2 py-0.5 rounded-full', getPaymentStatusColor(order.payment_status))}>
                  {order.payment_status}
                </span>
              </div>
            </div>
          </div>
          <AdminOrderActions order={order} />
        </div>
      </div>
    </div>
  )
}
