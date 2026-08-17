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
