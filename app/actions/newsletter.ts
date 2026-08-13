'use server'

import prisma from '@/lib/prisma'
import { revalidatePath } from 'next/cache'
import { verifyAdmin } from '@/lib/auth'

export async function subscribeToNewsletter(email: string) {
  try {
    if (!email || !email.includes('@')) {
      return { success: false, error: 'بريد إلكتروني غير صالح' }
    }

    const existing = await prisma.newsletterSubscriber.findUnique({
      where: { email }
    })

    if (existing) {
      if (!existing.isActive) {
        await prisma.newsletterSubscriber.update({
          where: { email },
          data: { isActive: true }
        })
      }
      return { success: true, message: 'أنت مشترك بالفعل!' }
    }

    await prisma.newsletterSubscriber.create({
      data: { email }
    })

    revalidatePath('/admin/marketing/newsletter')
    return { success: true, message: 'تم الاشتراك بنجاح!' }
  } catch (error) {
    console.error('Newsletter subscription error:', error)
    return { success: false, error: 'حدث خطأ أثناء الاشتراك' }
  }
}

export async function deleteSubscriber(id: string) {
  await verifyAdmin()
  try {
    await prisma.newsletterSubscriber.delete({
      where: { id }
    })
    revalidatePath('/admin/marketing/newsletter')
    return { success: true }
  } catch (error) {
    console.error('Delete subscriber error:', error)
    return { success: false, error: 'حدث خطأ أثناء الحذف' }
  }
}

export async function getSubscribers() {
  await verifyAdmin()
  try {
    const subscribers = await prisma.newsletterSubscriber.findMany({
      orderBy: { createdAt: 'desc' }
    })
    return { success: true, data: subscribers }
  } catch (error) {
    console.error('Get subscribers error:', error)
    return { success: false, error: 'حدث خطأ أثناء جلب المشتركين' }
  }
}
