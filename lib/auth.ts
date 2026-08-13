import { cookies } from 'next/headers'
import { jwtVerify } from 'jose'

export async function verifyAdmin() {
  const cookieStore = await cookies()
  const token = cookieStore.get('admin_token')?.value

  if (!token) {
    throw new Error('Unauthorized: No admin token found')
  }

  const JWT_SECRET = process.env.JWT_SECRET
  if (!JWT_SECRET) {
    // JWT_SECRET is required in all environments — fail fast
    throw new Error('CRITICAL: JWT_SECRET environment variable is not configured')
  }

  try {
    const secret = new TextEncoder().encode(JWT_SECRET)
    await jwtVerify(token, secret)
    return true
  } catch (error) {
    throw new Error('Unauthorized: Invalid or expired token')
  }
}
