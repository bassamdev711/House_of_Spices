'use server'

import prisma from '@/lib/prisma'
import { revalidatePath } from 'next/cache'

// ── حفظ/تحديث شريط الإعلانات ──────────────────────────────
export async function saveAnnouncementBar(formData: FormData) {
  const message = formData.get('message') as string
  const linkText = formData.get('linkText') as string | null
  const linkUrl = formData.get('linkUrl') as string | null
  const bgColor = formData.get('bgColor') as string
  const textColor = formData.get('textColor') as string
  const isActive = formData.get('isActive') === 'on'

  await prisma.announcementBar.upsert({
    where: { id: 'singleton' },
    update: {
      message,
      linkText: linkText || null,
      linkUrl: linkUrl || null,
      bgColor: bgColor || '#1a544a',
      textColor: textColor || '#ffffff',
      isActive,
    },
    create: {
      id: 'singleton',
      message,
      linkText: linkText || null,
      linkUrl: linkUrl || null,
      bgColor: bgColor || '#1a544a',
      textColor: textColor || '#ffffff',
      isActive,
    }
  })

  revalidatePath('/')
  revalidatePath('/admin/marketing/announcement')
}

// ── تفعيل/تعطيل الشريط بسرعة ──────────────────────────────
export async function toggleAnnouncementBar(isActive: boolean) {
  await prisma.announcementBar.upsert({
    where: { id: 'singleton' },
    update: { isActive },
    create: {
      id: 'singleton',
      message: 'مرحباً بكم في متجر طيف',
      isActive,
    }
  })

  revalidatePath('/')
  revalidatePath('/admin/marketing/announcement')
}
