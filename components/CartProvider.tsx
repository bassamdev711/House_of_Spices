'use client'

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'

export interface CartItem {
  id: string // Product ID
  name: string
  slug: string
  price: number
  imageUrl: string
  quantity: number
}

export interface AppliedCoupon {
  code: string
  type: 'PERCENTAGE' | 'FIXED'
  value: number
  discountAmount: number
}

interface CartContextType {
  cartItems: CartItem[]
  addToCart: (item: CartItem) => void
  removeFromCart: (id: string) => void
  updateQuantity: (id: string, quantity: number) => void
  clearCart: () => void
  cartTotal: number
  cartCount: number
  // كوبون الخصم
  appliedCoupon: AppliedCoupon | null
  couponLoading: boolean
  couponError: string | null
  applyCoupon: (code: string) => Promise<void>
  removeCoupon: () => void
  finalTotal: number  // cartTotal بعد تطبيق الخصم
}

const CartContext = createContext<CartContextType | undefined>(undefined)

export function CartProvider({ children }: { children: ReactNode }) {
  const [cartItems, setCartItems] = useState<CartItem[]>([])
  const [isLoaded, setIsLoaded] = useState(false)
  const [appliedCoupon, setAppliedCoupon] = useState<AppliedCoupon | null>(null)
  const [couponLoading, setCouponLoading] = useState(false)
  const [couponError, setCouponError] = useState<string | null>(null)

  // Load from local storage
  useEffect(() => {
    try {
      const stored = localStorage.getItem('tif_cart')
      if (stored) setCartItems(JSON.parse(stored))
      const storedCoupon = localStorage.getItem('tif_coupon')
      if (storedCoupon) setAppliedCoupon(JSON.parse(storedCoupon))
    } catch (error) {
      console.error('Failed to parse cart from local storage', error)
    }
    setIsLoaded(true)
  }, [])

  // Save to local storage
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem('tif_cart', JSON.stringify(cartItems))
    }
  }, [cartItems, isLoaded])

  useEffect(() => {
    if (isLoaded) {
      if (appliedCoupon) {
        localStorage.setItem('tif_coupon', JSON.stringify(appliedCoupon))
      } else {
        localStorage.removeItem('tif_coupon')
      }
    }
  }, [appliedCoupon, isLoaded])

  const addToCart = (item: CartItem) => {
    setCartItems(prev => {
      const existing = prev.find(i => i.id === item.id)
      if (existing) {
        return prev.map(i => i.id === item.id ? { ...i, quantity: i.quantity + item.quantity } : i)
      }
      return [...prev, item]
    })
  }

  const removeFromCart = (id: string) => {
    setCartItems(prev => prev.filter(i => i.id !== id))
  }

  const updateQuantity = (id: string, quantity: number) => {
    if (quantity < 1) return
    setCartItems(prev => prev.map(i => i.id === id ? { ...i, quantity } : i))
  }

  const clearCart = () => {
    setCartItems([])
    setAppliedCoupon(null)
  }

  const cartTotal = cartItems.reduce((total, item) => total + (item.price * item.quantity), 0)
  const cartCount = cartItems.reduce((count, item) => count + item.quantity, 0)

  // تطبيق الكوبون
  const applyCoupon = async (code: string) => {
    if (!code.trim()) return
    setCouponLoading(true)
    setCouponError(null)
    try {
      const res = await fetch('/api/coupons/validate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code, orderTotal: cartTotal }),
      })
      const data = await res.json()
      if (data.valid) {
        setAppliedCoupon(data.coupon)
        setCouponError(null)
      } else {
        setCouponError(data.error || 'كوبون غير صالح')
        setAppliedCoupon(null)
      }
    } catch {
      setCouponError('حدث خطأ أثناء التحقق من الكوبون')
    } finally {
      setCouponLoading(false)
    }
  }

  const removeCoupon = () => {
    setAppliedCoupon(null)
    setCouponError(null)
  }

  const finalTotal = appliedCoupon
    ? Math.max(0, cartTotal - appliedCoupon.discountAmount)
    : cartTotal

  return (
    <CartContext.Provider value={{
      cartItems,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
      cartTotal,
      cartCount,
      appliedCoupon,
      couponLoading,
      couponError,
      applyCoupon,
      removeCoupon,
      finalTotal,
    }}>
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const context = useContext(CartContext)
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider')
  }
  return context
}
