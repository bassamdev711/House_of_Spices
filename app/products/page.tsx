import Link from 'next/link'
import Image from 'next/image'
import { Metadata } from 'next'
import { Sparkles } from 'lucide-react'
import prisma from '@/lib/prisma'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'

export const metadata: Metadata = {
  title: 'المجموعة الكاملة | TIF طيف',
  description: 'استكشف المجموعة الكاملة من عطور TIF طيف — فخامة حصرية مستوحاة من الضوء والهدوء',
}

export const dynamic = 'force-dynamic'

const genderLabel: Record<string, string> = {
  Men: 'رجالي',
  Women: 'نسائي',
  Unisex: 'للجميع',
}

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: Promise<{ gender?: string; category?: string }>
}) {
  const { gender, category } = await searchParams

  const products = await prisma.product.findMany({
    where: {
      isActive: true,
      ...(gender ? { gender } : {}),
      ...(category ? { category } : {}),
    },
    orderBy: [{ featured: 'desc' }, { createdAt: 'desc' }],
  })

  const filters = [
    { label: 'الكل', href: '/products' },
    { label: 'رجالي', href: '/products?gender=Men' },
    { label: 'نسائي', href: '/products?gender=Women' },
    { label: 'للجميع', href: '/products?gender=Unisex' },
  ]

  return (
    <main className="min-h-screen bg-[#050b14] text-white font-sans" dir="rtl">
      <Navbar />

      {/* Hero Header */}
      <section className="relative pt-40 pb-20 px-6 text-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-[#0a1630]/80 to-[#050b14] pointer-events-none" />
        <div className="relative max-w-4xl mx-auto">
          <div className="flex items-center justify-center gap-2 text-light-beam text-xs tracking-[0.3em] uppercase mb-6">
            <Sparkles className="w-4 h-4" />
            <span>طيف — مجموعة العطور الحصرية</span>
            <Sparkles className="w-4 h-4" />
          </div>
          <h1 className="text-5xl md:text-7xl font-black text-white mb-6 leading-tight">
            المجموعة الكاملة
          </h1>
          <p className="text-crystal-silver/70 text-lg max-w-xl mx-auto">
            كل عطر قصة، كل رائحة حضور — اكتشف عالم طيف بكل تفاصيله
          </p>
        </div>
      </section>

      {/* Filter Bar */}
      <section className="px-6 pb-12">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-3 flex-wrap justify-center">
            {filters.map((f) => {
              const isActive =
                f.href === '/products'
                  ? !gender && !category
                  : f.href.includes(gender || '') && f.href.includes(category || '')
              return (
                <Link
                  key={f.href}
                  href={f.href}
                  className={`px-5 py-2 text-sm font-medium border transition-all duration-300 ${
                    isActive
                      ? 'border-light-beam text-light-beam bg-light-beam/10'
                      : 'border-white/20 text-white/60 hover:border-white/60 hover:text-white'
                  }`}
                >
                  {f.label}
                </Link>
              )
            })}
          </div>
        </div>
      </section>

      {/* Products Grid */}
      <section className="px-6 pb-32">
        <div className="max-w-7xl mx-auto">
          {products.length === 0 ? (
            <div className="text-center py-32 text-white/30 text-xl">
              لا توجد منتجات في هذا التصنيف حتى الآن
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {products.map((product) => (
                <Link
                  key={product.id}
                  href={`/products/${product.slug}`}
                  className="group relative overflow-hidden border border-white/10 bg-[#0a1630]/40 backdrop-blur-sm hover:border-light-beam/40 transition-all duration-500"
                >
                  {/* Image */}
                  <div className="relative aspect-[3/4] overflow-hidden bg-gradient-to-b from-sapphire-glow/20 to-midnight-blue/40">
                    {product.imageUrl ? (
                      <Image
                        src={product.imageUrl}
                        alt={product.name}
                        fill
                        className="object-cover opacity-80 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700"
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                      />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <Sparkles className="w-16 h-16 text-light-beam/20" />
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-[#050b14] via-transparent to-transparent opacity-70" />

                    {/* Badges */}
                    <div className="absolute top-3 right-3 flex flex-col gap-1">
                      {product.featured && (
                        <span className="bg-light-beam/90 text-[#050b14] text-[10px] font-bold px-2 py-0.5 tracking-wider">
                          مميز
                        </span>
                      )}
                      {product.bestseller && (
                        <span className="bg-amber-400/90 text-[#050b14] text-[10px] font-bold px-2 py-0.5 tracking-wider">
                          الأكثر مبيعاً
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Info */}
                  <div className="p-5">
                    {product.brand && (
                      <p className="text-light-beam/60 text-[10px] tracking-[0.25em] uppercase mb-1">{product.brand}</p>
                    )}
                    <h3 className="text-white font-bold text-lg mb-1 group-hover:text-light-beam transition-colors">
                      {product.name}
                    </h3>
                    <div className="flex items-center gap-2 text-sm text-white/40 mb-4">
                      {product.size && <span>{product.size}</span>}
                      {product.size && product.gender && <span>·</span>}
                      {product.gender && <span>{genderLabel[product.gender] || product.gender}</span>}
                    </div>
                    <div className="flex items-baseline gap-2">
                      <span className="text-white font-bold text-xl">
                        {Number(product.price).toLocaleString('ar-YE')}
                      </span>
                      <span className="text-white/40 text-xs">YER</span>
                      {product.compareAtPrice && (
                        <span className="text-white/30 text-sm line-through mr-auto">
                          {Number(product.compareAtPrice).toLocaleString('ar-YE')}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Hover CTA */}
                  <div className="absolute bottom-0 inset-x-0 bg-light-beam text-[#050b14] text-sm font-bold py-3 text-center translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                    اكتشف المنتج
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      <Footer />
    </main>
  )
}
