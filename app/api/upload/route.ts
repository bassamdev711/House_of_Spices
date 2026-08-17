import { put } from '@vercel/blob'
import { NextRequest, NextResponse } from 'next/server'
import { verifyAdmin } from '@/lib/auth'
import prisma from '@/lib/prisma'
import { checkRateLimit } from '@/lib/rate-limit'
import { verifyPaymentUploadToken } from '@/lib/payment-upload-token'
import crypto from 'crypto'

// ── حدود الملف ────────────────────────────────────────────────
const MAX_FILE_SIZE = 4 * 1024 * 1024   // 4MB — رفض مطلق
const WARN_FILE_SIZE = 2 * 1024 * 1024  // 2MB — تحذير

// ── الأنواع المسموحة بصرامة ──────────────────────────────────
const ALLOWED_MIME_TYPES = new Set([
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/avif',
  'application/pdf',
])

// ── التحقق من Magic Bytes (محتوى الملف الحقيقي) ─────────────
const MAGIC_BYTES: Record<string, { magic: Buffer; ext: string; mime: string }[]> = {
  'image/jpeg': [{ magic: Buffer.from([0xff, 0xd8, 0xff]), ext: 'jpg', mime: 'image/jpeg' }],
  'image/png':  [{ magic: Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]), ext: 'png', mime: 'image/png' }],
  'image/webp': [{ magic: Buffer.from([0x52, 0x49, 0x46, 0x46]), ext: 'webp', mime: 'image/webp' }],
  'application/pdf': [{ magic: Buffer.from([0x25, 0x50, 0x44, 0x46]), ext: 'pdf', mime: 'application/pdf' }],
}

function detectFileType(buffer: Buffer): { ext: string; mime: string } | null {
  for (const [, signatures] of Object.entries(MAGIC_BYTES)) {
    for (const sig of signatures) {
      if (buffer.subarray(0, sig.magic.length).equals(sig.magic)) {
        // Extra WebP validation: bytes 8-11 must be "WEBP"
        if (sig.mime === 'image/webp') {
          const riff = buffer.subarray(0, 4)
          const webp = buffer.subarray(8, 12)
          if (!riff.equals(Buffer.from([0x52, 0x49, 0x46, 0x46]))) continue
          if (webp.toString('ascii') !== 'WEBP') continue
        }
        return { ext: sig.ext, mime: sig.mime }
      }
    }
  }
  return null
}

// ── AVIF validation via container check ──────────────────────
function isAvif(buffer: Buffer): boolean {
  // AVIF uses ISOBMFF container: ftyp box at byte 4 with 'avif' or 'avis' brand
  if (buffer.length < 12) return false
  const ftyp = buffer.subarray(4, 8).toString('ascii')
  const brand = buffer.subarray(8, 12).toString('ascii')
  return ftyp === 'ftyp' && (brand === 'avif' || brand === 'avis')
}

