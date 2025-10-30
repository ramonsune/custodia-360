/**
 * Responsive Card Component
 * Card optimizada para móvil y desktop
 * Uso: <ResponsiveCard title="Título">Contenido</ResponsiveCard>
 */

import { ReactNode } from 'react'

interface ResponsiveCardProps {
  children: ReactNode
  title?: string
  subtitle?: string
  className?: string
  padding?: 'sm' | 'md' | 'lg'
  shadow?: boolean
}

export default function ResponsiveCard({
  children,
  title,
  subtitle,
  className = '',
  padding = 'md',
  shadow = true
}: ResponsiveCardProps) {
  const paddingClasses = {
    sm: 'p-3 md:p-4',
    md: 'p-4 md:p-6',
    lg: 'p-6 md:p-8'
  }

  const shadowClass = shadow ? 'shadow-lg' : ''

  return (
    <div className={`bg-white rounded-xl ${shadowClass} border ${paddingClasses[padding]} ${className}`}>
      {(title || subtitle) && (
        <div className="mb-4 md:mb-6">
          {title && (
            <h3 className="text-lg md:text-xl font-bold text-gray-900 mb-1">
              {title}
            </h3>
          )}
          {subtitle && (
            <p className="text-sm md:text-base text-gray-600">
              {subtitle}
            </p>
          )}
        </div>
      )}
      {children}
    </div>
  )
}
