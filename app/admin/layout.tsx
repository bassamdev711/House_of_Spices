import Link from 'next/link'
import { LayoutDashboard, Package } from 'lucide-react'

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div dir="rtl" className="min-h-screen bg-gray-50 flex flex-col md:flex-row font-sans">
      {/* Sidebar */}
      <aside className="w-full md:w-64 bg-white border-l border-gray-200">
        <div className="p-6">
          <Link href="/admin">
            <h1 className="text-2xl font-bold text-gray-900 tracking-tight">YURI ADMIN</h1>
          </Link>
        </div>
        <nav className="px-4 pb-6 space-y-1">
          <Link 
            href="/admin" 
            className="flex items-center gap-3 px-3 py-2 text-sm font-medium text-gray-700 rounded-md hover:bg-gray-100"
          >
            <LayoutDashboard className="w-5 h-5 text-gray-500" />
            لوحة التحكم
          </Link>
          <Link 
            href="/admin/products" 
            className="flex items-center gap-3 px-3 py-2 text-sm font-medium text-gray-700 rounded-md hover:bg-gray-100"
          >
            <Package className="w-5 h-5 text-gray-500" />
            المنتجات
          </Link>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto">
        <div className="p-4 md:p-8">
          {children}
        </div>
      </main>
    </div>
  )
}
