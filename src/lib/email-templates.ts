import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)
const FROM_EMAIL = process.env.RESEND_FROM_EMAIL || 'info@custodia360.es'

// Función para generar el HTML base con el estilo de Custodia360
const generateEmailHTML = (title: string, content: string) => `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>${title}</title>
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, sans-serif;
      line-height: 1.6;
      margin: 0;
      padding: 20px;
      background-color: #f9fafb;
      color: #374151;
    }
    .container {
      max-width: 600px;
      margin: 0 auto;
      background-color: white;
      border-radius: 12px;
      overflow: hidden;
      box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
    }
    .header {
      background: linear-gradient(135deg, #ea580c, #dc2626);
      color: white;
      padding: 30px;
      text-align: center;
    }
    .logo { font-size: 24px; font-weight: bold; margin-bottom: 10px; }
    .content { padding: 30px; }
    .footer {
      background-color: #f9fafb;
      padding: 20px;
      text-align: center;
      border-top: 1px solid #e5e7eb;
      color: #6b7280;
      font-size: 12px;
    }
    .button {
      display: inline-block;
      background-color: #ea580c;
      color: white;
      padding: 12px 24px;
      border-radius: 8px;
      text-decoration: none;
      font-weight: 600;
      margin: 20px 0;
    }
    .highlight { color: #ea580c; font-weight: bold; }
    .success { background-color: #ecfdf5; border: 1px solid #10b981; padding: 15px; border-radius: 8px; margin: 15px 0; }
    .warning { background-color: #fef3c7; border: 1px solid #f59e0b; padding: 15px; border-radius: 8px; margin: 15px 0; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <div class="logo">CUSTODIA360</div>
      <h1>${title}</h1>
    </div>
    <div class="content">
      ${content}
    </div>
    <div class="footer">
      <p><strong>Custodia360</strong></p>
      <p>Soluciones automatizadas de cumplimiento LOPIVI</p>
      <p>info@custodia360.es | www.custodia360.es</p>
      <p>Este email fue enviado automáticamente desde nuestro sistema.</p>
    </div>
  </div>
</body>
</html>
`;

