'use server'

import { cookies } from 'next/headers'
import { SignJWT } from 'jose'

const JWT_SECRET = process.env.JWT_SECRET || 'fallback-secret'
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'luxearoma2024'

export async function login(password: string) {
  if (password === ADMIN_PASSWORD) {
    const secret = new TextEncoder().encode(JWT_SECRET)
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

  return { success: false, error: 'كلمة المرور غير صحيحة' }
}

export async function logout() {
  const cookieStore = await cookies()
  cookieStore.delete('admin_token')
}
