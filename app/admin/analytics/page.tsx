"use client";

import { useEffect, useState } from "react";
import { getAnalyticsData } from "./actions";
import { Users, Eye, BarChart, Server, Activity, ArrowUpRight, ArrowDownRight, Settings } from "lucide-react";
import Link from "next/link";

export default function AnalyticsPage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getAnalyticsData().then((res) => {
      if (res.success) {
        setData(res);
      }
      setLoading(false);
    });
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="w-8 h-8 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!data) return <div>فشل في جلب البيانات</div>;

  const storagePercentage = Math.min((data.usage.storageGB / 1) * 100, 100);
  const bandwidthPercentage = Math.min((data.usage.bandwidthGB / 10) * 100, 100);

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">الإحصائيات والاستهلاك</h1>
          <p className="text-gray-500 text-sm mt-1">نظرة عامة على أداء موقعك واستهلاك الموارد</p>
        </div>
      </div>

      {/* Visits Section */}
      <div>
        <h2 className="text-lg font-semibold text-gray-800 flex items-center gap-2 mb-4">
          <Users className="w-5 h-5 text-emerald-600" />
          الزيارات والمشاهدات
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <StatCard title="زيارات اليوم" value={data.visits.today} icon={<Users />} color="blue" />
          <StatCard title="مشاهدات صفحات اليوم" value={data.visits.todayViews} icon={<Eye />} color="indigo" />
          <StatCard title="زيارات هذا الشهر" value={data.visits.month} icon={<BarChart />} color="emerald" />
          <StatCard title="إجمالي الزيارات" value={data.visits.total} icon={<Activity />} color="purple" />
        </div>
      </div>

      {/* Usage Section */}
      <div>
        <h2 className="text-lg font-semibold text-gray-800 flex items-center gap-2 mb-4">
          <Server className="w-5 h-5 text-emerald-600" />
          الاستهلاك (Vercel & Database)
        </h2>
        
        {!data.usage.isVercelConnected && (
          <div className="bg-yellow-50 border border-yellow-200 text-yellow-800 rounded-lg p-4 mb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h4 className="font-bold">غير متصل بـ Vercel API</h4>
              <p className="text-sm mt-1">لعرض الاستهلاك الحقيقي للباندويث، يرجى إضافة <code>VERCEL_API_TOKEN</code> و <code>VERCEL_PROJECT_ID</code> في إعدادات البيئة (env) ثم <strong>إعادة تشغيل الخادم</strong>.</p>
            </div>
            <Link href="https://vercel.com/docs/rest-api" target="_blank" className="bg-yellow-100 px-4 py-2 rounded-md text-sm font-medium hover:bg-yellow-200 transition-colors">
              طريقة الحصول على المفتاح
            </Link>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* Storage Bar */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="flex justify-between items-end mb-2">
              <div>
                <h3 className="font-semibold text-gray-800">مساحة التخزين (Database & Blob)</h3>
                <p className="text-sm text-gray-500">الحد الأقصى: 1 GB</p>
              </div>
              <div className="text-2xl font-black text-gray-900">
                {data.usage.storageGB.toFixed(3)} <span className="text-sm font-medium text-gray-500">GB</span>
              </div>
            </div>
            <div className="w-full bg-gray-100 rounded-full h-3 mb-2 overflow-hidden">
              <div 
                className={`h-3 rounded-full transition-all duration-1000 ${storagePercentage > 85 ? 'bg-red-500' : storagePercentage > 60 ? 'bg-yellow-400' : 'bg-emerald-500'}`}
                style={{ width: `${storagePercentage}%` }}
              ></div>
            </div>
            <p className="text-xs text-gray-500 text-left">{storagePercentage.toFixed(1)}% مستهلك</p>
          </div>

          {/* Bandwidth Bar */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 relative overflow-hidden">
            {!data.usage.isVercelConnected && (
              <div className="absolute inset-0 bg-white/60 backdrop-blur-sm z-10 flex flex-col items-center justify-center">
                <Settings className="w-8 h-8 text-gray-400 mb-2 animate-spin-slow" />
                <p className="text-sm font-medium text-gray-600">يتطلب الربط بـ Vercel</p>
              </div>
            )}
            
            <div className="flex justify-between items-end mb-2">
              <div>
                <h3 className="font-semibold text-gray-800">نقل البيانات (Bandwidth)</h3>
                <p className="text-sm text-gray-500">الحد الأقصى المجاني: 10 GB</p>
              </div>
              <div className="text-2xl font-black text-gray-900">
                {data.usage.bandwidthGB.toFixed(2)} <span className="text-sm font-medium text-gray-500">GB</span>
              </div>
            </div>
            <div className="w-full bg-gray-100 rounded-full h-3 mb-2 overflow-hidden">
              <div 
                className={`h-3 rounded-full transition-all duration-1000 ${bandwidthPercentage > 85 ? 'bg-red-500' : bandwidthPercentage > 60 ? 'bg-yellow-400' : 'bg-blue-500'}`}
                style={{ width: `${bandwidthPercentage}%` }}
              ></div>
            </div>
            <p className="text-xs text-gray-500 text-left">{bandwidthPercentage.toFixed(1)}% مستهلك</p>
          </div>

        </div>
      </div>
    </div>
  );
}

function StatCard({ title, value, icon, color }: { title: string, value: number, icon: React.ReactNode, color: string }) {
  const colorMap: Record<string, string> = {
    blue: "bg-blue-50 text-blue-600 border-blue-100",
    indigo: "bg-indigo-50 text-indigo-600 border-indigo-100",
    emerald: "bg-emerald-50 text-emerald-600 border-emerald-100",
    purple: "bg-purple-50 text-purple-600 border-purple-100",
  };
  
  return (
    <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm flex items-center gap-4 hover:shadow-md transition-shadow">
      <div className={`p-3 rounded-lg border ${colorMap[color] || colorMap.blue}`}>
        {icon}
      </div>
      <div>
        <p className="text-sm text-gray-500 font-medium">{title}</p>
        <p className="text-2xl font-bold text-gray-900 mt-0.5">{value}</p>
      </div>
    </div>
  )
}
