import { NextRequest, NextResponse } from 'next/server'
import crypto from 'crypto'

export async function POST(request: NextRequest) {
  try {
    const { merchant_id, order_id, amount, currency } = await request.json()
    const merchant_secret = process.env.PAYHERE_MERCHANT_SECRET!
    const secretHash = crypto.createHash('md5').update(merchant_secret).digest('hex').toUpperCase()
    const hash = crypto
      .createHash('md5')
      .update(merchant_id + order_id + amount + currency + secretHash)
      .digest('hex')
      .toUpperCase()
    return NextResponse.json({ hash })
  } catch {
    return NextResponse.json({ error: 'Hash generation failed' }, { status: 500 })
  }
}
