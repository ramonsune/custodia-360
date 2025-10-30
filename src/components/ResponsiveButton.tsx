/**
 * Responsive Button Component
 * Botón optimizado para táctil (min 44px) y desktop
 * Uso: <ResponsiveButton variant="primary">Texto</ResponsiveButton>
 */

import { ReactNode, ButtonHTMLAttributes } from 'react'

interface ResponsiveButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger'
  size?: 'sm' | 'md' | 'lg'
  fullWidth?: boolean
  loading?: boolean
}

export default function ResponsiveButton({
  children,
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  loading = false,
  className = '',
  disabled,
  ...props
}: ResponsiveButtonProps) {
  const baseClasses = 'rounded-lg font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center'

  const variantClasses = {
    primary: 'bg-blue-600 text-white hover:bg-blue-700',
    secondary: 'bg-gray-600 text-white hover:bg-gray-700',
    outline: 'border-2 border-blue-600 text-blue-600 hover:bg-blue-50',
    ghost: 'text-blue-600 hover:bg-blue-50',
    danger: 'bg-red-600 text-white hover:bg-red-700'
  }

  const sizeClasses = {
    sm: 'px-3 py-2 md:px-4 md:py-2 text-sm min-h-[40px]',
    md: 'px-4 py-3 md:px-6 md:py-3 text-base min-h-[48px]',
    lg: 'px-6 py-4 md:px-8 md:py-4 text-lg min-h-[52px]'
  }

  const widthClass = fullWidth ? 'w-full' : ''

  return (
    <button
      className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${widthClass} ${className}`}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? (
        <>
          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
          Cargando...
        </>
      ) : (
        children
      )}
    </button>
  )
}
