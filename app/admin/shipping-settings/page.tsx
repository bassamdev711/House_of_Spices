import { getStoreSettings } from './actions'
import ShippingSettingsClient from './ShippingSettingsClient'

export const dynamic = 'force-dynamic'

export default async function ShippingSettingsPage() {
  const settings = await getStoreSettings()
  
  // Convert Decimals to numbers for client component
  const cleanSettings = {
    shippingFee: Number(settings.shippingFee),
    freeShippingThreshold: Number(settings.freeShippingThreshold),
    showShippingInFooter: settings.showShippingInFooter,
    showReturnInFooter: settings.showReturnInFooter,
    shippingPolicyContent: settings.shippingPolicyContent || '',
    returnPolicyContent: settings.returnPolicyContent || '',
  }

  return <ShippingSettingsClient initialSettings={cleanSettings} />
}
