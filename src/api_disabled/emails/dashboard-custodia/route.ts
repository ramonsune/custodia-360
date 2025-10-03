import { NextResponse } from 'next/server'
import emailTemplates from '@/lib/email-templates'

export async function POST(request: Request) {
  try {
    const {
      accion,
      entidadId,
      nombreEntidad,
      emailContratante,
      emailAdministrativo,
      tipoDocumentacion,
      mensajePersonalizado,
      motivoInforme,
      motivo
    } = await request.json()

    console.log(`📧 Dashboard Custodia360 - Acción: ${accion} para entidad: ${nombreEntidad}`)

    let resultado

    switch (accion) {
      case 'enviar_documentacion':
        if (!emailContratante || !nombreEntidad || !tipoDocumentacion) {
          throw new Error('Datos incompletos para envío de documentación')
        }

        resultado = await emailTemplates.enviarDocumentacionSolicitada(
          emailContratante,
          nombreEntidad,
          tipoDocumentacion,
          mensajePersonalizado
        )

        console.log(`✅ Documentación enviada a ${nombreEntidad}: ${tipoDocumentacion}`)
        break

      case 'informe_inspeccion':
        if (!emailContratante || !nombreEntidad || !motivoInforme) {
          throw new Error('Datos incompletos para informe de inspección')
        }

        resultado = await emailTemplates.enviarInformeEmergenciaInspeccion(
          emailContratante,
          nombreEntidad,
          motivoInforme,
          new Date().toLocaleDateString('es-ES')
        )

        console.log(`✅ Informe de inspección enviado a ${nombreEntidad}: ${motivoInforme}`)
        break

      case 'paquete_urgente':
        if (!emailContratante || !emailAdministrativo || !nombreEntidad || !motivo) {
          throw new Error('Datos incompletos para paquete urgente')
        }

        resultado = await emailTemplates.enviarPaqueteUrgente(
          emailContratante,
          emailAdministrativo,
          nombreEntidad,
          motivo
        )

        console.log(`✅ Paquete urgente enviado a ${nombreEntidad}: ${motivo}`)
        break

      case 'recordatorio_renovacion':
        if (!emailContratante || !nombreEntidad) {
          throw new Error('Datos incompletos para recordatorio de renovación')
        }

        const fechaVencimiento = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toLocaleDateString('es-ES')

        resultado = await emailTemplates.enviarRecordatorioRenovacion(
          emailContratante,
          'Responsable', // Nombre genérico si no se proporciona
          nombreEntidad,
          fechaVencimiento,
          30 // 30 días de margen
        )

        console.log(`✅ Recordatorio de renovación enviado a ${nombreEntidad}`)
        break

      case 'informe_trimestral':
        if (!emailContratante || !nombreEntidad) {
          throw new Error('Datos incompletos para informe trimestral')
        }

        const trimestre = `Q${Math.ceil((new Date().getMonth() + 1) / 3)} ${new Date().getFullYear()}`

        resultado = await emailTemplates.enviarInformeTrimestral(
          emailContratante,
          'Responsable', // Nombre genérico si no se proporciona
          nombreEntidad,
          trimestre,
          95, // Estado de cumplimiento por defecto
          0, // Incidentes por defecto
          ['Sistema actualizado', 'Normativa vigente', 'Delegados certificados']
        )

        console.log(`✅ Informe trimestral enviado a ${nombreEntidad}`)
        break

      case 'factura_segundo_pago':
        if (!emailAdministrativo || !nombreEntidad) {
          throw new Error('Datos incompletos para factura segundo pago')
        }

        const numeroFactura = `FAC-${Date.now()}-${Math.random().toString(36).substr(2, 5).toUpperCase()}`

        resultado = await emailTemplates.enviarFacturaSegundoPago(
          emailAdministrativo,
          nombreEntidad,
          'Responsable Administrativo',
          numeroFactura,
          49, // Importe por defecto
          'Plan 200' // Plan por defecto
        )

        console.log(`✅ Factura segundo pago enviada a ${nombreEntidad}`)
        break

      default:
        throw new Error(`Acción no reconocida: ${accion}`)
    }

    return NextResponse.json({
      success: true,
      accion,
      entidad: nombreEntidad,
      emailId: resultado?.data?.id || 'enviado',
      message: `${accion} ejecutada correctamente para ${nombreEntidad}`,
      timestamp: new Date().toISOString()
    })

  } catch (error) {
    console.error('❌ Error en dashboard Custodia360:', error)
    return NextResponse.json({
      success: false,
      error: 'Error ejecutando acción desde dashboard',
      details: error instanceof Error ? error.message : 'Error desconocido'
    }, { status: 500 })
  }
}

// GET para obtener estadísticas de emails enviados
export async function GET() {
  try {
    // Aquí podrías implementar estadísticas reales desde una base de datos
    const estadisticas = {
      emailsEnviadosHoy: 12,
      emailsEnviadosSemana: 89,
      emailsEnviadosMes: 347,
      tiposEmailEnviados: {
        documentacion: 45,
        informes: 23,
        facturas: 156,
        certificaciones: 89,
        recordatorios: 34
      },
      entidadesActivas: 127,
      ultimosEnvios: [
        {
          fecha: new Date().toISOString(),
          tipo: 'documentacion',
          entidad: 'Club Deportivo Los Pinos',
          estado: 'enviado'
        },
        {
          fecha: new Date(Date.now() - 3600000).toISOString(),
          tipo: 'informe_inspeccion',
          entidad: 'Academia Madrid Sur',
          estado: 'enviado'
        },
        {
          fecha: new Date(Date.now() - 7200000).toISOString(),
          tipo: 'factura_segundo_pago',
          entidad: 'Centro Deportivo Aqua',
          estado: 'enviado'
        }
      ]
    }

    return NextResponse.json({
      success: true,
      estadisticas,
      timestamp: new Date().toISOString()
    })

  } catch (error) {
    console.error('❌ Error obteniendo estadísticas:', error)
    return NextResponse.json({
      success: false,
      error: 'Error obteniendo estadísticas'
    }, { status: 500 })
  }
}
