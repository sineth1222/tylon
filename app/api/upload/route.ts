import { NextRequest, NextResponse } from 'next/server'
import ImageKit from 'imagekit'
import { getUser } from '@/lib/actions/auth'

const imagekit = new ImageKit({
  publicKey: process.env.IMAGEKIT_PUBLIC_KEY!,
  privateKey: process.env.IMAGEKIT_PRIVATE_KEY!,
  urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT!,
})

export async function POST(request: NextRequest) {
  const user = await getUser()
  if (!user || user.role !== 'admin') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const formData = await request.formData()
    const file = formData.get('file') as File | null
    const folder = (formData.get('folder') as string) || '/loom/products'

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 })
    }

    const allowed = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/avif']
    if (!allowed.includes(file.type)) {
      return NextResponse.json({ error: 'JPG, PNG, WebP or AVIF only' }, { status: 400 })
    }

    if (file.size > 8 * 1024 * 1024) {
      return NextResponse.json({ error: 'Max file size is 8 MB' }, { status: 400 })
    }

    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    const ext = file.name.split('.').pop()?.toLowerCase() || 'jpg'
    const stem = file.name
      .replace(/\.[^/.]+$/, '')
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .slice(0, 48)
    const fileName = `${stem}-${Date.now()}.${ext}`

    const res = await imagekit.upload({
      file: buffer,
      fileName,
      folder,
      useUniqueFileName: false,
      tags: ['loom', 'product'],
    })

    return NextResponse.json({
      success: true,
      url: res.url,
      fileId: res.fileId,
      name: res.name,
      thumbnailUrl: res.thumbnailUrl,
      width: res.width,
      height: res.height,
    })
  } catch (err: any) {
    console.error('ImageKit upload error:', err)
    return NextResponse.json({ error: err?.message || 'Upload failed' }, { status: 500 })
  }
}

export async function GET() {
  const user = await getUser()
  if (!user || user.role !== 'admin') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  const auth = imagekit.getAuthenticationParameters()
  return NextResponse.json(auth)
}
