import prisma from '@/lib/prisma'
import ContactClient from './ContactClient'

export default async function Contact() {
  let settings: Awaited<ReturnType<typeof prisma.contactSettings.findUnique>> = null
  try {
    settings = await prisma.contactSettings.findUnique({ where: { id: 'singleton' } })
  } catch (error) {
    console.error('Failed to load contact settings:', error)
  }

  return <ContactClient contactData={settings} />
}
