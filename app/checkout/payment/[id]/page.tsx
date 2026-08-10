import PaymentClient from './PaymentClient'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'

export const metadata = {
  title: 'إثبات الدفع | متجر طيف',
}

export default async function PaymentProofPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  
  return (
    <main className="min-h-screen bg-ivory text-deep-green font-sans flex flex-col" dir="rtl">
      <Navbar />
      <PaymentClient id={id} />
      <Footer />
    </main>
  )
}
