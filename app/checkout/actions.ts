'use server'

import { randomUUID } from 'crypto'
import { headers } from 'next/headers'
import { Prisma } from '@prisma/client'
import prisma from '@/lib/prisma'
import { checkRateLimit } from '@/lib/rate-limit'
import { CheckoutData } from '@/components/CheckoutProvider'
import { CartItem } from '@/components/CartProvider'
import { sendWebPushNotification } from '@/lib/web-push'
import { createPaymentUploadToken, verifyPaymentUploadToken } from '@/lib/payment-upload-token'
import { verifyAdmin } from '@/lib/auth'

type ParsedCartItem = {
  productId: string
  variantId: string | null
  quantity: number
}

const PAYMENT_METHODS = ['bank_transfer', 'wallets', 'cod'] as const
const PAYMENT_PROOF_STATUSES = ['AWAITING_PAYMENT', 'PENDING', 'REJECTED'] as const

function cleanText(value: unknown, field: string, min: number, max: number): string {
  if (typeof value !== 'string') throw new Error(`${field} غير صالح`)
  const clean = value.trim()
  if (clean.length < min || clean.length > max) throw new Error(`${field} غير صالح`)
  return clean
}

function cleanIdempotencyKey(value: unknown): string {
  if (typeof value !== 'string' || !/^[A-Za-z0-9_-]{16,128}$/.test(value)) {
    throw new Error('معرّف العملية غير صالح')
  }
  return value
}

function cleanPaymentMethod(value: unknown): typeof PAYMENT_METHODS[number] {
  if (typeof value !== 'string' || !PAYMENT_METHODS.includes(value as typeof PAYMENT_METHODS[number])) {
    throw new Error('طريقة الدفع غير صالحة')
  }
  return value as typeof PAYMENT_METHODS[number]
}

function parseLegacyCartId(id: string): { key: string; variantId: string | null } {
  const cleanId = id.trim()
  const separator = cleanId.lastIndexOf('-')
  if (separator > 0 && separator < cleanId.length - 1) {
    return { key: cleanId.slice(0, separator), variantId: cleanId.slice(separator + 1) }
  }
  return { key: cleanId, variantId: null }
}

function isUniqueViolation(error: unknown): boolean {
  return error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002'
}

