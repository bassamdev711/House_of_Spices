import Link from 'next/link'
import { LayoutDashboard, Package, Layers, CreditCard, ArrowRight, ShoppingCart, Truck, FileText } from 'lucide-react'
import LogoutButton from './components/LogoutButton'

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div dir="rtl" className="min-h-screen bg-ivory flex flex-col md:flex-row font-sans text-deep-green">
      {/* Sidebar */}
      <aside className="w-full md:w-64 bg-emerald border-l border-emerald shadow-2xl flex-shrink-0 text-ivory">
        <div className="p-6">
          <Link href="/admin">
            <h1 className="text-2xl font-black tracking-widest text-gold mb-1">TIF ADMIN</h1>
            <p className="text-[10px] text-ivory/50 uppercase tracking-[0.2em]">لوحة تحكم طيف</p>
          </Link>
        </div>
        <nav className="px-4 pb-6 space-y-2 mt-4">
          <Link 
            href="/admin" 
            className="flex items-center gap-3 px-4 py-3 text-sm font-bold text-ivory/80 rounded-sm hover:bg-white/10 hover:text-gold transition-colors"
          >
            <LayoutDashboard className="w-5 h-5" />
            نظرة عامة
          </Link>
          <Link 
            href="/admin/products" 
            className="flex items-center gap-3 px-4 py-3 text-sm font-bold text-ivory/80 rounded-sm hover:bg-white/10 hover:text-gold transition-colors"
          >
            <Package className="w-5 h-5" />
            إدارة المنتجات
          </Link>
          <Link 
            href="/admin/collections" 
            className="flex items-center gap-3 px-4 py-3 text-sm font-bold text-ivory/80 rounded-sm hover:bg-white/10 hover:text-gold transition-colors"
          >
            <Layers className="w-5 h-5" />
            المجموعات
          </Link>
          <Link 
            href="/admin/payment-settings" 
            className="flex items-center gap-3 px-4 py-3 text-sm font-bold text-ivory/80 rounded-sm hover:bg-white/10 hover:text-gold transition-colors"
          >
            <CreditCard className="w-5 h-5" />
            إعدادات الدفع
          </Link>
          <Link 
            href="/admin/orders" 
            className="flex items-center gap-3 px-4 py-3 text-sm font-bold text-ivory/80 rounded-sm hover:bg-white/10 hover:text-gold transition-colors"
          >
            <ShoppingCart className="w-5 h-5" />
            الطلبات
          </Link>
          <Link 
            href="/admin/shipping-settings" 
            className="flex items-center gap-3 px-4 py-3 text-sm font-bold text-ivory/80 rounded-sm hover:bg-white/10 hover:text-gold transition-colors"
          >
            <Truck className="w-5 h-5" />
            إعدادات الشحن
          </Link>
          <Link 
            href="/admin/legal-pages" 
            className="flex items-center gap-3 px-4 py-3 text-sm font-bold text-ivory/80 rounded-sm hover:bg-white/10 hover:text-gold transition-colors"
          >
            <FileText className="w-5 h-5" />
            الصفحات القانونية
          </Link>
          <div className="pt-8 mt-8 border-t border-white/10 px-4">
            <Link 
              href="/" 
              className="flex items-center gap-2 text-xs font-medium text-ivory/40 hover:text-white transition-colors"
            >
              <ArrowRight className="w-4 h-4" />
              العودة للمتجر
            </Link>
            <LogoutButton />
          </div>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto">
        <div className="p-4 md:p-10 max-w-6xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  )
}
