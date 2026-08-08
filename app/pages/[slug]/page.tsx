import React from 'react'
import { notFound } from 'next/navigation'
import prisma from '@/lib/prisma'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'

export const dynamic = 'force-dynamic'

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const page = await prisma.legalPage.findUnique({
    where: { slug }
  })
  
  if (!page || !page.isActive) {
    return { title: 'الصفحة غير موجودة | TIF طيف' }
  }

  return { title: `${page.title} | TIF طيف` }
}

export default async function LegalPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const page = await prisma.legalPage.findUnique({
    where: { slug }
  })

  if (!page || !page.isActive) {
    notFound()
  }

  return (
    <main className="min-h-screen bg-ivory text-deep-green font-sans flex flex-col" dir="rtl">
      <Navbar />
      
      <div className="flex-grow pt-32 pb-24 px-6 max-w-4xl mx-auto w-full">
        <h1 className="text-4xl md:text-5xl font-black text-deep-green mb-12 border-b border-black/10 pb-8">
          {page.title}
        </h1>
        
        <div className="prose prose-lg prose-green max-w-none prose-headings:font-black prose-headings:text-deep-green prose-p:text-deep-green/80 prose-a:text-gold hover:prose-a:text-[#c9a756] whitespace-pre-wrap leading-relaxed">
          {page.content}
        </div>
      </div>

      <Footer />
    </main>
  )
}
