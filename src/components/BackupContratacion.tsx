'use client'

import { useState, useEffect } from 'react'

interface BackupContratacionProps {
  datosFormulario: any
  entidadId: string
  autoBackup?: boolean
  onBackupCreado?: (backupId: string) => void
}

interface Backup {
  id: string
  tipo_backup: string
  fecha_backup: string
  estado: string
  metadata: any
}

export default function BackupContratacion({
  datosFormulario,
  entidadId,
  autoBackup = true,
  onBackupCreado
}: BackupContratacionProps) {
  const [backups, setBackups] = useState<Backup[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [showHistorial, setShowHistorial] = useState(false)

  // Función para crear backup
  const crearBackup = async (tipoBackup: 'manual' | 'automatico' = 'manual') => {
    if (!datosFormulario || Object.keys(datosFormulario).length === 0) {
      setError('No hay datos para hacer backup')
      return
    }

    setLoading(true)
    setError(null)

    try {
      const response = await fetch('/api/backup-contratacion', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          datosFormulario,
          entidadId,
          tipoBackup
        })
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || 'Error creando backup')
      }

      console.log('Backup creado exitosamente:', result)

      if (onBackupCreado) {
        onBackupCreado(result.backupId)
      }

      // Recargar historial
      await cargarHistorial()

      return result
    } catch (error) {
      console.error('Error creando backup:', error)
      setError(error instanceof Error ? error.message : 'Error creando backup')
      throw error
    } finally {
      setLoading(false)
    }
  }

  // Función para cargar historial de backups
  const cargarHistorial = async () => {
    try {
      const response = await fetch(`/api/backup-contratacion?entidadId=${entidadId}&limite=10`)
      const result = await response.json()

      if (response.ok) {
        setBackups(result.backups || [])
      } else {
        console.error('Error cargando historial:', result.error)
      }
    } catch (error) {
      console.error('Error cargando historial:', error)
    }
  }

  // Función para eliminar backup
  const eliminarBackup = async (backupId: string) => {
    if (!confirm('¿Está seguro de que desea eliminar este backup?')) {
      return
    }

    try {
      const response = await fetch(`/api/backup-contratacion?backupId=${backupId}`, {
        method: 'DELETE'
      })

      const result = await response.json()

      if (response.ok) {
        await cargarHistorial()
      } else {
        alert('Error eliminando backup: ' + result.error)
      }
    } catch (error) {
      console.error('Error eliminando backup:', error)
      alert('Error eliminando backup')
    }
  }

  // Auto-backup cuando cambian los datos del formulario
  useEffect(() => {
    if (autoBackup && datosFormulario && Object.keys(datosFormulario).length > 0) {
      const timer = setTimeout(() => {
        crearBackup('automatico').catch(console.error)
      }, 5000) // Esperar 5 segundos después del último cambio

      return () => clearTimeout(timer)
    }
  }, [datosFormulario, autoBackup])

  // Cargar historial al montar el componente
  useEffect(() => {
    if (entidadId) {
      cargarHistorial()
    }
  }, [entidadId])

  return (
    <div className="bg-white border rounded-lg p-4 mb-4">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <h3 className="font-semibold text-gray-900">☁️ Backup en la Nube</h3>
          {autoBackup && (
            <span className="text-xs bg-green-100 text-green-600 px-2 py-1 rounded">
              Auto-backup activado
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => crearBackup('manual')}
            disabled={loading}
            className="bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? 'Guardando...' : 'Backup Manual'}
          </button>
          <button
            onClick={() => setShowHistorial(!showHistorial)}
            className="bg-gray-600 text-white px-3 py-1 rounded text-sm hover:bg-gray-700"
          >
            Historial
          </button>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded p-3 mb-4">
          <p className="text-red-600 text-sm">{error}</p>
        </div>
      )}

      {showHistorial && (
        <div className="border-t pt-4">
          <h4 className="font-semibold text-gray-800 mb-3">Historial de Backups</h4>
          {backups.length > 0 ? (
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {backups.map((backup) => (
                <div
                  key={backup.id}
                  className="flex items-center justify-between bg-gray-50 p-3 rounded"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className={`text-xs px-2 py-1 rounded ${
                        backup.tipo_backup === 'automatico'
                          ? 'bg-green-100 text-green-600'
                          : 'bg-blue-100 text-blue-600'
                      }`}>
                        {backup.tipo_backup}
                      </span>
                      <span className={`text-xs px-2 py-1 rounded ${
                        backup.estado === 'completado'
                          ? 'bg-green-100 text-green-600'
                          : 'bg-orange-100 text-orange-600'
                      }`}>
                        {backup.estado}
                      </span>
                    </div>
                    <p className="text-xs text-gray-600">
                      {new Date(backup.fecha_backup).toLocaleString('es-ES')}
                    </p>
                  </div>
                  <button
                    onClick={() => eliminarBackup(backup.id)}
                    className="text-red-600 hover:text-red-800 text-xs px-2 py-1"
                  >
                    Eliminar
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-sm text-center py-4">
              No hay backups disponibles
            </p>
          )}
        </div>
      )}

      <div className="bg-blue-50 border border-blue-200 rounded p-3 mt-4">
        <h4 className="font-semibold text-blue-900 mb-2">💡 Información del Backup</h4>
        <ul className="text-blue-800 text-xs space-y-1">
          <li>• Los datos se guardan automáticamente en la nube cada vez que edita el formulario</li>
          <li>• Puede crear backups manuales en cualquier momento</li>
          <li>• Los backups están cifrados y son completamente seguros</li>
          <li>• Útil para recuperar datos en caso de problemas técnicos</li>
        </ul>
      </div>
    </div>
  )
}
