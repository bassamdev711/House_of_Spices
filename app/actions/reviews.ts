'use server'

import prisma from '@/lib/prisma'
import { revalidatePath } from 'next/cache'

export async function addReview(data: {
  name: string
  city?: string
  content: string
  rating: number
  productId?: string
}) {
  try {
    const review = await prisma.review.create({
      data: {
        name: data.name,
        city: data.city,
        content: data.content,
        rating: data.rating,
        productId: data.productId,
        isGlobal: !data.productId, // If no productId, it's global
        status: 'PENDING'
      }
    })

    return { success: true, data: review }
  } catch (error) {
    console.error('Error adding review:', error)
    return { success: false, error: 'حدث خطأ أثناء إرسال المراجعة' }
  }
}

export async function getReviews(productId?: string) {
  try {
    const whereClause: any = { status: 'APPROVED' }
    
    if (productId) {
      whereClause.productId = productId
    } else {
      whereClause.isGlobal = true
    }

    const reviews = await prisma.review.findMany({
      where: whereClause,
      orderBy: { createdAt: 'desc' }
    })

    return { success: true, data: reviews }
  } catch (error) {
    console.error('Error fetching reviews:', error)
    return { success: false, error: 'حدث خطأ أثناء جلب المراجعات' }
  }
}

export async function updateReviewStatus(id: string, status: 'APPROVED' | 'REJECTED' | 'PENDING') {
  try {
    const review = await prisma.review.update({
      where: { id },
      data: { status }
    })

    revalidatePath('/')
    if (review.productId) {
      revalidatePath(`/product/${review.productId}`) // We don't have the slug here directly, might need to revalidate all products or specific one if needed
      // To be safe, just revalidate product page pattern if possible, or fetch the slug
      const product = await prisma.product.findUnique({ where: { id: review.productId }})
      if (product) revalidatePath(`/product/${product.slug}`)
    }

    revalidatePath('/admin/reviews')

    return { success: true, data: review }
  } catch (error) {
    console.error('Error updating review:', error)
    return { success: false, error: 'حدث خطأ أثناء تحديث المراجعة' }
  }
}

export async function deleteReview(id: string) {
  try {
    const review = await prisma.review.delete({
      where: { id }
    })

    revalidatePath('/')
    if (review.productId) {
      const product = await prisma.product.findUnique({ where: { id: review.productId }})
      if (product) revalidatePath(`/product/${product.slug}`)
    }
    revalidatePath('/admin/reviews')

    return { success: true }
  } catch (error) {
    console.error('Error deleting review:', error)
    return { success: false, error: 'حدث خطأ أثناء حذف المراجعة' }
  }
}
