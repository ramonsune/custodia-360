import { NextResponse } from 'next/server'
import emailTemplates from '@/lib/email-templates'

export async function POST(request: Request) {
  try {
    const data = await request.json()
    const {
      // Datos de la entidad
      nombreEntidad,
      cif,
      tipoEntidad,
      numeroMenores,
      direccion,
      telefono,
      web,

      // Datos del contratante
      nombreContratante,
      dniContratante,
      cargoContratante,
      telefonoContratante,
      emailContratante,
      contraseñaContratante,

      // Datos del delegado principal
      nombreDelegadoPrincipal,
      dniDelegadoPrincipal,
      fechaNacimientoDelegadoPrincipal,
      telefonoDelegadoPrincipal,
      emailDelegadoPrincipal,
      contraseñaDelegadoPrincipal,
      funcionDelegadoPrincipal,
      experienciaPrevia,
      formacionPrevia,

      // Datos del delegado suplente (opcional)
      tieneSuplente,
      nombreDelegadoSuplente,
      dniDelegadoSuplente,
      fechaNacimientoDelegadoSuplente,
      telefonoDelegadoSuplente,
      emailDelegadoSuplente,
      contraseñaDelegadoSuplente,
      funcionDelegadoSuplente,

      // Datos del administrativo
      nombreAdministrativo,
      dniAdministrativo,
      cargoAdministrativo,
      telefonoAdministrativo,
      emailAdministrativo,

      // Datos del plan y pago
      plan,
      importeTotal,
      kitComunicacion,
      numeroFactura
    } = data

    console.log('📧 Iniciando secuencia de emails de contratación CORREGIDA para:', nombreEntidad)

    // Array para almacenar los resultados de los emails enviados
    const emailsEnviados = []

    try {
      // 1. EMAIL INMEDIATO → Admin Custodia360: Notificación nueva contratación
      console.log('📧 Enviando email 1: Notificación admin nueva contratación')
      const emailAdmin = await fetch('/api/emails/admin-notificacion', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nombreEntidad,
          nombreContratante,
          plan,
          importeTotal,
          emailContratante,
          emailAdministrativo
        })
      })
      emailsEnviados.push({ tipo: 'admin_notificacion', enviado: emailAdmin.ok })

      // 2. EMAIL INMEDIATO → Contratante: Confirmación de contratación con credenciales
      console.log('📧 Enviando email 2: Confirmación contratación al contratante')
      const emailConfirmacion = await emailTemplates.enviarConfirmacionContratacion(
        emailContratante,
        nombreContratante,
        nombreEntidad,
        plan,
        { email: emailContratante, password: contraseñaContratante }
      )
      emailsEnviados.push({ tipo: 'confirmacion_contratacion', enviado: !!emailConfirmacion.data })

      // 3. EMAIL INMEDIATO → Administrativo: Factura primer pago
      console.log('📧 Enviando email 3: Factura primer pago al administrativo')
      const emailFactura = await emailTemplates.enviarFacturaPrimerPago(
        emailAdministrativo,
        nombreEntidad,
        nombreAdministrativo,
        numeroFactura || `FAC-${Date.now()}`,
        importeTotal / 2, // 50% primer pago
        plan
      )
      emailsEnviados.push({ tipo: 'factura_primer_pago', enviado: !!emailFactura.data })

      // 4. EMAIL +1h → Delegado Principal: Credenciales y asignación
      console.log('📧 Programando email 4: Credenciales delegado principal (+1h)')
      setTimeout(async () => {
        try {
          await emailTemplates.enviarCredencialesDelegado(
            emailDelegadoPrincipal,
            nombreDelegadoPrincipal,
            'principal',
            nombreEntidad,
            { email: emailDelegadoPrincipal, password: contraseñaDelegadoPrincipal }
          )
          console.log('✅ Email credenciales delegado principal enviado')
        } catch (error) {
          console.error('❌ Error enviando credenciales delegado principal:', error)
        }
      }, 1 * 60 * 60 * 1000) // 1 hora

      // 5. EMAIL +1h → Delegado Suplente (si existe): Credenciales y asignación
      if (tieneSuplente && emailDelegadoSuplente) {
        console.log('📧 Programando email 5: Credenciales delegado suplente (+1h)')
        setTimeout(async () => {
          try {
            await emailTemplates.enviarCredencialesDelegado(
              emailDelegadoSuplente,
              nombreDelegadoSuplente,
              'suplente',
              nombreEntidad,
              { email: emailDelegadoSuplente, password: contraseñaDelegadoSuplente }
            )
            console.log('✅ Email credenciales delegado suplente enviado')
          } catch (error) {
            console.error('❌ Error enviando credenciales delegado suplente:', error)
          }
        }, 1.1 * 60 * 60 * 1000) // 1 hora 6 minutos

        emailsEnviados.push({ tipo: 'credenciales_suplente', programado: true })
      }

      // 6. EMAIL +48h CONDICIONAL → Delegado Principal: Recordatorio si NO ha iniciado formación
      console.log('📧 Programando email 6: Recordatorio formación delegado principal (+48h CONDICIONAL)')
      setTimeout(async () => {
        try {
          // TODO: En producción, verificar si realmente NO ha iniciado la formación
          // Por ahora enviamos recordatorio simulado
          await emailTemplates.enviarRecordatorioFormacion(
            emailDelegadoPrincipal,
            nombreDelegadoPrincipal,
            nombreEntidad,
            0 // 0% progreso simulado
          )
          console.log('✅ Email recordatorio formación delegado principal enviado (CONDICIONAL)')
        } catch (error) {
          console.error('❌ Error enviando recordatorio formación delegado principal:', error)
        }
      }, 48 * 60 * 60 * 1000) // 48 horas

      // 7. EMAIL +48h CONDICIONAL → Delegado Suplente: Recordatorio si NO ha iniciado formación
      if (tieneSuplente && emailDelegadoSuplente) {
        console.log('📧 Programando email 7: Recordatorio formación delegado suplente (+48h CONDICIONAL)')
        setTimeout(async () => {
          try {
            // TODO: En producción, verificar si realmente NO ha iniciado la formación
            await emailTemplates.enviarRecordatorioFormacion(
              emailDelegadoSuplente,
              nombreDelegadoSuplente,
              nombreEntidad,
              0 // 0% progreso simulado
            )
            console.log('✅ Email recordatorio formación delegado suplente enviado (CONDICIONAL)')
          } catch (error) {
            console.error('❌ Error enviando recordatorio formación delegado suplente:', error)
          }
        }, 48.1 * 60 * 60 * 1000) // 48 horas 6 minutos

        emailsEnviados.push({ tipo: 'recordatorio_suplente', programado: true })
      }

      // 8. EMAIL +1 semana → Contratante: Check-up semanal (simulado)
      console.log('📧 Programando email 8: Check-up semanal (+1 semana)')
      setTimeout(async () => {
        try {
          await emailTemplates.enviarInformeTrimestral(
            emailContratante,
            nombreContratante,
            nombreEntidad,
            '1ª Semana',
            95, // Estado de cumplimiento inicial
            0, // Incidentes gestionados
            ['Implementación inicial completada', 'Delegados en formación', 'Sistema en activación']
          )
          console.log('✅ Email check-up semanal enviado')
        } catch (error) {
          console.error('❌ Error enviando check-up semanal:', error)
        }
      }, 7 * 24 * 60 * 60 * 1000) // 1 semana

      // 9. EMAIL +6 meses → Administrativo: Factura segundo pago
      console.log('📧 Programando email 9: Factura segundo pago (+6 meses)')
      setTimeout(async () => {
        try {
          await emailTemplates.enviarFacturaSegundoPago(
            emailAdministrativo,
            nombreEntidad,
            nombreAdministrativo,
            `FAC2-${Date.now()}`,
            importeTotal / 2, // 50% segundo pago
            plan
          )
          console.log('✅ Email factura segundo pago enviado')
        } catch (error) {
          console.error('❌ Error enviando factura segundo pago:', error)
        }
      }, 6 * 30 * 24 * 60 * 60 * 1000) // 6 meses (aproximado)

      emailsEnviados.push({ tipo: 'credenciales_principal', programado: true })
      emailsEnviados.push({ tipo: 'recordatorio_principal', programado: true })
      emailsEnviados.push({ tipo: 'check_up_semanal', programado: true })
      emailsEnviados.push({ tipo: 'factura_segundo_pago', programado: true })

      console.log('✅ Secuencia de emails de contratación CORREGIDA iniciada correctamente')
      console.log('📊 Emails enviados inmediatamente:', emailsEnviados.filter(e => e.enviado).length)
      console.log('📊 Emails programados:', emailsEnviados.filter(e => e.programado).length)

      // Nota sobre implementación para producción
      console.log('📝 NOTA: Los emails de certificación se enviarán automáticamente cuando el delegado complete REALMENTE la formación')

      return NextResponse.json({
        success: true,
        message: 'Secuencia de emails de contratación CORREGIDA iniciada correctamente',
        emailsEnviados,
        totalEmails: emailsEnviados.length,
        nota: 'Los emails de certificación y sistema operativo se activarán cuando el delegado complete realmente la formación',
        implementacionFutura: {
          certificacion: 'Trigger automático al aprobar test real',
          sistemaOperativo: 'Trigger automático cuando delegado principal esté certificado',
          recordatorios: 'Solo se envían si NO ha iniciado formación en 48h'
        }
      })

    } catch (error) {
      console.error('❌ Error en la secuencia de emails:', error)
      return NextResponse.json({
        success: false,
        error: 'Error interno en el envío de emails',
        details: error instanceof Error ? error.message : 'Error desconocido'
      }, { status: 500 })
    }

  } catch (error) {
    console.error('❌ Error procesando solicitud de emails:', error)
    return NextResponse.json({
      success: false,
      error: 'Error procesando la solicitud',
      details: error instanceof Error ? error.message : 'Error desconocido'
    }, { status: 400 })
  }
}

/*
📝 NOTAS PARA IMPLEMENTACIÓN EN PRODUCCIÓN:

1. EMAILS DE CERTIFICACIÓN (TRIGGER REAL):
   - Deben enviarse desde el dashboard de formación cuando el delegado apruebe el test
   - No desde aquí con setTimeout automático

2. EMAIL SISTEMA OPERATIVO (TRIGGER REAL):
   - Debe enviarse cuando el delegado principal esté REALMENTE certificado
   - No automáticamente a las 48h

3. RECORDATORIOS CONDICIONALES:
   - Verificar en base de datos si el delegado ha iniciado la formación
   - Solo enviar recordatorio si progreso = 0% después de 48h

4. TRACKING DE ESTADOS:
   - Implementar tabla de estados de formación por delegado
   - Triggers en dashboard de formación para emails automáticos

FLUJO CORRECTO:
Contratación → Credenciales (+1h) → Recordatorio si NO inicia (+48h) →
Certificación (al aprobar test) → Sistema operativo (al certificar principal) →
Check-up (+1 semana desde operativo)
*/
