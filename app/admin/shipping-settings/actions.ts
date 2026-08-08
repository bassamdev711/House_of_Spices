'use server'

import { verifyAdmin } from '@/lib/auth'

import prisma from '@/lib/prisma'
import { revalidatePath } from 'next/cache'

export async function getStoreSettings() {
  await verifyAdmin();

  let settings = await prisma.storeSettings.findUnique({ where: { id: 'singleton' } })
  if (!settings) {
    settings = await prisma.storeSettings.create({
      data: {
        id: 'singleton',
        shippingFee: 0,
        freeShippingThreshold: 0
      }
    })
  }
  return settings
}

export async function updateStoreSettings(data: { shippingFee: number; freeShippingThreshold: number }) {
  await verifyAdmin();

  try {
    await prisma.storeSettings.upsert({
      where: { id: 'singleton' },
      update: {
        shippingFee: data.shippingFee,
        freeShippingThreshold: data.freeShippingThreshold
      },
      create: {
        id: 'singleton',
        shippingFee: data.shippingFee,
        freeShippingThreshold: data.freeShippingThreshold
      }
    })
    revalidatePath('/admin/shipping-settings')
    revalidatePath('/cart')
    revalidatePath('/checkout')
    return { success: true }
  } catch (e) {
    console.error(e)
    return { success: false, error: 'فشل في تحديث الإعدادات' }
  }
}
