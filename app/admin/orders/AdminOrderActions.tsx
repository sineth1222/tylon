'use client'

import { useState, useTransition } from 'react'
import { Loader2, ChevronDown } from 'lucide-react'
import { updateOrderStatus } from '@/lib/actions/orders'
import { OrderStatus } from '@/types'
import { cn } from '@/lib/utils'
import toast from 'react-hot-toast'

const STATUS_OPTIONS: { value: OrderStatus; label: string }[] = [
  { value: 'pending', label: 'Pending' },
  { value: 'confirmed', label: 'Confirmed' },
  { value: 'processing', label: 'Processing' },
  { value: 'shipped', label: 'Shipped' },
  { value: 'delivered', label: 'Delivered' },
  { value: 'cancelled', label: 'Cancelled' },
]

export default function AdminOrderActions({ order }: { order: any }) {
  const [status, setStatus] = useState<OrderStatus>(order.order_status)
  const [note, setNote] = useState('')
  const [trackingNumber, setTrackingNumber] = useState(order.tracking_number || '')
  const [isPending, startTransition] = useTransition()

  const handleUpdate = () => {
    startTransition(async () => {
      const result = await updateOrderStatus(order.id, status, note || undefined, trackingNumber || undefined)
      if (result.error) {
        toast.error(result.error)
      } else {
        toast.success('Order status updated!')
        setNote('')
      }
    })
  }

  return (
    <div className="bg-cream-50 border border-cream-200 rounded-2xl p-5">
      <h2 className="text-xs font-semibold tracking-[0.2em] uppercase text-stone-500 mb-4">Update Status</h2>

      <div className="space-y-3">
        {/* Status select */}
        <div className="relative">
          <select
            value={status}
            onChange={e => setStatus(e.target.value as OrderStatus)}
            className="input-zora appearance-none pr-10 text-sm"
          >
            {STATUS_OPTIONS.map(opt => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
          <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 pointer-events-none" />
        </div>

        {/* Tracking number */}
        {(status === 'shipped' || status === 'delivered') && (
          <input
            value={trackingNumber}
            onChange={e => setTrackingNumber(e.target.value)}
            placeholder="Tracking number (optional)"
            className="input-zora text-sm"
          />
        )}

        {/* Note */}
        <textarea
          value={note}
          onChange={e => setNote(e.target.value)}
          placeholder="Add a note (optional)..."
          rows={2}
          className="input-zora text-sm resize-none"
        />

        <button
          onClick={handleUpdate}
          disabled={isPending}
          className="w-full bg-stone-700 text-cream-100 py-3 rounded-xl text-xs font-semibold tracking-[0.15em] uppercase hover:bg-stone-600 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
        >
          {isPending && <Loader2 size={13} className="animate-spin" />}
          Update Order
        </button>

        <p className="text-[10px] text-stone-400 text-center">
          Customer will be notified by email
        </p>
      </div>
    </div>
  )
}
