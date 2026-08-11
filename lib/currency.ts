import prisma from './prisma'

export async function getCurrency() {
  try {
    const paymentSettings = await prisma.paymentSettings.findUnique({
      where: { id: 'singleton' },
      select: { currency: true }
    })
    return paymentSettings?.currency || 'ر.س'
  } catch {
    return 'ر.س'
  }
}
