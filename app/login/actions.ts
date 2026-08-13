'use server'

import { cookies, headers } from 'next/headers'
import { SignJWT } from 'jose'
import prisma from '@/lib/prisma'
import { verifyPassword } from '@/lib/hash'
import { checkRateLimit } from '@/lib/rate-limit'

export async function login(password: string) {
  const JWT_SECRET = process.env.JWT_SECRET
  const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD

  // Rate limiting: 5 attempts per 15 minutes per IP
  const headersList = await headers()
  const ip = headersList.get('x-forwarded-for')?.split(',')[0]?.trim() || '127.0.0.1'

  if (!checkRateLimit(`login_${ip}`, 5, 15 * 60 * 1000)) {
    // Consistent delay to prevent timing attacks even on rate-limit response
    await new Promise(resolve => setTimeout(resolve, 2000))
    return { success: false, error: 'تم تجاوز الحد المسموح به لمحاولات تسجيل الدخول. يرجى الانتظار 15 دقيقة والمحاولة مجدداً.' }
  }

  if (!JWT_SECRET || !ADMIN_PASSWORD) {
    throw new Error('CRITICAL: JWT_SECRET or ADMIN_PASSWORD is not set in environment variables.')
  }

  let isPasswordValid = false

  try {
    const adminProfile = await prisma.adminProfile.findUnique({
      where: { id: 'singleton' }
    })

    if (adminProfile && adminProfile.isSetupComplete && adminProfile.passwordHash) {
      // Setup complete — verify against stored hash
      isPasswordValid = verifyPassword(password, adminProfile.passwordHash)
    } else {
      // First login — use env variable password
      isPasswordValid = (password === ADMIN_PASSWORD)
    }
  } catch (error) {
    console.error("Error verifying admin profile:", error)
    // Fallback to env password if DB is unavailable
    isPasswordValid = (password === ADMIN_PASSWORD)
  }

  if (isPasswordValid) {
    const secret = new TextEncoder().encode(JWT_SECRET)
    const token = await new SignJWT({ role: 'admin' })
      .setProtectedHeader({ alg: 'HS256' })
      .setIssuedAt()
      .setExpirationTime('8h')  // Reduced from 7d to 8h for security
      .sign(secret)

    const cookieStore = await cookies()
    cookieStore.set('admin_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',   // Upgraded from 'lax' to 'strict' for admin
      path: '/admin',       // Scope cookie to /admin only
      maxAge: 60 * 60 * 8  // 8 hours
    })

    return { success: true }
  }

  // Artificial delay to mitigate brute-force timing attacks
  await new Promise(resolve => setTimeout(resolve, 2000))

  return { success: false, error: 'كلمة المرور غير صحيحة' }
}

export async function logout() {
  const cookieStore = await cookies()
  cookieStore.delete('admin_token')
}
