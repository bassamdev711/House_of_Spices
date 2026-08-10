import React from 'react'
import { Metadata } from 'next'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import TrackOrderClient from './TrackOrderClient'

export const metadata: Metadata = {
  title: 'تتبع الطلب | TIF طيف',
  description: 'تتبع حالة طلبك ومسار الشحن بكل سهولة',
}

export default function TrackOrderPage() {
  return (
    <main className="min-h-screen bg-ivory text-deep-green font-sans flex flex-col" dir="rtl">
      <Navbar />
      <TrackOrderClient />
      <Footer />
    </main>
  )
}
