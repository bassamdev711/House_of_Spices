'use client'

import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

export default function SplashScreen() {
  const [showSplash, setShowSplash] = useState(false)
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    // التحقق مما إذا كان المستخدم قد رأى الشاشة في هذه الجلسة
    const hasSeenSplash = sessionStorage.getItem('tif_splash_seen')
    
    // إذا كنت تريد تجربة الشاشة في كل مرة، قم بإزالة السطرين التاليين:
    if (!hasSeenSplash) {
      setShowSplash(true)
      sessionStorage.setItem('tif_splash_seen', 'true')
      
      // تحريك العداد من 0 إلى 100 خلال 2.5 ثانية
      const duration = 2500;
      const startTime = performance.now();
      
      const updateProgress = (currentTime: number) => {
        const elapsed = currentTime - startTime;
        const currentProgress = Math.min(Math.floor((elapsed / duration) * 100), 100);
        setProgress(currentProgress);
        
        if (currentProgress < 100) {
          requestAnimationFrame(updateProgress);
        } else {
          // إخفاء الشاشة بعد وصول العداد إلى 100 بوقت قصير
          setTimeout(() => {
            setShowSplash(false);
          }, 800);
        }
      };
      
      requestAnimationFrame(updateProgress);
    }
  }, [])

  return (
    <AnimatePresence>
      {showSplash && (
        <motion.div
          key="splash-screen"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, y: "-100%" }}
          transition={{ duration: 0.8, ease: [0.76, 0, 0.24, 1] }}
          className="fixed inset-0 z-[99999] bg-brand flex flex-col items-center justify-center overflow-hidden"
          dir="rtl"
        >
          <div className="relative flex flex-col items-center justify-center">
             {/* الدائرة التي تحتوي على الاسم والعداد */}
             <motion.div 
               initial={{ scale: 0.8, opacity: 0 }}
               animate={{ scale: 1, opacity: 1 }}
               transition={{ duration: 0.8, ease: "easeOut" }}
               className="w-56 h-56 sm:w-64 sm:h-64 rounded-full border border-accent/20 flex flex-col items-center justify-center p-6 shadow-[inset_0_0_30px_rgba(178,204,162,0.05)] relative"
             >
                {/* رسم دائرة التحميل حول الإطار */}
                <svg className="absolute inset-0 w-full h-full -rotate-90" viewBox="0 0 100 100">
                  <circle 
                    cx="50" cy="50" r="48" 
                    fill="none" 
                    className="stroke-surface/10"
                    strokeWidth="1" 
                  />
                  <circle 
                    cx="50" cy="50" r="48" 
                    fill="none" 
                    className="stroke-accent"
                    strokeWidth="1.5"
                    strokeDasharray="301.59"
                    strokeDashoffset={301.59 - (301.59 * progress) / 100}
                    style={{ transition: 'stroke-dashoffset 0.1s linear' }}
                  />
                </svg>

                {/* النص الداخلي: اسم المتجر */}
                <span className="text-surface font-black text-3xl sm:text-4xl tracking-wide mb-6 text-center leading-tight">
                  بيت<br/>البهارات
                </span>
                
                {/* العداد الكلاسيكي */}
                <div className="absolute bottom-12 sm:bottom-14 flex items-baseline gap-1 text-accent font-mono">
                  <span className="text-3xl sm:text-4xl font-light tabular-nums tracking-tighter">
                    {progress}
                  </span>
                  <span className="text-sm font-bold opacity-60">%</span>
                </div>
             </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
