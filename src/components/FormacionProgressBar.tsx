'use client'

import { useFormacionAuth } from '@/lib/formacion-auth-context'
import { modulos } from '@/lib/formacion-data'
import { CheckCircle, Circle, Lock } from 'lucide-react'

const etapas = [
  { id: 'bienvenida', nombre: 'Bienvenida', descripcion: 'Información del proceso' },
  { id: 'formacion', nombre: 'Formación', descripcion: 'Descarga de módulos' },
  { id: 'test', nombre: 'Evaluación', descripcion: 'Test de conocimientos' },
  { id: 'certificado', nombre: 'Certificado', descripcion: 'Certificación completada' }
]

export function FormacionProgressBar() {
  const { delegado } = useFormacionAuth()

  if (!delegado) return null

  const { progreso } = delegado
  const etapaActualIndex = etapas.findIndex(e => e.id === progreso.etapaActual)

  // Calcular progreso de formación
  const modulosDescargados = progreso.modulosDescargados.length
  const totalModulos = modulos.length
  const progresoFormacion = totalModulos > 0 ? (modulosDescargados / totalModulos) * 100 : 0

  const getEtapaEstado = (index: number) => {
    if (index < etapaActualIndex) return 'completada'
    if (index === etapaActualIndex) return 'actual'
    return 'pendiente'
  }

  const getIcono = (estado: string, etapaId: string) => {
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
          <span>{Math.round((etapaActualIndex / (etapas.length - 1)) * 100)}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-blue-600 h-2 rounded-full transition-all duration-300"
            style={{ width: `${(etapaActualIndex / (etapas.length - 1)) * 100}%` }}
          />
        </div>
      </div>

      {/* Etapas */}
      <div className="space-y-4">
        {etapas.map((etapa, index) => {
          const estado = getEtapaEstado(index)

          return (
            <div key={etapa.id} className="flex items-center space-x-4">
              {getIcono(estado, etapa.id)}
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
                {etapa.id === 'formacion' && estado !== 'pendiente' && (
                  <div className="mt-2">
                    <div className="flex justify-between text-xs text-gray-500 mb-1">
                      <span>Módulos descargados</span>
                      <span>{modulosDescargados}/{totalModulos}</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-1">
                      <div
                        className="bg-green-500 h-1 rounded-full transition-all duration-300"
                        style={{ width: `${progresoFormacion}%` }}
                      />
                    </div>
                  </div>
                )}

                {/* Información del test */}
                {etapa.id === 'test' && progreso.testCompletado && (
                  <div className="mt-2 text-sm">
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                      (progreso.puntuacionTest || 0) >= 75 ?
                      'bg-green-100 text-green-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      Puntuación: {progreso.puntuacionTest}%
                    </span>
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
