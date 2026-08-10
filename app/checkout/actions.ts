'use server'

import prisma from '@/lib/prisma'
import { CheckoutData } from '@/components/CheckoutProvider'
import { CartItem } from '@/components/CartProvider'
import { validateCouponCode } from '@/app/admin/marketing/coupons/actions'

export async function createOrder(
  checkoutData: CheckoutData,
  cartItems: CartItem[],
  cartTotal: number,
  couponCode?: string
) {
  if (!cartItems || cartItems.length === 0) {
    return { success: false, error: 'السلة فارغة' }
  }

  try {
    const productIds = cartItems.map(i => i.id)
    const dbProducts = await prisma.product.findMany({
      where: { id: { in: productIds }, isActive: true }
    })

    if (dbProducts.length !== cartItems.length) {
      return { success: false, error: 'بعض المنتجات في سلتك لم تعد متوفرة' }
    }

    let calculatedCartTotal = 0
    const orderItemsData: { productId: string; quantity: number; price: number }[] = []

    for (const item of cartItems) {
      const dbProduct = dbProducts.find(p => p.id === item.id)
      if (!dbProduct) return { success: false, error: 'منتج غير موجود' }
      if (dbProduct.stock < item.quantity) {
        return { success: false, error: `الكمية المطلوبة من "${dbProduct.name}" غير متوفرة (المتوفر: ${dbProduct.stock})` }
      }
      
      const price = Number(dbProduct.price)
      calculatedCartTotal += price * item.quantity
      
      orderItemsData.push({
        productId: item.id,
        quantity: item.quantity,
        price: price,
      })
    }

    const storeSettings = await prisma.storeSettings.findUnique({ where: { id: 'singleton' } })
    const activeCities = await prisma.shippingCity.findMany({ where: { isActive: true } })

    let shippingFee = storeSettings ? Number(storeSettings.shippingFee) : 0
    
    // Check if store uses active shipping cities
    if (activeCities.length > 0) {
      const selectedCity = activeCities.find(c => c.name === checkoutData.city)
      if (selectedCity) {
        shippingFee = Number(selectedCity.shippingFee)
      } else {
        return { success: false, error: 'المدينة المحددة غير مدعومة للشحن' }
      }
    }

    const freeThreshold = storeSettings ? Number(storeSettings.freeShippingThreshold) : 0
    if (freeThreshold > 0 && calculatedCartTotal >= freeThreshold) {
      shippingFee = 0
    }

    // تطبيق كوبون الخصم إذا وُجد
    let discountAmount = 0
    let validatedCouponId: string | null = null
    if (couponCode) {
      const couponResult = await validateCouponCode(couponCode, calculatedCartTotal)
      if (couponResult.valid && couponResult.coupon) {
        discountAmount = couponResult.coupon.discountAmount
        validatedCouponId = couponResult.coupon.id
      }
    }

    const finalTotal = Math.max(0, calculatedCartTotal - discountAmount) + shippingFee
    const status = ['bank_transfer', 'digital_wallet'].includes(checkoutData.paymentMethod) ? 'AWAITING_PAYMENT' : 'PENDING'

    // Transaction
    const order = await prisma.$transaction(async (tx) => {
      // 1. Create Order
      const newOrder = await tx.order.create({
        data: {
          customerName: checkoutData.fullName,
          customerPhone: checkoutData.phone,
          governorate: checkoutData.governorate,
          city: checkoutData.city,
          address: checkoutData.address,
          paymentMethod: checkoutData.paymentMethod,
          shippingFee: shippingFee,
          totalAmount: finalTotal,
          paymentStatus: status, // Update paymentStatus, not just status!
          status: 'NEW', // Initial order status should be NEW
          items: {
            create: orderItemsData
          }
        }
      })

      // 2. Decrement stock
      for (const item of orderItemsData) {
        await tx.product.update({
          where: { id: item.productId },
          data: { stock: { decrement: item.quantity } }
        })
      }

      // 3. تسجيل استخدام الكوبون
      if (validatedCouponId) {
        await tx.coupon.update({
          where: { id: validatedCouponId },
          data: { usedCount: { increment: 1 } }
        })
      }

      return newOrder
    })

    return { success: true, orderId: order.id }
  } catch (error) {
    console.error('Failed to create order:', error)
    return { success: false, error: 'حدث خطأ أثناء إنشاء الطلب' }
  }
}

export async function updateOrderPaymentProof(orderId: string, paymentProofUrl: string, transactionId?: string) {
  try {
    const currentOrder = await prisma.order.findUnique({ where: { id: orderId } })
    
    if (!currentOrder) return { success: false, error: 'الطلب غير موجود' }
    if (currentOrder.paymentStatus !== 'AWAITING_PAYMENT' && currentOrder.paymentStatus !== 'PENDING') {
      return { success: false, error: 'لا يمكن إرفاق إيصال لهذا الطلب في حالته الحالية' }
    }

    await prisma.order.update({
      where: { id: orderId },
      data: {
        paymentProofUrl,
        transactionId,
        paymentStatus: 'AWAITING_CONFIRMATION',
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

  const shippingCities = await prisma.shippingCity.findMany({
    where: { isActive: true },
    orderBy: { name: 'asc' }
  })

  return {
    settings: settings ? {
      ...settings,
      codFee: Number(settings.codFee)
    } : null,
    storeSettings: {
      shippingFee: Number(storeSettings?.shippingFee || 0),
      freeShippingThreshold: Number(storeSettings?.freeShippingThreshold || 0)
    },
    shippingCities: shippingCities.map(c => ({
      id: c.id,
      name: c.name,
      shippingFee: Number(c.shippingFee)
    })),
    bankAccounts,
    digitalWallets
  }
}