export async function createOrder(
  checkoutData: CheckoutData,
  cartItems: CartItem[],
  _cartTotal: number,
  couponCode?: string,
  idempotencyKey?: string,
) {
  try {
    const headersList = await headers()
    const ip = headersList.get('x-forwarded-for')?.split(',')[0]?.trim() || '127.0.0.1'
    if (!checkRateLimit(`order_${ip}`, 3, 900000)) {
      return { success: false, error: 'لقد تجاوزت الحد المسموح به لإنشاء الطلبات. يرجى المحاولة بعد 15 دقيقة.' }
    }

    const key = cleanIdempotencyKey(idempotencyKey)
    const customerName = cleanText(checkoutData?.fullName, 'الاسم الكامل', 2, 100)
    const customerPhone = cleanText(checkoutData?.phone, 'رقم الهاتف', 7, 30)
    const governorate = cleanText(checkoutData?.governorate, 'المحافظة', 1, 120)
    const city = cleanText(checkoutData?.city, 'المدينة', 1, 120)
    const address = cleanText(checkoutData?.address, 'العنوان', 5, 500)
    const paymentMethod = cleanPaymentMethod(checkoutData?.paymentMethod)

    if (!Array.isArray(cartItems) || cartItems.length === 0 || cartItems.length > 100) {
      return { success: false, error: 'السلة فارغة أو تحتوي عددًا غير صالح من المنتجات' }
    }

    const explicitItems = cartItems.map((item) => {
      if (!item || !Number.isInteger(item.quantity) || item.quantity <= 0 || item.quantity > 1000) {
        throw new Error('كمية المنتجات غير صالحة')
      }
      if (item.productId) {
        return { key: cleanText(item.productId, 'معرّف المنتج', 1, 100), variantId: item.variantId || null, quantity: item.quantity }
      }
      if (typeof item.id !== 'string' || item.id.trim().length === 0) throw new Error('معرّف المنتج غير صالح')
      const legacy = parseLegacyCartId(item.id)
      return { key: cleanText(legacy.key, 'معرّف المنتج', 1, 140), variantId: legacy.variantId, quantity: item.quantity }
    })

    const lookupKeys = Array.from(new Set(explicitItems.map(item => item.key)))
    const dbProducts = await prisma.product.findMany({
      where: {
        isActive: true,
        OR: [{ id: { in: lookupKeys } }, { slug: { in: lookupKeys } }],
      },
      include: { variants: true },
    })

    const productsById = new Map(dbProducts.map(product => [product.id, product]))
    const productsBySlug = new Map(dbProducts.map(product => [product.slug, product]))
    const parsedItems: ParsedCartItem[] = explicitItems.map(item => {
      const product = productsById.get(item.key) || productsBySlug.get(item.key)
      if (!product) throw new Error('بعض المنتجات في سلتك لم تعد متوفرة')
      return { productId: product.id, variantId: item.variantId, quantity: item.quantity }
    })

    const storeSettings = await prisma.storeSettings.findUnique({ where: { id: 'singleton' } })
    const activeCities = await prisma.shippingCity.findMany({ where: { isActive: true } })
    const selectedCity = activeCities.find(c => c.name === city)
    let shippingFee = selectedCity ? Number(selectedCity.shippingFee) : Number(storeSettings?.shippingFee ?? 0)
    if (activeCities.length > 0 && !selectedCity) {
      return { success: false, error: 'المدينة المحددة غير مدعومة للشحن' }
    }

    const paymentSettings = await prisma.paymentSettings.findUnique({ where: { id: 'singleton' } })
    if (!paymentSettings) return { success: false, error: 'إعدادات الدفع غير مكتملة حالياً' }
    if (paymentMethod === 'cod' && !paymentSettings.codEnabled) return { success: false, error: 'الدفع عند الاستلام غير متاح حالياً' }
    if (paymentMethod === 'bank_transfer' && !paymentSettings.bankTransferEnabled) return { success: false, error: 'التحويل البنكي غير متاح حالياً' }
    if (paymentMethod === 'wallets' && !paymentSettings.walletsEnabled) return { success: false, error: 'المحافظ الإلكترونية غير متاحة حالياً' }
    if (paymentMethod === 'cod') shippingFee += Number(paymentSettings.codFee)

    const existing = await prisma.order.findUnique({ where: { idempotencyKey: key }, select: { id: true } })
    if (existing) {
      return {
        success: true,
        orderId: existing.id,
        paymentUploadToken: ['bank_transfer', 'wallets'].includes(paymentMethod)
          ? await createPaymentUploadToken(existing.id)
          : undefined,
      }
    }

    const transactionResult = await prisma.$transaction(async (tx) => {
      let calculatedCartTotal = 0
      const orderItemsData: { productId: string; variantId?: string | null; quantity: number; price: number }[] = []
      const now = new Date()
      const activeCampaigns = await tx.campaign.findMany({
        where: {
          isActive: true,
          startDate: { lte: now },
          endDate: { gte: now },
          products: { some: { id: { in: parsedItems.map(item => item.productId) } } },
        },
        select: { discountPercentage: true, products: { select: { id: true } } },
      })

      for (const item of parsedItems) {
        const dbProduct = productsById.get(item.productId)
        if (!dbProduct) throw new Error('منتج غير موجود')

        let stockToCheck = dbProduct.stock
        let itemPrice = Number(dbProduct.price)
        if (item.variantId) {
          const variant = dbProduct.variants.find(v => v.id === item.variantId)
          if (!variant) throw new Error(`الخيار المحدد لمنتج "${dbProduct.name}" غير موجود`)
          stockToCheck = variant.stock
          itemPrice = Number(variant.price)
        }

        const campaignDiscount = activeCampaigns
          .filter(campaign => campaign.discountPercentage !== null && campaign.products.some(product => product.id === item.productId))
          .reduce((max, campaign) => Math.max(max, campaign.discountPercentage || 0), 0)
        if (campaignDiscount > 0 && campaignDiscount <= 100) {
          itemPrice = Math.round(itemPrice * (1 - campaignDiscount / 100) * 100) / 100
        }

        if (stockToCheck < item.quantity) {
          throw new Error(`الكمية المطلوبة من "${dbProduct.name}" غير متوفرة (المتوفر: ${stockToCheck})`)
        }

        calculatedCartTotal += itemPrice * item.quantity
        orderItemsData.push({ productId: item.productId, variantId: item.variantId, quantity: item.quantity, price: itemPrice })
      }

      let discountAmount = 0
      let validatedCouponId: string | null = null
      let validatedCouponMaxUses: number | null = null
      const normalizedCouponCode = typeof couponCode === 'string' ? couponCode.trim().toUpperCase().slice(0, 50) : ''
      if (normalizedCouponCode) {
        const coupon = await tx.coupon.findUnique({ where: { code: normalizedCouponCode } })
        const now = new Date()
        if (!coupon || !coupon.isActive || (coupon.expiresAt && coupon.expiresAt <= now) ||
          (coupon.maxUses !== null && coupon.usedCount >= coupon.maxUses) ||
          (coupon.minOrderAmount !== null && calculatedCartTotal < Number(coupon.minOrderAmount))) {
          throw new Error('الكوبون غير صالح أو انتهت صلاحيته')
        }
        discountAmount = coupon.type === 'PERCENTAGE'
          ? Math.min(calculatedCartTotal, calculatedCartTotal * Number(coupon.value) / 100)
          : Math.min(calculatedCartTotal, Number(coupon.value))
        validatedCouponId = coupon.id
        validatedCouponMaxUses = coupon.maxUses
      }

      const discountedCartTotal = Math.max(0, calculatedCartTotal - discountAmount)
      const freeThreshold = Number(storeSettings?.freeShippingThreshold ?? 0)
      if (freeThreshold > 0 && discountedCartTotal >= freeThreshold) shippingFee = 0

      if (validatedCouponId) {
        const now = new Date()
        const couponUpdate = await tx.coupon.updateMany({
          where: {
            id: validatedCouponId,
            isActive: true,
            OR: [{ expiresAt: null }, { expiresAt: { gt: now } }],
            ...(validatedCouponMaxUses === null ? {} : { usedCount: { lt: validatedCouponMaxUses } }),
          },
          data: { usedCount: { increment: 1 } },
        })
        if (couponUpdate.count === 0) throw new Error('تم استنفاد الكوبون للتو من قبل عميل آخر')
      }

      const finalTotal = discountedCartTotal + shippingFee
      const paymentStatus = ['bank_transfer', 'wallets'].includes(paymentMethod) ? 'AWAITING_PAYMENT' : 'PENDING'
      const orderNumber = `TIF-${new Date().getFullYear()}-${randomUUID().replace(/-/g, '').slice(0, 12).toUpperCase()}`

      for (const item of orderItemsData) {
        const updateResult = item.variantId
          ? await tx.productVariant.updateMany({ where: { id: item.variantId, stock: { gte: item.quantity } }, data: { stock: { decrement: item.quantity } } })
          : await tx.product.updateMany({ where: { id: item.productId, stock: { gte: item.quantity } }, data: { stock: { decrement: item.quantity } } })
        if (updateResult.count === 0) throw new Error('الكمية المطلوبة لم تعد متوفرة، يرجى المحاولة مرة أخرى')
      }

      const order = await tx.order.create({
        data: {
          orderNumber,
          idempotencyKey: key,
          customerName,
          customerPhone,
          governorate,
          city,
          address,
          paymentMethod,
          shippingFee,
          totalAmount: finalTotal,
          paymentStatus,
          status: 'NEW',
          couponId: validatedCouponId,
          items: { create: orderItemsData },
        },
      })

      return { order, finalTotal }
    })

    try {
      await sendWebPushNotification('طلب جديد', `طلب جديد رقم ${transactionResult.order.orderNumber} بقيمة ${transactionResult.finalTotal}`, `/admin/orders/${transactionResult.order.id}`)
    } catch (pushErr) {
      console.error('Failed to send push notification:', pushErr)
    }

    return {
      success: true,
      orderId: transactionResult.order.id,
      paymentUploadToken: ['bank_transfer', 'wallets'].includes(paymentMethod)
        ? await createPaymentUploadToken(transactionResult.order.id)
        : undefined,
    }
  } catch (error: unknown) {
    if (isUniqueViolation(error) && idempotencyKey) {
      const existing = await prisma.order.findUnique({ where: { idempotencyKey }, select: { id: true } })
      if (existing) return { success: true, orderId: existing.id, paymentUploadToken: await createPaymentUploadToken(existing.id) }
    }
    console.error('Failed to create order:', error)
    return { success: false, error: error instanceof Error && !error.message.includes('Prisma') ? error.message : 'حدث خطأ أثناء إنشاء الطلب' }
  }
}

