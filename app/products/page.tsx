import Link from 'next/link'
import Image from 'next/image'
import { Metadata } from 'next'
import { Filter } from 'lucide-react'
import prisma from '@/lib/prisma'
import Navbar from '@/components/Navbar'
import { getImageSizes } from '@/lib/image-utils'
import Footer from '@/components/Footer'

export const metadata: Metadata = {
  title: 'المجموعات | TIF طيف',
  description: 'اكتشف تشكيلاتنا الحصرية من العطور الفاخرة.',
}

export const dynamic = 'force-dynamic'

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: Promise<{ collection?: string }>
}) {
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

  // Fetch active collections for the filter chips
  const dbCollections = await prisma.collection.findMany({
    where: { isActive: true },
    orderBy: { createdAt: 'desc' }
  })

  const filters = [
    { label: 'الكل', href: '/products' },
    ...dbCollections.map(c => ({
      label: c.name,
      href: `/products?collection=${c.slug}`
    }))
  ]

  return (
    <main className="min-h-screen bg-ivory text-deep-green font-sans flex flex-col" dir="rtl">
      <Navbar />

      <div className="flex-grow pt-28 pb-24 relative">
        {/* Header Section */}
        <section className="px-6 pt-10 pb-6 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-deep-green mb-4">المجموعات</h1>
          <p className="text-lg text-deep-green/70 max-w-sm mx-auto">
            اكتشف تشكيلاتنا الحصرية من العطور الفاخرة.
          </p>
        </section>

        {/* Quick Filter Chips (Horizontal Scroll) */}
        <section className="pl-6 pr-4 pb-12 overflow-x-auto no-scrollbar">
          <div className="flex gap-3 whitespace-nowrap rtl:pr-6 rtl:pl-4 justify-start md:justify-center">
            {filters.map((f) => {
              const isActive = f.href === '/products' 
                ? !collection 
                : collection === new URLSearchParams(f.href.split('?')[1]).get('collection')
              
              return (
                <Link
                  key={f.href}
                  href={f.href}
                  className={`px-6 py-2.5 text-sm font-bold tracking-wide rounded-none border transition-all duration-300 ${
                    isActive
                      ? 'bg-emerald text-ivory border-emerald'
                      : 'bg-transparent text-deep-green border-deep-green/20 hover:border-emerald hover:text-emerald'
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
            <div className="text-center py-20 text-deep-green/50 text-lg">
              لا توجد منتجات في هذه المجموعة حالياً
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 gap-y-12">
              {products.map((product, index) => (
                <Link
                  key={product.id}
                  href={`/products/${product.slug}`}
                  className="flex flex-col items-center group cursor-pointer"
                >
                  <div className="w-full aspect-[4/5] bg-white relative mb-5 overflow-hidden flex items-center justify-center p-6 border border-black/5 group-hover:shadow-lg transition-all duration-500">
                    {product.imageUrl ? (
                      <Image
                        src={product.imageUrl}
                        alt={product.name}
                        fill
                        className="object-contain p-6 mix-blend-multiply group-hover:scale-105 transition-transform duration-700 ease-out"
                        sizes={getImageSizes('card')}
                        // المنتجات الأربعة الأولى فقط تحصل على priority — الباقي lazy
                        priority={index < 4}
                        loading={index < 4 ? undefined : 'lazy'}
                      />
                    ) : (
                      <div className="text-gold/30 text-4xl">طيف</div>
                    )}
                  </div>
                  {product.brand && (
                    <div className="text-gold tracking-widest mb-2 uppercase text-[10px] font-bold">
                      {product.brand}
                    </div>
                  )}
                  <h3 className="text-xl md:text-2xl font-black text-deep-green text-center mb-2 leading-tight">
                    {product.name}
                  </h3>
                  <div className="flex items-baseline gap-2">
                    <span className="font-bold text-emerald text-lg">
                      {Number(product.price).toLocaleString('ar-SA')} ر.س
                    </span>
                    {product.compareAtPrice && (
                      <span className="text-deep-green/40 text-sm line-through">
                        {Number(product.compareAtPrice).toLocaleString('ar-SA')}
                      </span>
                    )}
                  </div>
                </Link>
              ))}
            </div>
          )}
        </section>

        {/* Floating Filter Button (Mobile) */}
        <div className="md:hidden fixed bottom-6 left-0 right-0 px-6 flex justify-center z-40 pointer-events-none">
          <button className="pointer-events-auto bg-deep-green text-ivory text-sm font-bold py-3.5 px-8 w-48 flex items-center justify-center gap-2 rounded-none shadow-[0_4px_20px_rgba(32,37,34,0.3)] active:scale-95 transition-transform">
            <Filter size={18} />
            تصفية النتائج
          </button>
        </div>
      </div>

      <Footer />
    </main>
  )
}

