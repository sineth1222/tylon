import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import ProductForm from '../ProductForm'

export const metadata = { title: 'New Product — LOOM Admin' }

export default function NewProductPage() {
  return (
    <div className="max-w-4xl">
      <div className="flex items-center gap-4 mb-8">
        <Link href="/admin/products" className="flex items-center gap-2 text-sm text-stone-400 hover:text-stone-700">
          <ArrowLeft size={16} /> Products
        </Link>
        <span className="text-stone-300">/</span>
        <span className="text-sm text-stone-600">New Product</span>
      </div>

      <h1 className="font-display text-4xl font-semibold text-stone-800 mb-8">Add New Product</h1>
      <ProductForm />
    </div>
  )
}
