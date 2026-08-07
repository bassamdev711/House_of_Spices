import { put } from '@vercel/blob'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  const formData = await request.formData()
  const file = formData.get('file') as File
  
  if (!file) {
    return NextResponse.json({ error: 'لم يتم تحديد ملف' }, { status: 400 })
  }

  // Validate file type
  const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/avif']
  if (!allowedTypes.includes(file.type)) {
    return NextResponse.json({ error: 'نوع الملف غير مدعوم. استخدم JPG أو PNG أو WebP' }, { status: 400 })
  }

  // Validate file size (max 5MB)
  if (file.size > 5 * 1024 * 1024) {
    return NextResponse.json({ error: 'حجم الملف يجب أن يكون أقل من 5MB' }, { status: 400 })
  }

  const filename = `products/${Date.now()}-${file.name.replace(/\s+/g, '-')}`
  
  try {
    const { url } = await put(filename, file, {
      access: 'public',
      // Ensure token is passed if it's not automatically picked up from env in some environments
      token: process.env.BLOB_READ_WRITE_TOKEN,
    })
    
    return NextResponse.json({ url })
  } catch (error: any) {
    console.error('Blob upload error:', error)
    return NextResponse.json({ error: error.message || 'فشل رفع الصورة' }, { status: 500 })
  }
}
