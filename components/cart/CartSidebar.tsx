'use client'

import { X, ShoppingBag, Minus, Plus } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { useCart } from '@/lib/cart-context'
import { formatPrice } from '@/lib/utils'

const SHIPPING_FEE = parseInt(process.env.NEXT_PUBLIC_SHIPPING_FEE || '250')

export default function CartSidebar() {
  const { items, isOpen, closeCart, removeItem, updateQuantity, subtotal, totalItems } = useCart()
  const total = subtotal + SHIPPING_FEE

  if (!isOpen) return null

  return (
    <>
      <div className="fixed inset-0 bg-tylon-bg/70 cart-overlay z-40" onClick={closeCart} />
      <div className="fixed right-0 top-0 bottom-0 w-full max-w-md bg-tylon-secondary z-50 flex flex-col shadow-2xl animate-slide-in-right border-l border-tylon-border">

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-tylon-border">
          <div>
            <h2 className="font-display text-2xl font-bold tracking-[0.1em] text-tylon-primary uppercase">YOUR BAG</h2>
            <p className="font-mono text-[10px] text-tylon-muted mt-0.5 tracking-widest">{totalItems} {totalItems === 1 ? 'PIECE' : 'PIECES'}</p>
          </div>
          <button onClick={closeCart}
            className="w-9 h-9 border border-tylon-border flex items-center justify-center text-tylon-muted hover:border-army hover:text-tylon-primary transition-all">
            <X size={15} />
          </button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto py-4">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full gap-5 px-6">
              <div className="w-16 h-16 border border-tylon-border flex items-center justify-center">
                <ShoppingBag size={24} className="text-tylon-muted" />
              </div>
              <div className="text-center">
                <p className="font-display text-xl tracking-[0.1em] text-tylon-muted uppercase">Bag is empty</p>
                <p className="font-mono text-[10px] text-tylon-muted/60 mt-2 tracking-widest">YOUR ARSENAL AWAITS</p>
              </div>
              <button onClick={closeCart}
                className="mt-2 bg-army text-tylon-primary px-8 py-3 font-display text-sm tracking-[0.2em] uppercase hover:bg-army-light transition-colors">
                ENTER COLLECTION
              </button>
            </div>
          ) : (
            <div className="px-4 space-y-3">
              {items.map((item, idx) => (
                <div key={`${item.product.id}-${item.size}-${item.colorName}-${idx}`}
                  className="bg-tylon-card border border-tylon-border p-4">
                  <div className="flex gap-3">
                    <div className="relative w-20 h-24 overflow-hidden bg-tylon-secondary shrink-0 border border-tylon-border">
                      {item.image ? (
                        <Image src={item.image} alt={item.product.name} fill className="object-cover" sizes="80px" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <span className="font-display text-tylon-muted text-xs tracking-widest">TYLON</span>
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <h4 className="font-display text-sm tracking-[0.05em] text-tylon-primary leading-tight line-clamp-2 uppercase">{item.product.name}</h4>
                        <button onClick={() => removeItem(item.product.id, item.size, item.colorName)}
                          className="text-tylon-muted hover:text-danger transition-colors shrink-0">
                          <X size={12} />
                        </button>
                      </div>
                      <div className="flex items-center gap-1.5 mt-1.5">
                        <div className="w-3 h-3 border border-tylon-border shrink-0" style={{ backgroundColor: item.colorHex }} />
                        <span className="font-mono text-[9px] text-tylon-muted tracking-widest">{item.colorName?.toUpperCase()}</span>
                        <span className="text-tylon-border text-[10px]">·</span>
                        <span className="font-mono text-[9px] text-tylon-muted tracking-widest">SIZE {item.size}</span>
                      </div>
                      <div className="flex items-center justify-between mt-3">
                        <div className="flex items-center gap-0 border border-tylon-border">
                          <button
                            onClick={() => updateQuantity(item.product.id, item.size, item.colorName, item.quantity - 1)}
                            className="w-7 h-7 flex items-center justify-center text-tylon-muted hover:bg-tylon-bg transition-colors border-r border-tylon-border">
                            <Minus size={10} />
                          </button>
                          <span className="font-mono text-xs font-bold w-7 text-center text-tylon-primary">{item.quantity}</span>
                          <button
                            onClick={() => updateQuantity(item.product.id, item.size, item.colorName, item.quantity + 1)}
                            className="w-7 h-7 flex items-center justify-center text-tylon-muted hover:bg-tylon-bg transition-colors border-l border-tylon-border">
                            <Plus size={10} />
                          </button>
                        </div>
                        <span className="font-display text-sm font-bold text-tylon-primary tracking-wider">
                          {formatPrice(item.product.price * item.quantity)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="border-t border-tylon-border px-6 py-6 space-y-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between font-mono text-[11px] tracking-widest">
                <span className="text-tylon-muted">SUBTOTAL</span>
                <span className="text-tylon-primary">{formatPrice(subtotal)}</span>
              </div>
              <div className="flex items-center justify-between font-mono text-[11px] tracking-widest">
                <span className="text-tylon-muted">SHIPPING (COD)</span>
                <span className="text-army-light">{formatPrice(SHIPPING_FEE)}</span>
              </div>
              <div className="h-px bg-tylon-border my-2" />
              <div className="flex items-center justify-between">
                <span className="font-mono text-[11px] tracking-widest text-tylon-muted">TOTAL</span>
                <span className="font-display text-xl font-bold text-tylon-primary tracking-wider">{formatPrice(total)}</span>
              </div>
            </div>
            <Link
              href="/checkout"
              onClick={closeCart}
              className="block w-full bg-army text-tylon-primary py-4 font-display text-sm tracking-[0.2em] uppercase text-center hover:bg-army-light transition-colors"
            >
              PROCEED TO CHECKOUT
            </Link>
            <button
              onClick={closeCart}
              className="block w-full border border-tylon-border text-tylon-muted py-3 font-mono text-[10px] tracking-[0.2em] uppercase text-center hover:border-army hover:text-tylon-primary transition-all"
            >
              CONTINUE BROWSING
            </button>
          </div>
        )}
      </div>
    </>
  )
}
