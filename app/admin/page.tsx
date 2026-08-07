import Link from 'next/link'
import { Package } from 'lucide-react'
import prisma from '@/lib/prisma'

export const dynamic = 'force-dynamic'

export default async function AdminDashboard() {
  let productsCount = 0
  
  try {
    productsCount = await prisma.product.count()
  } catch (error) {
    console.error("Database connection error:", error)
  }

  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold text-gray-900">مرحباً بك في لوحة تحكم YURI</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Card */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-500 mb-1">إجمالي المنتجات</p>
            <p className="text-3xl font-semibold text-gray-900">{productsCount}</p>
          </div>
          <div className="p-4 bg-primary/10 rounded-full text-primary">
            <Package className="w-8 h-8" />
          </div>
        </div>
      </div>
      
      <div className="pt-6">
        <Link 
          href="/admin/products"
          className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-black hover:bg-gray-800"
        >
          إدارة المنتجات
        </Link>
      </div>
    </div>
  )
}
