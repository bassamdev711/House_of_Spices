import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('Fixing broken Unsplash images...')

  const fixes = [
    {
      broken: 'https://images.unsplash.com/photo-1532336414038-cb11d7c352de?w=800&q=80',
      fixed: 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=800&q=80'
    },
    {
      broken: 'https://images.unsplash.com/photo-1615486171448-4fb324681140?w=800&q=80',
      fixed: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=800&q=80'
    },
    {
      broken: 'https://images.unsplash.com/photo-1550255375-73130c2794eb?w=800&q=80',
      fixed: 'https://images.unsplash.com/photo-1628151015968-3a4429e9ef04?w=800&q=80'
    }
  ]

  for (const { broken, fixed } of fixes) {
    const colCount = await prisma.collection.updateMany({
      where: { imageUrl: broken },
      data: { imageUrl: fixed }
    })
    console.log(`Updated ${colCount.count} collections.`)

    const prodCount = await prisma.product.updateMany({
      where: { imageUrl: broken },
      data: { imageUrl: fixed }
    })
    console.log(`Updated ${prodCount.count} products.`)
  }

  console.log('Done fixing images!')
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
