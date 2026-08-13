'use server'

import { cookies } from 'next/headers'
import { SignJWT } from 'jose'
import prisma from '@/lib/prisma'
import { verifyPassword } from '@/lib/hash'

export async function login(password: string) {
  const JWT_SECRET = process.env.JWT_SECRET
  const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD

  if (!JWT_SECRET || !ADMIN_PASSWORD) {
    if (process.env.NODE_ENV === 'production') {
      throw new Error('CRITICAL: JWT_SECRET or ADMIN_PASSWORD is not set in environment variables.')
    }
  }

  const secretToUse = JWT_SECRET || 'dev-secret-only'
  let passwordToUse = ADMIN_PASSWORD || 'dev-password-only'
  let isPasswordValid = false

  try {
    const adminProfile = await prisma.adminProfile.findUnique({
      where: { id: 'singleton' }
    })

    if (adminProfile && adminProfile.isSetupComplete && adminProfile.passwordHash) {
      // إذا كان الإعداد مكتملًا، نتحقق من الهاش
      isPasswordValid = verifyPassword(password, adminProfile.passwordHash)
    } else {
      // خلاف ذلك، نستخدم كلمة المرور من البيئة (أول دخول)
      isPasswordValid = (password === passwordToUse)
    }
  } catch (error) {
    console.error("Error verifying admin profile:", error)
    // العودة للوضع الافتراضي في حال خطأ قاعدة البيانات
    isPasswordValid = (password === passwordToUse)
  }

  if (isPasswordValid) {
    const secret = new TextEncoder().encode(secretToUse)
    const token = await new SignJWT({ role: 'admin' })
      .setProtectedHeader({ alg: 'HS256' })
      .setExpirationTime('7d')
      .sign(secret)

    // Set HTTP-only cookie
    const cookieStore = await cookies()
    cookieStore.set('admin_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 7 // 7 days
    })

    return { success: true }
  }

  // Artificial delay to mitigate brute-force attacks (2 seconds)
  await new Promise(resolve => setTimeout(resolve, 2000))

  return { success: false, error: 'كلمة المرور غير صحيحة' }
}

export async function logout() {
  const cookieStore = await cookies()
  cookieStore.delete('admin_token')
}
