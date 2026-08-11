import { getBrandingSettings } from './actions'
import BrandingClient from './BrandingClient'

export const dynamic = 'force-dynamic'

export default async function BrandingPage() {
  const res = await getBrandingSettings()
  const settings = res.success ? res.settings : null

  return (
    <BrandingClient 
      initial={{
        ogImageUrl: settings?.ogImageUrl ?? null,
        faviconUrl: settings?.faviconUrl ?? null,
        storeUrl: settings?.storeUrl ?? null,
        storeName: settings?.storeName ?? null,
      }} 
    />
  )
}
