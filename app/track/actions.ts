'use server'

import prisma from '@/lib/prisma'
import { headers } from 'next/headers'
import { checkRateLimit } from '@/lib/rate-limit'

export async function trackOrderByOrderId(orderId: string) {
  try {
    if (!orderId) {
      return { success: false, error: 'الرجاء إدخال رقم الطلب' }
    }

    // Rate limit: 5 lookups per 15 minutes per IP
    const headersList = await headers()
    const ip = headersList.get('x-forwarded-for')?.split(',')[0]?.trim() || '127.0.0.1'
    if (!checkRateLimit(`track_id_${ip}`, 5, 15 * 60 * 1000)) {
      return { success: false, error: 'تم تجاوز الحد المسموح. يرجى المحاولة بعد 15 دقيقة.' }
    }

    const cleanOrderId = orderId.trim().slice(0, 100)

    const order = await prisma.order.findFirst({
      where: {
        OR: [
          { id: cleanOrderId },
          { orderNumber: cleanOrderId }
        ]
      },
      include: {
        items: {
          include: {
            product: {
              select: {
                name: true,
                imageUrl: true
              }
            }
          }
        }
      }
    })

    if (!order) {
      return {
        success: false,
        error: 'لم نتمكن من العثور على طلب بهذا الرقم.'
      }
    }

    return {
      success: true,
      order: formatOrderPayload(order)
    }
  } catch (error) {
    console.error('Track order error:', error)
    return { success: false, error: 'حدث خطأ أثناء البحث عن الطلب، يرجى المحاولة لاحقاً.' }
  }
}


export async function trackOrdersByPhone(phone: string) {
  try {
    if (!phone) {
      return { success: false, error: 'الرجاء إدخال رقم الهاتف' }
    }

    // Rate limit: 5 lookups per 15 minutes per IP
    const headersList = await headers()
    const ip = headersList.get('x-forwarded-for')?.split(',')[0]?.trim() || '127.0.0.1'
    if (!checkRateLimit(`track_phone_${ip}`, 5, 15 * 60 * 1000)) {
      return { success: false, error: 'تم تجاوز الحد المسموح. يرجى المحاولة بعد 15 دقيقة.' }
    }

    const cleanPhone = phone.trim()

    // Prevent wildcards and short inputs
    if (cleanPhone.length < 9) {
       return { success: false, error: 'رقم الهاتف المدخل غير صالح' }
    }

    const orders = await prisma.order.findMany({
      where: {
        customerPhone: {
          equals: cleanPhone
        }
      },
      include: {
        items: {
          include: {
            product: {
              select: {
                name: true,
                imageUrl: true
              }
            }
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    if (!orders || orders.length === 0) {
      return { 
        success: false, 
        error: 'لم نتمكن من العثور على أي طلبات مسجلة بهذا الرقم.' 
      }
    }

    return {
      success: true,
      orders: orders.map(formatOrderPayload)
    }
  } catch (error) {
    console.error('Track orders by phone error:', error)
    return { success: false, error: 'حدث خطأ أثناء البحث عن الطلبات، يرجى المحاولة لاحقاً.' }
  }
}

function formatOrderPayload(order: any) {
  return {
    id: order.id,
    orderNumber: order.orderNumber,
    status: order.status,
    paymentStatus: order.paymentStatus,
    paymentMethod: order.paymentMethod,
    totalAmount: Number(order.totalAmount),
    shippingFee: Number(order.shippingFee),
    createdAt: order.createdAt,
    items: order.items.map((item: any) => ({
      id: item.id,
      productName: item.product?.name || 'منتج غير معروف',
      imageUrl: item.product?.imageUrl || null,
      quantity: item.quantity,
      price: Number(item.price)
    }))
  }
}
