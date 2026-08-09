import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // تحويل تلقائي إلى AVIF أولاً ثم WebP — يُقلّل حجم الصورة بنسبة 30-50%
    formats: ['image/avif', 'image/webp'],

    // أحجام الشاشات — يختار المتصفح الأنسب عبر srcset
    deviceSizes: [360, 480, 640, 750, 828, 1080, 1200, 1920],

    // أحجام الصور الثابتة (fill / fixed)
    imageSizes: [16, 32, 48, 64, 80, 96, 128, 256, 384],

    // Cache الصور لمدة أسبوع (604800 ثانية) — يمنع إعادة التحميل بلا داعٍ
    minimumCacheTTL: 604800,

    // مصادر الصور المسموح بها
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '*.public.blob.vercel-storage.com',
        port: '',
        pathname: '/**',
      },
    ],
  },
};

export default nextConfig;
