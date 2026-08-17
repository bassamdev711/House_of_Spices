import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { jwtVerify } from 'jose'

const JWT_SECRET = process.env.JWT_SECRET
const ADMIN_JWT_ISSUER = 'house-of-spices-admin'
const ADMIN_JWT_AUDIENCE = 'house-of-spices-admin'

export default async function proxy(request: NextRequest) {
  // Only protect /admin and subpaths
  if (request.nextUrl.pathname.startsWith('/admin')) {
    const token = request.cookies.get('admin_token')?.value

    if (!token) {
      // No token, redirect to login
      return NextResponse.redirect(new URL('/login', request.url))
    }

    try {
      if (!JWT_SECRET) {
        throw new Error('JWT_SECRET is not configured')
      }

      const secret = new TextEncoder().encode(JWT_SECRET)
      const { payload } = await jwtVerify(token, secret, {
        issuer: ADMIN_JWT_ISSUER,
        audience: ADMIN_JWT_AUDIENCE,
        algorithms: ['HS256'],
      })

      if (payload.role !== 'admin') {
        throw new Error('Admin role required')
      }

      return NextResponse.next()
    } catch (error) {
      // Invalid or expired token, redirect to login
      const response = NextResponse.redirect(new URL('/login', request.url))
      response.cookies.delete('admin_token') // clear the invalid cookie
      return response
    }
  }

  return NextResponse.next()
}

// Config to run middleware only on /admin paths
export const config = {
  matcher: ['/admin/:path*']
}
