"use server"

import prisma from "@/lib/prisma"
import { verifyAdmin } from "@/lib/auth"

export async function getAnalyticsData() {
  await verifyAdmin()
  
  try {
    // 1. Get Daily Visits
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    
    const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1)
    
    // Today's stats
    const todayStats = await prisma.dailyStats.findUnique({
      where: { date: today }
    })
    
    // Month's stats
    const monthStats = await prisma.dailyStats.aggregate({
      where: {
        date: {
          gte: startOfMonth
        }
      },
      _sum: {
        visitorsCount: true,
        pageViews: true
      }
    })
    
    // Total stats (all time)
    const totalStats = await prisma.dailyStats.aggregate({
      _sum: {
        visitorsCount: true,
        pageViews: true
      }
    })

    // 2. Try to get Database size
    let dbSizeMB = 0
    try {
      const result: any = await prisma.$queryRaw`SELECT pg_database_size(current_database()) as size`
      if (Array.isArray(result) && result[0]?.size) {
        dbSizeMB = Number(result[0].size) / (1024 * 1024)
      }
    } catch (e) {
      console.warn("Could not fetch DB size, might not be postgres")
    }

    // 3. Vercel API Data (Real API Call)
    const token = process.env.TIF_API_TOKEN || process.env.VERCEL_API_TOKEN
    const projectId = process.env.TIF_PROJECT_ID || process.env.VERCEL_PROJECT_ID

    console.log('[Analytics] Token exists:', !!token, '| ProjectId exists:', !!projectId)
    
    let bandwidthGB = 0
    let storageGB = dbSizeMB / 1024 // Converting DB MB to GB
    let isVercelConnected = false

    if (token && projectId) {
      try {
        // Fetch project info to get teamId if available
        const projectRes = await fetch(
          `https://api.vercel.com/v9/projects/${projectId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
            cache: 'no-store',
          }
        )

        console.log('[Analytics] Project API status:', projectRes.status)

        if (projectRes.ok) {
          isVercelConnected = true
          const projectData = await projectRes.json()
          const teamId = projectData?.accountId || projectData?.team?.id || null
          console.log('[Analytics] teamId:', teamId)

          // Try to get usage from Vercel API
          // The usage endpoint varies by plan — try both
          const now = new Date()
          const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)
          const from = startOfMonth.getTime()
          const to = now.getTime()

          const teamParam = teamId ? `&teamId=${teamId}` : ''

          // Try v1 usage endpoint (more stable)
          const usageRes = await fetch(
            `https://api.vercel.com/v1/integrations/log/drains${teamParam}`,
            {
              headers: { Authorization: `Bearer ${token}` },
              cache: 'no-store',
            }
          )
          console.log('[Analytics] Usage API status:', usageRes.status)

          // Try data transfer endpoint
          const dtRes = await fetch(
            `https://api.vercel.com/v2/edge-network/regions${teamParam}`,
            {
              headers: { Authorization: `Bearer ${token}` },
              cache: 'no-store',
            }
          )
          console.log('[Analytics] DT API status:', dtRes.status)

          // Try fetching blob storage
          const blobRes = await fetch(
            `https://api.vercel.com/v1/storage/stores${teamId ? `?teamId=${teamId}` : ''}`,
            {
              headers: { Authorization: `Bearer ${token}` },
              cache: 'no-store',
            }
          )
          console.log('[Analytics] Blob API status:', blobRes.status)

          if (blobRes.ok) {
            const blobData = await blobRes.json()
            console.log('[Analytics] Blob data:', JSON.stringify(blobData).substring(0, 200))
            const stores = blobData?.stores ?? []
            const totalBlobBytes = stores.reduce((acc: number, s: any) => acc + (s?.usedBytes ?? 0), 0)
            storageGB += totalBlobBytes / (1024 * 1024 * 1024)
          }
        } else {
          const errText = await projectRes.text()
          console.error('[Analytics] Project API failed:', projectRes.status, errText.substring(0, 300))
        }
      } catch (vercelErr) {
        console.error("[Analytics] Vercel API exception:", vercelErr)
        isVercelConnected = false
      }

    }

    return {
      success: true,
      visits: {
        today: todayStats?.visitorsCount || 0,
        todayViews: todayStats?.pageViews || 0,
        month: monthStats._sum.visitorsCount || 0,
        total: totalStats._sum.visitorsCount || 0,
      },
      usage: {
        bandwidthGB,
        storageGB,
        isVercelConnected
      }
    }

  } catch (error) {
    console.error("Error fetching analytics:", error)
    return { success: false, error: "فشل في جلب الإحصائيات" }
  }
}
