'use server'

import prisma from '@/lib/prisma'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

// ── إنشاء كوبون جديد ──────────────────────────────────────
export async function createCoupon(formData: FormData) {
  const code = (formData.get('code') as string).toUpperCase().trim()
  const description = formData.get('description') as string | null
  const type = formData.get('type') as string
  const value = Number(formData.get('value'))
  const minOrderAmount = formData.get('minOrderAmount') ? Number(formData.get('minOrderAmount')) : null
  const maxUses = formData.get('maxUses') ? Number(formData.get('maxUses')) : null
  const expiresAt = formData.get('expiresAt') ? new Date(formData.get('expiresAt') as string) : null
  const isActive = formData.get('isActive') === 'on'

  if (!code || !type || !value) {
    return { error: 'الكود والنوع والقيمة مطلوبة' }
  }

  await prisma.coupon.create({
    data: {
      code,
      description: description || undefined,
      type,
      value,
      minOrderAmount: minOrderAmount ?? undefined,
      maxUses: maxUses ?? undefined,
      expiresAt: expiresAt ?? undefined,
      isActive,
    }
  })

  revalidatePath('/admin/marketing/coupons')
  redirect('/admin/marketing/coupons')
}

// ── تحديث كوبون ───────────────────────────────────────────
export async function updateCoupon(formData: FormData) {
  const id = formData.get('id') as string
  const code = (formData.get('code') as string).toUpperCase().trim()
  const description = formData.get('description') as string | null
  const type = formData.get('type') as string
  const value = Number(formData.get('value'))
  const minOrderAmount = formData.get('minOrderAmount') ? Number(formData.get('minOrderAmount')) : null
  const maxUses = formData.get('maxUses') ? Number(formData.get('maxUses')) : null
  const expiresAt = formData.get('expiresAt') ? new Date(formData.get('expiresAt') as string) : null
  const isActive = formData.get('isActive') === 'on'

  await prisma.coupon.update({
    where: { id },
    data: {
      code,
      description: description || undefined,
      type,
      value,
      minOrderAmount: minOrderAmount ?? undefined,
      maxUses: maxUses ?? undefined,
      expiresAt: expiresAt ?? undefined,
      isActive,
    }
  })

  revalidatePath('/admin/marketing/coupons')
  redirect('/admin/marketing/coupons')
}

// ── حذف كوبون ─────────────────────────────────────────────
export async function deleteCoupon(id: string) {
  await prisma.coupon.delete({ where: { id } })
  revalidatePath('/admin/marketing/coupons')
  return { success: true }
}

// ── تفعيل/تعطيل كوبون ─────────────────────────────────────
export async function toggleCoupon(id: string, isActive: boolean) {
  await prisma.coupon.update({
    where: { id },
    data: { isActive }
  })
  revalidatePath('/admin/marketing/coupons')
  return { success: true }
}

// ── التحقق من صحة الكوبون (يستخدمها API route أيضاً) ───────
export async function validateCouponCode(code: string, orderTotal: number) {
  const coupon = await prisma.coupon.findUnique({
    where: { code: code.toUpperCase().trim() }
  })

  if (!coupon) return { valid: false, error: 'الكوبون غير موجود' }
  if (!coupon.isActive) return { valid: false, error: 'هذا الكوبون غير مفعَّل' }
  if (coupon.expiresAt && coupon.expiresAt < new Date()) {
    return { valid: false, error: 'انتهت صلاحية هذا الكوبون' }
  }
  if (coupon.maxUses !== null && coupon.usedCount >= coupon.maxUses) {
    return { valid: false, error: 'تم استنفاد الحد الأقصى لاستخدام هذا الكوبون' }
  }
  if (coupon.minOrderAmount !== null && orderTotal < Number(coupon.minOrderAmount)) {
    return {
      valid: false,
      error: `الحد الأدنى للطلب لاستخدام هذا الكوبون هو ${Number(coupon.minOrderAmount).toLocaleString('ar-SA')} ر.س`
    }
  }

  const discountAmount =
    coupon.type === 'PERCENTAGE'
      ? (orderTotal * Number(coupon.value)) / 100
      : Math.min(Number(coupon.value), orderTotal)

  return {
    valid: true,
    coupon: {
      id: coupon.id,
      code: coupon.code,
      type: coupon.type,
      value: Number(coupon.value),
      discountAmount: Math.round(discountAmount * 100) / 100,
    }
  }
}
