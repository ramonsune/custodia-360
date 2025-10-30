import { NextResponse } from 'next/server'
import { Resend } from 'resend'
import { supabase, logAuditAction } from '@/lib/supabase'
import { professionalEmailTemplates } from '@/lib/email-templates'

// Configuración de Resend
const resend = new Resend(process.env.RESEND_API_KEY)
const FROM_EMAIL = process.env.RESEND_FROM_EMAIL || 'onboarding@resend.dev'

// Función para generar hash legal
function generateLegalHash(data: any): string {
  const timestamp = new Date().toISOString()
  const dataString = JSON.stringify(data) + timestamp
  return btoa(dataString).slice(0, 32)
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const {
      // Datos de la entidad
      nombreEntidad,
      cifEntidad,
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

      // Datos del plan y pago
      plan,
      importeTotal,
      numeroFactura
    } = body

    console.log('🏢 Iniciando registro completo en Supabase para:', nombreEntidad)

    // ========================================
    // 1. CREAR ENTIDAD EN SUPABASE
    // ========================================
    const entidadData = {
      nombre: nombreEntidad,
      cif: cifEntidad,
      direccion: direccion || 'Pendiente completar',
      ciudad: 'Madrid', // Temporal - se obtendría del formulario
      codigo_postal: '28001', // Temporal
      provincia: 'Madrid', // Temporal
      telefono: telefono,
      email: emailContratante,
      website: web,
      numero_menores: numeroMenores,
      tipo_entidad: tipoEntidad,
      plan: plan || 'Plan Básico',
      precio_mensual: importeTotal ? parseFloat(importeTotal.toString()) : 0.00,
      dashboard_email: emailContratante,
      dashboard_password: contraseñaContratante,
      legal_hash: generateLegalHash({ nombre: nombreEntidad, cif: cifEntidad })
    }

    const { data: entidadCreada, error: entidadError } = await supabase
      .from('entidades')
      .insert([entidadData])
      .select()
      .single()

    if (entidadError) {
      console.error('❌ Error creando entidad:', entidadError)
      return NextResponse.json(
        { error: 'Error creando entidad', details: entidadError.message },
        { status: 500 }
      )
    }

    console.log('✅ Entidad creada:', entidadCreada.id)

    // ========================================
    // 2. CREAR CONTRATANTE EN SUPABASE
    // ========================================
    const contratanteData = {
      entidad_id: entidadCreada.id,
      nombre: nombreContratante.split(' ')[0] || nombreContratante,
      apellidos: nombreContratante.split(' ').slice(1).join(' ') || '',
      dni: dniContratante,
      cargo: cargoContratante,
      telefono: telefonoContratante,
      email: emailContratante,
      es_delegado: false
    }

    const { data: contratanteCreado, error: contratanteError } = await supabase
      .from('contratantes')
      .insert([contratanteData])
      .select()
      .single()

    if (contratanteError) {
      console.error('❌ Error creando contratante:', contratanteError)
      return NextResponse.json(
        { error: 'Error creando contratante', details: contratanteError.message },
        { status: 500 }
      )
    }

    console.log('✅ Contratante creado:', contratanteCreado.id)

    // ========================================
    // 3. CREAR DELEGADO PRINCIPAL EN SUPABASE
    // ========================================
    const delegadoPrincipalData = {
      entidad_id: entidadCreada.id,
      tipo: 'principal',
      nombre: nombreDelegadoPrincipal.split(' ')[0] || nombreDelegadoPrincipal,
      apellidos: nombreDelegadoPrincipal.split(' ').slice(1).join(' ') || '',
      dni: dniDelegadoPrincipal,
      telefono: telefonoDelegadoPrincipal,
      email: emailDelegadoPrincipal,
      password: contraseñaDelegadoPrincipal,
      experiencia: experienciaPrevia || 'Sin experiencia previa',
      disponibilidad: funcionDelegadoPrincipal || 'Tiempo completo',
      certificado_penales: false,
      estado: 'activo'
    }

    const { data: delegadoPrincipalCreado, error: delegadoPrincipalError } = await supabase
      .from('delegados')
      .insert([delegadoPrincipalData])
      .select()
      .single()

    if (delegadoPrincipalError) {
      console.error('❌ Error creando delegado principal:', delegadoPrincipalError)
      return NextResponse.json(
        { error: 'Error creando delegado principal', details: delegadoPrincipalError.message },
        { status: 500 }
      )
    }

    console.log('✅ Delegado principal creado:', delegadoPrincipalCreado.id)

    // ========================================
    // 4. CREAR DELEGADO SUPLENTE (si aplica)
    // ========================================
    let delegadoSuplenteCreado = null
    if (tieneSuplente && nombreDelegadoSuplente) {
      const delegadoSuplenteData = {
        entidad_id: entidadCreada.id,
        tipo: 'suplente',
        nombre: nombreDelegadoSuplente.split(' ')[0] || nombreDelegadoSuplente,
        apellidos: nombreDelegadoSuplente.split(' ').slice(1).join(' ') || '',
        dni: dniDelegadoSuplente,
        telefono: telefonoDelegadoSuplente,
        email: emailDelegadoSuplente,
        password: contraseñaDelegadoSuplente,
        experiencia: 'Delegado suplente',
        disponibilidad: funcionDelegadoSuplente || 'Tiempo parcial',
        certificado_penales: false,
        estado: 'activo'
      }

      const { data: suplente, error: suplenteError } = await supabase
        .from('delegados')
        .insert([delegadoSuplenteData])
        .select()
        .single()

      if (suplenteError) {
        console.error('❌ Error creando delegado suplente:', suplenteError)
      } else {
        delegadoSuplenteCreado = suplente
        console.log('✅ Delegado suplente creado:', suplente.id)
      }
    }

    // ========================================
    // 5. REGISTRAR EN AUDITORÍA LOPIVI
    // ========================================
    await logAuditAction(
      contratanteCreado.id,
      nombreContratante,
      'contratacion_completada',
      'entidad',
      {
        entidad: nombreEntidad,
        plan: plan,
        delegado_principal: emailDelegadoPrincipal,
        delegado_suplente: tieneSuplente ? emailDelegadoSuplente : null,
        importe_total: importeTotal
      },
      entidadCreada.id
    )

    // ========================================
    // 6. ENVIAR EMAILS DE CONFIRMACIÓN
    // ========================================
    const emailsEnviados = []

    try {
      // Email al admin
      await resend.emails.send({
        from: FROM_EMAIL,
        to: ['rsuneo1971@gmail.com'],
        subject: `🎉 Nueva contratación registrada - ${nombreEntidad}`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <div style="background: linear-gradient(135deg, #2563EB 0%, #1D4ED8 100%); color: white; padding: 20px; text-align: center;">
              <h2>🎉 Nueva Contratación Completada</h2>
              <p>Registrada en Supabase correctamente</p>
            </div>
            <div style="padding: 20px; background: white;">
              <h3>Datos registrados:</h3>
              <p><strong>Entidad:</strong> ${nombreEntidad} (ID: ${entidadCreada.id})</p>
              <p><strong>CIF:</strong> ${cifEntidad}</p>
              <p><strong>Plan:</strong> ${plan}</p>
              <p><strong>Delegado Principal:</strong> ${nombreDelegadoPrincipal} (${emailDelegadoPrincipal})</p>
              ${tieneSuplente ? `<p><strong>Delegado Suplente:</strong> ${nombreDelegadoSuplente} (${emailDelegadoSuplente})</p>` : ''}
              <p><strong>Importe Total:</strong> €${importeTotal}</p>
              <hr>
              <h3>Próximos pasos automáticos:</h3>
              <ol>
                <li>✅ Entidad registrada en Supabase</li>
                <li>✅ Delegados creados con credenciales</li>
                <li>✅ Sistema de auditoría LOPIVI iniciado</li>
                <li>🔄 Emails de bienvenida programados</li>
              </ol>
            </div>
          </div>
        `
      })
      emailsEnviados.push({ tipo: 'admin_notificacion', enviado: true })

      // Email de bienvenida al contratante
      await resend.emails.send({
        from: FROM_EMAIL,
        to: [emailContratante],
        subject: `¡Bienvenido a Custodia360! - ${nombreEntidad}`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <div style="background: linear-gradient(135deg, #2563EB 0%, #1D4ED8 100%); color: white; padding: 20px; text-align: center;">
              <h2>¡Bienvenido a Custodia360!</h2>
              <p>Su entidad ya está protegida LOPIVI</p>
            </div>
            <div style="padding: 20px; background: white;">
              <h3>Hola ${nombreContratante},</h3>
              <p>¡Felicidades! Su entidad <strong>${nombreEntidad}</strong> ha sido registrada exitosamente en nuestro sistema Custodia360.</p>

              <h4>📋 Credenciales de acceso al dashboard:</h4>
              <div style="background: #f3f4f6; padding: 15px; border-radius: 8px; margin: 15px 0;">
                <p><strong>URL:</strong> <a href="https://custodia360.es/panel-acceso">https://custodia360.es/panel-acceso</a></p>
                <p><strong>Email:</strong> ${emailContratante}</p>
                <p><strong>Contraseña:</strong> ${contraseñaContratante}</p>
              </div>

              <h4>👥 Delegados LOPIVI asignados:</h4>
              <p><strong>Delegado Principal:</strong> ${nombreDelegadoPrincipal}<br>
              <strong>Email:</strong> ${emailDelegadoPrincipal}<br>
              <strong>Contraseña:</strong> ${contraseñaDelegadoPrincipal}</p>

              ${tieneSuplente ? `
              <p><strong>Delegado Suplente:</strong> ${nombreDelegadoSuplente}<br>
              <strong>Email:</strong> ${emailDelegadoSuplente}<br>
              <strong>Contraseña:</strong> ${contraseñaDelegadoSuplente}</p>
              ` : ''}

              <h4>🚀 Próximos pasos:</h4>
              <ol>
                <li>Los delegados recibirán un email con acceso a su formación LOPIVI</li>
                <li>Una vez completada la formación, tendrán acceso al dashboard</li>
                <li>El sistema estará completamente operativo en 72 horas</li>
              </ol>

              <div style="text-align: center; margin: 30px 0;">
                <a href="https://custodia360.es/panel-acceso" style="background: #2563EB; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">Acceder al Dashboard</a>
              </div>
            </div>
          </div>
        `
      })
      emailsEnviados.push({ tipo: 'bienvenida_contratante', enviado: true })

      // Email al delegado principal
      await resend.emails.send({
        from: FROM_EMAIL,
        to: [emailDelegadoPrincipal],
        subject: `🎓 Formación LOPIVI - Delegado Principal - ${nombreEntidad}`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <div style="background: linear-gradient(135deg, #059669 0%, #047857 100%); color: white; padding: 20px; text-align: center;">
              <h2>🎓 Formación LOPIVI - Delegado Principal</h2>
            </div>
            <div style="padding: 20px; background: white;">
              <h3>Hola ${nombreDelegadoPrincipal},</h3>
              <p>Ha sido designado/a como <strong>Delegado Principal de Protección</strong> para la entidad <strong>${nombreEntidad}</strong>.</p>

              <h4>📚 Acceso a la formación LOPIVI:</h4>
              <div style="background: #f0fdf4; padding: 15px; border-radius: 8px; margin: 15px 0; border-left: 4px solid #059669;">
                <p><strong>URL Formación:</strong> <a href="https://custodia360.es/formacion-lopivi">https://custodia360.es/formacion-lopivi</a></p>
                <p><strong>Email:</strong> ${emailDelegadoPrincipal}</p>
                <p><strong>Contraseña:</strong> ${contraseñaDelegadoPrincipal}</p>
              </div>

              <h4>📖 Contenido de la formación:</h4>
              <ul>
                <li>Marco legal LOPIVI</li>
                <li>Protocolos de actuación</li>
                <li>Gestión de casos</li>
                <li>Comunicación con autoridades</li>
                <li>Documentación obligatoria</li>
              </ul>

              <p><strong>⏰ Duración estimada:</strong> 4-6 horas</p>
              <p><strong>🏆 Al completar:</strong> Acceso completo al dashboard de gestión</p>

              <div style="text-align: center; margin: 30px 0;">
                <a href="https://custodia360.es/formacion-lopivi" style="background: #059669; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">Comenzar Formación</a>
              </div>
            </div>
          </div>
        `
      })
      emailsEnviados.push({ tipo: 'formacion_delegado_principal', enviado: true })

      // Email al delegado suplente (si existe)
      if (tieneSuplente && emailDelegadoSuplente) {
        await resend.emails.send({
          from: FROM_EMAIL,
          to: [emailDelegadoSuplente],
          subject: `🎓 Formación LOPIVI - Delegado Suplente - ${nombreEntidad}`,
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
              <div style="background: linear-gradient(135deg, #7C3AED 0%, #6D28D9 100%); color: white; padding: 20px; text-align: center;">
                <h2>🎓 Formación LOPIVI - Delegado Suplente</h2>
              </div>
              <div style="padding: 20px; background: white;">
                <h3>Hola ${nombreDelegadoSuplente},</h3>
                <p>Ha sido designado/a como <strong>Delegado Suplente de Protección</strong> para la entidad <strong>${nombreEntidad}</strong>.</p>

                <h4>📚 Acceso a la formación LOPIVI:</h4>
                <div style="background: #faf5ff; padding: 15px; border-radius: 8px; margin: 15px 0; border-left: 4px solid #7C3AED;">
                  <p><strong>URL Formación:</strong> <a href="https://custodia360.es/formacion-lopivi">https://custodia360.es/formacion-lopivi</a></p>
                  <p><strong>Email:</strong> ${emailDelegadoSuplente}</p>
                  <p><strong>Contraseña:</strong> ${contraseñaDelegadoSuplente}</p>
                </div>

                <p>Como delegado suplente, tendrá las mismas competencias que el delegado principal y podrá actuar en su ausencia.</p>

                <div style="text-align: center; margin: 30px 0;">
                  <a href="https://custodia360.es/formacion-lopivi" style="background: #7C3AED; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">Comenzar Formación</a>
                </div>
              </div>
            </div>
          `
        })
        emailsEnviados.push({ tipo: 'formacion_delegado_suplente', enviado: true })
      }

    } catch (emailError) {
      console.error('❌ Error enviando algunos emails:', emailError)
    }

    // ========================================
    // 7. RESPUESTA EXITOSA
    // ========================================
    return NextResponse.json({
      success: true,
      message: 'Contratación completada y registrada en Supabase',
      entidad: {
        id: entidadCreada.id,
        nombre: nombreEntidad,
        dashboard_url: 'https://custodia360.es/panel-acceso'
      },
      delegados: {
        principal: {
          id: delegadoPrincipalCreado.id,
          email: emailDelegadoPrincipal,
          formacion_url: 'https://custodia360.es/formacion-lopivi'
        },
        suplente: delegadoSuplenteCreado ? {
          id: delegadoSuplenteCreado.id,
          email: emailDelegadoSuplente,
          formacion_url: 'https://custodia360.es/formacion-lopivi'
        } : null
      },
      emails: {
        enviados: emailsEnviados.length,
        detalles: emailsEnviados
      }
    })

  } catch (error) {
    console.error('❌ Error en contratación completa:', error)
    return NextResponse.json(
      {
        error: 'Error procesando contratación',
        details: error instanceof Error ? error.message : 'Error desconocido'
      },
      { status: 500 }
    )
  }
}
