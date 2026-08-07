import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('Start seeding...')

  const testProducts = [
    {
      name: 'عطر يوري بلاك (YURI BLACK)',
      slug: 'yuri-black-parfum',
      brand: 'YURI',
      description: 'عطر يوري بلاك المميز برائحة العود الفاخر والتوابل الشرقية.',
      price: 15000,
      stock: 50,
      isActive: true,
      category: 'Parfum',
      gender: 'Unisex',
      size: '100ml',
      featured: true,
      bestseller: true,
    },
    {
      name: 'عطر يوري وايت (YURI WHITE)',
      slug: 'yuri-white-parfum',
      brand: 'YURI',
      description: 'عطر يوري وايت برائحة الزهور البيضاء والمسك.',
      price: 12000,
      stock: 30,
      isActive: true,
      category: 'Parfum',
      gender: 'Women',
      size: '50ml',
      featured: false,
      bestseller: false,
    },
    {
      name: 'عطر يوري سبورت (YURI SPORT)',
      slug: 'yuri-sport-parfum',
      brand: 'YURI',
      description: 'عطر منعش برائحة الحمضيات والأخشاب.',
      price: 13500,
      stock: 100,
      isActive: true,
      category: 'Eau de Toilette',
      gender: 'Men',
      size: '100ml',
      featured: true,
      bestseller: false,
    },
    {
      name: 'عطر يوري جولد (YURI GOLD)',
      slug: 'yuri-gold-parfum',
      brand: 'YURI',
      description: 'عطر فاخر برائحة الزعفران والعنبر.',
      price: 25000,
      stock: 10,
      isActive: true,
      category: 'Parfum',
      gender: 'Unisex',
      size: '100ml',
      featured: true,
      bestseller: true,
    },
    {
      name: 'عطر يوري كلاسيك (YURI CLASSIC)',
      slug: 'yuri-classic-parfum',
      brand: 'YURI',
      description: 'رائحة كلاسيكية تجمع بين خشب الصندل والورد.',
      price: 11000,
      stock: 25,
      isActive: true,
      category: 'Parfum',
      gender: 'Unisex',
      size: '100ml',
      featured: false,
      bestseller: false,
    }
  ]

  for (const product of testProducts) {
    const createdProduct = await prisma.product.upsert({
      where: { slug: product.slug },
      update: {},
      create: product,
    })
    console.log(`Created product with id: ${createdProduct.id}`)
  }
  
  console.log('Seeding finished.')
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
