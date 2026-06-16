'use client'

import React, { createContext, useContext, useReducer, useEffect, useCallback } from 'react'
import { CartItem, Product } from '@/types'

interface CartState {
  items: CartItem[]
  isOpen: boolean
}

type CartAction =
  | {
      type: 'ADD_ITEM'
      payload: {
        product: Product
        quantity: number
        size: string
        color: { name: string; hex: string }
      }
    }
  | { type: 'REMOVE_ITEM'; payload: { productId: string; size: string; colorName: string } }
  | { type: 'UPDATE_QUANTITY'; payload: { productId: string; size: string; colorName: string; quantity: number } }
  | { type: 'CLEAR_CART' }
  | { type: 'TOGGLE_CART' }
  | { type: 'OPEN_CART' }
  | { type: 'CLOSE_CART' }
  | { type: 'HYDRATE'; payload: CartItem[] }

function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case 'HYDRATE':
      return { ...state, items: action.payload }

    case 'ADD_ITEM': {
      const { product, quantity, size, color } = action.payload

      // Pick the image for this colour variant
      const variant = product.variants?.find(v => v.colorName === color.name)
      const image = variant?.images?.[0] || product.images?.[0] || ''

      const key = `${product.id}__${size}__${color.name}`
      const existingIdx = state.items.findIndex(
        i => `${i.product.id}__${i.size}__${i.colorName}` === key
      )

      if (existingIdx >= 0) {
        const next = [...state.items]
        next[existingIdx] = {
          ...next[existingIdx],
          quantity: next[existingIdx].quantity + quantity,
        }
        return { ...state, items: next, isOpen: true }
      }

      const newItem: CartItem = {
        product,
        quantity,
        size,
        colorName: color.name,
        colorHex: color.hex,
        image,
      }
      return { ...state, items: [...state.items, newItem], isOpen: true }
    }

    case 'REMOVE_ITEM':
      return {
        ...state,
        items: state.items.filter(
          i => !(i.product.id === action.payload.productId &&
                 i.size === action.payload.size &&
                 i.colorName === action.payload.colorName)
        ),
      }

    case 'UPDATE_QUANTITY': {
      const { productId, size, colorName, quantity } = action.payload
      if (quantity <= 0) {
        return {
          ...state,
          items: state.items.filter(
            i => !(i.product.id === productId && i.size === size && i.colorName === colorName)
          ),
        }
      }
      return {
        ...state,
        items: state.items.map(i =>
          i.product.id === productId && i.size === size && i.colorName === colorName
            ? { ...i, quantity }
            : i
        ),
      }
    }

    case 'CLEAR_CART':  return { ...state, items: [] }
    case 'TOGGLE_CART': return { ...state, isOpen: !state.isOpen }
    case 'OPEN_CART':   return { ...state, isOpen: true }
    case 'CLOSE_CART':  return { ...state, isOpen: false }
    default: return state
  }
}

interface CartContextType {
  items: CartItem[]
  isOpen: boolean
  addItem: (product: Product, quantity: number, size: string, color: { name: string; hex: string }) => void
  removeItem: (productId: string, size: string, colorName: string) => void
  updateQuantity: (productId: string, size: string, colorName: string, quantity: number) => void
  clearCart: () => void
  toggleCart: () => void
  openCart: () => void
  closeCart: () => void
  totalItems: number
  subtotal: number
}

const CartContext = createContext<CartContextType | undefined>(undefined)

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(cartReducer, { items: [], isOpen: false })

  useEffect(() => {
    try {
      const saved = localStorage.getItem('loom-cart-v2')
      if (saved) dispatch({ type: 'HYDRATE', payload: JSON.parse(saved) })
    } catch {}
  }, [])

  useEffect(() => {
    localStorage.setItem('loom-cart-v2', JSON.stringify(state.items))
  }, [state.items])

  const addItem = useCallback((
    product: Product,
    quantity: number,
    size: string,
    color: { name: string; hex: string }
  ) => {
    dispatch({ type: 'ADD_ITEM', payload: { product, quantity, size, color } })
  }, [])

  const removeItem = useCallback((productId: string, size: string, colorName: string) => {
    dispatch({ type: 'REMOVE_ITEM', payload: { productId, size, colorName } })
  }, [])

  const updateQuantity = useCallback((productId: string, size: string, colorName: string, quantity: number) => {
    dispatch({ type: 'UPDATE_QUANTITY', payload: { productId, size, colorName, quantity } })
  }, [])

  const clearCart  = useCallback(() => dispatch({ type: 'CLEAR_CART' }), [])
  const toggleCart = useCallback(() => dispatch({ type: 'TOGGLE_CART' }), [])
  const openCart   = useCallback(() => dispatch({ type: 'OPEN_CART' }), [])
  const closeCart  = useCallback(() => dispatch({ type: 'CLOSE_CART' }), [])

  const totalItems = state.items.reduce((s, i) => s + i.quantity, 0)
  const subtotal   = state.items.reduce((s, i) => s + i.product.price * i.quantity, 0)

  return (
    <CartContext.Provider value={{
      items: state.items, isOpen: state.isOpen,
      addItem, removeItem, updateQuantity,
      clearCart, toggleCart, openCart, closeCart,
      totalItems, subtotal,
    }}>
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error('useCart must be used within CartProvider')
  return ctx
}
