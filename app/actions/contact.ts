'use server'

import prisma from '@/lib/prisma'
import { revalidatePath } from 'next/cache'

export async function submitContactMessage(data: { name: string, phone: string, email: string, message: string }) {
  try {
    if (!data.name || !data.phone || !data.email || !data.message) {
      return { success: false, error: 'يرجى تعبئة جميع الحقول' }
    }

    await prisma.contactMessage.create({
      data: {
        name: data.name,
        phone: data.phone,
        email: data.email,
        message: data.message,
      }
    })

    revalidatePath('/admin/inbox')
    return { success: true, message: 'تم إرسال رسالتك بنجاح. سنتواصل معك قريباً!' }
  } catch (error) {
    console.error('Submit contact message error:', error)
    return { success: false, error: 'حدث خطأ أثناء إرسال الرسالة' }
  }
}

export async function getContactMessages() {
  try {
    const messages = await prisma.contactMessage.findMany({
      orderBy: { createdAt: 'desc' }
    })
    return { success: true, data: messages }
  } catch (error) {
    console.error('Get contact messages error:', error)
    return { success: false, error: 'حدث خطأ أثناء جلب الرسائل' }
  }
}

export async function markMessageAsRead(id: string) {
  try {
    await prisma.contactMessage.update({
      where: { id },
      data: { isRead: true }
    })
    revalidatePath('/admin/inbox')
    return { success: true }
  } catch (error) {
    console.error('Mark message as read error:', error)
    return { success: false, error: 'حدث خطأ' }
  }
}

export async function deleteMessage(id: string) {
  try {
    await prisma.contactMessage.delete({
      where: { id }
    })
    revalidatePath('/admin/inbox')
    return { success: true }
  } catch (error) {
    console.error('Delete message error:', error)
    return { success: false, error: 'حدث خطأ أثناء الحذف' }
  }
}
