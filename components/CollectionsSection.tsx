import prisma from '@/lib/prisma'
import Link from 'next/link'
import Image from 'next/image'
import { ArrowLeft } from 'lucide-react'

// Caching to improve speed
export const revalidate = 3600 // revalidate every hour

export default async function CollectionsSection() {
  let collections: any[] = []
  
  try {
    collections = await prisma.collection.findMany({
      orderBy: { createdAt: 'desc' },
      take: 4,
    })
  } catch (error) {
    console.error('Failed to load collections:', error)
  }

  if (collections.length === 0) return null

  return (
    <section className="py-24 bg-ivory" dir="rtl">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-4">
          <div>
            <span className="text-gold tracking-[0.3em] uppercase text-xs font-bold mb-4 block">
              تصنيفات طيف
            </span>
            <h2 className="text-4xl md:text-5xl font-black text-deep-green">استكشف المجموعات</h2>
          </div>
          <Link href="/products" className="inline-flex items-center gap-2 text-emerald font-bold border-b border-emerald/30 hover:border-emerald transition-colors pb-1">
            جميع المنتجات <ArrowLeft size={16} />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {collections.map((collection) => (
            <Link 
              key={collection.id} 
              href={`/products?collection=${collection.id}`}
              className="group relative h-[400px] overflow-hidden rounded-2xl bg-black/5"
            >
              {collection.imageUrl ? (
                <Image 
                  src={collection.imageUrl} 
                  alt={collection.name}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                  className="object-cover transition-transform duration-700 group-hover:scale-110"
                />
              ) : (
                <div className="absolute inset-0 bg-emerald/10 flex items-center justify-center">
                  <span className="text-emerald font-black text-3xl opacity-20">طيف</span>
                </div>
              )}
              
              <div className="absolute inset-0 bg-gradient-to-t from-deep-green/90 via-deep-green/30 to-transparent" />
              
              <div className="absolute bottom-0 left-0 right-0 p-8">
                <h3 className="text-2xl font-bold text-ivory mb-2 group-hover:-translate-y-2 transition-transform duration-300">
                  {collection.name}
                </h3>
                {collection.description && (
                  <p className="text-ivory/70 text-sm line-clamp-2 opacity-0 group-hover:opacity-100 group-hover:-translate-y-2 transition-all duration-300 delay-75">
                    {collection.description}
                  </p>
                )}
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
