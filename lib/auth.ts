import { cookies } from 'next/headers'
import { jwtVerify } from 'jose'

export const ADMIN_JWT_ISSUER = 'house-of-spices-admin'
export const ADMIN_JWT_AUDIENCE = 'house-of-spices-admin'

export async function verifyAdmin(requestToken?: string) {
  let token = requestToken
  if (!token) {
    const cookieStore = await cookies()
    token = cookieStore.get('admin_token')?.value
  }

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
    const { payload } = await jwtVerify(token, secret, {
      issuer: ADMIN_JWT_ISSUER,
      audience: ADMIN_JWT_AUDIENCE,
      algorithms: ['HS256'],
    })

    if (payload.role !== 'admin') {
      throw new Error('Unauthorized: Admin role required')
    }

    return true
  } catch (error) {
    throw new Error('Unauthorized: Invalid or expired token')
  }
}
