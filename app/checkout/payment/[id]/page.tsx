import PaymentClient from './PaymentClient'

export const metadata = {
  title: 'إثبات الدفع | متجر طيف',
}

export default async function PaymentProofPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  
  return <PaymentClient id={id} />
}
