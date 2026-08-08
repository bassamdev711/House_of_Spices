'use client'

import React, { useState } from 'react'
import { Truck, CheckCircle2, AlertCircle } from 'lucide-react'
import { updateStoreSettings } from './actions'

type StoreSettings = {
  shippingFee: number
  freeShippingThreshold: number
}

export default function ShippingSettingsClient({ initialSettings }: { initialSettings: StoreSettings }) {
  const [shippingFee, setShippingFee] = useState(initialSettings.shippingFee.toString())
  const [freeShippingThreshold, setFreeShippingThreshold] = useState(initialSettings.freeShippingThreshold.toString())
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
      freeShippingThreshold: threshold
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
          إعدادات الشحن
        </h1>
        <p className="text-deep-green/60">التحكم في تكاليف الشحن الثابتة وعتبة الشحن المجاني.</p>
      </div>

      <div className="bg-white p-8 border border-black/5 shadow-sm rounded-md max-w-2xl">
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
