import { PrismaClient } from '@prisma/client';

if (process.env.NODE_ENV === 'production' || process.env.ALLOW_DESTRUCTIVE_SEED !== 'true') {
  throw new Error('Destructive seed is disabled. Set ALLOW_DESTRUCTIVE_SEED=true only in a disposable database.')
}

const prisma = new PrismaClient();

const imageBank = {
  whole: 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=1000&q=85',
  ground: 'https://images.unsplash.com/photo-1628151015968-3a4429e9ef04?w=1000&q=85',
  bbq: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=1000&q=85',
  herbs: 'https://images.unsplash.com/photo-1466637574441-749b8f19452f?w=1000&q=85',
  indian: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=1000&q=85',
  arabic: 'https://images.unsplash.com/photo-1532336414038-cb11d7c352de?w=1000&q=85',
  saffron: 'https://images.unsplash.com/photo-1588195538326-c5b1e9f80a1b?w=1000&q=85',
  tea: 'https://images.unsplash.com/photo-1615486171448-4fb324681140?w=1000&q=85',
  blends: 'https://images.unsplash.com/photo-1550255375-73130c2794eb?w=1000&q=85',
  yemeni: 'https://images.unsplash.com/photo-1547592180-85f173990554?w=1000&q=85',
} as const;

type ProductSeed = {
  name: string;
  slug: string;
  collectionSlug: string;
  category: string;
  description: string;
  price: number;
  compareAtPrice?: number;
  size: string;
  unit: string;
  image: string;
  sku: string;
  stock: number;
  featured?: boolean;
  bestseller?: boolean;
  seoSearchPhrases: string[];
  variants?: Array<{ size: string; unit: string; price: number; compareAtPrice?: number; stock: number }>;
};

const collectionsData = [
  {
    name: 'بهارات حب',
    slug: 'whole-spices',
    image: imageBank.whole,
    description: 'حبوب بهارات كاملة تحفظ الرائحة والزيوت العطرية، مناسبة للطحن والتحميص والطبخ اليومي.',
    seoSearchPhrases: ['بهارات حب', 'توابل كاملة', 'حبوب بهارات', 'بهارات للتحميص'],
  },
  {
    name: 'بهارات مطحونة',
    slug: 'ground-spices',
    image: imageBank.ground,
    description: 'بهارات مطحونة ناعماً للاستخدام اليومي في الأرز والمرق والمشاوي والمخبوزات.',
    seoSearchPhrases: ['بهارات مطحونة', 'توابل مطحونة', 'بهارات الطبخ اليومية'],
  },
  {
    name: 'خلطات التوابل',
    slug: 'spice-blends',
    image: imageBank.blends,
    description: 'خلطات متوازنة تجمع عدة توابل بنسب عملية لتسهيل إعداد الأطباق العربية واليومية.',
    seoSearchPhrases: ['خلطات توابل', 'خلطات بهارات', 'بهارات مشكلة', 'خلطات الطبخ'],
  },
  {
    name: 'خلطات الشواء',
    slug: 'bbq-mixes',
    image: imageBank.bbq,
    description: 'تتبيلات جاهزة للحوم والدجاج والبرجر والبطاطس، بنكهة مناسبة للشواء والفرن.',
    seoSearchPhrases: ['بهارات الشواء', 'تتبيلة لحم', 'تتبيلة دجاج', 'بهارات برجر'],
  },
  {
    name: 'بهارات الشاي والقهوة',
    slug: 'coffee-tea-spices',
    image: imageBank.tea,
    description: 'إضافات وخلطات عربية للشاي والقهوة تمنح المشروب رائحة دافئة وطعماً متوازناً.',
    seoSearchPhrases: ['بهارات الشاي', 'بهارات القهوة', 'هيل القهوة', 'شاي عدني', 'قهوة عربية'],
  },
  {
    name: 'أعشاب طبيعية',
    slug: 'natural-herbs',
    image: imageBank.herbs,
    description: 'أعشاب مجففة للاستخدام في الطبخ والتتبيل والمشروبات العشبية.',
    seoSearchPhrases: ['أعشاب طبيعية', 'أعشاب مجففة', 'زعتر', 'نعناع مجفف', 'ورق غار'],
  },
  {
    name: 'بهارات عربية',
    slug: 'arabic-spices',
    image: imageBank.arabic,
    description: 'نكهات عربية مألوفة للمندي والكبسة والمرق والأرز والأطباق المنزلية.',
    seoSearchPhrases: ['بهارات عربية', 'بهارات كبسة', 'بهارات مندي', 'توابل عربية'],
  },
  {
    name: 'بهارات هندية',
    slug: 'indian-spices',
    image: imageBank.indian,
    description: 'توابل هندية وخلطات ماسالا مناسبة للكاري والأرز والدجاج والأطباق المتبلة.',
    seoSearchPhrases: ['بهارات هندية', 'ماسالا', 'كاري', 'بهارات تندوري'],
  },
  {
    name: 'زعفران فاخر',
    slug: 'premium-saffron',
    image: imageBank.saffron,
    description: 'خيوط زعفران مختارة للضيافة والقهوة والأرز والحلويات، بأحجام مناسبة للاستخدام المنزلي.',
    seoSearchPhrases: ['زعفران فاخر', 'خيوط زعفران', 'زعفران للقهوة', 'زعفران للرز'],
  },
  {
    name: 'خلطات يمنية',
    slug: 'yemeni-blends',
    image: imageBank.yemeni,
    description: 'خلطات مستوحاة من المطبخ اليمني للسلتة والشفوت والمرق والمندي والأطباق المنزلية.',
    seoSearchPhrases: ['بهارات يمنية', 'خلطات يمنية', 'بهارات السلتة', 'بهارات الشفوت', 'بهارات المندي اليمني'],
  },
];

