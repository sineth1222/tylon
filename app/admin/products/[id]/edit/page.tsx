import { notFound } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { getProductById } from '@/lib/actions/products'
import ProductForm from '../../ProductForm'

interface EditProductPageProps {
  params: Promise<{ id: string }>
}

export const metadata = { title: 'Edit Product — LOOM Admin' }

export default async function EditProductPage({ params }: EditProductPageProps) {
  const { id } = await params
  const product = await getProductById(id)
  if (!product) notFound()

  return (
    <div className="max-w-4xl">
      <div className="flex items-center gap-4 mb-8">
        <Link href="/admin/products" className="flex items-center gap-2 text-sm text-stone-400 hover:text-stone-700">
          <ArrowLeft size={16} /> Products
        </Link>
        <span className="text-stone-300">/</span>
        <span className="text-sm text-stone-600">Edit</span>
      </div>
      <h1 className="font-display text-4xl font-semibold text-stone-800 mb-2">Edit Product</h1>
      <p className="text-stone-400 text-sm mb-8">{product.name}</p>
      <ProductForm product={product} />
    </div>
  )
}
