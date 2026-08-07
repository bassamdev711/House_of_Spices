import Link from 'next/link'
import { createProduct } from '../actions'

export default function NewProductPage() {
  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">إضافة منتج جديد</h2>
        <Link href="/admin/products" className="text-sm text-gray-500 hover:text-gray-900">
          العودة للمنتجات
        </Link>
      </div>

      <form action={createProduct} className="bg-white shadow-sm rounded-lg border border-gray-200 p-6 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">اسم المنتج *</label>
            <input type="text" id="name" name="name" required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-black focus:ring-black sm:text-sm p-2 border" />
          </div>

          <div className="space-y-2">
            <label htmlFor="slug" className="block text-sm font-medium text-gray-700">Slug (الرابط الدائم) *</label>
            <input type="text" id="slug" name="slug" required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-black focus:ring-black sm:text-sm p-2 border" dir="ltr" />
          </div>

          <div className="space-y-2">
            <label htmlFor="price" className="block text-sm font-medium text-gray-700">السعر (YER) *</label>
            <input type="number" step="0.01" min="0" id="price" name="price" required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-black focus:ring-black sm:text-sm p-2 border" dir="ltr" />
          </div>

          <div className="space-y-2">
            <label htmlFor="stock" className="block text-sm font-medium text-gray-700">المخزون *</label>
            <input type="number" min="0" id="stock" name="stock" defaultValue="0" required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-black focus:ring-black sm:text-sm p-2 border" dir="ltr" />
          </div>

          <div className="space-y-2">
            <label htmlFor="brand" className="block text-sm font-medium text-gray-700">الماركة</label>
            <input type="text" id="brand" name="brand" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-black focus:ring-black sm:text-sm p-2 border" />
          </div>

          <div className="space-y-2 flex items-center h-full pt-6">
            <div className="flex items-center">
              <input id="isActive" name="isActive" type="checkbox" defaultChecked className="h-4 w-4 text-black focus:ring-black border-gray-300 rounded" />
              <label htmlFor="isActive" className="mr-2 block text-sm text-gray-900">
                منتج فعال (يظهر في المتجر)
              </label>
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <label htmlFor="description" className="block text-sm font-medium text-gray-700">الوصف</label>
          <textarea id="description" name="description" rows={4} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-black focus:ring-black sm:text-sm p-2 border" />
        </div>

        <div className="pt-4 border-t border-gray-200 flex justify-end gap-3">
          <Link 
            href="/admin/products"
            className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
          >
            إلغاء
          </Link>
          <button 
            type="submit"
            className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-black hover:bg-gray-800"
          >
            حفظ المنتج
          </button>
        </div>
      </form>
    </div>
  )
}
