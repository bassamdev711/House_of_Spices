'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { Filter, X, Check, SlidersHorizontal } from 'lucide-react'

interface FilterItem {
  label: string
  slug: string | null  // null = الكل
}

interface Props {
  filters: FilterItem[]
}

export default function FilterDrawer({ filters }: Props) {
  const [isOpen, setIsOpen] = useState(false)
  const searchParams = useSearchParams()
  const currentCollection = searchParams.get('collection')
  const overlayRef = useRef<HTMLDivElement>(null)

  // منع التمرير خلف الـ Drawer
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => { document.body.style.overflow = '' }
  }, [isOpen])

  // إغلاق بالـ Escape
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsOpen(false)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  // الـ Filter المفعّل حالياً
  const activeLabel = filters.find(
    (f) => f.slug === currentCollection
  )?.label ?? 'الكل'

  const activeCount = currentCollection ? 1 : 0

  return (
    <>
      {/* ───── زر التصفية العائم (موبايل فقط) ───── */}
      <div className="md:hidden fixed bottom-20 left-0 right-0 flex justify-center z-40 pointer-events-none">
        <button
          onClick={() => setIsOpen(true)}
          className="pointer-events-auto relative bg-foreground text-surface text-sm font-bold py-3.5 px-8 flex items-center justify-center gap-2 rounded-none shadow-[0_4px_24px_rgba(32,37,34,0.35)] active:scale-95 transition-transform"
          aria-label="فتح قائمة التصفية"
        >
          <SlidersHorizontal size={17} strokeWidth={2.5} />
          <span>تصفية النتائج</span>
          {/* Badge لعدد الفلاتر المفعّلة */}
          {activeCount > 0 && (
            <span className="absolute -top-2 -right-2 w-5 h-5 bg-brand text-white text-[10px] font-bold rounded-full flex items-center justify-center">
              {activeCount}
            </span>
          )}
        </button>
      </div>

      {/* ───── Overlay خلف الـ Drawer ───── */}
      {isOpen && (
        <div
          ref={overlayRef}
          className="md:hidden fixed inset-0 z-[95] bg-black/50 backdrop-blur-[2px]"
          onClick={() => setIsOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* ───── Drawer من الأسفل ───── */}
      <div
        role="dialog"
        aria-modal="true"
        aria-label="تصفية المنتجات"
        dir="rtl"
        className={`md:hidden fixed bottom-0 left-0 right-0 z-[96] bg-surface rounded-t-2xl shadow-[0_-8px_40px_rgba(0,0,0,0.18)] transition-transform duration-350 ease-[cubic-bezier(0.32,0.72,0,1)] ${
          isOpen ? 'translate-y-0' : 'translate-y-full'
        }`}
      >
        {/* ── شريط السحب (drag indicator) ── */}
        <div className="flex justify-center pt-3 pb-1">
          <div className="w-10 h-1 bg-foreground/20 rounded-full" />
        </div>

        {/* ── Header ── */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-black/8">
          <div className="flex items-center gap-2">
            <Filter size={18} className="text-brand" />
            <h2 className="text-base font-black text-foreground">تصفية المنتجات</h2>
          </div>
          <div className="flex items-center gap-3">
            {currentCollection && (
              <Link
                href="/products"
                onClick={() => setIsOpen(false)}
                className="text-xs font-bold text-brand/80 hover:text-brand underline underline-offset-2"
              >
                مسح الكل
              </Link>
            )}
            <button
              onClick={() => setIsOpen(false)}
              className="w-8 h-8 flex items-center justify-center rounded-full bg-foreground/8 hover:bg-foreground/12 transition-colors"
              aria-label="إغلاق"
            >
              <X size={16} strokeWidth={2.5} />
            </button>
          </div>
        </div>

        {/* ── قسم التصنيفات ── */}
        <div className="px-5 pt-5 pb-3">
          <p className="text-[11px] font-bold text-foreground/40 uppercase tracking-widest mb-3">
            التصنيف
          </p>
          <div className="grid grid-cols-2 gap-2">
            {filters.map((f) => {
              const isActive = f.slug === null
                ? !currentCollection
                : currentCollection === f.slug

              const href = f.slug ? `/products?collection=${f.slug}` : '/products'

              return (
                <Link
                  key={href}
                  href={href}
                  onClick={() => setIsOpen(false)}
                  className={`relative flex items-center justify-between px-4 py-3.5 border text-sm font-bold transition-all duration-200 rounded-none ${
                    isActive
                      ? 'bg-brand text-surface border-brand'
                      : 'bg-transparent text-foreground border-foreground/15 active:bg-foreground/5'
                  }`}
                >
                  <span className="truncate">{f.label}</span>
                  {isActive && (
                    <Check size={14} strokeWidth={3} className="shrink-0 mr-2" />
                  )}
                </Link>
              )
            })}
          </div>
        </div>

        {/* ── نتيجة الفلتر الحالي ── */}
        {activeLabel && (
          <div className="px-5 pb-2">
            <p className="text-xs text-foreground/40 font-medium">
              يعرض حالياً: <span className="text-brand font-bold">{activeLabel}</span>
            </p>
          </div>
        )}

        {/* ── زر الإغلاق السفلي ── */}
        <div className="px-5 py-4 pb-[calc(1rem+env(safe-area-inset-bottom))]">
          <button
            onClick={() => setIsOpen(false)}
            className="w-full bg-foreground text-surface font-bold py-4 text-sm rounded-none active:scale-[0.98] transition-transform"
          >
            عرض النتائج
          </button>
        </div>
      </div>
    </>
  )
}
