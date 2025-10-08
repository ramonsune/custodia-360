// Servicio de Backend para Documentos LOPIVI
interface DocumentoLOPIVI {
  id: string
  entidadId: string
  nombre: string
  tipo: 'plan_proteccion' | 'codigo_conducta' | 'protocolos_actuacion' | 'evaluacion_riesgos' | 'manual_formacion' | 'registro_incidencias'
  version: string
  estado: 'borrador' | 'revision' | 'aprobado' | 'vigente' | 'vencido'
  contenido?: string
  archivoUrl?: string
  fechaCreacion: string
  fechaVencimiento?: string
  creadoPor: string
  responsable: string
  colaboradores: string[]
  configuracion: PlantillaConfiguracion
  historialVersiones: VersionDocumento[]
}

interface VersionDocumento {
  version: string
  fechaCreacion: string
  creadoPor: string
  cambios: string
  archivoUrl?: string
}

interface PlantillaConfiguracion {
  tipoEntidad: 'deportiva' | 'educativa' | 'social' | 'religiosa' | 'otra'
  variables: Record<string, any>
  secciones: SeccionPlantilla[]
  formato: 'pdf' | 'docx' | 'html'
}

interface SeccionPlantilla {
  id: string
  titulo: string
  contenido: string
  obligatoria: boolean
  variables: string[]
}

class DocumentosService {
  private baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api'

  // CRUD de Documentos
  async obtenerDocumentos(entidadId: string): Promise<DocumentoLOPIVI[]> {
    try {
      const response = await fetch(`${this.baseUrl}/documentos?entidadId=${entidadId}`, {
        headers: {
          'Authorization': `Bearer ${this.getToken()}`,
          'Content-Type': 'application/json'
        }
      })

      if (!response.ok) {
        throw new Error(`Error al obtener documentos: ${response.statusText}`)
      }

      return await response.json()
    } catch (error) {
      console.error('Error obteniendo documentos:', error)
      // Fallback a datos locales
      return this.obtenerDocumentosLocal(entidadId)
    }
  }

