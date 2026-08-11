import Link from 'next/link';
import { Search } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center p-6 text-center bg-ivory">
      <div className="max-w-md w-full flex flex-col items-center">
        <h1 className="text-8xl font-black text-emerald/10 mb-4 select-none">404</h1>
        
        <h2 className="text-3xl font-bold text-emerald mb-4">
          الصفحة غير موجودة
        </h2>
        
        <p className="text-deep-green/70 mb-8 text-lg">
          عذراً، يبدو أن الصفحة أو المنتج الذي تبحث عنه غير موجود أو تم نقله. 
        </p>
        
        <div className="w-full flex flex-col sm:flex-row gap-4">
          <Link
            href="/"
            className="flex-1 flex items-center justify-center bg-emerald text-ivory py-4 px-6 rounded-xl font-bold hover:bg-emerald/90 transition-all hover-glow shadow-md"
          >
            العودة للرئيسية
          </Link>
          
          <Link
            href="/search"
            className="flex-1 flex items-center justify-center gap-2 bg-transparent text-emerald border-2 border-emerald py-4 px-6 rounded-xl font-bold hover:bg-emerald/5 transition-colors"
          >
            <Search className="w-5 h-5" />
            البحث في المتجر
          </Link>
        </div>
      </div>
    </div>
  );
}
