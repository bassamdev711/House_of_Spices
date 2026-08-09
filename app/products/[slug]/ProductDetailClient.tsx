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
      <div className="relative bg-ivory text-deep-green pb-24 md:pb-16" dir="rtl">
        <div className="flex flex-col lg:flex-row gap-8 lg:gap-16 items-start">
          
          {/* ======= Left: Image Gallery (Narrower, compact) ======= */}
          <div className="w-full lg:w-5/12 flex flex-col gap-4">
            
            {/* Main Image Stage */}
            <div 
              className="w-full max-w-sm mx-auto aspect-[4/5] max-h-[500px] bg-white relative overflow-hidden border border-black/5 flex items-center justify-center cursor-zoom-in group"
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

            {/* Thumbnails (Below) */}
            {allImages.length > 1 && (
              <div className="flex gap-3 overflow-x-auto no-scrollbar pb-2 justify-center">
                {allImages.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveImage(img)}
                    className={`w-16 h-16 md:w-20 md:h-20 shrink-0 border overflow-hidden transition-all bg-white ${
                      activeImage === img
                        ? 'border-emerald border-2 opacity-100'
                        : 'border-black/10 opacity-60 hover:opacity-100'
                    }`}
                  >
                    <div className="relative w-full h-full">
                      <Image
                        src={img}
                        alt={`صورة ${i + 1}`}
                        fill
                        loading="lazy"
                        sizes={getImageSizes('thumbnail')}
                        className="object-cover mix-blend-multiply p-2"
                      />
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* ======= Right: Product Info (Wider for details) ======= */}
          <div className="w-full lg:w-7/12 flex flex-col text-right">
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              {/* Brand */}
              {product.brand && (
                <p className="text-gold text-xs tracking-widest uppercase font-bold mb-2">
                  {product.brand}
                </p>
              )}

              {/* Name */}
              <h1 className="text-2xl md:text-3xl lg:text-4xl font-black text-deep-green mb-3 leading-tight">
                {product.name}
              </h1>

              {/* Price */}
              <div className="flex items-center gap-3 mb-6">
                <span className="text-2xl font-bold text-emerald">
                  {Number(product.price).toLocaleString('ar-SA')} ر.س
                </span>
                {product.compareAtPrice && (
                  <span className="text-deep-green/40 text-base line-through">
                    {Number(product.compareAtPrice).toLocaleString('ar-SA')} ر.س
                  </span>
                )}
              </div>

              {/* Description */}
              {product.description && (
                <p className="text-deep-green/70 text-sm md:text-base leading-relaxed mb-6">
                  {product.description}
                </p>
              )}

              {/* Specs Grid */}
              <div className="bg-white border border-black/5 p-4 rounded-xl mb-8">
                <div className="grid grid-cols-2 gap-y-3 gap-x-6 text-sm">
                  {product.size && (
                    <div className="flex flex-col border-b border-black/5 pb-2">
                      <span className="text-deep-green/50 text-xs font-bold mb-1">الحجم</span>
                      <span className="text-deep-green font-medium" dir="ltr">{product.size}</span>
                    </div>
                  )}
                  {product.gender && (
                    <div className="flex flex-col border-b border-black/5 pb-2">
                      <span className="text-deep-green/50 text-xs font-bold mb-1">الجنس</span>
                      <span className="text-deep-green font-medium">{product.gender}</span>
                    </div>
                  )}
                  {product.category && (
                    <div className="flex flex-col border-b border-black/5 pb-2">
                      <span className="text-deep-green/50 text-xs font-bold mb-1">التصنيف</span>
                      <span className="text-deep-green font-medium">{product.category}</span>
                    </div>
                  )}
                  <div className="flex flex-col border-b border-black/5 pb-2">
                    <span className="text-deep-green/50 text-xs font-bold mb-1">حالة التوفر</span>
                    <span className={product.stock > 0 ? "text-emerald font-medium" : "text-red-500 font-medium"}>
                      {product.stock > 0 ? "متوفر" : "نفد من المخزون"}
                    </span>
                  </div>
                </div>
              </div>

              {/* Desktop Add to Cart */}
              <div className="hidden md:flex gap-3 items-center">
                <div className="flex items-center border border-black/10 h-12 w-28 shrink-0 rounded-lg overflow-hidden bg-white">
                  <button 
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-10 h-full flex items-center justify-center text-deep-green hover:bg-black/5 transition-colors"
                  >
                    <Minus size={16} />
                  </button>
                  <div className="flex-1 text-center text-sm font-bold text-deep-green">{quantity}</div>
                  <button 
                    onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                    className="w-10 h-full flex items-center justify-center text-deep-green hover:bg-black/5 transition-colors"
                  >
                    <Plus size={16} />
                  </button>
                </div>
                <button 
                  onClick={handleAddToCart}
                  className="flex-1 bg-gold text-deep-green h-12 font-bold tracking-wide hover:bg-[#c9a756] transition-colors duration-300 rounded-lg flex items-center justify-center uppercase text-sm shadow-sm"
                >
                  أضف إلى السلة
                </button>
              </div>

            </motion.div>
          </div>
        </div>

        {/* Fixed Bottom Bar (Add to Cart) for Mobile */}
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
