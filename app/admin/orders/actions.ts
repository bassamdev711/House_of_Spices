'use server'

import prisma from '@/lib/prisma'
import { revalidatePath } from 'next/cache'

export async function getOrders(statusFilter?: string, timeFilter?: string, search?: string) {
  let whereClause: any = {}

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
      }
    }
  })

  return orders
}

export async function getOrdersStats() {
  const [total, pendingPayment, processing, shipped] = await Promise.all([
    prisma.order.count(),
    prisma.order.count({ where: { paymentStatus: { in: ['PENDING', 'AWAITING_CONFIRMATION'] } } }),
    prisma.order.count({ where: { status: 'PROCESSING' } }),
    prisma.order.count({ where: { status: 'SHIPPED' } })
  ])
  return { total, pendingPayment, processing, shipped }
}

export async function updateOrderStatus(orderId: string, status: string) {
  try {
    await prisma.order.update({
      where: { id: orderId },
      data: { status }
    })
    revalidatePath('/admin/orders')
    return { success: true }
  } catch (error) {
    return { success: false, error: 'Failed to update order status' }
  }
}

export async function updatePaymentStatus(orderId: string, paymentStatus: string) {
  try {
    await prisma.order.update({
      where: { id: orderId },
      data: { paymentStatus }
    })
    revalidatePath('/admin/orders')
    return { success: true }
  } catch (error) {
    return { success: false, error: 'Failed to update payment status' }
  }
}
