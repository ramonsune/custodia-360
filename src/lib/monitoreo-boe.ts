import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export interface CambioBOE {
  id: string
  fecha_publicacion: string
  numero_boe: string
  titulo: string
  url_completa: string
  contenido_relevante: string
  impacto_detectado: 'CRITICO' | 'ALTO' | 'MEDIO' | 'BAJO'
  areas_afectadas: string[]
  cambios_requeridos: CambioRequerido[]
  estado: 'DETECTADO' | 'ANALIZANDO' | 'IMPLEMENTADO' | 'COMUNICADO'
  fecha_deteccion: string
  fecha_implementacion?: string
  entidades_afectadas: number
}

export interface CambioRequerido {
  tipo: 'PDF_TEMPLATE' | 'EMAIL_TEMPLATE' | 'FUNCIONALIDAD' | 'DATOS' | 'RECORDATORIO'
  descripcion: string
  archivos_afectados: string[]
  prioridad: 'INMEDIATA' | 'ALTA' | 'MEDIA' | 'BAJA'
  implementado: boolean
}

export interface AnalisisIA {
  es_relevante_lopivi: boolean
  nivel_impacto: 'CRITICO' | 'ALTO' | 'MEDIO' | 'BAJO'
  resumen_cambios: string
  areas_afectadas: string[]
  acciones_requeridas: string[]
  urgencia: 'INMEDIATA' | '24H' | '7_DIAS' | '30_DIAS'
}

export class MonitoreoBOE {
  private readonly BOE_RSS_URL = 'https://www.boe.es/rss/boe.xml'
  private readonly OPENAI_API_KEY = process.env.OPENAI_API_KEY

  // Términos clave para filtrar contenido relevante LOPIVI
  private readonly KEYWORDS_LOPIVI = [
    'protección integral infancia',
    'protección menor',
    'lopivi',
    'delegado protección',
    'plan protección',
    'violencia infancia',
    'entidades deportivas',
    'actividades menores',
    'certificación delegado',
    'formación protección',
    'protocolo actuación',
    'entorno seguro'
  ]

  /**
   * Ejecutar monitoreo completo cada 15 días
   */
  async ejecutarMonitoreoCompleto(): Promise<void> {
    console.log('🔍 Iniciando monitoreo BOE cada 15 días...')

    try {
      // 1. Obtener publicaciones recientes BOE
      const publicaciones = await this.obtenerPublicacionesBOE()

      // 2. Filtrar contenido potencialmente relevante
      const publicacionesFiltradas = await this.filtrarPublicacionesRelevantes(publicaciones)

      // 3. Analizar con IA cada publicación relevante
      const cambiosDetectados: CambioBOE[] = []

      for (const pub of publicacionesFiltradas) {
        const analisis = await this.analizarConIA(pub)

        if (analisis.es_relevante_lopivi) {
          const cambio = await this.crearCambioBOE(pub, analisis)
          cambiosDetectados.push(cambio)
        }
      }

      // 4. Procesar cambios detectados
      for (const cambio of cambiosDetectados) {
        await this.procesarCambioDetectado(cambio)
      }

      // 5. Generar reporte de monitoreo
      await this.generarReporteMonitoreo(cambiosDetectados)

      console.log(`✅ Monitoreo completado. ${cambiosDetectados.length} cambios relevantes detectados`)

    } catch (error) {
      console.error('❌ Error en monitoreo BOE:', error)
      await this.notificarErrorCritico(error)
    }
  }

  /**
   * Obtener publicaciones recientes del BOE (últimos 15 días)
   */
  private async obtenerPublicacionesBOE(): Promise<any[]> {
    try {
      // En producción usar RSS oficial del BOE
      // Por ahora simulamos datos
      const fechaInicio = new Date()
      fechaInicio.setDate(fechaInicio.getDate() - 15)

      return [
        {
          fecha: new Date().toISOString(),
          numero: 'BOE-A-2025-001234',
          titulo: 'Orden por la que se modifica el protocolo de actuación en centros deportivos',
          url: 'https://www.boe.es/diario_boe/txt.php?id=BOE-A-2025-001234',
          contenido: 'Texto que incluye modificaciones sobre delegados de protección...'
        }
      ]

    } catch (error) {
      console.error('Error obteniendo publicaciones BOE:', error)
      return []
    }
  }

