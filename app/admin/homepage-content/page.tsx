import React from 'react'
import { Metadata } from 'next'
import AdminSidebar from '../components/AdminSidebar'
import HomepageContentClient from './HomepageContentClient'
import { getHomepageSettings } from '@/app/actions/homepage'

export const metadata: Metadata = {
  title: 'إدارة محتوى الرئيسية | لوحة التحكم',
}

export const dynamic = 'force-dynamic'

export default async function AdminHomepageContentPage() {
  const { data: settings } = await getHomepageSettings()

  return (
    <main className="min-h-screen bg-[#f3f4f6] font-sans flex" dir="rtl">
      <AdminSidebar />
      <div className="flex-1 p-8 md:mr-64 transition-all duration-300">
        <HomepageContentClient initialData={settings} />
      </div>
    </main>
  )
}
