'use server'

import prisma from '@/lib/prisma'
import { revalidatePath } from 'next/cache'

export async function getHomepageSettings() {
  try {
    let settings = await prisma.homepageSettings.findUnique({
      where: { id: 'singleton' }
    })

    if (!settings) {
      settings = await prisma.homepageSettings.create({
        data: { id: 'singleton' }
      })
    }

    return { success: true, data: settings }
  } catch (error) {
    console.error('Error fetching homepage settings:', error)
    return { success: false, error: 'حدث خطأ أثناء جلب إعدادات الصفحة الرئيسية' }
  }
}

export async function updateHomepageSettings(data: any) {
  try {
    const settings = await prisma.homepageSettings.upsert({
      where: { id: 'singleton' },
      update: data,
      create: {
        id: 'singleton',
        ...data
      }
    })

    revalidatePath('/')
    revalidatePath('/admin/homepage-content')

    return { success: true, data: settings }
  } catch (error) {
    console.error('Error updating homepage settings:', error)
    return { success: false, error: 'حدث خطأ أثناء تحديث الإعدادات' }
  }
}
