'use client'

import { useState } from 'react'

interface PersonaConCertificado {
  id: string
  nombre: string
  rol: string
  fechaEntrega: string
  proximaRenovacion: string
  diasParaRenovacion: number
  numeroCertificado: string
  estadoValidez: 'vigente' | 'proxima_renovacion' | 'vencido'
}

interface PersonaSinCertificado {
  id: string
  nombre: string
  rol: string
  fechaLimite: string
  diasRestantes: number
  comunicaciones: Array<{
    fecha: string
    tipo: 'email' | 'telefono' | 'presencial'
    descripcion: string
  }>
  estadoUrgencia: 'normal' | 'urgente' | 'critico'
}

interface GestionDocumentacionProps {
  entidadId: string
  isOpen: boolean
  onClose: () => void
}

export default function GestionDocumentacion({ entidadId, isOpen, onClose }: GestionDocumentacionProps) {
  const [activeSection, setActiveSection] = useState<'con_certificado' | 'sin_certificado' | null>(null)

  // Datos simulados - personas con certificado entregado
  const personasConCertificado: PersonaConCertificado[] = [
    {
      id: 'cert_001',
      nombre: 'Juan Carlos Pérez Ruiz',
      rol: 'Delegado Principal',
      fechaEntrega: '2024-01-15',
      proximaRenovacion: '2029-01-15',
      diasParaRenovacion: 1825,
      numeroCertificado: 'CP-2024-001578',
      estadoValidez: 'vigente'
    },
    {
      id: 'cert_002',
      nombre: 'María López Martín',
      rol: 'Delegada Suplente',
      fechaEntrega: '2024-01-10',
      proximaRenovacion: '2029-01-10',
      diasParaRenovacion: 1820,
      numeroCertificado: 'CP-2024-001523',
      estadoValidez: 'vigente'
    },
    {
      id: 'cert_003',
      nombre: 'Pedro García Fernández',
      rol: 'Entrenador Principal',
      fechaEntrega: '2023-11-20',
      proximaRenovacion: '2028-11-20',
      diasParaRenovacion: 1460,
      numeroCertificado: 'CP-2023-012456',
      estadoValidez: 'vigente'
    },
    {
      id: 'cert_004',
      nombre: 'Ana Martínez González',
      rol: 'Monitora',
      fechaEntrega: '2023-06-15',
      proximaRenovacion: '2028-06-15',
      diasParaRenovacion: 1302,
      numeroCertificado: 'CP-2023-008934',
      estadoValidez: 'vigente'
    },
    {
      id: 'cert_005',
      nombre: 'Carlos Ruiz Jiménez',
      rol: 'Monitor',
      fechaEntrega: '2024-11-01',
      proximaRenovacion: '2029-11-01',
      diasParaRenovacion: 2115,
      numeroCertificado: 'CP-2024-015623',
      estadoValidez: 'vigente'
    },
    {
      id: 'cert_006',
      nombre: 'Elena Santos Vega',
      rol: 'Entrenadora',
      fechaEntrega: '2023-03-10',
      proximaRenovacion: '2028-03-10',
      diasParaRenovacion: 1205,
      numeroCertificado: 'CP-2023-005678',
      estadoValidez: 'vigente'
    }
  ]

  // Datos simulados - personas sin certificado
  const personasSinCertificado: PersonaSinCertificado[] = [
    {
      id: 'sin_cert_001',
      nombre: 'Roberto Díaz Moreno',
      rol: 'Monitor Auxiliar',
      fechaLimite: '2024-02-15',
      diasRestantes: 25,
      estadoUrgencia: 'urgente',
      comunicaciones: [
        {
          fecha: '2024-01-05',
          tipo: 'email',
          descripcion: 'Primer recordatorio enviado por email solicitando documentación de idoneidad requerida'
        },
        {
          fecha: '2024-01-12',
          tipo: 'telefono',
          descripcion: 'Llamada telefónica recordando la obligatoriedad de la documentación y fecha límite'
        },
        {
          fecha: '2024-01-18',
          tipo: 'email',
          descripcion: 'Segundo recordatorio por email con urgencia ALTA - quedan pocos días'
        }
      ]
    },
    {
      id: 'sin_cert_002',
      nombre: 'Laura Jiménez Torres',
      rol: 'Personal de Limpieza',
      fechaLimite: '2024-02-20',
      diasRestantes: 30,
      estadoUrgencia: 'normal',
      comunicaciones: [
        {
          fecha: '2024-01-10',
          tipo: 'presencial',
          descripcion: 'Reunión presencial informando sobre obligatoriedad del certificado según LOPIVI'
        },
        {
          fecha: '2024-01-15',
          tipo: 'email',
          descripcion: 'Envío de información detallada sobre cómo obtener el certificado'
        }
      ]
    },
    {
      id: 'sin_cert_003',
      nombre: 'Miguel Herrera Ruiz',
      rol: 'Entrenador Temporal',
      fechaLimite: '2024-02-01',
      diasRestantes: 11,
      estadoUrgencia: 'critico',
      comunicaciones: [
        {
          fecha: '2023-12-20',
          tipo: 'email',
          descripcion: 'Primer recordatorio al incorporarse a la entidad'
        },
        {
          fecha: '2024-01-05',
          tipo: 'telefono',
          descripcion: 'Llamada urgente recordando la fecha límite'
        },
        {
          fecha: '2024-01-15',
          tipo: 'presencial',
          descripcion: 'Reunión presencial URGENTE - Advertencia de suspensión si no entrega'
        },
        {
          fecha: '2024-01-18',
          tipo: 'email',
          descripcion: 'ÚLTIMA ADVERTENCIA - Suspensión automática si no entrega antes del 1 de febrero'
        }
      ]
    }
  ]

  const getEstadoColor = (estado: string) => {
    switch (estado) {
      case 'vigente': return 'text-green-600 bg-green-50 border-green-200'
      case 'proxima_renovacion': return 'text-yellow-600 bg-yellow-50 border-yellow-200'
      case 'vencido': return 'text-red-600 bg-red-50 border-red-200'
      default: return 'text-gray-600 bg-gray-50 border-gray-200'
    }
  }

  const getUrgenciaColor = (urgencia: string) => {
    switch (urgencia) {
      case 'critico': return 'text-red-600 bg-red-50 border-red-200'
      case 'urgente': return 'text-orange-600 bg-orange-50 border-orange-200'
      case 'normal': return 'text-blue-600 bg-blue-50 border-blue-200'
      default: return 'text-gray-600 bg-gray-50 border-gray-200'
    }
  }

  const getComunicacionIcon = (tipo: string) => {
    switch (tipo) {
      case 'email': return '📧'
      case 'telefono': return '📞'
      case 'presencial': return '👥'
      default: return '📝'
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-2xl max-w-6xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-gray-900">Gestión de Documentación LOPIVI</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 text-2xl font-bold"
            >
              ×
            </button>
          </div>
          <p className="text-gray-600 mt-2">
            Control de documentación de idoneidad del personal según la Ley LOPIVI
          </p>
        </div>

        <div className="p-6">
          {/* Resumen estadístico */}
          <div className="grid grid-cols-3 gap-6 mb-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{personasConCertificado.length}</div>
              <div className="text-sm text-green-800">Documentación Completa</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-red-600">{personasSinCertificado.length}</div>
              <div className="text-sm text-red-800">Documentación Pendiente</div>
            </div>
          </div>

          {/* Botones desplegables */}
          <div className="space-y-4">
            {/* Sección: Personas con certificado */}
            <div className="border border-gray-200 rounded-lg">
              <button
                onClick={() => setActiveSection(activeSection === 'con_certificado' ? null : 'con_certificado')}
                className="w-full flex items-center justify-between p-4 text-left hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <span className="text-2xl">✅</span>
                  <div>
                    <h3 className="font-bold text-gray-900">Personal con Documentación de Idoneidad Completa</h3>
                    <p className="text-sm text-gray-600">{personasConCertificado.length} personas con documentación actualizada</p>
                  </div>
                </div>
                <span className="text-gray-400 text-xl">
                  {activeSection === 'con_certificado' ? '−' : '+'}
                </span>
              </button>

              {activeSection === 'con_certificado' && (
                <div className="border-t border-gray-200 p-4">
                  <div className="space-y-4">
                    {personasConCertificado.map((persona) => (
                      <div key={persona.id} className="bg-gray-50 rounded-lg p-4">
                        <div className="flex items-start justify-between mb-3">
                          <div>
                            <h4 className="font-bold text-gray-900">{persona.nombre}</h4>
                            <p className="text-sm text-gray-600">{persona.rol}</p>
                          </div>
                          <span className={`px-2 py-1 rounded text-xs border ${getEstadoColor(persona.estadoValidez)}`}>
                            {persona.estadoValidez === 'vigente' ? 'VIGENTE' :
                             persona.estadoValidez === 'proxima_renovacion' ? 'PRÓXIMA RENOVACIÓN' : 'VENCIDO'}
                          </span>
                        </div>

                        <div className="grid md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <div>
                              <span className="text-xs text-gray-500">Número de Certificado:</span>
                              <p className="font-medium text-gray-900">{persona.numeroCertificado}</p>
                            </div>
                            <div>
                              <span className="text-xs text-gray-500">Fecha de Entrega:</span>
                              <p className="font-medium text-gray-900">{new Date(persona.fechaEntrega).toLocaleDateString('es-ES')}</p>
                            </div>
                          </div>
                          <div className="space-y-2">
                            <div>
                              <span className="text-xs text-gray-500">Próxima Renovación:</span>
                              <p className="font-medium text-gray-900">{new Date(persona.proximaRenovacion).toLocaleDateString('es-ES')}</p>
                            </div>
                            <div>
                              <span className="text-xs text-gray-500">Días para Renovación:</span>
                              <p className={`font-medium ${persona.diasParaRenovacion < 365 ? 'text-orange-600' : 'text-green-600'}`}>
                                {persona.diasParaRenovacion} días
                              </p>
                            </div>
                          </div>
                        </div>

                        <div className="mt-3 p-2 bg-blue-50 border border-blue-200 rounded text-xs text-blue-800">
                          <strong>Recordatorio Legal:</strong> Los certificados de antecedentes penales deben renovarse cada 5 años según la normativa LOPIVI
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Sección: Personas sin certificado */}
            <div className="border border-red-200 rounded-lg bg-red-50">
              <button
                onClick={() => setActiveSection(activeSection === 'sin_certificado' ? null : 'sin_certificado')}
                className="w-full flex items-center justify-between p-4 text-left hover:bg-red-100 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <span className="text-2xl">❌</span>
                  <div>
                    <h3 className="font-bold text-red-900">Personal con Documentación Pendiente</h3>
                    <p className="text-sm text-red-700">{personasSinCertificado.length} personas que deben completar su documentación para poder ejercer</p>
                  </div>
                </div>
                <span className="text-red-400 text-xl">
                  {activeSection === 'sin_certificado' ? '−' : '+'}
                </span>
              </button>

              {activeSection === 'sin_certificado' && (
                <div className="border-t border-red-200 p-4">
                  <div className="bg-red-100 border border-red-200 rounded-lg p-3 mb-4">
                    <p className="text-red-800 text-sm font-medium">
                      ⚠️ <strong>IMPORTANTE:</strong> Las personas listadas a continuación NO pueden ejercer funciones en contacto con menores
                      hasta que entreguen su documentación de idoneidad según establece la Ley LOPIVI.
                    </p>
                  </div>

                  <div className="space-y-4">
                    {personasSinCertificado.map((persona) => (
                      <div key={persona.id} className="border border-gray-200 rounded-lg p-4">
                        <div className="flex items-start justify-between mb-3">
                          <div>
                            <h4 className="font-bold text-gray-900">{persona.nombre}</h4>
                            <p className="text-sm text-gray-600">{persona.rol}</p>
                            <div className="mt-2 flex items-center gap-4">
                              <div>
                                <span className="text-xs text-gray-500">Fecha límite:</span>
                                <p className="font-medium text-red-700">{new Date(persona.fechaLimite).toLocaleDateString('es-ES')}</p>
                              </div>
                              <div>
                                <span className="text-xs text-gray-500">Días restantes:</span>
                                <p className={`font-bold ${
                                  persona.diasRestantes <= 0 ? 'text-red-600' :
                                  persona.diasRestantes <= 7 ? 'text-orange-600' :
                                  'text-yellow-600'
                                }`}>
                                  {persona.diasRestantes <= 0 ? 'VENCIDO' : `${persona.diasRestantes} días`}
                                </p>
                              </div>
                            </div>
                          </div>
                          <div className="text-right">
                            <span className={`text-xs px-2 py-1 rounded font-bold ${
                              persona.estadoUrgencia === 'critico' ? 'bg-red-600 text-white' :
                              persona.estadoUrgencia === 'urgente' ? 'bg-orange-600 text-white' :
                              'bg-yellow-600 text-white'
                            }`}>
                              {persona.estadoUrgencia === 'critico' ? 'CRÍTICO' :
                               persona.estadoUrgencia === 'urgente' ? 'URGENTE' : 'NORMAL'}
                            </span>
                            <div className="mt-2 text-xs text-red-600 font-bold">
                              Suspendido hasta entrega de documentación
                            </div>
                          </div>
                        </div>

                        <div>
                          <h5 className="font-semibold text-gray-800 mb-2">
                            Comunicaciones Realizadas ({persona.comunicaciones.length}):
                          </h5>
                          <div className="space-y-2">
                            {persona.comunicaciones.map((comunicacion, index) => (
                              <div key={index} className="flex items-start gap-3 p-2 bg-gray-50 rounded">
                                <span className="text-lg">{getComunicacionIcon(comunicacion.tipo)}</span>
                                <div className="flex-1">
                                  <div className="flex items-center gap-2 mb-1">
                                    <span className="text-xs font-medium text-gray-600">
                                      {new Date(comunicacion.fecha).toLocaleDateString('es-ES')}
                                    </span>
                                    <span className="text-xs bg-gray-200 text-gray-700 px-2 py-0.5 rounded">
                                      {comunicacion.tipo.toUpperCase()}
                                    </span>
                                  </div>
                                  <p className="text-sm text-gray-700">{comunicacion.descripcion}</p>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>

                        <div className="mt-4 flex gap-2">
                          <button className="bg-orange-600 text-white px-4 py-2 rounded text-sm hover:bg-orange-700">
                            Enviar Recordatorio
                          </button>
                          <button className="bg-red-600 text-white px-4 py-2 rounded text-sm hover:bg-red-700">
                            Suspender Actividad
                          </button>
                          <button className="bg-blue-600 text-white px-4 py-2 rounded text-sm hover:bg-blue-700">
                            Marcar como Entregado
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Información legal */}
          <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <h4 className="font-bold text-blue-900 mb-2">📋 Marco Legal - Documentación de Idoneidad del Personal</h4>
            <div className="text-blue-800 text-sm space-y-1">
              <p><strong>• Ley LOPIVI (Art. 35):</strong> Obligatorio para todo personal en contacto con menores</p>
              <p><strong>• Vigencia:</strong> 5 años desde la fecha de expedición</p>
              <p><strong>• Renovación:</strong> Debe realizarse antes del vencimiento</p>
              <p><strong>• Consecuencias:</strong> Sin documentación válida = prohibición total de ejercer</p>
              <p><strong>• Responsabilidad:</strong> La entidad debe verificar y mantener actualizada esta documentación</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
