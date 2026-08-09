'use client'

import { useEffect } from 'react'

export default function VisitorTracker() {
  useEffect(() => {
    // Fire and forget
    fetch('/api/track/visit', { method: 'POST' }).catch(() => {})
  }, [])

  return null
}
