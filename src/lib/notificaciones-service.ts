// Servicio de Notificaciones Automáticas
interface ConfiguracionNotificacion {
  id: string
  entidadId: string
  tipo: 'vencimiento_documento' | 'tarea_pendiente' | 'certificacion_requerida' | 'alerta_urgente'
  destinatarios: Destinatario[]
  programacion: ProgramacionNotificacion
  plantilla: PlantillaNotificacion
  activa: boolean
  fechaCreacion: string
}

interface Destinatario {
  id: string
  nombre: string
  email?: string
  telefono?: string
  rol: 'principal' | 'suplente' | 'administrativo' | 'personal'
  preferencias: PreferenciasNotificacion
}

interface PreferenciasNotificacion {
  email: boolean
  sms: boolean
  whatsapp: boolean
  push: boolean
  horarios: {
    inicio: string  // "09:00"
    fin: string     // "18:00"
    diasSemana: number[]  // [1,2,3,4,5] (Lunes a Viernes)
  }
}

interface ProgramacionNotificacion {
  diasAntes: number[]  // [30, 15, 7, 1] días antes del vencimiento
  repetir: boolean
  intervaloRepeticion?: number  // días
  maxRepeticiones?: number
}

interface PlantillaNotificacion {
  asunto: string
  contenidoEmail: string
  contenidoSMS: string
  variables: string[]  // Variables disponibles como {nombreEntidad}, {fechaVencimiento}, etc.
}

interface NotificacionEnviada {
  id: string
  configuracionId: string
  destinatarioId: string
  canal: 'email' | 'sms' | 'whatsapp' | 'push'
  estado: 'enviada' | 'entregada' | 'leida' | 'error'
  fechaEnvio: string
  fechaEntrega?: string
  fechaLectura?: string
  error?: string
  contenido: string
}

class NotificacionesService {
  private baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api'

  // Configuración de Notificaciones
  async crearConfiguracion(config: Omit<ConfiguracionNotificacion, 'id' | 'fechaCreacion'>): Promise<ConfiguracionNotificacion> {
    try {
      const configuracion = {
        ...config,
        id: this.generarId(),
        fechaCreacion: new Date().toISOString()
      }

      const response = await fetch(`${this.baseUrl}/notificaciones/configuracion`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.getToken()}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(configuracion)
      })

      if (!response.ok) {
        throw new Error(`Error al crear configuración: ${response.statusText}`)
      }

      const nuevaConfig = await response.json()
      this.guardarConfiguracionLocal(nuevaConfig)

