'use client'

import { useToast } from '@/components/ToastProvider'
import React, { useState } from 'react'
import {
  Download, ShoppingBag, Clock,
  PackageOpen, Truck, Search, X,
  CheckCircle, XCircle, Eye, Phone,
  MapPin, CreditCard, Package, ChevronRight,
  AlertCircle, Loader2
} from 'lucide-react'
import { updateOrderStatus, updatePaymentStatus } from './actions'
import { format } from 'date-fns'
import { ar } from 'date-fns/locale'

const ORDER_STATUSES = ['NEW', 'PROCESSING', 'SHIPPED', 'COMPLETED'] as const

const STATUS_LABEL: Record<string, string> = {
  NEW: 'جديد',
  PROCESSING: 'قيد التجهيز',
  SHIPPED: 'مشحون',
  COMPLETED: 'مكتمل',
  CANCELLED: 'ملغى',
}

const PAYMENT_STATUS_LABEL: Record<string, string> = {
  PAID: 'مؤكد',
  AWAITING_CONFIRMATION: 'بانتظار التأكيد',
  PENDING: 'معلق',
  FAILED: 'فشل',
}

const PAYMENT_METHOD_LABEL: Record<string, string> = {
  bank_transfer: 'تحويل بنكي',
  wallet: 'محفظة إلكترونية',
  cash_on_delivery: 'دفع عند الاستلام',
}

function PaymentBadge({ status }: { status: string }) {
  const colors: Record<string, string> = {
    PAID: 'bg-emerald-100 text-emerald-700',
    AWAITING_CONFIRMATION: 'bg-amber-100 text-amber-700',
    PENDING: 'bg-gray-100 text-gray-600',
    FAILED: 'bg-red-100 text-red-700',
  }
  return (
    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold ${colors[status] ?? 'bg-gray-100 text-gray-600'}`}>
      {PAYMENT_STATUS_LABEL[status] ?? status}
    </span>
  )
}

function OrderBadge({ status }: { status: string }) {
  const colors: Record<string, string> = {
    NEW: 'bg-blue-100 text-blue-700',
    PROCESSING: 'bg-indigo-100 text-indigo-700',
    SHIPPED: 'bg-teal-100 text-teal-700',
    COMPLETED: 'bg-emerald-100 text-emerald-700',
    CANCELLED: 'bg-red-100 text-red-700',
  }
  return (
    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold ${colors[status] ?? 'bg-gray-100 text-gray-600'}`}>
      {STATUS_LABEL[status] ?? status}
    </span>
  )
}

