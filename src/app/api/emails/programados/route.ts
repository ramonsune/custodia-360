import { NextResponse } from 'next/server'
import emailTemplates from '@/lib/email-templates'

export async function POST(request: Request) {
  try {
    const {
      tipo,
      emailDestino,
      nombreDestino,
      nombreEntidad,
      datos = {}
    } = await request.json()

    console.log(`📧 Enviando email programado tipo: ${tipo} a: ${emailDestino}`)

    let resultado

    switch (tipo) {
      case 'recordatorio_formacion':
        resultado = await emailTemplates.enviarRecordatorioFormacion(
          emailDestino,
          nombreDestino,
          nombreEntidad,
          datos.progresoActual || 45
        )
        break

      case 'estado_formacion':
        resultado = await emailTemplates.enviarEstadoFormacion(
          emailDestino,
          nombreDestino,
          nombreEntidad,
          datos.nombreDelegado || 'Delegado',
          datos.progresoFormacion || 75
        )
        break

      case 'factura_segundo_pago':
        resultado = await emailTemplates.enviarFacturaSegundoPago(
          emailDestino,
          nombreEntidad,
          nombreDestino,
          datos.numeroFactura || `FAC-${Date.now()}`,
          datos.importe || 49,
          datos.plan || 'Plan 200'
        )
        break

      case 'renovacion_anual':
        resultado = await emailTemplates.enviarRenovacionAnual(
          emailDestino,
          nombreEntidad,
          nombreDestino,
          datos.numeroFactura || `FAC-${Date.now()}`,
          datos.importe || 98,
          datos.plan || 'Plan 200',
          datos.fechaVencimiento || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toLocaleDateString('es-ES')
        )
        break

      case 'recordatorio_renovacion':
        resultado = await emailTemplates.enviarRecordatorioRenovacion(
          emailDestino,
          nombreDestino,
          nombreEntidad,
          datos.fechaVencimiento || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toLocaleDateString('es-ES'),
          datos.diasRestantes || 30
        )
        break

      case 'vencimiento_certificacion':
        resultado = await emailTemplates.enviarVencimientoCertificacion(
          emailDestino,
          nombreDestino,
          nombreEntidad,
          datos.fechaVencimiento || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toLocaleDateString('es-ES'),
          datos.diasRestantes || 30
        )
        break

      case 'recordatorio_certificacion_90_dias':
        resultado = await emailTemplates.enviarRecordatorioCertificacion90Dias(
          emailDestino,
          nombreDestino,
          nombreEntidad,
          datos.tipoDelegado || 'Principal',
          datos.fechaVencimiento || new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toLocaleDateString('es-ES')
        )
        break

      case 'informe_trimestral':
        resultado = await emailTemplates.enviarInformeTrimestral(
          emailDestino,
          nombreDestino,
          nombreEntidad,
          datos.trimestre || 'Q1 2024',
          datos.estadoCumplimiento || 90,
          datos.incidentes || 0,
          datos.actualizaciones || ['Sistema actualizado']
        )
        break

      case 'documentacion_solicitada':
        resultado = await emailTemplates.enviarDocumentacionSolicitada(
          emailDestino,
          nombreEntidad,
          datos.tipoDocumentacion || 'Documentación LOPIVI completa',
          datos.mensajePersonalizado
        )
        break

      case 'informe_emergencia_inspeccion':
        resultado = await emailTemplates.enviarInformeEmergenciaInspeccion(
          emailDestino,
          nombreEntidad,
          datos.motivoInforme || 'Inspección programada',
          datos.fechaInforme || new Date().toLocaleDateString('es-ES')
        )
        break

      case 'paquete_urgente':
        if (!datos.emailAdministrativo) {
          throw new Error('Email administrativo requerido para paquete urgente')
        }
        resultado = await emailTemplates.enviarPaqueteUrgente(
          emailDestino, // Contratante
          datos.emailAdministrativo, // Administrativo
          nombreEntidad,
          datos.motivo || 'Solicitud urgente'
        )
        break

      default:
        throw new Error(`Tipo de email no reconocido: ${tipo}`)
    }

    console.log(`✅ Email programado ${tipo} enviado correctamente`)

    return NextResponse.json({
      success: true,
      tipo,
      emailId: resultado?.data?.id || 'enviado',
      message: `Email ${tipo} enviado correctamente`
    })

  } catch (error) {
    console.error('❌ Error enviando email programado:', error)
    return NextResponse.json({
      success: false,
      error: 'Error enviando email programado',
      details: error instanceof Error ? error.message : 'Error desconocido'
    }, { status: 500 })
  }
}

// GET para obtener emails programados pendientes
export async function GET() {
  try {
    // Aquí podrías implementar una base de datos para manejar emails programados
    // Por ahora, devolvemos un estado simple

    const emailsProgramados = [
      {
        id: 1,
        tipo: 'recordatorio_formacion',
        entidad: 'Club Deportivo Ejemplo',
        programadoPara: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
        estado: 'pendiente'
      },
      {
        id: 2,
        tipo: 'factura_segundo_pago',
        entidad: 'Academia Deportiva Madrid',
        programadoPara: new Date(Date.now() + 180 * 24 * 60 * 60 * 1000).toISOString(), // 6 meses
        estado: 'pendiente'
      },
      {
        id: 3,
        tipo: 'recordatorio_certificacion_90_dias',
        entidad: 'Club Deportivo Los Leones',
        programadoPara: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 días
        estado: 'pendiente',
        datos: {
          tipoDelegado: 'Principal',
          nombreDestino: 'Ana Fernández López'
        }
      },
      {
        id: 4,
        tipo: 'recordatorio_certificacion_90_dias',
        entidad: 'Academia Deportiva Valencia',
        programadoPara: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toISOString(), // 15 días
        estado: 'pendiente',
        datos: {
          tipoDelegado: 'Suplente',
          nombreDestino: 'María García López'
        }
      }
    ]

    return NextResponse.json({
      success: true,
      emailsProgramados,
      total: emailsProgramados.length
    })

  } catch (error) {
    console.error('❌ Error obteniendo emails programados:', error)
    return NextResponse.json({
      success: false,
      error: 'Error obteniendo emails programados'
    }, { status: 500 })
  }
}
