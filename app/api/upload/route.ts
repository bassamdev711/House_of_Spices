import { put } from '@vercel/blob'
import { NextRequest, NextResponse } from 'next/server'

// الحدود المسموح بها
const MAX_FILE_SIZE = 4 * 1024 * 1024   // 4MB — رفض مطلق
const WARN_FILE_SIZE = 2 * 1024 * 1024  // 2MB — تحذير (يُكمل الرفع)

const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/avif']

export async function POST(request: NextRequest) {
  const formData = await request.formData()
  const file = formData.get('file') as File

  if (!file) {
    return NextResponse.json({ error: 'لم يتم تحديد ملف' }, { status: 400 })
  }

  // التحقق من نوع الملف
  if (!ALLOWED_TYPES.includes(file.type)) {
    return NextResponse.json(
      { error: 'نوع الملف غير مدعوم. استخدم JPG أو PNG أو WebP أو AVIF فقط.' },
      { status: 400 }
    )
  }

  // رفض الصور الضخمة جداً (أكثر من 4MB)
  if (file.size > MAX_FILE_SIZE) {
    return NextResponse.json(
      {
        error: `حجم الصورة (${(file.size / 1024 / 1024).toFixed(1)}MB) يتجاوز الحد المسموح (4MB). يرجى ضغط الصورة قبل الرفع.`,
        code: 'FILE_TOO_LARGE',
      },
      { status: 413 }
    )
  }

  // تحذير للتاجر (يُكمل الرفع لكن يُعيد warning)
  const warning =
    file.size > WARN_FILE_SIZE
      ? `تنبيه: الصورة كبيرة (${(file.size / 1024 / 1024).toFixed(1)}MB). يُنصح بضغطها لتحسين سرعة الموقع.`
      : undefined

  // اسم الملف: يتضمن timestamp لضمان uniqueness وتسهيل cache
  const ext = file.name.split('.').pop()?.toLowerCase() || 'jpg'
  const safeName = file.name
    .replace(/\.[^.]+$/, '')
    .replace(/\s+/g, '-')
    .replace(/[^a-zA-Z0-9-_\u0600-\u06FF]/g, '')
    .slice(0, 40)
  const filename = `products/${Date.now()}-${safeName}.${ext}`

  try {
    const { url } = await put(filename, file, {
      access: 'public',
      token: process.env.BLOB_READ_WRITE_TOKEN,
      // Cache-Control: سنة كاملة للصور المرفوعة (immutable بسبب timestamp في الاسم)
      cacheControlMaxAge: 31536000,
    })

    return NextResponse.json({ url, warning })
  } catch (error: unknown) {
    console.error('Blob upload error:', error)
    const message = error instanceof Error ? error.message : 'فشل رفع الصورة'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
