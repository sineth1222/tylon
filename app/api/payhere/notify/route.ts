import { NextRequest, NextResponse } from 'next/server'
import crypto from 'crypto'
import { createAdminClient } from '@/lib/supabase/server'

export async function POST(request: NextRequest) {
  const body = await request.formData()
  const merchant_id = body.get('merchant_id') as string
  const order_id = body.get('order_id') as string
  const payhere_amount = body.get('payhere_amount') as string
  const payhere_currency = body.get('payhere_currency') as string
  const status_code = body.get('status_code') as string
  const md5sig = body.get('md5sig') as string

  const merchant_secret = process.env.PAYHERE_MERCHANT_SECRET!
  const secretHash = crypto.createHash('md5').update(merchant_secret).digest('hex').toUpperCase()
  const expected = crypto
    .createHash('md5')
    .update(merchant_id + order_id + payhere_amount + payhere_currency + status_code + secretHash)
    .digest('hex')
    .toUpperCase()

  if (expected !== md5sig) {
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
  }

  const supabase = await createAdminClient()
  if (status_code === '2') {
    await supabase.from('orders').update({ payment_status: 'paid', order_status: 'confirmed' }).eq('id', order_id)
  } else if (status_code === '-1' || status_code === '-2') {
    await supabase.from('orders').update({ payment_status: 'failed' }).eq('id', order_id)
  }

  return NextResponse.json({ status: 'ok' })
}
