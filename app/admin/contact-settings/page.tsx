import { getContactSettings } from './actions'
import ContactSettingsClient from './ContactSettingsClient'

export const metadata = {
  title: 'إعدادات التواصل | لوحة تحكم بيت البهارات',
}

export default async function ContactSettingsPage() {
  const result = await getContactSettings()
  const initialData = result.success ? result.data : null

  return <ContactSettingsClient initialData={initialData as any} />
}
