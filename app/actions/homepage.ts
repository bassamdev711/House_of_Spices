'use server'

import prisma from '@/lib/prisma'
import { revalidatePath } from 'next/cache'
import { verifyAdmin } from '@/lib/auth'
import type { Prisma } from '@prisma/client'

const HOMEPAGE_FIELDS = [
  'heroTitle', 'heroSubtitle', 'heroDescription', 'heroPrimaryButton', 'heroSecondaryButton',
  'aboutTopTitle', 'aboutMainTitle', 'aboutQuote', 'aboutDescription',
  'expTopTitle', 'expMainTitle', 'expBox1Title', 'expBox1Desc', 'expBox2Title', 'expBox2Desc',
  'statsJson',
] as const

type HomepageField = typeof HOMEPAGE_FIELDS[number]
type HomepageInput = Partial<Record<HomepageField, unknown>>

const MAX_TEXT_LENGTH = 5000

function sanitizeHomepageInput(data: unknown): Prisma.HomepageSettingsUpdateInput {
  if (!data || typeof data !== 'object' || Array.isArray(data)) {
    throw new Error('بيانات محتوى الصفحة الرئيسية غير صالحة')
  }

  const input = data as HomepageInput
  const allowed = new Set<string>(HOMEPAGE_FIELDS)
  const update: Partial<Record<HomepageField, string>> = {}

  for (const [key, value] of Object.entries(input)) {
    if (!allowed.has(key) || value === undefined) continue
    if (typeof value !== 'string') {
      throw new Error(`قيمة غير صالحة للحقل ${key}`)
    }

    const cleanValue = value.trim()
    if (cleanValue.length > MAX_TEXT_LENGTH) {
      throw new Error(`الحقل ${key} يتجاوز الحد المسموح`)
    }

    if (key === 'statsJson') {
      let parsed: unknown
      try {
        parsed = JSON.parse(cleanValue)
      } catch {
        throw new Error('صيغة الإحصائيات غير صالحة')
      }
      if (!Array.isArray(parsed) || parsed.length > 20) {
        throw new Error('صيغة الإحصائيات غير صالحة')
      }
    }

    update[key as HomepageField] = cleanValue
  }

  if (Object.keys(update).length === 0) {
    throw new Error('لا توجد بيانات صالحة للتحديث')
  }

  return update as Prisma.HomepageSettingsUpdateInput
}

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

export async function updateHomepageSettings(data: unknown) {
  await verifyAdmin()

  try {
    const update = sanitizeHomepageInput(data)
    const settings = await prisma.homepageSettings.upsert({
      where: { id: 'singleton' },
      update,
      create: {
        id: 'singleton',
        ...update,
      } as Prisma.HomepageSettingsCreateInput
    })

    revalidatePath('/')
    revalidatePath('/admin/homepage-content')

    return { success: true, data: settings }
  } catch (error) {
    console.error('Error updating homepage settings:', error)
    return { success: false, error: 'حدث خطأ أثناء تحديث الإعدادات' }
  }
}
