import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import CartClient from './CartClient'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'السلة | TIF طيف',
}

export default function CartPage() {
  return (
    <main className="min-h-screen bg-surface text-foreground font-sans flex flex-col" dir="rtl">
      <Navbar />
      <CartClient />
      <Footer />
    </main>
  )
}