export async function POST(request: NextRequest) {
  // ── تحديد الـ IP ─────────────────────────────────────────
  const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || '127.0.0.1'

  let isAdmin = false
  try {
    const token = request.cookies.get('admin_token')?.value
    await verifyAdmin(token)
    isAdmin = true
  } catch {
    // Public checkout uploads require a separate signed payment-upload token.
  }

  // ── Rate Limiting (غير الأدمن: 10/ساعة — الأدمن: 30/ساعة) ─
  const limitKey = isAdmin ? `upload_admin_${ip}` : `upload_user_${ip}`
  const uploadLimit = isAdmin ? 30 : 10
  if (!checkRateLimit(limitKey, uploadLimit, 60 * 60 * 1000)) {
    return NextResponse.json(
      { error: 'تم تجاوز حد رفع الملفات. يرجى المحاولة لاحقاً.' },
      { status: 429 }
    )
  }

  // ── قراءة البيانات ────────────────────────────────────────
  const formData = await request.formData()
  const fileValue = formData.get('file')
  const file = fileValue instanceof File ? fileValue : null
  const orderIdValue = formData.get('orderId')
  const orderId = typeof orderIdValue === 'string' ? orderIdValue.trim() : null
  const uploadTokenValue = formData.get('uploadToken')
  const uploadToken = typeof uploadTokenValue === 'string' ? uploadTokenValue : null

  if (!file) {
    return NextResponse.json({ error: 'لم يتم تحديد ملف' }, { status: 400 })
  }

  // ── التحقق من الصلاحية لغير الأدمن ──────────────────────
  if (!isAdmin) {
    if (!orderId || !uploadToken || !(await verifyPaymentUploadToken(uploadToken, orderId))) {
      return NextResponse.json({ error: 'يجب إنشاء الطلب أولاً قبل رفع الإيصال' }, { status: 401 })
    }

    const order = await prisma.order.findUnique({ where: { id: orderId } })
    if (!order || !['AWAITING_PAYMENT', 'PENDING', 'REJECTED'].includes(order.paymentStatus)) {
      return NextResponse.json({ error: 'غير مصرح برفع الإيصال لهذا الطلب' }, { status: 403 })
    }
  }

  // ── التحقق من MIME Type المُرسَل من العميل ───────────────
  if (!ALLOWED_MIME_TYPES.has(file.type)) {
    return NextResponse.json(
      { error: 'نوع الملف غير مدعوم. يُسمح فقط بـ JPEG و PNG و WebP و AVIF و PDF.' },
      { status: 400 }
    )
  }

  // ── التحقق من حجم الملف ──────────────────────────────────
  if (file.size > MAX_FILE_SIZE) {
    return NextResponse.json(
      {
        error: `حجم الملف (${(file.size / 1024 / 1024).toFixed(1)}MB) يتجاوز الحد المسموح (4MB).`,
        code: 'FILE_TOO_LARGE',
      },
      { status: 413 }
    )
  }

  // ── التحقق من Magic Bytes (محتوى الملف الحقيقي) ─────────
  const arrayBuffer = await file.arrayBuffer()
  const buffer = Buffer.from(arrayBuffer)

  let detectedType = detectFileType(buffer)

  // AVIF لا تطابق magic bytes البسيطة — نتحقق بطريقة خاصة
  if (!detectedType && isAvif(buffer)) {
    detectedType = { ext: 'avif', mime: 'image/avif' }
  }

  if (!detectedType) {
    return NextResponse.json(
      { error: 'محتوى الملف لا يطابق النوع المُعلَن عنه. رُفض الرفع.' },
      { status: 415 }
    )
  }

  // تأكيد: نوع الملف الحقيقي يجب أن يتطابق مع ما أرسله العميل
  if (file.type !== 'image/avif' && detectedType.mime !== file.type) {
    return NextResponse.json(
      { error: 'نوع الملف الحقيقي لا يطابق الامتداد المُعلَن. رُفض الرفع.' },
      { status: 415 }
    )
  }

  const warning =
    file.size > WARN_FILE_SIZE
      ? `تنبيه: الصورة كبيرة (${(file.size / 1024 / 1024).toFixed(1)}MB). يُنصح بضغطها لتحسين سرعة الموقع.`
      : undefined

  // ── اسم ملف عشوائي بالكامل (لا نستخدم اسم العميل) ──────
  const randomName = crypto.randomBytes(16).toString('hex')
  const folder = isAdmin ? 'products' : 'receipts'
  const filename = `${folder}/${Date.now()}-${randomName}.${detectedType.ext}`

  // ── التحقق من توفر الـ Token ──────────────────────────────
  const blobToken = process.env.BLOB_READ_WRITE_TOKEN
  if (!blobToken) {
    console.error('BLOB_READ_WRITE_TOKEN is not configured')
    return NextResponse.json({ error: 'خطأ في إعدادات الخادم' }, { status: 500 })
  }

  try {
    const { url } = await put(filename, buffer, {
      access: 'public',
      token: blobToken,
      contentType: detectedType.mime,
      cacheControlMaxAge: 31536000,
    })

    return NextResponse.json({ url, warning })
  } catch (error: unknown) {
    console.error('Blob upload error:', error)
    return NextResponse.json({ error: 'فشل رفع الملف. يرجى المحاولة لاحقاً.' }, { status: 500 })
  }
}
