'use client'

import { useState } from 'react'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import { Sparkles, Minus, Plus, X } from 'lucide-react'
import { useCart } from '@/components/CartProvider'
import { getImageSizes } from '@/lib/image-utils'

interface Product {
  id: string
  name: string
  slug: string
  brand: string | null
  description: string | null
  price: number
  compareAtPrice: number | null
  size: string | null
  gender: string | null
  category: string | null
  imageUrl: string | null
  images: string[]
  featured: boolean
  bestseller: boolean
  stock: number
}

export default function ProductDetailClient({ product }: { product: Product }) {
  const allImages = [product.imageUrl, ...product.images].filter(Boolean) as string[]
  const [activeImage, setActiveImage] = useState(allImages[0] || '')
  const [lightboxOpen, setLightboxOpen] = useState(false)
  const [quantity, setQuantity] = useState(1)
  const { addToCart } = useCart()

  const handleAddToCart = () => {
    if (product.stock <= 0) {
      alert('نعتذر، هذا المنتج نفد من المخزون.')
      return
    }
    if (quantity > product.stock) {
      alert(`عذراً، المتوفر في المخزون هو ${product.stock} فقط.`)
      return
    }

    addToCart({
      id: product.id,
      name: product.name,
      slug: product.slug,
      price: product.price,
      imageUrl: product.imageUrl || '',
      quantity,
    })
    
    alert(`تمت إضافة ${quantity} من ${product.name} إلى السلة!`)
  }

  return (
    <>
      <div className="relative bg-ivory text-deep-green pb-16" dir="rtl">
        <div className="flex flex-col lg:flex-row gap-6 lg:gap-10 items-start">
          
          {/* ======= Left: Image Gallery (Narrower, compact) ======= */}
          <div className="w-full lg:w-4/12 flex flex-col gap-3">
            
            {/* Main Image Stage */}
            <div 
              className="w-full max-w-[320px] mx-auto aspect-[4/5] max-h-[400px] bg-white relative overflow-hidden border border-black/5 flex items-center justify-center cursor-zoom-in group"
              onClick={() => setLightboxOpen(true)}
            >
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeImage}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="relative w-full h-full flex items-center justify-center p-4 md:p-8"
                >
                  {activeImage ? (
                    <Image
                      src={activeImage}
                      alt={product.name}
                      fill
                      priority
                      className="object-contain mix-blend-multiply p-4 transition-transform duration-500 group-hover:scale-105"
                      sizes={getImageSizes('detail')}
                    />
                  ) : (
                    <Sparkles className="w-12 h-12 text-gold/20" />
                  )}
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Thumbnails */}
            {allImages.length > 1 && (
              <div className="flex gap-3 overflow-x-auto no-scrollbar pb-2 justify-center">
                {allImages.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setMainImageIndex(i)}
                    className={`relative w-14 h-14 bg-white border shrink-0 transition-all ${
                      mainImageIndex === i ? 'border-emerald shadow-sm scale-105' : 'border-black/5 opacity-60 hover:opacity-100 hover:border-black/20'
                    }`}
                  >
                    <div className="relative w-full h-full">
                      <Image
                        src={img}
                        alt={`صورة ${i + 1}`}
                        fill
                        loading="lazy"
                        sizes={getImageSizes('thumbnail')}
                        className="object-cover mix-blend-multiply p-1"
                      />
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* ======= Right: Product Info ======= */}
          <div className="w-full lg:w-8/12 flex flex-col text-right">
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="mb-4">
                <span className="text-gold font-bold text-[10px] tracking-widest uppercase mb-2 block">
                  {product.engName || 'TIF EXCLUSIVE'}
                </span>
                <h1 className="text-2xl md:text-3xl font-black text-deep-green mb-2">{product.name}</h1>
                <div className="flex items-center gap-3">
                  <span className="text-xl md:text-2xl font-bold text-emerald">
                    {Number(product.price).toLocaleString('ar-SA')} ر.س
                  </span>
                  {product.compareAtPrice && product.compareAtPrice > product.price && (
                    <span className="text-sm md:text-base text-deep-green/40 line-through">
                      {Number(product.compareAtPrice).toLocaleString('ar-SA')} ر.س
                    </span>
                  )}
                </div>
              </div>

              {product.description && (
                <p className="text-deep-green/70 text-sm md:text-base leading-relaxed mb-6">
                  {product.description}
                </p>
              )}

              {/* Specs Grid (Compact) */}
              <div className="grid grid-cols-2 gap-3 mb-6 bg-white p-3 border border-black/5">
                {product.size && (
                  <div className="flex flex-col">
                    <span className="text-deep-green/50 text-[10px] font-bold mb-1">الحجم</span>
                    <span className="text-deep-green text-sm font-medium" dir="ltr">{product.size}</span>
                  </div>
                )}
                {product.gender && (
                  <div className="flex flex-col">
                    <span className="text-deep-green/50 text-[10px] font-bold mb-1">الجنس</span>
                    <span className="text-deep-green text-sm font-medium">{product.gender}</span>
                  </div>
                )}
                {product.category && (
                  <div className="flex flex-col">
                    <span className="text-deep-green/50 text-[10px] font-bold mb-1">التصنيف</span>
                    <span className="text-deep-green text-sm font-medium">{product.category}</span>
                  </div>
                )}
                <div className="flex flex-col">
                  <span className="text-deep-green/50 text-[10px] font-bold mb-1">حالة التوفر</span>
                  <span className={product.stock > 0 ? "text-emerald text-sm font-medium" : "text-red-500 text-sm font-medium"}>
                    {product.stock > 0 ? "متوفر" : "نفد من المخزون"}
                  </span>
                </div>
              </div>

              {/* Purchase Action */}
              <div className="hidden md:flex gap-3 mb-6">
                <div className="flex items-center border border-black/10 bg-white h-10 w-24">
                  <button 
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-8 h-full flex items-center justify-center text-deep-green/50 hover:text-deep-green transition-colors"
                  >
                    <Minus size={14} />
                  </button>
                  <span className="flex-1 text-center font-bold text-sm">{quantity}</span>
                  <button 
                    onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                    className="w-8 h-full flex items-center justify-center text-deep-green/50 hover:text-deep-green transition-colors"
                  >
                    <Plus size={14} />
                  </button>
                </div>
                <button 
                  onClick={handleAddToCart}
                  className="flex-1 bg-gold text-deep-green font-bold h-10 flex items-center justify-center hover:bg-[#c9a756] transition-all rounded shadow-sm"
                >
                  أضف إلى السلة
                </button>
              </div>

            </motion.div>
          </div>
        </div>

        {/* Fixed Bottom Bar for Mobile */}
        <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-md border-t border-black/10 p-3 px-4 flex gap-3 z-40 shadow-[0_-4px_20px_rgba(0,0,0,0.05)]" dir="rtl">
          <div className="flex items-center border border-black/10 h-11 w-28 shrink-0 rounded-lg overflow-hidden bg-ivory">
            <button 
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
              className="w-10 h-full flex items-center justify-center text-deep-green active:bg-black/5"
            >
              <Minus size={14} />
            </button>
            <div className="flex-1 text-center text-sm font-bold text-deep-green">{quantity}</div>
            <button 
              onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
              className="w-10 h-full flex items-center justify-center text-deep-green active:bg-black/5"
            >
              <Plus size={14} />
            </button>
          </div>
          <button 
            onClick={handleAddToCart}
            className="flex-1 bg-gold text-deep-green h-11 font-bold hover:bg-[#c9a756] transition-colors duration-300 rounded-lg flex items-center justify-center uppercase text-sm shadow-sm"
          >
            أضف إلى السلة
          </button>
        </div>
      </div>

      {/* Lightbox for Image Zoom */}
      <AnimatePresence>
        {lightboxOpen && activeImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-white/95 backdrop-blur-sm flex items-center justify-center p-4 md:p-10"
            onClick={() => setLightboxOpen(false)}
            dir="ltr"
          >
            <button 
              className="absolute top-6 right-6 md:top-10 md:right-10 bg-ivory text-deep-green p-3 rounded-full hover:bg-gold transition-colors z-[101] shadow-lg"
              onClick={(e) => { e.stopPropagation(); setLightboxOpen(false); }}
            >
              <X size={24} />
            </button>
            <motion.div
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.95 }}
              transition={{ duration: 0.3 }}
              className="relative w-full max-w-5xl h-full flex items-center justify-center"
              onClick={(e) => e.stopPropagation()}
            >
              <Image
                src={activeImage}
                alt={product.name}
                fill
                className="object-contain"
                sizes="100vw"
                quality={100}
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
