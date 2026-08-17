import { PrismaClient } from '@prisma/client';

if (process.env.NODE_ENV === 'production' || process.env.ALLOW_DESTRUCTIVE_SEED !== 'true') {
  throw new Error('Destructive seed is disabled. Set ALLOW_DESTRUCTIVE_SEED=true only in a disposable database.')
}

const prisma = new PrismaClient();

async function main() {
  console.log('Clearing old demo data...')
  await prisma.review.deleteMany()
  await prisma.productVariant.deleteMany()
  await prisma.product.deleteMany()
  await prisma.collection.deleteMany()

  console.log('Seeding 10 Collections and 100 Products...')

  const collectionsData = [
    { name: 'بهارات حب', slug: 'whole-spices', img: 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=800&q=80' },
    { name: 'بهارات مطحونة', slug: 'ground-spices', img: 'https://images.unsplash.com/photo-1628151015968-3a4429e9ef04?w=800&q=80' },
    { name: 'خلطات الشواء', slug: 'bbq-mixes', img: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=800&q=80' },
    { name: 'أعشاب طبيعية', slug: 'natural-herbs', img: 'https://images.unsplash.com/photo-1466637574441-749b8f19452f?w=800&q=80' },
    { name: 'بهارات هندية', slug: 'indian-spices', img: 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=800&q=80' },
    { name: 'بهارات عربية', slug: 'arabic-spices', img: 'https://images.unsplash.com/photo-1532336414038-cb11d7c352de?w=800&q=80' },
    { name: 'زعفران فاخر', slug: 'premium-saffron', img: 'https://images.unsplash.com/photo-1588195538326-c5b1e9f80a1b?w=800&q=80' },
    { name: 'بدائل صحية', slug: 'healthy-alternatives', img: 'https://images.unsplash.com/photo-1509358271058-acd22cc93898?w=800&q=80' },
    { name: 'بهارات القهوة والشاي', slug: 'coffee-tea-spices', img: 'https://images.unsplash.com/photo-1615486171448-4fb324681140?w=800&q=80' },
    { name: 'توابل عالمية', slug: 'global-spices', img: 'https://images.unsplash.com/photo-1550255375-73130c2794eb?w=800&q=80' }
  ];

  const reviewPhrases = [
    "جودة ممتازة جداً!",
    "رائحة البهارات قوية وطازجة.",
    "التغليف رائع وسرعة في التوصيل.",
    "أعطى للأكل طعم مختلف تماماً، شكراً لكم.",
    "لا يمكن الاستغناء عنه في المطبخ.",
    "بهارات طبيعية 100% أنصح بالتعامل معهم.",
    "السعر مناسب جداً مقارنة بالجودة العالية.",
    "تجربة شراء ممتازة وسأكررها بالتأكيد."
  ];

  for (const collData of collectionsData) {
    const collection = await prisma.collection.create({
      data: {
        name: collData.name,
        slug: collData.slug,
        description: `مجموعة مختارة من أفضل ${collData.name} الطبيعية 100%، مستوردة من أفضل المزارع حول العالم.`,
        imageUrl: collData.img,
        isActive: true,
      }
    });

    console.log(`Created collection: ${collection.name}`);

    // Create 10 products for this collection
    for (let i = 1; i <= 10; i++) {
      const productSlug = `${collData.slug}-product-${i}`;
      const originalPrice = Math.floor(Math.random() * 8000) + 2000; // Between 2000 and 10000
      const hasDiscount = Math.random() > 0.6; // 40% chance of discount
      const price = hasDiscount ? originalPrice - 1000 : originalPrice;

      const product = await prisma.product.create({
        data: {
          name: `${collData.name} - صنف فاخر ${i}`,
          slug: productSlug,
          brand: 'بيت البهارات',
          description: `هذا المنتج من قسم ${collData.name} يتميز بالجودة الفائقة والنكهة الأصلية التي ستضفي على أطباقك طعماً لا ينسى. تم اختيار هذه البهارات بعناية فائقة وتجفيفها بطرق طبيعية للحفاظ على الزيوت العطرية بداخلها.`,
          price: price,
          compareAtPrice: hasDiscount ? originalPrice : null,
          stock: Math.floor(Math.random() * 100) + 10,
          isActive: true,
          category: collData.name,
          collectionId: collection.id,
          size: i % 2 === 0 ? '500g' : '250g',
          featured: i <= 2, // First 2 of each collection are featured
          bestseller: i === 1 || i === 3,
          imageUrl: collData.img,
        }
      });

      // Add 2 random reviews to the product
      for (let r = 0; r < 2; r++) {
        const randomReview = reviewPhrases[Math.floor(Math.random() * reviewPhrases.length)];
        await prisma.review.create({
          data: {
            name: `عميل ${Math.floor(Math.random() * 1000)}`,
            content: randomReview,
            rating: Math.floor(Math.random() * 2) + 4, // 4 or 5 stars
            status: "APPROVED",
            isGlobal: true,
            productId: product.id
          }
        });
      }
    }
  }
  
  console.log('Seeding finished successfully. Created 10 Collections and 100 Products with Reviews!')
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
