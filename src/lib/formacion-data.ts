import { Delegado, Modulo, PreguntaTest, Entidad } from './formacion-types'

export const entidades: Entidad[] = [
  {
    id: 'ent-1',
    nombre: 'Empresa Tecnológica S.L.',
    email: 'admin@empresa-tech.com',
    delegados: ['del-1', 'del-2']
  }
]

export const delegados: Delegado[] = [
  {
    id: 'del-1',
    nombre: 'María García López',
    email: 'maria.garcia@empresa-tech.com',
    entidad: 'ent-1',
    tipo: 'titular',
    password: 'DEL2024001',
    fechaContratacion: '2024-01-15',
    progreso: {
      etapaActual: 'bienvenida',
      modulosDescargados: [],
      testCompletado: false,
      certificadoGenerado: false
    }
  },
  {
    id: 'del-2',
    nombre: 'José Martínez Ruiz',
    email: 'jose.martinez@empresa-tech.com',
    entidad: 'ent-1',
    tipo: 'suplente',
    password: 'DEL2024002',
    fechaContratacion: '2024-01-15',
    progreso: {
      etapaActual: 'bienvenida',
      modulosDescargados: [],
      testCompletado: false,
      certificadoGenerado: false
    }
  }
]

export const modulos: Modulo[] = [
  {
    id: 'mod-1',
    titulo: 'Fundamentos de la Protección de Datos',
    descripcion: 'Introducción a los conceptos básicos del RGPD y la protección de datos personales.',
    archivo: 'modulo-1-fundamentos.pdf',
    orden: 1
  },
  {
    id: 'mod-2',
    titulo: 'Derechos de los Interesados',
    descripcion: 'Análisis detallado de los derechos de acceso, rectificación, supresión y portabilidad.',
    archivo: 'modulo-2-derechos.pdf',
    orden: 2
  },
  {
    id: 'mod-3',
    titulo: 'Medidas de Seguridad y Técnicas',
    descripcion: 'Implementación de medidas técnicas y organizativas para garantizar la seguridad.',
    archivo: 'modulo-3-seguridad.pdf',
    orden: 3
  },
  {
    id: 'mod-4',
    titulo: 'Gestión de Incidentes y Brechas',
    descripcion: 'Procedimientos para la detección, notificación y gestión de brechas de seguridad.',
    archivo: 'modulo-4-incidentes.pdf',
    orden: 4
  },
  {
    id: 'mod-5',
    titulo: 'Evaluación de Impacto y Registro',
    descripcion: 'Metodología para realizar evaluaciones de impacto y mantener el registro de actividades.',
    archivo: 'modulo-5-evaluacion.pdf',
    orden: 5
  }
]

