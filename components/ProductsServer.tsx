import prisma from '@/lib/prisma'
import ProductsClient from './ProductsClient'

export default async function Products() {
  let products: any[] = []
  try {
    // جلب الحقول الأساسية فقط — لا توجد تفاصيل طويلة أو حقول غير مستخدمة
    products = await prisma.product.findMany({
      where: { isActive: true, featured: true },
      orderBy: { createdAt: 'desc' },
      take: 6,
      select: {
        id: true,
        slug: true,
        name: true,
        brand: true,
        description: true,
        price: true,
        sku: true,
        category: true,
        size: true,
        imageUrl: true,
      },
    })
  } catch (e) {
    console.error('Could not load products from DB', e)
  }

  // Map DB products to the shape ProductsClient expects
  const mapped = products.map((p) => ({
    id: p.slug,
    name: p.name,
    engName: p.brand || '',
    description: p.description || '',
    price: `${Number(p.price).toLocaleString('ar-SA')} ر.س`,
    rawPrice: Number(p.price),
    code: p.sku || p.id.slice(0, 8).toUpperCase(),
    color: p.category || '',
    size: p.size || '',
    gradient: 'from-blue-900/40 to-cyan-800/40',
    image: p.imageUrl || '',
    slug: p.slug,
  }))

  return <ProductsClient products={mapped} />
}
