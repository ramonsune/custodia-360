'use client'

import { useState } from 'react'

interface ElementoFaltante {
  categoria: string
  faltante: string
  impacto: string
}

interface DetalleCumplimiento {
  persona?: string
  documento?: string
  faltante: string
  fechaLimite: string
  estado: string
  responsable: string
}

interface Props {
  isOpen: boolean
  onClose: () => void
  estadisticasAvanzadas: {
    cumplimiento: {
      valor: number
    }
  }
  elementosFaltantes: ElementoFaltante[]
  detallesCumplimiento: {
    [key: string]: {
      descripcion: string
      detalles: DetalleCumplimiento[]
    }
  }
}

export default function IndiceCumplimiento({
  isOpen,
  onClose,
  estadisticasAvanzadas,
  elementosFaltantes,
  detallesCumplimiento
}: Props) {
  // Estados para el flujo de páginas
  const [paginaActual, setPaginaActual] = useState<'elementos' | 'detalles' | 'accion'>('elementos')
  const [elementoSeleccionado, setElementoSeleccionado] = useState<string | null>(null)
  const [detalleSeleccionado, setDetalleSeleccionado] = useState<DetalleCumplimiento | null>(null)
  const [tipoAccion, setTipoAccion] = useState<'recordatorio' | 'reclamar' | 'completo' | null>(null)
  const [mensajePersonalizado, setMensajePersonalizado] = useState('')

  // Función para manejar click en elemento pendiente
  const handleClickElemento = (categoria: string) => {
    setElementoSeleccionado(categoria)
    setPaginaActual('detalles')
  }

  // Función para manejar click en botones de acción
  const handleAccion = (detalle: DetalleCumplimiento, tipo: 'recordatorio' | 'reclamar' | 'completo') => {
    setDetalleSeleccionado(detalle)
    setTipoAccion(tipo)

    // Generar mensaje por defecto según el tipo
    if (tipo === 'recordatorio') {
      setMensajePersonalizado(`Hola ${detalle.persona || detalle.responsable},\n\nTe recordamos que tienes pendiente: ${detalle.faltante}\n\nFecha límite: ${detalle.fechaLimite}\n\nPor favor, procede con la acción correspondiente.\n\nSaludos,\nDelegado de Protección`)
    } else if (tipo === 'reclamar') {
      setMensajePersonalizado(`Estimado/a ${detalle.persona || detalle.responsable},\n\nEste es un recordatorio URGENTE sobre el cumplimiento pendiente:\n\n${detalle.faltante}\n\nFecha límite: ${detalle.fechaLimite}\nEstado actual: ${detalle.estado}\n\nEs IMPRESCINDIBLE que completes esta acción para mantener el cumplimiento LOPIVI de la entidad.\n\nEn caso de no completarse en los próximos días, tendremos que escalarlo a la dirección.\n\nSaludos,\nDelegado de Protección`)
    } else {
      setMensajePersonalizado(`Confirmación de completado para: ${detalle.faltante}\n\nElemento marcado como completo por el Delegado de Protección.`)
    }

    setPaginaActual('accion')
  }

  // Función para ejecutar la acción
  const ejecutarAccion = () => {
    const accion = tipoAccion === 'recordatorio' ? 'recordatorio' :
                   tipoAccion === 'reclamar' ? 'reclamación' : 'completado'

    console.log(`Ejecutando ${accion} para:`, detalleSeleccionado)
    console.log(`Mensaje:`, mensajePersonalizado)

    if (tipoAccion === 'completo') {
      alert(`ELEMENTO MARCADO COMO COMPLETO\n\n${detalleSeleccionado?.persona || detalleSeleccionado?.documento}\n${detalleSeleccionado?.faltante}\n\nEl elemento ha sido actualizado en el sistema y contribuirá al porcentaje de cumplimiento.`)
    } else {
      alert(`${accion.toUpperCase()} ENVIADO\n\nDestinatario: ${detalleSeleccionado?.persona || detalleSeleccionado?.responsable}\nAsunto: ${detalleSeleccionado?.faltante}\n\nEl ${accion} ha sido registrado en el sistema.`)
    }

    // Volver a la página anterior
    setPaginaActual('detalles')
    setTipoAccion(null)
    setDetalleSeleccionado(null)
    setMensajePersonalizado('')
  }

  // Función para cerrar completamente
  const cerrarModal = () => {
    setPaginaActual('elementos')
    setElementoSeleccionado(null)
    setDetalleSeleccionado(null)
    setTipoAccion(null)
    setMensajePersonalizado('')
    onClose()
  }

  if (!isOpen) return null

  return (
    <>
      {/* Primera página: Elementos Pendientes */}
      {paginaActual === 'elementos' && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 max-w-5xl w-full mx-4 max-h-screen overflow-y-auto">
            <h3 className="text-xl font-bold mb-4">Elementos Pendientes para 100% Cumplimiento</h3>
            <div className="mb-6">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium">Progreso actual</span>
                <span className="text-lg font-bold text-blue-600">{estadisticasAvanzadas.cumplimiento.valor}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-4">
                <div className="bg-blue-600 h-4 rounded-full transition-all duration-300" style={{ width: `${estadisticasAvanzadas.cumplimiento.valor}%` }}></div>
              </div>
              <div className="text-xs text-gray-500 mt-1">Faltan {100 - estadisticasAvanzadas.cumplimiento.valor}% para completar</div>
            </div>

            <div className="space-y-4">
              {elementosFaltantes.map((elemento, index) => (
                <div key={index} className="border-l-4 border-orange-500 bg-orange-50 rounded-lg p-4 cursor-pointer hover:bg-orange-100 transition-colors"
                     onClick={() => handleClickElemento(elemento.categoria)}>
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h4 className="font-bold text-gray-900">{elemento.categoria}</h4>
                      <p className="text-sm text-gray-700 mt-1">{elemento.faltante}</p>
                      <p className="text-xs text-blue-600 mt-2 font-medium">Click para ver detalles específicos →</p>
                    </div>
                    <div className="text-right">
                      <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${
                        elemento.impacto === '5%' ? 'bg-red-200 text-red-800' :
                        elemento.impacto === '2%' ? 'bg-yellow-200 text-yellow-800' :
                        'bg-green-200 text-green-800'
                      }`}>
                        +{elemento.impacto}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="bg-green-50 rounded-lg p-4 mt-6 border border-green-200">
              <p className="text-sm text-green-800 font-medium">Al completar estos elementos alcanzarás el 100% de cumplimiento LOPIVI</p>
            </div>

            <div className="flex justify-end mt-6">
              <button onClick={cerrarModal} className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition-colors">Cerrar</button>
            </div>
          </div>
        </div>
      )}

      {/* Segunda página: Detalles Específicos */}
      {paginaActual === 'detalles' && elementoSeleccionado && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[60]">
          <div className="bg-white rounded-xl p-6 max-w-4xl w-full mx-4 max-h-screen overflow-y-auto">
            <h3 className="text-xl font-bold mb-4">Detalles: {elementoSeleccionado}</h3>
            <p className="text-gray-600 mb-6">{detallesCumplimiento[elementoSeleccionado]?.descripcion}</p>

            <div className="space-y-4">
              {detallesCumplimiento[elementoSeleccionado]?.detalles.map((detalle, index) => (
                <div key={index} className="border border-gray-200 rounded-lg p-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <h5 className="font-bold text-gray-900">{detalle.persona || detalle.documento}</h5>
                      <p className="text-sm text-gray-600 mt-1">{detalle.faltante}</p>
                      <p className="text-xs text-gray-500 mt-2">
                        <strong>Fecha límite:</strong> {detalle.fechaLimite}
                      </p>
                    </div>

                    <div className="text-right">
                      <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium mb-2 ${
                        detalle.estado.includes('Crítico') ? 'bg-red-100 text-red-800' :
                        detalle.estado.includes('progreso') ? 'bg-yellow-100 text-yellow-800' :
                        detalle.estado.includes('revisión') || detalle.estado.includes('programada') ? 'bg-blue-100 text-blue-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {detalle.estado}
                      </span>
                      <p className="text-xs text-gray-600">
                        <strong>Responsable:</strong> {detalle.responsable}
                      </p>

                      <div className="mt-3 flex gap-2 justify-end">
                        <button
                          onClick={() => handleAccion(detalle, 'recordatorio')}
                          className="bg-blue-100 text-blue-800 px-3 py-1 rounded text-xs hover:bg-blue-200 transition-colors font-medium"
                        >
                          Recordatorio
                        </button>
                        <button
                          onClick={() => handleAccion(detalle, 'reclamar')}
                          className="bg-orange-100 text-orange-800 px-3 py-1 rounded text-xs hover:bg-orange-200 transition-colors font-medium"
                        >
                          Reclamar
                        </button>
                        <button
                          onClick={() => handleAccion(detalle, 'completo')}
                          className="bg-green-100 text-green-800 px-3 py-1 rounded text-xs hover:bg-green-200 transition-colors font-medium"
                        >
                          Completo
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex justify-end gap-2 mt-6">
              <button
                onClick={() => setPaginaActual('elementos')}
                className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition-colors"
              >
                Volver
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Tercera página: Página de Acción */}
      {paginaActual === 'accion' && detalleSeleccionado && tipoAccion && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[70]">
          <div className="bg-white rounded-xl p-6 max-w-3xl w-full mx-4 max-h-screen overflow-y-auto">
            <h3 className="text-xl font-bold mb-4">
              {tipoAccion === 'recordatorio' && 'Enviar Recordatorio'}
              {tipoAccion === 'reclamar' && 'Enviar Reclamación'}
              {tipoAccion === 'completo' && 'Marcar como Completo'}
            </h3>

            {/* Información del elemento */}
            <div className="bg-gray-50 rounded-lg p-4 mb-6">
              <h4 className="font-bold text-gray-900 mb-2">Información del elemento</h4>
              <p><strong>Responsable:</strong> {detalleSeleccionado.persona || detalleSeleccionado.responsable}</p>
              <p><strong>Pendiente:</strong> {detalleSeleccionado.faltante}</p>
              <p><strong>Fecha límite:</strong> {detalleSeleccionado.fechaLimite}</p>
              <p><strong>Estado actual:</strong> {detalleSeleccionado.estado}</p>
            </div>

            {/* Información para delegado y suplente */}
            <div className="bg-blue-50 rounded-lg p-4 mb-6 border border-blue-200">
              <h4 className="font-bold text-blue-900 mb-3">Información para Delegado y Suplente</h4>

              {tipoAccion === 'recordatorio' && (
                <div className="space-y-2 text-sm text-blue-800">
                  <p><strong>¿Qué es un recordatorio?</strong> Un aviso amigable para recordar al responsable sobre una tarea pendiente.</p>
                  <p><strong>Cuándo usar:</strong> Cuando la fecha límite se acerca o ya se ha pasado, pero no es crítico.</p>
                  <p><strong>Efecto:</strong> Se enviará un email automático al responsable con los detalles del pendiente.</p>
                </div>
              )}

              {tipoAccion === 'reclamar' && (
                <div className="space-y-2 text-sm text-orange-800">
                  <p><strong>¿Qué es una reclamación?</strong> Un recordatorio urgente con tono más formal para casos críticos.</p>
                  <p><strong>Cuándo usar:</strong> Cuando el plazo ha vencido y afecta significativamente al cumplimiento.</p>
                  <p><strong>Efecto:</strong> Se enviará un email con prioridad alta y se registrará como escalación formal.</p>
                </div>
              )}

              {tipoAccion === 'completo' && (
                <div className="space-y-2 text-sm text-green-800">
                  <p><strong>¿Qué significa marcar como completo?</strong> Confirmar que la tarea ha sido realizada satisfactoriamente.</p>
                  <p><strong>Cuándo usar:</strong> Cuando hayas verificado que el pendiente se ha resuelto correctamente.</p>
                  <p><strong>Efecto:</strong> El elemento se eliminará de pendientes y mejorará el % de cumplimiento.</p>
                </div>
              )}
            </div>

            {/* Campo de mensaje personalizable */}
            {tipoAccion !== 'completo' && (
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Mensaje personalizado:
                </label>
                <textarea
                  value={mensajePersonalizado}
                  onChange={(e) => setMensajePersonalizado(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  rows={8}
                  placeholder="Personaliza el mensaje que se enviará..."
                />
              </div>
            )}

            {/* Acciones */}
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setPaginaActual('detalles')}
                className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={ejecutarAccion}
                className={`px-4 py-2 rounded-lg text-white transition-colors ${
                  tipoAccion === 'recordatorio' ? 'bg-blue-600 hover:bg-blue-700' :
                  tipoAccion === 'reclamar' ? 'bg-orange-600 hover:bg-orange-700' :
                  'bg-green-600 hover:bg-green-700'
                }`}
              >
                {tipoAccion === 'recordatorio' && 'Enviar Recordatorio'}
                {tipoAccion === 'reclamar' && 'Enviar Reclamación'}
                {tipoAccion === 'completo' && 'Marcar como Completo'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
