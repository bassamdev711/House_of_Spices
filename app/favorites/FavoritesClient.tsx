"use client";

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Heart, ShoppingBag, ArrowRight } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useFavorites } from '@/components/FavoritesProvider';
import { useCart } from '@/components/CartProvider';
import { useCurrency } from '@/components/CurrencyProvider';
import { useToast } from '@/components/ToastProvider';

export default function FavoritesClient() {
  const { favorites, toggleFavorite, isFavorite } = useFavorites();
  const { addToCart } = useCart();
  const { showToast } = useToast();
  const currency = useCurrency();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <div className="min-h-screen bg-[#F9F7F2] py-32"></div>;
  }

  return (
    <div className="min-h-screen bg-[#F9F7F2] py-32 px-4" dir="rtl">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <div className="flex items-center justify-center gap-3 mb-4 text-emerald">
            <Heart size={32} fill="currentColor" />
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-deep-green mb-6">
            المفضلة
          </h1>
          <p className="text-lg text-deep-green/60">
            عطورك المفضلة التي اخترتها بانتظارك
          </p>
        </motion.div>

        {favorites.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-20 bg-white rounded-3xl border border-black/5 shadow-sm max-w-2xl mx-auto"
          >
            <div className="w-24 h-24 bg-[#F9F7F2] rounded-full flex items-center justify-center mx-auto mb-6 text-emerald/30">
              <Heart size={48} />
            </div>
            <h2 className="text-2xl font-bold text-deep-green mb-4">قائمة المفضلة فارغة</h2>
            <p className="text-deep-green/60 mb-8 max-w-md mx-auto">
              لم تقم بإضافة أي منتجات إلى المفضلة بعد. تصفح مجموعتنا واكتشف العطور التي تناسب ذوقك.
            </p>
            <Link 
              href="/products"
              className="inline-flex items-center justify-center gap-2 bg-emerald text-white h-12 px-8 rounded-xl font-bold hover:bg-[#15463d] transition-colors"
            >
              استكشف المجموعة
              <ArrowRight size={18} />
            </Link>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {favorites.map((product, index) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="relative bg-white cursor-pointer group shadow-sm hover:shadow-xl transition-all duration-500 border border-black/10 rounded-2xl flex flex-col overflow-hidden h-[500px]"
              >
                <div className="relative w-full h-[65%] bg-ivory/50 transition-colors duration-500 group-hover:bg-[#F2EFE8] flex items-center justify-center p-8">
                  <button 
                    className="absolute top-4 left-4 z-20 text-red-500 transition-transform hover:scale-110 active:scale-95"
                    onClick={(e) => { 
                      e.preventDefault();
                      toggleFavorite(product);
                    }}
                    aria-label="إزالة من المفضلة"
                  >
                    <Heart size={24} fill="currentColor" />
                  </button>
                  <Link href={`/products/${product.slug}`} className="absolute inset-0 z-10" />
                  {product.imageUrl ? (
                    <Image
                      src={product.imageUrl}
                      alt={product.name}
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      className="object-contain p-8 mix-blend-multiply scale-95 group-hover:scale-105 transition-transform duration-700 ease-out z-0"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gold/20 text-6xl z-0">
                      طيف
                    </div>
                  )}
                </div>
                
                <div className="flex-1 flex flex-col items-center justify-center p-6 text-center bg-white z-20 border-t border-black/5 relative">
                  <h3 className="text-2xl font-black text-deep-green mb-1">{product.name}</h3>
                  <p className="text-gold text-[10px] tracking-[0.2em] uppercase mb-4">{product.engName || 'TIF EXCLUSIVE'}</p>
                  
                  <div className="flex items-center gap-2 mb-6">
                    <p className="text-emerald font-bold text-lg">{Number(product.price).toLocaleString('ar-SA')} {currency}</p>
                    {product.compareAtPrice && (
                      <p className="text-deep-green/40 line-through text-sm">
                        {Number(product.compareAtPrice).toLocaleString('ar-SA')} {currency}
                      </p>
                    )}
                  </div>
                  
                  <button 
                    onClick={(e) => {
                      e.preventDefault();
                      addToCart({
                        id: product.id,
                        name: product.name,
                        slug: product.slug,
                        price: product.price,
                        imageUrl: product.imageUrl || '',
                        quantity: 1
                      });
                      showToast('تمت الإضافة إلى السلة بنجاح', 'success');
                    }}
                    className="w-full max-w-[200px] h-10 border border-emerald text-emerald hover:bg-emerald hover:text-white transition-colors rounded-xl flex items-center justify-center gap-2 font-bold text-sm"
                  >
                    <ShoppingBag size={16} />
                    أضف للسلة
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