function StatusProgress({ status }: { status: string }) {
  if (status === 'CANCELLED') {
    return (
      <div className="flex items-center gap-2 text-red-600 font-bold text-sm">
        <XCircle size={18} /> الطلب ملغى
      </div>
    )
  }
  const currentIdx = ORDER_STATUSES.indexOf(status as any)
  return (
    <div className="flex items-center gap-1 w-full">
      {ORDER_STATUSES.map((s, i) => {
        const done = i <= currentIdx
        return (
          <React.Fragment key={s}>
            <div className="flex flex-col items-center flex-1 min-w-0">
              <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-colors ${done ? 'bg-emerald-600 text-white' : 'bg-gray-200 text-gray-400'}`}>
                {done ? <CheckCircle size={14} /> : i + 1}
              </div>
              <span className={`text-[10px] mt-1 font-bold text-center leading-tight ${done ? 'text-emerald-700' : 'text-gray-400'}`}>
                {STATUS_LABEL[s]}
              </span>
            </div>
            {i < ORDER_STATUSES.length - 1 && (
              <div className={`h-0.5 flex-1 mb-5 rounded transition-colors ${i < currentIdx ? 'bg-emerald-500' : 'bg-gray-200'}`} />
            )}
          </React.Fragment>
        )
      })}
    </div>
  )
}

function OrderDetailPanel({
  order,
  onClose,
  onOrderUpdated,
}: {
  order: any
  onClose: () => void
  onOrderUpdated: (id: string, field: 'status' | 'paymentStatus', value: string) => void
}) {
  const { showToast } = useToast()
  const [loadingAction, setLoadingAction] = useState<string | null>(null)
  const [lightboxUrl, setLightboxUrl] = useState<string | null>(null)

  const doStatusUpdate = async (newStatus: string) => {
    setLoadingAction('status_' + newStatus)
    const res = await updateOrderStatus(order.id, newStatus)
    if (res.success) {
      showToast('success', `تم تحديث الحالة إلى "${STATUS_LABEL[newStatus]}"`)
      onOrderUpdated(order.id, 'status', newStatus)
    } else {
      showToast('error', 'حدث خطأ أثناء التحديث')
    }
    setLoadingAction(null)
  }

  const doPaymentUpdate = async (newStatus: string) => {
    setLoadingAction('pay_' + newStatus)
    const res = await updatePaymentStatus(order.id, newStatus)
    if (res.success) {
      showToast('success', newStatus === 'PAID' ? 'تم تأكيد الدفع ✅' : 'تم رفض الدفع')
      onOrderUpdated(order.id, 'paymentStatus', newStatus)
    } else {
      showToast('error', 'حدث خطأ أثناء التحديث')
    }
    setLoadingAction(null)
  }

  const needsPaymentConfirm =
    (order.paymentMethod === 'bank_transfer' || order.paymentMethod === 'wallet') &&
    order.paymentStatus === 'AWAITING_CONFIRMATION' &&
    order.status !== 'CANCELLED' && 
    order.status !== 'COMPLETED'

  const isPaymentClear = 
    order.paymentMethod === 'cash_on_delivery' || 
    (order.paymentStatus !== 'FAILED' && order.paymentStatus !== 'AWAITING_CONFIRMATION')

  return (
    <div className="w-full bg-gray-50 flex flex-col text-right overflow-hidden border-t-2 border-emerald-500 shadow-inner" dir="rtl">

        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 bg-gray-50 shrink-0">
          <div>
            <div className="font-black text-gray-900 text-base">
              طلب {order.orderNumber ? `#${order.orderNumber}` : `…${order.id.slice(-6)}`}
            </div>
            <div className="text-xs text-gray-400 mt-0.5">
              {format(new Date(order.createdAt), 'EEEE، d MMMM yyyy · h:mm a', { locale: ar })}
            </div>
          </div>
          <button onClick={onClose} className="p-2 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors">
            <X size={20} />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto">

          {needsPaymentConfirm && (
            <div className="mx-4 mt-4 bg-amber-50 border border-amber-200 rounded-xl p-3 flex items-start gap-3">
              <AlertCircle size={18} className="text-amber-600 shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-bold text-amber-800">يحتاج تأكيد الدفع</p>
                <p className="text-xs text-amber-600 mt-0.5">راجع الإيصال أدناه وأكد أو ارفض الدفع</p>
              </div>
            </div>
          )}

          {/* Status Progress */}
          <div className="px-5 pt-5 pb-4 border-b border-gray-100">
            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4">مرحلة الطلب</p>
            <StatusProgress status={order.status} />
          </div>

          {/* Customer */}
          <div className="px-5 py-4 border-b border-gray-100">
            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">بيانات العميل</p>
            <div className="space-y-2.5">
              <div className="flex items-center gap-3 text-sm">
                <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center shrink-0">
                  <span className="text-emerald-700 font-black text-sm">{order.customerName.charAt(0)}</span>
                </div>
                <span className="font-bold text-gray-900">{order.customerName}</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-gray-600">
                <Phone size={15} className="text-gray-400 shrink-0" />
                <a href={`tel:${order.customerPhone}`} className="font-mono hover:text-emerald-700 transition-colors" dir="ltr">{order.customerPhone}</a>
              </div>
              {(order.governorate || order.city || order.address) && (
                <div className="flex items-start gap-3 text-sm text-gray-600">
                  <MapPin size={15} className="text-gray-400 shrink-0 mt-0.5" />
                  <span>{[order.governorate, order.city, order.address].filter(Boolean).join(' — ')}</span>
                </div>
              )}
            </div>
          </div>

          {/* Products */}
          <div className="px-5 py-4 border-b border-gray-100">
            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">المنتجات</p>
            <div className="space-y-3">
              {order.items.map((item: any) => (
                <div key={item.id} className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-lg bg-gray-100 overflow-hidden shrink-0 border border-gray-200">
                    {item.product?.images?.[0] ? (
                      <img src={item.product.images[0]} alt={item.product?.name ?? ''} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center"><Package size={18} className="text-gray-300" /></div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-gray-800 truncate">{item.product?.name ?? 'منتج محذوف'}</p>
                    <p className="text-xs text-gray-400">الكمية: {item.quantity}</p>
                  </div>
                  <div className="text-sm font-bold text-gray-800 shrink-0">{(item.price * item.quantity).toFixed(2)} ر.ي</div>
                </div>
              ))}
            </div>
            <div className="mt-4 pt-3 border-t border-dashed border-gray-200 space-y-1.5">
              <div className="flex justify-between text-sm text-gray-500">
                <span>الشحن</span><span>{Number(order.shippingFee).toFixed(2)} ر.ي</span>
              </div>
              {order.coupon && (
                <div className="flex justify-between text-sm text-emerald-600 font-bold">
                  <span>الخصم ({order.coupon.code})</span>
                  <span>- {Number(order.coupon.value).toFixed(2)} {order.coupon.type === 'PERCENTAGE' ? '%' : 'ر.ي'}</span>
                </div>
              )}
              <div className="flex justify-between text-base font-black text-gray-900">
                <span>الإجمالي</span><span>{Number(order.totalAmount).toFixed(2)} ر.ي</span>
              </div>
            </div>
          </div>

          {/* Payment */}
          <div className="px-5 py-4 border-b border-gray-100">
            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">الدفع</p>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2 text-sm text-gray-700">
                <CreditCard size={15} className="text-gray-400" />
                <span className="font-bold">{PAYMENT_METHOD_LABEL[order.paymentMethod] ?? order.paymentMethod}</span>
              </div>
              <PaymentBadge status={order.paymentStatus} />
            </div>
            {order.transactionId && (
              <p className="text-xs text-gray-400 mb-3 font-mono">رقم العملية: {order.transactionId}</p>
            )}
            {order.paymentProofUrl ? (
              <button
                onClick={() => setLightboxUrl(order.paymentProofUrl)}
                className="w-full rounded-xl overflow-hidden border-2 border-dashed border-amber-300 bg-amber-50 h-44 flex items-center justify-center relative hover:border-amber-500 transition-colors group"
              >
                <img src={order.paymentProofUrl} alt="إيصال الدفع" className="h-full w-full object-contain" />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                  <Eye size={24} className="text-white opacity-0 group-hover:opacity-100 transition-opacity drop-shadow-lg" />
                </div>
              </button>
            ) : (order.paymentMethod === 'bank_transfer' || order.paymentMethod === 'wallet') && (
              <div className="w-full rounded-xl border-2 border-dashed border-gray-200 h-24 flex items-center justify-center text-gray-400 text-sm">لم يُرفق إيصال</div>
            )}
            {needsPaymentConfirm && (
              <div className="flex gap-2 mt-3">
                <button onClick={() => doPaymentUpdate('PAID')} disabled={!!loadingAction} className="flex-1 flex items-center justify-center gap-2 bg-emerald-600 text-white py-2.5 rounded-xl font-bold text-sm hover:bg-emerald-700 transition-colors disabled:opacity-60">
                  {loadingAction === 'pay_PAID' ? <Loader2 size={16} className="animate-spin" /> : <CheckCircle size={16} />} تأكيد الدفع
                </button>
                <button onClick={() => doPaymentUpdate('FAILED')} disabled={!!loadingAction} className="flex-1 flex items-center justify-center gap-2 bg-red-50 text-red-600 border border-red-200 py-2.5 rounded-xl font-bold text-sm hover:bg-red-100 transition-colors disabled:opacity-60">
                  {loadingAction === 'pay_FAILED' ? <Loader2 size={16} className="animate-spin" /> : <XCircle size={16} />} رفض الدفع
                </button>
              </div>
            )}
          </div>

          {/* Order Actions */}
          {order.status !== 'COMPLETED' && order.status !== 'CANCELLED' && (
            <div className="px-5 py-4">
              <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">إجراءات الطلب</p>
              <div className="space-y-2">
                {!isPaymentClear && (
                  <p className="text-[10px] text-amber-600 bg-amber-50 px-2 py-1 rounded text-center">
                    تنبيه: بانتظار تأكيد الدفع قبل معالجة الطلب
                  </p>
                )}
                {order.status === 'NEW' && (
                  <button onClick={() => doStatusUpdate('PROCESSING')} disabled={!!loadingAction || !isPaymentClear} title={!isPaymentClear ? 'يجب تأكيد الدفع أولاً' : ''} className="w-full flex items-center justify-between bg-indigo-600 text-white px-4 py-3 rounded-xl font-bold text-sm hover:bg-indigo-700 transition-colors disabled:opacity-60 disabled:cursor-not-allowed">
                    <span className="flex items-center gap-2">{loadingAction === 'status_PROCESSING' ? <Loader2 size={16} className="animate-spin" /> : <PackageOpen size={16} />} بدء التجهيز</span>
                    <ChevronRight size={16} className="opacity-60" />
                  </button>
                )}
                {order.status === 'PROCESSING' && (
                  <button onClick={() => doStatusUpdate('SHIPPED')} disabled={!!loadingAction || !isPaymentClear} title={!isPaymentClear ? 'يجب تأكيد الدفع أولاً' : ''} className="w-full flex items-center justify-between bg-teal-600 text-white px-4 py-3 rounded-xl font-bold text-sm hover:bg-teal-700 transition-colors disabled:opacity-60 disabled:cursor-not-allowed">
                    <span className="flex items-center gap-2">{loadingAction === 'status_SHIPPED' ? <Loader2 size={16} className="animate-spin" /> : <Truck size={16} />} تأكيد الشحن</span>
                    <ChevronRight size={16} className="opacity-60" />
                  </button>
                )}
                {order.status === 'SHIPPED' && (
                  <button onClick={() => doStatusUpdate('COMPLETED')} disabled={!!loadingAction || !isPaymentClear} title={!isPaymentClear ? 'يجب تأكيد الدفع أولاً' : ''} className="w-full flex items-center justify-between bg-emerald-600 text-white px-4 py-3 rounded-xl font-bold text-sm hover:bg-emerald-700 transition-colors disabled:opacity-60 disabled:cursor-not-allowed">
                    <span className="flex items-center gap-2">{loadingAction === 'status_COMPLETED' ? <Loader2 size={16} className="animate-spin" /> : <CheckCircle size={16} />} تأكيد الاستلام (مكتمل)</span>
                    <ChevronRight size={16} className="opacity-60" />
                  </button>
                )}
                <button onClick={() => doStatusUpdate('CANCELLED')} disabled={!!loadingAction} className="w-full flex items-center justify-between bg-red-50 text-red-600 border border-red-200 px-4 py-3 rounded-xl font-bold text-sm hover:bg-red-100 transition-colors disabled:opacity-60">
                  <span className="flex items-center gap-2">{loadingAction === 'status_CANCELLED' ? <Loader2 size={16} className="animate-spin" /> : <XCircle size={16} />} إلغاء الطلب</span>
                  <ChevronRight size={16} className="opacity-60" />
                </button>
              </div>
            </div>
          )}

          {(order.status === 'COMPLETED' || order.status === 'CANCELLED') && (
            <div className="px-5 py-4">
              <div className={`rounded-xl p-4 flex items-center gap-3 ${order.status === 'COMPLETED' ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-600'}`}>
                {order.status === 'COMPLETED' ? <CheckCircle size={20} /> : <XCircle size={20} />}
                <span className="font-bold text-sm">{order.status === 'COMPLETED' ? 'الطلب مكتمل ومُسلَّم' : 'تم إلغاء هذا الطلب'}</span>
              </div>
            </div>
          )}
          <div className="h-8" />
        </div>

      {/* Lightbox */}
      {lightboxUrl && (
        <div className="fixed inset-0 z-[200] bg-black/90 flex items-center justify-center p-4" onClick={() => setLightboxUrl(null)}>
          <button onClick={() => setLightboxUrl(null)} className="absolute top-4 left-4 text-white/70 hover:text-white p-2"><X size={28} /></button>
          <img src={lightboxUrl} alt="إيصال الدفع" className="max-h-full max-w-full object-contain rounded-lg" onClick={e => e.stopPropagation()} />
        </div>
      )}
    </div>
  )
}

// ─── Main ────────────────────────────────────────────────────────────────────
export default function OrdersClient({ orders: initialOrders, stats }: { orders: any[]; stats: any }) {
  const { showToast } = useToast()
  const [orders, setOrders] = useState<any[]>(initialOrders)
  const [selectedOrder, setSelectedOrder] = useState<any | null>(null)
  const [filterStatus, setFilterStatus] = useState('الكل')
  const [searchQuery, setSearchQuery] = useState('')

  const handleExportCSV = () => {
    if (orders.length === 0) { showToast('error', 'لا يوجد طلبات لتصديرها'); return }
    const headers = ['رقم الطلب', 'التاريخ', 'العميل', 'رقم الهاتف', 'حالة الطلب', 'حالة الدفع', 'الإجمالي']
    const csvContent = [headers.join(','), ...orders.map(o => [o.orderNumber || o.id, format(new Date(o.createdAt), 'yyyy-MM-dd HH:mm'), `"${o.customerName}"`, o.customerPhone, o.status, o.paymentStatus, o.totalAmount].join(','))].join('\n')
    const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a'); a.href = url; a.download = `طلبات_طيف_${format(new Date(), 'yyyy-MM-dd')}.csv`
    document.body.appendChild(a); a.click(); document.body.removeChild(a)
    showToast('success', 'تم تصدير الطلبات بنجاح')
  }

  const handleOrderUpdated = (id: string, field: 'status' | 'paymentStatus', value: string) => {
    setOrders(prev => prev.map(o => o.id === id ? { ...o, [field]: value } : o))
    setSelectedOrder((prev: any) => prev?.id === id ? { ...prev, [field]: value } : prev)
  }

  const filtered = orders
    .filter(o => filterStatus === 'الكل' || (filterStatus === 'جديد' && o.status === 'NEW') || (filterStatus === 'قيد التجهيز' && o.status === 'PROCESSING') || (filterStatus === 'مشحون' && o.status === 'SHIPPED') || (filterStatus === 'مكتمل' && o.status === 'COMPLETED') || (filterStatus === 'ملغى' && o.status === 'CANCELLED'))
    .filter(o => searchQuery === '' || o.orderNumber?.toLowerCase().includes(searchQuery.toLowerCase()) || o.customerName.toLowerCase().includes(searchQuery.toLowerCase()) || o.customerPhone.includes(searchQuery))

  return (
    <div className="space-y-6">
      {/* Header */}
      <header className="flex flex-wrap justify-between items-end gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-1">إدارة الطلبات</h1>
          <p className="text-gray-500 text-sm">مراجعة وتحديث حالة الطلبات والدفعات.</p>
        </div>
        <button onClick={handleExportCSV} className="bg-white border border-gray-200 text-gray-700 px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-gray-50 transition-colors shadow-sm text-sm font-bold">
          <Download size={16} /> تصدير CSV
        </button>
      </header>

      {/* Stats */}
      <section className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-5">
        {[
          { label: 'إجمالي الطلبات', value: stats.total, Icon: ShoppingBag, color: 'text-gray-400' },
          { label: 'بانتظار التأكيد', value: stats.pendingPayment, Icon: Clock, color: 'text-amber-500', urgent: true },
          { label: 'قيد التجهيز', value: stats.processing, Icon: PackageOpen, color: 'text-indigo-500' },
          { label: 'تم الشحن', value: stats.shipped, Icon: Truck, color: 'text-teal-500' },
        ].map(({ label, value, Icon, color, urgent }) => (
          <div key={label} className={`bg-white border rounded-xl p-4 shadow-sm flex flex-col gap-2 ${urgent && value > 0 ? 'border-amber-200' : 'border-gray-200'}`}>
            <div className="flex justify-between items-center">
              <span className="text-xs font-bold text-gray-500">{label}</span>
              <Icon size={18} className={color} />
            </div>
            <span className="text-2xl md:text-3xl font-black text-gray-900">{value}</span>
          </div>
        ))}
      </section>

      {/* Table/Cards */}
      <section className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
        {/* Filters */}
        <div className="p-3 md:p-4 border-b border-gray-100 bg-gray-50 flex flex-wrap gap-3">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
            <input type="text" placeholder="البحث باسم العميل، الهاتف..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} className="w-full bg-white border border-gray-200 rounded-lg py-2 pr-9 pl-3 text-sm focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all" />
          </div>
          <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)} className="bg-white border border-gray-200 rounded-lg py-2 px-3 text-sm font-bold text-gray-600 focus:outline-none focus:border-emerald-500 cursor-pointer">
            {['الكل', 'جديد', 'قيد التجهيز', 'مشحون', 'مكتمل', 'ملغى'].map(s => <option key={s} value={s}>{s === 'الكل' ? 'حالة الطلب: الكل' : s}</option>)}
          </select>
        </div>

        {/* Desktop Table */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-right border-collapse">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                {['رقم الطلب', 'العميل', 'التاريخ', 'الإجمالي', 'حالة الدفع', 'حالة الطلب', 'عرض'].map(h => (
                  <th key={h} className="py-3 px-4 text-xs font-bold text-gray-500">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="text-sm text-gray-700 divide-y divide-gray-100">
              {filtered.map(order => (
                <React.Fragment key={order.id}>
                  <tr className={`transition-colors cursor-pointer ${selectedOrder?.id === order.id ? 'bg-emerald-50' : 'hover:bg-gray-50'}`} onClick={() => setSelectedOrder(selectedOrder?.id === order.id ? null : order)}>
                    <td className="py-3 px-4 font-mono font-bold text-emerald-800 text-xs">{order.orderNumber || `…${order.id.slice(-6)}`}</td>
                    <td className="py-3 px-4"><p className="font-bold text-gray-900">{order.customerName}</p><p className="text-xs text-gray-400">{order.customerPhone}</p></td>
                    <td className="py-3 px-4 text-xs text-gray-500">{new Date(order.createdAt).toLocaleDateString('ar-YE')}</td>
                    <td className="py-3 px-4 font-bold">{Number(order.totalAmount).toFixed(2)} ر.ي</td>
                    <td className="py-3 px-4"><PaymentBadge status={order.paymentStatus} /></td>
                    <td className="py-3 px-4"><OrderBadge status={order.status} /></td>
                    <td className="py-3 px-4">
                      <button className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${selectedOrder?.id === order.id ? 'bg-gray-200 text-gray-700' : 'bg-emerald-600 text-white hover:bg-emerald-700'}`}>
                        {selectedOrder?.id === order.id ? <X size={13} /> : <Eye size={13} />} {selectedOrder?.id === order.id ? 'إغلاق' : 'عرض'}
                      </button>
                    </td>
                  </tr>
                  {selectedOrder?.id === order.id && (
                    <tr>
                      <td colSpan={7} className="p-0 border-b-4 border-gray-200">
                        <OrderDetailPanel
                          order={selectedOrder}
                          onClose={() => setSelectedOrder(null)}
                          onOrderUpdated={handleOrderUpdated}
                        />
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))}
              {filtered.length === 0 && <tr><td colSpan={7} className="py-16 text-center text-gray-400 font-bold">لا توجد طلبات</td></tr>}
            </tbody>
          </table>
        </div>

        {/* Mobile Cards */}
        <div className="md:hidden divide-y divide-gray-100">
          {filtered.map(order => (
            <div key={order.id} className="border-b border-gray-100">
              <div className={`p-4 transition-colors cursor-pointer ${selectedOrder?.id === order.id ? 'bg-emerald-50' : 'hover:bg-gray-50 active:bg-gray-100'}`} onClick={() => setSelectedOrder(selectedOrder?.id === order.id ? null : order)}>
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-mono text-xs font-bold text-emerald-700">{order.orderNumber ? `#${order.orderNumber}` : `…${order.id.slice(-6)}`}</span>
                      <OrderBadge status={order.status} />
                      {order.paymentStatus === 'AWAITING_CONFIRMATION' && <span className="inline-block w-2 h-2 rounded-full bg-amber-400 animate-pulse" />}
                    </div>
                    <p className="font-bold text-gray-900 mt-1">{order.customerName}</p>
                    <p className="text-xs text-gray-400">{order.customerPhone}</p>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="font-black text-gray-900">{Number(order.totalAmount).toFixed(2)} ر.ي</p>
                    <p className="text-xs text-gray-400 mt-1">{new Date(order.createdAt).toLocaleDateString('ar-YE')}</p>
                  </div>
                </div>
              </div>
              {selectedOrder?.id === order.id && (
                <div className="border-b-4 border-gray-200">
                  <OrderDetailPanel
                    order={selectedOrder}
                    onClose={() => setSelectedOrder(null)}
                    onOrderUpdated={handleOrderUpdated}
                  />
                </div>
              )}
            </div>
          ))}
          {filtered.length === 0 && <div className="py-16 text-center text-gray-400 font-bold">لا توجد طلبات</div>}
        </div>
      </section>


    </div>
  )
}
