'use client'

import Link from 'next/link'
import Image from 'next/image'
import { X, Minus, Plus, ArrowLeft, ShieldCheck, Truck, Tag, Loader2 } from 'lucide-react'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import { useCart } from '@/components/CartProvider'
import { useEffect, useState } from 'react'

export default function CartPage() {
  const { cartItems, removeFromCart, updateQuantity, cartTotal, finalTotal, appliedCoupon, couponLoading, couponError, applyCoupon, removeCoupon } = useCart()
  const [mounted, setMounted] = useState(false)
  const [couponCode, setCouponCode] = useState('')

  // Avoid hydration mismatch by only rendering after mount
  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  return (
    <main className="min-h-screen bg-ivory text-deep-green font-sans flex flex-col" dir="rtl">
      <Navbar />

      <div className="flex-grow pt-32 pb-24 px-6 max-w-7xl mx-auto w-full">
        
        <div className="mb-12">
          <h1 className="text-4xl md:text-5xl font-black text-deep-green mb-3">حقيبة التسوق</h1>
          <p className="text-lg text-deep-green/70">لديك {cartItems.length} عنصر في حقيبتك</p>
        </div>

        {cartItems.length === 0 ? (
          <div className="text-center py-20 bg-white border border-black/5 flex flex-col items-center">
            <p className="text-xl text-deep-green/50 mb-6">حقيبة التسوق فارغة</p>
            <Link href="/products" className="bg-emerald text-ivory px-8 py-3 rounded-none font-bold hover:bg-deep-green transition-colors">
              متابعة التسوق
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16">
            
            {/* Cart Items */}
            <div className="lg:col-span-8 flex flex-col space-y-6">
              {cartItems.map((item) => (
                <div key={item.id} className="flex flex-col sm:flex-row items-start sm:items-center p-6 bg-white border border-black/5 gap-6 group hover:shadow-md transition-shadow">
                  <div className="w-32 h-40 bg-[#F9F7F2] shrink-0 relative flex items-center justify-center p-4 border border-black/5">
                    {item.imageUrl ? (
                      <Image 
                        src={item.imageUrl} 
                        alt={item.name} 
                        fill 
                        className="object-contain mix-blend-multiply group-hover:scale-105 transition-transform duration-500 p-2" 
                        sizes="128px"
                      />
                    ) : (
                      <div className="text-gold/30 text-2xl">✦</div>
                    )}
                  </div>
                  
                  <div className="flex-grow flex flex-col h-full justify-between w-full">
                    <div>
                      <div className="flex justify-between items-start mb-2">
                        <Link href={`/products/${item.slug}`} className="text-xl font-black text-deep-green hover:text-emerald transition-colors">
                          {item.name}
                        </Link>
                        <button onClick={() => removeFromCart(item.id)} aria-label="إزالة" className="text-deep-green/40 hover:text-red-500 transition-colors">
                          <X size={20} strokeWidth={2} />
                        </button>
                      </div>
                      {/* Subtitle/Size could go here if we tracked it in cart, for now omit or use static */}
                    </div>
                    
                    <div className="flex justify-between items-end mt-4 sm:mt-0">
                      <div className="flex items-center border border-black/10 rounded-none h-10 w-28 overflow-hidden bg-ivory">
                        <button onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))} className="w-1/3 h-full flex items-center justify-center text-deep-green hover:bg-black/5">
                          <Minus size={14} />
                        </button>
                        <div className="w-1/3 h-full flex items-center justify-center font-bold text-sm">
                          {item.quantity}
                        </div>
                        <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="w-1/3 h-full flex items-center justify-center text-deep-green hover:bg-black/5">
                          <Plus size={14} />
                        </button>
                      </div>
                      <div className="font-bold text-emerald text-xl">
                        {(item.price * item.quantity).toLocaleString('ar-SA')} ر.س
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-4">
              <div className="bg-white border border-black/5 p-8 sticky top-32 shadow-sm">
                <h2 className="text-2xl font-black text-deep-green mb-6 border-b border-black/5 pb-4">ملخص الطلب</h2>

                {/* Coupon Input */}
                <div className="mb-6">
                  <p className="text-sm font-bold text-deep-green mb-2 flex items-center gap-1.5">
                    <Tag className="w-4 h-4 text-gold" />
                    كوبون خصم
                  </p>
                  {appliedCoupon ? (
                    <div className="flex items-center justify-between bg-emerald/5 border border-emerald/20 rounded-sm px-3 py-2.5">
                      <div>
                        <span className="font-mono font-black text-emerald text-sm">{appliedCoupon.code}</span>
                        <p className="text-xs text-emerald/70 mt-0.5">
                          خصم {appliedCoupon.type === 'PERCENTAGE' ? `${appliedCoupon.value}%` : `${appliedCoupon.value.toLocaleString('ar-SA')} ر.س`}
                        </p>
                      </div>
                      <button onClick={removeCoupon} className="text-red-400 hover:text-red-600 transition-colors">
                        <X size={16} />
                      </button>
                    </div>
                  ) : (
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={couponCode}
                        onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                        placeholder="أدخل كود الخصم"
                        dir="ltr"
                        className="flex-1 border border-black/10 rounded-sm px-3 py-2 text-sm font-mono tracking-wider focus:outline-none focus:border-emerald bg-ivory"
                        onKeyDown={(e) => e.key === 'Enter' && applyCoupon(couponCode)}
                      />
                      <button
                        onClick={() => applyCoupon(couponCode)}
                        disabled={couponLoading || !couponCode.trim()}
                        className="px-4 py-2 bg-deep-green text-ivory text-sm font-bold rounded-sm hover:bg-emerald transition-colors disabled:opacity-50 flex items-center gap-1.5"
                      >
                        {couponLoading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : 'تطبيق'}
                      </button>
                    </div>
                  )}
                  {couponError && (
                    <p className="text-red-500 text-xs mt-1.5">{couponError}</p>
                  )}
                </div>

                <div className="space-y-4 mb-8">
                  <div className="flex justify-between text-deep-green">
                    <span>المجموع الفرعي</span>
                    <span className="font-bold">{cartTotal.toLocaleString('ar-SA')} ر.س</span>
                  </div>
                  {appliedCoupon && (
                    <div className="flex justify-between text-emerald">
                      <span className="flex items-center gap-1">
                        <Tag className="w-3.5 h-3.5" />
                        خصم الكوبون
                      </span>
                      <span className="font-bold">- {appliedCoupon.discountAmount.toLocaleString('ar-SA')} ر.س</span>
                    </div>
                  )}
                  <div className="flex justify-between text-deep-green">
                    <span>الشحن والتوصيل</span>
                    <span className="font-bold text-emerald">مجاني</span>
                  </div>
                </div>

                <div className="border-t border-black/5 pt-6 mb-8 flex justify-between items-end">
                  <span className="text-lg font-bold text-deep-green">الإجمالي</span>
                  <div className="text-right">
                    {appliedCoupon && (
                      <p className="text-deep-green/40 text-sm line-through">{cartTotal.toLocaleString('ar-SA')} ر.س</p>
                    )}
                    <span className="text-3xl font-black text-emerald">{finalTotal.toLocaleString('ar-SA')} ر.س</span>
                  </div>
                </div>

                <Link href="/checkout" className="w-full bg-gold text-deep-green border border-black font-bold py-4 rounded-none hover:bg-[#c9a756] transition-colors duration-300 flex items-center justify-center gap-2 group">
                  <span>إتمام الطلب</span>
                  <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                </Link>

                <div className="mt-8 space-y-4 pt-6 border-t border-black/5">
                  <div className="flex items-center gap-3 text-deep-green/60 text-sm">
                    <Truck size={18} className="text-gold" />
                    <span>شحن مجاني للطلبات فوق 500 ر.س</span>
                  </div>
                  <div className="flex items-center gap-3 text-deep-green/60 text-sm">
                    <ShieldCheck size={18} className="text-gold" />
                    <span>دفع آمن ومشفر 100%</span>
                  </div>
                </div>
              </div>
            </div>

          </div>
        )}
      </div>

      <Footer />
    </main>
  )
}
