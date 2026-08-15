import SetupClient from './SetupClient'

export const metadata = {
  title: 'تهيئة لوحة التحكم - بيت البهارات',
}

export default function SetupPage() {
  return (
    <div className="min-h-screen pt-4 pb-20">
      <SetupClient />
    </div>
  )
}
