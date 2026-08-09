'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowLeft, ArrowRight, Minus, Plus, Trash2, CheckCircle2 } from 'lucide-react'
import { useCart } from '@/components/CartProvider'
import { useCheckout } from '@/components/CheckoutProvider'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import { getPaymentMethods } from './actions'
import { createOrder } from './actions'

export default function CheckoutPage() {
  const { cartItems, cartTotal, updateQuantity, removeFromCart, clearCart, appliedCoupon } = useCart()
  const { checkoutData, setCheckoutData } = useCheckout()
  const router = useRouter()
  const [mounted, setMounted] = useState(false)
  const [paymentSettings, setPaymentSettings] = useState<any>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState('')

  const [formData, setFormData] = useState(checkoutData)

  useEffect(() => {
    setMounted(true)
    getPaymentMethods().then(data => {
      setPaymentSettings(data)
      
      // Default payment method selection
      if (data?.settings) {
        if (!data.settings.bankTransferEnabled && formData.paymentMethod === 'bank_transfer') {
           setFormData(prev => ({...prev, paymentMethod: data.settings?.codEnabled ? 'cod' : 'wallets'}))
        }
      }
    })
  }, [])

  if (!mounted || !paymentSettings) return null

  if (cartItems.length === 0) {
    return (
      <main className="min-h-screen bg-ivory text-deep-green flex flex-col items-center justify-center p-6" dir="rtl">
        <h1 className="text-3xl font-black mb-4">السلة فارغة</h1>
        <p className="mb-8">قم بإضافة منتجات للسلة أولاً للمتابعة للدفع.</p>
        <Link href="/products" className="bg-emerald text-ivory px-8 py-3 rounded-none font-bold hover:bg-deep-green transition-colors">
          تصفح العطور
        </Link>
      </main>
    )
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const storeSettings = paymentSettings.storeSettings;
  const isFreeShipping = storeSettings.freeShippingThreshold > 0 && cartTotal >= storeSettings.freeShippingThreshold;
  let shippingFee = isFreeShipping ? 0 : storeSettings.shippingFee;
  
  // COD Fee logic
  let codFee = 0;
  if (formData.paymentMethod === 'cod' && paymentSettings.settings?.codFee > 0) {
    codFee = Number(paymentSettings.settings.codFee);
    shippingFee += codFee;
  }

  const finalTotal = Math.max(0, cartTotal - (appliedCoupon?.discountAmount || 0)) + shippingFee;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError('')
    
    setCheckoutData({ ...formData, shippingFee })
    
    const result = await createOrder(
      { ...formData, shippingFee }, 
      cartItems, 
      cartTotal,
      appliedCoupon?.code
    )
    
    if (result.success && result.orderId) {
      clearCart()
      if (['bank_transfer', 'wallets'].includes(formData.paymentMethod)) {
        router.push(`/checkout/payment/${result.orderId}`)
      } else {
        router.push(`/checkout/success/${result.orderId}`)
      }
    } else {
      setError(result.error || 'حدث خطأ ما أثناء إنشاء الطلب')
      setIsSubmitting(false)
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }

  return (
    <main className="min-h-screen bg-ivory text-deep-green font-sans flex flex-col" dir="rtl">
      <Navbar />

      <div className="flex-grow pt-32 pb-24 px-6 max-w-7xl mx-auto w-full">
        <div className="mb-8">
          <Link href="/cart" className="inline-flex items-center text-deep-green/60 hover:text-emerald transition-colors font-bold gap-2">
            <ArrowRight size={16} />
            العودة إلى السلة
          </Link>
        </div>
        
        <h1 className="text-4xl md:text-5xl font-black text-deep-green mb-10">إتمام الطلب</h1>
        
        {error && (
          <div className="bg-red-50 text-red-600 p-4 rounded-md mb-8 border border-red-200 font-bold flex items-center gap-2">
            <span className="shrink-0 text-xl">⚠️</span> {error}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 md:gap-16">
          
          {/* Right Column: Form */}
          <div className="md:col-span-7 order-2 md:order-1">
            <form onSubmit={handleSubmit} className="space-y-12">
              {/* Shipping Details */}
              <section>
                <h2 className="text-2xl font-bold text-deep-green mb-8 flex items-center gap-2">
                  <span className="w-8 h-8 rounded-full bg-emerald text-white flex items-center justify-center text-sm">1</span>
                  تفاصيل الشحن
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-8">
                  <div className="flex flex-col">
                    <label className="text-sm font-bold text-deep-green/70 mb-2">الاسم الكامل</label>
                    <input 
                      type="text" 
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleChange}
                      required
                      placeholder="أدخل اسمك الكامل"
                      className="bg-transparent border-b border-black/20 pb-3 outline-none focus:border-emerald transition-colors"
                    />
                  </div>
                  
                  <div className="flex flex-col">
                    <label className="text-sm font-bold text-deep-green/70 mb-2">رقم الهاتف</label>
                    <input 
                      type="tel" 
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      required
                      dir="ltr"
                      placeholder="05XXXXXXXX"
                      className="bg-transparent border-b border-black/20 pb-3 outline-none focus:border-emerald transition-colors text-right"
                    />
                  </div>

                  <div className="flex flex-col">
                    <label className="text-sm font-bold text-deep-green/70 mb-2">المحافظة</label>
                    <select 
                      name="governorate"
                      value={formData.governorate}
                      onChange={handleChange}
                      required
                      className="bg-transparent border-b border-black/20 pb-3 outline-none focus:border-emerald transition-colors appearance-none"
                    >
                      <option value="" disabled>اختر المحافظة</option>
                      <option value="Riyadh">الرياض</option>
                      <option value="Makkah">مكة المكرمة</option>
                      <option value="Eastern">المنطقة الشرقية</option>
                      <option value="Madinah">المدينة المنورة</option>
                      <option value="Qassim">القصيم</option>
                      <option value="Asir">عسير</option>
                    </select>
                  </div>

                  <div className="flex flex-col">
                    <label className="text-sm font-bold text-deep-green/70 mb-2">المدينة</label>
                    <input 
                      type="text" 
                      name="city"
                      value={formData.city}
                      onChange={handleChange}
                      required
                      placeholder="أدخل اسم المدينة"
                      className="bg-transparent border-b border-black/20 pb-3 outline-none focus:border-emerald transition-colors"
                    />
                  </div>

                  <div className="flex flex-col md:col-span-2">
                    <label className="text-sm font-bold text-deep-green/70 mb-2">تفاصيل العنوان</label>
                    <input 
                      type="text" 
                      name="address"
                      value={formData.address}
                      onChange={handleChange}
                      required
                      placeholder="اسم الشارع، رقم المبنى، الحي"
                      className="bg-transparent border-b border-black/20 pb-3 outline-none focus:border-emerald transition-colors"
                    />
                  </div>
                </div>
              </section>

              {/* Payment Method */}
              <section>
                <h2 className="text-2xl font-bold text-deep-green mb-8 flex items-center gap-2">
                  <span className="w-8 h-8 rounded-full bg-emerald text-white flex items-center justify-center text-sm">2</span>
                  طريقة الدفع
                </h2>
                <div className="space-y-4">
                  {paymentSettings.settings?.bankTransferEnabled && (
                    <label className={`flex items-start p-6 border ${formData.paymentMethod === 'bank_transfer' ? 'border-emerald bg-white shadow-sm' : 'border-black/10'} cursor-pointer transition-all hover:bg-black/5`}>
                      <input 
                        type="radio" 
                        name="paymentMethod" 
                        value="bank_transfer"
                        checked={formData.paymentMethod === 'bank_transfer'}
                        onChange={handleChange}
                        className="mt-1 accent-emerald w-5 h-5"
                      />
                      <div className="mr-4">
                        <div className="text-lg font-bold text-deep-green">تحويل بنكي</div>
                        <div className="text-sm text-deep-green/70 mt-1">تحويل مباشر إلى حسابنا البنكي. سيطلب منك رفع إيصال التحويل في الخطوة التالية لإثبات الدفع.</div>
                      </div>
                    </label>
                  )}

                  {paymentSettings.settings?.walletsEnabled && (
                    <label className={`flex items-start p-6 border ${formData.paymentMethod === 'wallets' ? 'border-emerald bg-white shadow-sm' : 'border-black/10'} cursor-pointer transition-all hover:bg-black/5`}>
                      <input 
                        type="radio" 
                        name="paymentMethod" 
                        value="wallets"
                        checked={formData.paymentMethod === 'wallets'}
                        onChange={handleChange}
                        className="mt-1 accent-emerald w-5 h-5"
                      />
                      <div className="mr-4">
                        <div className="text-lg font-bold text-deep-green">محفظة إلكترونية</div>
                        <div className="text-sm text-deep-green/70 mt-1">الدفع عبر المحافظ الإلكترونية المعتمدة (سيطلب منك إرفاق الإيصال لاحقاً).</div>
                      </div>
                    </label>
                  )}

                  {paymentSettings.settings?.codEnabled && (
                    <label className={`flex items-start p-6 border ${formData.paymentMethod === 'cod' ? 'border-emerald bg-white shadow-sm' : 'border-black/10'} cursor-pointer transition-all hover:bg-black/5`}>
                      <input 
                        type="radio" 
                        name="paymentMethod" 
                        value="cod"
                        checked={formData.paymentMethod === 'cod'}
                        onChange={handleChange}
                        className="mt-1 accent-emerald w-5 h-5"
                      />
                      <div className="mr-4">
                        <div className="text-lg font-bold text-deep-green">الدفع عند الاستلام</div>
                        <div className="text-sm text-deep-green/70 mt-1">
                          ادفع نقدًا عند استلام طلبك. 
                          {paymentSettings.settings.codFee > 0 && <span className="font-bold text-emerald mr-2">(رسوم إضافية: {paymentSettings.settings.codFee} ر.س)</span>}
                        </div>
                      </div>
                    </label>
                  )}
                </div>
              </section>

              <button 
                type="submit" 
                disabled={isSubmitting}
                className="w-full bg-gold text-deep-green border border-black px-12 py-5 rounded-none font-bold hover:bg-[#c9a756] transition-colors duration-300 flex items-center justify-center gap-3 group text-lg disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? 'جاري تأكيد الطلب...' : 'تأكيد الطلب الآن'}
                {!isSubmitting && <ArrowLeft size={20} className="group-hover:-translate-x-2 transition-transform" />}
              </button>
            </form>
          </div>

          {/* Left Column: Order Summary */}
          <aside className="md:col-span-5 order-1 md:order-2 relative">
            <div className="sticky top-32 bg-[#F9F7F2] p-8 border border-black/5 shadow-sm">
              <h2 className="text-xl font-bold text-deep-green mb-6 border-b border-black/5 pb-4">ملخص الطلب</h2>
              
              <div className="space-y-4 mb-8">
                {cartItems.map(item => (
                  <div key={item.id} className="flex items-start gap-4">
                    <div className="w-20 h-20 bg-white shrink-0 border border-black/5 flex items-center justify-center p-2 relative">
                      {item.imageUrl ? (
                        <Image src={item.imageUrl} alt={item.name} fill className="object-contain mix-blend-multiply" />
                      ) : (
                        <span className="text-gold">طيف</span>
                      )}
                    </div>
                    <div className="flex-grow pt-1">
                      <h4 className="font-bold text-deep-green text-sm line-clamp-2">{item.name}</h4>
                      <div className="text-emerald text-sm font-bold mt-1">{(item.price).toLocaleString('ar-SA')} ر.س</div>
                      
                      {/* Quantity Control inside Checkout */}
                      <div className="flex items-center gap-4 mt-3">
                        <div className="flex items-center border border-black/10 rounded-sm bg-white">
                          <button 
                            type="button"
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            className="p-1 hover:bg-black/5 transition-colors text-deep-green"
                          >
                            <Minus size={14} />
                          </button>
                          <span className="w-8 text-center text-sm font-bold">{item.quantity}</span>
                          <button 
                            type="button"
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            className="p-1 hover:bg-black/5 transition-colors text-deep-green"
                          >
                            <Plus size={14} />
                          </button>
                        </div>
                        <button 
                          type="button"
                          onClick={() => removeFromCart(item.id)}
                          className="text-red-500 hover:text-red-700 transition-colors"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="border-t border-black/5 pt-6 space-y-4">
                <div className="flex justify-between text-deep-green text-sm">
                  <span>المجموع الفرعي</span>
                  <span className="font-bold">{cartTotal.toLocaleString('ar-SA')} ر.س</span>
                </div>
                {appliedCoupon && (
                  <div className="flex justify-between text-emerald text-sm font-bold">
                    <span>الخصم ({appliedCoupon.code})</span>
                    <span>- {appliedCoupon.discountAmount.toLocaleString('ar-SA')} ر.س</span>
                  </div>
                )}
                <div className="flex justify-between text-deep-green text-sm">
                  <span>التوصيل</span>
                  {isFreeShipping ? (
                    <span className="font-bold text-emerald">مجاني</span>
                  ) : (
                    <span className="font-bold">{storeSettings.shippingFee.toLocaleString('ar-SA')} ر.س</span>
                  )}
                </div>
                {codFee > 0 && (
                  <div className="flex justify-between text-deep-green text-sm">
                    <span>رسوم الدفع عند الاستلام</span>
                    <span className="font-bold text-emerald">{codFee.toLocaleString('ar-SA')} ر.س</span>
                  </div>
                )}
                
                <div className="flex justify-between font-black text-xl text-deep-green pt-4 border-t border-black/10 mt-4">
                  <span>الإجمالي</span>
                  <span className="text-emerald">{finalTotal.toLocaleString('ar-SA')} ر.س</span>
                </div>
                <div className="text-xs text-center text-deep-green/50 mt-2">
                  الأسعار شاملة ضريبة القيمة المضافة
                </div>
              </div>
            </div>
          </aside>

        </div>
      </div>
      
      <Footer />
    </main>
  )
}

