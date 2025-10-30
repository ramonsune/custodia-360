/**
 * Mobile Table Wrapper
 * Añade scroll horizontal automático en móvil para tablas
 * Uso: <MobileTableWrapper><table>...</table></MobileTableWrapper>
 */

import { ReactNode } from 'react'

interface MobileTableWrapperProps {
  children: ReactNode
  className?: string
}

export default function MobileTableWrapper({
  children,
  className = ''
}: MobileTableWrapperProps) {
  return (
    <div className={`c360-table-wrap ${className}`}>
      {children}
    </div>
  )
}
