'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

interface MobileFormActionsProps {
  currentStep: number
  totalSteps: number
  nextHref?: string
  prevHref?: string
  onSubmit?: () => void
  isLastStep?: boolean
  isFormValid?: boolean
}

export default function MobileFormActions({
  currentStep,
  totalSteps,
  nextHref,
  prevHref,
  onSubmit,
  isLastStep = false,
  isFormValid = true
}: MobileFormActionsProps) {
  const [isVisible, setIsVisible] = useState(true)
  const [lastScrollY, setLastScrollY] = useState(0)

  // Auto-hide en scroll down, show en scroll up
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY

      if (currentScrollY > lastScrollY && currentScrollY > 100) {
        setIsVisible(false) // Ocultar al hacer scroll hacia abajo
      } else {
        setIsVisible(true) // Mostrar al hacer scroll hacia arriba
      }

      setLastScrollY(currentScrollY)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [lastScrollY])

  const progressPercentage = (currentStep / totalSteps) * 100

  return (
    <>
      {/* Barra flotante móvil */}
      <div className={`md:hidden fixed bottom-0 left-0 right-0 z-50 transition-transform duration-300 ${
        isVisible ? 'translate-y-0' : 'translate-y-full'
      }`}>
        <div className="bg-white border-t border-gray-200 shadow-xl p-4">
          {/* Progreso */}
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-medium text-gray-700">
              Paso {currentStep} de {totalSteps}
            </span>
            <span className="text-sm text-gray-500">
              {Math.round(progressPercentage)}% completado
            </span>
          </div>

          {/* Barra de progreso */}
          <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
            <div
              className="bg-blue-600 h-2 rounded-full transition-all duration-500 ease-out"
              style={{ width: `${progressPercentage}%` }}
            />
          </div>

          {/* Botones de navegación */}
          <div className="flex gap-3">
            {/* Botón Anterior */}
            {prevHref && currentStep > 1 && (
              <Link
                href={prevHref}
                className="flex-1 bg-gray-100 text-gray-700 py-3 px-4 rounded-lg font-medium text-center hover:bg-gray-200 transition-colors touch-manipulation"
              >
                ← Anterior
              </Link>
            )}

            {/* Botón Siguiente/Finalizar */}
            {isLastStep ? (
              <button
                onClick={onSubmit}
                disabled={!isFormValid}
                className={`flex-1 py-3 px-4 rounded-lg font-bold text-center transition-colors touch-manipulation ${
                  isFormValid
                    ? 'bg-green-600 text-white hover:bg-green-700'
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
              >
                🎉 Finalizar Contratación
              </button>
            ) : (
              nextHref && (
                <Link
                  href={nextHref}
                  className={`flex-1 py-3 px-4 rounded-lg font-bold text-center transition-colors touch-manipulation ${
                    isFormValid
                      ? 'bg-blue-600 text-white hover:bg-blue-700'
                      : 'bg-gray-300 text-gray-500 pointer-events-none'
                  }`}
                >
                  Continuar →
                </Link>
              )
            )}
          </div>

          {/* Indicadores de paso */}
          <div className="flex justify-center space-x-2 mt-3">
            {Array.from({ length: totalSteps }, (_, index) => (
              <div
                key={index}
                className={`w-2 h-2 rounded-full transition-all duration-200 ${
                  index + 1 === currentStep
                    ? 'bg-blue-600 w-6'
                    : index + 1 < currentStep
                    ? 'bg-green-600'
                    : 'bg-gray-300'
                }`}
              />
            ))}
          </div>
        </div>

        {/* Safe area para dispositivos con notch */}
        <div className="bg-white h-safe-area-inset-bottom" />
      </div>

      {/* Espaciado para compensar la barra flotante */}
      <div className="md:hidden h-32" />
    </>
  )
}

// Hook para validar formularios
export function useFormValidation(requiredFields: string[], formData: Record<string, any>) {
  const [isValid, setIsValid] = useState(false)

  useEffect(() => {
    const areAllFieldsFilled = requiredFields.every(field => {
      const value = formData[field]
      return value !== null && value !== undefined && value !== ''
    })

    setIsValid(areAllFieldsFilled)
  }, [requiredFields, formData])

  return isValid
}
