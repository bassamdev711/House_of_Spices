import React from 'react'
import TestimonialsClient from './TestimonialsClient'
import prisma from '@/lib/prisma'

export default async function Testimonials() {
  let reviews: Awaited<ReturnType<typeof prisma.review.findMany>> = []
  try {
    reviews = await prisma.review.findMany({
      where: { status: 'APPROVED', isGlobal: true },
      orderBy: { createdAt: 'desc' },
      take: 10,
    })
  } catch (error) {
    console.error('Failed to load testimonials:', error)
  }

  // Format dates for client
  const serializedReviews = reviews.map(r => ({
    id: r.id,
    name: r.name,
    city: r.city,
    content: r.content,
    rating: r.rating
  }))

  return <TestimonialsClient reviews={serializedReviews} />
}
