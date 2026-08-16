"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { LayoutGrid } from 'lucide-react';

interface FilterChip {
  label: string;
  href: string;
  imageUrl: string | null;
}

interface CategoryFilterChipsProps {
  filters: FilterChip[];
  activeCollection?: string | null;
}

export default function CategoryFilterChips({ filters, activeCollection }: CategoryFilterChipsProps) {
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      if (currentScrollY > 120 && currentScrollY > lastScrollY + 5) {
        setIsVisible(false);
      } else if (currentScrollY < lastScrollY - 5 || currentScrollY < 50) {
        setIsVisible(true);
      }
      
      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);

  return (
    <div 
      className={`sticky z-40 transition-all duration-500 ease-in-out bg-surface/95 backdrop-blur-md py-4 md:py-6 shadow-[0_4px_20px_rgba(0,0,0,0.03)] border-b border-black/5 ${
        isVisible ? 'top-14 md:top-[68px]' : '-top-[200px]'
      }`}
      dir="rtl"
    >
      <div className="overflow-x-auto no-scrollbar px-4 md:px-6">
        <div className="flex gap-5 md:gap-8 whitespace-nowrap justify-start md:justify-center mx-auto max-w-7xl">
          {filters.map((f) => {
            const isActive = f.href === '/products'
              ? !activeCollection
              : activeCollection === new URLSearchParams(f.href.split('?')[1]).get('collection');

            return (
              <Link
                key={f.href}
                href={f.href}
                draggable={false}
                className="flex flex-col items-center gap-2 group shrink-0"
              >
                <div 
                  className={`relative w-16 h-16 md:w-20 md:h-20 rounded-full flex items-center justify-center overflow-hidden border-[3px] transition-all duration-300 ${
                    isActive
                      ? 'border-brand shadow-[0_0_15px_rgba(32,37,34,0.1)] scale-105'
                      : 'border-transparent bg-black/5 group-hover:border-brand/30 group-hover:scale-105'
                  }`}
                >
                  {f.imageUrl ? (
                    <Image
                      src={f.imageUrl}
                      alt={f.label}
                      fill
                      draggable={false}
                      className="object-cover"
                      sizes="(max-width: 768px) 64px, 96px"
                    />
                  ) : (
                    <LayoutGrid className={`w-6 h-6 md:w-8 md:h-8 ${isActive ? 'text-brand' : 'text-foreground/40 group-hover:text-brand'} transition-all`} />
                  )}
                </div>
                
                <span 
                  className={`text-xs md:text-sm font-bold transition-colors ${
                    isActive ? 'text-brand' : 'text-foreground/70 group-hover:text-brand'
                  }`}
                >
                  {f.label}
                </span>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
