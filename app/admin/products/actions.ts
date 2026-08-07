'use server'

import prisma from '@/lib/prisma'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

export async function deleteProduct(id: string) {
  try {
    await prisma.product.delete({ where: { id } })
    revalidatePath('/admin/products')
  } catch (error) {
    console.error('Failed to delete product:', error)
    throw new Error('Failed to delete product')
  }
}

export async function createProduct(formData: FormData) {
  const name = formData.get('name') as string
  const slug = formData.get('slug') as string
  const price = formData.get('price') as string
  const compareAtPrice = formData.get('compareAtPrice') as string
  const stock = formData.get('stock') as string
  const sku = formData.get('sku') as string
  const brand = formData.get('brand') as string
  const description = formData.get('description') as string
  const category = formData.get('category') as string
  const gender = formData.get('gender') as string
  const size = formData.get('size') as string
  const imageUrl = formData.get('imageUrl') as string
  const imagesRaw = formData.get('images') as string
  const isActive = formData.get('isActive') === 'on'
  const featured = formData.get('featured') === 'on'
  const bestseller = formData.get('bestseller') === 'on'

  // Validation
  if (!name || name.trim().length === 0) throw new Error('اسم المنتج مطلوب')
  if (!slug || slug.trim().length === 0) throw new Error('الـ Slug مطلوب')
  if (!price) throw new Error('السعر مطلوب')
  const priceNum = parseFloat(price)
  if (isNaN(priceNum) || priceNum < 0) throw new Error('السعر يجب أن يكون رقماً موجباً')
  const stockNum = parseInt(stock) || 0
  if (stockNum < 0) throw new Error('المخزون لا يمكن أن يكون سالباً')
  if (compareAtPrice) {
    const cap = parseFloat(compareAtPrice)
    if (!isNaN(cap) && cap <= priceNum) throw new Error('السعر السابق يجب أن يكون أكبر من السعر الحالي')
  }

  const images: string[] = imagesRaw ? JSON.parse(imagesRaw) : []

  try {
    await prisma.product.create({
      data: {
        name: name.trim(),
        slug: slug.trim().toLowerCase(),
        price: priceNum,
        compareAtPrice: compareAtPrice ? parseFloat(compareAtPrice) : null,
        stock: stockNum,
        sku: sku || null,
        brand: brand || null,
        description: description || null,
        category: category || null,
        gender: gender || null,
        size: size || null,
        imageUrl: imageUrl || null,
        images,
        isActive,
        featured,
        bestseller,
      }
    })
  } catch (error: any) {
    if (error?.code === 'P2002') throw new Error('هذا الـ Slug مستخدم بالفعل، اختر رابطاً آخر')
    console.error('Failed to create product:', error)
    throw new Error('فشل في إنشاء المنتج')
  }

  revalidatePath('/admin/products')
  revalidatePath('/products')
  redirect('/admin/products')
}

export async function updateProduct(id: string, formData: FormData) {
  const name = formData.get('name') as string
  const slug = formData.get('slug') as string
  const price = formData.get('price') as string
  const compareAtPrice = formData.get('compareAtPrice') as string
  const stock = formData.get('stock') as string
  const sku = formData.get('sku') as string
  const brand = formData.get('brand') as string
  const description = formData.get('description') as string
  const category = formData.get('category') as string
  const gender = formData.get('gender') as string
  const size = formData.get('size') as string
  const imageUrl = formData.get('imageUrl') as string
  const imagesRaw = formData.get('images') as string
  const isActive = formData.get('isActive') === 'on'
  const featured = formData.get('featured') === 'on'
  const bestseller = formData.get('bestseller') === 'on'

  if (!name || !slug || !price) throw new Error('الاسم والـ Slug والسعر مطلوبة')
  const priceNum = parseFloat(price)
  if (isNaN(priceNum) || priceNum < 0) throw new Error('السعر يجب أن يكون رقماً موجباً')
  const stockNum = parseInt(stock) || 0
  if (compareAtPrice) {
    const cap = parseFloat(compareAtPrice)
    if (!isNaN(cap) && cap <= priceNum) throw new Error('السعر السابق يجب أن يكون أكبر من السعر الحالي')
  }

  const images: string[] = imagesRaw ? JSON.parse(imagesRaw) : []

  try {
    await prisma.product.update({
      where: { id },
      data: {
        name: name.trim(),
        slug: slug.trim().toLowerCase(),
        price: priceNum,
        compareAtPrice: compareAtPrice ? parseFloat(compareAtPrice) : null,
        stock: stockNum,
        sku: sku || null,
        brand: brand || null,
        description: description || null,
        category: category || null,
        gender: gender || null,
        size: size || null,
        imageUrl: imageUrl || null,
        images,
        isActive,
        featured,
        bestseller,
      }
    })
  } catch (error: any) {
    if (error?.code === 'P2002') throw new Error('هذا الـ Slug مستخدم بالفعل')
    console.error('Failed to update product:', error)
    throw new Error('فشل في تحديث المنتج')
  }

  revalidatePath('/admin/products')
  revalidatePath('/products')
  redirect('/admin/products')
}
