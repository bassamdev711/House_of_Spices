import prisma from '@/lib/prisma'
import ContactClient from './ContactClient'

export default async function Contact() {
  const settings = await prisma.contactSettings.findUnique({
    where: { id: 'singleton' }
  })

  return <ContactClient contactData={settings} />
}
