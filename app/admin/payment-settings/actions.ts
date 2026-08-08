'use server'

import prisma from '@/lib/prisma'
import { revalidatePath } from 'next/cache'

export async function getPaymentSettings() {
  const settings = await prisma.paymentSettings.findUnique({
    where: { id: 'singleton' }
  })
  if (!settings) {
    return prisma.paymentSettings.create({
      data: {
        id: 'singleton'
      }
    })
  }
  return settings
}

export async function updatePaymentSettings(data: any) {
  try {
    await prisma.paymentSettings.upsert({
      where: { id: 'singleton' },
      update: data,
      create: { id: 'singleton', ...data }
    })
    revalidatePath('/admin/payment-settings')
    revalidatePath('/checkout')
    return { success: true }
  } catch (error: any) {
    console.error('Failed to update settings:', error)
    return { success: false, error: 'فشل تحديث الإعدادات' }
  }
}

export async function addBankAccount(data: any) {
  try {
    await prisma.bankAccount.create({ data })
    revalidatePath('/admin/payment-settings')
    revalidatePath('/checkout')
    return { success: true }
  } catch (error) {
    return { success: false, error: 'فشل إضافة الحساب' }
  }
}

export async function deleteBankAccount(id: string) {
  try {
    await prisma.bankAccount.delete({ where: { id } })
    revalidatePath('/admin/payment-settings')
    revalidatePath('/checkout')
    return { success: true }
  } catch (error) {
    return { success: false, error: 'فشل حذف الحساب' }
  }
}

export async function addDigitalWallet(data: any) {
  try {
    await prisma.digitalWallet.create({ data })
    revalidatePath('/admin/payment-settings')
    revalidatePath('/checkout')
    return { success: true }
  } catch (error) {
    return { success: false, error: 'فشل إضافة المحفظة' }
  }
}

export async function deleteDigitalWallet(id: string) {
  try {
    await prisma.digitalWallet.delete({ where: { id } })
    revalidatePath('/admin/payment-settings')
    revalidatePath('/checkout')
    return { success: true }
  } catch (error) {
    return { success: false, error: 'فشل حذف المحفظة' }
  }
}
