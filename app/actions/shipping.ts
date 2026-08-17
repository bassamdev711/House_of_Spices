'use server'

import prisma from '@/lib/prisma'
import { revalidatePath } from 'next/cache'
import { verifyAdmin } from '@/lib/auth'

const MAX_SHIPPING_FEE = 1_000_000

function cleanCityName(value: unknown): string {
  if (typeof value !== 'string') throw new Error('اسم المدينة غير صالح')
  const name = value.trim()
  if (name.length < 2 || name.length > 120) throw new Error('اسم المدينة غير صالح')
  return name
}

function cleanShippingFee(value: unknown): number {
  if (typeof value !== 'number' || !Number.isFinite(value) || value < 0 || value > MAX_SHIPPING_FEE) {
    throw new Error('رسوم الشحن غير صالحة')
  }
  return Math.round(value * 100) / 100
}

export async function getShippingCities() {
  try {
    const cities = await prisma.shippingCity.findMany({
      where: { isActive: true },
      orderBy: { name: 'asc' }
    })
    return { success: true, data: cities }
  } catch (error) {
    console.error('Error fetching shipping cities:', error)
    return { success: false, error: 'حدث خطأ أثناء جلب مدن الشحن' }
  }
}

export async function addShippingCity(data: { name: string; shippingFee: number; isActive?: boolean }) {
  await verifyAdmin()

  try {
    const name = cleanCityName(data?.name)
    const shippingFee = cleanShippingFee(data?.shippingFee)
    const isActive = data?.isActive ?? true

    if (typeof isActive !== 'boolean') throw new Error('حالة المدينة غير صالحة')

    const existing = await prisma.shippingCity.findUnique({ where: { name } })
    if (existing) return { success: false, error: 'هذه المدينة موجودة مسبقاً' }

    const city = await prisma.shippingCity.create({
      data: { name, shippingFee, isActive }
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
  await verifyAdmin()

  try {
    if (typeof id !== 'string' || id.trim().length === 0) throw new Error('معرّف المدينة غير صالح')

    const updateData: { name?: string; shippingFee?: number; isActive?: boolean } = {}
    if (data?.name !== undefined) updateData.name = cleanCityName(data.name)
    if (data?.shippingFee !== undefined) updateData.shippingFee = cleanShippingFee(data.shippingFee)
    if (data?.isActive !== undefined) {
      if (typeof data.isActive !== 'boolean') throw new Error('حالة المدينة غير صالحة')
      updateData.isActive = data.isActive
    }
    if (Object.keys(updateData).length === 0) throw new Error('لا توجد بيانات للتحديث')

    if (updateData.name) {
      const duplicate = await prisma.shippingCity.findFirst({
        where: { name: updateData.name, NOT: { id } },
        select: { id: true },
      })
      if (duplicate) return { success: false, error: 'هذه المدينة موجودة مسبقاً' }
    }

    const city = await prisma.shippingCity.update({ where: { id }, data: updateData })
    revalidatePath('/admin/shipping-settings')
    revalidatePath('/checkout')
    return { success: true, data: city }
  } catch (error) {
    console.error('Error updating shipping city:', error)
    return { success: false, error: 'حدث خطأ أثناء تحديث المدينة' }
  }
}

export async function deleteShippingCity(id: string) {
  await verifyAdmin()

  try {
    if (typeof id !== 'string' || id.trim().length === 0) throw new Error('معرّف المدينة غير صالح')
    await prisma.shippingCity.delete({ where: { id } })
    revalidatePath('/admin/shipping-settings')
    revalidatePath('/checkout')
    return { success: true }
  } catch (error) {
    console.error('Error deleting shipping city:', error)
    return { success: false, error: 'حدث خطأ أثناء حذف المدينة' }
  }
}
