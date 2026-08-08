'use client'

import { useState } from 'react'
import Link from 'next/link'
import { updateProduct } from '../../actions'
import ImageUpload from '../../ImageUpload'

interface Product {
  id: string
  name: string
  slug: string
  brand: string | null
  description: string | null
  price: number
  compareAtPrice: number | null
  sku: string | null
  size: string | null
  gender: string | null
  category: string | null
  collectionId: string | null
  stock: number
  featured: boolean
  bestseller: boolean
  isActive: boolean
  imageUrl: string | null
  images: string[]
}

export default function EditProductClient({ product, collections = [] }: { product: Product, collections?: any[] }) {
  const [mainImage, setMainImage] = useState(product.imageUrl || '')
  const [extraImages, setExtraImages] = useState<string[]>(product.images || [])

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">تعديل: {product.name}</h2>
        <Link href="/admin/products" className="text-sm text-gray-500 hover:text-gray-900">العودة</Link>
      </div>

      <form action={updateProduct} className="space-y-6">
        <input type="hidden" name="id" value={product.id} />
        <input type="hidden" name="imageUrl" value={mainImage} />
        <input type="hidden" name="images" value={JSON.stringify(extraImages)} />

        <div className="bg-white shadow-sm rounded-lg border border-gray-200 p-6 space-y-6">
          <h3 className="text-base font-semibold text-gray-900 border-b pb-3">المعلومات الأساسية</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">اسم المنتج *</label>
              <input type="text" name="name" required defaultValue={product.name}
                className="w-full rounded-md border-gray-300 border p-2 text-sm text-gray-900 bg-white focus:border-black focus:outline-none" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Slug *</label>
              <input type="text" name="slug" required defaultValue={product.slug} dir="ltr"
                className="w-full rounded-md border-gray-300 border p-2 text-sm text-gray-900 bg-white focus:border-black focus:outline-none" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">الماركة</label>
              <input type="text" name="brand" defaultValue={product.brand || ''}
                className="w-full rounded-md border-gray-300 border p-2 text-sm text-gray-900 bg-white" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">المجموعة (Collection)</label>
              <select name="collectionId" defaultValue={product.collectionId || ''} className="w-full rounded-md border-gray-300 border p-2 text-sm text-gray-900 bg-white">
                <option value="">بدون مجموعة</option>
                {collections.map(col => (
                  <option key={col.id} value={col.id}>{col.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">الجنس</label>
              <select name="gender" defaultValue={product.gender || ''} className="w-full rounded-md border-gray-300 border p-2 text-sm text-gray-900 bg-white">
                <option value="">غير محدد</option>
                <option value="Men">رجالي</option>
                <option value="Women">نسائي</option>
                <option value="Unisex">للجميع</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">الحجم</label>
              <input type="text" name="size" defaultValue={product.size || ''} dir="ltr"
                className="w-full rounded-md border-gray-300 border p-2 text-sm text-gray-900 bg-white" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">الوصف</label>
            <textarea name="description" rows={3} defaultValue={product.description || ''}
              className="w-full rounded-md border-gray-300 border p-2 text-sm text-gray-900 bg-white" />
          </div>
        </div>

        <div className="bg-white shadow-sm rounded-lg border border-gray-200 p-6 space-y-4">
          <h3 className="text-base font-semibold text-gray-900 border-b pb-3">السعر والمخزون</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">السعر (YER) *</label>
              <input type="number" name="price" step="0.01" min="0" required defaultValue={product.price} dir="ltr"
                className="w-full rounded-md border-gray-300 border p-2 text-sm text-gray-900 bg-white" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">السعر قبل الخصم</label>
              <input type="number" name="compareAtPrice" step="0.01" min="0" defaultValue={product.compareAtPrice ?? ''} dir="ltr"
                className="w-full rounded-md border-gray-300 border p-2 text-sm text-gray-900 bg-white" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">SKU</label>
              <input type="text" name="sku" defaultValue={product.sku || ''} dir="ltr"
                className="w-full rounded-md border-gray-300 border p-2 text-sm text-gray-900 bg-white" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">الكمية في المخزون</label>
              <input type="number" name="stock" min="0" defaultValue={product.stock} dir="ltr"
                className="w-full rounded-md border-gray-300 border p-2 text-sm text-gray-900 bg-white" />
            </div>
          </div>
        </div>

        <div className="bg-white shadow-sm rounded-lg border border-gray-200 p-6 space-y-4">
          <h3 className="text-base font-semibold text-gray-900 border-b pb-3">الصور</h3>
          <ImageUpload
            mainImage={mainImage}
            additionalImages={extraImages}
            onMainImageChange={setMainImage}
            onAdditionalImagesChange={setExtraImages}
          />
        </div>

        <div className="bg-white shadow-sm rounded-lg border border-gray-200 p-6 space-y-3">
          <h3 className="text-base font-semibold text-gray-900 border-b pb-3">الحالة</h3>
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" name="isActive" defaultChecked={product.isActive} className="h-4 w-4 rounded" />
            <span className="text-sm text-gray-700">فعال (يظهر في المتجر)</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" name="featured" defaultChecked={product.featured} className="h-4 w-4 rounded" />
            <span className="text-sm text-gray-700">منتج مميز (يظهر في الصفحة الرئيسية)</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" name="bestseller" defaultChecked={product.bestseller} className="h-4 w-4 rounded" />
            <span className="text-sm text-gray-700">الأكثر مبيعاً</span>
          </label>
        </div>

        <div className="flex justify-end gap-3 pb-6">
          <Link href="/admin/products" className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
            إلغاء
          </Link>
          <button type="submit" className="px-4 py-2 bg-black text-white text-sm font-medium rounded-md hover:bg-gray-800">
            حفظ التغييرات
          </button>
        </div>
      </form>
    </div>
  )
}
