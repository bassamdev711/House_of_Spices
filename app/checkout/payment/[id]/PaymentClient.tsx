'use client'

import React, { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { compressImageClientSide } from '@/lib/compress'
import { UploadCloud, Copy, ArrowRight } from 'lucide-react'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import { updateOrderPaymentProof, getPaymentMethods } from '../../actions'
import { useToast } from '@/components/ToastProvider'

export default function PaymentClient({ id }: { id: string }) {
  const router = useRouter()
  const { showToast } = useToast()
  const [file, setFile] = useState<File | null>(null)
  const [transactionId, setTransactionId] = useState('')
  const [isUploading, setIsUploading] = useState(false)
  const [error, setError] = useState('')
  const fileInputRef = useRef<HTMLInputElement>(null)
  
  const [mounted, setMounted] = useState(false)
  const [paymentData, setPaymentData] = useState<any>(null)

  useEffect(() => {
    setMounted(true)
    const fetchMethods = async () => {
      try {
        const data = await getPaymentMethods()
        setPaymentData(data)
      } catch (err) {
        console.error('Failed to fetch payment methods', err)
        setError('فشل في تحميل حسابات الدفع، يرجى تحديث الصفحة.')
        setPaymentData({ bankAccounts: [], digitalWallets: [] })
      }
    }
    fetchMethods()
  }, [])

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text)
    showToast('success', 'تم النسخ بنجاح')
  }

  if (!mounted || !paymentData) return null

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0])
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!file) {
      setError('الرجاء إرفاق صورة إشعار التحويل')
      return
    }

    setIsUploading(true)
    setError('')

    try {
      // ضغط الصورة قبل الرفع
      const compressedFile = await compressImageClientSide(file)

      // 1. Upload to Vercel Blob
      const formData = new FormData()
      formData.append('file', compressedFile)
      formData.append('orderId', id)

      const uploadRes = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      })

      if (!uploadRes.ok) {
        const errorData = await uploadRes.json()
        throw new Error(errorData.error || 'فشل رفع الصورة')
      }

      const { url } = await uploadRes.json()

      // 2. Update Order
      const updateRes = await updateOrderPaymentProof(id, url, transactionId)
      
      if (updateRes.success) {
        router.push(`/checkout/success/${id}`)
      } else {
        throw new Error(updateRes.error)
      }
    } catch (err: any) {
      setError(err.message || 'حدث خطأ غير متوقع')
      setIsUploading(false)
    }
  }

  return (
    <main className="min-h-screen bg-ivory text-deep-green font-sans flex flex-col" dir="rtl">
      <Navbar />

      <div className="flex-grow pt-32 pb-24 px-6 max-w-7xl mx-auto w-full flex justify-center items-start">
        <div className="w-full max-w-[640px] bg-white shadow-sm p-8 md:p-12 border border-black/5">
          
          <header className="mb-12 text-center">
            <h1 className="text-3xl font-black text-deep-green mb-4">إثبات الدفع</h1>
            <p className="text-deep-green/70">الرجاء تحويل المبلغ إلى الحساب التالي وإرفاق صورة إشعار التحويل.</p>
          </header>

          {/* Bank/Wallet Details */}
          <div className="bg-[#F9F7F2] border border-black/5 p-6 mb-10 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-1 h-full bg-emerald"></div>
            <h3 className="text-sm font-bold text-emerald mb-6 uppercase tracking-wider">الحسابات المتوفرة للتحويل</h3>
            
            <div className="space-y-6">
              {paymentData.bankAccounts.map((bank: any) => (
                <div key={bank.id} className="border-b border-black/5 pb-4 last:border-0 last:pb-0">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-deep-green/70">اسم الحساب</span>
                    <span className="font-bold">{bank.accountName}</span>
                  </div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-deep-green/70">البنك</span>
                    <span className="font-bold">{bank.bankName}</span>
                  </div>
                  <div className="flex justify-between items-center flex-wrap gap-4">
                    <span className="text-deep-green/70">رقم الحساب / IBAN</span>
                    <div className="flex items-center gap-2">
                      <span className="font-bold tracking-widest text-sm" dir="ltr">{bank.accountNumber}</span>
                      <button onClick={() => handleCopy(bank.accountNumber)} className="text-deep-green/40 hover:text-emerald transition-colors" title="نسخ">
                        <Copy size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
              
              {paymentData.digitalWallets.map((wallet: any) => (
                <div key={wallet.id} className="border-b border-black/5 pb-4 last:border-0 last:pb-0">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-deep-green/70">المحفظة</span>
                    <span className="font-bold">{wallet.walletName}</span>
                  </div>
                  <div className="flex justify-between items-center flex-wrap gap-4">
                    <span className="text-deep-green/70">رقم الجوال / الحساب</span>
                    <div className="flex items-center gap-2">
                      <span className="font-bold tracking-widest text-sm" dir="ltr">{wallet.accountNumber}</span>
                      <button onClick={() => handleCopy(wallet.accountNumber)} className="text-deep-green/40 hover:text-emerald transition-colors" title="نسخ">
                        <Copy size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
              
              {(paymentData.bankAccounts.length === 0 && paymentData.digitalWallets.length === 0) && (
                <p className="text-center text-red-500 font-bold">لا يوجد حسابات متوفرة للتحويل حالياً.</p>
              )}
            </div>
          </div>

          {error && (
            <div className="bg-red-50 text-red-600 p-4 rounded-md mb-8 border border-red-200 font-bold">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Upload Area */}
            <div>
              <label className="block text-sm font-bold text-deep-green mb-4">صورة إشعار التحويل</label>
              <div 
                onClick={() => fileInputRef.current?.click()}
                className={`border-2 border-dashed ${file ? 'border-emerald bg-emerald/5' : 'border-black/20 hover:border-emerald bg-[#F9F7F2]'} p-10 flex flex-col items-center justify-center cursor-pointer transition-all duration-300 group`}
              >
                <UploadCloud className={`w-12 h-12 mb-4 transition-colors ${file ? 'text-emerald' : 'text-deep-green/40 group-hover:text-emerald'}`} />
                <p className="text-deep-green text-center mb-2">
                  {file ? <span className="font-bold text-emerald">{file.name}</span> : <span>اسحب وأفلت الصورة هنا، أو <span className="text-emerald font-bold">استعرض</span></span>}
                </p>
                <p className="text-xs text-deep-green/50">JPG, PNG، أقصى حجم 5MB</p>
                <input 
                  type="file" 
                  accept="image/jpeg, image/png, image/webp" 
                  className="hidden" 
                  ref={fileInputRef}
                  onChange={handleFileChange}
                />
              </div>
            </div>

            {/* Transaction ID */}
            <div className="flex flex-col">
              <label className="text-sm font-bold text-deep-green mb-2">رقم العملية (اختياري)</label>
              <input 
                type="text" 
                value={transactionId}
                onChange={(e) => setTransactionId(e.target.value)}
                placeholder="أدخل رقم العملية المرجعي"
                className="bg-transparent border-b border-black/20 pb-3 outline-none focus:border-emerald transition-colors"
              />
            </div>

            {/* Submit */}
            <button 
              type="submit"
              disabled={isUploading}
              className="w-full bg-gold text-deep-green border border-black font-bold py-5 flex justify-center items-center gap-3 hover:bg-[#c9a756] transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed rounded-none"
            >
              <span>{isUploading ? 'جاري الإرسال...' : 'إرسال الإثبات'}</span>
              {!isUploading && <ArrowRight size={18} />}
            </button>
          </form>

        </div>
      </div>

      <Footer />
    </main>
  )
}
