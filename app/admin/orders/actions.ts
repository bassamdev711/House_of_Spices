'use server'

import { verifyAdmin } from '@/lib/auth'

import prisma from '@/lib/prisma'
import { revalidatePath } from 'next/cache'

const ORDER_STATUSES = ['NEW', 'PROCESSING', 'SHIPPED', 'COMPLETED', 'CANCELLED'] as const
const PAYMENT_STATUSES = ['PENDING', 'AWAITING_PAYMENT', 'AWAITING_CONFIRMATION', 'PAID', 'FAILED'] as const

export async function getOrders(statusFilter?: string, timeFilter?: string, search?: string) {
  await verifyAdmin();

  const whereClause: any = {}

  if (statusFilter && statusFilter !== 'الكل') {
    if (statusFilter === 'جديد') whereClause.status = 'NEW'
    if (statusFilter === 'قيد التجهيز') whereClause.status = 'PROCESSING'
    if (statusFilter === 'مشحون') whereClause.status = 'SHIPPED'
    if (statusFilter === 'مكتمل') whereClause.status = 'COMPLETED'
    if (statusFilter === 'ملغى') whereClause.status = 'CANCELLED'
  }

  if (timeFilter) {
    const now = new Date()
    if (timeFilter === 'اليوم') {
      whereClause.createdAt = { gte: new Date(now.setHours(0,0,0,0)) }
    } else if (timeFilter === 'آخر 7 أيام') {
      whereClause.createdAt = { gte: new Date(now.setDate(now.getDate() - 7)) }
    } else if (timeFilter === 'آخر 30 يوم') {
      whereClause.createdAt = { gte: new Date(now.setDate(now.getDate() - 30)) }
    }
  }

  if (search) {
    whereClause.OR = [
      { orderNumber: { contains: search, mode: 'insensitive' } },
      { customerPhone: { contains: search } },
      { customerName: { contains: search, mode: 'insensitive' } }
    ]
  }

  const orders = await prisma.order.findMany({
    where: whereClause,
    orderBy: { createdAt: 'desc' },
    include: {
      items: {
        include: { product: true }
      },
      coupon: true
    }
  })

  // Serialize Decimal fields → plain numbers (Client Components don't accept Decimal objects)
  return orders.map((order) => ({
    ...order,
    totalAmount: order.totalAmount.toNumber(),
    shippingFee: order.shippingFee.toNumber(),
    items: order.items.map((item) => ({
      ...item,
      price: item.price.toNumber(),
      product: item.product
        ? {
            ...item.product,
            price: item.product.price.toNumber(),
            compareAtPrice: item.product.compareAtPrice?.toNumber() ?? null,
          }
        : null,
    })),
    coupon: order.coupon ? {
      ...order.coupon,
      value: order.coupon.value.toNumber(),
      minOrderAmount: order.coupon.minOrderAmount?.toNumber() ?? null,
    } : null,
  }))
}

export async function getOrdersStats() {
  await verifyAdmin();

  const [total, pendingPayment, processing, shipped] = await Promise.all([
    prisma.order.count(),
    prisma.order.count({ where: { paymentStatus: { in: ['PENDING', 'AWAITING_CONFIRMATION'] } } }),
    prisma.order.count({ where: { status: 'PROCESSING' } }),
    prisma.order.count({ where: { status: 'SHIPPED' } })
  ])
  return { total, pendingPayment, processing, shipped }
}

export async function updateOrderStatus(orderId: string, status: string) {
  await verifyAdmin()
  if (!ORDER_STATUSES.includes(status as typeof ORDER_STATUSES[number])) {
    return { success: false, error: 'حالة الطلب غير صالحة' }
  }

  try {
    const result = await prisma.$transaction(async (tx) => {
      const currentOrder = await tx.order.findUnique({ where: { id: orderId }, include: { items: true } })
      if (!currentOrder) return { success: false as const, error: 'الطلب غير موجود' }
      if (currentOrder.status === 'CANCELLED' && status !== 'CANCELLED') {
        return { success: false as const, error: 'لا يمكن إعادة فتح طلب ملغى' }
      }
      if (currentOrder.status === status) return { success: true as const }

      const updated = await tx.order.updateMany({
        where: { id: orderId, status: currentOrder.status },
        data: { status },
      })
      if (updated.count === 0) return { success: false as const, error: 'تغيرت حالة الطلب، أعد تحميل الصفحة' }

      if (status === 'CANCELLED') {
        for (const item of currentOrder.items) {
          if (item.variantId) {
            await tx.productVariant.update({ where: { id: item.variantId }, data: { stock: { increment: item.quantity } } })
          } else if (item.productId) {
            await tx.product.update({ where: { id: item.productId }, data: { stock: { increment: item.quantity } } })
          }
        }
        if (currentOrder.couponId) {
          await tx.coupon.updateMany({
            where: { id: currentOrder.couponId, usedCount: { gt: 0 } },
            data: { usedCount: { decrement: 1 } },
          })
        }
      }

      return { success: true as const }
    })

    if (result.success) revalidatePath('/admin/orders')
    return result
  } catch (error) {
    console.error('Failed to update order status:', error)
    return { success: false, error: 'تعذر تحديث حالة الطلب' }
  }
}

export async function updatePaymentStatus(orderId: string, paymentStatus: string) {
  await verifyAdmin()
  if (!PAYMENT_STATUSES.includes(paymentStatus as typeof PAYMENT_STATUSES[number])) {
    return { success: false, error: 'حالة الدفع غير صالحة' }
  }

  try {
    const updated = await prisma.order.updateMany({
      where: { id: orderId },
      data: { paymentStatus },
    })
    if (updated.count === 0) return { success: false, error: 'الطلب غير موجود' }
    revalidatePath('/admin/orders')
    return { success: true }
  } catch (error) {
    console.error('Failed to update payment status:', error)
    return { success: false, error: 'تعذر تحديث حالة الدفع' }
  }
}

export async function deleteOrder(orderId: string) {
  await verifyAdmin()

  try {
    const result = await prisma.$transaction(async (tx) => {
      const currentOrder = await tx.order.findUnique({ where: { id: orderId }, include: { items: true } })
      if (!currentOrder) return { success: false as const, error: 'الطلب غير موجود' }

      if (currentOrder.status !== 'CANCELLED') {
        for (const item of currentOrder.items) {
          if (item.variantId) {
            await tx.productVariant.update({ where: { id: item.variantId }, data: { stock: { increment: item.quantity } } })
          } else if (item.productId) {
            await tx.product.update({ where: { id: item.productId }, data: { stock: { increment: item.quantity } } })
          }
        }
        if (currentOrder.couponId) {
          await tx.coupon.updateMany({ where: { id: currentOrder.couponId, usedCount: { gt: 0 } }, data: { usedCount: { decrement: 1 } } })
        }
      }

      await tx.order.delete({ where: { id: orderId } })
      return { success: true as const }
    })

    if (result.success) revalidatePath('/admin/orders')
    return result
  } catch (error) {
    console.error('Failed to delete order:', error)
    return { success: false, error: 'تعذر حذف الطلب' }
  }
}
