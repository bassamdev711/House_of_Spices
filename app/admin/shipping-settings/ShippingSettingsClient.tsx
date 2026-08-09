'use client'

import React, { useState } from 'react'
import { Truck, CheckCircle2, AlertCircle, ShieldCheck } from 'lucide-react'
import { updateStoreSettings } from './actions'

type StoreSettings = {
  shippingFee: number
  freeShippingThreshold: number
  showShippingInFooter: boolean
  showReturnInFooter: boolean
  shippingPolicyContent: string
  returnPolicyContent: string
}

export default function ShippingSettingsClient({ initialSettings }: { initialSettings: StoreSettings }) {
  const [shippingFee, setShippingFee] = useState(initialSettings.shippingFee.toString())
  const [freeShippingThreshold, setFreeShippingThreshold] = useState(initialSettings.freeShippingThreshold.toString())
  
  const [showShippingInFooter, setShowShippingInFooter] = useState(initialSettings.showShippingInFooter)
  const [shippingPolicyContent, setShippingPolicyContent] = useState(initialSettings.shippingPolicyContent)
  
  const [showReturnInFooter, setShowReturnInFooter] = useState(initialSettings.showReturnInFooter)
  const [returnPolicyContent, setReturnPolicyContent] = useState(initialSettings.returnPolicyContent)

  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState('')
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setSuccess('')

    const fee = parseFloat(shippingFee)
    const threshold = parseFloat(freeShippingThreshold)

    if (isNaN(fee) || fee < 0) {
      setError('رسوم الشحن يجب أن تكون رقماً صحيحاً (صفر أو أكثر).')
      setLoading(false)
      return
    }

    if (isNaN(threshold) || threshold < 0) {
      setError('الحد الأدنى للشحن المجاني يجب أن يكون رقماً صحيحاً.')
      setLoading(false)
      return
    }

    const res = await updateStoreSettings({
      shippingFee: fee,
      freeShippingThreshold: threshold,
      showShippingInFooter,
      showReturnInFooter,
      shippingPolicyContent,
      returnPolicyContent
    })

    if (res.success) {
      setSuccess('تم حفظ إعدادات الشحن بنجاح!')
    } else {
      setError(res.error || 'حدث خطأ غير متوقع')
    }
    setLoading(false)
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-black text-deep-green mb-2 flex items-center gap-3">
          <Truck className="w-8 h-8 text-gold" />
          إعدادات الشحن والسياسات
        </h1>
        <p className="text-deep-green/60">التحكم في تكاليف الشحن، وسياسات المتجر التي تظهر للعملاء.</p>
      </div>

      <div className="bg-white p-8 border border-black/5 shadow-sm rounded-md max-w-3xl">
        {success && (
          <div className="bg-emerald/10 text-emerald p-4 rounded-md mb-6 border border-emerald/20 flex items-center gap-2 font-bold">
            <CheckCircle2 size={20} />
            {success}
          </div>
        )}
        {error && (
          <div className="bg-red-50 text-red-600 p-4 rounded-md mb-6 border border-red-200 flex items-center gap-2 font-bold">
            <AlertCircle size={20} />
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-8">
          
          <div className="bg-[#F9F7F2] p-6 rounded-md border border-black/5">
            <label className="block text-lg font-bold text-deep-green mb-2">رسوم الشحن الثابتة (ر.س)</label>
            <p className="text-sm text-deep-green/60 mb-4">هذا المبلغ سيضاف تلقائياً لأي طلب جديد يقوم به العميل.</p>
            <div className="relative w-full md:w-1/2">
              <input 
                type="number"
                min="0"
                step="0.01"
                value={shippingFee}
                onChange={e => setShippingFee(e.target.value)}
                className="w-full px-4 py-3 bg-white border border-black/10 rounded-md focus:outline-none focus:border-gold pr-12 font-bold text-lg"
                required
              />
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-deep-green/40 font-bold">ر.س</span>
            </div>
          </div>

          <div className="bg-[#F9F7F2] p-6 rounded-md border border-black/5">
            <label className="block text-lg font-bold text-deep-green mb-2">الحد الأدنى للشحن المجاني (ر.س)</label>
            <p className="text-sm text-deep-green/60 mb-4">إذا تجاوز إجمالي سلة المشتريات هذا المبلغ، سيكون الشحن مجانياً (سيتم إلغاء رسوم الشحن الثابتة). ضع القيمة 0 إذا كنت لا تريد تقديم شحن مجاني.</p>
            <div className="relative w-full md:w-1/2">
              <input 
                type="number"
                min="0"
                step="0.01"
                value={freeShippingThreshold}
                onChange={e => setFreeShippingThreshold(e.target.value)}
                className="w-full px-4 py-3 bg-white border border-black/10 rounded-md focus:outline-none focus:border-gold pr-12 font-bold text-lg"
                required
              />
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-deep-green/40 font-bold">ر.س</span>
            </div>
          </div>

          <hr className="border-black/5" />

          {/* Shipping Policy */}
          <div className="bg-white p-6 rounded-md border border-black/10">
            <div className="flex items-center justify-between mb-4">
              <div>
                <label className="block text-lg font-bold text-deep-green flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-emerald" />
                  سياسة الشحن والتوصيل
                </label>
                <p className="text-sm text-deep-green/60 mt-1">اكتب تفاصيل مدة التوصيل وشركات الشحن ليتمكن العميل من قراءتها.</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input 
                  type="checkbox" 
                  className="sr-only peer" 
                  checked={showShippingInFooter}
                  onChange={(e) => setShowShippingInFooter(e.target.checked)}
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald"></div>
                <span className="ml-3 text-sm font-bold text-deep-green">إظهار في الفوتر</span>
              </label>
            </div>
            {showShippingInFooter && (
              <textarea
                value={shippingPolicyContent}
                onChange={(e) => setShippingPolicyContent(e.target.value)}
                rows={6}
                placeholder="اكتب محتوى سياسة الشحن هنا..."
                className="w-full px-4 py-3 bg-[#F9F7F2] border border-black/10 rounded-md focus:outline-none focus:border-gold mt-2 resize-none leading-relaxed"
              ></textarea>
            )}
          </div>

          {/* Return Policy */}
          <div className="bg-white p-6 rounded-md border border-black/10">
            <div className="flex items-center justify-between mb-4">
              <div>
                <label className="block text-lg font-bold text-deep-green flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-emerald" />
                  سياسة الاسترجاع والاستبدال
                </label>
                <p className="text-sm text-deep-green/60 mt-1">وضح شروط إرجاع المنتجات واسترداد الأموال بوضوح لبناء الثقة.</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input 
                  type="checkbox" 
                  className="sr-only peer" 
                  checked={showReturnInFooter}
                  onChange={(e) => setShowReturnInFooter(e.target.checked)}
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald"></div>
                <span className="ml-3 text-sm font-bold text-deep-green">إظهار في الفوتر</span>
              </label>
            </div>
            {showReturnInFooter && (
              <textarea
                value={returnPolicyContent}
                onChange={(e) => setReturnPolicyContent(e.target.value)}
                rows={6}
                placeholder="اكتب محتوى سياسة الاسترجاع هنا..."
                className="w-full px-4 py-3 bg-[#F9F7F2] border border-black/10 rounded-md focus:outline-none focus:border-gold mt-2 resize-none leading-relaxed"
              ></textarea>
            )}
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="w-full md:w-auto bg-gold text-deep-green px-12 py-4 rounded-none font-bold hover:bg-[#c9a756] transition-colors disabled:opacity-50 text-lg"
          >
            {loading ? 'جاري الحفظ...' : 'حفظ الإعدادات'}
          </button>
        </form>
      </div>
    </div>
  )
}
