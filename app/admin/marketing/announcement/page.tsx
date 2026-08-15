import prisma from '@/lib/prisma'
import AnnouncementBarClient from './AnnouncementBarClient'

export const metadata = { title: 'شريط الإعلانات | TIF Admin' }

export default async function AnnouncementBarPage() {
  let bar: any = null
  try {
    bar = await prisma.announcementBar.findUnique({ where: { id: 'singleton' } })
  } catch {
    // DB offline
  }

  const initial = {
    message: bar?.message ?? 'مرحباً بكم في متجر بيت البهارات 🌿',
    linkText: bar?.linkText ?? '',
    linkUrl: bar?.linkUrl ?? '',
    bgColor: bar?.bgColor ?? '#1a544a',
    textColor: bar?.textColor ?? '#ffffff',
    isActive: bar?.isActive ?? false,
  }

  return <AnnouncementBarClient initial={initial} />
}
