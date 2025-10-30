'use client'

import { useState } from 'react'
import { GuideSidebar } from './GuideSidebar'

interface GuideButtonProps {
  role: 'ENTIDAD' | 'DELEGADO' | 'SUPLENTE'
  userEmail?: string
  userName?: string
  entidad?: string
  userId?: string
}

/**
 * Botón fijo para abrir la Guía de uso C360
 * Se muestra en el header de cada panel según el rol
 */
export function GuideButton({ role, userEmail, userName, entidad, userId }: GuideButtonProps) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium text-sm"
        aria-label="Abrir guía de uso"
      >
        <svg
          className="w-5 h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
        <span>Guía de uso C360</span>
      </button>

      <GuideSidebar
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        role={role}
        userEmail={userEmail || ''}
        userName={userName || ''}
        entidad={entidad}
        userId={userId}
      />
    </>
  )
}
