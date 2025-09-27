'use client'

import { useState, useEffect } from 'react'

interface BackupConfig {
  frecuencia: 'diario' | 'semanal' | 'mensual'
  tiposDatos: ('casos' | 'formacion' | 'certificaciones' | 'protocolos')[]
  formatoExportacion: 'json' | 'csv' | 'pdf' | 'xml'
  encriptacion: boolean
  destinoAlmacenamiento: 'local' | 'cloud' | 'ambos'
}

interface UltimoBackup {
  id: string
  fecha: string
  tipo: 'automatico' | 'manual'
  estado: 'completado' | 'fallido' | 'en_proceso'
  tamaño: string
  registros: number
}

interface BackupExportacionProps {
  entidadId: string
  isOpen: boolean
  onClose: () => void
}

export default function BackupExportacion({ entidadId, isOpen, onClose }: BackupExportacionProps) {
  const [activeTab, setActiveTab] = useState<'backup' | 'exportacion'>('backup')
  const [configuracion, setConfiguracion] = useState<BackupConfig | null>(null)
  const [ultimosBackups, setUltimosBackups] = useState<UltimoBackup[]>([])
  const [loading, setLoading] = useState(false)
  const [proximoBackup, setProximoBackup] = useState<string>('')

  // Estados para exportación
  const [exportConfig, setExportConfig] = useState({
    fechaInicio: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    fechaFin: new Date().toISOString().split('T')[0],
    tipoExportacion: 'inspeccion' as 'inspeccion' | 'auditoria' | 'judicial',
    formato: 'pdf' as 'pdf' | 'csv' | 'json'
  })

  useEffect(() => {
    if (isOpen) {
      cargarConfiguracionBackup()
    }
  }, [isOpen, entidadId])

  const cargarConfiguracionBackup = async () => {
    try {
      setLoading(true)
      const response = await fetch(`/api/backup?entidadId=${entidadId}`)
      const data = await response.json()

      if (data.success) {
        setConfiguracion(data.configuracion)
        setUltimosBackups(data.ultimosBackups)
        setProximoBackup(data.proximoBackup)
      }
    } catch (error) {
      console.error('Error cargando configuración:', error)
    } finally {
      setLoading(false)
    }
  }

  const realizarBackupManual = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/backup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          entidadId,
          tipo: 'manual',
          configuracion
        })
      })

      if (response.ok) {
        alert('Backup manual iniciado correctamente')
        cargarConfiguracionBackup()
      }
    } catch (error) {
      console.error('Error realizando backup:', error)
      alert('Error realizando backup manual')
    } finally {
      setLoading(false)
    }
  }

  const exportarDatos = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/backup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          entidadId,
          ...exportConfig
        })
      })

      if (response.ok) {
        const blob = await response.blob()
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.style.display = 'none'
        a.href = url
        a.download = `LOPIVI_${exportConfig.tipoExportacion}_${entidadId}_${new Date().toISOString().split('T')[0]}.${exportConfig.formato}`
        document.body.appendChild(a)
        a.click()
        window.URL.revokeObjectURL(url)
      }
    } catch (error) {
      console.error('Error exportando datos:', error)
      alert('Error en la exportación')
    } finally {
      setLoading(false)
    }
  }

  const getEstadoColor = (estado: string) => {
    switch (estado) {
      case 'completado': return 'text-green-600 bg-green-50 border-green-200'
      case 'fallido': return 'text-red-600 bg-red-50 border-red-200'
      case 'en_proceso': return 'text-yellow-600 bg-yellow-50 border-yellow-200'
      default: return 'text-gray-600 bg-gray-50 border-gray-200'
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-2xl max-w-6xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-gray-900">Sistema de Backup y Exportación LOPIVI</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 text-2xl font-bold"
            >
              ×
            </button>
          </div>

          {/* Tabs */}
          <div className="flex mt-4 border-b">
            <button
              onClick={() => setActiveTab('backup')}
              className={`px-4 py-2 font-medium text-sm ${
                activeTab === 'backup'
                  ? 'border-b-2 border-blue-500 text-blue-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              📦 Gestión de Backup
            </button>
            <button
              onClick={() => setActiveTab('exportacion')}
              className={`px-4 py-2 font-medium text-sm ${
                activeTab === 'exportacion'
                  ? 'border-b-2 border-blue-500 text-blue-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              📄 Exportación Legal
            </button>
          </div>
        </div>

        <div className="p-6">
          {activeTab === 'backup' && (
            <div className="space-y-6">
              {/* Estado del sistema */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h3 className="font-bold text-blue-900 mb-3">Estado del Sistema de Backup</h3>
                <div className="grid md:grid-cols-3 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600">
                      {configuracion?.frecuencia?.toUpperCase() || 'CARGANDO'}
                    </div>
                    <div className="text-sm text-blue-800">Frecuencia</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">{proximoBackup}</div>
                    <div className="text-sm text-green-800">Próximo Backup</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-purple-600">
                      {configuracion?.encriptacion ? 'SÍ' : 'NO'}
                    </div>
                    <div className="text-sm text-purple-800">Encriptación</div>
                  </div>
                </div>
              </div>

              {/* Configuración actual */}
              {configuracion && (
                <div className="border border-gray-200 rounded-lg p-4">
                  <h4 className="font-bold text-gray-900 mb-3">Configuración Actual</h4>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <h5 className="font-semibold text-gray-800 mb-2">Tipos de Datos:</h5>
                      <div className="flex flex-wrap gap-2">
                        {configuracion.tiposDatos.map(tipo => (
                          <span key={tipo} className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs">
                            {tipo}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div>
                      <h5 className="font-semibold text-gray-800 mb-2">Almacenamiento:</h5>
                      <div className="flex items-center gap-2">
                        <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs">
                          {configuracion.destinoAlmacenamiento}
                        </span>
                        <span className="bg-purple-100 text-purple-800 px-2 py-1 rounded text-xs">
                          {configuracion.formatoExportacion.toUpperCase()}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Últimos backups */}
              <div className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-bold text-gray-900">Últimos Backups</h4>
                  <button
                    onClick={realizarBackupManual}
                    disabled={loading}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-700 disabled:opacity-50"
                  >
                    {loading ? 'Procesando...' : 'Backup Manual'}
                  </button>
                </div>

                <div className="space-y-3">
                  {ultimosBackups.map(backup => (
                    <div key={backup.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-4">
                        <div>
                          <div className="font-medium text-gray-900">{backup.fecha}</div>
                          <div className="text-sm text-gray-500">
                            {backup.tipo} - {backup.registros} registros - {backup.tamaño}
                          </div>
                        </div>
                      </div>
                      <span className={`px-2 py-1 rounded text-xs border ${getEstadoColor(backup.estado)}`}>
                        {backup.estado.toUpperCase()}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'exportacion' && (
            <div className="space-y-6">
              {/* Información legal */}
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <h3 className="font-bold text-yellow-900 mb-2">📋 Exportación para Cumplimiento Legal</h3>
                <p className="text-yellow-800 text-sm">
                  Genera documentación oficial para inspecciones, auditorías o procedimientos judiciales.
                  Todos los documentos incluyen firma digital y son válidos legalmente.
                </p>
              </div>

              {/* Configuración de exportación */}
              <div className="border border-gray-200 rounded-lg p-4">
                <h4 className="font-bold text-gray-900 mb-4">Configurar Exportación</h4>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Fecha Inicio</label>
                    <input
                      type="date"
                      value={exportConfig.fechaInicio}
                      onChange={(e) => setExportConfig(prev => ({ ...prev, fechaInicio: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Fecha Fin</label>
                    <input
                      type="date"
                      value={exportConfig.fechaFin}
                      onChange={(e) => setExportConfig(prev => ({ ...prev, fechaFin: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Tipo de Exportación</label>
                    <select
                      value={exportConfig.tipoExportacion}
                      onChange={(e) => setExportConfig(prev => ({ ...prev, tipoExportacion: e.target.value as any }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                    >
                      <option value="inspeccion">Inspección Oficial</option>
                      <option value="auditoria">Auditoría Interna</option>
                      <option value="judicial">Procedimiento Judicial</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Formato</label>
                    <select
                      value={exportConfig.formato}
                      onChange={(e) => setExportConfig(prev => ({ ...prev, formato: e.target.value as any }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                    >
                      <option value="pdf">PDF Oficial</option>
                      <option value="csv">CSV para Análisis</option>
                      <option value="json">JSON Completo</option>
                    </select>
                  </div>
                </div>

                {/* Información del tipo seleccionado */}
                <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                  <h5 className="font-semibold text-gray-800 mb-2">
                    Información para {exportConfig.tipoExportacion}:
                  </h5>
                  {exportConfig.tipoExportacion === 'inspeccion' && (
                    <ul className="text-gray-700 text-sm space-y-1">
                      <li>• Plan de Protección completo y vigente</li>
                      <li>• Certificaciones de delegados actualizadas</li>
                      <li>• Registro completo de casos y resoluciones</li>
                      <li>• Evidencia de formación del personal</li>
                      <li>• Protocolos implementados y actualizaciones</li>
                    </ul>
                  )}
                  {exportConfig.tipoExportacion === 'auditoria' && (
                    <ul className="text-gray-700 text-sm space-y-1">
                      <li>• Métricas de cumplimiento detalladas</li>
                      <li>• Análisis de eficacia de protocolos</li>
                      <li>• Histórico de incidentes y resoluciones</li>
                      <li>• Evaluación de formación del personal</li>
                      <li>• Recomendaciones de mejora implementadas</li>
                    </ul>
                  )}
                  {exportConfig.tipoExportacion === 'judicial' && (
                    <ul className="text-gray-700 text-sm space-y-1">
                      <li>• Documentación con validez legal</li>
                      <li>• Cronología detallada de eventos</li>
                      <li>• Evidencias preservadas digitalmente</li>
                      <li>• Cadena de custodia de información</li>
                      <li>• Certificaciones de autenticidad</li>
                    </ul>
                  )}
                </div>

                <div className="flex justify-end mt-4">
                  <button
                    onClick={exportarDatos}
                    disabled={loading}
                    className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 disabled:opacity-50"
                  >
                    {loading ? 'Generando...' : 'Exportar Datos'}
                  </button>
                </div>
              </div>

              {/* Tipos de documento disponibles */}
              <div className="border border-gray-200 rounded-lg p-4">
                <h4 className="font-bold text-gray-900 mb-3">Documentos Incluidos en la Exportación</h4>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <h5 className="font-semibold text-gray-800">Documentos Principales:</h5>
                    <ul className="text-gray-700 text-sm space-y-1">
                      <li>✓ Plan de Protección personalizado</li>
                      <li>✓ Certificados de delegados vigentes</li>
                      <li>✓ Protocolos de actuación específicos</li>
                      <li>✓ Código de conducta implementado</li>
                    </ul>
                  </div>
                  <div className="space-y-2">
                    <h5 className="font-semibold text-gray-800">Registros Operativos:</h5>
                    <ul className="text-gray-700 text-sm space-y-1">
                      <li>✓ Historial completo de casos</li>
                      <li>✓ Registro de formaciones completadas</li>
                      <li>✓ Log de actividades del sistema</li>
                      <li>✓ Comunicaciones oficiales enviadas</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
