'use server'

import { verifyAdmin } from '@/lib/auth'

import prisma from '@/lib/prisma'
import { revalidatePath } from 'next/cache'

export async function getCollections() {
  await verifyAdmin();

  return prisma.collection.findMany({
    include: {
      _count: {
        select: { products: true }
      }
    },
    orderBy: { createdAt: 'desc' }
  })
}

export async function createCollection(data: { name: string, slug: string, description: string, isActive: boolean, imageUrl: string }) {
  await verifyAdmin();

  try {
    await prisma.collection.create({
      data
    })
    revalidatePath('/admin/collections')
    revalidatePath('/admin/products')
    return { success: true }
  } catch (error: any) {
    if (error.code === 'P2002') {
      return { success: false, error: 'الرابط الدائم (slug) مستخدم مسبقاً.' }
    }
    return { success: false, error: 'حدث خطأ أثناء إنشاء المجموعة.' }
  }
}

export async function deleteCollection(id: string) {
  await verifyAdmin();

  try {
    await prisma.collection.delete({ where: { id } })
    revalidatePath('/admin/collections')
    revalidatePath('/admin/products')
    return { success: true }
  } catch (error) {
    return { success: false, error: 'حدث خطأ أثناء حذف المجموعة.' }
  }
}

export async function toggleCollectionStatus(id: string, isActive: boolean) {
  await verifyAdmin();

  try {
    await prisma.collection.update({
      where: { id },
      data: { isActive }
    })
    revalidatePath('/admin/collections')
    return { success: true }
  } catch (error) {
    return { success: false, error: 'حدث خطأ.' }
  }
}
