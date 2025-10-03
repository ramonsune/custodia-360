import { Resend } from 'resend'

// Configuración de Resend
export const resend = new Resend(process.env.RESEND_API_KEY)

export const FROM_EMAIL = process.env.RESEND_FROM_EMAIL || 'info@custodia360.es'

// Templates de email
export const emailTemplates = {
  contacto: {
    subject: 'Nuevo contacto desde Custodia360',
    toAdmin: ({ nombre, email, telefono, empresa, mensaje }: any) => `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #ea580c;">Nuevo contacto desde Custodia360</h2>

        <div style="background: #f9fafb; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="margin-top: 0;">Datos del contacto:</h3>
          <p><strong>Nombre:</strong> ${nombre}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Teléfono:</strong> ${telefono || 'No proporcionado'}</p>
          <p><strong>Empresa:</strong> ${empresa || 'No proporcionada'}</p>
        </div>

        <div style="background: #fef3c7; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="margin-top: 0;">Mensaje:</h3>
          <p style="white-space: pre-wrap;">${mensaje}</p>
        </div>

        <div style="background: #ecfdf5; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <p style="margin: 0;"><strong>Acción recomendada:</strong> Responder en las próximas 2 horas para maximizar conversión.</p>
        </div>
      </div>
    `,
    toUser: ({ nombre, mensaje }: any) => `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #ea580c;">Gracias por contactar con Custodia360</h2>

        <p>Hola <strong>${nombre}</strong>,</p>

        <p>Hemos recibido tu mensaje y nos pondremos en contacto contigo en las próximas 2 horas.</p>

        <div style="background: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3>Tu mensaje:</h3>
          <p style="font-style: italic;">"${mensaje}"</p>
        </div>

        <p>Mientras tanto, puedes:</p>
        <ul>
          <li><a href="https://custodia360.es/planes">Ver nuestros planes</a></li>
          <li><a href="https://custodia360.es/guia">Leer la guía LOPIVI</a></li>
          <li>Llamarnos al <strong>678 771 198</strong> para consultas urgentes</li>
        </ul>

        <div style="background: #fef2f2; padding: 15px; border-radius: 8px; margin: 20px 0;">
          <p style="margin: 0; font-size: 14px; color: #7f1d1d;">
            <strong>Recordatorio:</strong> La LOPIVI es obligatoria desde junio 2021.
            No esperes a recibir una inspección - protege tu entidad ahora.
          </p>
        </div>

        <p>Un saludo,<br>
        <strong>Equipo Custodia360</strong><br>
        Primera empresa con sistema automatizado de España</p>
      </div>
    `
  },

  contratacion: {
    subject: 'Bienvenido a Custodia360 - Tu implementación LOPIVI ha comenzado',
    toAdmin: (data: any) => `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #ea580c;">Nueva contratación Custodia360</h2>

        <div style="background: #f9fafb; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3>Datos de la entidad:</h3>
          <p><strong>Nombre:</strong> ${data.entidad}</p>
          <p><strong>Plan:</strong> ${data.plan}</p>
          <p><strong>Precio:</strong> ${data.precio}€ + IVA</p>
          <p><strong>Contratante:</strong> ${data.nombreContratante}</p>
          <p><strong>Email:</strong> ${data.emailContratante}</p>
        </div>

        <div style="background: #fef3c7; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3>Delegado principal:</h3>
          <p><strong>Nombre:</strong> ${data.nombreDelegado}</p>
          <p><strong>Email:</strong> ${data.emailDelegado}</p>
          <p><strong>Suplente:</strong> ${data.delegadoSuplente ? 'Sí' : 'No'}</p>
        </div>

        <div style="background: #ecfdf5; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <p style="margin: 0;"><strong>Próximos pasos:</strong></p>
          <ol>
            <li>Configurar acceso del delegado (2h)</li>
            <li>Enviar materiales de formación (24h)</li>
            <li>Programar certificación (72h)</li>
          </ol>
        </div>
      </div>
    `,
    toUser: (data: any) => `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #ea580c;">Bienvenido a Custodia360</h2>

        <p>Hola <strong>${data.nombreContratante}</strong>,</p>

        <p>Felicidades! Tu entidad <strong>${data.entidad}</strong> acaba de dar el paso más importante para proteger a los menores.</p>

        <div style="background: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3>Resumen de tu contratación:</h3>
          <p><strong>Plan:</strong> ${data.plan}</p>
          <p><strong>Precio:</strong> ${data.precio}€ + IVA</p>
          <p><strong>Delegado principal:</strong> ${data.nombreDelegado}</p>
          <p><strong>Implementación:</strong> 72 horas</p>
        </div>

        <div style="background: #ecfdf5; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3>Qué sucede ahora:</h3>
          <ol>
            <li><strong>Próximas 2 horas:</strong> Configuración automática del sistema</li>
            <li><strong>24 horas:</strong> Tu delegado recibirá los materiales de formación</li>
            <li><strong>72 horas:</strong> Certificación completa y sistema operativo</li>
          </ol>
        </div>

        <div style="background: #fef3c7; padding: 15px; border-radius: 8px; margin: 20px 0;">
          <p style="margin: 0;"><strong>Acceso temporal:</strong> Usa estas credenciales para hacer seguimiento:</p>
          <p><strong>Email:</strong> ${data.emailContratante}<br>
          <strong>Contraseña:</strong> La que elegiste en el formulario</p>
        </div>

        <p>Un saludo,<br>
        <strong>Equipo Custodia360</strong><br>
        Tu entidad ya está protegida</p>
      </div>
    `
  }
}
