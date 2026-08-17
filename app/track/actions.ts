'use server'

import prisma from '@/lib/prisma'
import { headers } from 'next/headers'
import { checkRateLimit } from '@/lib/rate-limit'

function cleanLookup(value: unknown, maxLength: number): string {
  if (typeof value !== 'string') return ''
  return value.trim().slice(0, maxLength)
}

function clientIp(headersList: Headers): string {
  return headersList.get('x-real-ip')?.trim() || headersList.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown'
}

export async function trackOrderByOrderId(orderId: string, phone: string) {
  try {
    const reference = cleanLookup(orderId, 100)
    const cleanPhone = cleanLookup(phone, 30)
    if (!reference || cleanPhone.length < 7) {
      return { success: false, error: 'أدخل رقم الطلب ورقم الهاتف المستخدم عند الشراء' }
    }

    const ip = clientIp(await headers())
    if (!checkRateLimit(`track_order_${ip}`, 5, 15 * 60 * 1000)) {
      return { success: false, error: 'تم تجاوز الحد المسموح. يرجى المحاولة بعد 15 دقيقة.' }
    }

    const order = await prisma.order.findFirst({
      where: {
        customerPhone: cleanPhone,
        OR: [{ id: reference }, { orderNumber: reference }],
      },
      include: {
        items: {
          include: { product: { select: { name: true, imageUrl: true } } },
        },
      },
    })

    if (!order) return { success: false, error: 'لم نتمكن من العثور على طلب مطابق للبيانات المدخلة.' }
    return { success: true, order: formatOrderPayload(order) }
  } catch (error) {
    console.error('Track order error:', error)
    return { success: false, error: 'حدث خطأ أثناء البحث عن الطلب، يرجى المحاولة لاحقاً.' }
  }
}

// Kept for compatibility with older clients, but no longer permits phone-only history enumeration.
export async function trackOrdersByPhone(phone: string, orderNumber: string) {
  const result = await trackOrderByOrderId(orderNumber, phone)
  if (!result.success) return { success: false as const, error: result.error }
  if (!result.order) return { success: false as const, error: 'لم نتمكن من العثور على الطلب' }
  return { success: true as const, orders: [result.order] }
}

function formatOrderPayload(order: {
  orderNumber: string | null
  status: string
  paymentStatus: string
  paymentMethod: string
  totalAmount: unknown
  shippingFee: unknown
  createdAt: Date
  items: Array<{
    id: string
    quantity: number
    price: unknown
    product: { name: string; imageUrl: string | null } | null
  }>
}) {
  return {
    orderNumber: order.orderNumber,
    status: order.status,
    paymentStatus: order.paymentStatus,
    paymentMethod: order.paymentMethod,
    totalAmount: Number(order.totalAmount),
    shippingFee: Number(order.shippingFee),
    createdAt: order.createdAt,
    items: order.items.map(item => ({
      id: item.id,
      productName: item.product?.name || 'منتج غير معروف',
      imageUrl: item.product?.imageUrl || null,
      quantity: item.quantity,
      price: Number(item.price),
    })),
  }
}
