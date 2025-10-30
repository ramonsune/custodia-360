'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'

export function BOEAlertBadge() {
  const [unreadCount, setUnreadCount] = useState(0)

  const fetchUnreadCount = async () => {
    try {
      const response = await fetch('/api/admin/boe/alerts?unread=true')
      const data = await response.json()

      if (data.success) {
        setUnreadCount(data.unreadCount)
      }
    } catch (error) {
      console.error('Error fetching unread alerts:', error)
    }
  }

  useEffect(() => {
    fetchUnreadCount()

    // Poll every 2 minutes for new alerts
    const interval = setInterval(fetchUnreadCount, 120000)

    return () => clearInterval(interval)
  }, [])

  if (unreadCount === 0) {
    return null
  }

  return (
    <Link
      href="/dashboard-custodia360/boe-alertas"
      className="relative inline-block"
    >
      <div className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center animate-pulse">
        <span className="text-white text-xs font-bold">{unreadCount}</span>
      </div>
      <div className="w-2 h-2 bg-red-500 rounded-full"></div>
    </Link>
  )
}
