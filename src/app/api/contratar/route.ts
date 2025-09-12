import { NextResponse } from 'next/server'
import { Resend } from 'resend'
import { professionalEmailTemplates } from '@/lib/email-templates'

// Configuración de Resend
const resend = new Resend(process.env.RESEND_API_KEY)
const FROM_EMAIL = process.env.RESEND_FROM_EMAIL || 'onboarding@resend.dev'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const {
      plan,
      empresa,
      cif,
      nombre,
      email,
      telefono,
      menores,
      direccion,
      delegado
    } = body

    // Validaciones básicas
    if (!plan || !empresa || !cif || !nombre || !email || !telefono || !menores) {
      return NextResponse.json(
        { error: 'Todos los campos marcados como obligatorios son requeridos' },
        { status: 400 }
      )
    }

    // Preparar datos para los emails profesionales
    const emailData = {
      plan,
      empresa,
      nombreEntidad: empresa, // Para compatibilidad con templates
      cif,
      nombre,
      nombreContratante: nombre, // Para compatibilidad con templates
      emailContratante: email,
      telefono,
      menores,
      direccion,
      nombreDelegado: 'Juan García', // En producción viene de datos del delegado
      emailDelegado: 'delegado@ejemplo.com',
      tipoEntidad: 'Club Deportivo', // Se obtendría del formulario
      codigoAcceso: Math.random().toString(36).substring(2, 8).toUpperCase(),
      codigo2FA: Math.random().toString(36).substring(2, 8).toUpperCase(),
      codigoCurso: Math.random().toString(36).substring(2, 6).toUpperCase(),
      passwordDelegado: 'Pass' + Math.random().toString(36).substring(2, 6),
      passwordFormacion: 'Form' + Math.random().toString(36).substring(2, 6),
      suplente: false // Se obtendría del formulario
    }

    // EMAIL 1: Notificación al admin (interno)
    await resend.emails.send({
      from: FROM_EMAIL,
      to: ['rsuneo1971@gmail.com'],
      subject: `🎉 Nueva contratación profesional - ${empresa}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: linear-gradient(135deg, #EA580C 0%, #DC2626 100%); color: white; padding: 20px; text-align: center;">
            <h2>🎉 Nueva Contratación Recibida</h2>
          </div>
          <div style="padding: 20px; background: white;">
            <h3>Datos de la Contratación:</h3>
            <p><strong>Plan:</strong> ${plan}</p>
            <p><strong>Empresa:</strong> ${empresa}</p>
            <p><strong>CIF:</strong> ${cif}</p>
            <p><strong>Contacto:</strong> ${nombre}</p>
            <p><strong>Email:</strong> ${email}</p>
            <p><strong>Teléfono:</strong> ${telefono}</p>
            <p><strong>Menores:</strong> ${menores}</p>
            <p><strong>Dirección:</strong> ${direccion}</p>
            <hr>
            <h3>Acciones Inmediatas:</h3>
            <ol>
              <li>Asignar delegado específico</li>
              <li>Generar documentación personalizada</li>
              <li>Crear credenciales de acceso</li>
              <li>Programar formación</li>
            </ol>
          </div>
        </div>
      `
    })

    // EMAIL 2: Bienvenida profesional al contratante
    await resend.emails.send({
      from: FROM_EMAIL,
      to: ['rsuneo1971@gmail.com'], // Sandbox: cambiar por [email] en producción
      subject: professionalEmailTemplates.bienvenidaContratante.subject(emailData),
      html: professionalEmailTemplates.bienvenidaContratante.html(emailData)
    })

    // EMAIL 3: Asignación al delegado (simulado +1h con delay)
    setTimeout(async () => {
      try {
        await resend.emails.send({
          from: FROM_EMAIL,
          to: ['rsuneo1971@gmail.com'], // Sandbox: cambiar por emailData.emailDelegado en producción
          subject: professionalEmailTemplates.asignacionDelegado.subject(emailData),
          html: professionalEmailTemplates.asignacionDelegado.html(emailData)
        })
        console.log('✅ Email de asignación enviado')
      } catch (error) {
        console.error('❌ Error enviando email de asignación:', error)
      }
    }, 3000) // 3 segundos para demo

    // EMAIL 4: Documentación (simulado +1h)
    setTimeout(async () => {
      try {
        await resend.emails.send({
          from: FROM_EMAIL,
          to: ['rsuneo1971@gmail.com'],
          subject: professionalEmailTemplates.documentacionLista.subject(emailData),
          html: professionalEmailTemplates.documentacionLista.html(emailData)
        })
        console.log('✅ Email de documentación enviado')
      } catch (error) {
        console.error('❌ Error enviando email de documentación:', error)
      }
    }, 6000) // 6 segundos para demo

    // EMAIL 5: Credenciales (simulado +1h)
    setTimeout(async () => {
      try {
        await resend.emails.send({
          from: FROM_EMAIL,
          to: ['rsuneo1971@gmail.com'],
          subject: professionalEmailTemplates.credencialesAcceso.subject(emailData),
          html: professionalEmailTemplates.credencialesAcceso.html(emailData)
        })
        console.log('✅ Email de credenciales enviado')
      } catch (error) {
        console.error('❌ Error enviando email de credenciales:', error)
      }
    }, 9000) // 9 segundos para demo

    // EMAIL 6: Check-up semanal (simulado +1 semana)
    setTimeout(async () => {
      try {
        await resend.emails.send({
          from: FROM_EMAIL,
          to: ['rsuneo1971@gmail.com'],
          subject: professionalEmailTemplates.checkupSatisfaccion.subject(emailData),
          html: professionalEmailTemplates.checkupSatisfaccion.html({
            ...emailData,
            accesos: 12,
            personalFormado: '85%',
            documentosRevisados: 8,
            tiempoOperativo: '168h'
          })
        })
        console.log('✅ Email de check-up enviado')
      } catch (error) {
        console.error('❌ Error enviando email de check-up:', error)
      }
    }, 12000) // 12 segundos para demo

    // EMAIL 7: Certificación completada (simulado después de formación - +48h)
    setTimeout(async () => {
      try {
        // Generar datos de certificación
        const certificacionData = {
          ...emailData,
          puntuacionTest: '97/100',
          numeroCertificado: `${emailData.codigoCurso}-${Date.now().toString().slice(-4)}`,
          codigoCertificado: Math.random().toString(36).substring(2, 12).toUpperCase(),
          codigoEntidad: Math.random().toString(36).substring(2, 8).toUpperCase()
        }

        // Verificar si contratante y delegado son la misma persona
        const esLaMismaPersona = emailData.emailContratante === emailData.emailDelegado ||
                                emailData.nombre === emailData.nombreDelegado

        // EMAIL para el delegado (siempre se envía)
        await resend.emails.send({
          from: FROM_EMAIL,
          to: ['rsuneo1971@gmail.com'], // Sandbox: cambiar por emailData.emailDelegado en producción
          subject: professionalEmailTemplates.certificacionCompletada.subject(certificacionData),
          html: professionalEmailTemplates.certificacionCompletada.html(certificacionData)
        })

        // EMAIL para el contratante (solo si es diferente del delegado)
        if (!esLaMismaPersona) {
          await resend.emails.send({
            from: FROM_EMAIL,
            to: ['rsuneo1971@gmail.com'], // Sandbox: cambiar por emailData.emailContratante en producción
            subject: professionalEmailTemplates.notificacionCertificacionContratante.subject(certificacionData),
            html: professionalEmailTemplates.notificacionCertificacionContratante.html(certificacionData)
          })
          console.log('✅ Email de certificación enviado al delegado y al contratante')
        } else {
          console.log('✅ Email de certificación enviado (contratante = delegado, un solo email)')
        }

        // Si hay suplente, enviar certificación también (en una implementación futura)
        // TODO: Implementar datos del suplente desde el formulario

      } catch (error) {
        console.error('❌ Error enviando emails de certificación:', error)
      }
    }, 15000) // 15 segundos para demo (48 horas = 172800000ms en producción)

    return NextResponse.json(
      {
        message: 'Contratación procesada - Secuencia de emails profesionales iniciada',
        data: { plan, empresa, nombre },
        emailsPrograma: {
          inmediato: 2,
          programados: 6, // Actualizado: ahora son 6 emails programados
          timeline: 'Recibirás 8 emails profesionales en los próximos 15 segundos (demo)'
        }
      },
      { status: 200 }
    )

  } catch (error) {
    console.error('Error procesando contratación:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}
