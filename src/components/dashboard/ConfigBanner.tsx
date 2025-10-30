'use client'

import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'

interface ConfigBannerProps {
  daysRemaining: number
  pendingSteps: string[]
}

export function ConfigBanner({ daysRemaining, pendingSteps }: ConfigBannerProps) {
  const router = useRouter()

  return (
    <div className="bg-orange-50 border-l-4 border-orange-500 p-4 mb-6 flex items-center justify-between rounded-r-lg shadow-sm">
      <div className="flex items-center gap-3">
        <div className="flex-shrink-0">
          <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        </div>
        <div>
          <p className="font-semibold text-orange-900">
            Tienes {pendingSteps.length} paso{pendingSteps.length > 1 ? 's' : ''} pendiente{pendingSteps.length > 1 ? 's' : ''} de configuración
          </p>
          <p className="text-sm text-orange-700">
            Quedan <strong>{daysRemaining} día{daysRemaining !== 1 ? 's' : ''}</strong> para completar: {pendingSteps.join(', ')}
          </p>
        </div>
      </div>
      <Button
        onClick={() => router.push('/delegado/configuracion-inicial')}
        className="bg-orange-600 hover:bg-orange-700 flex-shrink-0"
      >
        Completar Ahora
      </Button>
    </div>
  )
}
