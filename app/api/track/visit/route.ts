import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { cookies } from 'next/headers'

export async function POST(req: Request) {
  try {
    const cookieStore = await cookies()
    const visitorCookie = cookieStore.get('tif_visitor_tracked')

    if (!visitorCookie) {
      // Get today's date at midnight
      const today = new Date()
      today.setHours(0, 0, 0, 0)

      // Find or create daily stats record
      await prisma.dailyStats.upsert({
        where: { date: today },
        update: {
          visitorsCount: { increment: 1 },
          pageViews: { increment: 1 }
        },
        create: {
          date: today,
          visitorsCount: 1,
          pageViews: 1
        }
      })

      // Set cookie to prevent counting again for 24 hours
      const response = NextResponse.json({ success: true, newVisitor: true })
      response.cookies.set('tif_visitor_tracked', 'true', {
        maxAge: 60 * 60 * 24, // 24 hours
        path: '/',
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax'
      })
      
      return response
    } else {
      // Just increment page views
      const today = new Date()
      today.setHours(0, 0, 0, 0)

      await prisma.dailyStats.updateMany({
        where: { date: today },
        data: { pageViews: { increment: 1 } }
      })

      return NextResponse.json({ success: true, newVisitor: false })
    }
  } catch (error) {
    console.error('Error tracking visit:', error)
    return NextResponse.json({ success: false, error: 'Failed to track visit' }, { status: 500 })
  }
}
