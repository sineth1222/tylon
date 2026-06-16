'use client'

import { Heart } from 'lucide-react'
import Link from 'next/link'
import ProductCard from '@/components/products/ProductCard'

interface WishlistClientProps {
  items: any[]
  userId: string
}

export default function WishlistClient({ items }: WishlistClientProps) {
  return (
    <div className="max-w-6xl mx-auto">
      <div className="py-12 border-b border-tylon-border mb-10">
        <p className="font-mono text-[10px] tracking-[0.5em] text-army uppercase mb-3">— SAVED</p>
        <h1 className="font-display text-5xl md:text-6xl font-bold tracking-[0.05em] text-tylon-primary uppercase">WISHLIST</h1>
        <p className="font-mono text-[11px] text-tylon-muted mt-2 tracking-widest">
          {items.length} SAVED PIECE{items.length !== 1 ? 'S' : ''}
        </p>
      </div>

      {items.length === 0 ? (
        <div className="text-center py-20">
          <Heart size={36} className="text-tylon-muted/30 mx-auto mb-4" />
          <p className="font-display text-2xl text-tylon-muted uppercase tracking-[0.1em]">WISHLIST EMPTY</p>
          <Link
            href="/collections"
            className="inline-block mt-6 border border-army text-tylon-primary px-8 py-3 font-display text-sm tracking-[0.15em] uppercase hover:bg-army transition-colors"
          >
            EXPLORE COLLECTION
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-5">
          {items.map(item =>
            item.product ? (
              <ProductCard key={item.id} product={item.product} />
            ) : null
          )}
        </div>
      )}
    </div>
  )
}