const products: ProductSeed[] = [
  {
    name: 'هيل أخضر فاخر', slug: 'premium-green-cardamom', collectionSlug: 'whole-spices', category: 'بهارات حب',
    description: 'حبات هيل خضراء عطرية للقهوة العربية والشاي والحلويات، مختارة برائحة واضحة.', price: 1800, compareAtPrice: 2200,
    size: '50', unit: 'جرام', image: imageBank.whole, sku: 'HOS-WHOLE-001', stock: 38, featured: true, bestseller: true,
    seoSearchPhrases: ['هيل أخضر', 'هيل للقهوة', 'حبهان', 'بهارات القهوة'],
    variants: [{ size: '100', unit: 'جرام', price: 3200, compareAtPrice: 3800, stock: 22 }],
  },
  {
    name: 'فلفل أسود حب', slug: 'whole-black-pepper', collectionSlug: 'whole-spices', category: 'بهارات حب',
    description: 'فلفل أسود كامل بطعم قوي، مناسب للطحن عند الاستخدام ولتتبيل اللحوم والمرق.', price: 900,
    size: '100', unit: 'جرام', image: imageBank.whole, sku: 'HOS-WHOLE-002', stock: 46, bestseller: true,
    seoSearchPhrases: ['فلفل أسود حب', 'فلفل كامل', 'توابل اللحوم'],
    variants: [{ size: '250', unit: 'جرام', price: 2000, stock: 18 }],
  },
  {
    name: 'كمون حب', slug: 'whole-cumin-seeds', collectionSlug: 'whole-spices', category: 'بهارات حب',
    description: 'كمون حب برائحة دافئة، يحمص أو يطحن لإضافة نكهة أصيلة للأرز والمرق والسلطات.', price: 750,
    size: '100', unit: 'جرام', image: imageBank.whole, sku: 'HOS-WHOLE-003', stock: 52,
    seoSearchPhrases: ['كمون حب', 'حب الكمون', 'كمون للتحميص'],
  },
  {
    name: 'كزبرة حب', slug: 'whole-coriander-seeds', collectionSlug: 'whole-spices', category: 'بهارات حب',
    description: 'بذور كزبرة كاملة للطبخ والخلطات المنزلية، بطعم خفيف ورائحة منعشة.', price: 650,
    size: '100', unit: 'جرام', image: imageBank.whole, sku: 'HOS-WHOLE-004', stock: 40,
    seoSearchPhrases: ['كزبرة حب', 'بذور كزبرة', 'توابل المرق'],
  },
  {
    name: 'قرنفل حب', slug: 'whole-cloves', collectionSlug: 'whole-spices', category: 'بهارات حب',
    description: 'قرنفل كامل للشاي والقهوة والمرق والحلويات، بكمية مركزة ورائحة دافئة.', price: 950,
    size: '50', unit: 'جرام', image: imageBank.whole, sku: 'HOS-WHOLE-005', stock: 27,
    seoSearchPhrases: ['قرنفل حب', 'قرنفل للشاي', 'بهارات القهوة'],
  },

  {
    name: 'كمون مطحون ناعم', slug: 'ground-cumin', collectionSlug: 'ground-spices', category: 'بهارات مطحونة',
    description: 'كمون مطحون للاستخدام اليومي في المرق والسلطات واللحوم والصلصات.', price: 700,
    size: '100', unit: 'جرام', image: imageBank.ground, sku: 'HOS-GROUND-001', stock: 65, featured: true,
    seoSearchPhrases: ['كمون مطحون', 'بهارات السلطة', 'توابل المرق'],
    variants: [{ size: '250', unit: 'جرام', price: 1500, stock: 30 }],
  },
  {
    name: 'فلفل أسود مطحون', slug: 'ground-black-pepper', collectionSlug: 'ground-spices', category: 'بهارات مطحونة',
    description: 'فلفل أسود مطحون حديثاً لنكهة واضحة في الشوربات واللحوم والبيض.', price: 850,
    size: '100', unit: 'جرام', image: imageBank.ground, sku: 'HOS-GROUND-002', stock: 49, bestseller: true,
    seoSearchPhrases: ['فلفل أسود مطحون', 'فلفل للطبخ', 'بهارات الشوربة'],
  },
  {
    name: 'كركم مطحون', slug: 'ground-turmeric', collectionSlug: 'ground-spices', category: 'بهارات مطحونة',
    description: 'كركم بلون ذهبي للاستخدام في الأرز والمرق والدجاج والخلطات اليومية.', price: 600,
    size: '100', unit: 'جرام', image: imageBank.ground, sku: 'HOS-GROUND-003', stock: 58,
    seoSearchPhrases: ['كركم مطحون', 'كركم للرز', 'توابل الدجاج'],
  },
  {
    name: 'قرفة مطحونة', slug: 'ground-cinnamon', collectionSlug: 'ground-spices', category: 'بهارات مطحونة',
    description: 'قرفة مطحونة للشاي والقهوة والحلويات والأرز، برائحة حلوة ودافئة.', price: 800,
    size: '100', unit: 'جرام', image: imageBank.ground, sku: 'HOS-GROUND-004', stock: 34,
    seoSearchPhrases: ['قرفة مطحونة', 'قرفة للشاي', 'بهارات الحلويات'],
  },
  {
    name: 'بابريكا حلوة', slug: 'sweet-paprika', collectionSlug: 'ground-spices', category: 'بهارات مطحونة',
    description: 'بابريكا حلوة بلون غني لتتبيل الدجاج والبطاطس والصلصات والمشاوي.', price: 750,
    size: '100', unit: 'جرام', image: imageBank.ground, sku: 'HOS-GROUND-005', stock: 41,
    seoSearchPhrases: ['بابريكا', 'بابريكا حلوة', 'بهارات البطاطس'],
  },

  {
    name: 'سبع بهارات شامية', slug: 'seven-spice-blend', collectionSlug: 'spice-blends', category: 'خلطات التوابل',
    description: 'خلطة متوازنة من التوابل العطرية للحوم والكفتة والمرق والأرز.', price: 950,
    size: '100', unit: 'جرام', image: imageBank.blends, sku: 'HOS-BLEND-001', stock: 44, featured: true, bestseller: true,
    seoSearchPhrases: ['سبع بهارات', 'بهارات شامية', 'خلطة اللحم'],
    variants: [{ size: '250', unit: 'جرام', price: 2100, stock: 20 }],
  },
  {
    name: 'بهارات كبسة', slug: 'kabsa-spice-blend', collectionSlug: 'spice-blends', category: 'خلطات التوابل',
    description: 'خلطة كبسة عربية للأرز واللحم أو الدجاج، بنكهة دافئة مناسبة للطبخ المنزلي.', price: 1000,
    size: '100', unit: 'جرام', image: imageBank.arabic, sku: 'HOS-BLEND-002', stock: 51, bestseller: true,
    seoSearchPhrases: ['بهارات كبسة', 'خلطة كبسة', 'بهارات الأرز'],
  },
  {
    name: 'بهارات مندي', slug: 'mandi-spice-blend', collectionSlug: 'spice-blends', category: 'خلطات التوابل',
    description: 'خلطة مندي بنكهة مدخنة خفيفة للأرز واللحم والدجاج، مناسبة للفرن أو الطبخ المنزلي.', price: 1100,
    size: '100', unit: 'جرام', image: imageBank.arabic, sku: 'HOS-BLEND-003', stock: 33,
    seoSearchPhrases: ['بهارات مندي', 'خلطة مندي', 'بهارات الدجاج'],
  },
  {
    name: 'خلطة مرق يومية', slug: 'daily-broth-spice-blend', collectionSlug: 'spice-blends', category: 'خلطات التوابل',
    description: 'خلطة عملية للشوربات والمرق والخضار، تساعد على إضافة نكهة متوازنة بسرعة.', price: 850,
    size: '100', unit: 'جرام', image: imageBank.blends, sku: 'HOS-BLEND-004', stock: 47,
    seoSearchPhrases: ['بهارات المرق', 'خلطة الشوربة', 'بهارات الخضار'],
  },
  {
    name: 'خلطة دجاج بالليمون', slug: 'lemon-chicken-seasoning', collectionSlug: 'spice-blends', category: 'خلطات التوابل',
    description: 'تتبيلة دجاج بنكهة حمضية عطرية للفرن والشواية والوجبات السريعة في المنزل.', price: 900,
    size: '100', unit: 'جرام', image: imageBank.blends, sku: 'HOS-BLEND-005', stock: 29,
    seoSearchPhrases: ['بهارات الدجاج', 'تتبيلة دجاج', 'دجاج بالليمون'],
  },

  {
    name: 'تتبيلة لحم مشوي', slug: 'grilled-meat-seasoning', collectionSlug: 'bbq-mixes', category: 'خلطات الشواء',
    description: 'خلطة مركزة للحوم المشوية والكباب والكفتة، بطعم غني دون أن تطغى على اللحم.', price: 1050,
    size: '100', unit: 'جرام', image: imageBank.bbq, sku: 'HOS-BBQ-001', stock: 36, featured: true, bestseller: true,
    seoSearchPhrases: ['تتبيلة لحم', 'بهارات اللحم المشوي', 'بهارات الكباب'],
    variants: [{ size: '250', unit: 'جرام', price: 2300, stock: 16 }],
  },
  {
    name: 'تتبيلة دجاج مشوي', slug: 'grilled-chicken-seasoning', collectionSlug: 'bbq-mixes', category: 'خلطات الشواء',
    description: 'خلطة للشواء والفرن تمنح الدجاج لوناً ونكهة متوازنة مع رائحة التوابل المحمصة.', price: 950,
    size: '100', unit: 'جرام', image: imageBank.bbq, sku: 'HOS-BBQ-002', stock: 42,
    seoSearchPhrases: ['تتبيلة دجاج مشوي', 'بهارات الدجاج المشوي', 'خلطة الشواية'],
  },
  {
    name: 'بهارات برجر', slug: 'burger-seasoning', collectionSlug: 'bbq-mixes', category: 'خلطات الشواء',
    description: 'خلطة خاصة للبرجر واللحم المفروم، مناسبة للبيت والمطاعم الصغيرة.', price: 900,
    size: '100', unit: 'جرام', image: imageBank.bbq, sku: 'HOS-BBQ-003', stock: 31,
    seoSearchPhrases: ['بهارات برجر', 'خلطة برجر', 'توابل اللحم المفروم'],
  },
  {
    name: 'بهارات بطاطس', slug: 'crispy-potato-seasoning', collectionSlug: 'bbq-mixes', category: 'خلطات الشواء',
    description: 'خلطة خفيفة للبطاطس المقلية والمشوية، بلون ونكهة مناسبة للوجبات الخفيفة.', price: 700,
    size: '100', unit: 'جرام', image: imageBank.bbq, sku: 'HOS-BBQ-004', stock: 53,
    seoSearchPhrases: ['بهارات البطاطس', 'توابل البطاطس', 'بهارات الوجبات الخفيفة'],
  },

  {
    name: 'هيل مطحون للقهوة', slug: 'ground-cardamom-for-coffee', collectionSlug: 'coffee-tea-spices', category: 'بهارات الشاي والقهوة',
    description: 'هيل مطحون ناعم للقهوة العربية، بكمية مناسبة للاستخدام اليومي والضيافة.', price: 1700,
    size: '50', unit: 'جرام', image: imageBank.tea, sku: 'HOS-TEA-001', stock: 25, featured: true, bestseller: true,
    seoSearchPhrases: ['هيل مطحون للقهوة', 'بهارات القهوة العربية', 'حبهان مطحون'],
    variants: [{ size: '100', unit: 'جرام', price: 3100, stock: 14 }],
  },
  {
    name: 'خلطة شاي عدني', slug: 'adeni-tea-spice-blend', collectionSlug: 'coffee-tea-spices', category: 'بهارات الشاي والقهوة',
    description: 'خلطة شاي عدني بالقرفة والهيل والقرنفل، مناسبة للشاي بالحليب والضيافة.', price: 950,
    size: '100', unit: 'جرام', image: imageBank.tea, sku: 'HOS-TEA-002', stock: 39, bestseller: true,
    seoSearchPhrases: ['شاي عدني', 'بهارات الشاي العدني', 'خلطة شاي'],
  },
  {
    name: 'قرفة وقرنفل للشاي', slug: 'cinnamon-clove-tea-blend', collectionSlug: 'coffee-tea-spices', category: 'بهارات الشاي والقهوة',
    description: 'خلطة دافئة للشاي الأسود والمشروبات الساخنة، بطعم واضح ورائحة منزلية مألوفة.', price: 800,
    size: '100', unit: 'جرام', image: imageBank.tea, sku: 'HOS-TEA-003', stock: 45,
    seoSearchPhrases: ['بهارات الشاي', 'قرفة وقرنفل', 'توابل المشروبات الساخنة'],
  },
  {
    name: 'زنجبيل للشاي', slug: 'ginger-for-tea', collectionSlug: 'coffee-tea-spices', category: 'بهارات الشاي والقهوة',
    description: 'زنجبيل مجفف مطحون لإضافة حرارة ونكهة منعشة إلى الشاي والمشروبات الشتوية.', price: 850,
    size: '100', unit: 'جرام', image: imageBank.tea, sku: 'HOS-TEA-004', stock: 37,
    seoSearchPhrases: ['زنجبيل للشاي', 'زنجبيل مطحون', 'بهارات الشتاء'],
  },
  {
    name: 'خلطة قهوة عربية', slug: 'arabic-coffee-spice-blend', collectionSlug: 'coffee-tea-spices', category: 'بهارات الشاي والقهوة',
    description: 'خلطة خفيفة للقهوة العربية تجمع الهيل والقرنفل والقرفة بتركيبة مناسبة للضيافة.', price: 1200,
    size: '100', unit: 'جرام', image: imageBank.tea, sku: 'HOS-TEA-005', stock: 28,
    seoSearchPhrases: ['خلطة قهوة عربية', 'بهارات القهوة', 'قهوة بالهيل'],
  },

  {
    name: 'زعتر بري مجفف', slug: 'dried-wild-zaatar', collectionSlug: 'natural-herbs', category: 'أعشاب طبيعية',
    description: 'زعتر بري مجفف للفطور والمناقيش والسلطات، برائحة عشبية واضحة.', price: 900,
    size: '100', unit: 'جرام', image: imageBank.herbs, sku: 'HOS-HERB-001', stock: 41, featured: true,
    seoSearchPhrases: ['زعتر بري', 'زعتر مجفف', 'بهارات الفطور'],
  },
  {
    name: 'ورق غار', slug: 'dried-bay-leaves', collectionSlug: 'natural-herbs', category: 'أعشاب طبيعية',
    description: 'أوراق غار مجففة لإضفاء رائحة عطرية على المرق والأرز واللحوم.', price: 500,
    size: '25', unit: 'جرام', image: imageBank.herbs, sku: 'HOS-HERB-002', stock: 32,
    seoSearchPhrases: ['ورق غار', 'ورق لورا', 'بهارات المرق'],
  },
  {
    name: 'نعناع مجفف', slug: 'dried-mint', collectionSlug: 'natural-herbs', category: 'أعشاب طبيعية',
    description: 'نعناع مجفف للشاي والسلطات والصلصات، بنكهة منعشة وسهلة الاستخدام.', price: 650,
    size: '50', unit: 'جرام', image: imageBank.herbs, sku: 'HOS-HERB-003', stock: 46,
    seoSearchPhrases: ['نعناع مجفف', 'نعناع للشاي', 'أعشاب للشاي'],
  },
  {
    name: 'روزماري مجفف', slug: 'dried-rosemary', collectionSlug: 'natural-herbs', category: 'أعشاب طبيعية',
    description: 'روزماري مجفف للدجاج والبطاطس والمشاوي، برائحة عشبية قوية.', price: 700,
    size: '50', unit: 'جرام', image: imageBank.herbs, sku: 'HOS-HERB-004', stock: 24,
    seoSearchPhrases: ['روزماري', 'إكليل الجبل', 'أعشاب الدجاج'],
  },
  {
    name: 'لومي أسود مجفف', slug: 'dried-black-lime', collectionSlug: 'natural-herbs', category: 'أعشاب طبيعية',
    description: 'لومي أسود مجفف للمرق والكبسة والمندي، بنكهة حمضية عميقة.', price: 850,
    size: '100', unit: 'جرام', image: imageBank.herbs, sku: 'HOS-HERB-005', stock: 35,
    seoSearchPhrases: ['لومي أسود', 'ليمون مجفف', 'بهارات الكبسة'],
  },

  {
    name: 'حبة البركة', slug: 'black-seed', collectionSlug: 'arabic-spices', category: 'بهارات عربية',
    description: 'حبة البركة للاستخدام في المخبوزات والسلطات والوصفات المنزلية.', price: 700,
    size: '100', unit: 'جرام', image: imageBank.arabic, sku: 'HOS-ARABIC-001', stock: 48,
    seoSearchPhrases: ['حبة البركة', 'الحبة السوداء', 'بهارات عربية'],
  },
  {
    name: 'سماق أحمر', slug: 'red-sumac', collectionSlug: 'arabic-spices', category: 'بهارات عربية',
    description: 'سماق بطعم حامض لطيف للسلطات والمشاوي والمناقيش والتتبيلات.', price: 900,
    size: '100', unit: 'جرام', image: imageBank.arabic, sku: 'HOS-ARABIC-002', stock: 29, bestseller: true,
    seoSearchPhrases: ['سماق', 'سماق للسلطة', 'توابل المشاوي'],
  },
  {
    name: 'شطة حمراء مجروشة', slug: 'crushed-red-chili', collectionSlug: 'arabic-spices', category: 'بهارات عربية',
    description: 'شطة حمراء مجروشة لمحبي النكهة الحارة في الصلصات والمشاوي والمرق.', price: 650,
    size: '100', unit: 'جرام', image: imageBank.arabic, sku: 'HOS-ARABIC-003', stock: 43,
    seoSearchPhrases: ['شطة حمراء', 'فلفل مجروش', 'بهارات حارة'],
  },
  {
    name: 'بهارات حارة يمنية', slug: 'yemeni-hot-spice', collectionSlug: 'arabic-spices', category: 'بهارات عربية',
    description: 'خلطة حارة مستوحاة من النكهات اليمنية للمرق واللحوم والصلصات.', price: 850,
    size: '100', unit: 'جرام', image: imageBank.yemeni, sku: 'HOS-ARABIC-004', stock: 26, featured: true,
    seoSearchPhrases: ['بهارات حارة يمنية', 'خلطة حارة', 'توابل يمنية'],
  },
  {
    name: 'كركم يمني', slug: 'yemeni-turmeric', collectionSlug: 'arabic-spices', category: 'بهارات عربية',
    description: 'كركم للاستخدام في الأرز والمرق والدجاج، بلون دافئ ونكهة خفيفة.', price: 600,
    size: '100', unit: 'جرام', image: imageBank.arabic, sku: 'HOS-ARABIC-005', stock: 37,
    seoSearchPhrases: ['كركم يمني', 'بهارات يمنية', 'كركم للرز'],
  },

  {
    name: 'جارام ماسالا', slug: 'garam-masala', collectionSlug: 'indian-spices', category: 'بهارات هندية',
    description: 'خلطة هندية عطرية للكاري والأرز والدجاج والخضار المتبلة.', price: 1100,
    size: '100', unit: 'جرام', image: imageBank.indian, sku: 'HOS-INDIAN-001', stock: 31, featured: true,
    seoSearchPhrases: ['جارام ماسالا', 'بهارات هندية', 'خلطة كاري'],
  },
  {
    name: 'كاري هندي', slug: 'indian-curry-powder', collectionSlug: 'indian-spices', category: 'بهارات هندية',
    description: 'كاري هندي متوازن للصلصات والدجاج والخضار والأرز.', price: 950,
    size: '100', unit: 'جرام', image: imageBank.indian, sku: 'HOS-INDIAN-002', stock: 38,
    seoSearchPhrases: ['كاري هندي', 'بهارات الكاري', 'توابل هندية'],
  },
  {
    name: 'تندوري', slug: 'tandoori-spice', collectionSlug: 'indian-spices', category: 'بهارات هندية',
    description: 'خلطة تندوري للدجاج واللحم، بلون غني ونكهة مناسبة للفرن والشواية.', price: 1000,
    size: '100', unit: 'جرام', image: imageBank.indian, sku: 'HOS-INDIAN-003', stock: 22,
    seoSearchPhrases: ['بهارات تندوري', 'تتبيلة تندوري', 'دجاج هندي'],
  },
  {
    name: 'ماسالا شاي', slug: 'chai-masala', collectionSlug: 'indian-spices', category: 'بهارات هندية',
    description: 'خلطة ماسالا للشاي بالحليب تجمع القرفة والهيل والزنجبيل والقرنفل.', price: 900,
    size: '100', unit: 'جرام', image: imageBank.indian, sku: 'HOS-INDIAN-004', stock: 27,
    seoSearchPhrases: ['ماسالا شاي', 'شاي هندي', 'بهارات الشاي بالحليب'],
  },
  {
    name: 'فلفل كشميري', slug: 'kashmiri-chili', collectionSlug: 'indian-spices', category: 'بهارات هندية',
    description: 'فلفل أحمر بلون غني وحرارة متوسطة للصلصات والأرز والتتبيلات.', price: 950,
    size: '100', unit: 'جرام', image: imageBank.indian, sku: 'HOS-INDIAN-005', stock: 19,
    seoSearchPhrases: ['فلفل كشميري', 'شطة هندية', 'فلفل أحمر هندي'],
  },

  {
    name: 'زعفران إيراني خيوط', slug: 'iranian-saffron-threads', collectionSlug: 'premium-saffron', category: 'زعفران فاخر',
    description: 'خيوط زعفران للاستخدام في الأرز والقهوة والحلويات والضيافة.', price: 4200,
    size: '1', unit: 'جرام', image: imageBank.saffron, sku: 'HOS-SAFFRON-001', stock: 12, featured: true, bestseller: true,
    seoSearchPhrases: ['زعفران إيراني', 'خيوط زعفران', 'زعفران للرز'],
    variants: [{ size: '2', unit: 'جرام', price: 7800, stock: 6 }],
  },
  {
    name: 'زعفران للضيافة', slug: 'hospitality-saffron', collectionSlug: 'premium-saffron', category: 'زعفران فاخر',
    description: 'عبوة صغيرة مناسبة لتقديم الزعفران مع القهوة والحلويات والضيافة.', price: 2600,
    size: '1', unit: 'جرام', image: imageBank.saffron, sku: 'HOS-SAFFRON-002', stock: 15,
    seoSearchPhrases: ['زعفران للضيافة', 'زعفران القهوة', 'زعفران فاخر'],
  },
  {
    name: 'زعفران مع هيل للقهوة', slug: 'saffron-cardamom-coffee', collectionSlug: 'premium-saffron', category: 'زعفران فاخر',
    description: 'تركيبة صغيرة للقهوة العربية تجمع خيوط الزعفران مع الهيل العطري.', price: 3000,
    size: '1', unit: 'جرام', image: imageBank.saffron, sku: 'HOS-SAFFRON-003', stock: 10,
    seoSearchPhrases: ['زعفران مع هيل', 'خلطة قهوة فاخرة', 'زعفران للقهوة'],
  },

  {
    name: 'بهارات السلتة اليمنية', slug: 'saltah-yemeni-spice', collectionSlug: 'yemeni-blends', category: 'خلطات يمنية',
    description: 'خلطة يمنية للمرق والسلتة والصلصات المنزلية، بطابع دافئ ومتوازن.', price: 950,
    size: '100', unit: 'جرام', image: imageBank.yemeni, sku: 'HOS-YEMENI-001', stock: 34, featured: true, bestseller: true,
    seoSearchPhrases: ['بهارات السلتة', 'خلطة يمنية', 'توابل يمنية'],
  },
  {
    name: 'بهارات الشفوت', slug: 'shafout-yemeni-spice', collectionSlug: 'yemeni-blends', category: 'خلطات يمنية',
    description: 'خلطة خفيفة للشفوت والسلطات والوصفات اليمنية الباردة.', price: 800,
    size: '100', unit: 'جرام', image: imageBank.yemeni, sku: 'HOS-YEMENI-002', stock: 24,
    seoSearchPhrases: ['بهارات الشفوت', 'شفوت يمني', 'خلطات يمنية'],
  },
  {
    name: 'خلطة مرق يمني', slug: 'yemeni-broth-blend', collectionSlug: 'yemeni-blends', category: 'خلطات يمنية',
    description: 'خلطة مرق للأرز واللحم والدجاج، مستوحاة من نكهات المطبخ اليمني اليومية.', price: 900,
    size: '100', unit: 'جرام', image: imageBank.yemeni, sku: 'HOS-YEMENI-003', stock: 31,
    seoSearchPhrases: ['خلطة مرق يمني', 'بهارات المرق اليمني', 'بهارات الأرز اليمني'],
  },
    {
    name: 'بهارات المندي اليمني', slug: 'yemeni-mandi-spice', collectionSlug: 'yemeni-blends', category: 'خلطات يمنية',
    description: 'خلطة مندي للأرز واللحم والدجاج، مناسبة للفرن والطبخ المنزلي.', price: 1050,
    size: '100', unit: 'جرام', image: imageBank.yemeni, sku: 'HOS-YEMENI-004', stock: 28,
    seoSearchPhrases: ['بهارات المندي اليمني', 'مندي يمني', 'خلطة الأرز'],
  },
  {
    name: 'يانسون حب', slug: 'whole-anise-seeds', collectionSlug: 'whole-spices', category: 'بهارات حب',
    description: 'يانسون حب للشاي والمشروبات الساخنة والحلويات، برائحة لطيفة ودافئة.', price: 650,
    size: '100', unit: 'جرام', image: imageBank.whole, sku: 'HOS-WHOLE-006', stock: 36,
    seoSearchPhrases: ['يانسون حب', 'يانسون للشاي', 'بهارات الحلويات'],
  },
  {
    name: 'نجمة اليانسون', slug: 'star-anise', collectionSlug: 'whole-spices', category: 'بهارات حب',
    description: 'نجمة اليانسون للشاي والخلطات والحلويات، بنكهة عطرية واضحة.', price: 900,
    size: '50', unit: 'جرام', image: imageBank.whole, sku: 'HOS-WHOLE-007', stock: 21,
    seoSearchPhrases: ['نجمة اليانسون', 'يانسون نجمي', 'بهارات الشاي'],
  },
  {
    name: 'جوزة الطيب حب', slug: 'whole-nutmeg', collectionSlug: 'whole-spices', category: 'بهارات حب',
    description: 'جوزة الطيب الكاملة للطحن عند الحاجة في البشاميل واللحوم والصلصات.', price: 1200,
    size: '50', unit: 'جرام', image: imageBank.whole, sku: 'HOS-WHOLE-008', stock: 18,
    seoSearchPhrases: ['جوزة الطيب', 'جوز الطيب حب', 'بهارات الصلصات'],
  },
  {
    name: 'محلب حب', slug: 'whole-mahlab', collectionSlug: 'whole-spices', category: 'بهارات حب',
    description: 'محلب حب للمخبوزات والمعمول والحلويات العربية، برائحة مميزة.', price: 1100,
    size: '50', unit: 'جرام', image: imageBank.whole, sku: 'HOS-WHOLE-009', stock: 16,
    seoSearchPhrases: ['محلب حب', 'محلب للمعمول', 'بهارات المخبوزات'],
  },
  {
    name: 'فلفل أبيض حب', slug: 'whole-white-pepper', collectionSlug: 'whole-spices', category: 'بهارات حب',
    description: 'فلفل أبيض حب للمرق والصلصات والدجاج، مناسب للطحن عند الاستخدام.', price: 1050,
    size: '100', unit: 'جرام', image: imageBank.whole, sku: 'HOS-WHOLE-010', stock: 20,
    seoSearchPhrases: ['فلفل أبيض حب', 'فلفل أبيض', 'بهارات المرق'],
  },

  {
    name: 'زنجبيل مطحون', slug: 'ground-ginger', collectionSlug: 'ground-spices', category: 'بهارات مطحونة',
    description: 'زنجبيل مطحون للشاي والمرق والحلويات والتتبيلات المنزلية.', price: 850,
    size: '100', unit: 'جرام', image: imageBank.ground, sku: 'HOS-GROUND-006', stock: 39,
    seoSearchPhrases: ['زنجبيل مطحون', 'زنجبيل للشاي', 'توابل الشتاء'],
  },
  {
    name: 'حبق مطحون', slug: 'ground-basil', collectionSlug: 'ground-spices', category: 'بهارات مطحونة',
    description: 'حبق مطحون للصلصات والسلطات وتتبيل الدجاج والخضار.', price: 700,
    size: '50', unit: 'جرام', image: imageBank.ground, sku: 'HOS-GROUND-007', stock: 26,
    seoSearchPhrases: ['حبق مطحون', 'ريحان مجفف مطحون', 'بهارات الصلصة'],
  },
  {
    name: 'بصل بودرة', slug: 'onion-powder', collectionSlug: 'ground-spices', category: 'بهارات مطحونة',
    description: 'بصل مجفف مطحون للبرجر والصلصات والشوربات والتتبيلات السريعة.', price: 750,
    size: '100', unit: 'جرام', image: imageBank.ground, sku: 'HOS-GROUND-008', stock: 44,
    seoSearchPhrases: ['بصل بودرة', 'بصل مطحون', 'بهارات البرجر'],
  },
  {
    name: 'ثوم بودرة', slug: 'garlic-powder', collectionSlug: 'ground-spices', category: 'بهارات مطحونة',
    description: 'ثوم مجفف مطحون للصلصات والمشاوي والبطاطس والتتبيلات اليومية.', price: 800,
    size: '100', unit: 'جرام', image: imageBank.ground, sku: 'HOS-GROUND-009', stock: 47,
    seoSearchPhrases: ['ثوم بودرة', 'ثوم مطحون', 'بهارات المشاوي'],
  },
  {
    name: 'جوزة الطيب مطحونة', slug: 'ground-nutmeg', collectionSlug: 'ground-spices', category: 'بهارات مطحونة',
    description: 'جوزة الطيب مطحونة بكمية مركزة للبشاميل واللحوم والحلويات.', price: 1250,
    size: '50', unit: 'جرام', image: imageBank.ground, sku: 'HOS-GROUND-010', stock: 15,
    seoSearchPhrases: ['جوزة الطيب مطحونة', 'بهارات البشاميل', 'توابل اللحوم'],
  },

  {
    name: 'بهارات سمك', slug: 'fish-spice-blend', collectionSlug: 'spice-blends', category: 'خلطات التوابل',
    description: 'خلطة متوازنة للسمك والمأكولات البحرية، مع نكهة حمضية وعطرية خفيفة.', price: 950,
    size: '100', unit: 'جرام', image: imageBank.blends, sku: 'HOS-BLEND-006', stock: 32,
    seoSearchPhrases: ['بهارات السمك', 'خلطة السمك', 'توابل المأكولات البحرية'],
  },
  {
    name: 'بهارات خضار', slug: 'vegetable-spice-blend', collectionSlug: 'spice-blends', category: 'خلطات التوابل',
    description: 'خلطة خفيفة للخضار المشوية والمقلية والصواني والأطباق اليومية.', price: 800,
    size: '100', unit: 'جرام', image: imageBank.blends, sku: 'HOS-BLEND-007', stock: 40,
    seoSearchPhrases: ['بهارات الخضار', 'توابل الخضار', 'خلطة الصواني'],
  },
  {
    name: 'بهارات معجنات', slug: 'pastry-spice-blend', collectionSlug: 'spice-blends', category: 'خلطات التوابل',
    description: 'خلطة عطرية للمناقيش والمعجنات والفطائر المالحة.', price: 850,
    size: '100', unit: 'جرام', image: imageBank.blends, sku: 'HOS-BLEND-008', stock: 23,
    seoSearchPhrases: ['بهارات المعجنات', 'توابل المناقيش', 'خلطة الفطائر'],
  },
  {
    name: 'خلطة فتة عربية', slug: 'arabic-fatteh-spice-blend', collectionSlug: 'spice-blends', category: 'خلطات التوابل',
    description: 'خلطة عربية للفتة والحمص والصلصات، تمنح الطبق نكهة متوازنة.', price: 900,
    size: '100', unit: 'جرام', image: imageBank.arabic, sku: 'HOS-BLEND-009', stock: 27,
    seoSearchPhrases: ['بهارات الفتة', 'خلطة فتة', 'توابل عربية'],
  },
  {
    name: 'خلطة محشي', slug: 'stuffed-vegetables-spice-blend', collectionSlug: 'spice-blends', category: 'خلطات التوابل',
    description: 'خلطة للمحاشي وورق العنب والأرز المحشو بنكهة منزلية دافئة.', price: 950,
    size: '100', unit: 'جرام', image: imageBank.blends, sku: 'HOS-BLEND-010', stock: 34,
    seoSearchPhrases: ['بهارات المحشي', 'خلطة ورق العنب', 'توابل الأرز المحشو'],
  },

  {
    name: 'تتبيلة سمك مشوي', slug: 'grilled-fish-seasoning', collectionSlug: 'bbq-mixes', category: 'خلطات الشواء',
    description: 'خلطة سمك للشواية والفرن مع نكهة ليمون وتوابل مناسبة للمأكولات البحرية.', price: 950,
    size: '100', unit: 'جرام', image: imageBank.bbq, sku: 'HOS-BBQ-005', stock: 25,
    seoSearchPhrases: ['تتبيلة سمك', 'بهارات السمك المشوي', 'خلطة السمك'],
  },
  {
    name: 'تتبيلة كباب', slug: 'kebab-seasoning', collectionSlug: 'bbq-mixes', category: 'خلطات الشواء',
    description: 'تتبيلة مركزة للكباب والكفتة واللحم المفروم، مناسبة للشواية أو الفرن.', price: 1000,
    size: '100', unit: 'جرام', image: imageBank.bbq, sku: 'HOS-BBQ-006', stock: 33,
    seoSearchPhrases: ['بهارات الكباب', 'تتبيلة الكفتة', 'خلطة اللحم المفروم'],
  },
  {
    name: 'خلطة شاورما دجاج', slug: 'chicken-shawarma-seasoning', collectionSlug: 'bbq-mixes', category: 'خلطات الشواء',
    description: 'خلطة شاورما دجاج بنكهة عربية مناسبة للمقلاة والفرن والشواية.', price: 1050,
    size: '100', unit: 'جرام', image: imageBank.bbq, sku: 'HOS-BBQ-007', stock: 37, bestseller: true,
    seoSearchPhrases: ['بهارات شاورما دجاج', 'خلطة الشاورما', 'تتبيلة الدجاج'],
  },
  {
    name: 'خلطة ستيك', slug: 'steak-seasoning', collectionSlug: 'bbq-mixes', category: 'خلطات الشواء',
    description: 'خلطة فاخرة للستيك واللحوم السميكة، بنكهة فلفلية وأعشاب مجففة.', price: 1250,
    size: '100', unit: 'جرام', image: imageBank.bbq, sku: 'HOS-BBQ-008', stock: 18, featured: true,
    seoSearchPhrases: ['بهارات ستيك', 'خلطة اللحم', 'توابل الستيك'],
  },
  {
    name: 'تتبيلة خضار مشوية', slug: 'grilled-vegetable-seasoning', collectionSlug: 'bbq-mixes', category: 'خلطات الشواء',
    description: 'تتبيلة للخضار المشوية والبطاطس والفطر، بنكهة أعشاب وتوابل خفيفة.', price: 850,
    size: '100', unit: 'جرام', image: imageBank.bbq, sku: 'HOS-BBQ-009', stock: 30,
    seoSearchPhrases: ['بهارات الخضار المشوية', 'تتبيلة الخضار', 'توابل البطاطس'],
  },
  {
    name: 'خلطة برجر حارة', slug: 'spicy-burger-seasoning', collectionSlug: 'bbq-mixes', category: 'خلطات الشواء',
    description: 'خلطة برجر بلمسة حارة لمحبي النكهة القوية والوجبات السريعة المنزلية.', price: 900,
    size: '100', unit: 'جرام', image: imageBank.bbq, sku: 'HOS-BBQ-010', stock: 21,
    seoSearchPhrases: ['بهارات برجر حارة', 'خلطة برجر حارة', 'توابل الوجبات السريعة'],
  },

  {
    name: 'قرنفل للقهوة', slug: 'clove-for-coffee', collectionSlug: 'coffee-tea-spices', category: 'بهارات الشاي والقهوة',
    description: 'قرنفل كامل بكمية مناسبة لتعطير القهوة العربية والمشروبات الساخنة.', price: 850,
    size: '50', unit: 'جرام', image: imageBank.tea, sku: 'HOS-TEA-006', stock: 24,
    seoSearchPhrases: ['قرنفل للقهوة', 'بهارات القهوة العربية', 'قهوة بالقرنفل'],
  },
  {
    name: 'قرفة عيدان للشاي', slug: 'cinnamon-sticks-for-tea', collectionSlug: 'coffee-tea-spices', category: 'بهارات الشاي والقهوة',
    description: 'عيدان قرفة للشاي والقهوة والمشروبات الشتوية، سهلة الاستخدام والتقديم.', price: 900,
    size: '50', unit: 'جرام', image: imageBank.tea, sku: 'HOS-TEA-007', stock: 29,
    seoSearchPhrases: ['قرفة عيدان', 'قرفة للشاي', 'بهارات المشروبات'],
  },
  {
    name: 'زعفران شاي فاخر', slug: 'saffron-tea-blend', collectionSlug: 'coffee-tea-spices', category: 'بهارات الشاي والقهوة',
    description: 'خيوط زعفران مختارة لإضافة لون ورائحة فاخرة إلى الشاي والضيافة.', price: 2400,
    size: '1', unit: 'جرام', image: imageBank.tea, sku: 'HOS-TEA-008', stock: 11,
    seoSearchPhrases: ['زعفران للشاي', 'شاي بالزعفران', 'بهارات الضيافة'],
  },
  {
    name: 'خلطة شاي بالهيل والزنجبيل', slug: 'cardamom-ginger-tea-blend', collectionSlug: 'coffee-tea-spices', category: 'بهارات الشاي والقهوة',
    description: 'خلطة شاي يومية تجمع الهيل والزنجبيل والقرفة بنكهة دافئة.', price: 950,
    size: '100', unit: 'جرام', image: imageBank.tea, sku: 'HOS-TEA-009', stock: 35,
    seoSearchPhrases: ['شاي بالهيل والزنجبيل', 'خلطة شاي دافئة', 'بهارات الشاي'],
  },
  {
    name: 'فانيلا وقرفة للحلويات', slug: 'vanilla-cinnamon-dessert-spice', collectionSlug: 'coffee-tea-spices', category: 'بهارات الشاي والقهوة',
    description: 'خلطة عطرية للحلويات والمشروبات الساخنة والقهوة بالحليب.', price: 1000,
    size: '50', unit: 'جرام', image: imageBank.tea, sku: 'HOS-TEA-010', stock: 17,
    seoSearchPhrases: ['فانيلا وقرفة', 'بهارات الحلويات', 'توابل القهوة بالحليب'],
  },

  {
    name: 'مريمية مجففة', slug: 'dried-sage', collectionSlug: 'natural-herbs', category: 'أعشاب طبيعية',
    description: 'مريمية مجففة للمشروبات العشبية والخلطات والطبخ الخفيف.', price: 750,
    size: '50', unit: 'جرام', image: imageBank.herbs, sku: 'HOS-HERB-006', stock: 20,
    seoSearchPhrases: ['مريمية مجففة', 'مريمية للشاي', 'أعشاب طبيعية'],
  },
  {
    name: 'بابونج مجفف', slug: 'dried-chamomile', collectionSlug: 'natural-herbs', category: 'أعشاب طبيعية',
    description: 'زهور بابونج مجففة للمشروبات العشبية والضيافة المسائية.', price: 900,
    size: '50', unit: 'جرام', image: imageBank.herbs, sku: 'HOS-HERB-007', stock: 28,
    seoSearchPhrases: ['بابونج مجفف', 'شاي البابونج', 'أعشاب للمشروبات'],
  },
  {
    name: 'بقدونس مجفف', slug: 'dried-parsley', collectionSlug: 'natural-herbs', category: 'أعشاب طبيعية',
    description: 'بقدونس مجفف للمرق والسلطات والحشوات والصلصات.', price: 600,
    size: '50', unit: 'جرام', image: imageBank.herbs, sku: 'HOS-HERB-008', stock: 43,
    seoSearchPhrases: ['بقدونس مجفف', 'أعشاب للسلطة', 'توابل المرق'],
  },
  {
    name: 'شبت مجفف', slug: 'dried-dill', collectionSlug: 'natural-herbs', category: 'أعشاب طبيعية',
    description: 'شبت مجفف للسلطات والشوربات وأطباق السمك والخضار.', price: 650,
    size: '50', unit: 'جرام', image: imageBank.herbs, sku: 'HOS-HERB-009', stock: 22,
    seoSearchPhrases: ['شبت مجفف', 'أعشاب السمك', 'توابل السلطة'],
  },
  {
    name: 'كزبرة خضراء مجففة', slug: 'dried-cilantro', collectionSlug: 'natural-herbs', category: 'أعشاب طبيعية',
    description: 'كزبرة خضراء مجففة للمرق والصلصات والأطباق اليمنية والعربية.', price: 700,
    size: '50', unit: 'جرام', image: imageBank.herbs, sku: 'HOS-HERB-010', stock: 26,
    seoSearchPhrases: ['كزبرة خضراء مجففة', 'كزبرة للمرق', 'أعشاب يمنية'],
  },

  {
    name: 'كزبرة مطحونة عربية', slug: 'arabic-ground-coriander', collectionSlug: 'arabic-spices', category: 'بهارات عربية',
    description: 'كزبرة مطحونة للمرق واللحوم والصلصات والوصفات العربية اليومية.', price: 650,
    size: '100', unit: 'جرام', image: imageBank.arabic, sku: 'HOS-ARABIC-006', stock: 42,
    seoSearchPhrases: ['كزبرة مطحونة', 'بهارات عربية', 'توابل المرق'],
  },
  {
    name: 'بهارات مرق عربي', slug: 'arabic-broth-spice', collectionSlug: 'arabic-spices', category: 'بهارات عربية',
    description: 'خلطة عربية للمرق والشوربة والخضار، بطعم دافئ مناسب للمطبخ اليومي.', price: 900,
    size: '100', unit: 'جرام', image: imageBank.arabic, sku: 'HOS-ARABIC-007', stock: 35,
    seoSearchPhrases: ['بهارات المرق العربي', 'خلطة الشوربة', 'توابل عربية'],
  },
  {
    name: 'بهارات رز عربي', slug: 'arabic-rice-spice', collectionSlug: 'arabic-spices', category: 'بهارات عربية',
    description: 'خلطة للأرز العربي واللحم والدجاج، بنكهة عطرية واضحة.', price: 950,
    size: '100', unit: 'جرام', image: imageBank.arabic, sku: 'HOS-ARABIC-008', stock: 39,
    seoSearchPhrases: ['بهارات الرز العربي', 'توابل الأرز', 'خلطة الأرز'],
  },
  {
    name: 'هيل أسود', slug: 'black-cardamom', collectionSlug: 'arabic-spices', category: 'بهارات عربية',
    description: 'هيل أسود بنكهة مدخنة خفيفة للمرق والأرز والخلطات العربية.', price: 1300,
    size: '50', unit: 'جرام', image: imageBank.arabic, sku: 'HOS-ARABIC-009', stock: 14,
    seoSearchPhrases: ['هيل أسود', 'بهارات الأرز', 'توابل عربية فاخرة'],
  },
  {
    name: 'خلطة دقة عربية', slug: 'arabic-duqqa-blend', collectionSlug: 'arabic-spices', category: 'بهارات عربية',
    description: 'خلطة دقة عربية للمقبلات والخبز والسلطات، بنكهة محمصة ومقرمشة.', price: 1000,
    size: '100', unit: 'جرام', image: imageBank.arabic, sku: 'HOS-ARABIC-010', stock: 19,
    seoSearchPhrases: ['دقة عربية', 'خلطة دقة', 'بهارات المقبلات'],
  },

  {
    name: 'كركم هندي أصلي', slug: 'indian-turmeric', collectionSlug: 'indian-spices', category: 'بهارات هندية',
    description: 'كركم هندي بلون غني للكاري والأرز والدجاج والخضار.', price: 750,
    size: '100', unit: 'جرام', image: imageBank.indian, sku: 'HOS-INDIAN-006', stock: 45,
    seoSearchPhrases: ['كركم هندي', 'بهارات هندية', 'كركم للكاري'],
  },
  {
    name: 'كمون هندي', slug: 'indian-cumin', collectionSlug: 'indian-spices', category: 'بهارات هندية',
    description: 'كمون هندي عطري للماسالا والكاري والأرز والأطباق المتبلة.', price: 850,
    size: '100', unit: 'جرام', image: imageBank.indian, sku: 'HOS-INDIAN-007', stock: 30,
    seoSearchPhrases: ['كمون هندي', 'توابل الكاري', 'بهارات ماسالا'],
  },
  {
    name: 'كزبرة هندية', slug: 'indian-coriander', collectionSlug: 'indian-spices', category: 'بهارات هندية',
    description: 'كزبرة هندية مطحونة للصلصات والأرز والخلطات الهندية.', price: 800,
    size: '100', unit: 'جرام', image: imageBank.indian, sku: 'HOS-INDIAN-008', stock: 34,
    seoSearchPhrases: ['كزبرة هندية', 'بهارات هندية مطحونة', 'توابل الكاري'],
  },
  {
    name: 'فلفل أسود هندي', slug: 'indian-black-pepper', collectionSlug: 'indian-spices', category: 'بهارات هندية',
    description: 'فلفل أسود بطعم قوي للأطباق الهندية والصلصات والتتبيلات.', price: 1050,
    size: '100', unit: 'جرام', image: imageBank.indian, sku: 'HOS-INDIAN-009', stock: 23,
    seoSearchPhrases: ['فلفل أسود هندي', 'بهارات هندية حارة', 'توابل الصلصات'],
  },
  {
    name: 'خلطة دجاج كاري', slug: 'chicken-curry-blend', collectionSlug: 'indian-spices', category: 'بهارات هندية',
    description: 'خلطة جاهزة لدجاج الكاري مع نكهة عطرية مناسبة للطبخ المنزلي.', price: 1000,
    size: '100', unit: 'جرام', image: imageBank.indian, sku: 'HOS-INDIAN-010', stock: 26,
    seoSearchPhrases: ['خلطة دجاج كاري', 'بهارات الدجاج الهندي', 'توابل الكاري'],
  },

  {
    name: 'زعفران خيوط للرز', slug: 'rice-saffron-threads', collectionSlug: 'premium-saffron', category: 'زعفران فاخر',
    description: 'خيوط زعفران بعبوة مناسبة للأرز والمندي والكبسة والضيافة.', price: 3000,
    size: '1', unit: 'جرام', image: imageBank.saffron, sku: 'HOS-SAFFRON-004', stock: 9,
    seoSearchPhrases: ['زعفران للرز', 'زعفران للمندي', 'خيوط زعفران'],
  },
  {
    name: 'زعفران مع ماء ورد', slug: 'saffron-rosewater-garnish', collectionSlug: 'premium-saffron', category: 'زعفران فاخر',
    description: 'تركيبة ضيافة تجمع الزعفران مع ماء الورد للمشروبات والحلويات.', price: 2800,
    size: '1', unit: 'جرام', image: imageBank.saffron, sku: 'HOS-SAFFRON-005', stock: 8,
    seoSearchPhrases: ['زعفران وماء ورد', 'زعفران للحلويات', 'خلطة ضيافة'],
  },
  {
    name: 'علبة زعفران هدية', slug: 'saffron-gift-box', collectionSlug: 'premium-saffron', category: 'زعفران فاخر',
    description: 'عبوة هدايا صغيرة من الزعفران مناسبة للضيافة والمناسبات الخاصة.', price: 5200,
    size: '2', unit: 'جرام', image: imageBank.saffron, sku: 'HOS-SAFFRON-006', stock: 6, featured: true,
    seoSearchPhrases: ['علبة زعفران هدية', 'هدية زعفران', 'زعفران فاخر'],
  },
  {
    name: 'زعفران للحلويات', slug: 'dessert-saffron', collectionSlug: 'premium-saffron', category: 'زعفران فاخر',
    description: 'خيوط زعفران للحلويات العربية والكعك والأرز بالحليب.', price: 2600,
    size: '1', unit: 'جرام', image: imageBank.saffron, sku: 'HOS-SAFFRON-007', stock: 13,
    seoSearchPhrases: ['زعفران للحلويات', 'زعفران للكعك', 'بهارات الحلويات الفاخرة'],
  },
  {
    name: 'زعفران للقهوة العربية', slug: 'arabic-coffee-saffron', collectionSlug: 'premium-saffron', category: 'زعفران فاخر',
    description: 'خيوط زعفران للقهوة العربية والضيافة، بحجم عملي للاستخدام المنزلي.', price: 2900,
    size: '1', unit: 'جرام', image: imageBank.saffron, sku: 'HOS-SAFFRON-008', stock: 11,
    seoSearchPhrases: ['زعفران للقهوة العربية', 'قهوة بالزعفران', 'بهارات الضيافة'],
  },
  {
    name: 'زعفران فاخر 2 جرام', slug: 'premium-saffron-2g', collectionSlug: 'premium-saffron', category: 'زعفران فاخر',
    description: 'عبوة أكبر للاستخدام المتكرر في الأرز والقهوة والحلويات والمناسبات.', price: 7600,
    size: '2', unit: 'جرام', image: imageBank.saffron, sku: 'HOS-SAFFRON-009', stock: 5,
    seoSearchPhrases: ['زعفران 2 جرام', 'زعفران للمناسبات', 'زعفران فاخر كبير'],
  },
  {
    name: 'خيوط زعفران للضيافة', slug: 'hospitality-saffron-threads', collectionSlug: 'premium-saffron', category: 'زعفران فاخر',
    description: 'خيوط زعفران مختارة بعبوة أنيقة للضيافة وتقديم القهوة العربية.', price: 3600,
    size: '1', unit: 'جرام', image: imageBank.saffron, sku: 'HOS-SAFFRON-010', stock: 7,
    seoSearchPhrases: ['خيوط زعفران للضيافة', 'زعفران للقهوة', 'هدية ضيافة'],
  },

  {
    name: 'خلطة عصيدة يمنية', slug: 'yemeni-asida-blend', collectionSlug: 'yemeni-blends', category: 'خلطات يمنية',
    description: 'خلطة عطرية مناسبة للعصيدة والوصفات اليمنية المنزلية والحلويات التقليدية.', price: 900,
    size: '100', unit: 'جرام', image: imageBank.yemeni, sku: 'HOS-YEMENI-005', stock: 22,
    seoSearchPhrases: ['بهارات العصيدة', 'خلطة يمنية للحلويات', 'وصفات يمنية'],
  },
  {
    name: 'خلطة شاي حليب يمني', slug: 'yemeni-milk-tea-blend', collectionSlug: 'yemeni-blends', category: 'خلطات يمنية',
    description: 'خلطة شاي بالحليب مستوحاة من جلسات الشاي اليمنية بنكهة قرفة وهيل وزنجبيل.', price: 950,
    size: '100', unit: 'جرام', image: imageBank.yemeni, sku: 'HOS-YEMENI-006', stock: 33,
    seoSearchPhrases: ['شاي حليب يمني', 'خلطة شاي يمنية', 'بهارات الشاي'],
  },
  {
    name: 'بهارات اللحم اليمني', slug: 'yemeni-meat-spice', collectionSlug: 'yemeni-blends', category: 'خلطات يمنية',
    description: 'خلطة لحم يمنية للمرق واللحم المطبوخ والأرز بنكهة دافئة ومتوازنة.', price: 1000,
    size: '100', unit: 'جرام', image: imageBank.yemeni, sku: 'HOS-YEMENI-007', stock: 29,
    seoSearchPhrases: ['بهارات اللحم اليمني', 'توابل يمنية للحم', 'خلطة المرق اليمني'],
  },
  {
    name: 'خلطة مرق الدجاج اليمنية', slug: 'yemeni-chicken-broth-blend', collectionSlug: 'yemeni-blends', category: 'خلطات يمنية',
    description: 'خلطة للدجاج والمرق والأرز مستوحاة من الطبخ اليمني اليومي.', price: 950,
    size: '100', unit: 'جرام', image: imageBank.yemeni, sku: 'HOS-YEMENI-008', stock: 36,
    seoSearchPhrases: ['بهارات الدجاج اليمنية', 'مرق يمني', 'خلطة دجاج يمنية'],
  },
  {
    name: 'بهارات الشوربة اليمنية', slug: 'yemeni-soup-spice', collectionSlug: 'yemeni-blends', category: 'خلطات يمنية',
    description: 'خلطة للشوربات والمرق والخضار، مناسبة للوجبات المنزلية الدافئة.', price: 850,
    size: '100', unit: 'جرام', image: imageBank.yemeni, sku: 'HOS-YEMENI-009', stock: 31,
    seoSearchPhrases: ['بهارات الشوربة اليمنية', 'توابل يمنية', 'خلطة شوربة'],
  },
  {
    name: 'خلطة بهارات يمنية مشكلة', slug: 'yemeni-mixed-spices', collectionSlug: 'yemeni-blends', category: 'خلطات يمنية',
    description: 'خلطة أساسية متعددة الاستخدامات للمرق واللحم والدجاج والأرز اليمني.', price: 1050,
    size: '100', unit: 'جرام', image: imageBank.yemeni, sku: 'HOS-YEMENI-010', stock: 40, bestseller: true,
    seoSearchPhrases: ['بهارات يمنية مشكلة', 'خلطة توابل يمنية', 'بهارات الطبخ اليمني'],
  },
];
const reviewSeeds = [
  { name: 'أميرة محمد', city: 'إب', content: 'الرائحة واضحة والخلطة مناسبة للطبخ اليومي، سأطلبها مرة أخرى.', rating: 5 },
  { name: 'عبدالله القاسمي', city: 'صنعاء', content: 'التغليف مرتب والكمية مناسبة، أعجبتني نكهة البهارات مع الأرز.', rating: 5 },
  { name: 'ريم العريقي', city: 'تعز', content: 'طلبت خلطة الشاي والقهوة وكانت النكهة دافئة ومتوازنة.', rating: 5 },
  { name: 'سامي الخولاني', city: 'عدن', content: 'بهارات الشواء أعطت اللحم طعماً جميلاً من دون مبالغة في الحدة.', rating: 4 },
  { name: 'نجلاء أحمد', city: 'الحديدة', content: 'أحببت وضوح أسماء المنتجات وسهولة اختيار الحجم من المتجر.', rating: 5 },
  { name: 'مازن صالح', city: 'ذمار', content: 'الزعفران مناسب للضيافة والعبوة عملية للاستخدام المنزلي.', rating: 5 },
  { name: 'خديجة علي', city: 'إب', content: 'خلطة السلتة قريبة من النكهة التي نستخدمها في البيت.', rating: 5 },
  { name: 'فهد حسن', city: 'صنعاء', content: 'الفلفل والكمون طازجان والرائحة أفضل من المنتجات العامة.', rating: 4 },
];

