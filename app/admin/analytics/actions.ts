"use server"

import prisma from "@/lib/prisma"

export async function getAnalyticsData() {
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
    const token = process.env.VERCEL_API_TOKEN
    const projectId = process.env.VERCEL_PROJECT_ID
    
    let bandwidthGB = 0
    let storageGB = dbSizeMB / 1024 // Converting DB MB to GB
    let isVercelConnected = false

    if (token && projectId) {
      try {
        // Get current billing period dates
        const now = new Date()
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)
        const from = startOfMonth.getTime()
        const to = now.getTime()

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

        if (projectRes.ok) {
          isVercelConnected = true
          const projectData = await projectRes.json()
          const teamId = projectData?.accountId || null

          // Build usage URL
          const teamParam = teamId ? `&teamId=${teamId}` : ''
          const usageUrl = `https://api.vercel.com/v2/projects/${projectId}/analytics/bandwidth?from=${from}&to=${to}${teamParam}`

          const usageRes = await fetch(usageUrl, {
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
            cache: 'no-store',
          })

          if (usageRes.ok) {
            const usageData = await usageRes.json()
            // bandwidth is usually in bytes
            const totalBytes = usageData?.total ?? usageData?.bandwidth ?? 0
            bandwidthGB = totalBytes / (1024 * 1024 * 1024)
          }

          // Try fetching blob storage
          const blobRes = await fetch(
            `https://api.vercel.com/v1/storage/stores?teamId=${teamId || ''}`,
            {
              headers: { Authorization: `Bearer ${token}` },
              cache: 'no-store',
            }
          )
          if (blobRes.ok) {
            const blobData = await blobRes.json()
            const stores = blobData?.stores ?? []
            const totalBlobBytes = stores.reduce((acc: number, s: any) => acc + (s?.usedBytes ?? 0), 0)
            storageGB += totalBlobBytes / (1024 * 1024 * 1024)
          }
        }
      } catch (vercelErr) {
        console.warn("Vercel API call failed:", vercelErr)
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
