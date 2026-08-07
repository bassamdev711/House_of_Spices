'use server'

import prisma from '@/lib/prisma'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

export async function deleteProduct(id: string) {
  try {
    await prisma.product.delete({
      where: { id }
    })
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
  const stock = formData.get('stock') as string
  const isActive = formData.get('isActive') === 'on'
  const brand = formData.get('brand') as string
  const description = formData.get('description') as string
  
  if (!name || !slug || !price) {
    throw new Error('الاسم، الـ Slug، والسعر مطلوبة')
  }

  try {
    await prisma.product.create({
      data: {
        name,
        slug,
        price: parseFloat(price),
        stock: parseInt(stock) || 0,
        isActive,
        brand: brand || null,
        description: description || null,
        // TODO: Add more fields based on form inputs
      }
    })
  } catch (error) {
    console.error('Failed to create product:', error)
    throw new Error('فشل في إنشاء المنتج. قد يكون الـ Slug مستخدماً بالفعل.')
  }

  revalidatePath('/admin/products')
  redirect('/admin/products')
}

export async function updateProduct(id: string, formData: FormData) {
  const name = formData.get('name') as string
  const slug = formData.get('slug') as string
  const price = formData.get('price') as string
  const stock = formData.get('stock') as string
  const isActive = formData.get('isActive') === 'on'
  const brand = formData.get('brand') as string
  const description = formData.get('description') as string

  if (!name || !slug || !price) {
    throw new Error('الاسم، الـ Slug، والسعر مطلوبة')
  }

  try {
    await prisma.product.update({
      where: { id },
      data: {
        name,
        slug,
        price: parseFloat(price),
        stock: parseInt(stock) || 0,
        isActive,
        brand: brand || null,
        description: description || null,
      }
    })
  } catch (error) {
    console.error('Failed to update product:', error)
    throw new Error('فشل في تحديث المنتج')
  }

  revalidatePath('/admin/products')
  redirect('/admin/products')
}
