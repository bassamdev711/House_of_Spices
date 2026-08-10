'use server'

import prisma from '@/lib/prisma'
import { revalidatePath } from 'next/cache'

export async function getShippingCities() {
  try {
    const cities = await prisma.shippingCity.findMany({
      orderBy: { name: 'asc' }
    })
    return { success: true, data: cities }
  } catch (error) {
    console.error('Error fetching shipping cities:', error)
    return { success: false, error: 'حدث خطأ أثناء جلب مدن الشحن' }
  }
}

export async function addShippingCity(data: { name: string; shippingFee: number; isActive?: boolean }) {
  try {
    const existing = await prisma.shippingCity.findUnique({
      where: { name: data.name }
    })

    if (existing) {
      return { success: false, error: 'هذه المدينة موجودة مسبقاً' }
    }

    const city = await prisma.shippingCity.create({
      data: {
        name: data.name,
        shippingFee: data.shippingFee,
        isActive: data.isActive ?? true
      }
    })

    revalidatePath('/admin/shipping-settings')
    revalidatePath('/checkout')
    
    return { success: true, data: city }
  } catch (error) {
    console.error('Error adding shipping city:', error)
    return { success: false, error: 'حدث خطأ أثناء إضافة المدينة' }
  }
}

export async function updateShippingCity(id: string, data: { name?: string; shippingFee?: number; isActive?: boolean }) {
  try {
    const city = await prisma.shippingCity.update({
      where: { id },
      data
    })

    revalidatePath('/admin/shipping-settings')
    revalidatePath('/checkout')

    return { success: true, data: city }
  } catch (error) {
    console.error('Error updating shipping city:', error)
    return { success: false, error: 'حدث خطأ أثناء تحديث المدينة' }
  }
}

export async function deleteShippingCity(id: string) {
  try {
    await prisma.shippingCity.delete({
      where: { id }
    })

    revalidatePath('/admin/shipping-settings')
    revalidatePath('/checkout')

    return { success: true }
  } catch (error) {
    console.error('Error deleting shipping city:', error)
    return { success: false, error: 'حدث خطأ أثناء حذف المدينة' }
  }
}
