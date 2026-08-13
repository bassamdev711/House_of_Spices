import AdminSidebar from './components/AdminSidebar'
import AdminHeader from './components/AdminHeader'

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div dir="rtl" className="min-h-screen bg-ivory flex flex-col md:flex-row font-sans text-deep-green">
      <AdminSidebar />

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto w-full relative pb-10">
        <div className="max-w-6xl mx-auto md:px-10">
          <AdminHeader />
          <div className="px-4 md:px-0">
            {children}
          </div>
        </div>
      </main>
    </div>
  )
}
