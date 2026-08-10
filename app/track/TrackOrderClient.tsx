'use client'

import React, { useState } from 'react'
import Image from 'next/image'
import { trackOrder } from './actions'
import { Package, Truck, CheckCircle2, Search, Clock, ShieldCheck, XCircle, AlertCircle } from 'lucide-react'

export default function TrackOrderClient() {
  const [orderId, setOrderId] = useState('')
  const [phone, setPhone] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [order, setOrder] = useState<any>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setOrder(null)

    const res = await trackOrder(orderId, phone)
    
    if (res.success) {
      setOrder(res.order)
    } else {
      setError(res.error || 'حدث خطأ غير متوقع')
    }
    
    setLoading(false)
  }

  // Helper to determine active step in the progress bar
  const getStatusStep = (status: string) => {
    switch(status) {
      case 'NEW': return 1;
      case 'PROCESSING': return 2;
      case 'SHIPPED': return 3;
      case 'COMPLETED': return 4;
      case 'CANCELLED': return -1;
      default: return 0;
    }
  }

  const step = order ? getStatusStep(order.status) : 0;

  return (
    <div className="flex-grow pt-32 pb-24 px-6 max-w-5xl mx-auto w-full">
      <h1 className="text-4xl md:text-5xl font-black text-deep-green mb-4 text-center">تتبع الطلب</h1>
      <p className="text-center text-deep-green/60 mb-12 max-w-xl mx-auto">
        أدخل رقم الطلب ورقم الجوال الذي قمت بالطلب به لمعرفة حالة طلبك الحالية بكل سهولة.
      </p>

      {/* Search Form */}
      <div className="bg-white p-6 md:p-10 shadow-sm border border-black/5 mb-12">
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-12 gap-6">
          <div className="md:col-span-5 flex flex-col">
            <label className="text-sm font-bold text-deep-green mb-2">رقم الطلب</label>
            <div className="relative">
              <Search className="absolute right-4 top-1/2 -translate-y-1/2 text-deep-green/40 w-5 h-5" />
              <input 
                type="text" 
                value={orderId}
                onChange={(e) => setOrderId(e.target.value)}
                placeholder="أدخل رقم الطلب (مثال: cm2... أو TIF-101)"
                required
                className="w-full bg-ivory/50 border border-black/10 rounded-none py-3 pr-12 pl-4 focus:outline-none focus:border-gold transition-colors text-right"
              />
            </div>
          </div>
          
          <div className="md:col-span-5 flex flex-col">
            <label className="text-sm font-bold text-deep-green mb-2">رقم الجوال</label>
            <input 
              type="tel" 
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="رقم الجوال المستخدم في الطلب"
              dir="ltr"
              required
              className="w-full bg-ivory/50 border border-black/10 rounded-none py-3 px-4 focus:outline-none focus:border-gold transition-colors text-right"
            />
          </div>

          <div className="md:col-span-2 flex items-end">
            <button 
              type="submit"
              disabled={loading}
              className="w-full bg-gold text-deep-green font-bold py-3 px-4 rounded-none border border-black hover:bg-[#c9a756] transition-colors disabled:opacity-70 disabled:cursor-not-allowed shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:shadow-none active:translate-y-1 h-[50px]"
            >
              {loading ? 'جاري البحث...' : 'تتبع الآن'}
            </button>
          </div>
        </form>

        {error && (
          <div className="mt-6 bg-red-50 text-red-600 p-4 border border-red-100 font-bold flex items-center gap-3 text-sm">
            <AlertCircle className="w-5 h-5 shrink-0" />
            <span>{error}</span>
          </div>
        )}
      </div>

      {/* Order Results */}
      {order && (
        <div className="bg-white shadow-sm border border-black/5 overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-500">
          
          {/* Header Info */}
          <div className="bg-[#F9F7F2] p-6 md:p-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 border-b border-black/5">
            <div>
              <p className="text-sm text-deep-green/60 mb-1">رقم الطلب</p>
              <h2 className="text-2xl font-black text-emerald font-mono tracking-widest">{order.orderNumber || order.id}</h2>
            </div>
            
            <div className="flex flex-wrap gap-6 text-sm">
              <div>
                <p className="text-deep-green/60 mb-1">تاريخ الطلب</p>
                <p className="font-bold text-deep-green">{new Date(order.createdAt).toLocaleDateString('ar-SA')}</p>
              </div>
              <div>
                <p className="text-deep-green/60 mb-1">الإجمالي</p>
                <p className="font-bold text-emerald">{order.totalAmount.toLocaleString('ar-SA')} ر.س</p>
              </div>
              <div>
                <p className="text-deep-green/60 mb-1">حالة الدفع</p>
                <p className="font-bold text-deep-green flex items-center gap-1.5">
                  {order.paymentStatus === 'PAID' ? <><ShieldCheck size={16} className="text-emerald" /> مدفوع</> : 
                   order.paymentStatus === 'AWAITING_CONFIRMATION' ? <><Clock size={16} className="text-yellow-600" /> بانتظار التأكيد</> : 
                   order.paymentStatus === 'FAILED' ? <><XCircle size={16} className="text-red-500" /> فشل الدفع</> : 
                   <><Clock size={16} className="text-gray-500" /> معلق</>}
                </p>
              </div>
            </div>
          </div>

          <div className="p-6 md:p-10">
            {/* Progress Bar Area */}
            {step === -1 ? (
              <div className="bg-red-50 p-8 text-center mb-12 border border-red-100">
                <XCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-red-700 mb-2">الطلب ملغى</h3>
                <p className="text-red-600/80">نأسف، تم إلغاء هذا الطلب. يرجى التواصل مع خدمة العملاء إذا كنت تعتقد أن هذا خطأ.</p>
              </div>
            ) : (
              <div className="mb-16 relative">
                <h3 className="text-lg font-bold text-deep-green mb-10 text-center">حالة الشحن</h3>
                
                {/* Progress Bar Container */}
                <div className="relative max-w-3xl mx-auto">
                  {/* Background Line */}
                  <div className="absolute top-1/2 left-0 w-full h-1 bg-gray-200 -translate-y-1/2 z-0"></div>
                  
                  {/* Active Line */}
                  <div 
                    className="absolute top-1/2 right-0 h-1 bg-emerald -translate-y-1/2 z-0 transition-all duration-1000 ease-out"
                    style={{ width: `${((step - 1) / 3) * 100}%` }}
                  ></div>

                  {/* Steps */}
                  <div className="relative z-10 flex justify-between items-center w-full">
                    {/* Step 1: NEW */}
                    <div className="flex flex-col items-center">
                      <div className={`w-12 h-12 rounded-full flex items-center justify-center border-4 transition-colors duration-500 ${step >= 1 ? 'bg-emerald border-emerald text-white' : 'bg-white border-gray-200 text-gray-400'}`}>
                        <Package size={20} />
                      </div>
                      <span className={`mt-3 text-sm font-bold ${step >= 1 ? 'text-emerald' : 'text-gray-400'}`}>استلمنا الطلب</span>
                    </div>

                    {/* Step 2: PROCESSING */}
                    <div className="flex flex-col items-center">
                      <div className={`w-12 h-12 rounded-full flex items-center justify-center border-4 transition-colors duration-500 delay-100 ${step >= 2 ? 'bg-emerald border-emerald text-white' : 'bg-white border-gray-200 text-gray-400'}`}>
                        <Clock size={20} />
                      </div>
                      <span className={`mt-3 text-sm font-bold ${step >= 2 ? 'text-emerald' : 'text-gray-400'}`}>قيد التجهيز</span>
                    </div>

                    {/* Step 3: SHIPPED */}
                    <div className="flex flex-col items-center">
                      <div className={`w-12 h-12 rounded-full flex items-center justify-center border-4 transition-colors duration-500 delay-200 ${step >= 3 ? 'bg-emerald border-emerald text-white' : 'bg-white border-gray-200 text-gray-400'}`}>
                        <Truck size={20} />
                      </div>
                      <span className={`mt-3 text-sm font-bold ${step >= 3 ? 'text-emerald' : 'text-gray-400'}`}>تم الشحن</span>
                    </div>

                    {/* Step 4: COMPLETED */}
                    <div className="flex flex-col items-center">
                      <div className={`w-12 h-12 rounded-full flex items-center justify-center border-4 transition-colors duration-500 delay-300 ${step >= 4 ? 'bg-emerald border-emerald text-white' : 'bg-white border-gray-200 text-gray-400'}`}>
                        <CheckCircle2 size={20} />
                      </div>
                      <span className={`mt-3 text-sm font-bold ${step >= 4 ? 'text-emerald' : 'text-gray-400'}`}>مكتمل</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Order Items */}
            <div className="border-t border-black/5 pt-10">
              <h3 className="text-lg font-bold text-deep-green mb-6">المنتجات المطلوبة</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {order.items.map((item: any) => (
                  <div key={item.id} className="flex items-center gap-4 border border-black/5 p-4 hover:border-gold/30 transition-colors bg-[#F9F7F2]/50">
                    <div className="w-20 h-20 bg-white shrink-0 border border-black/5 flex items-center justify-center p-2 relative">
                      {item.imageUrl ? (
                        <Image src={item.imageUrl} alt={item.productName} fill className="object-contain mix-blend-multiply" />
                      ) : (
                        <span className="text-gold text-xs">طيف</span>
                      )}
                    </div>
                    <div>
                      <h4 className="font-bold text-deep-green text-sm line-clamp-2">{item.productName}</h4>
                      <div className="text-deep-green/60 text-xs mt-1">الكمية: {item.quantity}</div>
                      <div className="text-emerald text-sm font-bold mt-1">{(item.price).toLocaleString('ar-SA')} ر.س</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>
      )}

    </div>
  )
}
