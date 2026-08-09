import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function POST(req: Request) {
  try {
    const { productId } = await req.json()

    if (!productId) {
      return NextResponse.json({ success: false, error: 'Product ID is required' }, { status: 400 })
    }

    await prisma.product.update({
      where: { id: productId },
      data: { addToCartCount: { increment: 1 } }
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error tracking cart addition:', error)
    return NextResponse.json({ success: false, error: 'Failed to track cart addition' }, { status: 500 })
  }
}
