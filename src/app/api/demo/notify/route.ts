import { NextRequest, NextResponse } from 'next/server'
import { Resend } from 'resend'
import { createClient } from '@/lib/supabase/server'

const resend = new Resend(process.env.RESEND_API_KEY)

/**
 * POST /api/demo/notify
 * Envía email de confirmación de setup DEMO a soporte@custodia360.es
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { users, entity, timestamp } = body

    // Verificar que vengan los datos necesarios
    if (!users || !entity || !timestamp) {
      return NextResponse.json(
        { error: 'Faltan datos requeridos: users, entity, timestamp' },
        { status: 400 }
      )
    }

    // Construir tabla HTML de usuarios
    const usersTable = users.map((u: any) => `
      <tr>
        <td style="padding: 8px; border: 1px solid #e5e7eb;">${u.email}</td>
        <td style="padding: 8px; border: 1px solid #e5e7eb;">${u.role}</td>
        <td style="padding: 8px; border: 1px solid #e5e7eb;">
          <span style="display: inline-block; background-color: #10b981; color: white; padding: 2px 8px; border-radius: 4px; font-size: 12px;">
            ACTIVO
          </span>
        </td>
      </tr>
    `).join('')

    // HTML del email
    const htmlContent = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>Cuentas DEMO Actualizadas - Custodia360</title>
</head>
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">

  <!-- Header -->
  <div style="background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%); color: white; padding: 30px; border-radius: 10px 10px 0 0; text-align: center;">
    <h1 style="margin: 0; font-size: 24px; font-weight: bold;">
      🎯 CONFIGURACIÓN DEMO COMPLETADA
    </h1>
    <p style="margin: 10px 0 0 0; font-size: 14px; opacity: 0.9;">
      Sistema de demostración Custodia360
    </p>
  </div>

  <!-- Content -->
  <div style="background-color: #ffffff; padding: 30px; border: 1px solid #e5e7eb; border-top: none;">

    <div style="background-color: #fef3c7; border-left: 4px solid #f59e0b; padding: 15px; margin-bottom: 20px; border-radius: 4px;">
      <p style="margin: 0; font-size: 14px; color: #92400e;">
        <strong>⚠️ Aviso Importante:</strong> Las cuentas DEMO han sido creadas/actualizadas correctamente.
        Este email confirma la configuración del entorno de demostración.
      </p>
    </div>

    <h2 style="color: #111827; font-size: 18px; border-bottom: 2px solid #f59e0b; padding-bottom: 10px;">
      📊 Estado de la Configuración
    </h2>

    <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
      <tr style="background-color: #f9fafb;">
        <td style="padding: 12px; border: 1px solid #e5e7eb; font-weight: bold;">Timestamp:</td>
        <td style="padding: 12px; border: 1px solid #e5e7eb;">${new Date(timestamp).toLocaleString('es-ES', { timeZone: 'Europe/Madrid' })}</td>
      </tr>
      <tr>
        <td style="padding: 12px; border: 1px solid #e5e7eb; font-weight: bold;">Entidad DEMO:</td>
        <td style="padding: 12px; border: 1px solid #e5e7eb;">${entity.name} (${entity.id})</td>
      </tr>
      <tr style="background-color: #f9fafb;">
        <td style="padding: 12px; border: 1px solid #e5e7eb; font-weight: bold;">Estado DEMO_ENABLED:</td>
        <td style="padding: 12px; border: 1px solid #e5e7eb;">
          <span style="background-color: #10b981; color: white; padding: 4px 12px; border-radius: 4px; font-weight: bold;">
            TRUE
          </span>
        </td>
      </tr>
      <tr>
        <td style="padding: 12px; border: 1px solid #e5e7eb; font-weight: bold;">Usuarios DEMO:</td>
        <td style="padding: 12px; border: 1px solid #e5e7eb; font-weight: bold;">${users.length}</td>
      </tr>
    </table>

    <h2 style="color: #111827; font-size: 18px; border-bottom: 2px solid #f59e0b; padding-bottom: 10px; margin-top: 30px;">
      👥 Usuarios DEMO Activos
    </h2>

    <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
      <thead>
        <tr style="background-color: #f59e0b; color: white;">
          <th style="padding: 12px; border: 1px solid #e5e7eb; text-align: left;">Email</th>
          <th style="padding: 12px; border: 1px solid #e5e7eb; text-align: left;">Rol</th>
          <th style="padding: 12px; border: 1px solid #e5e7eb; text-align: left;">Estado</th>
        </tr>
      </thead>
      <tbody>
        ${usersTable}
      </tbody>
    </table>

    <div style="background-color: #dbeafe; border-left: 4px solid #3b82f6; padding: 15px; margin: 20px 0; border-radius: 4px;">
      <h3 style="margin: 0 0 10px 0; color: #1e40af; font-size: 14px;">
        🔑 Credenciales de Acceso
      </h3>
      <p style="margin: 5px 0; font-size: 13px; color: #1e40af;">
        <strong>Password:</strong> 123 (para todos los usuarios)
      </p>
    </div>

    <h3 style="color: #111827; font-size: 16px; margin-top: 30px;">
      🔗 URLs de Acceso
    </h3>
    <ul style="list-style: none; padding: 0; margin: 10px 0;">
      <li style="margin: 8px 0;">
        <a href="https://www.custodia360.es/dashboard-entidad" style="color: #3b82f6; text-decoration: none; font-weight: bold;">
          • ENTIDAD → /dashboard-entidad
        </a>
      </li>
      <li style="margin: 8px 0;">
        <a href="https://www.custodia360.es/dashboard-delegado" style="color: #3b82f6; text-decoration: none; font-weight: bold;">
          • DELEGADO → /dashboard-delegado
        </a>
      </li>
      <li style="margin: 8px 0;">
        <a href="https://www.custodia360.es/dashboard-suplente" style="color: #3b82f6; text-decoration: none; font-weight: bold;">
          • SUPLENTE → /dashboard-suplente
        </a>
      </li>
      <li style="margin: 8px 0;">
        <a href="https://www.custodia360.es/admin" style="color: #3b82f6; text-decoration: none; font-weight: bold;">
          • ADMIN → /admin
        </a>
      </li>
    </ul>

    <div style="background-color: #fef3c7; border-left: 4px solid #f59e0b; padding: 15px; margin: 30px 0 20px 0; border-radius: 4px;">
      <h3 style="margin: 0 0 10px 0; color: #92400e; font-size: 14px;">
        ⚠️ Funcionalidades Deshabilitadas en DEMO
      </h3>
      <ul style="margin: 5px 0; padding-left: 20px; font-size: 13px; color: #92400e;">
        <li>Pagos con tarjeta (Stripe)</li>
        <li>Generación de facturas reales (Holded)</li>
        <li>Envío de emails a dominios externos</li>
        <li>Modificación de datos de clientes reales</li>
      </ul>
    </div>

    <div style="background-color: #f9fafb; padding: 20px; border-radius: 8px; margin-top: 30px;">
      <h3 style="margin: 0 0 10px 0; color: #374151; font-size: 14px;">
        📚 Documentación Técnica
      </h3>
      <p style="margin: 5px 0; font-size: 13px; color: #6b7280;">
        • Base de datos: Tablas entities y entity_user_roles con columna <code>is_demo</code><br>
        • Aislamiento: Políticas RLS activas para separar DEMO de producción<br>
        • Audit log: Todas las acciones registradas en <code>public.audit_log</code><br>
        • Switch: Variable <code>DEMO_ENABLED</code> en Netlify
      </p>
    </div>

  </div>

  <!-- Footer -->
  <div style="background-color: #f9fafb; padding: 20px; border: 1px solid #e5e7eb; border-top: none; border-radius: 0 0 10px 10px; text-align: center;">
    <p style="margin: 0; font-size: 12px; color: #6b7280;">
      Email generado automáticamente por el sistema Custodia360<br>
      © ${new Date().getFullYear()} Custodia360 - Sistema de Protección Infantil LOPIVI
    </p>
  </div>

</body>
</html>
    `

    // Enviar email
    const { data, error } = await resend.emails.send({
      from: process.env.NOTIFY_EMAIL_FROM || 'Custodia360 <noreply@custodia360.es>',
      to: 'soporte@custodia360.es',
      subject: `✅ Cuentas DEMO Actualizadas - ${new Date().toLocaleDateString('es-ES')}`,
      html: htmlContent
    })

    if (error) {
      console.error('Error enviando email de notificación DEMO:', error)
      return NextResponse.json(
        { error: 'Error enviando email', details: error },
        { status: 500 }
      )
    }

    // Registrar en audit_log
    const supabase = createClient()
    await supabase
      .from('audit_log')
      .insert({
        action: 'demo.notification.sent',
        details: {
          email_id: data?.id,
          recipient: 'soporte@custodia360.es',
          users_count: users.length,
          timestamp: new Date().toISOString()
        }
      })

    return NextResponse.json({
      success: true,
      message: 'Email de notificación DEMO enviado correctamente',
      email_id: data?.id
    })

  } catch (error) {
    console.error('Error en /api/demo/notify:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}
