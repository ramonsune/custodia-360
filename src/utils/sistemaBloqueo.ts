// Sistema de gestión de bloqueos y notificaciones Custodia360

interface EstadoConfiguracion {
  canalComunicacion: boolean;
  certificadosAntecedentes: boolean;
  fechaContratacion: string;
}

interface EstadoBloqueo {
  bloqueado: boolean;
  diasRestantes: number;
  requiereNotificacion15: boolean;
  requiereNotificacion30: boolean;
  accionesPendientes: string[];
}

export const verificarEstadoConfiguracion = (usuario: any): EstadoConfiguracion => {
  // Verificar canal de comunicación configurado
  const canalComunicacion = localStorage.getItem(`canal_comunicacion_${usuario.entidad}`) !== null;

  // Verificar certificados de antecedentes penales
  const certificadosAntecedentes = localStorage.getItem(`certificados_${usuario.id}`) !== null;

  // Fecha de contratación (si no existe, usar fecha actual)
  const fechaContratacion = localStorage.getItem(`fecha_contratacion_${usuario.entidad}`) || new Date().toISOString();

  return {
    canalComunicacion,
    certificadosAntecedentes,
    fechaContratacion
  };
};

export const calcularEstadoBloqueo = (configuracion: EstadoConfiguracion): EstadoBloqueo => {
  const fechaContratacion = new Date(configuracion.fechaContratacion);
  const fechaActual = new Date();
  const diasTranscurridos = Math.floor((fechaActual.getTime() - fechaContratacion.getTime()) / (1000 * 60 * 60 * 24));
  const diasRestantes = Math.max(0, 30 - diasTranscurridos);

  const configuracionCompleta = configuracion.canalComunicacion && configuracion.certificadosAntecedentes;

  const accionesPendientes = [];
  if (!configuracion.canalComunicacion) {
    accionesPendientes.push('Canal de comunicación');
  }
  if (!configuracion.certificadosAntecedentes) {
    accionesPendientes.push('Certificados de antecedentes penales');
  }

  return {
    bloqueado: !configuracionCompleta && diasRestantes === 0,
    diasRestantes,
    requiereNotificacion15: !configuracionCompleta && diasTranscurridos === 15,
    requiereNotificacion30: !configuracionCompleta && diasRestantes === 0,
    accionesPendientes
  };
};

