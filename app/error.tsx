'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { RefreshCw, AlertCircle } from 'lucide-react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center p-6 text-center bg-ivory">
      <div className="bg-white p-10 rounded-2xl max-w-lg w-full shadow-lg border border-gold/20 relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-emerald via-gold to-emerald"></div>
        
        <div className="w-20 h-20 bg-emerald/5 rounded-full flex items-center justify-center mx-auto mb-6 border border-emerald/10">
          <AlertCircle className="w-10 h-10 text-emerald" />
        </div>
        
        <h2 className="text-3xl font-black text-emerald mb-4 tracking-tight">
          عذراً، ضغط شديد حالياً
        </h2>
        
        <p className="text-deep-green/70 mb-8 leading-relaxed text-lg">
          نواجه حالياً إقبالاً كبيراً على المتجر أو نقوم بصيانة لحظية لتقديم تجربة أفضل. نعتذر عن هذا الإزعاج المؤقت.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={() => reset()}
            className="flex-1 flex items-center justify-center gap-2 bg-emerald text-ivory py-4 px-6 rounded-xl font-bold hover:bg-emerald/90 transition-all hover-glow shadow-md"
          >
            <RefreshCw className="w-5 h-5" />
            تحديث الصفحة
          </button>
          
          <Link
            href="/"
            className="flex-1 flex items-center justify-center bg-transparent text-emerald border-2 border-emerald py-4 px-6 rounded-xl font-bold hover:bg-emerald/5 transition-colors"
          >
            العودة للرئيسية
          </Link>
        </div>
      </div>
    </div>
  );
}
