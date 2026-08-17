import 'dotenv/config'
if (!process.env.POSTGRES_URL && process.env.DIRECT_URL) {
  process.env.POSTGRES_URL = process.env.DIRECT_URL
}

if (process.env.NODE_ENV === 'production' || process.env.ALLOW_DESTRUCTIVE_SEED !== 'true') {
  throw new Error('Destructive seed is disabled. Set ALLOW_DESTRUCTIVE_SEED=true only in a disposable database.')
}
import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

async function main() {
  console.log('Clearing existing data...')
  await prisma.orderItem.deleteMany()
  await prisma.review.deleteMany()
  await prisma.productVariant.deleteMany()
  await prisma.product.deleteMany()
  await prisma.collection.deleteMany()

  console.log('Setting currency to ر.ي...')
  await prisma.paymentSettings.upsert({
    where: { id: 'singleton' },
    update: { currency: 'ر.ي' },
    create: { id: 'singleton', currency: 'ر.ي' }
  })

  console.log('Creating Collections (Categories)...')
  const groundSpices = await prisma.collection.create({
    data: {
      name: 'بهارات مطحونة',
      slug: 'ground-spices',
      description: 'مجموعة من البهارات المطحونة الجاهزة لإضافة نكهة قوية لأطباقك.',
      imageUrl: 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?q=80&w=600&auto=format&fit=crop',
      isActive: true,
    }
  })

  const wholeSpices = await prisma.collection.create({
    data: {
      name: 'بهارات حب',
      slug: 'whole-spices',
      description: 'بهارات وتوابل حب تحتفظ بنكهتها الأصلية وزيوتها العطرية الطبيعية.',
      imageUrl: 'https://images.unsplash.com/photo-1621236378699-859ffafacd90?q=80&w=600&auto=format&fit=crop',
      isActive: true,
    }
  })

  const mixes = await prisma.collection.create({
    data: {
      name: 'خلطات خاصة',
      slug: 'special-mixes',
      description: 'توليفات بيت البهارات السرية لمختلف أنواع الطبخ، من الشواء إلى الكبسة.',
      imageUrl: 'https://images.unsplash.com/photo-1506377247377-2a5b3b417ebb?q=80&w=600&auto=format&fit=crop',
      isActive: true,
    }
  })

  const herbs = await prisma.collection.create({
    data: {
      name: 'أعشاب طبيعية',
      slug: 'natural-herbs',
      description: 'أجود أنواع الأعشاب الطبيعية المفيدة والمجففة بعناية.',
      imageUrl: 'https://images.unsplash.com/photo-1515589654462-81e0129fd30b?q=80&w=600&auto=format&fit=crop',
      isActive: true,
    }
  })

  console.log('Creating Products...')
  await prisma.product.create({
    data: {
      name: 'كمون بلدي مطحون',
      slug: 'ground-cumin-premium',
      description: 'كمون بلدي ذو جودة عالية ورائحة نفاذة، لا غنى عنه في كل مطبخ.',
      price: 3500,
      compareAtPrice: 4000,
      collectionId: groundSpices.id,
      stock: 100,
      isActive: true,
      featured: true,
      bestseller: true,
      imageUrl: 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?q=80&w=800&auto=format&fit=crop',
      images: [
        'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?q=80&w=800&auto=format&fit=crop'
      ]
    }
  })

  await prisma.product.create({
    data: {
      name: 'بهارات الكبسة السعودية',
      slug: 'kabsa-mix',
      description: 'خلطة متكاملة لعمل ألذ كبسة بلحم أو دجاج مع ضمان الطعم الأصيل.',
      price: 4500,
      compareAtPrice: 5500,
      collectionId: mixes.id,
      stock: 80,
      isActive: true,
      featured: true,
      imageUrl: 'https://images.unsplash.com/photo-1506377247377-2a5b3b417ebb?q=80&w=800&auto=format&fit=crop',
      images: [
        'https://images.unsplash.com/photo-1506377247377-2a5b3b417ebb?q=80&w=800&auto=format&fit=crop'
      ]
    }
  })

  await prisma.product.create({
    data: {
      name: 'هيل هندي أخضر',
      slug: 'indian-cardamom-whole',
      description: 'حبوب الهيل الأخضر الهندي المنتقاة بعناية لتعطير القهوة والحلويات.',
      price: 15000,
      compareAtPrice: 18000,
      collectionId: wholeSpices.id,
      stock: 50,
      isActive: true,
      bestseller: true,
      imageUrl: 'https://images.unsplash.com/photo-1621236378699-859ffafacd90?q=80&w=800&auto=format&fit=crop',
      images: [
        'https://images.unsplash.com/photo-1621236378699-859ffafacd90?q=80&w=800&auto=format&fit=crop'
      ]
    }
  })

  await prisma.product.create({
    data: {
      name: 'زعتر بري سوري',
      slug: 'syrian-thyme',
      description: 'زعتر بري طبيعي يتميز بنكهة حادة وزكية، مفيد جداً للمشروبات والمعجنات.',
      price: 6000,
      compareAtPrice: 7000,
      collectionId: herbs.id,
      stock: 120,
      isActive: true,
      featured: true,
      imageUrl: 'https://images.unsplash.com/photo-1515589654462-81e0129fd30b?q=80&w=800&auto=format&fit=crop',
      images: [
        'https://images.unsplash.com/photo-1515589654462-81e0129fd30b?q=80&w=800&auto=format&fit=crop'
      ]
    }
  })

  await prisma.product.create({
    data: {
      name: 'الزعفران الفاخر (Super Negin)',
      slug: 'saffron-premium',
      description: 'أجود أنواع الزعفران الطبيعي للقهوة والطبخ والمشروبات، يمنح لوناً ونكهة لا تُنسى.',
      price: 25000,
      compareAtPrice: 30000,
      collectionId: wholeSpices.id,
      stock: 30,
      isActive: true,
      imageUrl: 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?q=80&w=800&auto=format&fit=crop',
      images: [
        'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?q=80&w=800&auto=format&fit=crop'
      ]
    }
  })

  console.log('Seeding completed successfully!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
