'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { ArrowRight, CheckCircle2 } from 'lucide-react'
import { useCart } from '@/components/CartProvider'
import { useCheckout } from '@/components/CheckoutProvider'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import { createOrder } from '../actions'

export default function ReviewPage() {
  const { cartItems, cartTotal, clearCart } = useCart()
  const { checkoutData } = useCheckout()
  const router = useRouter()
  const [mounted, setMounted] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    setMounted(true)
    if (!checkoutData.fullName) {
      router.push('/checkout')
    }
  }, [checkoutData, router])

  if (!mounted || cartItems.length === 0) return null

  const handleConfirmOrder = async () => {
    setIsSubmitting(true)
    setError('')
    
    const result = await createOrder(checkoutData, cartItems, cartTotal)
    
    if (result.success && result.orderId) {
      clearCart()
      if (['bank_transfer', 'digital_wallet'].includes(checkoutData.paymentMethod)) {
        router.push(`/checkout/payment/${result.orderId}`)
      } else {
        router.push(`/checkout/success/${result.orderId}`)
      }
    } else {
      setError(result.error || 'حدث خطأ ما')
      setIsSubmitting(false)
    }
  }

  return (
    <main className="min-h-screen bg-ivory text-deep-green font-sans flex flex-col" dir="rtl">
      <Navbar />

      <div className="flex-grow pt-32 pb-24 px-6 max-w-7xl mx-auto w-full">
        <div className="mb-8">
          <Link href="/checkout" className="inline-flex items-center text-deep-green/60 hover:text-emerald transition-colors font-bold gap-2">
            <ArrowRight size={16} />
            العودة إلى بيانات الشحن
          </Link>
        </div>

        <h1 className="text-4xl md:text-5xl font-black text-deep-green mb-10">مراجعة الطلب</h1>

        {error && (
          <div className="bg-red-50 text-red-600 p-4 rounded-md mb-8 border border-red-200 font-bold">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          {/* Shipping Info */}
          <div className="bg-white p-8 border border-black/5 shadow-sm space-y-8">
            <div>
              <h2 className="text-2xl font-bold text-deep-green mb-4 flex items-center gap-2">
                <CheckCircle2 className="text-emerald" />
                بيانات الشحن
              </h2>
              <div className="space-y-3 text-deep-green/80 bg-[#F9F7F2] p-6 rounded-md">
                <p><span className="font-bold">الاسم:</span> {checkoutData.fullName}</p>
                <p><span className="font-bold">الجوال:</span> {checkoutData.phone}</p>
                <p><span className="font-bold">العنوان:</span> {checkoutData.governorate} - {checkoutData.city}، {checkoutData.address}</p>
              </div>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-deep-green mb-4 flex items-center gap-2">
                <CheckCircle2 className="text-emerald" />
                طريقة الدفع
              </h2>
              <div className="bg-[#F9F7F2] p-6 rounded-md text-deep-green/80">
                <p className="font-bold">
                  {checkoutData.paymentMethod === 'bank_transfer' ? 'إيداع بنكي' : 
                   checkoutData.paymentMethod === 'cod' ? 'الدفع عند الاستلام' : 'محفظة إلكترونية'}
                </p>
                {checkoutData.paymentMethod === 'bank_transfer' && (
                  <p className="text-sm mt-2 text-deep-green/60">سيتطلب منك إرفاق إيصال التحويل في الخطوة القادمة.</p>
                )}
              </div>
            </div>
          </div>

          {/* Order Items */}
          <div className="bg-white p-8 border border-black/5 shadow-sm">
            <h2 className="text-2xl font-bold text-deep-green mb-6">المنتجات</h2>
            <div className="space-y-4 mb-8">
              {cartItems.map(item => (
                <div key={item.id} className="flex items-center gap-4 bg-[#F9F7F2] p-4 rounded-md border border-black/5">
                  <div className="w-16 h-16 bg-white shrink-0 border border-black/5 flex items-center justify-center p-2 relative">
                    {item.imageUrl ? (
                      <Image src={item.imageUrl} alt={item.name} fill className="object-contain mix-blend-multiply" />
                    ) : (
                      <span className="text-gold">✦</span>
                    )}
                  </div>
                  <div className="flex-grow">
                    <h4 className="font-bold text-deep-green">{item.name}</h4>
                    <p className="text-sm text-deep-green/60">الكمية: {item.quantity}</p>
                  </div>
                  <div className="font-bold text-emerald">
                    {(item.price * item.quantity).toLocaleString('ar-SA')} ر.س
                  </div>
                </div>
              ))}
            </div>

            <div className="border-t border-black/5 pt-6 space-y-4 mb-8">
              <div className="flex justify-between text-deep-green text-sm">
                <span>المجموع الفرعي</span>
                <span className="font-bold">{cartTotal.toLocaleString('ar-SA')} ر.س</span>
              </div>
              <div className="flex justify-between text-deep-green text-sm">
                <span>رسوم التوصيل</span>
                <span className="font-bold text-emerald">
                  {checkoutData.shippingFee === 0 ? 'مجاني' : `${checkoutData.shippingFee.toLocaleString('ar-SA')} ر.س`}
                </span>
              </div>
              
              <div className="flex justify-between font-black text-xl text-deep-green pt-4 border-t border-black/5 mt-4">
                <span>المجموع الإجمالي</span>
                <span className="text-emerald">{(cartTotal + (checkoutData.shippingFee || 0)).toLocaleString('ar-SA')} ر.س</span>
              </div>
            </div>

            <button 
              onClick={handleConfirmOrder}
              disabled={isSubmitting}
              className="w-full bg-gold text-deep-green border border-black px-12 py-5 rounded-none font-bold hover:bg-[#c9a756] transition-colors duration-300 flex items-center justify-center gap-3 text-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'جاري الاعتماد...' : 'اعتماد الطلب'}
            </button>
          </div>
        </div>
      </div>
      
      <Footer />
    </main>
  )
}
