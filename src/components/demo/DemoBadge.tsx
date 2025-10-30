'use client'

import { useEffect, useState } from 'react'

export function DemoBadge() {
  const [isDemoMode, setIsDemoMode] = useState(false)

  useEffect(() => {
    // Check if DEMO mode is enabled
    const demoEnabled = process.env.NEXT_PUBLIC_DEMO_ENABLED === 'true'
    setIsDemoMode(demoEnabled)
  }, [])

  if (!isDemoMode) return null

  return (
    <div className="fixed top-4 right-4 z-50 flex items-center gap-2 bg-yellow-500 text-black px-4 py-2 rounded-lg shadow-lg font-bold text-sm animate-pulse">
      <span className="text-lg">⚠️</span>
      <span>MODO DEMO - Preview</span>
    </div>
  )
}
