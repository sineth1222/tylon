'use client'

import { useState } from 'react'
import { Loader2, CreditCard } from 'lucide-react'
import { formatPrice } from '@/lib/utils'
import toast from 'react-hot-toast'

interface PayHereButtonProps {
  orderId: string
  amount: number
  customerName: string
  customerEmail: string
  customerPhone: string
  address: string
  city: string
  onSuccess: () => void
  onDismiss: () => void
}

declare global {
  interface Window {
    payhere: {
      startPayment: (payment: object) => void
      onCompleted: (orderId: string) => void
      onDismissed: () => void
      onError: (error: string) => void
    }
  }
}

export default function PayHereButton({
  orderId, amount, customerName, customerEmail,
  customerPhone, address, city,
  onSuccess, onDismiss,
}: PayHereButtonProps) {
  const [loading, setLoading] = useState(false)

  const handlePayment = async () => {
    setLoading(true)
    try {
      const merchantId = process.env.NEXT_PUBLIC_PAYHERE_MERCHANT_ID!
      const amountFormatted = amount.toFixed(2)
      const currency = 'LKR'
      const sandbox = process.env.NEXT_PUBLIC_PAYHERE_SANDBOX === 'true'

      const res = await fetch('/api/payhere/hash', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ merchant_id: merchantId, order_id: orderId, amount: amountFormatted, currency }),
      })
      const { hash } = await res.json()

      if (!document.getElementById('payhere-script')) {
        await new Promise<void>((resolve, reject) => {
          const script = document.createElement('script')
          script.id = 'payhere-script'
          script.src = sandbox
            ? 'https://sandbox.payhere.lk/pay/js/payhere.js'
            : 'https://www.payhere.lk/pay/js/payhere.js'
          script.onload = () => resolve()
          script.onerror = () => reject(new Error('PayHere load failed'))
          document.head.appendChild(script)
        })
      }

      window.payhere.onCompleted = () => { toast.success('Payment successful!'); onSuccess() }
      window.payhere.onDismissed = () => { toast.error('Payment cancelled.'); onDismiss(); setLoading(false) }
      window.payhere.onError = (error: string) => { toast.error('Payment failed: ' + error); setLoading(false) }

      const [firstName, ...rest] = (customerName || 'Customer').split(' ')
      window.payhere.startPayment({
        sandbox,
        merchant_id: merchantId,
        return_url: `${window.location.origin}/orders/${orderId}?success=true`,
        cancel_url: `${window.location.origin}/checkout`,
        notify_url: `${window.location.origin}/api/payhere/notify`,
        order_id: orderId,
        items: 'TYLON Luxury Clothing Order',
        amount: amountFormatted,
        currency,
        hash,
        first_name: firstName,
        last_name: rest.join(' ') || '-',
        email: customerEmail,
        phone: customerPhone,
        address,
        city,
        country: 'Sri Lanka',
      })
    } catch {
      toast.error('Payment initialization failed.')
      setLoading(false)
    }
  }

  return (
    <button type="button" onClick={handlePayment} disabled={loading}
      className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white py-4 rounded-xl text-xs font-bold tracking-[0.15em] uppercase transition-colors disabled:opacity-50">
      {loading ? <Loader2 size={15} className="animate-spin" /> : <CreditCard size={15} />}
      {loading ? 'Opening Payment…' : `Pay Online · ${formatPrice(amount)}`}
    </button>
  )
}
