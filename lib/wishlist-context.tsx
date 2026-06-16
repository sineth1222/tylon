'use client'

import { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { addToWishlist, removeFromWishlist, getWishlist } from '@/lib/actions/wishlist'
import toast from 'react-hot-toast'

interface WishlistContextType {
  wishlistIds: Set<string>
  loading: boolean
  toggle: (productId: string) => Promise<void>
  isWishlisted: (productId: string) => boolean
}

const WishlistContext = createContext<WishlistContextType>({
  wishlistIds: new Set(),
  loading: false,
  toggle: async () => {},
  isWishlisted: () => false,
})

export function WishlistProvider({
  children,
  userId,
  initialIds = [],
}: {
  children: React.ReactNode
  userId: string | null
  initialIds?: string[]
}) {
  const [wishlistIds, setWishlistIds] = useState<Set<string>>(new Set(initialIds))
  const [loading, setLoading] = useState(false)

  // Sync from DB on mount if user is logged in
  useEffect(() => {
    if (!userId) return
    getWishlist(userId).then(items => {
      setWishlistIds(new Set(items.map((i: any) => i.product_id)))
    })
  }, [userId])

  const toggle = useCallback(async (productId: string) => {
    if (!userId) {
      window.dispatchEvent(new CustomEvent('open-auth-modal'))
      return
    }

    const wasWishlisted = wishlistIds.has(productId)

    // Optimistic update
    setWishlistIds(prev => {
      const next = new Set(prev)
      if (wasWishlisted) next.delete(productId)
      else next.add(productId)
      return next
    })

    try {
      if (wasWishlisted) {
        const res = await removeFromWishlist(userId, productId)
        if (res.error) throw new Error(res.error)
        toast.success('Removed from wishlist')
      } else {
        const res = await addToWishlist(userId, productId)
        if (res.error) throw new Error(res.error)
        toast.success('Added to wishlist')
      }
    } catch (err: any) {
      // Revert on error
      setWishlistIds(prev => {
        const next = new Set(prev)
        if (wasWishlisted) next.add(productId)
        else next.delete(productId)
        return next
      })
      toast.error(err.message || 'Something went wrong')
    }
  }, [userId, wishlistIds])

  const isWishlisted = useCallback((productId: string) => {
    return wishlistIds.has(productId)
  }, [wishlistIds])

  return (
    <WishlistContext.Provider value={{ wishlistIds, loading, toggle, isWishlisted }}>
      {children}
    </WishlistContext.Provider>
  )
}

export function useWishlist() {
  return useContext(WishlistContext)
}