      return nuevaConfig
    } catch (error) {
      console.error('Error creando configuración:', error)
      throw error
    }
  }

  async obtenerConfiguraciones(entidadId: string): Promise<ConfiguracionNotificacion[]> {
    try {
      const response = await fetch(`${this.baseUrl}/notificaciones/configuracion?entidadId=${entidadId}`, {
        headers: {
          'Authorization': `Bearer ${this.getToken()}`
        }
      })

      if (!response.ok) {
        throw new Error(`Error al obtener configuraciones: ${response.statusText}`)
      }

      return await response.json()
    } catch (error) {
      console.error('Error obteniendo configuraciones:', error)
      return this.obtenerConfiguracionesLocal(entidadId)
    }
  }

  // Envío de Notificaciones
  async enviarNotificacion(
    destinatario: Destinatario,
    plantilla: PlantillaNotificacion,
    variables: Record<string, string>,
    canal: 'email' | 'sms' | 'whatsapp' = 'email'
  ): Promise<NotificacionEnviada> {
    try {
      const contenido = this.procesarPlantilla(plantilla, variables, canal)

      const notificacion = {
        id: this.generarId(),
        destinatarioId: destinatario.id,
        canal,
        estado: 'enviada' as const,
        fechaEnvio: new Date().toISOString(),
        contenido
      }

      const response = await fetch(`${this.baseUrl}/notificaciones/enviar`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.getToken()}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          destinatario,
          contenido,
          canal,
          asunto: this.procesarTexto(plantilla.asunto, variables)
        })
      })

      if (!response.ok) {
        throw new Error(`Error al enviar notificación: ${response.statusText}`)
      }

      const resultado = await response.json()
      const notificacionCompleta = { ...notificacion, ...resultado }

      this.guardarNotificacionLocal(notificacionCompleta)
      return notificacionCompleta

    } catch (error) {
      console.error('Error enviando notificación:', error)

      // Fallback: simular envío para desarrollo
      return this.simularEnvioNotificacion(destinatario, plantilla, variables, canal)
    }
  }

  // Programación Automática
  async programarNotificacionesVencimiento(entidadId: string): Promise<void> {
    try {
      const response = await fetch(`${this.baseUrl}/notificaciones/programar-vencimientos`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.getToken()}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ entidadId })
      })

      if (!response.ok) {
        throw new Error(`Error programando notificaciones: ${response.statusText}`)
      }

      console.log('Notificaciones de vencimiento programadas exitosamente')

    } catch (error) {
      console.error('Error programando notificaciones:', error)
      // Fallback local
      this.programarNotificacionesLocal(entidadId)
    }
  }

  async verificarNotificacionesPendientes(entidadId: string): Promise<NotificacionEnviada[]> {
    try {
      const response = await fetch(`${this.baseUrl}/notificaciones/pendientes?entidadId=${entidadId}`, {
        headers: {
          'Authorization': `Bearer ${this.getToken()}`
        }
      })

      if (!response.ok) {
        throw new Error(`Error verificando notificaciones: ${response.statusText}`)
      }

      const pendientes = await response.json()

      // Procesar notificaciones pendientes
      for (const notificacion of pendientes) {
        await this.procesarNotificacionPendiente(notificacion)
      }

      return pendientes

    } catch (error) {
      console.error('Error verificando notificaciones pendientes:', error)
      return []
    }
  }

  // Servicios Específicos por Canal
  private async enviarEmail(destinatario: Destinatario, asunto: string, contenido: string): Promise<boolean> {
    try {
      const response = await fetch(`${this.baseUrl}/notificaciones/email`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.getToken()}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          para: destinatario.email,
          asunto,
          contenido,
          tipoContenido: 'html'
        })
      })

      return response.ok
    } catch (error) {
      console.error('Error enviando email:', error)
      return false
    }
  }

  private async enviarSMS(destinatario: Destinatario, mensaje: string): Promise<boolean> {
    try {
      const response = await fetch(`${this.baseUrl}/notificaciones/sms`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.getToken()}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          telefono: destinatario.telefono,
          mensaje
        })
      })

      return response.ok
    } catch (error) {
      console.error('Error enviando SMS:', error)
      return false
    }
  }

  private async enviarWhatsApp(destinatario: Destinatario, mensaje: string): Promise<boolean> {
    try {
      const response = await fetch(`${this.baseUrl}/notificaciones/whatsapp`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.getToken()}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          telefono: destinatario.telefono,
          mensaje
        })
      })

      return response.ok
    } catch (error) {
      console.error('Error enviando WhatsApp:', error)
      return false
    }
  }

  // Plantillas Predefinidas
  getPlantillasDefault(): Record<string, PlantillaNotificacion> {
    return {
      vencimiento_documento: {
        asunto: 'LOPIVI: Documento {nombreDocumento} próximo a vencer',
        contenidoEmail: `
          <h2>Documento LOPIVI próximo a vencer</h2>
          <p>Estimado/a {nombreDestinatario},</p>
          <p>Le informamos que el documento <strong>{nombreDocumento}</strong> de la entidad <strong>{nombreEntidad}</strong> vencerá el <strong>{fechaVencimiento}</strong>.</p>
          <p><strong>Días restantes:</strong> {diasRestantes}</p>
          <p>Es necesario que proceda a su renovación para mantener el cumplimiento LOPIVI.</p>
          <p>Acceda a su dashboard para gestionar la renovación: <a href="{urlDashboard}">Ir al Dashboard</a></p>
          <br>
          <p>Saludos,<br>Sistema Custodia360</p>
        `,
        contenidoSMS: 'LOPIVI: Documento {nombreDocumento} vence en {diasRestantes} días. Renovar en {urlDashboard}',
        variables: ['nombreDestinatario', 'nombreDocumento', 'nombreEntidad', 'fechaVencimiento', 'diasRestantes', 'urlDashboard']
      },
      certificacion_requerida: {
        asunto: 'Certificación LOPIVI requerida - {nombreEntidad}',
        contenidoEmail: `
          <h2>Certificación LOPIVI Requerida</h2>
          <p>Estimado/a {nombreDestinatario},</p>
          <p>Su certificación LOPIVI como {rol} de la entidad <strong>{nombreEntidad}</strong> está pendiente.</p>
          <p><strong>Fecha límite:</strong> {fechaLimite}</p>
          <p>Complete su certificación accediendo al campus de formación: <a href="{urlFormacion}">Acceder ahora</a></p>
          <br>
          <p>Saludos,<br>Sistema Custodia360</p>
        `,
        contenidoSMS: 'Certificación LOPIVI pendiente. Fecha límite: {fechaLimite}. Acceder: {urlFormacion}',
        variables: ['nombreDestinatario', 'nombreEntidad', 'rol', 'fechaLimite', 'urlFormacion']
      }
    }
  }

  // Configuraciones Predefinidas por Tipo de Entidad
  getConfiguracionesPorTipoEntidad(tipoEntidad: 'deportiva' | 'educativa' | 'social'): Partial<ConfiguracionNotificacion>[] {
    const base = {
      programacion: {
        diasAntes: [30, 15, 7, 1],
        repetir: true,
        intervaloRepeticion: 7,
        maxRepeticiones: 3
      },
      activa: true
    }

    switch (tipoEntidad) {
      case 'deportiva':
        return [
          {
            ...base,
            tipo: 'vencimiento_documento',
            plantilla: this.getPlantillasDefault().vencimiento_documento
          },
          {
            ...base,
            tipo: 'certificacion_requerida',
            plantilla: this.getPlantillasDefault().certificacion_requerida,
            programacion: {
              diasAntes: [15, 7, 3, 1],
              repetir: true,
              intervaloRepeticion: 3,
              maxRepeticiones: 5
            }
          }
        ]

      case 'educativa':
        return [
          {
            ...base,
            tipo: 'vencimiento_documento',
            plantilla: this.getPlantillasDefault().vencimiento_documento,
            programacion: {
              diasAntes: [45, 30, 15, 7, 1],
              repetir: true,
              intervaloRepeticion: 5,
              maxRepeticiones: 4
            }
          }
        ]

      default:
        return [
          {
            ...base,
            tipo: 'vencimiento_documento',
            plantilla: this.getPlantillasDefault().vencimiento_documento
          }
        ]
    }
  }

  // Métodos Privados
  private procesarPlantilla(
    plantilla: PlantillaNotificacion,
    variables: Record<string, string>,
    canal: 'email' | 'sms' | 'whatsapp'
  ): string {
    const contenido = canal === 'email' ? plantilla.contenidoEmail : plantilla.contenidoSMS
    return this.procesarTexto(contenido, variables)
  }

  private procesarTexto(texto: string, variables: Record<string, string>): string {
    let resultado = texto

    Object.entries(variables).forEach(([clave, valor]) => {
      const regex = new RegExp(`{${clave}}`, 'g')
      resultado = resultado.replace(regex, valor)
    })

    return resultado
  }

  private async procesarNotificacionPendiente(notificacion: any): Promise<void> {
    // Procesar notificación según su tipo y canal
    console.log('Procesando notificación pendiente:', notificacion)
  }

  private simularEnvioNotificacion(
    destinatario: Destinatario,
    plantilla: PlantillaNotificacion,
    variables: Record<string, string>,
    canal: 'email' | 'sms' | 'whatsapp'
  ): NotificacionEnviada {
    const contenido = this.procesarPlantilla(plantilla, variables, canal)

    console.log(`[SIMULACIÓN] Enviando ${canal} a ${destinatario.nombre}:`, contenido)

    return {
      id: this.generarId(),
      configuracionId: '',
      destinatarioId: destinatario.id,
      canal,
      estado: 'enviada',
      fechaEnvio: new Date().toISOString(),
      fechaEntrega: new Date().toISOString(),
      contenido
    }
  }

  private programarNotificacionesLocal(entidadId: string): void {
    console.log(`Programando notificaciones locales para entidad: ${entidadId}`)
    // Implementar lógica local de programación
  }

  // Métodos de almacenamiento local
  private obtenerConfiguracionesLocal(entidadId: string): ConfiguracionNotificacion[] {
    const key = `notif_config_${entidadId}`
    const stored = localStorage.getItem(key)
    return stored ? JSON.parse(stored) : []
  }

  private guardarConfiguracionLocal(config: ConfiguracionNotificacion): void {
    const configs = this.obtenerConfiguracionesLocal(config.entidadId)
    const index = configs.findIndex(c => c.id === config.id)

    if (index >= 0) {
      configs[index] = config
    } else {
      configs.push(config)
    }

    const key = `notif_config_${config.entidadId}`
    localStorage.setItem(key, JSON.stringify(configs))
  }

  private guardarNotificacionLocal(notificacion: NotificacionEnviada): void {
    const key = 'notificaciones_enviadas'
    const stored = localStorage.getItem(key)
    const notificaciones = stored ? JSON.parse(stored) : []

    notificaciones.push(notificacion)
    localStorage.setItem(key, JSON.stringify(notificaciones))
  }

  private getToken(): string {
    const session = localStorage.getItem('userSession')
    if (session) {
      const data = JSON.parse(session)
      return data.token || 'demo-token'
    }
    return 'demo-token'
  }

  private generarId(): string {
    return `notif_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  }
}

// Instancia singleton
export const notificacionesService = new NotificacionesService()

// Tipos exportados
export type {
  ConfiguracionNotificacion,
  Destinatario,
  PreferenciasNotificacion,
  ProgramacionNotificacion,
  PlantillaNotificacion,
  NotificacionEnviada
}
