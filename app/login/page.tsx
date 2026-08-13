'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { login } from './actions'
import { Lock, ArrowRight, ShieldCheck } from 'lucide-react'
import Link from 'next/link'

export default function LoginPage() {
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    const res = await login(password)
    
    if (res.success) {
      router.push('/admin')
    } else {
      setError(res.error || 'حدث خطأ غير متوقع')
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-surface flex flex-col justify-center items-center p-4 font-sans text-foreground" dir="rtl">
      
      <Link href="/" className="absolute top-8 right-8 text-foreground/50 hover:text-accent flex items-center gap-2 transition-colors">
        <ArrowRight size={20} />
        العودة للمتجر
      </Link>

      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl border border-accent/20 p-8">
        
        <div className="flex justify-center mb-6">
          <div className="w-16 h-16 bg-brand/10 rounded-full flex items-center justify-center border border-brand/20">
            <ShieldCheck className="w-8 h-8 text-brand" />
          </div>
        </div>

        <h1 className="text-3xl font-black text-center text-foreground mb-2">طيف</h1>
        <p className="text-center text-foreground/60 font-medium mb-8">
          تسجيل الدخول للوحة التحكم
        </p>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-bold text-foreground mb-2">
              كلمة المرور الإدارية
            </label>
            <div className="relative">
              <Lock className="absolute right-4 top-1/2 -translate-y-1/2 text-foreground/40 w-5 h-5" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-4 pr-12 py-3 bg-surface/50 border border-foreground/10 rounded-xl focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent text-foreground transition-all"
                placeholder="أدخل كلمة المرور..."
                required
              />
            </div>
          </div>

          {error && (
            <div className="p-4 bg-red-50 text-red-700 text-sm font-bold rounded-lg border border-red-100 text-center">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-accent text-foreground font-bold text-lg py-3 rounded-none border border-black hover:bg-accent hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed disabled:hover:translate-y-0 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:shadow-none active:translate-y-1"
          >
            {loading ? 'جاري التحقق...' : 'دخول للوحة التحكم'}
          </button>
        </form>

      </div>
      
      <p className="mt-8 text-sm text-foreground/40 font-medium">
        هذه الصفحة مخصصة لمدير المتجر فقط.
      </p>
    </div>
  )
}
