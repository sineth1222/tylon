'use client'

import { useState, useTransition } from 'react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { Search, ChevronLeft, ChevronRight, Eye } from 'lucide-react'
import { formatPrice, getOrderStatusColor, getOrderStatusLabel, getPaymentStatusColor } from '@/lib/utils'
import { cn } from '@/lib/utils'

const STATUS_FILTERS = [
  { value: '', label: 'All' },
  { value: 'pending', label: 'Pending' },
  { value: 'confirmed', label: 'Confirmed' },
  { value: 'processing', label: 'Processing' },
  { value: 'shipped', label: 'Shipped' },
  { value: 'delivered', label: 'Delivered' },
  { value: 'cancelled', label: 'Cancelled' },
]

interface AdminOrdersClientProps {
  orders: any[]
  count: number
  page: number
  totalPages: number
  currentStatus?: string
  currentSearch?: string
}

export default function AdminOrdersClient({
  orders, count, page, totalPages, currentStatus, currentSearch,
}: AdminOrdersClientProps) {
  const router = useRouter()
  const [search, setSearch] = useState(currentSearch || '')
  const [isPending, startTransition] = useTransition()

  const updateFilter = (key: string, value: string) => {
    const params = new URLSearchParams()
    if (key !== 'status' && currentStatus) params.set('status', currentStatus)
    if (key !== 'search' && search) params.set('search', search)
    if (value) params.set(key, value)
    params.delete('page')
    startTransition(() => router.push(`/admin/orders?${params.toString()}`))
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    updateFilter('search', search)
  }

  return (
    <>
      {/* Search + Filters */}
      <div className="bg-cream-50 border border-cream-200 rounded-2xl p-5 mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <form onSubmit={handleSearch} className="flex-1 relative">
            <Search size={15} className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400" />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search by order number, customer name or email..."
              className="input-zora pl-11"
            />
          </form>
          <div className="flex flex-wrap gap-2">
            {STATUS_FILTERS.map(f => (
              <button
                key={f.value}
                onClick={() => updateFilter('status', f.value)}
                className={cn(
                  'filter-btn',
                  currentStatus === f.value || (!currentStatus && !f.value)
                    ? 'filter-btn-active'
                    : 'filter-btn-inactive'
                )}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-cream-50 border border-cream-200 rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="border-b border-cream-200">
              <tr>
                {['Order #', 'Customer', 'Items', 'Total', 'Payment', 'Status', 'Date', ''].map(h => (
                  <th key={h} className="text-left py-4 px-4 text-[10px] font-semibold tracking-[0.15em] text-stone-400 uppercase whitespace-nowrap">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {orders.length === 0 ? (
                <tr>
                  <td colSpan={8} className="text-center py-16 text-stone-400">
                    No orders found.
                  </td>
                </tr>
              ) : orders.map(order => (
                <tr key={order.id} className="border-b border-cream-100 hover:bg-cream-100 transition-colors">
                  <td className="py-4 px-4">
                    <span className="font-mono-zora text-xs font-medium text-stone-700">
                      {order.order_number}
                    </span>
                  </td>
                  <td className="py-4 px-4">
                    <div>
                      <p className="text-sm font-medium text-stone-700">{order.customer_name}</p>
                      <p className="text-xs text-stone-400">{order.customer_email}</p>
                    </div>
                  </td>
                  <td className="py-4 px-4 text-sm text-stone-500">
                    {order.items?.length || 0} item{(order.items?.length || 0) !== 1 ? 's' : ''}
                  </td>
                  <td className="py-4 px-4 font-semibold text-sm">{formatPrice(order.total)}</td>
                  <td className="py-4 px-4">
                    <div>
                      <span className="text-xs text-stone-500 capitalize block">{order.payment_method === 'cod' ? 'COD' : 'Online'}</span>
                      <span className={cn('text-[10px] font-bold px-1.5 py-0.5 rounded', getPaymentStatusColor(order.payment_status))}>
                        {order.payment_status}
                      </span>
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <span className={cn('px-2.5 py-1 rounded-full text-[10px] font-bold', getOrderStatusColor(order.order_status))}>
                      {getOrderStatusLabel(order.order_status)}
                    </span>
                  </td>
                  <td className="py-4 px-4 text-xs text-stone-400 whitespace-nowrap">
                    {new Date(order.created_at).toLocaleDateString('en-LK')}
                  </td>
                  <td className="py-4 px-4">
                    <Link
                      href={`/admin/orders/${order.id}`}
                      className="flex items-center justify-center w-8 h-8 rounded-lg bg-cream-200 hover:bg-cream-300 text-stone-600 transition-colors"
                    >
                      <Eye size={14} />
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between px-5 py-4 border-t border-cream-200">
            <p className="text-xs text-stone-400">
              Page {page} of {totalPages} ({count} total)
            </p>
            <div className="flex items-center gap-2">
              <Link
                href={`/admin/orders?page=${page - 1}${currentStatus ? `&status=${currentStatus}` : ''}${currentSearch ? `&search=${currentSearch}` : ''}`}
                className={cn(
                  'w-8 h-8 rounded-lg flex items-center justify-center text-stone-500 transition-colors',
                  page <= 1 ? 'opacity-30 pointer-events-none' : 'hover:bg-cream-200'
                )}
              >
                <ChevronLeft size={16} />
              </Link>
              <Link
                href={`/admin/orders?page=${page + 1}${currentStatus ? `&status=${currentStatus}` : ''}${currentSearch ? `&search=${currentSearch}` : ''}`}
                className={cn(
                  'w-8 h-8 rounded-lg flex items-center justify-center text-stone-500 transition-colors',
                  page >= totalPages ? 'opacity-30 pointer-events-none' : 'hover:bg-cream-200'
                )}
              >
                <ChevronRight size={16} />
              </Link>
            </div>
          </div>
        )}
      </div>
    </>
  )
}
