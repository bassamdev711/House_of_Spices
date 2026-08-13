'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { LayoutDashboard, Package, Layers, CreditCard, ArrowRight, ShoppingCart, Truck, FileText, Megaphone, Search, Menu, X, Phone, Inbox, MessageSquare, Activity, Palette, Settings, User } from 'lucide-react'
import LogoutButton from './LogoutButton'

export default function AdminSidebar() {
  const [isOpen, setIsOpen] = useState(false)
  const [topOffset, setTopOffset] = useState(0)
  const pathname = usePathname()

  const closeSidebar = () => setIsOpen(false)

  useEffect(() => {
    const checkOffset = () => {
      const bar = document.getElementById("announcement-bar");
      setTopOffset(bar ? bar.offsetHeight : 0);
    };
    checkOffset();
    window.addEventListener("resize", checkOffset);
    const timeout = setTimeout(checkOffset, 100);
    return () => {
      window.removeEventListener("resize", checkOffset);
      clearTimeout(timeout);
    };
  }, []);

  const navLinks = [
    { href: '/admin', icon: LayoutDashboard, label: 'نظرة عامة', exact: true },
    { href: '/admin/analytics', icon: Activity, label: 'الإحصائيات' },
    { href: '/admin/products', icon: Package, label: 'إدارة المنتجات' },
    { href: '/admin/collections', icon: Layers, label: 'المجموعات' },
    { href: '/admin/orders', icon: ShoppingCart, label: 'الطلبات' },
    { href: '/admin/payment-settings', icon: CreditCard, label: 'إعدادات الدفع' },
    { href: '/admin/shipping-settings', icon: Truck, label: 'إعدادات الشحن' },
    { href: '/admin/contact-settings', icon: Phone, label: 'إعدادات التواصل' },
    { href: '/admin/inbox', icon: Inbox, label: 'صندوق الوارد' },
    { href: '/admin/reviews', icon: MessageSquare, label: 'المراجعات' },
    { href: '/admin/legal-pages', icon: FileText, label: 'الصفحات القانونية' },
    { href: '/admin/marketing', icon: Megaphone, label: 'التسويق' },
    { href: '/admin/store-visibility', icon: Search, label: 'تحسين ظهور المتجر' },
    { href: '/admin/homepage-content', icon: LayoutDashboard, label: 'محتوى الرئيسية' },
    { href: '/admin/branding', icon: Palette, label: 'الهوية البصرية' },
    { href: '/admin/setup', icon: Settings, label: 'إعدادات المتجر' },
    { href: '/admin/profile', icon: User, label: 'الملف الشخصي' },
  ]

  return (
    <>
      {/* Mobile Header (Hamburger Menu) */}
      <div 
        className="md:hidden bg-emerald border-b border-emerald/80 flex items-center justify-between p-4 text-ivory w-full sticky z-40 transition-all duration-300"
        style={{ top: topOffset }}
      >
        <div className="flex items-center gap-3">
          <button onClick={() => setIsOpen(!isOpen)} className="text-white focus:outline-none">
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
          <div>
            <h1 className="text-lg font-black tracking-widest text-gold leading-none">TIF ADMIN</h1>
          </div>
        </div>
      </div>

      {/* Sidebar Overlay (Mobile) */}
      {isOpen && (
        <div 
          className="md:hidden fixed inset-0 bg-black/50 z-40"
          onClick={closeSidebar}
        />
      )}

      {/* Sidebar Content */}
      <aside className={`
        fixed md:static inset-y-0 right-0 z-50 
        w-64 bg-emerald border-l border-emerald shadow-2xl flex-shrink-0 text-ivory
        transform transition-transform duration-300 ease-in-out h-full overflow-y-auto
        ${isOpen ? 'translate-x-0' : 'translate-x-full md:translate-x-0'}
      `}>
        <div className="p-6 hidden md:block">
          <Link href="/admin">
            <h1 className="text-2xl font-black tracking-widest text-gold mb-1">TIF ADMIN</h1>
            <p className="text-[10px] text-ivory/50 uppercase tracking-[0.2em]">لوحة تحكم طيف</p>
          </Link>
        </div>
        <nav className="px-4 pb-6 space-y-2 mt-4">
          {navLinks.map((link) => {
            const Icon = link.icon;
            const isActive = link.exact ? pathname === link.href : pathname.startsWith(link.href);
            
            return (
              <Link 
                key={link.href}
                href={link.href}
                onClick={closeSidebar}
                className={`flex items-center gap-3 px-4 py-3 text-sm font-bold rounded-sm transition-colors ${
                  isActive 
                  ? 'bg-white/10 text-gold' 
                  : 'text-ivory/80 hover:bg-white/10 hover:text-gold'
                }`}
              >
                <Icon className="w-5 h-5" />
                {link.label}
              </Link>
            )
          })}

          <div className="pt-8 mt-8 border-t border-white/10 px-4">
            <Link 
              href="/" 
              className="flex items-center gap-2 text-xs font-medium text-ivory/40 hover:text-white transition-colors mb-4"
            >
              <ArrowRight className="w-4 h-4" />
              العودة للمتجر
            </Link>
            <LogoutButton />
          </div>
        </nav>
      </aside>
    </>
  )
}