export const enviarNotificacionEmail = (tipo: 'contratante' | 'delegado', usuario: any, accionesPendientes: string[], diasRestantes: number) => {
  // Simulación de envío de email - en producción se conectaría con servicio real
  const emails = {
    contratante_15: {
      destinatario: localStorage.getItem(`email_contratante_${usuario.entidad}`) || 'contratante@entidad.com',
      asunto: 'Custodia360 - Configuración pendiente para cumplimiento LOPIVI',
      mensaje: `
        Estimado/a responsable de ${usuario.entidad},

        Para que tu protocolo Custodia360 funcione correctamente y cumpla la normativa LOPIVI,
        los delegados de protección tienen que adjuntar la siguiente información:

        ${accionesPendientes.map(accion => `- ${accion}`).join('\n        ')}

        Quedan ${diasRestantes} días para completar esta configuración.

        Es fundamental completar estos pasos para garantizar la protección de menores en su entidad.

        Saludos,
        Equipo Custodia360
      `
    },
    contratante_30: {
      destinatario: localStorage.getItem(`email_contratante_${usuario.entidad}`) || 'contratante@entidad.com',
      asunto: 'Custodia360 BLOQUEADO - Configuración obligatoria pendiente',
      mensaje: `
        Estimado/a responsable de ${usuario.entidad},

        El sistema Custodia360 ha quedado BLOQUEADO debido a configuración pendiente.

        Para reactivar el sistema, es obligatorio completar:
        ${accionesPendientes.map(accion => `- ${accion}`).join('\n        ')}

        El sistema permanecerá bloqueado hasta que se suba la información requerida.
        Los delegados han sido notificados y pueden acceder para completar la configuración.

        Saludos,
        Equipo Custodia360
      `
    },
    delegado_15: {
      destinatario: usuario.email,
      asunto: 'Custodia360 - Te quedan 15 días para completar configuración',
      mensaje: `
        Estimado/a ${usuario.nombre},

        Te quedan 15 días para subir o realizar estas acciones en Custodia360:

        ${accionesPendientes.map(accion => `- ${accion}`).join('\n        ')}

        Es fundamental completar estos pasos para:
        - Cumplir con la normativa LOPIVI
        - Garantizar la protección de menores
        - Evitar el bloqueo del sistema

        Accede a tu dashboard para completar la configuración.

        Saludos,
        Equipo Custodia360
      `
    },
    delegado_30: {
      destinatario: usuario.email,
      asunto: 'Custodia360 BLOQUEADO - Configuración obligatoria',
      mensaje: `
        Estimado/a ${usuario.nombre},

        El sistema Custodia360 ha quedado BLOQUEADO.

        Para reactivar tu acceso, debes completar:
        ${accionesPendientes.map(accion => `- ${accion}`).join('\n        ')}

        El sistema permanecerá bloqueado hasta completar toda la configuración requerida.
        Puedes acceder para completar únicamente estas acciones.

        Saludos,
        Equipo Custodia360
      `
    }
  };

  const tipoEmail = `${tipo}_${diasRestantes === 15 ? '15' : '30'}` as keyof typeof emails;
  const emailData = emails[tipoEmail];

  // Guardar en localStorage para simular envío (en producción sería API real)
  const emailsEnviados = JSON.parse(localStorage.getItem('emails_enviados') || '[]');
  emailsEnviados.push({
    fecha: new Date().toISOString(),
    tipo: tipoEmail,
    destinatario: emailData.destinatario,
    asunto: emailData.asunto,
    mensaje: emailData.mensaje,
    entidad: usuario.entidad,
    usuario: usuario.nombre
  });
  localStorage.setItem('emails_enviados', JSON.stringify(emailsEnviados));

  console.log(`Email enviado: ${emailData.asunto} → ${emailData.destinatario}`);
};

export const procesarNotificacionesAutomaticas = (usuario: any) => {
  const configuracion = verificarEstadoConfiguracion(usuario);
  const estado = calcularEstadoBloqueo(configuracion);

  // Verificar si ya se enviaron las notificaciones para evitar duplicados
  const notificacionesEnviadas = JSON.parse(localStorage.getItem(`notificaciones_${usuario.entidad}`) || '{}');

  if (estado.requiereNotificacion15 && !notificacionesEnviadas.dia15) {
    enviarNotificacionEmail('contratante', usuario, estado.accionesPendientes, estado.diasRestantes);
    enviarNotificacionEmail('delegado', usuario, estado.accionesPendientes, estado.diasRestantes);

    notificacionesEnviadas.dia15 = true;
    localStorage.setItem(`notificaciones_${usuario.entidad}`, JSON.stringify(notificacionesEnviadas));
  }

  if (estado.requiereNotificacion30 && !notificacionesEnviadas.dia30) {
    enviarNotificacionEmail('contratante', usuario, estado.accionesPendientes, 0);
    enviarNotificacionEmail('delegado', usuario, estado.accionesPendientes, 0);

    notificacionesEnviadas.dia30 = true;
    localStorage.setItem(`notificaciones_${usuario.entidad}`, JSON.stringify(notificacionesEnviadas));
  }

  return estado;
};

export const inicializarFechaContratacion = (entidad: string) => {
  const fechaExistente = localStorage.getItem(`fecha_contratacion_${entidad}`);
  if (!fechaExistente) {
    localStorage.setItem(`fecha_contratacion_${entidad}`, new Date().toISOString());
  }
};
