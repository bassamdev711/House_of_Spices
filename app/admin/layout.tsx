import AdminSidebar from './components/AdminSidebar'

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div dir="rtl" className="min-h-screen bg-ivory flex flex-col md:flex-row font-sans text-deep-green">
      <AdminSidebar />

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto w-full">
        <div className="p-4 md:p-10 max-w-6xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  )
}