async function main() {
  console.log('Clearing disposable demo catalog data...');
  await prisma.review.deleteMany();
  await prisma.productVariant.deleteMany();
  await prisma.product.deleteMany();
  await prisma.collection.deleteMany();

  const collections = new Map<string, { id: string; name: string }>();
  for (const data of collectionsData) {
    const collection = await prisma.collection.create({
      data: {
        name: data.name,
        slug: data.slug,
        description: data.description,
        imageUrl: data.image,
        seoSearchPhrases: data.seoSearchPhrases,
        isActive: true,
      },
      select: { id: true, name: true },
    });
    collections.set(data.slug, collection);
  }

  let createdProducts = 0;
  let createdVariants = 0;
  let createdReviews = 0;

  for (const [index, data] of products.entries()) {
    const collection = collections.get(data.collectionSlug);
    if (!collection) throw new Error(`Missing collection for ${data.slug}`);

    const product = await prisma.product.create({
      data: {
        name: data.name,
        slug: data.slug,
        brand: 'بيت البهارات',
        description: data.description,
        price: data.price,
        compareAtPrice: data.compareAtPrice,
        sku: data.sku,
        size: data.size,
        unit: data.unit,
        category: data.category,
        collectionId: collection.id,
        stock: data.stock,
        featured: data.featured ?? false,
        bestseller: data.bestseller ?? false,
        isActive: true,
        imageUrl: data.image,
        images: [data.image],
        seoSearchPhrases: data.seoSearchPhrases,
        seoScore: 90,
      },
    });
    createdProducts += 1;

    if (data.variants) {
      for (const variant of data.variants) {
        await prisma.productVariant.create({
          data: {
            productId: product.id,
            size: variant.size,
            unit: variant.unit,
            price: variant.price,
            compareAtPrice: variant.compareAtPrice,
            stock: variant.stock,
          },
        });
        createdVariants += 1;
      }
    }

    if (index % 2 === 0) {
      const review = reviewSeeds[(index / 2) % reviewSeeds.length];
      await prisma.review.create({
        data: {
          name: review.name,
          city: review.city,
          content: review.content,
          rating: review.rating,
          status: 'APPROVED',
          isGlobal: false,
          productId: product.id,
        },
      });
      createdReviews += 1;
    }
  }

  console.log(`Seed completed: ${collectionsData.length} collections, ${createdProducts} products, ${createdVariants} variants, ${createdReviews} reviews.`);
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