const emailTemplates = {
  // Confirmación de contratación
  async enviarConfirmacionContratacion(email: string, nombre: string, entidad: string, plan: string, credenciales: {email: string, password: string}) {
    const content = `
      <div class="success">
        <h2>Contratación completada con éxito</h2>
        <p>Estimado/a <strong>${nombre}</strong>,</p>
        <p>Su contratación del <strong>${plan}</strong> para <strong>${entidad}</strong> ha sido procesada correctamente.</p>
      </div>

      <h3>Sus credenciales de acceso:</h3>
      <ul>
        <li><strong>Email:</strong> ${credenciales.email}</li>
        <li><strong>Contraseña:</strong> ${credenciales.password}</li>
      </ul>

      <p>Su entidad estará completamente protegida LOPIVI en <span class="highlight">72 horas</span>.</p>

      <div style="text-align: center;">
        <a href="https://custodia360.es/login" class="button">Acceder al Dashboard</a>
      </div>

      <h3>Próximos pasos automáticos:</h3>
      <ul>
        <li>Configuración del sistema (completado)</li>
        <li>Formación del delegado de protección (+1h)</li>
        <li>Certificación y activación (+48h)</li>
        <li>Sistema operativo completo (+72h)</li>
      </ul>
    `;

    return await resend.emails.send({
      from: FROM_EMAIL,
      to: email,
      subject: `Contratación Custodia360 completada - ${entidad}`,
      html: generateEmailHTML('Contratación completada', content)
    });
  },

  // Credenciales delegado
  async enviarCredencialesDelegado(email: string, nombre: string, tipo: string, entidad: string, credenciales: {email: string, password: string}) {
    const content = `
      <p>Estimado/a <strong>${nombre}</strong>,</p>
      <p>Ha sido designado como <strong>Delegado de Protección ${tipo}</strong> para <strong>${entidad}</strong>.</p>

      <div class="success">
        <h3>Sus credenciales de acceso:</h3>
        <ul>
          <li><strong>Email:</strong> ${credenciales.email}</li>
          <li><strong>Contraseña:</strong> ${credenciales.password}</li>
        </ul>
      </div>

      <p>Debe completar la formación LOPIVI especializada antes de poder acceder al dashboard completo.</p>

      <div style="text-align: center;">
        <a href="https://custodia360.es/login" class="button">Iniciar Formación LOPIVI</a>
      </div>

      <h3>Su formación incluye:</h3>
      <ul>
        <li>6 módulos especializados en protección infantil</li>
        <li>Certificación oficial LOPIVI</li>
        <li>Acceso al dashboard de gestión</li>
        <li>Protocolos específicos para su sector</li>
      </ul>
    `;

    return await resend.emails.send({
      from: FROM_EMAIL,
      to: email,
      subject: `Credenciales Delegado ${tipo} - ${entidad}`,
      html: generateEmailHTML(`Delegado de Protección ${tipo}`, content)
    });
  },

  // Certificación completada
  async enviarCertificadoCompletado(email: string, nombre: string, entidad: string, codigo: string, fecha: string) {
    const content = `
      <div class="success">
        <h2>Certificación LOPIVI completada</h2>
        <p>Estimado/a <strong>${nombre}</strong>,</p>
        <p>Ha completado con éxito la formación y certificación como Delegado de Protección para <strong>${entidad}</strong>.</p>
      </div>

      <h3>Detalles de su certificación:</h3>
      <ul>
        <li><strong>Código:</strong> ${codigo}</li>
        <li><strong>Fecha:</strong> ${fecha}</li>
        <li><strong>Entidad:</strong> ${entidad}</li>
        <li><strong>Válido:</strong> 2 años</li>
      </ul>

      <p>Ya puede acceder al dashboard completo de gestión LOPIVI.</p>

      <div style="text-align: center;">
        <a href="https://custodia360.es/login" class="button">Acceder al Dashboard</a>
      </div>

      <h3>Sus responsabilidades como Delegado:</h3>
      <ul>
        <li>Gestión de casos e incidentes</li>
        <li>Supervisión del plan de protección</li>
        <li>Comunicación con autoridades</li>
        <li>Formación del personal</li>
      </ul>
    `;

    return await resend.emails.send({
      from: FROM_EMAIL,
      to: email,
      subject: `Certificación LOPIVI completada - ${entidad}`,
      html: generateEmailHTML('Certificación completada', content)
    });
  },

  // Sistema operativo
  async enviarSistemaOperativo(email: string, nombre: string, entidad: string, delegado: string, fecha: string) {
    const content = `
      <div class="success">
        <h2>Sistema LOPIVI operativo</h2>
        <p>Estimado/a <strong>${nombre}</strong>,</p>
        <p><strong>${entidad}</strong> tiene ya implementada la LOPIVI completamente y cumple con toda la normativa.</p>
      </div>

      <h3>Estado actual:</h3>
      <ul>
        <li>Delegado certificado: <strong>${delegado}</strong></li>
        <li>Plan de protección específico</li>
        <li>Protocolos de actuación</li>
        <li>Sistema de gestión operativo</li>
        <li>Formación del personal</li>
      </ul>

      <p>Su entidad está protegida ante cualquier inspección desde el <strong>${fecha}</strong>.</p>

      <div style="text-align: center;">
        <a href="https://custodia360.es/login" class="button">Ver Dashboard</a>
      </div>

      <div class="warning">
        <h4>Mantenimiento automático incluido</h4>
        <p>Su sistema se actualiza automáticamente ante cambios normativos. No requiere acción adicional.</p>
      </div>
    `;

    return await resend.emails.send({
      from: FROM_EMAIL,
      to: email,
      subject: `${entidad} - Sistema LOPIVI operativo`,
      html: generateEmailHTML('Sistema operativo', content)
    });
  },

  // Factura primer pago
  async enviarFacturaPrimerPago(email: string, entidad: string, nombre: string, numeroFactura: string, importe: number, plan: string) {
    const content = `
      <p>Estimado/a <strong>${nombre}</strong>,</p>
      <p>Adjuntamos la factura correspondiente al primer pago de <strong>${entidad}</strong>.</p>

      <h3>Detalles de la factura:</h3>
      <ul>
        <li><strong>Número:</strong> ${numeroFactura}</li>
        <li><strong>Plan:</strong> ${plan}</li>
        <li><strong>Importe:</strong> ${importe}€ + IVA</li>
        <li><strong>Concepto:</strong> Primer pago (50%) - Implementación LOPIVI</li>
      </ul>

      <div class="success">
        <h4>Segundo pago programado</h4>
        <p>El segundo pago de <strong>${importe}€ + IVA</strong> se cobrará automáticamente a los 6 meses.</p>
      </div>

      <h3>Servicios incluidos:</h3>
      <ul>
        <li>Implementación completa LOPIVI en 72h</li>
        <li>Delegado de protección certificado</li>
        <li>Plan de protección personalizado</li>
        <li>Formación del personal</li>
        <li>Sistema de gestión digital</li>
        <li>Mantenimiento y actualizaciones</li>
      </ul>
    `;

    return await resend.emails.send({
      from: FROM_EMAIL,
      to: email,
      subject: `Factura ${numeroFactura} - ${entidad}`,
      html: generateEmailHTML('Factura - Primer pago', content)
    });
  },

  // Factura segundo pago
  async enviarFacturaSegundoPago(email: string, entidad: string, nombre: string, numeroFactura: string, importe: number, plan: string) {
    const content = `
      <p>Estimado/a <strong>${nombre}</strong>,</p>
      <p>Adjuntamos la factura correspondiente al segundo pago de <strong>${entidad}</strong>.</p>

      <h3>Detalles de la factura:</h3>
      <ul>
        <li><strong>Número:</strong> ${numeroFactura}</li>
        <li><strong>Plan:</strong> ${plan}</li>
        <li><strong>Importe:</strong> ${importe}€ + IVA</li>
        <li><strong>Concepto:</strong> Segundo pago (50%) - Mantenimiento LOPIVI</li>
      </ul>

      <div class="success">
        <h4>Servicios incluidos en este pago</h4>
        <p>Mantenimiento, actualizaciones automáticas y soporte especializado durante 6 meses adicionales.</p>
      </div>

      <h3>Su entidad mantiene:</h3>
      <ul>
        <li>Cumplimiento LOPIVI garantizado</li>
        <li>Actualizaciones automáticas</li>
        <li>Soporte técnico especializado</li>
        <li>Dashboard operativo 24/7</li>
      </ul>
    `;

    return await resend.emails.send({
      from: FROM_EMAIL,
      to: email,
      subject: `Factura ${numeroFactura} - Segundo pago - ${entidad}`,
      html: generateEmailHTML('Factura - Segundo pago', content)
    });
  },

  // Recordatorio renovación
  async enviarRecordatorioRenovacion(email: string, nombre: string, entidad: string, fechaVencimiento: string, diasRestantes: number) {
    const content = `
      <p>Estimado/a <strong>${nombre}</strong>,</p>
      <p>Le recordamos que el servicio LOPIVI de <strong>${entidad}</strong> vence el <strong>${fechaVencimiento}</strong>.</p>

      <div class="warning">
        <h4>Quedan ${diasRestantes} días</h4>
        <p>Para mantener la protección LOPIVI de su entidad, renueve antes del vencimiento.</p>
      </div>

      <h3>¿Qué ocurre si no renueva?</h3>
      <ul>
        <li>Pérdida de protección LOPIVI</li>
        <li>Dashboard inaccesible</li>
        <li>Sin actualizaciones normativas</li>
        <li>Riesgo de sanciones en inspecciones</li>
      </ul>

      <div style="text-align: center;">
        <a href="https://custodia360.es/renovar" class="button">Renovar Ahora</a>
      </div>

      <p>La renovación garantiza:</p>
      <ul>
        <li>Continuidad del servicio</li>
        <li>Actualizaciones automáticas</li>
        <li>Soporte especializado</li>
        <li>Protección ante inspecciones</li>
      </ul>
    `;

    return await resend.emails.send({
      from: FROM_EMAIL,
      to: email,
      subject: `Recordatorio renovación - ${entidad} (${diasRestantes} días)`,
      html: generateEmailHTML('Recordatorio de renovación', content)
    });
  },

  // Renovación anual
  async enviarRenovacionAnual(email: string, entidad: string, nombre: string, numeroFactura: string, importe: number, plan: string, fechaVencimiento: string) {
    const content = `
      <p>Estimado/a <strong>${nombre}</strong>,</p>
      <p>Es momento de renovar el servicio LOPIVI de <strong>${entidad}</strong>.</p>

      <h3>Detalles de la renovación:</h3>
      <ul>
        <li><strong>Número de factura:</strong> ${numeroFactura}</li>
        <li><strong>Plan:</strong> ${plan}</li>
        <li><strong>Importe:</strong> ${importe}€ + IVA</li>
        <li><strong>Vencimiento actual:</strong> ${fechaVencimiento}</li>
        <li><strong>Vigencia renovación:</strong> 12 meses</li>
      </ul>

      <div class="success">
        <h4>Beneficios de la renovación</h4>
        <p>Mantenga la protección LOPIVI de su entidad con todas las actualizaciones y mejoras.</p>
      </div>

      <h3>La renovación incluye:</h3>
      <ul>
        <li>Mantenimiento del plan de protección</li>
        <li>Actualizaciones normativas automáticas</li>
        <li>Soporte técnico especializado</li>
        <li>Dashboard operativo 24/7</li>
        <li>Certificación continua del delegado</li>
      </ul>

      <div style="text-align: center;">
        <a href="https://custodia360.es/renovar" class="button">Procesar Renovación</a>
      </div>
    `;

    return await resend.emails.send({
      from: FROM_EMAIL,
      to: email,
      subject: `Renovación anual - ${entidad}`,
      html: generateEmailHTML('Renovación anual', content)
    });
  },

  // Recordatorio formación
  async enviarRecordatorioFormacion(email: string, nombre: string, entidad: string, progreso: number) {
    const content = `
      <p>Estimado/a <strong>${nombre}</strong>,</p>
      <p>Tiene pendiente completar la formación LOPIVI para <strong>${entidad}</strong>.</p>

      <div class="warning">
        <h4>Progreso actual: ${progreso}%</h4>
        <p>Complete la formación para activar el dashboard completo.</p>
      </div>

      <h3>Módulos pendientes:</h3>
      <ul>
        <li>Protocolos de actuación</li>
        <li>Gestión de casos</li>
        <li>Comunicación con autoridades</li>
        <li>Evaluación final</li>
      </ul>

      <div style="text-align: center;">
        <a href="https://custodia360.es/login" class="button">Continuar Formación</a>
      </div>

      <p><strong>Importante:</strong> La formación debe completarse para que su entidad esté protegida LOPIVI.</p>
    `;

    return await resend.emails.send({
      from: FROM_EMAIL,
      to: email,
      subject: `Recordatorio formación LOPIVI - ${entidad}`,
      html: generateEmailHTML('Recordatorio de formación', content)
    });
  },

  // Estado formación
  async enviarEstadoFormacion(email: string, nombre: string, entidad: string, delegado: string, progreso: number) {
    const content = `
      <p>Estimado/a <strong>${nombre}</strong>,</p>
      <p>Estado de la formación LOPIVI de <strong>${delegado}</strong> en <strong>${entidad}</strong>:</p>

      <div class="success">
        <h4>Progreso: ${progreso}%</h4>
        <p>La formación avanza según lo planificado.</p>
      </div>

      <h3>Módulos completados:</h3>
      <ul>
        <li>Introducción a la LOPIVI</li>
        <li>Rol del delegado de protección</li>
        <li>Detección de casos</li>
        <li>Protocolos de actuación (en progreso)</li>
        <li>Gestión de emergencias</li>
        <li>Evaluación final</li>
      </ul>

      <p><strong>Tiempo estimado para completar:</strong> 2-3 días laborables</p>

      <div style="text-align: center;">
        <a href="https://custodia360.es/login" class="button">Ver Progreso Detallado</a>
      </div>
    `;

    return await resend.emails.send({
      from: FROM_EMAIL,
      to: email,
      subject: `Estado formación - ${entidad}`,
      html: generateEmailHTML('Estado de formación', content)
    });
  },

  // Vencimiento certificación
  async enviarVencimientoCertificacion(email: string, nombre: string, entidad: string, fechaVencimiento: string, diasRestantes: number) {
    const content = `
      <p>Estimado/a <strong>${nombre}</strong>,</p>
      <p>Su certificación como Delegado de Protección para <strong>${entidad}</strong> vence el <strong>${fechaVencimiento}</strong>.</p>

      <div class="warning">
        <h4>Quedan ${diasRestantes} días</h4>
        <p>Renueve su certificación para mantener el cumplimiento LOPIVI.</p>
      </div>

      <h3>¿Qué debe hacer?</h3>
      <ul>
        <li>Completar curso de actualización (2 horas)</li>
        <li>Superar evaluación de renovación</li>
        <li>Obtener nueva certificación válida por 2 años</li>
      </ul>

      <div style="text-align: center;">
        <a href="https://custodia360.es/renovar-certificacion" class="button">Renovar Certificación</a>
      </div>

      <div class="warning">
        <h4>Importante</h4>
        <p>Sin certificación vigente, su entidad no cumple la LOPIVI y puede ser sancionada.</p>
      </div>
    `;

    return await resend.emails.send({
      from: FROM_EMAIL,
      to: email,
      subject: `Vencimiento certificación - ${entidad} (${diasRestantes} días)`,
      html: generateEmailHTML('Vencimiento de certificación', content)
    });
  },

  // Recordatorio certificación 90 días antes
  async enviarRecordatorioCertificacion90Dias(email: string, nombre: string, entidad: string, tipoDelegado: string, fechaVencimiento: string) {
    const content = `
      <p>Estimado/a <strong>${nombre}</strong>,</p>
      <p>Su certificación como <strong>Delegado/a de Protección ${tipoDelegado}</strong> para <strong>${entidad}</strong> vence el <strong>${fechaVencimiento}</strong>.</p>

      <div class="warning">
        <h4>📅 Recordatorio: 90 días para renovación</h4>
        <p>Le informamos con antelación para que pueda planificar el proceso de renovación sin interrupciones en el cumplimiento LOPIVI.</p>
      </div>

      <h3>Proceso de renovación de certificación</h3>
      <ul>
        <li><strong>Formación continua:</strong> Completar curso de actualización (8 horas)</li>
        <li><strong>Evaluación:</strong> Superar test de renovación (puntuación mínima 80%)</li>
        <li><strong>Documentación:</strong> Entregar certificado negativo actualizado</li>
        <li><strong>Nueva certificación:</strong> Válida por 2 años adicionales</li>
      </ul>

      <div style="text-align: center;">
        <a href="https://custodia360.es/renovar-certificacion" class="button">Iniciar Proceso de Renovación</a>
      </div>

      <div class="success">
        <h4>✅ Ventajas de renovar con antelación</h4>
        <ul>
          <li>Sin interrupciones en el cumplimiento LOPIVI</li>
          <li>Más tiempo para completar la formación</li>
          <li>Continuidad en la protección de menores</li>
          <li>Tranquilidad para su entidad y familias</li>
        </ul>
      </div>

      <h3>Información de contacto</h3>
      <ul>
        <li><strong>Email:</strong> info@custodia360.com</li>
        <li><strong>Teléfono:</strong> 678 771 198</li>
        <li><strong>Horario:</strong> Lunes a Viernes 9:00 - 17:00</li>
      </ul>
    `;

    return await resend.emails.send({
      from: FROM_EMAIL,
      to: email,
      subject: `Recordatorio: Renovación certificación ${tipoDelegado} - ${entidad} (90 días)`,
      html: generateEmailHTML('Recordatorio de renovación certificación', content)
    });
  },

  // Documentación solicitada
  async enviarDocumentacionSolicitada(email: string, entidad: string, tipoDocumentacion: string, mensajePersonalizado?: string) {
    const content = `
      <p>Estimados responsables de <strong>${entidad}</strong>,</p>

      ${mensajePersonalizado ? `<p>${mensajePersonalizado}</p>` : '<p>Adjuntamos la documentación LOPIVI solicitada.</p>'}

      <div class="success">
        <h4>Documentación: ${tipoDocumentacion}</h4>
        <p>Toda la documentación está actualizada y validada legalmente.</p>
      </div>

      <h3>Documentos incluidos:</h3>
      <ul>
        <li>Plan de Protección específico de su entidad</li>
        <li>Certificados de delegados vigentes</li>
        <li>Protocolos de actuación detallados</li>
        <li>Código de conducta profesional</li>
        <li>Registro de formación del personal</li>
        <li>Evidencias de cumplimiento LOPIVI</li>
      </ul>

      <div class="warning">
        <h4>Para inspecciones</h4>
        <p>Esta documentación está lista para presentar ante cualquier inspección o auditoría.</p>
      </div>

      <div style="text-align: center;">
        <a href="https://custodia360.es/documentos" class="button">Acceder a Documentos</a>
      </div>
    `;

    return await resend.emails.send({
      from: FROM_EMAIL,
      to: email,
      subject: `Documentación LOPIVI - ${entidad}`,
      html: generateEmailHTML('Documentación solicitada', content)
    });
  },

  // Informe emergencia inspección
  async enviarInformeEmergenciaInspeccion(email: string, entidad: string, motivo: string, fecha: string) {
    const content = `
      <div class="warning">
        <h2>Informe de Emergencia para Inspección</h2>
        <p><strong>Entidad:</strong> ${entidad}</p>
        <p><strong>Motivo:</strong> ${motivo}</p>
        <p><strong>Fecha:</strong> ${fecha}</p>
      </div>

      <h3>Estado de Cumplimiento LOPIVI:</h3>
      <div class="success">
        <ul>
          <li><strong>Delegado de Protección:</strong> Certificado y activo</li>
          <li><strong>Plan de Protección:</strong> Vigente y actualizado</li>
          <li><strong>Formación Personal:</strong> Completada</li>
          <li><strong>Protocolos:</strong> Implementados</li>
          <li><strong>Documentación:</strong> Completa y disponible</li>
        </ul>
      </div>

      <h3>Documentación disponible para inspección:</h3>
      <ul>
        <li>Plan de Protección específico</li>
        <li>Certificados de delegados</li>
        <li>Protocolos de actuación</li>
        <li>Registro de formación</li>
        <li>Informes de cumplimiento</li>
        <li>Código de conducta</li>
      </ul>

      <div class="success">
        <h4>Preparado para inspección</h4>
        <p>Su entidad está completamente preparada para cualquier inspección LOPIVI.</p>
      </div>

      <div style="text-align: center;">
        <a href="https://custodia360.es/inspeccion" class="button">Descargar Documentación Completa</a>
      </div>
    `;

    return await resend.emails.send({
      from: FROM_EMAIL,
      to: email,
      subject: `Informe emergencia inspección - ${entidad}`,
      html: generateEmailHTML('Informe de emergencia', content)
    });
  },

  // Paquete urgente
  async enviarPaqueteUrgente(emailContratante: string, emailAdministrativo: string, entidad: string, motivo: string) {
    const content = `
      <div class="warning">
        <h2>Paquete Urgente LOPIVI</h2>
        <p><strong>Entidad:</strong> ${entidad}</p>
        <p><strong>Motivo:</strong> ${motivo}</p>
      </div>

      <p>Se ha enviado un paquete urgente con toda la documentación LOPIVI requerida.</p>

      <h3>Contenido del paquete:</h3>
      <ul>
        <li>Plan de Protección completo</li>
        <li>Certificados originales</li>
        <li>Protocolos impresos</li>
        <li>Manual de implementación</li>
        <li>Backup digital</li>
      </ul>

      <div class="success">
        <h4>Entrega garantizada</h4>
        <p>El paquete llegará en 24-48 horas laborables.</p>
      </div>

      <h3>Destinatarios:</h3>
      <ul>
        <li><strong>Responsable:</strong> ${emailContratante}</li>
        <li><strong>Administrativo:</strong> ${emailAdministrativo}</li>
      </ul>
    `;

    // Enviar a ambos emails
    await resend.emails.send({
      from: FROM_EMAIL,
      to: emailContratante,
      subject: `Paquete urgente enviado - ${entidad}`,
      html: generateEmailHTML('Paquete urgente', content)
    });

    return await resend.emails.send({
      from: FROM_EMAIL,
      to: emailAdministrativo,
      subject: `Paquete urgente enviado - ${entidad}`,
      html: generateEmailHTML('Paquete urgente', content)
    });
  },

  // Informe trimestral
  async enviarInformeTrimestral(email: string, nombre: string, entidad: string, datos: any = {}) {
    const content = `
      <p>Estimado/a <strong>${nombre}</strong>,</p>
      <p>Adjuntamos el informe trimestral de cumplimiento LOPIVI para <strong>${entidad}</strong>.</p>

      <div class="success">
        <h4>📊 Resumen del Trimestre</h4>
        <ul>
          <li><strong>Estado general:</strong> ${datos.estado || 'Conforme'}</li>
          <li><strong>Formaciones completadas:</strong> ${datos.formaciones || 0}</li>
          <li><strong>Incidencias:</strong> ${datos.incidencias || 0}</li>
          <li><strong>Cumplimiento:</strong> ${datos.cumplimiento || '100%'}</li>
        </ul>
      </div>

      <h3>Próximas acciones recomendadas:</h3>
      <ul>
        <li>Revisión de certificados próximos a vencer</li>
        <li>Planificación de formaciones del próximo trimestre</li>
        <li>Actualización de protocolos si corresponde</li>
      </ul>

      <div style="text-align: center;">
        <a href="https://custodia360.es/dashboard-custodia" class="button">Ver Informe Completo</a>
      </div>
    `;

    return await resend.emails.send({
      from: FROM_EMAIL,
      to: email,
      subject: `Informe Trimestral LOPIVI - ${entidad}`,
      html: generateEmailHTML('Informe trimestral', content)
    });
  },

  // Recordatorio certificación 30 días antes
  async enviarRecordatorioCertificacion30Dias(email: string, nombre: string, entidad: string, tipoDelegado: string, fechaVencimiento: string) {
    const content = `
      <p>Estimado/a <strong>${nombre}</strong>,</p>
      <p><strong>URGENTE:</strong> Su certificación como <strong>Delegado/a de Protección ${tipoDelegado}</strong> para <strong>${entidad}</strong> vence el <strong>${fechaVencimiento}</strong>.</p>

      <div class="warning">
        <h4>⚠️ Solo quedan 30 días para renovar</h4>
        <p>Es necesario iniciar el proceso de renovación inmediatamente para evitar interrupciones en el cumplimiento LOPIVI.</p>
      </div>

      <h3>Acción inmediata requerida:</h3>
      <ul>
        <li><strong>Hoy:</strong> Iniciar el proceso de renovación</li>
        <li><strong>Esta semana:</strong> Completar formación de actualización</li>
        <li><strong>Próximos 15 días:</strong> Realizar test de renovación</li>
        <li><strong>Antes del vencimiento:</strong> Entregar documentación actualizada</li>
      </ul>

      <div style="text-align: center;">
        <a href="https://custodia360.es/renovar-certificacion" class="button" style="background-color: #dc3545;">Renovar AHORA</a>
      </div>

      <div class="warning">
        <h4>Consecuencias del vencimiento</h4>
        <p>Si la certificación vence sin renovar, su entidad quedará temporalmente fuera de cumplimiento LOPIVI hasta completar el proceso.</p>
      </div>
    `;

    return await resend.emails.send({
      from: FROM_EMAIL,
      to: email,
      subject: `🚨 URGENTE: Renovación certificación ${tipoDelegado} - ${entidad} (30 días)`,
      html: generateEmailHTML('Renovación urgente certificación', content)
    });
  },

  // NUEVO: Email automático para comunicar canal LOPIVI a toda la organización
  canalLopiviOrganizacion: {
    subject: (data: any) => `IMPORTANTE: Canal directo delegado LOPIVI - ${data.entidad}`,
    html: (data: any) => `
      <div style="font-family: 'Arial', sans-serif; max-width: 600px; margin: 0 auto; background-color: #f8fafc;">

        <!-- Header -->
        <div style="background: linear-gradient(135deg, #1e40af 0%, #3b82f6 100%); color: white; padding: 30px 20px; text-align: center;">
          <div style="width: 60px; height: 60px; background: white; border-radius: 12px; display: inline-flex; align-items: center; justify-content: center; margin-bottom: 20px;">
            <span style="color: #1e40af; font-size: 24px; font-weight: bold;">C360</span>
          </div>
          <h1 style="margin: 0; font-size: 24px; font-weight: bold;">Canal Directo LOPIVI</h1>
          <p style="margin: 10px 0 0 0; opacity: 0.9;">Comunicación obligatoria por ley</p>
        </div>

        <!-- Content -->
        <div style="padding: 30px 20px; background: white;">
          <p style="color: #374151; line-height: 1.6; margin-bottom: 20px;">
            Estimado miembro de <strong>${data.entidad}</strong>,
          </p>

          <p style="color: #374151; line-height: 1.6; margin-bottom: 25px;">
            En cumplimiento del <strong>artículo 49.2 de la Ley LOPIVI</strong>, le informamos
            del canal directo de comunicación con nuestro Delegado de Protección:
          </p>

          <!-- Canal Info Box -->
          <div style="background: #eff6ff; border: 2px solid #3b82f6; border-radius: 12px; padding: 25px; margin: 25px 0;">
            <h2 style="color: #1e40af; margin: 0 0 15px 0; font-size: 18px; font-weight: bold;">
              CANAL DIRECTO LOPIVI
            </h2>
            <div style="color: #1f2937; line-height: 1.8;">
              <p style="margin: 5px 0;"><strong>Delegado:</strong> ${data.delegado}</p>
              <p style="margin: 5px 0;"><strong>Tipo:</strong> ${data.canal.tipo.charAt(0).toUpperCase() + data.canal.tipo.slice(1)}</p>
              <p style="margin: 5px 0;"><strong>Contacto:</strong> ${data.canal.contacto}</p>
              ${data.canal.horario ? `<p style="margin: 5px 0;"><strong>Horario:</strong> ${data.canal.horario}</p>` : ''}
              ${data.canal.instrucciones ? `<p style="margin: 5px 0;"><strong>Instrucciones:</strong> ${data.canal.instrucciones}</p>` : ''}
            </div>
          </div>

          <!-- Important Notice -->
          <div style="background: #fef3c7; border-left: 4px solid #f59e0b; padding: 20px; margin: 25px 0;">
            <h3 style="color: #92400e; margin: 0 0 10px 0; font-size: 16px;">
              IMPORTANTE: Este canal es específico para
            </h3>
            <ul style="color: #92400e; margin: 0; padding-left: 20px; line-height: 1.6;">
              <li>Comunicar situaciones de riesgo para menores</li>
              <li>Dudas sobre protocolos LOPIVI</li>
              <li>Reportar incidencias relacionadas con menores</li>
              <li>Consultas urgentes de protección infantil</li>
            </ul>
          </div>

          <p style="color: #6b7280; font-size: 14px; line-height: 1.6; margin: 20px 0;">
            <strong>Nota:</strong> Para otros temas administrativos o generales de la entidad,
            utilice los canales habituales de comunicación.
          </p>

          <!-- Legal Footer -->
          <div style="border-top: 1px solid #e5e7eb; padding-top: 20px; margin-top: 30px;">
            <p style="color: #6b7280; font-size: 12px; line-height: 1.5; margin: 0;">
              Este canal ha sido establecido en cumplimiento de la Ley Orgánica 8/2021
              de Protección Integral a la Infancia y la Adolescencia (LOPIVI).
            </p>
          </div>
        </div>

        <!-- Footer -->
        <div style="background: #f3f4f6; padding: 20px; text-align: center;">
          <p style="color: #6b7280; font-size: 12px; margin: 0;">
            ${data.entidad} - Sistema de Protección LOPIVI<br>
            Delegado de Protección: ${data.delegado}
          </p>
          <p style="color: #9ca3af; font-size: 11px; margin: 10px 0 0 0;">
            Custodia360 - Sistema de Gestión LOPIVI
          </p>
        </div>
      </div>
    `
  }
};

