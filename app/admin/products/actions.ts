// app/admin/products/actions.ts

'use server';
import prisma from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

import { verifyAdmin } from '@/lib/auth';

function normalizeImageUrl(value: string | null): string | null {
  if (!value) return null
  try {
    const url = new URL(value)
    const allowedHost = url.hostname === 'lh3.googleusercontent.com' || url.hostname === 'images.unsplash.com' || url.hostname.endsWith('.public.blob.vercel-storage.com')
    if (url.protocol !== 'https:' || !allowedHost || value.length > 2048) throw new Error('رابط الصورة غير صالح')
    return url.toString()
  } catch {
    throw new Error('رابط الصورة غير صالح')
  }
}

function parseStringArray(value: FormDataEntryValue | null, field: string, maxItems: number): string[] {
  if (typeof value !== 'string' || !value) return []
  let parsed: unknown
  try { parsed = JSON.parse(value) } catch { throw new Error(`${field} غير صالح`) }
  if (!Array.isArray(parsed) || parsed.length > maxItems || parsed.some(item => typeof item !== 'string')) {
    throw new Error(`${field} غير صالح`)
  }
  return parsed.map(item => item.trim()).filter(Boolean).filter(item => item.length <= 500)
}

function parseUrlArray(value: FormDataEntryValue | null, field: string, maxItems: number): string[] {
  return parseStringArray(value, field, maxItems).map(item => normalizeImageUrl(item) as string)
}

function finiteNumber(value: FormDataEntryValue | null, field: string, min: number, max: number): number {
  const number = typeof value === 'string' && value.trim() !== '' ? Number(value) : Number.NaN
  if (!Number.isFinite(number) || number < min || number > max) throw new Error(`${field} غير صالح`)
  return number
}

/**
 * Server Action to create a new product.
 * Receives the form data from the client component, uploads the main image to Vercel Blob
 * (if an image URL is provided), stores the product in the database and revalidates the
 * product list page so the new product appears instantly.
 */
export async function createProduct(formData: FormData) {
  await verifyAdmin();
  // Extract fields
  const name = formData.get('name') as string;
  const slug = formData.get('slug') as string;
  const brand = formData.get('brand') as string | null;
  const collectionId = formData.get('collectionId') as string | null;
  const size = formData.get('size') as string | null;
  const unit = formData.get('unit') as string | null;
  const description = formData.get('description') as string | null;
  const price = finiteNumber(formData.get('price'), 'السعر', 0, 1_000_000_000)
  const compareAtPrice = formData.get('compareAtPrice')
    ? finiteNumber(formData.get('compareAtPrice'), 'السعر السابق', 0, 1_000_000_000)
    : null
  const sku = formData.get('sku') as string | null;
  const stock = finiteNumber(formData.get('stock'), 'المخزون', 0, 10_000_000)
  const isActive = formData.get('isActive') === 'on';
  const featured = formData.get('featured') === 'on';
  const bestseller = formData.get('bestseller') === 'on';
  const imageUrl = formData.get('imageUrl') as string | null;
  const extraImages = parseUrlArray(formData.get('images'), 'الصور الإضافية', 5);
  const seoSearchPhrases = parseStringArray(formData.get('seoSearchPhrases'), 'عبارات SEO', 50);
  const seoScore = formData.get('seoScore') ? finiteNumber(formData.get('seoScore'), 'درجة SEO', 0, 100) : null;

  const storedImageUrl = normalizeImageUrl(imageUrl)
  const storedExtraImages = extraImages

  // Create product in DB
  const product = await prisma.product.create({
    data: {
      name,
      slug,
      brand: brand ?? undefined,
      collectionId: collectionId || undefined,
      size: size || undefined,
      unit: unit || undefined,
      description: description ?? undefined,
      price,
      compareAtPrice: compareAtPrice ?? undefined,
      sku: sku ?? undefined,
      stock,
      isActive,
      featured,
      bestseller,
      imageUrl: storedImageUrl ?? undefined,
      images: storedExtraImages,
      seoSearchPhrases,
      seoScore,
    },
  });

  // Revalidate the product list and product page
  revalidatePath('/admin/products');
  revalidatePath(`/products/${product.slug}`);

  redirect('/admin/products');
}

/**
 * Server Action to delete a product.
 */
export async function deleteProduct(productId: string) {
  await verifyAdmin();
  await prisma.product.delete({ where: { id: productId } });
  revalidatePath('/admin/products');
  return { success: true };
}

/**
 * Server Action to update a product.
 */
export async function updateProduct(formData: FormData) {
  await verifyAdmin();
  const id = formData.get('id') as string;
  const name = formData.get('name') as string;
  const slug = formData.get('slug') as string;
  const brand = formData.get('brand') as string | null;
  const collectionId = formData.get('collectionId') as string | null;
  const size = formData.get('size') as string | null;
  const unit = formData.get('unit') as string | null;
  const description = formData.get('description') as string | null;
  const price = finiteNumber(formData.get('price'), 'السعر', 0, 1_000_000_000)
  const compareAtPrice = formData.get('compareAtPrice')
    ? finiteNumber(formData.get('compareAtPrice'), 'السعر السابق', 0, 1_000_000_000)
    : null
  const sku = formData.get('sku') as string | null;
  const stock = finiteNumber(formData.get('stock'), 'المخزون', 0, 10_000_000)
  const isActive = formData.get('isActive') === 'on';
  const featured = formData.get('featured') === 'on';
  const bestseller = formData.get('bestseller') === 'on';
  const imageUrl = formData.get('imageUrl') as string | null;
  const extraImages = parseUrlArray(formData.get('images'), 'الصور الإضافية', 5);
  const seoSearchPhrases = parseStringArray(formData.get('seoSearchPhrases'), 'عبارات SEO', 50);
  const seoScore = formData.get('seoScore') ? finiteNumber(formData.get('seoScore'), 'درجة SEO', 0, 100) : null;

  const storedImageUrl = normalizeImageUrl(imageUrl)
  const storedExtraImages = extraImages

  const product = await prisma.product.update({
    where: { id },
    data: {
      name,
      slug,
      brand: brand ?? undefined,
      collectionId: collectionId || undefined,
      size: size || undefined,
      unit: unit || undefined,
      description: description ?? undefined,
      price,
      compareAtPrice: compareAtPrice ?? undefined,
      sku: sku ?? undefined,
      stock,
      isActive,
      featured,
      bestseller,
      imageUrl: storedImageUrl ?? undefined,
      images: storedExtraImages,
      seoSearchPhrases,
      seoScore,
    },
  });

  revalidatePath('/admin/products');
  revalidatePath(`/products/${product.slug}`);
  redirect('/admin/products');
}
