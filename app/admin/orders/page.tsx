import React from 'react'
import Link from 'next/link'
import prisma from '@/lib/prisma'
import { Eye } from 'lucide-react'

export const dynamic = 'force-dynamic'

export default async function AdminOrdersPage() {
  const orders = await prisma.order.findMany({
    orderBy: { createdAt: 'desc' },
    include: {
      items: true
    }
  })

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PENDING': return 'bg-yellow-100 text-yellow-800'
      case 'AWAITING_PAYMENT': return 'bg-orange-100 text-orange-800'
      case 'APPROVED': return 'bg-blue-100 text-blue-800'
      case 'SHIPPED': return 'bg-purple-100 text-purple-800'
      case 'COMPLETED': return 'bg-green-100 text-green-800'
      case 'CANCELLED': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'PENDING': return 'قيد المراجعة'
      case 'AWAITING_PAYMENT': return 'بانتظار الدفع'
      case 'APPROVED': return 'معتمد'
      case 'SHIPPED': return 'تم الشحن'
      case 'COMPLETED': return 'مكتمل'
      case 'CANCELLED': return 'ملغي'
      default: return status
    }
  }

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">إدارة الطلبات</h1>
          <p className="text-gray-500 mt-1">متابعة واعتماد طلبات العملاء</p>
        </div>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-right" dir="rtl">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-4 text-sm font-bold text-gray-600">رقم الطلب</th>
                <th className="px-6 py-4 text-sm font-bold text-gray-600">تاريخ الطلب</th>
                <th className="px-6 py-4 text-sm font-bold text-gray-600">العميل</th>
                <th className="px-6 py-4 text-sm font-bold text-gray-600">الإجمالي</th>
                <th className="px-6 py-4 text-sm font-bold text-gray-600">حالة الطلب</th>
                <th className="px-6 py-4 text-sm font-bold text-gray-600">إجراءات</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {orders.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
                    لا يوجد طلبات حالياً
                  </td>
                </tr>
              ) : (
                orders.map(order => (
                  <tr key={order.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 font-mono text-sm text-gray-600">
                      {order.id.slice(-6).toUpperCase()}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {new Date(order.createdAt).toLocaleDateString('ar-SA')}
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-bold text-gray-900">{order.customerName}</div>
                      <div className="text-sm text-gray-500">{order.city}</div>
                    </td>
                    <td className="px-6 py-4 font-bold text-gray-900">
                      {Number(order.totalAmount).toLocaleString('ar-SA')} ر.س
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-bold ${getStatusColor(order.status)}`}>
                        {getStatusLabel(order.status)}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <Link 
                        href={`/admin/orders/${order.id}`}
                        className="inline-flex items-center gap-1 text-emerald-600 hover:text-emerald-800 transition-colors font-bold text-sm"
                      >
                        <Eye size={16} />
                        التفاصيل
                      </Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
