'use client'

import React, { useState } from 'react'
import { Star, Send, MessageSquare } from 'lucide-react'
import { addReview } from '@/app/actions/reviews'
import { useToast } from '@/components/ToastProvider'

export default function ReviewForm({ productId }: { productId?: string }) {
  const [name, setName] = useState('')
  const [city, setCity] = useState('')
  const [content, setContent] = useState('')
  const [rating, setRating] = useState(5)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  
  const { showToast } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!name.trim() || !content.trim()) {
      showToast('error', 'الرجاء إدخال الاسم ونص المراجعة')
      return
    }

    setIsSubmitting(true)
    
    const res = await addReview({
      name,
      city,
      content,
      rating,
      productId
    })

    if (res.success) {
      setSubmitted(true)
      showToast('success', 'شكراً لك! تم استلام مراجعتك وسيتم نشرها قريباً.')
      setName('')
      setCity('')
      setContent('')
      setRating(5)
    } else {
      showToast('error', res.error || 'حدث خطأ غير متوقع')
    }
    
    setIsSubmitting(false)
  }

  if (submitted) {
    return (
      <div className="bg-emerald/5 p-8 rounded-xl border border-emerald/20 text-center max-w-2xl mx-auto my-12">
        <MessageSquare className="w-12 h-12 text-emerald mx-auto mb-4 opacity-80" />
        <h3 className="text-2xl font-black text-deep-green mb-2">شكراً لمشاركتنا رأيك!</h3>
        <p className="text-deep-green/70">لقد استلمنا مراجعتك بنجاح. نقدر وقتك وثقتك بنا.</p>
        <button 
          onClick={() => setSubmitted(false)}
          className="mt-6 text-emerald font-bold hover:underline"
        >
          كتابة مراجعة أخرى
        </button>
      </div>
    )
  }

  return (
    <div className="bg-white p-6 md:p-8 rounded-xl border border-black/5 shadow-sm max-w-2xl mx-auto my-12 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-1 h-full bg-emerald"></div>
      
      <h3 className="text-2xl font-black text-deep-green mb-2">شاركنا رأيك</h3>
      <p className="text-deep-green/60 mb-8">يهمنا معرفة تجربتك {productId ? 'مع هذا العطر' : 'مع متجر طيف'}.</p>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Rating */}
        <div>
          <label className="block text-sm font-bold text-deep-green mb-3">التقييم</label>
          <div className="flex gap-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => setRating(star)}
                className="focus:outline-none transition-transform hover:scale-110"
              >
                <Star 
                  size={28} 
                  fill={star <= rating ? "#d4af37" : "none"} 
                  stroke={star <= rating ? "#d4af37" : "#d1d5db"} 
                  strokeWidth={1.5} 
                />
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-bold text-deep-green mb-2">الاسم</label>
            <input 
              type="text" 
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              placeholder="اسمك الكريم"
              className="w-full bg-[#F9F7F2] border-none rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-emerald/20 transition-all"
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-deep-green mb-2">المدينة <span className="text-xs text-deep-green/40">(اختياري)</span></label>
            <input 
              type="text" 
              value={city}
              onChange={(e) => setCity(e.target.value)}
              placeholder="مدينتك"
              className="w-full bg-[#F9F7F2] border-none rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-emerald/20 transition-all"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-bold text-deep-green mb-2">المراجعة</label>
          <textarea 
            value={content}
            onChange={(e) => setContent(e.target.value)}
            required
            placeholder="اكتب مراجعتك هنا..."
            rows={4}
            className="w-full bg-[#F9F7F2] border-none rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-emerald/20 transition-all resize-none"
          ></textarea>
        </div>

        <button 
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-deep-green text-ivory font-bold py-4 rounded-lg hover:bg-emerald transition-colors disabled:opacity-70 flex items-center justify-center gap-2"
        >
          {isSubmitting ? 'جاري الإرسال...' : (
            <>
              إرسال المراجعة
              <Send size={18} />
            </>
          )}
        </button>
      </form>
    </div>
  )
}
