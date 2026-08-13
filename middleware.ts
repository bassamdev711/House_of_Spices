import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { jwtVerify } from 'jose'

export async function middleware(request: NextRequest) {
  // Only protect /admin routes
  if (request.nextUrl.pathname.startsWith('/admin')) {
    const token = request.cookies.get('admin_token')?.value

    if (!token) {
      return NextResponse.redirect(new URL('/login', request.url))
    }

    try {
      const secret = process.env.JWT_SECRET
      if (!secret) {
        console.error('CRITICAL: JWT_SECRET is missing in production environment variables.')
        // Fail securely
        return NextResponse.redirect(new URL('/login', request.url))
      }
      const secretKey = new TextEncoder().encode(secret)
      await jwtVerify(token, secretKey)
      return NextResponse.next()
    } catch (error) {
      // Invalid or expired token
      return NextResponse.redirect(new URL('/login', request.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: '/admin/:path*',
}
