import React from 'react'
import Link from 'next/link'
import { CheckCircle2 } from 'lucide-react'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import prisma from '@/lib/prisma'
import { notFound } from 'next/navigation'

export default async function SuccessPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  
  const order = await prisma.order.findUnique({
    where: { id }
  })

  if (!order) {
    notFound()
  }
  return (
    <main className="min-h-screen bg-surface text-foreground font-sans flex flex-col" dir="rtl">
      <Navbar />

      <div className="flex-grow pt-40 pb-24 px-6 max-w-7xl mx-auto w-full flex justify-center items-start">
        <div className="w-full max-w-[640px] bg-white shadow-sm p-12 text-center border border-black/5">
          <CheckCircle2 className="w-20 h-20 text-brand mx-auto mb-6" />
          <h1 className="text-4xl font-black text-foreground mb-4">تم استلام طلبك بنجاح!</h1>
          
          <div className="bg-surface-alt p-6 mb-8 mt-6">
            <p className="text-lg mb-2">رقم الطلب الخاص بك هو:</p>
            <p className="font-bold text-xl text-brand tracking-widest">{order.orderNumber || order.id}</p>
          </div>

          <p className="text-foreground/70 mb-10 leading-relaxed text-lg">
            سنقوم بمراجعة طلبك وتجهيزه بأسرع وقت ممكن. يمكنك تتبع حالة طلبك في أي وقت من خلال صفحة تتبع الطلبات. شكراً لتسوقك من طيف!
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              href="/track"
              className="inline-flex bg-foreground text-surface border border-foreground font-bold px-8 py-4 hover:bg-brand transition-colors duration-300 gap-3 rounded-none justify-center"
            >
              تتبع طلبك الآن
            </Link>
            
            <Link 
              href="/"
              className="inline-flex bg-accent text-foreground border border-black font-bold px-8 py-4 hover:bg-accent transition-colors duration-300 gap-3 rounded-none justify-center"
            >
              العودة للرئيسية
            </Link>
          </div>
        </div>
      </div>

      <Footer />
    </main>
  )
}
