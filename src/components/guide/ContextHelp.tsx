'use client'

import { useState } from 'react'
import { GuideSidebar } from './GuideSidebar'

interface ContextHelpProps {
  role: 'ENTIDAD' | 'DELEGADO' | 'SUPLENTE'
  uiContext: string // e.g., "incidentes.create", "canal_seguro.view"
  userEmail?: string
  userName?: string
  entidad?: string
  userId?: string
  size?: 'sm' | 'md' | 'lg'
}

/**
 * Icono de ayuda contextual
 * Al hacer clic, abre el sidebar en la sección específica
 */
export function ContextHelp({
  role,
  uiContext,
  userEmail,
  userName,
  entidad,
  userId,
  size = 'md',
}: ContextHelpProps) {
  const [isOpen, setIsOpen] = useState(false)

  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6',
  }

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="inline-flex items-center justify-center p-1 text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-full transition-colors"
        aria-label="Ayuda contextual"
        title="Ver ayuda sobre esta sección"
      >
        <svg
          className={sizeClasses[size]}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      </button>

      <GuideSidebar
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        role={role}
        uiContext={uiContext}
        userEmail={userEmail || ''}
        userName={userName || ''}
        entidad={entidad}
        userId={userId}
      />
    </>
  )
}
