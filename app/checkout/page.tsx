'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowLeft, ArrowRight } from 'lucide-react'
import { useCart } from '@/components/CartProvider'
import { useCheckout } from '@/components/CheckoutProvider'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import { getPaymentMethods } from './actions'

export default function CheckoutPage() {
  const { cartItems, cartTotal } = useCart()
  const { checkoutData, setCheckoutData } = useCheckout()
  const router = useRouter()
  const [mounted, setMounted] = useState(false)
  const [paymentSettings, setPaymentSettings] = useState<any>(null)

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    // Calculate shipping
    const storeSettings = paymentSettings.storeSettings;
    const isFreeShipping = storeSettings.freeShippingThreshold > 0 && cartTotal >= storeSettings.freeShippingThreshold;
    const shippingFee = isFreeShipping ? 0 : storeSettings.shippingFee;
    
    setCheckoutData({ ...formData, shippingFee })
    router.push('/checkout/review')
  }

  const storeSettings = paymentSettings.storeSettings;
  const isFreeShipping = storeSettings.freeShippingThreshold > 0 && cartTotal >= storeSettings.freeShippingThreshold;
  const shippingFee = isFreeShipping ? 0 : storeSettings.shippingFee;
  const finalTotal = cartTotal + shippingFee;

  return (
    <main className="min-h-screen bg-ivory text-deep-green font-sans flex flex-col" dir="rtl">
      <Navbar />

      <div className="flex-grow pt-32 pb-24 px-6 max-w-7xl mx-auto w-full">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 md:gap-16">
          
          {/* Right Column: Form (order-2 on mobile, order-1 on desktop if we flip it, but let's follow the standard RTL design where form is on right (cols 1-8)) */}
          <div className="md:col-span-8 order-2 md:order-1">
            <div className="mb-8">
              <Link href="/cart" className="inline-flex items-center text-deep-green/60 hover:text-emerald transition-colors font-bold gap-2">
                <ArrowRight size={16} />
                العودة إلى السلة
              </Link>
            </div>
            
            <h1 className="text-4xl md:text-5xl font-black text-deep-green mb-10">الدفع</h1>
            
            <form onSubmit={handleSubmit} className="space-y-12">
              {/* Shipping Details */}
              <section>
                <h2 className="text-2xl font-bold text-deep-green mb-8">تفاصيل الشحن</h2>
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
                <h2 className="text-2xl font-bold text-deep-green mb-8">طريقة الدفع</h2>
                <div className="space-y-4">
                  {paymentSettings.settings?.bankTransferEnabled && (
                    <label className={`flex items-start p-6 border ${formData.paymentMethod === 'bank_transfer' ? 'border-emerald bg-white shadow-sm' : 'border-black/10'} cursor-pointer transition-all`}>
                      <input 
                        type="radio" 
                        name="paymentMethod" 
                        value="bank_transfer"
                        checked={formData.paymentMethod === 'bank_transfer'}
                        onChange={handleChange}
                        className="mt-1 accent-emerald w-5 h-5"
                      />
                      <div className="mr-4">
                        <div className="text-lg font-bold text-deep-green">إيداع بنكي</div>
                        <div className="text-sm text-deep-green/70 mt-1">تحويل مباشر إلى حسابنا البنكي. سيتم إرفاق إيصال الدفع في الخطوة التالية.</div>
                      </div>
                    </label>
                  )}

                  {paymentSettings.settings?.walletsEnabled && (
                    <label className={`flex items-start p-6 border ${formData.paymentMethod === 'wallets' ? 'border-emerald bg-white shadow-sm' : 'border-black/10'} cursor-pointer transition-all`}>
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
                        <div className="text-sm text-deep-green/70 mt-1">الدفع عبر المحافظ الإلكترونية المعتمدة (سيتم إرفاق الإيصال لاحقاً).</div>
                      </div>
                    </label>
                  )}

                  {paymentSettings.settings?.codEnabled && (
                    <label className={`flex items-start p-6 border ${formData.paymentMethod === 'cod' ? 'border-emerald bg-white shadow-sm' : 'border-black/10'} cursor-pointer transition-all`}>
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
                className="w-full md:w-auto bg-gold text-deep-green border border-black px-12 py-5 rounded-none font-bold hover:bg-[#c9a756] transition-colors duration-300 flex items-center justify-center gap-3 group text-lg"
              >
                تأكيد ومتابعة
                <ArrowLeft size={20} className="group-hover:-translate-x-2 transition-transform" />
              </button>
            </form>
          </div>

          {/* Left Column: Order Summary */}
          <aside className="md:col-span-4 order-1 md:order-2 relative">
            <div className="sticky top-32 bg-white p-8 border border-black/5 shadow-sm">
              <h2 className="text-xl font-bold text-deep-green mb-6 border-b border-black/5 pb-4">ملخص الطلب</h2>
              
              <div className="space-y-4 mb-8">
                {cartItems.map(item => (
                  <div key={item.id} className="flex items-center gap-4">
                    <div className="w-16 h-16 bg-[#F9F7F2] shrink-0 border border-black/5 flex items-center justify-center p-2 relative">
                      {item.imageUrl ? (
                        <Image src={item.imageUrl} alt={item.name} fill className="object-contain mix-blend-multiply" />
                      ) : (
                        <span className="text-gold">✦</span>
                      )}
                      <span className="absolute -top-2 -right-2 bg-emerald text-ivory text-xs w-5 h-5 rounded-full flex items-center justify-center font-bold">
                        {item.quantity}
                      </span>
                    </div>
                    <div className="flex-grow">
                      <h4 className="font-bold text-deep-green text-sm">{item.name}</h4>
                      <div className="text-emerald text-sm font-bold mt-1">{(item.price * item.quantity).toLocaleString('ar-SA')} ر.س</div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="border-t border-black/5 pt-6 space-y-4">
                <div className="flex justify-between text-deep-green text-sm">
                  <span>المجموع الفرعي</span>
                  <span className="font-bold">{cartTotal.toLocaleString('ar-SA')} ر.س</span>
                </div>
                <div className="flex justify-between text-deep-green text-sm">
                  <span>رسوم التوصيل</span>
                  {isFreeShipping ? (
                    <span className="font-bold text-emerald">مجاني</span>
                  ) : (
                    <span className="font-bold">{shippingFee.toLocaleString('ar-SA')} ر.س</span>
                  )}
                </div>
                
                <div className="flex justify-between font-black text-xl text-deep-green pt-4 border-t border-black/5 mt-4">
                  <span>المجموع الإجمالي</span>
                  <span className="text-emerald">{finalTotal.toLocaleString('ar-SA')} ر.س</span>
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
