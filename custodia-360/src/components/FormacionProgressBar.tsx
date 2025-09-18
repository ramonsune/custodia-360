'use client'

import { CheckCircle, Circle, Lock } from 'lucide-react'

interface FormacionProgressBarProps {
  progreso: number
}

export function FormacionProgressBar({ progreso = 0 }: FormacionProgressBarProps) {
  const etapas = [
    { id: 'formacion', nombre: 'Formación LOPIVI', descripcion: 'Módulos de capacitación' },
    { id: 'test', nombre: 'Evaluación', descripcion: 'Test de conocimientos' },
    { id: 'certificado', nombre: 'Certificado', descripcion: 'Certificación completada' }
  ]

  const etapaActualIndex = progreso === 100 ? 2 : progreso > 0 ? 0 : 0

  const getEtapaEstado = (index: number) => {
    if (index < etapaActualIndex || (index === 0 && progreso > 0)) return 'completada'
    if (index === etapaActualIndex) return 'actual'
    return 'pendiente'
  }

  const getIcono = (estado: string) => {
    if (estado === 'completada') {
      return <CheckCircle className="w-6 h-6 text-green-600" />
    }
    if (estado === 'actual') {
      return <Circle className="w-6 h-6 text-blue-600 fill-blue-600" />
    }
    return <Lock className="w-6 h-6 text-gray-400" />
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
      <h3 className="text-lg font-semibold mb-4">Progreso de Formación</h3>

      {/* Barra de progreso general */}
      <div className="mb-6">
        <div className="flex justify-between text-sm text-gray-600 mb-2">
          <span>Progreso General</span>
          <span>{progreso}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-blue-600 h-2 rounded-full transition-all duration-300"
            style={{ width: `${progreso}%` }}
          />
        </div>
      </div>

      {/* Etapas */}
      <div className="space-y-4">
        {etapas.map((etapa, index) => {
          const estado = getEtapaEstado(index)

          return (
            <div key={etapa.id} className="flex items-center space-x-4">
              {getIcono(estado)}
              <div className="flex-1">
                <div className={`font-medium ${
                  estado === 'completada' ? 'text-green-700' :
                  estado === 'actual' ? 'text-blue-700' :
                  'text-gray-500'
                }`}>
                  {etapa.nombre}
                </div>
                <div className="text-sm text-gray-600">{etapa.descripcion}</div>

                {/* Progreso específico para la etapa de formación */}
                {etapa.id === 'formacion' && (
                  <div className="mt-2">
                    <div className="flex justify-between text-xs text-gray-500 mb-1">
                      <span>Progreso de módulos</span>
                      <span>{progreso}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-1">
                      <div
                        className="bg-green-500 h-1 rounded-full transition-all duration-300"
                        style={{ width: `${progreso}%` }}
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