export async function updateOrderPaymentProof(orderId: string, paymentProofUrl: string, transactionId?: string, uploadToken?: string) {
  try {
    if (typeof orderId !== 'string' || orderId.length === 0 || typeof paymentProofUrl !== 'string') {
      return { success: false, error: 'بيانات إثبات الدفع غير صالحة' }
    }
    const normalizedUrl = new URL(paymentProofUrl)
    if (normalizedUrl.protocol !== 'https:' || paymentProofUrl.length > 2048) {
      return { success: false, error: 'رابط إثبات الدفع غير صالح' }
    }
    const normalizedTransactionId = transactionId?.trim().slice(0, 100) || undefined

    let isAuthorized = false
    try {
      await verifyAdmin()
      isAuthorized = true
    } catch {
      isAuthorized = Boolean(uploadToken && await verifyPaymentUploadToken(uploadToken, orderId))
    }
    if (!isAuthorized) return { success: false, error: 'غير مصرح بتحديث إثبات الدفع' }

    if (!checkRateLimit(`proof_${orderId}`, 5, 60 * 60 * 1000)) {
      return { success: false, error: 'تم تجاوز الحد المسموح لرفع الإيصالات لهذا الطلب.' }
    }

    const updated = await prisma.order.updateMany({
      where: { id: orderId, paymentStatus: { in: [...PAYMENT_PROOF_STATUSES] } },
      data: { paymentProofUrl, transactionId: normalizedTransactionId, paymentStatus: 'AWAITING_CONFIRMATION' },
    })
    if (updated.count === 0) return { success: false, error: 'لا يمكن إرفاق إيصال لهذا الطلب في حالته الحالية' }

    const order = await prisma.order.findUnique({ where: { id: orderId }, select: { id: true, orderNumber: true } })
    if (order) {
      try {
        await sendWebPushNotification('إثبات دفع جديد', `تم رفع إثبات دفع للطلب رقم ${order.orderNumber}`, `/admin/orders/${order.id}`)
      } catch (pushErr) {
        console.error('Failed to send push notification for payment proof:', pushErr)
      }
    }

    return { success: true }
  } catch (error: unknown) {
    console.error('Failed to update order payment proof:', error)
    return { success: false, error: 'حدث خطأ أثناء حفظ إثبات الدفع' }
  }
}

export async function getPaymentMethods() {
  const [settings, storeSettings, bankAccounts, digitalWallets, shippingCities] = await Promise.all([
    prisma.paymentSettings.findUnique({ where: { id: 'singleton' } }),
    prisma.storeSettings.findUnique({ where: { id: 'singleton' } }),
    prisma.bankAccount.findMany({ where: { isActive: true }, orderBy: { createdAt: 'desc' } }),
    prisma.digitalWallet.findMany({ where: { isActive: true }, orderBy: { createdAt: 'desc' } }),
    prisma.shippingCity.findMany({ where: { isActive: true }, orderBy: { name: 'asc' } }),
  ])

  return {
    settings: settings ? { ...settings, codFee: Number(settings.codFee) } : null,
    storeSettings: {
      shippingFee: Number(storeSettings?.shippingFee ?? 0),
      freeShippingThreshold: Number(storeSettings?.freeShippingThreshold ?? 0),
    },
    shippingCities: shippingCities.map(c => ({ id: c.id, name: c.name, shippingFee: Number(c.shippingFee) })),
    bankAccounts,
    digitalWallets,
  }
}
