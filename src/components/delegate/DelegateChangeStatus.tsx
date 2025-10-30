'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

interface DelegateChangeStatusProps {
  changeRequest: {
    id: string
    status: string
    reason: string
    outgoing_delegate_name: string
    incoming_name: string
    incoming_email: string
    incoming_type: string
    requested_at: string
  }
  onboardingProgress?: {
    days_remaining: number
    user_created: boolean
    training?: {
      modules_completed: number
      test_passed: boolean
      certified: boolean
    }
  } | null
  onCancel: () => void
  onViewDetails: () => void
}

export function DelegateChangeStatus({
  changeRequest,
  onboardingProgress,
  onCancel,
  onViewDetails
}: DelegateChangeStatusProps) {
  const getStatusLabel = () => {
    switch (changeRequest.status) {
      case 'pending_onboarding':
        return 'Esperando formación del nuevo delegado'
      case 'in_transition':
        return 'Transición en curso'
      case 'completed':
        return 'Cambio completado'
      default:
        return changeRequest.status
    }
  }

  const getStatusColor = () => {
    switch (changeRequest.status) {
      case 'pending_onboarding':
        return 'border-orange-500 bg-orange-50'
      case 'in_transition':
        return 'border-blue-500 bg-blue-50'
      case 'completed':
        return 'border-green-500 bg-green-50'
      default:
        return 'border-gray-300 bg-gray-50'
    }
  }

  const getProgressSteps = () => {
    if (!onboardingProgress?.training) {
      return []
    }

    const { modules_completed, test_passed, certified } = onboardingProgress.training

    return [
      {
        label: 'Formación',
        status: modules_completed >= 6 ? 'completed' : 'in_progress',
        detail: `${modules_completed}/6 módulos completados`
      },
      {
        label: 'Test',
        status: test_passed ? 'completed' : 'pending',
        detail: test_passed ? 'Aprobado' : 'Pendiente'
      },
      {
        label: 'Certificación',
        status: certified ? 'completed' : 'pending',
        detail: certified ? 'Certificado' : 'Pendiente'
      }
    ]
  }

  return (
    <Card className={`border-2 ${getStatusColor()}`}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          Cambio de Delegado en Proceso
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Estado actual */}
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-gray-700">Estado:</span>
          <span className="text-sm font-semibold text-gray-900">{getStatusLabel()}</span>
        </div>

        {/* Delegado saliente */}
        <div className="border-t border-gray-200 pt-3">
          <p className="text-sm text-gray-600 mb-1">Delegado saliente:</p>
          <p className="font-semibold text-gray-900">{changeRequest.outgoing_delegate_name}</p>
        </div>

        {/* Nuevo delegado */}
        <div>
          <p className="text-sm text-gray-600 mb-1">Nuevo delegado:</p>
          <p className="font-semibold text-gray-900">{changeRequest.incoming_name}</p>
          <p className="text-sm text-gray-600">{changeRequest.incoming_email}</p>
        </div>

        {/* Progreso del onboarding (si aplica) */}
        {changeRequest.status === 'pending_onboarding' && onboardingProgress && (
          <div className="bg-white rounded-lg p-4 border border-gray-200">
            <h4 className="font-semibold text-gray-900 mb-3 text-sm">Progreso:</h4>

            {onboardingProgress.user_created && onboardingProgress.training ? (
              <div className="space-y-2">
                {getProgressSteps().map((step, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${
                        step.status === 'completed' ? 'bg-green-600 text-white' :
                        step.status === 'in_progress' ? 'bg-blue-600 text-white' :
                        'bg-gray-200 text-gray-600'
                      }`}>
                        {step.status === 'completed' ? '✓' : index + 1}
                      </div>
                      <span className="text-sm font-medium text-gray-700">{step.label}</span>
                    </div>
                    <span className="text-xs text-gray-600">{step.detail}</span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-gray-600">
                Esperando que el nuevo delegado acceda al enlace de formación...
              </p>
            )}

            {/* Tiempo restante */}
            <div className="mt-4 pt-3 border-t border-gray-200">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-700">Tiempo restante:</span>
                <span className={`text-sm font-semibold ${
                  onboardingProgress.days_remaining <= 7 ? 'text-red-600' :
                  onboardingProgress.days_remaining <= 15 ? 'text-orange-600' :
                  'text-green-600'
                }`}>
                  {onboardingProgress.days_remaining} días
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Transición inmediata (suplente promovido) */}
        {changeRequest.incoming_type === 'promoted_suplente' && changeRequest.status === 'completed' && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-3">
            <p className="text-sm text-green-900">
              <strong>✓ Transición completada</strong>
            </p>
            <p className="text-xs text-green-700 mt-1">
              El delegado suplente ha sido promovido a principal exitosamente.
            </p>
          </div>
        )}

        {/* Acciones */}
        <div className="flex gap-2 pt-3 border-t border-gray-200">
          <Button
            onClick={onViewDetails}
            variant="outline"
            size="sm"
            className="flex-1"
          >
            Ver Detalles
          </Button>

          {changeRequest.status !== 'completed' && (
            <Button
              onClick={onCancel}
              variant="outline"
              size="sm"
              className="flex-1 border-red-300 text-red-700 hover:bg-red-50"
            >
              Cancelar Proceso
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
