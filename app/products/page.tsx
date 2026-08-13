import Link from 'next/link'
import Image from 'next/image'
import { Metadata } from 'next'
import { Suspense } from 'react'
import prisma from '@/lib/prisma'
import Navbar from '@/components/Navbar'
import { getImageSizes } from '@/lib/image-utils'
import Footer from '@/components/Footer'
import { getCurrency } from '@/lib/currency'
import FilterDrawer from '@/components/FilterDrawer'

export const metadata: Metadata = {
  title: 'تصنيفاتنا | TIF طيف',
  description: 'اكتشف تصنيفاتنا المختلفه',
}

export const dynamic = 'force-dynamic'

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: Promise<{ collection?: string }>
}) {
  const currency = await getCurrency()

  const { collection } = await searchParams

  // جلب الحقول الأساسية فقط — لا حاجة للوصف أو الصور المتعددة في القائمة
  const products = await prisma.product.findMany({
    where: {
      isActive: true,
      ...(collection ? { collection: { slug: collection } } : {}),
    },
    orderBy: [{ featured: 'desc' }, { createdAt: 'desc' }],
    select: {
      id: true,
      slug: true,
      name: true,
      brand: true,
      price: true,
      compareAtPrice: true,
      imageUrl: true,
      featured: true,
    },
  })

  // جلب التصنيفات النشطة للفلاتر
  const dbCollections = await prisma.collection.findMany({
    where: { isActive: true },
    orderBy: { createdAt: 'desc' }
  })

  // قائمة الفلاتر — slug: null = "الكل"
  const drawerFilters = [
    { label: 'الكل', slug: null },
    ...dbCollections.map(c => ({ label: c.name, slug: c.slug }))
  ]

  // قائمة الروابط للـ Chips في الديسكتوب
  const chipFilters = [
    { label: 'الكل', href: '/products' },
    ...dbCollections.map(c => ({
      label: c.name,
      href: `/products?collection=${c.slug}`
    }))
  ]

  return (
    <main className="min-h-screen bg-surface text-foreground font-sans flex flex-col" dir="rtl">
      <Navbar />

      <div className="flex-grow pt-24 md:pt-28 pb-24 relative">
        <section className="px-4 pb-4 text-center">
          <h1 className="text-xl md:text-3xl font-bold text-foreground mb-2 whitespace-nowrap">اكتشف تصنيفاتنا المختلفه</h1>
        </section>

        {/* Quick Filter Chips — ديسكتوب + موبايل أفقي */}
        <section className="pl-6 pr-4 pb-6 md:pb-12 overflow-x-auto no-scrollbar">
          <div className="flex gap-3 whitespace-nowrap rtl:pr-6 rtl:pl-4 justify-start md:justify-center">
            {chipFilters.map((f) => {
              const isActive = f.href === '/products'
                ? !collection
                : collection === new URLSearchParams(f.href.split('?')[1]).get('collection')

              return (
                <Link
                  key={f.href}
                  href={f.href}
                  className={`px-4 py-2 md:px-6 md:py-2.5 text-xs md:text-sm font-bold tracking-wide rounded-none border transition-all duration-300 ${
                    isActive
                      ? 'bg-brand text-surface border-brand'
                      : 'bg-transparent text-foreground border-foreground/20 hover:border-brand hover:text-brand'
                  }`}
                >
                  {f.label}
                </Link>
              )
            })}
          </div>
        </section>

        {/* Product Grid */}
        <section className="px-6 md:px-12 max-w-7xl mx-auto">
          {products.length === 0 ? (
            <div className="text-center py-20 text-foreground/50 text-lg">
              لا توجد منتجات في هذه المجموعة حالياً
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 gap-y-8 md:gap-6 md:gap-y-12">
              {products.map((product, index) => (
                <Link
                  key={product.id}
                  href={`/products/${product.slug}`}
                  className="flex flex-col items-center group cursor-pointer"
                >
                  <div className="w-full aspect-[4/5] bg-white relative mb-3 md:mb-5 overflow-hidden flex items-center justify-center p-3 md:p-6 border border-black/5 group-hover:shadow-lg transition-all duration-500">
                    {product.imageUrl ? (
                      <Image
                        src={product.imageUrl}
                        alt={product.name}
                        fill
                        className="object-contain p-3 md:p-6 mix-blend-multiply group-hover:scale-105 transition-transform duration-700 ease-out"
                        sizes={getImageSizes('card')}
                        priority={index < 4}
                        loading={index < 4 ? undefined : 'lazy'}
                      />
                    ) : (
                      <div className="text-accent/30 text-2xl md:text-4xl">طيف</div>
                    )}
                  </div>
                  {product.brand && (
                    <div className="text-accent tracking-widest mb-1 md:mb-2 uppercase text-[9px] md:text-[10px] font-bold">
                      {product.brand}
                    </div>
                  )}
                  <h3 className="text-base md:text-2xl font-black text-foreground text-center mb-1 md:mb-2 leading-tight">
                    {product.name}
                  </h3>
                  <div className="flex flex-col md:flex-row items-center md:items-baseline gap-1 md:gap-2">
                    <span className="font-bold text-brand text-sm md:text-lg">
                      {Number(product.price).toLocaleString('ar-SA')} {currency}
                    </span>
                    {product.compareAtPrice && (
                      <span className="text-foreground/40 text-xs md:text-sm line-through">
                        {Number(product.compareAtPrice).toLocaleString('ar-SA')}
                      </span>
                    )}
                  </div>
                </Link>
              ))}
            </div>
          )}
        </section>
      </div>

      <Footer />

      {/* ─── زر التصفية العائم + Drawer (موبايل فقط) ─── */}
      <Suspense fallback={null}>
        <FilterDrawer filters={drawerFilters} />
      </Suspense>
    </main>
  )
}
