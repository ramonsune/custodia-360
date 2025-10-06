'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

interface SessionData {
  id: string
  nombre: string
  email: string
  tipo: 'principal' | 'suplente'
  entidad: string
  permisos: string[]
  certificacionVigente: boolean
  inicioSesion: string
  expiracion: string
}

interface NuevoCaso {
  tipo: string
  descripcion: string
  prioridad: 'baja' | 'media' | 'alta' | 'critica'
  involucrados: string
  fechaIncidente: string
  ubicacion: string
  accionesInmediatas: string
  observaciones: string
  testigos: string

  comunicacionFamilia: boolean
  comunicacionAutoridades: boolean
}

export default function NuevoCasoPage() {
  const router = useRouter()
  const [sessionData, setSessionData] = useState<SessionData | null>(null)
  const [loading, setLoading] = useState(true)
  const [guardando, setGuardando] = useState(false)
  const [nuevoCaso, setNuevoCaso] = useState<NuevoCaso>({
    tipo: '',
    descripcion: '',
    prioridad: 'media',
    involucrados: '',
    fechaIncidente: new Date().toISOString().split('T')[0],
    ubicacion: '',
    accionesInmediatas: '',
    observaciones: '',
    testigos: '',
    comunicacionFamilia: false,
    comunicacionAutoridades: false
  })

  const checkSession = (): SessionData | null => {
    try {
      const persistentSession = localStorage.getItem('userSession')
      if (persistentSession) {
        const session = JSON.parse(persistentSession)
        if (new Date(session.expiracion) > new Date()) {
          return session
        }
      }
      const tempSession = sessionStorage.getItem('userSession')
      if (tempSession) {
        const session = JSON.parse(tempSession)
        if (new Date(session.expiracion) > new Date()) {
          return session
        }
      }
      return null
    } catch (error) {
      console.error('Error verificando sesión:', error)
      return null
    }
  }

  useEffect(() => {
    const session = checkSession()
    if (!session || (session.tipo !== 'principal' && session.tipo !== 'suplente')) {
      router.push('/login')
      return
    }

    setSessionData(session)
    setLoading(false)
  }, [router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!nuevoCaso.tipo || !nuevoCaso.descripcion) {
      alert('Por favor completa los campos obligatorios (tipo y descripción)')
      return
    }

    setGuardando(true)

    try {
      // Simular proceso de guardado con pasos
      await new Promise(resolve => setTimeout(resolve, 800))

      const casoId = `CASO-2025-${String(Math.floor(Math.random() * 999) + 1).padStart(3, '0')}`
      const fechaRegistro = new Date()

      // Crear objeto completo del caso
      const casoCompleto = {
        ...nuevoCaso,
        id: casoId,
        delegado: sessionData?.nombre,
        entidad: sessionData?.entidad,
        fechaRegistro: fechaRegistro.toISOString(),
        estado: 'activo',
        numeroExpediente: `EXP-${fechaRegistro.getFullYear()}-${String(Math.floor(Math.random() * 9999) + 1).padStart(4, '0')}`
      }

      // Simular guardado en base de datos
      await new Promise(resolve => setTimeout(resolve, 700))

      // Almacenar en localStorage para persistencia (en producción sería base de datos)
      const casosExistentes = JSON.parse(localStorage.getItem('casos_delegado') || '[]')
      casosExistentes.push(casoCompleto)
      localStorage.setItem('casos_delegado', JSON.stringify(casosExistentes))

      console.log('Nuevo caso registrado:', casoCompleto)

      // Programar seguimiento automático basado en prioridad
      const diasSeguimiento = nuevoCaso.prioridad === 'alta' ? 1 : nuevoCaso.prioridad === 'media' ? 3 : 7
      const fechaSeguimiento = new Date()
      fechaSeguimiento.setDate(fechaSeguimiento.getDate() + diasSeguimiento)

      // Crear recordatorio de seguimiento automático
      const recordatorioSeguimiento = {
        id: `seguimiento_${casoId}`,
        titulo: `Seguimiento del caso: ${nuevoCaso.tipo}`,
        descripcion: `Revisión programada del caso ${casoId} según protocolo LOPIVI`,
        fechaVencimiento: fechaSeguimiento.toISOString().split('T')[0],
        casoRelacionado: casoId,
        prioridad: nuevoCaso.prioridad,
        tipo: 'seguimiento_caso',
        estado: 'pendiente'
      }

      // Guardar recordatorio en localStorage
      const recordatoriosExistentes = JSON.parse(localStorage.getItem('recordatorios_seguimiento') || '[]')
      recordatoriosExistentes.push(recordatorioSeguimiento)
      localStorage.setItem('recordatorios_seguimiento', JSON.stringify(recordatoriosExistentes))

      // Mostrar confirmación detallada con información de seguimiento
      const confirmacionMensaje = `
        ✅ CASO REGISTRADO EXITOSAMENTE

        📋 INFORMACIÓN DEL CASO:
        • Número de caso: ${casoId}
        • Expediente: ${casoCompleto.numeroExpediente}
        • Tipo: ${nuevoCaso.tipo}
        • Prioridad: ${nuevoCaso.prioridad.toUpperCase()}
        • Fecha registro: ${fechaRegistro.toLocaleDateString('es-ES')} ${fechaRegistro.toLocaleTimeString('es-ES')}

        📅 SEGUIMIENTO PROGRAMADO:
        • Próxima revisión: ${fechaSeguimiento.toLocaleDateString('es-ES')}
        • Recordatorio automático activado
        ${nuevoCaso.prioridad === 'alta' ? '• ⚠️ ALTA PRIORIDAD: Revisión en 24 horas' : ''}
        ${nuevoCaso.prioridad === 'media' ? '• 📋 MEDIA PRIORIDAD: Revisión en 3 días' : ''}
        ${nuevoCaso.prioridad === 'baja' ? '• 📝 BAJA PRIORIDAD: Revisión en 7 días' : ''}

        🔄 PRÓXIMOS PASOS:
        - El caso aparece inmediatamente en "Casos Activos"
        - Sistema de seguimiento automático activado
        - Expediente generado automáticamente
        ${nuevoCaso.comunicacionAutoridades ? '- Seguimiento con autoridades requerido' : ''}
        ${nuevoCaso.comunicacionFamilia ? '- Seguimiento con familia programado' : ''}

        El sistema te notificará cuando sea necesario hacer seguimiento del caso.
      `

      alert(confirmacionMensaje)

      // Redirigir al dashboard
      router.push('/dashboard-delegado?tab=casos&nuevo=' + casoId)

    } catch (error) {
      console.error('Error al guardar caso:', error)
      alert('Error al registrar el caso. Inténtalo nuevamente.')
    } finally {
      setGuardando(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-orange-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando formulario...</p>
        </div>
      </div>
    )
  }

  if (!sessionData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">Error de autenticación</p>
          <Link href="/login" className="bg-orange-600 text-white px-4 py-2 rounded-lg">
            Volver al Login
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <Link
                href="/dashboard-delegado"
                className="mr-4 text-gray-600 hover:text-gray-900 transition-colors"
              >
                ← Volver al Dashboard
              </Link>
              <div className={`w-12 h-12 rounded-lg flex items-center justify-center mr-4 ${
                sessionData.tipo === 'principal' ? 'bg-blue-600' : 'bg-green-600'
              }`}>
                <span className="text-white font-bold text-xl">
                  {sessionData.tipo === 'principal' ? 'DP' : 'DS'}
                </span>
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Registrar Nuevo Caso</h1>
                <p className="text-sm text-gray-600">
                  {sessionData.nombre} • {sessionData.entidad}
                </p>
              </div>
            </div>
            <div className="text-right text-sm text-gray-500">
              <div>Fecha: {new Date().toLocaleDateString('es-ES')}</div>
              <div>Hora: {new Date().toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })}</div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Formulario Principal */}
        <div className="bg-white rounded-xl shadow-sm p-8">
          <div className="mb-8">
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mr-4">
                <span className="text-orange-600 text-xl font-bold">NC</span>
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900">Información del Caso</h2>
                <p className="text-gray-600">Completa todos los campos relevantes para el caso</p>
              </div>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
              <h3 className="font-bold text-blue-900 mb-3">Cómo catalogar la prioridad como Delegado Principal</h3>
              <div className="grid md:grid-cols-3 gap-4">
                <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                  <h4 className="font-semibold text-red-800 mb-2">PRIORIDAD ALTA</h4>
                  <ul className="text-red-700 text-xs space-y-1">
                    <li>• Situación de riesgo inmediato</li>
                    <li>• Requiere notificación a autoridades</li>
                    <li>• Contacto inapropiado confirmado</li>
                    <li>• Emergencia que requiere actuación</li>
                    <li>• Violación grave de protocolos</li>
                  </ul>
                </div>
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                  <h4 className="font-semibold text-yellow-800 mb-2">PRIORIDAD MEDIA</h4>
                  <ul className="text-yellow-700 text-xs space-y-1">
                    <li>• Comportamiento preocupante</li>
                    <li>• Incumplimiento de protocolos</li>
                    <li>• Necesita investigación</li>
                    <li>• Coordinación con suplente</li>
                    <li>• Formación adicional requerida</li>
                  </ul>
                </div>
                <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                  <h4 className="font-semibold text-green-800 mb-2">PRIORIDAD BAJA</h4>
                  <ul className="text-green-700 text-xs space-y-1">
                    <li>• Observación preventiva</li>
                    <li>• Mejora de protocolos</li>
                    <li>• Seguimiento rutinario</li>
                    <li>• Consulta administrativa</li>
                    <li>• Documentación general</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Información Básica */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Información Básica</h3>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tipo de Caso *
                  </label>
                  <select
                    value={nuevoCaso.tipo}
                    onChange={(e) => setNuevoCaso({...nuevoCaso, tipo: e.target.value})}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                    required
                  >
                    <option value="">Seleccionar tipo</option>
                    <optgroup label="Casos Críticos">
                      <option value="Sospecha de maltrato físico">Sospecha de maltrato físico</option>
                      <option value="Sospecha de abuso sexual">Sospecha de abuso sexual</option>
                      <option value="Negligencia grave">Negligencia grave</option>
                      <option value="Violencia entre menores">Violencia entre menores</option>
                    </optgroup>
                    <optgroup label="Situaciones de Riesgo">
                      <option value="Cambio comportamiento significativo">Cambio comportamiento significativo</option>
                      <option value="Indicadores físicos menores">Indicadores físicos menores</option>
                      <option value="Relato preocupante">Relato preocupante</option>
                      <option value="Situación familiar conflictiva">Situación familiar conflictiva</option>
                    </optgroup>
                    <optgroup label="Gestión Administrativa">
                      <option value="Comunicación familia">Comunicación familia</option>
                      <option value="Formación personal">Formación personal</option>
                      <option value="Revisión protocolo">Revisión protocolo</option>
                      <option value="Consulta normativa">Consulta normativa</option>
                    </optgroup>
                    <optgroup label="Otros">
                      <option value="Incidente menor">Incidente menor</option>
                      <option value="Consulta preventiva">Consulta preventiva</option>
                      <option value="Otros">Otros</option>
                    </optgroup>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Fecha del Incidente *
                  </label>
                  <input
                    type="date"
                    value={nuevoCaso.fechaIncidente}
                    onChange={(e) => setNuevoCaso({...nuevoCaso, fechaIncidente: e.target.value})}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Ubicación del Incidente
                  </label>
                  <input
                    type="text"
                    value={nuevoCaso.ubicacion}
                    onChange={(e) => setNuevoCaso({...nuevoCaso, ubicacion: e.target.value})}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                    placeholder="Ej: Aula 2B, Patio principal, Vestuarios..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Prioridad *
                  </label>
                  <select
                    value={nuevoCaso.prioridad}
                    onChange={(e) => setNuevoCaso({...nuevoCaso, prioridad: e.target.value as any})}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                  >
                    <option value="critica">Crítica - Riesgo inmediato</option>
                    <option value="alta">Alta - Requiere atención urgente</option>
                    <option value="media">Media - Seguimiento necesario</option>
                    <option value="baja">Baja - Rutinario</option>
                  </select>

                  {/* Guía de Clasificación de Prioridades según LOPIVI */}
                  <div className="mt-3 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                    <details className="cursor-pointer">
                      <summary className="font-medium text-blue-800 hover:text-blue-900">
                        Guía de Clasificación de Prioridades (según LOPIVI)
                      </summary>
                      <div className="mt-3 space-y-3 text-sm">
                        <div className="border-l-4 border-red-500 pl-3">
                          <h4 className="font-semibold text-red-700">CRÍTICA (Art. 15 y 16 LOPIVI)</h4>
                          <ul className="text-red-600 mt-1 space-y-1">
                            <li>• Sospecha fundada de maltrato físico grave</li>
                            <li>• Sospecha de abuso sexual</li>
                            <li>• Negligencia que ponga en riesgo la vida del menor</li>
                            <li>• Violencia física entre menores con lesiones</li>
                            <li>• Cualquier situación que requiera intervención inmediata de autoridades</li>
                          </ul>
                          <p className="text-xs text-red-500 mt-1 font-medium">
                            Comunicación obligatoria inmediata a Fiscalía de Menores y/o Servicios Sociales
                          </p>
                        </div>

                        <div className="border-l-4 border-orange-500 pl-3">
                          <h4 className="font-semibold text-orange-700">ALTA (Art. 13 LOPIVI)</h4>
                          <ul className="text-orange-600 mt-1 space-y-1">
                            <li>• Indicadores físicos de posible maltrato (moratones, marcas)</li>
                            <li>• Cambios conductuales abruptos y significativos</li>
                            <li>• Relatos del menor sobre situaciones preocupantes</li>
                            <li>• Incidentes repetidos que requieran documentación</li>
                            <li>• Conflictos familiares que afecten al bienestar del menor</li>
                          </ul>
                          <p className="text-xs text-orange-500 mt-1 font-medium">
                            Comunicación en plazo máximo de 24 horas
                          </p>
                        </div>

                        <div className="border-l-4 border-yellow-500 pl-3">
                          <h4 className="font-semibold text-yellow-700">MEDIA (Art. 7 LOPIVI)</h4>
                          <ul className="text-yellow-600 mt-1 space-y-1">
                            <li>• Incidentes menores sin riesgo aparente</li>
                            <li>• Consultas preventivas de familias</li>
                            <li>• Seguimiento de casos previamente resueltos</li>
                            <li>• Comunicaciones rutinarias con autoridades</li>
                            <li>• Formación y actualización de protocolos</li>
                          </ul>
                          <p className="text-xs text-yellow-500 mt-1 font-medium">
                            Seguimiento según protocolo interno
                          </p>
                        </div>

                        <div className="border-l-4 border-green-500 pl-3">
                          <h4 className="font-semibold text-green-700">BAJA (Gestión Administrativa)</h4>
                          <ul className="text-green-600 mt-1 space-y-1">
                            <li>• Actualizaciones de documentación</li>
                            <li>• Renovación de certificados</li>
                            <li>• Consultas informativas generales</li>
                            <li>• Gestión de personal y formación</li>
                            <li>• Actividades preventivas programadas</li>
                          </ul>
                          <p className="text-xs text-green-500 mt-1 font-medium">
                            Sin urgencia temporal específica
                          </p>
                        </div>

                        <div className="bg-gray-100 p-3 rounded mt-3">
                          <h5 className="font-semibold text-gray-800 mb-2">Referencias Legales:</h5>
                          <ul className="text-xs text-gray-600 space-y-1">
                            <li>• <strong>Art. 15 LOPIVI:</strong> Obligación de comunicación inmediata</li>
                            <li>• <strong>Art. 16 LOPIVI:</strong> Protocolos de actuación ante sospechas</li>
                            <li>• <strong>Art. 13 LOPIVI:</strong> Medidas de protección y seguimiento</li>
                            <li>• <strong>Art. 7 LOPIVI:</strong> Prevención y sensibilización</li>
                          </ul>
                        </div>
                      </div>
                    </details>
                  </div>
                </div>
              </div>
            </div>

            {/* Descripción Detallada */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Descripción Detallada</h3>
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Descripción del Caso *
                  </label>
                  <textarea
                    value={nuevoCaso.descripcion}
                    onChange={(e) => setNuevoCaso({...nuevoCaso, descripcion: e.target.value})}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                    rows={5}
                    placeholder="Describe la situación de forma objetiva y detallada. Incluye: qué sucedió, cuándo, dónde, quién estaba presente..."
                    required
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Importante: Mantén la objetividad. Registra solo hechos observables, no interpretaciones.
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Personas Involucradas
                  </label>
                  <textarea
                    value={nuevoCaso.involucrados}
                    onChange={(e) => setNuevoCaso({...nuevoCaso, involucrados: e.target.value})}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                    rows={3}
                    placeholder="Lista las personas involucradas: menores, personal, familias... (Usa iniciales si es necesario para proteger identidades)"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Testigos
                  </label>
                  <textarea
                    value={nuevoCaso.testigos}
                    onChange={(e) => setNuevoCaso({...nuevoCaso, testigos: e.target.value})}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                    rows={2}
                    placeholder="Personas que presenciaron el incidente o que pueden aportar información relevante..."
                  />
                </div>
              </div>
            </div>

            {/* Acciones y Comunicaciones */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Acciones y Comunicaciones</h3>
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Acciones Inmediatas Tomadas
                  </label>
                  <textarea
                    value={nuevoCaso.accionesInmediatas}
                    onChange={(e) => setNuevoCaso({...nuevoCaso, accionesInmediatas: e.target.value})}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                    rows={4}
                    placeholder="Describe las medidas adoptadas inmediatamente: separación de personas, atención médica, contactos realizados..."
                  />
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div className="flex items-center p-4 border border-gray-300 rounded-lg">
                    <input
                      type="checkbox"
                      id="comunicacionFamilia"
                      checked={nuevoCaso.comunicacionFamilia}
                      onChange={(e) => setNuevoCaso({...nuevoCaso, comunicacionFamilia: e.target.checked})}
                      className="h-4 w-4 text-orange-600 focus:ring-orange-500 border-gray-300 rounded"
                    />
                    <label htmlFor="comunicacionFamilia" className="ml-3 text-sm font-medium text-gray-700">
                      Se ha comunicado a la familia
                    </label>
                  </div>

                  <div className="flex items-center p-4 border border-gray-300 rounded-lg">
                    <input
                      type="checkbox"
                      id="comunicacionAutoridades"
                      checked={nuevoCaso.comunicacionAutoridades}
                      onChange={(e) => setNuevoCaso({...nuevoCaso, comunicacionAutoridades: e.target.checked})}
                      className="h-4 w-4 text-orange-600 focus:ring-orange-500 border-gray-300 rounded"
                    />
                    <label htmlFor="comunicacionAutoridades" className="ml-3 text-sm font-medium text-gray-700">
                      Se ha contactado con autoridades
                    </label>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Observaciones Adicionales
                  </label>
                  <textarea
                    value={nuevoCaso.observaciones}
                    onChange={(e) => setNuevoCaso({...nuevoCaso, observaciones: e.target.value})}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                    rows={3}
                    placeholder="Cualquier información adicional relevante para el seguimiento del caso..."
                  />
                </div>
              </div>
            </div>

            {/* Botones de Acción */}
            <div className="flex gap-4 pt-6 border-t border-gray-200">
              <Link
                href="/dashboard-delegado"
                className="flex-1 bg-gray-200 text-gray-700 px-6 py-3 rounded-lg font-medium hover:bg-gray-300 transition-colors text-center"
              >
                Cancelar
              </Link>
              <button
                type="submit"
                disabled={guardando || !nuevoCaso.tipo || !nuevoCaso.descripcion}
                className="flex-1 bg-orange-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-orange-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                {guardando ? (
                  <div className="flex items-center justify-center">
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                    Registrando Caso...
                  </div>
                ) : (
                  'Registrar Caso'
                )}
              </button>
            </div>
          </form>
        </div>

        {/* Información de Ayuda */}
        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h4 className="font-semibold text-blue-800 mb-3">Recordatorios Importantes</h4>
          <div className="grid md:grid-cols-2 gap-4 text-sm text-blue-700">
            <div>
              <h5 className="font-medium mb-2">Documentación:</h5>
              <ul className="space-y-1">
                <li>• Mantén la objetividad en las descripciones</li>
                <li>• Registra solo hechos observables</li>
                <li>• Usa palabras textuales cuando sea relevante</li>
                <li>• Anota fecha y hora exactas</li>
              </ul>
            </div>
            <div>
              <h5 className="font-medium mb-2">Confidencialidad:</h5>
              <ul className="space-y-1">
                <li>• Protege la identidad de los menores</li>
                <li>• Comparte solo información necesaria</li>
                <li>• Usa iniciales cuando sea posible</li>
                <li>• Guarda la documentación de forma segura</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
