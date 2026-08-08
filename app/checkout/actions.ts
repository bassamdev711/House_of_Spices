'use server'

import prisma from '@/lib/prisma'
import { CheckoutData } from '@/components/CheckoutProvider'
import { CartItem } from '@/components/CartProvider'

export async function createOrder(checkoutData: CheckoutData, cartItems: CartItem[], cartTotal: number) {
  try {
    const order = await prisma.order.create({
      data: {
        customerName: checkoutData.fullName,
        customerPhone: checkoutData.phone,
        governorate: checkoutData.governorate,
        city: checkoutData.city,
        address: checkoutData.address,
        paymentMethod: checkoutData.paymentMethod,
        shippingFee: checkoutData.shippingFee || 0,
        totalAmount: cartTotal + (checkoutData.shippingFee || 0),
        status: ['bank_transfer', 'digital_wallet'].includes(checkoutData.paymentMethod) ? 'AWAITING_PAYMENT' : 'PENDING',
        items: {
          create: cartItems.map(item => ({
            productId: item.id,
            quantity: item.quantity,
            price: item.price,
          }))
        }
      }
    })

    return { success: true, orderId: order.id }
  } catch (error) {
    console.error('Failed to create order:', error)
    return { success: false, error: 'حدث خطأ أثناء إنشاء الطلب' }
  }
}

export async function updateOrderPaymentProof(orderId: string, paymentProofUrl: string, transactionId?: string) {
  try {
    await prisma.order.update({
      where: { id: orderId },
      data: {
        paymentProofUrl,
        transactionId,
        status: 'PENDING', // Now it's pending review from Admin
      }
    })
    return { success: true }
  } catch (error) {
    console.error('Failed to update order payment proof:', error)
    return { success: false, error: 'حدث خطأ أثناء حفظ إثبات الدفع' }
  }
}

export async function getPaymentMethods() {
  const settings = await prisma.paymentSettings.findUnique({
    where: { id: 'singleton' }
  })
  
  let storeSettings = await prisma.storeSettings.findUnique({
    where: { id: 'singleton' }
  })

  // fallback if not yet initialized
  if (!storeSettings) {
    storeSettings = { id: 'singleton', shippingFee: 0 as any, freeShippingThreshold: 0 as any, updatedAt: new Date() } as any
  }
  
  const bankAccounts = await prisma.bankAccount.findMany({
    where: { isActive: true },
    orderBy: { createdAt: 'desc' }
  })
  
  const digitalWallets = await prisma.digitalWallet.findMany({
    where: { isActive: true },
    orderBy: { createdAt: 'desc' }
  })

  return {
    settings: settings ? {
      ...settings,
      codFee: Number(settings.codFee)
    } : null,
    storeSettings: {
      shippingFee: Number(storeSettings.shippingFee),
      freeShippingThreshold: Number(storeSettings.freeShippingThreshold)
    },
    bankAccounts,
    digitalWallets
  }
}
