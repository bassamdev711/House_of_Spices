'use server'

import prisma from '@/lib/prisma'

export async function trackOrder(orderId: string, phone: string) {
  try {
    // Basic validation
    if (!orderId || !phone) {
      return { success: false, error: 'الرجاء إدخال رقم الطلب ورقم الهاتف' }
    }

    // Clean inputs
    const cleanOrderId = orderId.trim()
    const cleanPhone = phone.trim()

    // Find the order
    const order = await prisma.order.findFirst({
      where: {
        OR: [
          { id: cleanOrderId },
          { orderNumber: cleanOrderId }
        ],
        customerPhone: {
          contains: cleanPhone
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
      }
    })

    if (!order) {
      return { 
        success: false, 
        error: 'لم نتمكن من العثور على طلب بهذا الرقم، يرجى التأكد من رقم الطلب ورقم الهاتف المدخل.' 
      }
    }

    // Return safe data to the client
    return {
      success: true,
      order: {
        id: order.id,
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
          price: Number(item.price)
        }))
      }
    }
  } catch (error) {
    console.error('Track order error:', error)
    return { success: false, error: 'حدث خطأ أثناء البحث عن الطلب، يرجى المحاولة لاحقاً.' }
  }
}
