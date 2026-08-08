'use client'

import React, { use } from 'react'
import Link from 'next/link'
import { CheckCircle2, ArrowRight } from 'lucide-react'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'

export default function SuccessPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  return (
    <main className="min-h-screen bg-ivory text-deep-green font-sans flex flex-col" dir="rtl">
      <Navbar />

      <div className="flex-grow pt-40 pb-24 px-6 max-w-7xl mx-auto w-full flex justify-center items-start">
        <div className="w-full max-w-[640px] bg-white shadow-sm p-12 text-center border border-black/5">
          <CheckCircle2 className="w-20 h-20 text-emerald mx-auto mb-6" />
          <h1 className="text-4xl font-black text-deep-green mb-4">تم استلام طلبك بنجاح!</h1>
          
          <div className="bg-[#F9F7F2] p-6 mb-8 mt-6">
            <p className="text-lg mb-2">رقم الطلب الخاص بك هو:</p>
            <p className="font-bold text-xl text-emerald tracking-widest">{id}</p>
          </div>

          <p className="text-deep-green/70 mb-10 leading-relaxed text-lg">
            سنقوم بمراجعة طلبك وتجهيزه بأسرع وقت ممكن. سيتم إرسال تفاصيل التتبع إلى رقم هاتفك المحمول قريباً. شكراً لتسوقك من طيف!
          </p>

          <Link 
            href="/"
            className="inline-flex bg-gold text-deep-green border border-black font-bold px-10 py-4 hover:bg-[#c9a756] transition-colors duration-300 gap-3 rounded-none"
          >
            العودة للصفحة الرئيسية
          </Link>
        </div>
      </div>

      <Footer />
    </main>
  )
}
