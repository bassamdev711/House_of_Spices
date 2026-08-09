import Link from 'next/link'
import { Package, ShoppingCart, TrendingUp, AlertTriangle, ArrowLeft, Clock, CheckCircle } from 'lucide-react'
import prisma from '@/lib/prisma'

export const dynamic = 'force-dynamic'

export default async function AdminDashboard() {
  let productsCount = 0;
  let totalOrders = 0;
  let newOrdersCount = 0;
  let totalRevenue = 0;
  let recentOrders: any[] = [];
  let lowStockProducts: any[] = [];
  
  try {
    // 1. Fetch KPI Counts
    productsCount = await prisma.product.count({ where: { isActive: true } });
    totalOrders = await prisma.order.count();
    newOrdersCount = await prisma.order.count({ where: { status: 'NEW' } });
    
    // 2. Fetch Total Revenue (excluding cancelled orders)
    const revenueResult = await prisma.order.aggregate({
      where: {
        status: { not: 'CANCELLED' }
      },
      _sum: {
        totalAmount: true
      }
    });
    totalRevenue = Number(revenueResult._sum.totalAmount || 0);

    // 3. Fetch Recent Orders (last 5)
    recentOrders = await prisma.order.findMany({
      orderBy: { createdAt: 'desc' },
      take: 5,
      select: {
        id: true,
        orderNumber: true,
        customerName: true,
        totalAmount: true,
        status: true,
        createdAt: true,
      }
    });

    // 4. Fetch Low Stock Products (< 5)
    lowStockProducts = await prisma.product.findMany({
      where: { stock: { lt: 5 }, isActive: true },
      orderBy: { stock: 'asc' },
      take: 5,
      select: {
        id: true,
        name: true,
        stock: true,
        slug: true,
        imageUrl: true,
      }
    });

  } catch (error) {
    console.error("Database connection error:", error)
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('ar-YE', { style: 'currency', currency: 'YER' }).format(amount);
  }

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'NEW': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'PROCESSING': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'SHIPPED': return 'bg-indigo-100 text-indigo-800 border-indigo-200';
      case 'COMPLETED': return 'bg-green-100 text-green-800 border-green-200';
      case 'CANCELLED': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  }

  const getStatusLabel = (status: string) => {
    switch(status) {
      case 'NEW': return 'جديد';
      case 'PROCESSING': return 'قيد المعالجة';
      case 'SHIPPED': return 'تم الشحن';
      case 'COMPLETED': return 'مكتمل';
      case 'CANCELLED': return 'ملغى';
      default: return status;
    }
  }

  return (
    <div className="space-y-8 pb-10" dir="rtl">
      <div>
        <h2 className="text-2xl md:text-3xl font-bold text-gray-900">نظرة عامة على المتجر</h2>
        <p className="text-gray-500 mt-1">ملخص سريع لأداء متجرك وحالة الطلبات.</p>
      </div>
      
      {/* KPI Cards: Responsive Grid (1 col on mobile, 2 on tablet, 4 on desktop) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        
        {/* Revenue Card */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex flex-col justify-between">
          <div className="flex justify-between items-start mb-4">
            <div>
              <p className="text-sm font-medium text-gray-500 mb-1">إجمالي الإيرادات</p>
              <h3 className="text-2xl font-bold text-gray-900">{formatCurrency(totalRevenue)}</h3>
            </div>
            <div className="p-3 bg-green-50 text-green-600 rounded-lg">
              <TrendingUp className="w-6 h-6" />
            </div>
          </div>
          <div className="text-xs text-gray-400">لا يشمل الطلبات الملغاة</div>
        </div>

        {/* New Orders Card */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex flex-col justify-between">
          <div className="flex justify-between items-start mb-4">
            <div>
              <p className="text-sm font-medium text-gray-500 mb-1">طلبات جديدة</p>
              <h3 className="text-2xl font-bold text-gray-900">{newOrdersCount}</h3>
            </div>
            <div className="p-3 bg-blue-50 text-blue-600 rounded-lg">
              <Clock className="w-6 h-6" />
            </div>
          </div>
          <Link href="/admin/orders?status=NEW" className="text-xs text-blue-600 hover:underline flex items-center gap-1">
            معالجة الطلبات <ArrowLeft className="w-3 h-3" />
          </Link>
        </div>

        {/* Total Orders Card */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex flex-col justify-between">
          <div className="flex justify-between items-start mb-4">
            <div>
              <p className="text-sm font-medium text-gray-500 mb-1">إجمالي الطلبات</p>
              <h3 className="text-2xl font-bold text-gray-900">{totalOrders}</h3>
            </div>
            <div className="p-3 bg-purple-50 text-purple-600 rounded-lg">
              <ShoppingCart className="w-6 h-6" />
            </div>
          </div>
          <Link href="/admin/orders" className="text-xs text-purple-600 hover:underline flex items-center gap-1">
            عرض كل الطلبات <ArrowLeft className="w-3 h-3" />
          </Link>
        </div>

        {/* Products Card */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex flex-col justify-between">
          <div className="flex justify-between items-start mb-4">
            <div>
              <p className="text-sm font-medium text-gray-500 mb-1">المنتجات النشطة</p>
              <h3 className="text-2xl font-bold text-gray-900">{productsCount}</h3>
            </div>
            <div className="p-3 bg-orange-50 text-orange-600 rounded-lg">
              <Package className="w-6 h-6" />
            </div>
          </div>
          <Link href="/admin/products" className="text-xs text-orange-600 hover:underline flex items-center gap-1">
            إدارة المنتجات <ArrowLeft className="w-3 h-3" />
          </Link>
        </div>

      </div>
      
      {/* Main Content Grid: 1 col on mobile, 3 cols on desktop */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Recent Orders Table (takes 2 columns on desktop) */}
        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-5 md:p-6 border-b border-gray-100 flex justify-between items-center">
            <h3 className="text-lg font-bold text-gray-900">أحدث الطلبات</h3>
            <Link href="/admin/orders" className="text-sm text-[#1a544a] hover:underline font-medium">عرض الكل</Link>
          </div>
          
          {/* Responsive table wrapper */}
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-right">
              <thead className="bg-gray-50 text-gray-500 font-medium border-b border-gray-200">
                <tr>
                  <th className="px-4 py-3 whitespace-nowrap">رقم الطلب</th>
                  <th className="px-4 py-3 whitespace-nowrap">العميل</th>
                  <th className="px-4 py-3 whitespace-nowrap">التاريخ</th>
                  <th className="px-4 py-3 whitespace-nowrap">الإجمالي</th>
                  <th className="px-4 py-3 whitespace-nowrap">الحالة</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {recentOrders.length > 0 ? (
                  recentOrders.map((order) => (
                    <tr key={order.id} className="hover:bg-gray-50/50 transition-colors">
                      <td className="px-4 py-4 whitespace-nowrap">
                        <Link href={`/admin/orders/${order.id}`} className="font-medium text-[#1a544a] hover:underline">
                          {order.orderNumber || `#${order.id.slice(-6)}`}
                        </Link>
                      </td>
                      <td className="px-4 py-4 text-gray-800 font-medium whitespace-nowrap">{order.customerName}</td>
                      <td className="px-4 py-4 text-gray-500 whitespace-nowrap">
                        {new Date(order.createdAt).toLocaleDateString('ar-YE', { year: 'numeric', month: 'short', day: 'numeric' })}
                      </td>
                      <td className="px-4 py-4 text-gray-900 font-bold whitespace-nowrap">
                        {formatCurrency(Number(order.totalAmount))}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap">
                        <span className={`px-2.5 py-1 text-xs font-semibold rounded-full border ${getStatusColor(order.status)}`}>
                          {getStatusLabel(order.status)}
                        </span>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="px-4 py-8 text-center text-gray-500">
                      لا توجد طلبات حتى الآن.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Low Stock Alerts */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 flex flex-col">
          <div className="p-5 md:p-6 border-b border-gray-100 flex justify-between items-center">
            <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-amber-500" />
              تنبيهات المخزون
            </h3>
          </div>
          
          <div className="p-5 flex-1 overflow-y-auto max-h-[400px]">
            {lowStockProducts.length > 0 ? (
              <ul className="space-y-4">
                {lowStockProducts.map((product) => (
                  <li key={product.id} className="flex items-center justify-between p-3 rounded-lg border border-red-100 bg-red-50/30">
                    <div className="flex items-center gap-3 overflow-hidden">
                      {product.imageUrl ? (
                        <img src={product.imageUrl} alt={product.name} className="w-10 h-10 rounded-md object-cover flex-shrink-0" />
                      ) : (
                        <div className="w-10 h-10 rounded-md bg-gray-200 flex-shrink-0 flex items-center justify-center">
                          <Package className="w-5 h-5 text-gray-400" />
                        </div>
                      )}
                      <div className="truncate">
                        <p className="text-sm font-semibold text-gray-900 truncate" title={product.name}>{product.name}</p>
                        <p className="text-xs text-red-600 font-medium">المتبقي: {product.stock} حبات فقط</p>
                      </div>
                    </div>
                    <Link 
                      href={`/admin/products/${product.id}/edit`}
                      className="text-xs px-2 py-1 bg-white border border-gray-200 rounded text-gray-600 hover:bg-gray-50 flex-shrink-0"
                    >
                      تحديث
                    </Link>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-center p-6 opacity-70">
                <CheckCircle className="w-12 h-12 text-green-500 mb-3" />
                <p className="text-gray-900 font-medium">المخزون بحالة ممتازة!</p>
                <p className="text-sm text-gray-500 mt-1">لا توجد منتجات قاربت على النفاذ حالياً.</p>
              </div>
            )}
          </div>
          {lowStockProducts.length > 0 && (
            <div className="p-4 border-t border-gray-100 bg-gray-50 rounded-b-xl">
              <Link href="/admin/products" className="text-sm text-center block text-gray-600 hover:text-gray-900">
                إدارة جميع المنتجات
              </Link>
            </div>
          )}
        </div>

      </div>
    </div>
  )
}
