'use server'

import prisma from '@/lib/prisma'
import { headers } from 'next/headers'
import { checkRateLimit } from '@/lib/rate-limit'
import { CheckoutData } from '@/components/CheckoutProvider'
import { CartItem } from '@/components/CartProvider'
import { validateCouponCode } from '@/app/admin/marketing/coupons/actions'
import { sendWebPushNotification } from '@/lib/web-push'

export async function createOrder(
  checkoutData: CheckoutData,
  cartItems: CartItem[],
  cartTotal: number,
  couponCode?: string,
  paymentProofUrl?: string,
  transactionId?: string
) {
  try {
    const headersList = await headers()
    const ip = headersList.get('x-forwarded-for') || '127.0.0.1'
    
    // Limit to 3 orders per 15 minutes (900000 ms) per IP
    if (!checkRateLimit(`order_${ip}`, 3, 900000)) {
      return { success: false, error: 'لقد تجاوزت الحد المسموح به لإنشاء الطلبات. يرجى المحاولة بعد 15 دقيقة.' }
    }

    if (!cartItems || cartItems.length === 0) {
      return { success: false, error: 'السلة فارغة' }
    }

    if (cartItems.some(i => !Number.isInteger(i.quantity) || i.quantity <= 0)) {
      return { success: false, error: 'كمية المنتجات غير صالحة' }
    }

    const parsedItems = cartItems.map(i => {
      // id could be productId-variantId
      const parts = i.id.split('-')
      return {
        originalId: i.id,
        productId: parts[0],
        variantId: parts.length > 1 ? parts[1] : null,
        quantity: i.quantity,
        price: i.price
      }
    })

    const productIds = Array.from(new Set(parsedItems.map(i => i.productId)))
    const dbProducts = await prisma.product.findMany({
      where: { id: { in: productIds }, isActive: true },
      include: { variants: true }
    })

    if (dbProducts.length !== productIds.length) {
      return { success: false, error: 'بعض المنتجات في سلتك لم تعد متوفرة' }
    }

    let calculatedCartTotal = 0
    const orderItemsData: { productId: string; variantId?: string | null; quantity: number; price: number }[] = []

    for (const item of parsedItems) {
      const dbProduct = dbProducts.find(p => p.id === item.productId)
      if (!dbProduct) return { success: false, error: 'منتج غير موجود' }
      
      let stockToCheck = dbProduct.stock
      let itemPrice = Number(dbProduct.price)
      
      if (item.variantId) {
        const variant = dbProduct.variants.find(v => v.id === item.variantId)
        if (!variant) return { success: false, error: `الخيار المحدد لمنتج "${dbProduct.name}" غير موجود` }
        stockToCheck = variant.stock
        itemPrice = Number(variant.price)
      }

      if (stockToCheck < item.quantity) {
        return { success: false, error: `الكمية المطلوبة من "${dbProduct.name}" غير متوفرة (المتوفر: ${stockToCheck})` }
      }
      
      calculatedCartTotal += itemPrice * item.quantity
      
      orderItemsData.push({
        productId: item.productId,
        variantId: item.variantId,
        quantity: item.quantity,
        price: itemPrice,
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

    const discountedCartTotal = Math.max(0, calculatedCartTotal - discountAmount)

    const freeThreshold = storeSettings ? Number(storeSettings.freeShippingThreshold) : 0
    if (freeThreshold > 0 && discountedCartTotal >= freeThreshold) {
      shippingFee = 0
    }

    // جلب إعدادات الدفع للتحقق من التوفر وإضافة رسوم الدفع عند الاستلام
    const paymentSettings = await prisma.paymentSettings.findUnique({ where: { id: 'singleton' } })
    
    if (paymentSettings) {
      if (checkoutData.paymentMethod === 'cod' && !paymentSettings.codEnabled) {
        return { success: false, error: 'طريقة الدفع المختارة غير متاحة حالياً' }
      }
      if (checkoutData.paymentMethod === 'bank_transfer' && !paymentSettings.bankTransferEnabled) {
        return { success: false, error: 'التحويل البنكي غير متاح حالياً' }
      }
      if (checkoutData.paymentMethod === 'wallets' && !paymentSettings.walletsEnabled) {
        return { success: false, error: 'المحافظ الإلكترونية غير متاحة حالياً' }
      }

      // إضافة رسوم الدفع عند الاستلام للشحن إذا اختار العميل COD
      if (checkoutData.paymentMethod === 'cod' && paymentSettings.codFee) {
        shippingFee += Number(paymentSettings.codFee)
      }
    }

    const finalTotal = discountedCartTotal + shippingFee
    const status = ['bank_transfer', 'wallets'].includes(checkoutData.paymentMethod) ? 'AWAITING_PAYMENT' : 'PENDING'

    // Transaction
    const order = await prisma.$transaction(async (tx) => {
      // 1. Generate orderNumber (e.g., TIF-2026-0012)
      const year = new Date().getFullYear()
      const orderCount = await tx.order.count()
      const orderNumber = `TIF-${year}-${(orderCount + 1).toString().padStart(4, '0')}`

      // 2. Create Order
      const newOrder = await tx.order.create({
        data: {
          orderNumber,
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
          couponId: validatedCouponId,
          paymentProofUrl: paymentProofUrl || null,
          transactionId: transactionId || null,
          items: {
            create: orderItemsData
          }
        }
      })

      // 2. Decrement stock atomically to prevent race conditions
      for (const item of orderItemsData) {
        let updateResult;
        
        if (item.variantId) {
          updateResult = await tx.productVariant.updateMany({
            where: { 
              id: item.variantId,
              stock: { gte: item.quantity }
            },
            data: { stock: { decrement: item.quantity } }
          })
        } else {
          updateResult = await tx.product.updateMany({
            where: { 
              id: item.productId,
              stock: { gte: item.quantity }
            },
            data: { stock: { decrement: item.quantity } }
          })
        }
        
        if (updateResult.count === 0) {
          throw new Error(`الكمية المطلوبة لم تعد متوفرة لبعض المنتجات، يرجى المحاولة مرة أخرى.`)
        }
      }

      // 3. تسجيل استخدام الكوبون (Atomic Update)
      if (validatedCouponId) {
        const currentCoupon = await tx.coupon.findUnique({ where: { id: validatedCouponId } })
        if (currentCoupon) {
          if (currentCoupon.maxUses !== null) {
            const updateResult = await tx.coupon.updateMany({
              where: { id: validatedCouponId, usedCount: { lt: currentCoupon.maxUses } },
              data: { usedCount: { increment: 1 } }
            })
            if (updateResult.count === 0) {
              throw new Error('عذراً، تم استنفاد الكوبون للتو من قبل عميل آخر.')
            }
          } else {
            await tx.coupon.update({
              where: { id: validatedCouponId },
              data: { usedCount: { increment: 1 } }
            })
          }
        }
      }

      return newOrder
    })

    // Send push notification to admin
    try {
      await sendWebPushNotification(
        '🛒 طلب جديد',
        `طلب جديد رقم ${order.orderNumber} بقيمة ${finalTotal} ${paymentSettings?.currency || 'ر.س'}`,
        `/admin/orders/${order.id}`
      )
    } catch (pushErr) {
      console.error('Failed to send push notification:', pushErr)
    }

    return { success: true, orderId: order.id }
  } catch (error) {
    console.error('Failed to create order:', error)
    return { success: false, error: 'حدث خطأ أثناء إنشاء الطلب' }
  }
}

export async function updateOrderPaymentProof(orderId: string, paymentProofUrl: string, transactionId?: string) {
  try {
    // Rate limit: 5 proof uploads per hour per order (no customer auth — rate limit is primary defense)
    if (!checkRateLimit(`proof_${orderId}`, 5, 60 * 60 * 1000)) {
      return { success: false, error: 'تم تجاوز الحد المسموح لرفع الإيصالات لهذا الطلب.' }
    }

    const currentOrder = await prisma.order.findUnique({ where: { id: orderId } })
    
    if (!currentOrder) return { success: false, error: 'الطلب غير موجود' }
    if (!['AWAITING_PAYMENT', 'PENDING', 'REJECTED'].includes(currentOrder.paymentStatus)) {
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

    // Send push notification to admin
    try {
      await sendWebPushNotification(
        '💳 إثبات دفع جديد',
        `تم رفع إثبات دفع للطلب رقم ${currentOrder.orderNumber}`,
        `/admin/orders/${currentOrder.id}`
      )
    } catch (pushErr) {
      console.error('Failed to send push notification for payment proof:', pushErr)
    }

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