  async crearDocumento(documento: Omit<DocumentoLOPIVI, 'id' | 'fechaCreacion' | 'historialVersiones'>): Promise<DocumentoLOPIVI> {
    try {
      const response = await fetch(`${this.baseUrl}/documentos`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.getToken()}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          ...documento,
          id: this.generarId(),
          fechaCreacion: new Date().toISOString(),
          historialVersiones: []
        })
      })

      if (!response.ok) {
        throw new Error(`Error al crear documento: ${response.statusText}`)
      }

      const nuevoDocumento = await response.json()

      // Guardar también localmente para sincronización
      this.guardarDocumentoLocal(nuevoDocumento)

      return nuevoDocumento
    } catch (error) {
      console.error('Error creando documento:', error)
      throw error
    }
  }

  async actualizarDocumento(id: string, cambios: Partial<DocumentoLOPIVI>): Promise<DocumentoLOPIVI> {
    try {
      const response = await fetch(`${this.baseUrl}/documentos/${id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${this.getToken()}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(cambios)
      })

      if (!response.ok) {
        throw new Error(`Error al actualizar documento: ${response.statusText}`)
      }

      const documentoActualizado = await response.json()

      // Actualizar también localmente
      this.actualizarDocumentoLocal(id, cambios)

      return documentoActualizado
    } catch (error) {
      console.error('Error actualizando documento:', error)
      throw error
    }
  }

  async eliminarDocumento(id: string): Promise<void> {
    try {
      const response = await fetch(`${this.baseUrl}/documentos/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${this.getToken()}`
        }
      })

      if (!response.ok) {
        throw new Error(`Error al eliminar documento: ${response.statusText}`)
      }

      // Eliminar también localmente
      this.eliminarDocumentoLocal(id)
    } catch (error) {
      console.error('Error eliminando documento:', error)
      throw error
    }
  }

  // Gestión de Versiones
  async crearNuevaVersion(
    documentoId: string,
    contenido: string,
    cambios: string,
    archivo?: File
  ): Promise<VersionDocumento> {
    try {
      const formData = new FormData()
      formData.append('documentoId', documentoId)
      formData.append('contenido', contenido)
      formData.append('cambios', cambios)
      if (archivo) {
        formData.append('archivo', archivo)
      }

      const response = await fetch(`${this.baseUrl}/documentos/${documentoId}/versiones`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.getToken()}`
        },
        body: formData
      })

      if (!response.ok) {
        throw new Error(`Error al crear nueva versión: ${response.statusText}`)
      }

      return await response.json()
    } catch (error) {
      console.error('Error creando nueva versión:', error)
      throw error
    }
  }

  // Sincronización en Tiempo Real
  async sincronizarDocumentos(entidadId: string): Promise<void> {
    try {
      // Obtener documentos del servidor
      const documentosServidor = await this.obtenerDocumentos(entidadId)

      // Obtener documentos locales
      const documentosLocales = this.obtenerDocumentosLocal(entidadId)

      // Sincronizar cambios
      for (const docLocal of documentosLocales) {
        const docServidor = documentosServidor.find(d => d.id === docLocal.id)

        if (!docServidor) {
          // Documento local no existe en servidor, subirlo
          await this.crearDocumento(docLocal)
        } else if (new Date(docLocal.fechaCreacion) > new Date(docServidor.fechaCreacion)) {
          // Documento local es más reciente, actualizarlo en servidor
          await this.actualizarDocumento(docLocal.id, docLocal)
        }
      }

      // Guardar documentos del servidor localmente
      this.guardarDocumentosLocal(entidadId, documentosServidor)

    } catch (error) {
      console.error('Error sincronizando documentos:', error)
    }
  }

  // Gestión de Archivos
  async subirArchivo(archivo: File, documentoId: string): Promise<string> {
    try {
      const formData = new FormData()
      formData.append('archivo', archivo)
      formData.append('documentoId', documentoId)

      const response = await fetch(`${this.baseUrl}/archivos/subir`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.getToken()}`
        },
        body: formData
      })

      if (!response.ok) {
        throw new Error(`Error al subir archivo: ${response.statusText}`)
      }

      const { url } = await response.json()
      return url
    } catch (error) {
      console.error('Error subiendo archivo:', error)
      throw error
    }
  }

  async descargarArchivo(url: string): Promise<Blob> {
    try {
      const response = await fetch(url, {
        headers: {
          'Authorization': `Bearer ${this.getToken()}`
        }
      })

      if (!response.ok) {
        throw new Error(`Error al descargar archivo: ${response.statusText}`)
      }

      return await response.blob()
    } catch (error) {
      console.error('Error descargando archivo:', error)
      throw error
    }
  }

  // Métodos privados para fallback local
  private obtenerDocumentosLocal(entidadId: string): DocumentoLOPIVI[] {
    const key = `documentos_${entidadId}`
    const stored = localStorage.getItem(key)
    return stored ? JSON.parse(stored) : []
  }

  private guardarDocumentosLocal(entidadId: string, documentos: DocumentoLOPIVI[]): void {
    const key = `documentos_${entidadId}`
    localStorage.setItem(key, JSON.stringify(documentos))
  }

  private guardarDocumentoLocal(documento: DocumentoLOPIVI): void {
    const documentos = this.obtenerDocumentosLocal(documento.entidadId)
    const index = documentos.findIndex(d => d.id === documento.id)

    if (index >= 0) {
      documentos[index] = documento
    } else {
      documentos.push(documento)
    }

    this.guardarDocumentosLocal(documento.entidadId, documentos)
  }

  private actualizarDocumentoLocal(id: string, cambios: Partial<DocumentoLOPIVI>): void {
    // Implementar actualización local
    const documentos = this.obtenerDocumentosLocal(cambios.entidadId || '')
    const index = documentos.findIndex(d => d.id === id)

    if (index >= 0) {
      documentos[index] = { ...documentos[index], ...cambios }
      this.guardarDocumentosLocal(cambios.entidadId || '', documentos)
    }
  }

  private eliminarDocumentoLocal(id: string): void {
    // Buscar en todas las entidades (simplificado)
    const keys = Object.keys(localStorage).filter(key => key.startsWith('documentos_'))

    for (const key of keys) {
      const documentos = JSON.parse(localStorage.getItem(key) || '[]')
      const filtered = documentos.filter((d: DocumentoLOPIVI) => d.id !== id)

      if (filtered.length !== documentos.length) {
        localStorage.setItem(key, JSON.stringify(filtered))
        break
      }
    }
  }

  private getToken(): string {
    // Obtener token de autenticación del localStorage o contexto
    const session = localStorage.getItem('userSession')
    if (session) {
      const data = JSON.parse(session)
      return data.token || 'demo-token'
    }
    return 'demo-token'
  }

  private generarId(): string {
    return `doc_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  }

  // Búsqueda y filtrado
  async buscarDocumentos(
    entidadId: string,
    filtros: {
      tipo?: string
      estado?: string
      busqueda?: string
    }
  ): Promise<DocumentoLOPIVI[]> {
    try {
      const params = new URLSearchParams({
        entidadId,
        ...filtros
      })

      const response = await fetch(`${this.baseUrl}/documentos/buscar?${params}`, {
        headers: {
          'Authorization': `Bearer ${this.getToken()}`
        }
      })

      if (!response.ok) {
        throw new Error(`Error en búsqueda: ${response.statusText}`)
      }

      return await response.json()
    } catch (error) {
      console.error('Error buscando documentos:', error)
      // Fallback a búsqueda local
      return this.buscarDocumentosLocal(entidadId, filtros)
    }
  }

  private buscarDocumentosLocal(
    entidadId: string,
    filtros: { tipo?: string; estado?: string; busqueda?: string }
  ): DocumentoLOPIVI[] {
    let documentos = this.obtenerDocumentosLocal(entidadId)

    if (filtros.tipo) {
      documentos = documentos.filter(d => d.tipo === filtros.tipo)
    }

    if (filtros.estado) {
      documentos = documentos.filter(d => d.estado === filtros.estado)
    }

    if (filtros.busqueda) {
      const busqueda = filtros.busqueda.toLowerCase()
      documentos = documentos.filter(d =>
        d.nombre.toLowerCase().includes(busqueda) ||
        d.contenido?.toLowerCase().includes(busqueda)
      )
    }

    return documentos
  }
}

// Instancia singleton del servicio
export const documentosService = new DocumentosService()

// Tipos exportados
export type { DocumentoLOPIVI, VersionDocumento, PlantillaConfiguracion, SeccionPlantilla }