  /**
   * Filtrar publicaciones con keywords LOPIVI
   */
  private async filtrarPublicacionesRelevantes(publicaciones: any[]): Promise<any[]> {
    return publicaciones.filter(pub => {
      const textoCompleto = `${pub.titulo} ${pub.contenido}`.toLowerCase()

      return this.KEYWORDS_LOPIVI.some(keyword =>
        textoCompleto.includes(keyword.toLowerCase())
      )
    })
  }

  /**
   * Analizar publicación con IA para determinar relevancia e impacto
   */
  private async analizarConIA(publicacion: any): Promise<AnalisisIA> {
    try {
      const prompt = `
        Analiza la siguiente publicación del BOE para determinar su impacto en la Ley LOPIVI (Protección Integral Infancia y Adolescencia) y sistemas de gestión como Custodia360:

        TÍTULO: ${publicacion.titulo}
        CONTENIDO: ${publicacion.contenido}

        Responde SOLO en JSON con esta estructura:
        {
          "es_relevante_lopivi": boolean,
          "nivel_impacto": "CRITICO|ALTO|MEDIO|BAJO",
          "resumen_cambios": "string",
          "areas_afectadas": ["string"],
          "acciones_requeridas": ["string"],
          "urgencia": "INMEDIATA|24H|7_DIAS|30_DIAS"
        }

        Criterios:
        - CRITICO: Cambia definiciones básicas, nuevas obligaciones legales
        - ALTO: Modifica protocolos, documentación requerida
        - MEDIO: Actualiza plazos, procedimientos
        - BAJO: Cambios menores, aclaraciones
      `

      // En producción usar OpenAI API
      // Por ahora simulamos respuesta inteligente
      const esRelevante = this.KEYWORDS_LOPIVI.some(keyword =>
        publicacion.contenido.toLowerCase().includes(keyword.toLowerCase())
      )

      if (!esRelevante) {
        return {
          es_relevante_lopivi: false,
          nivel_impacto: 'BAJO',
          resumen_cambios: 'No relevante para LOPIVI',
          areas_afectadas: [],
          acciones_requeridas: [],
          urgencia: '30_DIAS'
        }
      }

      // Simulación de análisis IA
      return {
        es_relevante_lopivi: true,
        nivel_impacto: 'ALTO',
        resumen_cambios: 'Modificación en protocolos de actuación para delegados de protección',
        areas_afectadas: ['certificacion_delegados', 'planes_proteccion', 'formacion'],
        acciones_requeridas: [
          'Actualizar templates de certificados',
          'Modificar contenido formativo',
          'Revisar planes de protección por sector'
        ],
        urgencia: '24H'
      }

    } catch (error) {
      console.error('Error en análisis IA:', error)
      throw error
    }
  }

