import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('Start seeding...')

  const testProducts = [
    {
      name: 'الزعفران الفاخر (Super Negin)',
      slug: 'premium-saffron',
      brand: 'بيت البهارات',
      description: 'زعفران طبيعي نقي 100% من أجود المزارع، يمنح أطباقك لوناً ذهبياً ونكهة مميزة.',
      price: 25000,
      stock: 50,
      isActive: true,
      category: 'بهارات فاخرة',
      gender: 'Unisex', // Could be removed, but kept for schema compatibility
      size: '5g',
      featured: true,
      bestseller: true,
    },
    {
      name: 'هيل هندي أخضر (Jumbo)',
      slug: 'indian-green-cardamom',
      brand: 'بيت البهارات',
      description: 'حبوب الهيل الهندي الأخضر الفاخر، يتميز بنكهة قوية ورائحة زكية للقهوة والأطباق.',
      price: 12000,
      stock: 100,
      isActive: true,
      category: 'بهارات حب',
      gender: 'Unisex',
      size: '250g',
      featured: true,
      bestseller: true,
    },
    {
      name: 'كمون بلدي مطحون',
      slug: 'ground-cumin',
      brand: 'بيت البهارات',
      description: 'كمون بلدي مطحون طازج يتميز برائحته القوية والنفاذة، أساسي في المطبخ الشرقي.',
      price: 3500,
      stock: 200,
      isActive: true,
      category: 'بهارات مطحونة',
      gender: 'Unisex',
      size: '500g',
      featured: false,
      bestseller: true,
    },
    {
      name: 'قرفة سيلانية (أعواد)',
      slug: 'ceylon-cinnamon-sticks',
      brand: 'بيت البهارات',
      description: 'أعواد قرفة سيلانية أصلية تتميز بطعم حلو وخفيف ورائحة زكية غنية.',
      price: 8500,
      stock: 150,
      isActive: true,
      category: 'أعشاب وتوابل',
      gender: 'Unisex',
      size: '200g',
      featured: true,
      bestseller: false,
    },
    {
      name: 'خلطة بهارات الشواء السحرية',
      slug: 'magic-bbq-mix',
      brand: 'بيت البهارات',
      description: 'خلطة متوازنة من التوابل الطبيعية المخصصة لتتبيل اللحوم والدجاج للحصول على طعم شواء مثالي.',
      price: 5500,
      stock: 80,
      isActive: true,
      category: 'خلطات خاصة',
      gender: 'Unisex',
      size: '300g',
      featured: true,
      bestseller: true,
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
