import { sendEmailSafely, FROM_EMAIL } from './resend'

// Estilos base para todos los emails
const baseStyles = {
  fontFamily: 'Arial, sans-serif',
  maxWidth: '600px',
  margin: '0 auto'
}

const headerStyles = (color: string) => `
  background: linear-gradient(135deg, ${color} 0%, ${color}CC 100%);
  color: white;
  padding: 20px;
  text-align: center;
  border-radius: 8px 8px 0 0;
`

const contentStyles = `
  padding: 20px;
  background: white;
  border-radius: 0 0 8px 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
`

const buttonStyles = (bgColor: string) => `
  background: ${bgColor};
  color: white;
  padding: 12px 24px;
  text-decoration: none;
  border-radius: 6px;
  display: inline-block;
  font-weight: bold;
  margin: 20px 0;
`

// Templates de email profesionales
export const professionalEmailTemplates = {
  // Email de confirmación de contratación
  enviarConfirmacionContratacion: async (
    email: string,
    nombreContratante: string,
    nombreEntidad: string,
    plan: string,
    credenciales: { email: string; password: string }
  ) => {
    const subject = `✅ Contratación confirmada - ${nombreEntidad} | Custodia360`
    const html = `
      <div style="${baseStyles.fontFamily}; ${baseStyles.maxWidth}; ${baseStyles.margin};">
        <div style="${headerStyles('#2563EB')}">
          <h2>🎉 ¡Bienvenido a Custodia360!</h2>
          <p>Su entidad ya está protegida LOPIVI</p>
        </div>
        <div style="${contentStyles}">
          <h3>Hola ${nombreContratante},</h3>
          <p>¡Felicidades! Su entidad <strong>${nombreEntidad}</strong> ha sido registrada exitosamente en nuestro sistema Custodia360.</p>

          <div style="background: #eff6ff; padding: 15px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #2563EB;">
            <h4>📋 Credenciales de acceso:</h4>
            <p><strong>URL:</strong> <a href="https://custodia360.es/panel-acceso">Panel de Control</a></p>
            <p><strong>Email:</strong> ${credenciales.email}</p>
            <p><strong>Contraseña:</strong> ${credenciales.password}</p>
          </div>

          <h4>📦 Plan contratado:</h4>
          <p><strong>${plan}</strong></p>

          <h4>🚀 Próximos pasos:</h4>
          <ol>
            <li>Sus delegados recibirán credenciales de formación LOPIVI</li>
            <li>Una vez completada la formación, tendrán acceso al dashboard</li>
            <li>El sistema estará completamente operativo en 72 horas</li>
          </ol>

          <div style="text-align: center;">
            <a href="https://custodia360.es/panel-acceso" style="${buttonStyles('#2563EB')}">Acceder al Panel</a>
          </div>

          <p>Si tiene alguna pregunta, no dude en contactarnos.</p>
          <p>Un saludo,<br><strong>Equipo Custodia360</strong></p>
        </div>
      </div>
    `

    return await sendEmailSafely({
      to: email,
      subject,
      html
    })
  },

  // Email de credenciales para delegados
  enviarCredencialesDelegado: async (
    email: string,
    nombreDelegado: string,
    tipo: 'principal' | 'suplente',
    nombreEntidad: string,
    credenciales: { email: string; password: string }
  ) => {
    const color = tipo === 'principal' ? '#059669' : '#7C3AED'
    const subject = `🎓 Acceso Formación LOPIVI - Delegado ${tipo === 'principal' ? 'Principal' : 'Suplente'} | ${nombreEntidad}`

    const html = `
      <div style="${baseStyles.fontFamily}; ${baseStyles.maxWidth}; ${baseStyles.margin};">
        <div style="${headerStyles(color)}">
          <h2>🎓 Formación LOPIVI - Delegado ${tipo === 'principal' ? 'Principal' : 'Suplente'}</h2>
        </div>
        <div style="${contentStyles}">
          <h3>Hola ${nombreDelegado},</h3>
          <p>Ha sido designado/a como <strong>Delegado ${tipo === 'principal' ? 'Principal' : 'Suplente'} de Protección</strong> para la entidad <strong>${nombreEntidad}</strong>.</p>

          <div style="background: ${tipo === 'principal' ? '#f0fdf4' : '#faf5ff'}; padding: 15px; border-radius: 8px; margin: 20px 0; border-left: 4px solid ${color};">
            <h4>📚 Acceso a la formación LOPIVI:</h4>
            <p><strong>URL:</strong> <a href="https://custodia360.es/formacion-lopivi">Portal de Formación</a></p>
            <p><strong>Email:</strong> ${credenciales.email}</p>
            <p><strong>Contraseña:</strong> ${credenciales.password}</p>
          </div>

          <h4>📖 Contenido de la formación:</h4>
          <ul>
            <li>Marco legal LOPIVI</li>
            <li>Protocolos de actuación</li>
            <li>Gestión de casos</li>
            <li>Comunicación con autoridades</li>
            <li>Documentación obligatoria</li>
            ${tipo === 'suplente' ? '<li>Coordinación con delegado principal</li>' : ''}
          </ul>

          <p><strong>⏰ Duración estimada:</strong> 4-6 horas</p>
          <p><strong>🏆 Al completar:</strong> Acceso completo al dashboard de gestión</p>

          <div style="text-align: center;">
            <a href="https://custodia360.es/formacion-lopivi" style="${buttonStyles(color)}">Comenzar Formación</a>
          </div>

          <p>Un saludo,<br><strong>Equipo Custodia360</strong></p>
        </div>
      </div>
    `

    return await sendEmailSafely({
      to: email,
      subject,
      html
    })
  },

  // Email de recordatorio de formación
  enviarRecordatorioFormacion: async (
    email: string,
    nombreDelegado: string,
    nombreEntidad: string,
    progreso: number
  ) => {
    const subject = `⏰ Recordatorio: Formación LOPIVI pendiente | ${nombreEntidad}`
    const html = `
      <div style="${baseStyles.fontFamily}; ${baseStyles.maxWidth}; ${baseStyles.margin};">
        <div style="${headerStyles('#F59E0B')}">
          <h2>⏰ Recordatorio de Formación</h2>
        </div>
        <div style="${contentStyles}">
          <h3>Hola ${nombreDelegado},</h3>
          <p>Le recordamos que tiene pendiente completar su formación LOPIVI para la entidad <strong>${nombreEntidad}</strong>.</p>

          <div style="background: #fffbeb; padding: 15px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #F59E0B;">
            <h4>📊 Estado actual:</h4>
            <p><strong>Progreso:</strong> ${progreso}%</p>
            <p><strong>Estado:</strong> ${progreso === 0 ? 'No iniciada' : 'En progreso'}</p>
          </div>

          <p>Es importante completar esta formación para poder acceder al sistema de gestión y cumplir con los requisitos LOPIVI.</p>

          <div style="text-align: center;">
            <a href="https://custodia360.es/formacion-lopivi" style="${buttonStyles('#F59E0B')}">Continuar Formación</a>
          </div>

          <p>Si tiene alguna dificultad, no dude en contactarnos.</p>
          <p>Un saludo,<br><strong>Equipo Custodia360</strong></p>
        </div>
      </div>
    `

    return await sendEmailSafely({
      to: email,
      subject,
      html
    })
  },

  // Email de certificación completada
  enviarCertificacionCompletada: async (
    email: string,
    nombreDelegado: string,
    tipo: 'principal' | 'suplente',
    nombreEntidad: string,
    urlCertificado: string
  ) => {
    const color = tipo === 'principal' ? '#059669' : '#7C3AED'
    const subject = `🏆 ¡Certificación LOPIVI completada! - ${nombreEntidad}`

    const html = `
      <div style="${baseStyles.fontFamily}; ${baseStyles.maxWidth}; ${baseStyles.margin};">
        <div style="${headerStyles(color)}">
          <h2>🏆 ¡Certificación Completada!</h2>
          <p>Delegado ${tipo === 'principal' ? 'Principal' : 'Suplente'} Certificado</p>
        </div>
        <div style="${contentStyles}">
          <h3>¡Felicidades ${nombreDelegado}!</h3>
          <p>Ha completado exitosamente su formación LOPIVI como <strong>Delegado ${tipo === 'principal' ? 'Principal' : 'Suplente'}</strong> para <strong>${nombreEntidad}</strong>.</p>

          <div style="background: #f0fdf4; padding: 15px; border-radius: 8px; margin: 20px 0; border-left: 4px solid ${color};">
            <h4>✅ Certificación obtenida:</h4>
            <p><strong>Tipo:</strong> Delegado ${tipo === 'principal' ? 'Principal' : 'Suplente'} de Protección LOPIVI</p>
            <p><strong>Entidad:</strong> ${nombreEntidad}</p>
            <p><strong>Fecha:</strong> ${new Date().toLocaleDateString('es-ES')}</p>
          </div>

          <h4>🚀 Ya puede acceder a:</h4>
          <ul>
            <li>Dashboard de gestión completo</li>
            <li>Sistema de casos y alertas</li>
            <li>Comunicación con familias</li>
            <li>Reportes de cumplimiento</li>
            <li>Documentación oficial</li>
          </ul>

          <div style="text-align: center;">
            <a href="${urlCertificado}" style="${buttonStyles('#059669')}">Descargar Certificado</a>
            <br>
            <a href="https://custodia360.es/dashboard-delegado" style="${buttonStyles(color)}">Acceder al Dashboard</a>
          </div>

          <p>¡Enhorabuena por su compromiso con la protección infantil!</p>
          <p>Un saludo,<br><strong>Equipo Custodia360</strong></p>
        </div>
      </div>
    `

    return await sendEmailSafely({
      to: email,
      subject,
      html
    })
  },

  // Email de factura (primer y segundo pago)
  enviarFacturaPrimerPago: async (
    email: string,
    nombreEntidad: string,
    nombreResponsable: string,
    numeroFactura: string,
    importe: number,
    plan: string
  ) => {
    const subject = `💰 Factura ${numeroFactura} - Primer pago ${plan} | ${nombreEntidad}`
    const html = `
      <div style="${baseStyles.fontFamily}; ${baseStyles.maxWidth}; ${baseStyles.margin};">
        <div style="${headerStyles('#DC2626')}">
          <h2>💰 Factura - Primer Pago</h2>
        </div>
        <div style="${contentStyles}">
          <h3>Estimado/a ${nombreResponsable},</h3>
          <p>Adjuntamos la factura correspondiente al primer pago de su plan Custodia360.</p>

          <div style="background: #fef2f2; padding: 15px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #DC2626;">
            <h4>📄 Datos de facturación:</h4>
            <p><strong>Número:</strong> ${numeroFactura}</p>
            <p><strong>Entidad:</strong> ${nombreEntidad}</p>
            <p><strong>Plan:</strong> ${plan}</p>
            <p><strong>Importe:</strong> €${importe.toFixed(2)} + IVA</p>
            <p><strong>Concepto:</strong> Primer pago semestral</p>
          </div>

          <p><strong>⏰ Próximo pago:</strong> En 6 meses recibirá la factura del segundo pago.</p>
          <p><strong>📞 Soporte:</strong> Para cualquier consulta, contacte con nuestro departamento de facturación.</p>

          <p>Gracias por confiar en Custodia360.</p>
          <p>Un saludo,<br><strong>Departamento de Facturación<br>Custodia360</strong></p>
        </div>
      </div>
    `

    return await sendEmailSafely({
      to: email,
      subject,
      html
    })
  },

  // Email de factura segundo pago
  enviarFacturaSegundoPago: async (
    email: string,
    nombreEntidad: string,
    nombreResponsable: string,
    numeroFactura: string,
    importe: number,
    plan: string
  ) => {
    const subject = `💰 Factura ${numeroFactura} - Segundo pago ${plan} | ${nombreEntidad}`
    const html = `
      <div style="${baseStyles.fontFamily}; ${baseStyles.maxWidth}; ${baseStyles.margin};">
        <div style="${headerStyles('#DC2626')}">
          <h2>💰 Factura - Segundo Pago</h2>
        </div>
        <div style="${contentStyles}">
          <h3>Estimado/a ${nombreResponsable},</h3>
          <p>Adjuntamos la factura correspondiente al segundo y último pago de su primer año con Custodia360.</p>

          <div style="background: #fef2f2; padding: 15px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #DC2626;">
            <h4>📄 Datos de facturación:</h4>
            <p><strong>Número:</strong> ${numeroFactura}</p>
            <p><strong>Entidad:</strong> ${nombreEntidad}</p>
            <p><strong>Plan:</strong> ${plan}</p>
            <p><strong>Importe:</strong> €${importe.toFixed(2)} + IVA</p>
            <p><strong>Concepto:</strong> Segundo pago semestral</p>
          </div>

          <div style="background: #eff6ff; padding: 15px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #2563EB;">
            <h4>📅 Información sobre renovación:</h4>
            <p>A partir del próximo año, la renovación será mediante un <strong>único pago anual</strong>.</p>
            <p>Le contactaremos con antelación para gestionar la renovación.</p>
          </div>

          <p>Gracias por su confianza durante este primer año.</p>
          <p>Un saludo,<br><strong>Departamento de Facturación<br>Custodia360</strong></p>
        </div>
      </div>
    `

    return await sendEmailSafely({
      to: email,
      subject,
      html
    })
  },

  // Email de informe trimestral
  enviarInformeTrimestral: async (
    email: string,
    nombreResponsable: string,
    nombreEntidad: string,
    periodo: string,
    cumplimiento: number,
    incidentes: number,
    aspectosDestacados: string[]
  ) => {
    const subject = `📊 Informe ${periodo} - ${nombreEntidad} | Custodia360`
    const html = `
      <div style="${baseStyles.fontFamily}; ${baseStyles.maxWidth}; ${baseStyles.margin};">
        <div style="${headerStyles('#2563EB')}">
          <h2>📊 Informe de Cumplimiento</h2>
          <p>${periodo} - ${nombreEntidad}</p>
        </div>
        <div style="${contentStyles}">
          <h3>Estimado/a ${nombreResponsable},</h3>
          <p>Le presentamos el informe de cumplimiento LOPIVI de <strong>${nombreEntidad}</strong> correspondiente al período: <strong>${periodo}</strong>.</p>

          <div style="background: #f0fdf4; padding: 15px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #059669;">
            <h4>📈 Métricas principales:</h4>
            <p><strong>Nivel de cumplimiento:</strong> ${cumplimiento}%</p>
            <p><strong>Incidentes gestionados:</strong> ${incidentes}</p>
            <p><strong>Estado general:</strong> ${cumplimiento >= 90 ? '✅ Excelente' : cumplimiento >= 75 ? '⚠️ Bueno' : '❌ Requiere atención'}</p>
          </div>

          <h4>✨ Aspectos destacados:</h4>
          <ul>
            ${aspectosDestacados.map(aspecto => `<li>${aspecto}</li>`).join('')}
          </ul>

          <div style="text-align: center;">
            <a href="https://custodia360.es/panel-acceso" style="${buttonStyles('#2563EB')}">Ver Informe Completo</a>
          </div>

          <p>Para cualquier consulta sobre este informe, no dude en contactarnos.</p>
          <p>Un saludo,<br><strong>Equipo Custodia360</strong></p>
        </div>
      </div>
    `

    return await sendEmailSafely({
      to: email,
      subject,
      html
    })
  }
}

// Export por defecto con alias para compatibilidad
const emailTemplates = professionalEmailTemplates
export default emailTemplates