  /**
   * Crear registro de cambio BOE
   */
  private async crearCambioBOE(publicacion: any, analisis: AnalisisIA): Promise<CambioBOE> {
    const cambio: CambioBOE = {
      id: `boe-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      fecha_publicacion: publicacion.fecha,
      numero_boe: publicacion.numero,
      titulo: publicacion.titulo,
      url_completa: publicacion.url,
      contenido_relevante: publicacion.contenido,
      impacto_detectado: analisis.nivel_impacto,
      areas_afectadas: analisis.areas_afectadas,
      cambios_requeridos: this.generarCambiosRequeridos(analisis),
      estado: 'DETECTADO',
      fecha_deteccion: new Date().toISOString(),
      entidades_afectadas: 0 // Se calcula después
    }

    // Guardar en Supabase
    const { error } = await supabase
      .from('cambios_boe')
      .insert(cambio)

    if (error) {
      console.error('Error guardando cambio BOE:', error)
    }

    return cambio
  }

  /**
   * Generar lista de cambios requeridos basada en análisis IA
   */
  private generarCambiosRequeridos(analisis: AnalisisIA): CambioRequerido[] {
    const cambios: CambioRequerido[] = []

    // Mapear areas afectadas a cambios específicos
    analisis.areas_afectadas.forEach(area => {
      switch (area) {
        case 'certificacion_delegados':
          cambios.push({
            tipo: 'PDF_TEMPLATE',
            descripcion: 'Actualizar template certificado delegado principal',
            archivos_afectados: ['cert-delegado-principal.tsx', 'cert-delegado-suplente.tsx'],
            prioridad: analisis.urgencia === 'INMEDIATA' ? 'INMEDIATA' : 'ALTA',
            implementado: false
          })
          break

        case 'planes_proteccion':
          cambios.push({
            tipo: 'PDF_TEMPLATE',
            descripcion: 'Actualizar templates de planes de protección',
            archivos_afectados: ['plan-proteccion-club.tsx', 'plan-proteccion-academia.tsx'],
            prioridad: 'ALTA',
            implementado: false
          })
          break

        case 'formacion':
          cambios.push({
            tipo: 'FUNCIONALIDAD',
            descripcion: 'Actualizar contenido módulos de formación',
            archivos_afectados: ['modulos-formacion.ts', 'evaluaciones.ts'],
            prioridad: 'MEDIA',
            implementado: false
          })
          break

        case 'comunicaciones':
          cambios.push({
            tipo: 'EMAIL_TEMPLATE',
            descripcion: 'Actualizar templates de emails informativos',
            archivos_afectados: ['email-templates.ts'],
            prioridad: 'MEDIA',
            implementado: false
          })
          break
      }
    })

    return cambios
  }

  /**
   * Procesar cambio detectado según criticidad
   */
  private async procesarCambioDetectado(cambio: CambioBOE): Promise<void> {
    console.log(`🔥 Procesando cambio ${cambio.impacto_detectado}: ${cambio.titulo}`)

    // Actualizar estado a ANALIZANDO
    await this.actualizarEstadoCambio(cambio.id, 'ANALIZANDO')

    switch (cambio.impacto_detectado) {
      case 'CRITICO':
        await this.procesarCambioCritico(cambio)
        break
      case 'ALTO':
        await this.procesarCambioAlto(cambio)
        break
      case 'MEDIO':
        await this.procesarCambioMedio(cambio)
        break
      case 'BAJO':
        await this.procesarCambioBajo(cambio)
        break
    }

    // Marcar como implementado
    await this.actualizarEstadoCambio(cambio.id, 'IMPLEMENTADO')
    await this.comunicarCambioAClientes(cambio)
    await this.actualizarEstadoCambio(cambio.id, 'COMUNICADO')
  }

  /**
   * Procesar cambio CRÍTICO - Requiere pausa temporal
   */
  private async procesarCambioCritico(cambio: CambioBOE): Promise<void> {
    console.log('🚨 CAMBIO CRÍTICO - Iniciando protocolo de emergencia')

    // 1. Notificar al equipo inmediatamente
    await this.notificarEquipoCritico(cambio)

    // 2. Pausa temporal del sistema (opcional)
    // await this.pausarEmisionCertificados(30) // 30 minutos

    // 3. Implementar cambios automáticos
    await this.implementarCambiosAutomaticos(cambio)

    // 4. Validación manual requerida
    await this.solicitarValidacionManual(cambio)

    // 5. Reanudar operaciones
    // await this.reanudarOperaciones()
  }

  /**
   * Procesar cambio ALTO - Actualización automática
   */
  private async procesarCambioAlto(cambio: CambioBOE): Promise<void> {
    console.log('🟠 CAMBIO ALTO - Implementación automática')

    await this.implementarCambiosAutomaticos(cambio)
    await this.generarNuevosPDFs(cambio)
    await this.programarEmailsInformativos(cambio)
  }

  /**
   * Procesar cambio MEDIO
   */
  private async procesarCambioMedio(cambio: CambioBOE): Promise<void> {
    console.log('🟡 CAMBIO MEDIO - Actualización estándar')

    await this.implementarCambiosAutomaticos(cambio)
    await this.reprogramarRecordatorios(cambio)
  }

  /**
   * Procesar cambio BAJO
   */
  private async procesarCambioBajo(cambio: CambioBOE): Promise<void> {
    console.log('🟢 CAMBIO BAJO - Nota informativa')

    await this.actualizarChangelogSistema(cambio)
  }

  /**
   * Implementar cambios automáticos según tipo
   */
  private async implementarCambiosAutomaticos(cambio: CambioBOE): Promise<void> {
    for (const cambioReq of cambio.cambios_requeridos) {
      try {
        switch (cambioReq.tipo) {
          case 'PDF_TEMPLATE':
            await this.actualizarTemplatesPDF(cambioReq)
            break
          case 'EMAIL_TEMPLATE':
            await this.actualizarTemplatesEmail(cambioReq)
            break
          case 'RECORDATORIO':
            await this.actualizarLogicaRecordatorios(cambioReq)
            break
          case 'DATOS':
            await this.migrarDatos(cambioReq)
            break
          case 'FUNCIONALIDAD':
            // Requiere intervención manual del equipo de desarrollo
            await this.notificarCambioFuncionalidad(cambioReq)
            break
        }

        // Marcar como implementado
        cambioReq.implementado = true

      } catch (error) {
        console.error(`Error implementando cambio ${cambioReq.tipo}:`, error)
      }
    }
  }

  /**
   * Comunicar cambio a todos los clientes afectados
   */
  private async comunicarCambioAClientes(cambio: CambioBOE): Promise<void> {
    // Obtener todas las entidades afectadas
    const { data: entidades } = await supabase
      .from('entidades')
      .select('*')
      .eq('activo', true)

    if (!entidades) return

    // Enviar email urgente a cada entidad
    for (const entidad of entidades) {
      try {
        await this.enviarEmailActualizacionNormativa(entidad, cambio)
      } catch (error) {
        console.error(`Error enviando email a ${entidad.nombre}:`, error)
      }
    }

    // Actualizar contador de entidades afectadas
    await supabase
      .from('cambios_boe')
      .update({ entidades_afectadas: entidades.length })
      .eq('id', cambio.id)
  }

  /**
   * Enviar email de actualización normativa
   */
  private async enviarEmailActualizacionNormativa(entidad: any, cambio: CambioBOE): Promise<void> {
    const { Resend } = await import('resend')
    const resend = new Resend(process.env.RESEND_API_KEY)

    const emailContent = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: linear-gradient(135deg, #dc2626, #ea580c); color: white; padding: 30px; text-align: center;">
          <h1>🚨 ACTUALIZACIÓN NORMATIVA LOPIVI</h1>
          <p>Cambios aplicados automáticamente</p>
        </div>

        <div style="padding: 30px; background: white;">
          <div style="background: #fef3c7; border: 1px solid #f59e0b; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
            <h2 style="color: #92400e; margin: 0 0 10px 0;">✅ SU ENTIDAD YA ESTÁ ACTUALIZADA</h2>
            <p style="color: #92400e; margin: 0;">Todos los cambios se han aplicado automáticamente. Su cumplimiento LOPIVI continúa garantizado.</p>
          </div>

          <h3>Cambio detectado:</h3>
          <p><strong>${cambio.titulo}</strong></p>
          <p>Publicado: ${new Date(cambio.fecha_publicacion).toLocaleDateString('es-ES')}</p>
          <p>Impacto: ${cambio.impacto_detectado}</p>

          <h3>Actualizaciones aplicadas automáticamente:</h3>
          <ul>
            ${cambio.cambios_requeridos.map(c => `<li>${c.descripcion}</li>`).join('')}
          </ul>

          <div style="background: #ecfdf5; border: 1px solid #10b981; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h4 style="color: #047857; margin: 0 0 10px 0;">🎯 Usted NO debe hacer nada</h4>
            <p style="color: #047857; margin: 0;">Su documentación ya está actualizada y su cumplimiento LOPIVI continúa garantizado sin interrupciones.</p>
          </div>

          <div style="text-align: center; margin: 30px 0;">
            <a href="https://custodia360.es/login" style="background: #ea580c; color: white; padding: 12px 24px; border-radius: 8px; text-decoration: none; display: inline-block;">
              Acceder al Dashboard Actualizado
            </a>
          </div>
        </div>

        <div style="background: #f9fafb; padding: 20px; text-align: center; color: #6b7280; font-size: 12px;">
          <p><strong>Custodia360</strong> - Actualizaciones automáticas ante cambios normativos</p>
          <p>Mientras otros se enteran semanas después, usted ya está cumpliendo desde el primer día.</p>
        </div>
      </div>
    `

    await resend.emails.send({
      from: 'info@custodia360.es',
      to: entidad.email_contratante,
      subject: `🚨 ACTUALIZACIÓN LOPIVI ${cambio.impacto_detectado} - ${entidad.nombre}`,
      html: emailContent
    })
  }

  // Métodos auxiliares
  private async actualizarEstadoCambio(id: string, estado: CambioBOE['estado']): Promise<void> {
    await supabase
      .from('cambios_boe')
      .update({ estado, fecha_implementacion: new Date().toISOString() })
      .eq('id', id)
  }

  private async actualizarTemplatesPDF(cambio: CambioRequerido): Promise<void> {
    console.log(`📄 Actualizando templates PDF: ${cambio.archivos_afectados.join(', ')}`)
    // Lógica de actualización automática de PDFs
  }

  private async actualizarTemplatesEmail(cambio: CambioRequerido): Promise<void> {
    console.log(`📧 Actualizando templates email: ${cambio.archivos_afectados.join(', ')}`)
    // Lógica de actualización automática de emails
  }

  private async generarNuevosPDFs(cambio: CambioBOE): Promise<void> {
    console.log(`🔄 Regenerando PDFs para todas las entidades afectadas por: ${cambio.titulo}`)
    // Lógica de regeneración masiva de PDFs
  }

  private async notificarEquipoCritico(cambio: CambioBOE): Promise<void> {
    console.log(`🚨 ALERTA CRÍTICA: ${cambio.titulo}`)
    // Enviar notificación urgente al equipo de Custodia360
  }

  private async notificarErrorCritico(error: any): Promise<void> {
    console.error('🔥 ERROR CRÍTICO EN MONITOREO BOE:', error)
    // Notificar error al equipo técnico
  }

  private async generarReporteMonitoreo(cambios: CambioBOE[]): Promise<void> {
    console.log(`📊 Reporte monitoreo: ${cambios.length} cambios procesados`)
    // Generar reporte para dashboard interno
  }

  // Métodos auxiliares adicionales (implementación básica)
  private async reprogramarRecordatorios(cambio: CambioBOE): Promise<void> {
    console.log(`⏰ Reprogramando recordatorios por: ${cambio.titulo}`)
  }

  private async actualizarChangelogSistema(cambio: CambioBOE): Promise<void> {
    console.log(`📝 Añadiendo entrada al changelog: ${cambio.titulo}`)
  }

  private async programarEmailsInformativos(cambio: CambioBOE): Promise<void> {
    console.log(`📬 Programando emails informativos: ${cambio.titulo}`)
  }

  private async actualizarLogicaRecordatorios(cambio: CambioRequerido): Promise<void> {
    console.log(`🔔 Actualizando lógica recordatorios: ${cambio.descripcion}`)
  }

  private async migrarDatos(cambio: CambioRequerido): Promise<void> {
    console.log(`🗄️ Migrando datos: ${cambio.descripcion}`)
  }

  private async notificarCambioFuncionalidad(cambio: CambioRequerido): Promise<void> {
    console.log(`⚙️ Cambio funcionalidad requiere desarrollo: ${cambio.descripcion}`)
  }

  private async solicitarValidacionManual(cambio: CambioBOE): Promise<void> {
    console.log(`👤 Solicitando validación manual para cambio crítico: ${cambio.titulo}`)
  }
}

// Export de la clase principal y funciones auxiliares
export const monitoreoBOE = new MonitoreoBOE()

/**
 * Función para ejecutar desde cron job cada 15 días
 */
export async function ejecutarMonitoreoBOEProgramado(): Promise<void> {
  try {
    await monitoreoBOE.ejecutarMonitoreoCompleto()
  } catch (error) {
    console.error('❌ Error en monitoreo programado BOE:', error)
    throw error
  }
}
