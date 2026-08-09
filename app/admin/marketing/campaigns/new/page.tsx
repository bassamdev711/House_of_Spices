import Link from 'next/link'
import { createCampaign } from '../actions'

export const metadata = { title: 'حملة جديدة | TIF Admin' }

export default function NewCampaignPage() {
  // تاريخ اليوم و30 يوم لاحقاً كقيم افتراضية
  const today = new Date().toISOString().slice(0, 16)
  const nextMonth = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().slice(0, 16)

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-black text-gray-900">حملة تسويقية جديدة</h2>
        <Link href="/admin/marketing/campaigns" className="text-sm text-gray-500 hover:text-gray-900">
          العودة
        </Link>
      </div>

      <form action={createCampaign} className="space-y-6">
        {/* Campaign Info */}
        <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm space-y-4">
          <h3 className="font-bold text-gray-900 border-b pb-3">معلومات الحملة</h3>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              عنوان الحملة <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="title"
              required
              placeholder="مثال: عروض الصيف 2026"
              className="w-full border border-gray-300 rounded-lg p-2.5 text-sm focus:outline-none focus:border-emerald bg-white"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">رسالة الحملة</label>
            <textarea
              name="description"
              rows={3}
              placeholder="مثال: استمتع بخصم 20% على جميع العطور هذا الصيف!"
              className="w-full border border-gray-300 rounded-lg p-2.5 text-sm focus:outline-none focus:border-emerald bg-white resize-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">رابط صورة البانر (اختياري)</label>
            <input
              type="url"
              name="imageUrl"
              placeholder="https://..."
              dir="ltr"
              className="w-full border border-gray-300 rounded-lg p-2.5 text-sm focus:outline-none focus:border-emerald bg-white"
            />
            <p className="text-xs text-gray-400 mt-1">ستظهر هذه الصورة في بانر الحملة على الموقع</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">كود كوبون مرتبط (اختياري)</label>
            <input
              type="text"
              name="couponCode"
              placeholder="مثال: SUMMER20"
              dir="ltr"
              className="w-full border border-gray-300 rounded-lg p-2.5 text-sm font-mono uppercase tracking-wider focus:outline-none focus:border-emerald bg-white"
            />
            <p className="text-xs text-gray-400 mt-1">سيُعرض هذا الكود في بانر الحملة</p>
          </div>
        </div>

        {/* Duration */}
        <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm space-y-4">
          <h3 className="font-bold text-gray-900 border-b pb-3">مدة الحملة</h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                تاريخ البداية <span className="text-red-500">*</span>
              </label>
              <input
                type="datetime-local"
                name="startDate"
                required
                defaultValue={today}
                dir="ltr"
                className="w-full border border-gray-300 rounded-lg p-2.5 text-sm focus:outline-none focus:border-emerald bg-white"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                تاريخ الانتهاء <span className="text-red-500">*</span>
              </label>
              <input
                type="datetime-local"
                name="endDate"
                required
                defaultValue={nextMonth}
                dir="ltr"
                className="w-full border border-gray-300 rounded-lg p-2.5 text-sm focus:outline-none focus:border-emerald bg-white"
              />
            </div>
          </div>

          <label className="flex items-center gap-3 cursor-pointer">
            <input type="checkbox" name="isActive" defaultChecked className="w-4 h-4 rounded accent-emerald" />
            <span className="text-sm font-medium text-gray-700">تفعيل الحملة فور الإنشاء</span>
          </label>
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-3">
          <Link
            href="/admin/marketing/campaigns"
            className="px-5 py-2.5 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
          >
            إلغاء
          </Link>
          <button
            type="submit"
            className="px-5 py-2.5 bg-emerald text-white text-sm font-bold rounded-lg hover:bg-deep-green transition-colors"
          >
            إطلاق الحملة
          </button>
        </div>
      </form>
    </div>
  )
}
