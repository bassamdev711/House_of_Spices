import { NextRequest, NextResponse } from 'next/server'
import { validateCouponCode } from '@/app/admin/marketing/coupons/actions'

export async function POST(request: NextRequest) {
  try {
    const { code, orderTotal } = await request.json()

    if (!code || typeof orderTotal !== 'number') {
      return NextResponse.json({ valid: false, error: 'بيانات غير صحيحة' }, { status: 400 })
    }

    const result = await validateCouponCode(code, orderTotal)
    return NextResponse.json(result)
  } catch (error) {
    console.error('Coupon validation error:', error)
    return NextResponse.json({ valid: false, error: 'حدث خطأ أثناء التحقق من الكوبون' }, { status: 500 })
  }
}
