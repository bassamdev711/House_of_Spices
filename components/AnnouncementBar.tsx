import Link from 'next/link'
import prisma from '@/lib/prisma'

/**
 * شريط الإعلانات — Server Component
 * يُجلب من DB مرة واحدة ويُعرض أعلى الصفحة
 * لا يُرسَل إلى العميل إذا كان غير مفعَّل
 */
export default async function AnnouncementBar() {
  let bar: {
    message: string
    linkText: string | null
    linkUrl: string | null
    bgColor: string
    textColor: string
    isActive: boolean
  } | null = null

  try {
    bar = await prisma.announcementBar.findUnique({ where: { id: 'singleton' } })
  } catch {
    return null
  }

  if (!bar || !bar.isActive) return null

  return (
    <div
      style={{ backgroundColor: bar.bgColor, color: bar.textColor }}
      className="w-full py-2.5 px-4 text-center text-sm font-medium flex items-center justify-center gap-3 relative z-50"
    >
      <span>{bar.message}</span>
      {bar.linkText && bar.linkUrl && (
        <Link
          href={bar.linkUrl}
          className="underline font-black text-xs opacity-90 hover:opacity-100 transition-opacity"
        >
          {bar.linkText} ←
        </Link>
      )}
    </div>
  )
}
