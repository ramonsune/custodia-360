import { NextResponse } from 'next/server'
import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)
const FROM_EMAIL = process.env.RESEND_FROM_EMAIL || 'noreply@custodia360.es'

export async function POST(request: Request) {
  try {
    const {
      email_destino,
      reporte,
      entidad_id
    } = await request.json()

    if (!email_destino || !reporte) {
      return NextResponse.json(
        { error: 'Email destino y reporte son obligatorios' },
        { status: 400 }
      )
    }

    const fechaGeneracion = new Date(reporte.metadatos.fecha_generacion).toLocaleDateString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })

    // Determinar color del estado según cumplimiento
    const colorCumplimiento = reporte.estadisticas.cumplimiento_lopivi.porcentaje_cumplimiento >= 90 ? '#10b981' :
                             reporte.estadisticas.cumplimiento_lopivi.porcentaje_cumplimiento >= 70 ? '#f59e0b' : '#ef4444'

    const html = `
      <div style="font-family: system-ui, -apple-system, sans-serif; max-width: 700px; margin: 0 auto; background-color: #f9fafb; padding: 20px;">
        <div style="background-color: white; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);">

          <!-- Header -->
          <div style="background: linear-gradient(135deg, #3b82f6 0%, #1e40af 100%); padding: 30px; text-align: center;">
            <h1 style="color: white; margin: 0; font-size: 24px; font-weight: 700;">📊 Reporte Automático LOPIVI</h1>
            <p style="color: #bfdbfe; margin: 8px 0 0 0; font-size: 14px;">
              Sistema de Protección Integral a la Infancia y Adolescencia
            </p>
          </div>

          <!-- Información del Reporte -->
          <div style="padding: 30px;">
            <div style="background-color: #f1f5f9; border-left: 4px solid #3b82f6; padding: 20px; margin-bottom: 25px;">
              <h2 style="margin-top: 0; color: #1e40af; font-size: 18px;">Información del Reporte</h2>
              <div style="display: grid; gap: 10px; font-size: 14px;">
                <div><strong>ID:</strong> ${reporte.metadatos.id_reporte}</div>
                <div><strong>Tipo:</strong> ${reporte.metadatos.tipo_reporte.charAt(0).toUpperCase() + reporte.metadatos.tipo_reporte.slice(1)}</div>
                <div><strong>Generado:</strong> ${fechaGeneracion}</div>
                <div><strong>Período:</strong> ${reporte.resumen_ejecutivo.periodo_analizado}</div>
                <div><strong>Hash de integridad:</strong> <span style="font-family: monospace; background: #e2e8f0; padding: 2px 6px; border-radius: 4px;">${reporte.metadatos.hash_integridad}</span></div>
              </div>
            </div>

            <!-- Resumen Ejecutivo -->
            <div style="margin-bottom: 25px;">
              <h2 style="color: #374151; font-size: 18px; margin-bottom: 15px;">📋 Resumen Ejecutivo</h2>
              <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 15px;">

                <!-- Total Casos -->
                <div style="background: #fef3c7; border: 1px solid #f59e0b; border-radius: 8px; padding: 15px; text-align: center;">
                  <div style="font-size: 24px; font-weight: 700; color: #92400e;">${reporte.resumen_ejecutivo.total_casos_analizados}</div>
                  <div style="color: #92400e; font-size: 12px; font-weight: 600;">CASOS ANALIZADOS</div>
                </div>

                <!-- Casos Atención -->
                <div style="background: #fee2e2; border: 1px solid #ef4444; border-radius: 8px; padding: 15px; text-align: center;">
                  <div style="font-size: 24px; font-weight: 700; color: #dc2626;">${reporte.resumen_ejecutivo.casos_requieren_atencion}</div>
                  <div style="color: #dc2626; font-size: 12px; font-weight: 600;">REQUIEREN ATENCIÓN</div>
                </div>

                <!-- Cumplimiento -->
                <div style="background: ${colorCumplimiento === '#10b981' ? '#d1fae5' : colorCumplimiento === '#f59e0b' ? '#fef3c7' : '#fee2e2'}; border: 1px solid ${colorCumplimiento}; border-radius: 8px; padding: 15px; text-align: center;">
                  <div style="font-size: 24px; font-weight: 700; color: ${colorCumplimiento};">${reporte.resumen_ejecutivo.porcentaje_cumplimiento_lopivi}%</div>
                  <div style="color: ${colorCumplimiento}; font-size: 12px; font-weight: 600;">CUMPLIMIENTO LOPIVI</div>
                </div>
              </div>
            </div>

            <!-- Estadísticas Detalladas -->
            <div style="margin-bottom: 25px;">
              <h2 style="color: #374151; font-size: 18px; margin-bottom: 15px;">📈 Estadísticas Detalladas</h2>

              <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 20px;">

                <!-- Por Estado -->
                <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 15px;">
                  <h3 style="margin-top: 0; color: #475569; font-size: 14px;">Casos por Estado</h3>
                  <div style="space-y: 8px;">
                    <div style="display: flex; justify-content: space-between; align-items: center; padding: 4px 0;">
                      <span style="color: #64748b;">Activos</span>
                      <span style="background: #dc2626; color: white; padding: 2px 8px; border-radius: 12px; font-size: 12px; font-weight: 600;">${reporte.estadisticas.casos_por_estado.activo || 0}</span>
                    </div>
                    <div style="display: flex; justify-content: space-between; align-items: center; padding: 4px 0;">
                      <span style="color: #64748b;">Pendientes</span>
                      <span style="background: #f59e0b; color: white; padding: 2px 8px; border-radius: 12px; font-size: 12px; font-weight: 600;">${reporte.estadisticas.casos_por_estado.pendiente || 0}</span>
                    </div>
                    <div style="display: flex; justify-content: space-between; align-items: center; padding: 4px 0;">
                      <span style="color: #64748b;">En Revisión</span>
                      <span style="background: #3b82f6; color: white; padding: 2px 8px; border-radius: 12px; font-size: 12px; font-weight: 600;">${reporte.estadisticas.casos_por_estado.en_revision || 0}</span>
                    </div>
                    <div style="display: flex; justify-content: space-between; align-items: center; padding: 4px 0;">
                      <span style="color: #64748b;">Resueltos</span>
                      <span style="background: #10b981; color: white; padding: 2px 8px; border-radius: 12px; font-size: 12px; font-weight: 600;">${reporte.estadisticas.casos_por_estado.resuelto || 0}</span>
                    </div>
                  </div>
                </div>

                <!-- Por Prioridad -->
                <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 15px;">
                  <h3 style="margin-top: 0; color: #475569; font-size: 14px;">Casos por Prioridad</h3>
                  <div style="space-y: 8px;">
                    <div style="display: flex; justify-content: space-between; align-items: center; padding: 4px 0;">
                      <span style="color: #64748b;">Alta</span>
                      <span style="background: #dc2626; color: white; padding: 2px 8px; border-radius: 12px; font-size: 12px; font-weight: 600;">${reporte.estadisticas.casos_por_prioridad.alta || 0}</span>
                    </div>
                    <div style="display: flex; justify-content: space-between; align-items: center; padding: 4px 0;">
                      <span style="color: #64748b;">Media</span>
                      <span style="background: #f59e0b; color: white; padding: 2px 8px; border-radius: 12px; font-size: 12px; font-weight: 600;">${reporte.estadisticas.casos_por_prioridad.media || 0}</span>
                    </div>
                    <div style="display: flex; justify-content: space-between; align-items: center; padding: 4px 0;">
                      <span style="color: #64748b;">Baja</span>
                      <span style="background: #10b981; color: white; padding: 2px 8px; border-radius: 12px; font-size: 12px; font-weight: 600;">${reporte.estadisticas.casos_por_prioridad.baja || 0}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Observaciones -->
            <div style="margin-bottom: 25px;">
              <h2 style="color: #374151; font-size: 18px; margin-bottom: 15px;">💡 Observaciones</h2>
              <div style="background: #f0f9ff; border: 1px solid #0ea5e9; border-radius: 8px; padding: 15px;">
                <ul style="margin: 0; padding-left: 20px; color: #0c4a6e;">
                  ${reporte.resumen_ejecutivo.observaciones.map(obs => `<li style="margin-bottom: 8px;">${obs}</li>`).join('')}
                </ul>
              </div>
            </div>

            <!-- Cumplimiento LOPIVI -->
            <div style="margin-bottom: 25px;">
              <h2 style="color: #374151; font-size: 18px; margin-bottom: 15px;">⚖️ Análisis de Cumplimiento LOPIVI</h2>
              <div style="background: #fafafa; border: 1px solid #e5e5e5; border-radius: 8px; padding: 20px;">
                <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 15px; margin-bottom: 15px;">
                  <div>
                    <div style="color: #16a34a; font-size: 20px; font-weight: 700;">${reporte.estadisticas.cumplimiento_lopivi.casos_conformes}</div>
                    <div style="color: #16a34a; font-size: 12px;">Casos Conformes</div>
                  </div>
                  <div>
                    <div style="color: #dc2626; font-size: 20px; font-weight: 700;">${reporte.estadisticas.cumplimiento_lopivi.casos_requieren_revision}</div>
                    <div style="color: #dc2626; font-size: 12px;">Requieren Revisión</div>
                  </div>
                  <div>
                    <div style="color: ${colorCumplimiento}; font-size: 20px; font-weight: 700;">${reporte.estadisticas.cumplimiento_lopivi.porcentaje_cumplimiento}%</div>
                    <div style="color: ${colorCumplimiento}; font-size: 12px;">Cumplimiento Global</div>
                  </div>
                </div>

                <!-- Barra de progreso -->
                <div style="background: #e5e7eb; border-radius: 10px; height: 8px; margin-top: 15px;">
                  <div style="background: ${colorCumplimiento}; height: 8px; border-radius: 10px; width: ${reporte.estadisticas.cumplimiento_lopivi.porcentaje_cumplimiento}%;"></div>
                </div>
              </div>
            </div>

            <!-- Acciones Recomendadas -->
            ${reporte.resumen_ejecutivo.casos_requieren_atencion > 0 ? `
            <div style="background: #fef2f2; border: 1px solid #fecaca; border-radius: 8px; padding: 20px; margin-bottom: 25px;">
              <h3 style="margin-top: 0; color: #dc2626; font-size: 16px;">⚠️ Acciones Recomendadas</h3>
              <ul style="margin: 10px 0 0 0; padding-left: 20px; color: #7f1d1d;">
                <li>Revisar ${reporte.resumen_ejecutivo.casos_requieren_atencion} casos que requieren atención inmediata</li>
                ${reporte.estadisticas.cumplimiento_lopivi.casos_requieren_revision > 0 ? `<li>Actualizar ${reporte.estadisticas.cumplimiento_lopivi.casos_requieren_revision} casos para cumplir con LOPIVI</li>` : ''}
                <li>Programar seguimiento de casos activos de alta prioridad</li>
                <li>Verificar cumplimiento de protocolos en casos pendientes</li>
              </ul>
            </div>
            ` : ''}

            <!-- Botones de Acción -->
            <div style="text-align: center; margin-top: 30px;">
              <a href="${process.env.NEXT_PUBLIC_APP_URL}/dashboard-delegado"
                 style="display: inline-block; background-color: #3b82f6; color: white; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: 600; margin-right: 10px;">
                Ver Dashboard
              </a>
              <a href="${process.env.NEXT_PUBLIC_APP_URL}/dashboard-delegado/reportes"
                 style="display: inline-block; background-color: #059669; color: white; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: 600;">
                Descargar Reporte PDF
              </a>
            </div>
          </div>

          <!-- Footer -->
          <div style="background-color: #f9fafb; padding: 20px; text-align: center; border-top: 1px solid #e5e7eb;">
            <div style="color: #6b7280; font-size: 12px;">
              <p style="margin: 0;"><strong>Custodia360 - Sistema Automatizado LOPIVI</strong></p>
              <p style="margin: 5px 0 0 0;">
                Reporte generado automáticamente el ${fechaGeneracion}
              </p>
              <p style="margin: 5px 0 0 0; color: #ef4444; font-weight: 600;">
                📋 Este reporte es válido para auditorías oficiales de cumplimiento LOPIVI
              </p>
            </div>
          </div>
        </div>
      </div>
    `

    const result = await resend.emails.send({
      from: FROM_EMAIL,
      to: email_destino,
      subject: `📊 Reporte Automático LOPIVI - ${reporte.metadatos.tipo_reporte.charAt(0).toUpperCase() + reporte.metadatos.tipo_reporte.slice(1)} | ${reporte.resumen_ejecutivo.periodo_analizado}`,
      html
    })

    console.log('✅ Reporte automático enviado por email:', result.data?.id)

    return NextResponse.json({
      success: true,
      emailId: result.data?.id,
      destinatario: email_destino,
      reporte_id: reporte.metadatos.id_reporte,
      message: 'Reporte automático enviado correctamente'
    })

  } catch (error) {
    console.error('❌ Error enviando reporte automático:', error)
    return NextResponse.json({
      success: false,
      error: 'Error enviando reporte automático',
      details: error instanceof Error ? error.message : 'Error desconocido'
    }, { status: 500 })
  }
}
