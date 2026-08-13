import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import CheckoutClient from './CheckoutClient'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'إتمام الطلب | TIF طيف',
}

export default function CheckoutPage() {
  return (
    <main className="min-h-screen bg-surface text-foreground font-sans flex flex-col" dir="rtl">
      <Navbar />
      <CheckoutClient />
      <Footer />
    </main>
  )
}
