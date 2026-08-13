'use client'

import React, { useState } from 'react'
import Image from 'next/image'
import { trackOrderByOrderId, trackOrdersByPhone } from './actions'
import { Package, Truck, CheckCircle2, Search, Clock, ShieldCheck, XCircle, AlertCircle, Phone, ArrowRight } from 'lucide-react'
import { useCurrency } from '@/components/CurrencyProvider'

type TrackingMethod = 'PHONE' | 'ORDER_ID'

export default function TrackOrderClient() {
  const currency = useCurrency()

  const [method, setMethod] = useState<TrackingMethod>('PHONE')
  const [orderId, setOrderId] = useState('')
  const [phone, setPhone] = useState('')
  
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  
  const [order, setOrder] = useState<any>(null) // Single order details
  const [ordersList, setOrdersList] = useState<any[]>([]) // Multiple orders for phone
  const [viewState, setViewState] = useState<'FORM' | 'LIST' | 'DETAIL'>('FORM')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setOrder(null)
    setOrdersList([])
    
    if (method === 'ORDER_ID') {
      const res = await trackOrderByOrderId(orderId)
      if (res.success) {
        setOrder(res.order)
        setViewState('DETAIL')
      } else {
        setError(res.error || 'حدث خطأ غير متوقع')
      }
    } else {
      const res = await trackOrdersByPhone(phone)
      if (res.success && res.orders) {
        if (res.orders.length === 1) {
          // If only 1 order, go straight to detail
          setOrder(res.orders[0])
          setViewState('DETAIL')
        } else {
          // Show list of orders
          setOrdersList(res.orders)
          setViewState('LIST')
        }
      } else {
        setError(res.error || 'حدث خطأ غير متوقع')
      }
    }
    
    setLoading(false)
  }

  const handleSelectOrder = (selectedOrder: any) => {
    setOrder(selectedOrder)
    setViewState('DETAIL')
  }

  const handleBack = () => {
    if (method === 'PHONE' && ordersList.length > 1) {
      setViewState('LIST')
    } else {
      setViewState('FORM')
    }
    setOrder(null)
  }

  const handleBackToForm = () => {
    setViewState('FORM')
    setOrder(null)
    setOrdersList([])
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

  const getStatusText = (status: string) => {
    switch(status) {
      case 'NEW': return 'استلمنا الطلب';
      case 'PROCESSING': return 'قيد التجهيز';
      case 'SHIPPED': return 'تم الشحن';
      case 'COMPLETED': return 'مكتمل';
      case 'CANCELLED': return 'ملغى';
      default: return 'غير معروف';
    }
  }

  return (
    <div className="flex-grow pt-32 pb-24 px-6 max-w-5xl mx-auto w-full">
      <h1 className="text-4xl md:text-5xl font-black text-deep-green mb-4 text-center">تتبع الطلب</h1>
      <p className="text-center text-deep-green/60 mb-12 max-w-xl mx-auto">
        اختر طريقة التتبع التي تفضلها لمعرفة حالة طلبك بكل سهولة.
      </p>

      {/* TABS */}
      {viewState === 'FORM' && (
        <div className="bg-white p-6 md:p-10 shadow-sm border border-black/5 mb-12">
          
          <div className="flex justify-center mb-8 border-b border-black/10 gap-4">
            <button 
              type="button"
              onClick={() => { setMethod('PHONE'); setError(''); }}
              className={`pb-4 px-6 font-bold text-lg transition-colors border-b-2 flex items-center gap-2 ${method === 'PHONE' ? 'border-gold text-deep-green' : 'border-transparent text-gray-600 hover:text-deep-green'}`}
            >
              <Phone size={20} /> برقم الهاتف
            </button>
            <button 
              type="button"
              onClick={() => { setMethod('ORDER_ID'); setError(''); }}
              className={`pb-4 px-6 font-bold text-lg transition-colors border-b-2 flex items-center gap-2 ${method === 'ORDER_ID' ? 'border-gold text-deep-green' : 'border-transparent text-gray-600 hover:text-deep-green'}`}
            >
              <Search size={20} /> برقم الطلب
            </button>
          </div>

          <form onSubmit={handleSubmit} className="max-w-2xl mx-auto flex flex-col gap-6">
            
            {method === 'PHONE' ? (
              <div className="flex flex-col animate-in fade-in slide-in-from-bottom-2 duration-300">
                <label className="text-sm font-bold text-deep-green mb-2">رقم الجوال</label>
                <div className="relative">
                  <Phone className="absolute right-4 top-1/2 -translate-y-1/2 text-deep-green/40 w-5 h-5" />
                  <input 
                    type="tel" 
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="رقم الجوال المستخدم في الطلب"
                    dir="ltr"
                    required
                    className="w-full bg-ivory/50 border border-black/10 rounded-none py-4 pr-12 pl-4 focus:outline-none focus:border-gold transition-colors text-right text-lg"
                  />
                </div>
                <p className="text-xs text-gray-500 mt-2">ستظهر لك قائمة بجميع الطلبات المرتبطة بهذا الرقم.</p>
              </div>
            ) : (
              <div className="flex flex-col animate-in fade-in slide-in-from-bottom-2 duration-300">
                <label className="text-sm font-bold text-deep-green mb-2">رقم الطلب</label>
                <div className="relative">
                  <Search className="absolute right-4 top-1/2 -translate-y-1/2 text-deep-green/40 w-5 h-5" />
                  <input 
                    type="text" 
                    value={orderId}
                    onChange={(e) => setOrderId(e.target.value)}
                    placeholder="أدخل رقم الطلب (مثال: cm2... أو TIF-101)"
                    required
                    className="w-full bg-ivory/50 border border-black/10 rounded-none py-4 pr-12 pl-4 focus:outline-none focus:border-gold transition-colors text-right text-lg"
                  />
                </div>
              </div>
            )}

            <button 
              type="submit"
              disabled={loading}
              className="w-full bg-gold text-deep-green font-bold py-4 px-4 rounded-none border border-black hover:bg-[#c9a756] transition-colors disabled:opacity-70 disabled:cursor-not-allowed shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:shadow-none active:translate-y-1 text-lg"
            >
              {loading ? 'جاري البحث...' : 'تتبع الآن'}
            </button>
          </form>

          {error && (
            <div className="mt-6 max-w-2xl mx-auto bg-red-50 text-red-600 p-4 border border-red-100 font-bold flex items-center gap-3 text-sm">
              <AlertCircle className="w-5 h-5 shrink-0" />
              <span>{error}</span>
            </div>
          )}
        </div>
      )}

      {/* LIST OF ORDERS (For Phone Method) */}
      {viewState === 'LIST' && ordersList.length > 0 && (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-4xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold text-deep-green">الطلبات المرتبطة برقم هاتفك</h2>
            <button onClick={handleBackToForm} className="text-gray-500 hover:text-deep-green flex items-center gap-2 text-sm font-bold transition-colors bg-white px-4 py-2 border border-black/10 shadow-sm hover:shadow-md">
               بحث جديد <ArrowRight size={16} />
            </button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {ordersList.map((ord: any) => (
              <div 
                key={ord.id} 
                onClick={() => handleSelectOrder(ord)}
                className="bg-white p-6 border border-black/10 shadow-sm hover:border-gold hover:shadow-md transition-all cursor-pointer group flex flex-col"
              >
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <p className="text-xs text-gray-500 mb-1">رقم الطلب</p>
                    <p className="font-mono font-bold text-lg text-emerald group-hover:text-gold transition-colors">{ord.orderNumber || ord.id}</p>
                  </div>
                  <div className={`px-3 py-1 text-xs font-bold rounded-full ${getStatusStep(ord.status) === -1 ? 'bg-red-100 text-red-700' : getStatusStep(ord.status) === 4 ? 'bg-emerald/10 text-emerald' : 'bg-blue-50 text-blue-600'}`}>
                    {getStatusText(ord.status)}
                  </div>
                </div>
                
                <div className="mt-auto flex justify-between items-end border-t border-black/5 pt-4">
                  <div>
                    <p className="text-xs text-gray-500 mb-1">تاريخ الطلب</p>
                    <p className="text-sm font-medium text-deep-green">{new Date(ord.createdAt).toLocaleDateString('ar-SA')}</p>
                  </div>
                  <div className="text-left">
                    <p className="text-xs text-gray-500 mb-1">الإجمالي</p>
                    <p className="text-sm font-bold text-deep-green">{ord.totalAmount.toLocaleString('ar-SA')} {currency}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SINGLE ORDER DETAILS */}
      {viewState === 'DETAIL' && order && (
        <div className="bg-white shadow-sm border border-black/5 overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-500">
          
          {/* Header Info */}
          <div className="bg-[#F9F7F2] p-6 md:p-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 border-b border-black/5 relative">
            <button 
              onClick={handleBack} 
              className="absolute top-6 left-6 text-gray-500 hover:text-deep-green flex items-center gap-2 text-sm font-bold transition-colors bg-white px-3 py-1.5 border border-black/10 shadow-sm"
            >
              رجوع <ArrowRight size={16} />
            </button>
            
            <div className="mt-6 md:mt-0">
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
                <p className="font-bold text-emerald">{order.totalAmount.toLocaleString('ar-SA')} {currency}</p>
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
            {getStatusStep(order.status) === -1 ? (
              <div className="bg-red-50 p-8 text-center mb-12 border border-red-100">
                <XCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-red-700 mb-2">الطلب ملغى</h3>
                <p className="text-red-600/80">نأسف، تم إلغاء هذا الطلب. يرجى التواصل مع خدمة العملاء إذا كنت تعتقد أن هذا خطأ.</p>
              </div>
            ) : (
              <div className="mb-16 relative mt-4">
                <h3 className="text-lg font-bold text-deep-green mb-10 text-center">حالة الشحن</h3>
                
                {/* Progress Bar Container */}
                <div className="relative max-w-3xl mx-auto">
                  {/* Background Line */}
                  <div className="absolute top-1/2 left-0 w-full h-1 bg-gray-200 -translate-y-1/2 z-0"></div>
                  
                  {/* Active Line */}
                  <div 
                    className="absolute top-1/2 right-0 h-1 bg-emerald -translate-y-1/2 z-0 transition-all duration-1000 ease-out"
                    style={{ width: `${((getStatusStep(order.status) - 1) / 3) * 100}%` }}
                  ></div>

                  {/* Steps */}
                  <div className="relative z-10 flex justify-between items-center w-full">
                    {/* Step 1: NEW */}
                    <div className="flex flex-col items-center">
                      <div className={`w-12 h-12 rounded-full flex items-center justify-center border-4 transition-colors duration-500 ${getStatusStep(order.status) >= 1 ? 'bg-emerald border-emerald text-white' : 'bg-white border-gray-200 text-gray-400'}`}>
                        <Package size={20} />
                      </div>
                      <span className={`mt-3 text-sm font-bold ${getStatusStep(order.status) >= 1 ? 'text-emerald' : 'text-gray-400'}`}>استلمنا الطلب</span>
                    </div>

                    {/* Step 2: PROCESSING */}
                    <div className="flex flex-col items-center">
                      <div className={`w-12 h-12 rounded-full flex items-center justify-center border-4 transition-colors duration-500 delay-100 ${getStatusStep(order.status) >= 2 ? 'bg-emerald border-emerald text-white' : 'bg-white border-gray-200 text-gray-400'}`}>
                        <Clock size={20} />
                      </div>
                      <span className={`mt-3 text-sm font-bold ${getStatusStep(order.status) >= 2 ? 'text-emerald' : 'text-gray-400'}`}>قيد التجهيز</span>
                    </div>

                    {/* Step 3: SHIPPED */}
                    <div className="flex flex-col items-center">
                      <div className={`w-12 h-12 rounded-full flex items-center justify-center border-4 transition-colors duration-500 delay-200 ${getStatusStep(order.status) >= 3 ? 'bg-emerald border-emerald text-white' : 'bg-white border-gray-200 text-gray-400'}`}>
                        <Truck size={20} />
                      </div>
                      <span className={`mt-3 text-sm font-bold ${getStatusStep(order.status) >= 3 ? 'text-emerald' : 'text-gray-400'}`}>تم الشحن</span>
                    </div>

                    {/* Step 4: COMPLETED */}
                    <div className="flex flex-col items-center">
                      <div className={`w-12 h-12 rounded-full flex items-center justify-center border-4 transition-colors duration-500 delay-300 ${getStatusStep(order.status) >= 4 ? 'bg-emerald border-emerald text-white' : 'bg-white border-gray-200 text-gray-400'}`}>
                        <CheckCircle2 size={20} />
                      </div>
                      <span className={`mt-3 text-sm font-bold ${getStatusStep(order.status) >= 4 ? 'text-emerald' : 'text-gray-400'}`}>مكتمل</span>
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
                      <div className="text-emerald text-sm font-bold mt-1">{(item.price).toLocaleString('ar-SA')} {currency}</div>
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