// Export para compatibilidad con código existente
export const professionalEmailTemplates = {
  bienvenidaContratante: {
    subject: (data: any) => `Contratación Custodia360 completada - ${data.nombreEntidad}`,
    html: (data: any) => generateEmailHTML('Contratación completada', `
      <div class="success">
        <h2>Contratación completada con éxito</h2>
        <p>Estimado/a <strong>${data.nombreContratante}</strong>,</p>
        <p>Su contratación para <strong>${data.nombreEntidad}</strong> ha sido procesada correctamente.</p>
      </div>
      <p>Su entidad estará completamente protegida LOPIVI en <span class="highlight">72 horas</span>.</p>
    `)
  },
  asignacionDelegado: {
    subject: (data: any) => `Asignación Delegado de Protección - ${data.nombreEntidad}`,
    html: (data: any) => generateEmailHTML('Asignación de Delegado', `
      <p>Estimado/a <strong>${data.nombreDelegado}</strong>,</p>
      <p>Ha sido asignado como Delegado de Protección para <strong>${data.nombreEntidad}</strong>.</p>
    `)
  },
  documentacionLista: {
    subject: (data: any) => `Documentación LOPIVI lista - ${data.nombreEntidad}`,
    html: (data: any) => generateEmailHTML('Documentación lista', `
      <p>La documentación LOPIVI de <strong>${data.nombreEntidad}</strong> está lista.</p>
    `)
  },
  credencialesAcceso: {
    subject: (data: any) => `Credenciales de acceso - ${data.nombreEntidad}`,
    html: (data: any) => generateEmailHTML('Credenciales de acceso', `
      <p>Sus credenciales de acceso para <strong>${data.nombreEntidad}</strong>:</p>
      <ul>
        <li><strong>Email:</strong> ${data.email}</li>
        <li><strong>Contraseña:</strong> ${data.password}</li>
      </ul>
    `)
  },
  checkupSatisfaccion: {
    subject: (data: any) => `Check-up y satisfacción - ${data.nombreEntidad}`,
    html: (data: any) => generateEmailHTML('Check-up de satisfacción', `
      <p>Check-up de <strong>${data.nombreEntidad}</strong> completado.</p>
    `)
  },
  certificacionCompletada: {
    subject: (data: any) => `Certificación completada - ${data.nombreEntidad}`,
    html: (data: any) => generateEmailHTML('Certificación completada', `
      <p>La certificación de <strong>${data.nombreDelegado}</strong> para <strong>${data.nombreEntidad}</strong> ha sido completada.</p>
    `)
  },
  notificacionCertificacionContratante: {
    subject: (data: any) => `Sistema LOPIVI operativo - ${data.nombreEntidad}`,
    html: (data: any) => generateEmailHTML('Sistema operativo', `
      <p>El sistema LOPIVI de <strong>${data.nombreEntidad}</strong> está completamente operativo.</p>
    `)
  }
};

export default emailTemplates;
