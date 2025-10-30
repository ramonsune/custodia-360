'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'

interface ConfigState {
  channel_done: boolean
  channel_postponed: boolean
  penales_done: boolean
  penales_postponed: boolean
  deadline_at: string | null
  blocked: boolean
}

export default function AvisoConfigInicial({ entity_id }: { entity_id: string }) {
  const [state, setState] = useState<ConfigState | null>(null)
  const [daysRemaining, setDaysRemaining] = useState<number | null>(null)

  useEffect(() => {
    if (entity_id) {
      loadState()
    }
  }, [entity_id])

  async function loadState() {
    try {
      const res = await fetch(`/api/delegado/config/init?entity_id=${entity_id}`)
      const data = await res.json()

      if (data.ok && data.compliance) {
        setState(data.compliance)

        // Calcular días restantes
        if (data.compliance.deadline_at) {
          const deadline = new Date(data.compliance.deadline_at)
          const now = new Date()
          const diff = deadline.getTime() - now.getTime()
          const days = Math.ceil(diff / (1000 * 60 * 60 * 24))
          setDaysRemaining(days)
        }
      }
    } catch (err) {
      console.error('Error cargando estado config:', err)
    }
  }

  if (!state) return null

  const pendientes: string[] = []
  if (!state.channel_done && state.channel_postponed) pendientes.push('Canal de comunicación')
  if (!state.penales_done && state.penales_postponed) pendientes.push('Certificado de penales')

  if (pendientes.length === 0) return null

  // Si el plazo venció, mostrar banner crítico
  if (daysRemaining !== null && daysRemaining <= 0) {
    return (
      <div className="bg-red-50 border-l-4 border-red-600 p-4 mb-6">
        <div className="flex items-start gap-3">
          <span className="text-red-600 text-2xl flex-shrink-0">🚨</span>
          <div className="flex-1">
            <h3 className="text-lg font-bold text-red-900 mb-1">
              Plazo vencido - Acción requerida
            </h3>
            <p className="text-red-800 mb-3">
              Has superado el plazo de 30 días para completar: <strong>{pendientes.join(', ')}</strong>
            </p>
            <Link
              href="/delegado/configuracion-inicial"
              className="inline-block px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-semibold"
            >
              Completar ahora
            </Link>
          </div>
        </div>
      </div>
    )
  }

  // Banner de advertencia con contador
  return (
    <div className="bg-yellow-50 border-l-4 border-yellow-600 p-4 mb-6">
      <div className="flex items-start gap-3">
        <span className="text-yellow-600 text-2xl flex-shrink-0">⏰</span>
        <div className="flex-1">
          <h3 className="text-lg font-bold text-yellow-900 mb-1">
            Configuración pendiente
          </h3>
          <p className="text-yellow-800 mb-3">
            Quedan <strong className="text-xl">{daysRemaining}</strong> días para completar: <strong>{pendientes.join(', ')}</strong>
          </p>
          <Link
            href="/delegado/configuracion-inicial"
            className="inline-block px-6 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors font-semibold"
          >
            Completar ahora
          </Link>
        </div>
      </div>
    </div>
  )
}
