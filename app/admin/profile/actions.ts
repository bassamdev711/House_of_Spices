'use server'

import prisma from '@/lib/prisma'
import { verifyAdmin } from '@/lib/auth'
import { hashPassword, verifyPassword } from '@/lib/hash'
import { revalidatePath } from 'next/cache'

export async function setupAdminProfile(formData: FormData) {
  await verifyAdmin()

  const name = formData.get('name') as string
  const avatarUrl = formData.get('avatarUrl') as string
  const password = formData.get('password') as string

  if (!name || !password) {
    return { success: false, error: 'الاسم وكلمة المرور مطلوبان' }
  }

  if (password.length < 6) {
    return { success: false, error: 'يجب أن لا تقل كلمة المرور عن 6 أحرف' }
  }

  const hashedPassword = hashPassword(password)

  await prisma.adminProfile.upsert({
    where: { id: 'singleton' },
    update: {
      name,
      avatarUrl: avatarUrl || null,
      passwordHash: hashedPassword,
      isSetupComplete: true
    },
    create: {
      id: 'singleton',
      name,
      avatarUrl: avatarUrl || null,
      passwordHash: hashedPassword,
      isSetupComplete: true
    }
  })

  revalidatePath('/admin')
  return { success: true }
}

export async function updateAdminProfile(formData: FormData) {
  await verifyAdmin()

  const name = formData.get('name') as string
  const avatarUrl = formData.get('avatarUrl') as string
  const themeBackground = formData.get('themeBackground') as string
  const currentPassword = formData.get('currentPassword') as string
  const newPassword = formData.get('newPassword') as string

  const profile = await prisma.adminProfile.findUnique({
    where: { id: 'singleton' }
  })

  if (!profile) {
    return { success: false, error: 'البروفايل غير موجود' }
  }

  // Update logic
  let updatedPasswordHash = profile.passwordHash

  if (newPassword) {
    if (!currentPassword) {
      return { success: false, error: 'يجب إدخال كلمة المرور الحالية لتغيير كلمة المرور' }
    }
    
    // Verify current password against DB or env
    let isValid = false
    if (profile.passwordHash) {
      isValid = verifyPassword(currentPassword, profile.passwordHash)
    } else {
      isValid = currentPassword === process.env.ADMIN_PASSWORD
    }

    if (!isValid) {
      return { success: false, error: 'كلمة المرور الحالية غير صحيحة' }
    }

    if (newPassword.length < 6) {
      return { success: false, error: 'يجب أن لا تقل كلمة المرور الجديدة عن 6 أحرف' }
    }

    updatedPasswordHash = hashPassword(newPassword)
  }

  await prisma.adminProfile.update({
    where: { id: 'singleton' },
    data: {
      name: name || profile.name,
      avatarUrl: avatarUrl || profile.avatarUrl,
      themeBackground: themeBackground || profile.themeBackground,
      passwordHash: updatedPasswordHash
    }
  })

  revalidatePath('/admin')
  return { success: true }
}