export const preguntasTest: PreguntaTest[] = [
  {
    id: 'q1',
    pregunta: '¿Cuál es el plazo máximo para notificar una brecha de seguridad a la autoridad de control?',
    opciones: ['24 horas', '48 horas', '72 horas', '7 días'],
    respuestaCorrecta: 2
  },
  {
    id: 'q2',
    pregunta: '¿Qué significa el principio de minimización de datos?',
    opciones: [
      'Recoger todos los datos posibles',
      'Recoger solo los datos necesarios para el fin específico',
      'Eliminar datos cada mes',
      'Comprimir los datos'
    ],
    respuestaCorrecta: 1
  },
  {
    id: 'q3',
    pregunta: '¿Cuándo es obligatorio realizar una Evaluación de Impacto en la Protección de Datos?',
    opciones: [
      'Siempre',
      'Nunca',
      'Cuando el tratamiento suponga un alto riesgo',
      'Solo para empresas grandes'
    ],
    respuestaCorrecta: 2
  },
  {
    id: 'q4',
    pregunta: '¿Qué derecho permite al interesado recibir sus datos en formato estructurado?',
    opciones: ['Derecho de acceso', 'Derecho de portabilidad', 'Derecho de rectificación', 'Derecho de supresión'],
    respuestaCorrecta: 1
  },
  {
    id: 'q5',
    pregunta: '¿Cuál es la sanción máxima por infracciones graves del RGPD?',
    opciones: ['10 millones de euros', '20 millones de euros o 4% del volumen anual', '50 millones de euros', '100 millones de euros'],
    respuestaCorrecta: 1
  },
  {
    id: 'q6',
    pregunta: '¿Qué debe contener obligatoriamente el registro de actividades de tratamiento?',
    opciones: [
      'Solo el nombre del responsable',
      'Fines, categorías de datos, plazos y medidas de seguridad',
      'Solo los datos personales',
      'Únicamente las medidas de seguridad'
    ],
    respuestaCorrecta: 1
  },
  {
    id: 'q7',
    pregunta: '¿En qué plazo debe responderse a una solicitud de ejercicio de derechos?',
    opciones: ['15 días', '1 mes', '2 meses', '3 meses'],
    respuestaCorrecta: 1
  },
  {
    id: 'q8',
    pregunta: '¿Qué es la seudonimización?',
    opciones: [
      'Eliminar datos personales',
      'Cifrar datos personales',
      'Tratar datos de modo que no puedan atribuirse sin información adicional',
      'Hacer copias de seguridad'
    ],
    respuestaCorrecta: 2
  },
  {
    id: 'q9',
    pregunta: '¿Cuándo es necesario el consentimiento explícito?',
    opciones: [
      'Siempre',
      'Para datos sensibles o marketing directo',
      'Nunca',
      'Solo para menores'
    ],
    respuestaCorrecta: 1
  },
  {
    id: 'q10',
    pregunta: '¿Qué debe hacer el DPO cuando detecta un incumplimiento?',
    opciones: [
      'Ignorarlo',
      'Informar al responsable y supervisar',
      'Solo documentarlo',
      'Contactar directamente con la autoridad'
    ],
    respuestaCorrecta: 1
  },
  {
    id: 'q11',
    pregunta: '¿Cuál es el principio de limitación de la finalidad?',
    opciones: [
      'Los datos solo pueden usarse para fines compatibles con el original',
      'Se pueden usar para cualquier fin',
      'Solo pueden usarse una vez',
      'Deben eliminarse inmediatamente'
    ],
    respuestaCorrecta: 0
  },
  {
    id: 'q12',
    pregunta: '¿Qué es la Privacy by Design?',
    opciones: [
      'Un tipo de software',
      'Integrar la protección de datos desde el diseño',
      'Una autoridad de control',
      'Un derecho del interesado'
    ],
    respuestaCorrecta: 1
  },
  {
    id: 'q13',
    pregunta: '¿Cuándo debe nombrarse obligatoriamente un DPO?',
    opciones: [
      'Siempre',
      'Autoridades públicas, seguimiento habitual y sistemático, o datos sensibles a gran escala',
      'Solo empresas privadas',
      'Nunca es obligatorio'
    ],
    respuestaCorrecta: 1
  },
  {
    id: 'q14',
    pregunta: '¿Qué es el derecho al olvido?',
    opciones: [
      'Derecho de acceso',
      'Derecho de supresión',
      'Derecho de rectificación',
      'Derecho de oposición'
    ],
    respuestaCorrecta: 1
  },
  {
    id: 'q15',
    pregunta: '¿Qué debe incluir un contrato con un encargado de tratamiento?',
    opciones: [
      'Solo el precio',
      'Objeto, duración, naturaleza, finalidad, datos personales y obligaciones',
      'Solo la duración',
      'Solo las obligaciones'
    ],
    respuestaCorrecta: 1
  },
  {
    id: 'q16',
    pregunta: '¿Cuál es el plazo de conservación de datos por defecto?',
    opciones: [
      '5 años',
      '10 años',
      'No hay plazo por defecto, debe determinarse según la finalidad',
      'Para siempre'
    ],
    respuestaCorrecta: 2
  },
  {
    id: 'q17',
    pregunta: '¿Qué es una transferencia internacional de datos?',
    opciones: [
      'Enviar datos por email',
      'Transferir datos a un país fuera del EEE',
      'Hacer copias de seguridad',
      'Compartir datos internamente'
    ],
    respuestaCorrecta: 1
  },
  {
    id: 'q18',
    pregunta: '¿Qué debe evaluarse en una Evaluación de Impacto?',
    opciones: [
      'Solo los costes',
      'Solo la tecnología',
      'Riesgos para derechos y libertades de las personas',
      'Solo el tiempo necesario'
    ],
    respuestaCorrecta: 2
  },
  {
    id: 'q19',
    pregunta: '¿Cuándo debe notificarse una brecha al interesado?',
    opciones: [
      'Siempre',
      'Nunca',
      'Cuando sea probable un alto riesgo para sus derechos',
      'Solo si lo pide'
    ],
    respuestaCorrecta: 2
  },
  {
    id: 'q20',
    pregunta: '¿Qué es el principio de responsabilidad proactiva?',
    opciones: [
      'Esperar a que pase algo',
      'Demostrar el cumplimiento de forma proactiva',
      'Solo reaccionar ante problemas',
      'Delegar toda la responsabilidad'
    ],
    respuestaCorrecta: 1
  },
  {
    id: 'q21',
    pregunta: '¿Qué es la base jurídica del tratamiento?',
    opciones: [
      'El servidor donde se almacenan los datos',
      'La justificación legal para procesar datos personales',
      'El software utilizado',
      'El país donde se procesan los datos'
    ],
    respuestaCorrecta: 1
  },
  {
    id: 'q22',
    pregunta: '¿Qué medidas de seguridad son obligatorias?',
    opciones: [
      'Solo cifrado',
      'Solo copias de seguridad',
      'Las apropiadas según el riesgo',
      'Todas las existentes'
    ],
    respuestaCorrecta: 2
  }
]
