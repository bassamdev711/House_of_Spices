'use client'

import { useToast } from '@/components/ToastProvider'

import React, { useState } from 'react'
import { 
  Download, Plus, ShoppingBag, TrendingUp, Clock, 
  PackageOpen, Truck, Search, Receipt, MoreVertical, 
  ChevronRight, ChevronLeft, X 
} from 'lucide-react'
import { updateOrderStatus, updatePaymentStatus } from './actions'
import Link from 'next/link'

export default function OrdersClient({
  orders, stats }: { orders: any[], stats: any }) {
  const { showToast } = useToast()
  const [filterStatus, setFilterStatus] = useState('الكل')
  const [filterTime, setFilterTime] = useState('الكل')
  const [searchQuery, setSearchQuery] = useState('')
  const [receiptModal, setReceiptModal] = useState<{isOpen: boolean, url: string | null}>({ isOpen: false, url: null })
  
  const handleViewReceipt = (url: string | null) => {
    if(url) {
      setReceiptModal({ isOpen: true, url })
    } else {
      showToast('success', 'لم يتم إرفاق إيصال لهذا الطلب.')
    }
  }

  const handleUpdatePayment = async (id: string, status: string) => {
    const res = await updatePaymentStatus(id, status)
    if(res.success) {
      showToast('success', 'تم تحديث حالة الدفع')
    } else {
      showToast('error', 'حدث خطأ')
    }
  }

  const handleUpdateOrder = async (id: string, status: string) => {
    const res = await updateOrderStatus(id, status)
    if(res.success) {
      showToast('success', 'تم تحديث حالة الطلب')
    } else {
      showToast('error', 'حدث خطأ')
    }
  }

  const getPaymentStatusBadge = (status: string) => {
    switch (status) {
      case 'PAID': return <span className="inline-flex items-center px-2 py-1 rounded bg-green-100 text-green-700 text-xs font-bold uppercase">مؤكد</span>
      case 'AWAITING_CONFIRMATION': return <span className="inline-flex items-center px-2 py-1 rounded bg-yellow-100 text-yellow-700 text-xs font-bold uppercase">بانتظار التأكيد</span>
      case 'FAILED': return <span className="inline-flex items-center px-2 py-1 rounded bg-red-100 text-red-700 text-xs font-bold uppercase">فشل</span>
      default: return <span className="inline-flex items-center px-2 py-1 rounded bg-gray-100 text-gray-700 text-xs font-bold uppercase">معلق</span>
    }
  }

  const getOrderStatusBadge = (status: string) => {
    switch (status) {
      case 'NEW': return <span className="inline-flex items-center px-2 py-1 rounded bg-blue-100 text-blue-700 text-xs font-bold uppercase">جديد</span>
      case 'PROCESSING': return <span className="inline-flex items-center px-2 py-1 rounded bg-indigo-100 text-indigo-700 text-xs font-bold uppercase">قيد التجهيز</span>
      case 'SHIPPED': return <span className="inline-flex items-center px-2 py-1 rounded bg-green-100 text-green-700 text-xs font-bold uppercase">مشحون</span>
      case 'COMPLETED': return <span className="inline-flex items-center px-2 py-1 rounded bg-green-200 text-green-800 text-xs font-bold uppercase">مكتمل</span>
      case 'CANCELLED': return <span className="inline-flex items-center px-2 py-1 rounded bg-red-100 text-red-700 text-xs font-bold uppercase">ملغى</span>
      default: return <span className="inline-flex items-center px-2 py-1 rounded bg-gray-100 text-gray-700 text-xs font-bold uppercase">{status}</span>
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <header className="flex justify-between items-end mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">إدارة الطلبات</h1>
          <p className="text-gray-500">مراجعة وتحديث حالة الطلبات والدفعات.</p>
        </div>
        <div className="flex gap-4">
          <button className="bg-white border border-gray-200 text-gray-700 px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-gray-50 transition-colors shadow-sm">
            <Download size={18} />
            <span className="font-bold text-sm">تصدير التقرير</span>
          </button>
          <Link href="/admin/orders/new" className="bg-emerald-800 text-white px-6 py-2 rounded-lg flex items-center gap-2 hover:bg-emerald-900 transition-colors font-bold text-sm">
            <Plus size={18} />
            طلب جديد
          </Link>
        </div>
      </header>

      {/* Stats */}
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white border border-gray-200 rounded-xl p-5 flex flex-col justify-between h-[120px] shadow-sm">
          <div className="flex justify-between items-start">
            <span className="text-sm font-bold text-gray-500">إجمالي الطلبات</span>
            <ShoppingBag size={20} className="text-gray-400" />
          </div>
          <div className="flex items-end gap-2">
            <span className="text-3xl font-bold text-gray-900">{stats.total}</span>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-xl p-5 flex flex-col justify-between h-[120px] shadow-sm">
          <div className="flex justify-between items-start">
            <span className="text-sm font-bold text-gray-500">بانتظار الدفع أو التأكيد</span>
            <Clock size={20} className="text-yellow-500" />
          </div>
          <div className="flex items-end gap-2">
            <span className="text-3xl font-bold text-gray-900">{stats.pendingPayment}</span>
            <span className="text-xs font-bold text-yellow-500 mb-1">عاجل</span>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-xl p-5 flex flex-col justify-between h-[120px] shadow-sm">
          <div className="flex justify-between items-start">
            <span className="text-sm font-bold text-gray-500">قيد التجهيز</span>
            <PackageOpen size={20} className="text-indigo-500" />
          </div>
          <div className="flex items-end gap-2">
            <span className="text-3xl font-bold text-gray-900">{stats.processing}</span>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-xl p-5 flex flex-col justify-between h-[120px] shadow-sm">
          <div className="flex justify-between items-start">
            <span className="text-sm font-bold text-gray-500">تم الشحن</span>
            <Truck size={20} className="text-emerald-500" />
          </div>
          <div className="flex items-end gap-2">
            <span className="text-3xl font-bold text-gray-900">{stats.shipped}</span>
          </div>
        </div>
      </section>

      {/* Orders Table Area */}
      <section className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
        {/* Filters */}
        <div className="p-4 border-b border-gray-200 bg-gray-50 flex gap-4 items-center flex-wrap">
          <div className="relative flex-1 min-w-[250px]">
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input 
              type="text" 
              placeholder="البحث برقم الطلب، الهاتف، أو الاسم..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white border border-gray-200 rounded-lg py-2 pr-10 pl-4 text-sm focus:outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 transition-all"
            />
          </div>
          <div className="flex gap-3">
            <select 
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="bg-white border border-gray-200 rounded-lg py-2 px-4 text-sm font-bold text-gray-600 focus:outline-none focus:border-emerald-600 cursor-pointer"
            >
              <option value="الكل">حالة الطلب: الكل</option>
              <option value="جديد">جديد</option>
              <option value="قيد التجهيز">قيد التجهيز</option>
              <option value="مشحون">مشحون</option>
            </select>
          </div>
          {/* A button to trigger search from props? Since this is a client component, we should probably fetch data or pass search via URL params.
              For simplicity, we'll implement basic frontend filtering on the `orders` prop.
          */}
        </div>

        {/* Table */}
        <div className="overflow-x-auto w-full">
          <table className="w-full text-right border-collapse">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="py-3 px-4 text-xs font-bold text-gray-500 w-[100px]">رقم الطلب</th>
                <th className="py-3 px-4 text-xs font-bold text-gray-500 min-w-[150px]">العميل</th>
                <th className="py-3 px-4 text-xs font-bold text-gray-500 w-[120px]">التاريخ</th>
                <th className="py-3 px-4 text-xs font-bold text-gray-500 w-[120px]">المبلغ الإجمالي</th>
                <th className="py-3 px-4 text-xs font-bold text-gray-500 w-[140px]">طريقة الدفع</th>
                <th className="py-3 px-4 text-xs font-bold text-gray-500 w-[140px]">حالة الدفع</th>
                <th className="py-3 px-4 text-xs font-bold text-gray-500 w-[140px]">حالة الطلب</th>
                <th className="py-3 px-4 text-xs font-bold text-gray-500 w-[100px] text-center">إجراءات</th>
              </tr>
            </thead>
            <tbody className="text-sm text-gray-700">
              {orders
                .filter(o => filterStatus === 'الكل' || 
                  (filterStatus === 'جديد' && o.status === 'NEW') ||
                  (filterStatus === 'قيد التجهيز' && o.status === 'PROCESSING') ||
                  (filterStatus === 'مشحون' && o.status === 'SHIPPED')
                )
                .filter(o => 
                  searchQuery === '' || 
                  (o.orderNumber && o.orderNumber.toLowerCase().includes(searchQuery.toLowerCase())) ||
                  o.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                  o.customerPhone.includes(searchQuery)
                )
                .map(order => (
                <tr key={order.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                  <td className="py-4 px-4 font-mono font-bold text-emerald-800">{order.orderNumber || '-'}</td>
                  <td className="py-4 px-4 font-bold">
                    {order.customerName}
                    <div className="text-xs text-gray-400 font-normal">{order.customerPhone}</div>
                  </td>
                  <td className="py-4 px-4 text-gray-500 text-xs">
                    {new Date(order.createdAt).toLocaleDateString('en-GB')}
                  </td>
                  <td className="py-4 px-4 font-mono font-bold">{Number(order.totalAmount).toFixed(2)} ر.ي</td>
                  <td className="py-4 px-4 text-gray-600 flex items-center gap-2 h-full min-h-[48px]">
                    {order.paymentMethod === 'bank_transfer' ? 'تحويل بنكي' : 
                     order.paymentMethod === 'wallet' ? 'محفظة' : 'دفع عند الاستلام'}
                    
                    {(order.paymentMethod === 'bank_transfer' || order.paymentMethod === 'wallet') && (
                      <button 
                        onClick={() => handleViewReceipt(order.paymentProofUrl)}
                        className="text-blue-500 hover:text-blue-700 transition-colors flex items-center justify-center bg-blue-50 p-1.5 rounded" 
                        title="عرض إيصال التحويل"
                      >
                        <Receipt size={16} />
                      </button>
                    )}
                  </td>
                  <td className="py-4 px-4">
                    {getPaymentStatusBadge(order.paymentStatus)}
                  </td>
                  <td className="py-4 px-4">
                    {getOrderStatusBadge(order.status)}
                  </td>
                  <td className="py-4 px-4 text-center">
                    <div className="relative group inline-block">
                      <button className="text-gray-400 hover:text-gray-800 transition-colors p-1">
                        <MoreVertical size={20} />
                      </button>
                      <div className="absolute left-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50 text-right">
                        {order.paymentStatus === 'AWAITING_CONFIRMATION' && (
                          <button onClick={() => handleUpdatePayment(order.id, 'PAID')} className="w-full text-right px-4 py-2 text-sm text-green-600 hover:bg-green-50 font-bold border-b border-gray-100">تأكيد الدفع</button>
                        )}
                        {order.status === 'NEW' && (
                          <button onClick={() => handleUpdateOrder(order.id, 'PROCESSING')} className="w-full text-right px-4 py-2 text-sm text-indigo-600 hover:bg-indigo-50 font-bold">بدء التجهيز</button>
                        )}
                        {order.status === 'PROCESSING' && (
                          <button onClick={() => handleUpdateOrder(order.id, 'SHIPPED')} className="w-full text-right px-4 py-2 text-sm text-emerald-600 hover:bg-emerald-50 font-bold">تأكيد الشحن</button>
                        )}
                        <button onClick={() => handleUpdateOrder(order.id, 'CANCELLED')} className="w-full text-right px-4 py-2 text-sm text-red-600 hover:bg-red-50 font-bold border-t border-gray-100">إلغاء الطلب</button>
                      </div>
                    </div>
                  </td>
                </tr>
              ))}
              {orders.length === 0 && (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-gray-500 font-bold">
                    لا توجد طلبات حتى الآن.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>

      {/* Receipt Modal */}
      {receiptModal.isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setReceiptModal({isOpen: false, url: null})}></div>
          <div className="relative bg-white rounded-xl shadow-2xl p-4 max-w-2xl w-full mx-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-bold text-lg">إيصال الدفع</h3>
              <button onClick={() => setReceiptModal({isOpen: false, url: null})} className="text-gray-500 hover:text-black">
                <X size={24} />
              </button>
            </div>
            <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden flex items-center justify-center">
              <img src={receiptModal.url!} alt="Receipt" className="max-w-full max-h-full object-contain" />
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
