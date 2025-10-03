'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { FormacionProgressBar } from '@/components/FormacionProgressBar';
import jsPDF from 'jspdf';

interface Usuario {
  id: string;
  nombre: string;
  email: string;
  tipo: string;
  entidad: string;
  certificacionVigente?: boolean;
  formacionCompletada?: boolean;
  tipoEntidad?: string | null;
}

// Datos de formación específicos para delegados suplentes (estructura completa como el principal)
const formacionDataSuplente = {
  1: {
    titulo: "Introducción a la LOPIVI para Suplentes",
    secciones: [
      {
        titulo: "Marco Legal y su Aplicación como Suplente",
        contenido: "Como Delegado Suplente en su ENTORNO_EJEMPLO, su función trasciende el simple apoyo para convertirse en un elemento crucial de continuidad y robustez del sistema de protección. La LOPIVI no solo permite sino que exige la designación de un delegado suplente, reconociendo la importancia de garantizar cobertura profesional especializada las 24 horas del día, los 7 días de la semana.\n\n=== SU ROL ESPECÍFICO COMO SUPLENTE EN ENTORNO_EJEMPLO ===\n\nCOMO DELEGADO SUPLENTE:\n• Debe poseer la misma formación especializada que el delegado principal.\n• Puede asumir TODAS las funciones del principal cuando sea necesario.\n• Debe coordinar constantemente con el delegado principal.\n• Es responsable de mantener su formación actualizada en FORMACION_ESPECIFICA.\n• Debe conocer personalmente todos los casos en seguimiento.\n• Puede tomar decisiones autónomas con plena autoridad legal.\n• Debe supervisar ACTIVIDAD_EJEMPLO con la misma competencia.\n• Es responsable de la gestión de SITUACION_EJEMPLO en ausencia del principal."
      },
      {
        titulo: "Competencias Específicas del Delegado Suplente",
        contenido: "El delegado suplente debe desarrollar competencias específicas que le permitan no solo apoyar al delegado principal, sino también sustituirlo completamente cuando sea necesario, manteniendo el mismo nivel de calidad y eficacia en la protección de menores durante ACTIVIDAD_EJEMPLO.\n\n=== COMPETENCIAS TÉCNICAS REQUERIDAS ===\n\n1. CONOCIMIENTO INTEGRAL DEL SISTEMA:\n   • Dominio completo de la LOPIVI aplicada a ENTORNO_EJEMPLO\n   • Conocimiento exhaustivo de protocolos para ACTIVIDAD_EJEMPLO\n   • Comprensión profunda de roles de PROFESIONAL_EJEMPLO"
      }
    ]
  },
  2: {
    titulo: "Detección de Indicadores de Riesgo",
    secciones: [
      {
        titulo: "Detección de Indicadores Físicos en su ENTORNO_EJEMPLO",
        contenido: "Como delegado suplente en su ENTORNO_EJEMPLO, debe desarrollar habilidades específicas para detectar indicadores físicos durante ACTIVIDAD_EJEMPLO, considerando las particularidades de SITUACION_EJEMPLO y la interacción con PROFESIONAL_EJEMPLO.\n\n• Observación sistemática del estado físico de PARTICIPANTES_EJEMPLO.\n• Detección temprana de cambios en la participación.\n• Evaluación de lesiones o marcas físicas durante ACTIVIDAD_EJEMPLO.\n• Identificación de comportamientos de autoprotección.\n• Registro apropiado de observaciones preocupantes.\n• Coordinación inmediata con el delegado principal cuando sea necesario."
      },
      {
        titulo: "Indicadores Emocionales y Conductuales en ACTIVIDAD_EJEMPLO",
        contenido: "En su ENTORNO_EJEMPLO, los indicadores emocionales y conductuales durante ACTIVIDAD_EJEMPLO pueden ser las primeras señales de situaciones de riesgo.\n\n• Cambios súbitos en el comportamiento durante ACTIVIDAD_EJEMPLO.\n• Alteraciones en la interacción con PROFESIONAL_EJEMPLO.\n• Manifestaciones de ansiedad o miedo en SITUACION_EJEMPLO.\n• Variaciones en el rendimiento o participación habitual.\n• Señales de estrés emocional durante las actividades.\n• Comportamientos regresivos o inapropiados para la edad."
      }
    ]
  },
  3: {
    titulo: "Protocolos de Actuación",
    secciones: [
      {
        titulo: "Protocolo de Comunicación Inmediata para Suplentes",
        contenido: "Como delegado suplente, debe dominar completamente los protocolos de comunicación inmediata, ya que puede encontrarse en situaciones donde debe actuar con total autonomía.\n\n• Activación inmediata de protocolos ante situaciones de riesgo.\n• Comunicación directa con autoridades competentes.\n• Coordinación simultánea con el delegado principal.\n• Documentación exhaustiva de todas las actuaciones.\n• Seguimiento de casos hasta su resolución.\n• Mantenimiento de canales de comunicación 24/7."
      },
      {
        titulo: "Gestión de Crisis como Suplente",
        contenido: "La gestión de crisis como delegado suplente requiere las mismas competencias que el delegado principal, con la particularidad de que debe coordinar también con el delegado principal cuando esté disponible.\n\n• Evaluación rápida y precisa de situaciones críticas.\n• Toma de decisiones inmediatas para proteger a PARTICIPANTES_EJEMPLO.\n• Activación de protocolos de emergencia específicos.\n• Coordinación con servicios de emergencia y autoridades.\n• Gestión del estrés y mantenimiento de la calma.\n• Comunicación efectiva con familias y equipos."
      }
    ]
  },
  4: {
    titulo: "Formación del Personal",
    secciones: [
      {
        titulo: "Programa de Formación Obligatoria para Suplentes",
        contenido: "Como delegado suplente, debe estar capacitado para formar al personal en ausencia del delegado principal, manteniendo los mismos estándares de calidad.\n\n• Dominio completo de contenidos formativos especializados.\n• Competencias pedagógicas para transmitir conocimientos.\n• Evaluación de competencias del PROFESIONAL_EJEMPLO.\n• Diseño de programas formativos adaptados.\n• Seguimiento del progreso formativo del personal.\n• Certificación de competencias adquiridas."
      }
    ]
  },
  5: {
    titulo: "Documentación y Registros",
    secciones: [
      {
        titulo: "Sistema de Documentación para Suplentes",
        contenido: "El delegado suplente debe manejar todos los sistemas de documentación con la misma competencia que el delegado principal.\n\n• Registro preciso y oportuno de todas las observaciones.\n• Mantenimiento de expedientes individuales actualizados.\n• Documentación de comunicaciones con familias y autoridades.\n• Seguimiento de casos y evolución de situaciones.\n• Cumplimiento de protocolos de confidencialidad.\n• Coordinación de la documentación con el delegado principal."
      }
    ]
  },
  6: {
    titulo: "Evaluación y Mejora Continua",
    secciones: [
      {
        titulo: "Sistema de Evaluación para Suplentes",
        contenido: "El delegado suplente debe participar activamente en la evaluación del sistema de protección y proponer mejoras.\n\n• Evaluación continua de la efectividad de protocolos.\n• Identificación de áreas de mejora en ACTIVIDAD_EJEMPLO.\n• Análisis de la evolución de casos bajo seguimiento.\n• Participación en revisiones periódicas del sistema.\n• Propuesta de innovaciones y mejores prácticas.\n• Colaboración en auditorías internas y externas."
      }
    ]
  },
  7: {
    titulo: "Coordinación Interinstitucional",
    secciones: [
      {
        titulo: "Red de Protección para Suplentes",
        contenido: "El delegado suplente debe mantener las mismas relaciones interinstitucionales que el delegado principal.\n\n• Coordinación activa con servicios sociales locales.\n• Comunicación fluida con autoridades educativas y sanitarias.\n• Colaboración con fuerzas de seguridad especializadas.\n• Participación en comisiones interinstitucionales.\n• Mantenimiento de contactos profesionales especializados.\n• Representación de la entidad en reuniones sectoriales."
      }
    ]
  },
  8: {
    titulo: "Implementación Práctica",
    secciones: [
      {
        titulo: "Plan de Implementación para Suplentes",
        contenido: "El delegado suplente debe conocer todos los aspectos de implementación práctica del sistema de protección.\n\n• Participación activa en el diseño e implementación.\n• Conocimiento profundo de todas las fases del proceso.\n• Capacidad para liderar la implementación en ausencia del principal.\n• Evaluación continua del progreso de implementación.\n• Adaptación de estrategias según las necesidades detectadas.\n• Formación del personal en nuevos procedimientos."
      },
      {
        titulo: "Consolidación del Sistema como Suplente",
        contenido: "El delegado suplente contribuye activamente a la consolidación del sistema de protección, trabajando en coordinación estrecha con el delegado principal para garantizar la excelencia y sostenibilidad del sistema.\n\n• Fortalecimiento continuo de la cultura de protección.\n• Desarrollo de competencias especializadas del equipo.\n• Innovación en metodologías y herramientas.\n• Evaluación y mejora continua de procesos.\n• Sostenibilidad a largo plazo del sistema.\n• Liderazgo compartido en la excelencia protectora."
      }
    ]
  }
};

const pdfEspecificosSuplente = {
  1: {
    "marco-legal": {
      titulo: "Marco Legal LOPIVI para Delegados Suplentes en ENTORNO_EJEMPLO",
      contenido: "MARCO LEGAL LOPIVI PARA DELEGADOS SUPLENTES\n\nGUÍA ESPECIALIZADA CUSTODIA360\n\n═══════════════════════════════════════════════════════════════════\n📖 OBLIGACIONES ESPECÍFICAS COMO SUPLENTE\n═══════════════════════════════════════════════════════════════════\n\nComo ENTORNO_EJEMPLO que desarrolla ACTIVIDAD_EJEMPLO, usted como delegado suplente debe:\n\n• Tener la MISMA formación especializada que el delegado principal.\n• Estar preparado para asumir TODAS las funciones del principal.\n• Mantener coordinación constante con el delegado principal.\n• Conocer personalmente todos los casos en seguimiento.\n• Poder tomar decisiones autónomas con plena autoridad legal.\n• Supervisar ACTIVIDAD_EJEMPLO con la misma competencia.\n• Gestionar SITUACION_EJEMPLO apropiadamente.\n• Coordinar directamente con autoridades especializadas.\n• Formar a PROFESIONAL_EJEMPLO en FORMACION_ESPECIFICA.\n• Evaluar y gestionar RIESGOS_ESPECIFICOS.\n\n═══════════════════════════════════════════════════════════════════\n⚖️ RESPONSABILIDADES EN AUSENCIA DEL PRINCIPAL\n═══════════════════════════════════════════════════════════════════\n\nCuando sustituya al delegado principal:\n\n• Asumir TODAS las responsabilidades legales del principal.\n• Mantener la calidad de supervisión en ACTIVIDAD_EJEMPLO.\n• Gestionar emergencias en INSTALACIONES_EJEMPLO.\n• Coordinar con familias de PARTICIPANTES_EJEMPLO.\n• Supervisar directamente a PROFESIONAL_EJEMPLO.\n• Evaluar y gestionar RIESGOS_ESPECIFICOS autónomamente.\n• Mantener documentación actualizada según protocolos.\n• Coordinar con autoridades competentes.\n• Tomar decisiones críticas sobre ESPACIOS_PRIVADOS.\n• Supervisar CONTACTO_FISICO según normativa.\n• Implementar PREVENCION_ESPECIFICA.\n• Garantizar SUPERVISION_EJEMPLO apropiada.\n\n═══════════════════════════════════════════════════════════════════\n🚨 SITUACIONES DE EMERGENCIA\n═══════════════════════════════════════════════════════════════════\n\nEn situaciones críticas debe:\n\n• Evaluar inmediatamente el riesgo para PARTICIPANTES_EJEMPLO.\n• Activar protocolos de emergencia específicos.\n• Comunicar inmediatamente con autoridades.\n• Coordinar con servicios de emergencia.\n• Documentar exhaustivamente todas las actuaciones.\n• Informar al delegado principal lo antes posible.\n• Mantener la seguridad en INSTALACIONES_EJEMPLO.\n• Gestionar comunicación con familias.\n\n═══════════════════════════════════════════════════════════════════\n📞 COORDINACIÓN CON DELEGADO PRINCIPAL\n═══════════════════════════════════════════════════════════════════\n\n• Comunicación diaria sobre casos activos.\n• Participación en evaluaciones conjuntas.\n• Intercambio de información relevante.\n• Planificación conjunta de actuaciones.\n• Evaluación compartida de resultados.\n• Formación coordinada del personal.\n• Desarrollo conjunto de mejoras."
    },
    "competencias": {
      titulo: "Competencias Específicas del Delegado Suplente",
      contenido: "COMPETENCIAS ESPECÍFICAS DEL DELEGADO SUPLENTE\n\nMANUAL ESPECIALIZADO CUSTODIA360\n\n═══════════════════════════════════════════════════════════════════\n🎯 COMPETENCIAS DE COORDINACIÓN\n═══════════════════════════════════════════════════════════════════\n\n1. COMUNICACIÓN EFECTIVA:\n   • Comunicación fluida con el delegado principal.\n   • Intercambio regular de información sobre casos.\n   • Coordinación en la toma de decisiones.\n   • Comunicación clara con PROFESIONAL_EJEMPLO.\n   • Diálogo efectivo con familias de PARTICIPANTES_EJEMPLO.\n\n2. TRABAJO EN EQUIPO ESPECIALIZADO:\n   • Colaboración estrecha con el delegado principal.\n   • Integración en el equipo de protección.\n   • Apoyo mutuo en situaciones complejas.\n   • Coordinación con equipos multidisciplinares.\n   • Trabajo conjunto en evaluaciones.\n\n3. GESTIÓN DE INFORMACIÓN COMPARTIDA:\n   • Manejo de sistemas de documentación.\n   • Actualización de registros de casos.\n   • Intercambio seguro de información sensible.\n   • Coordinación de comunicaciones externas.\n   • Gestión de bases de datos compartidas.\n\n═══════════════════════════════════════════════════════════════════\n⚡ COMPETENCIAS DE SUSTITUCIÓN\n═══════════════════════════════════════════════════════════════════\n\n1. TOMA DE DECISIONES AUTÓNOMAS:\n   • Evaluación rápida de situaciones críticas.\n   • Decisiones inmediatas en emergencias.\n   • Autorización de medidas de protección.\n   • Gestión de recursos disponibles.\n   • Priorización de actuaciones urgentes.\n\n2. GESTIÓN DE CRISIS:\n   • Activación de protocolos de emergencia.\n   • Coordinación con servicios de emergencia.\n   • Gestión de situaciones en INSTALACIONES_EJEMPLO.\n   • Comunicación de crisis.\n   • Documentación de actuaciones de emergencia.\n\n3. LIDERAZGO DE EQUIPOS:\n   • Dirección de PROFESIONAL_EJEMPLO.\n   • Coordinación de actuaciones de equipo.\n   • Distribución de responsabilidades.\n   • Supervisión de implementación de medidas.\n   • Evaluación de desempeño del personal.\n\n═══════════════════════════════════════════════════════════════════\n📋 COMPETENCIAS TÉCNICAS ESPECIALIZADAS\n═══════════════════════════════════════════════════════════════════\n\n1. SUPERVISIÓN DE ACTIVIDAD_EJEMPLO:\n   • Conocimiento técnico de ACTIVIDAD_EJEMPLO.\n   • Evaluación de RIESGOS_ESPECIFICOS.\n   • Supervisión de CONTACTO_FISICO.\n   • Control de ESPACIOS_PRIVADOS.\n   • Implementación de PREVENCION_ESPECIFICA.\n\n2. FORMACIÓN DE PERSONAL:\n   • Capacitación de PROFESIONAL_EJEMPLO.\n   • Desarrollo de competencias protectoras.\n   • Evaluación de conocimientos.\n   • Supervisión de aplicación práctica.\n   • Actualización formativa continua.\n\n3. COORDINACIÓN EXTERNA:\n   • Comunicación con autoridades especializadas.\n   • Coordinación con servicios sociales.\n   • Relación con fuerzas de seguridad.\n   • Comunicación con servicios sanitarios.\n   • Coordinación con sistema educativo."
    }
  },
  2: {
    "indicadores-fisicos": {
      titulo: "Detección de Indicadores Físicos para Suplentes",
      contenido: "DETECCIÓN DE INDICADORES FÍSICOS - SUPLENTES\n\n═══════════════════════════════════════\n\nOBSERVACIÓN ESPECÍFICA EN ACTIVIDAD_EJEMPLO\n\nComo suplente, debe ser igual de competente en:\n• Evaluación del estado físico de PARTICIPANTES_EJEMPLO.\n• Detección de lesiones durante ACTIVIDAD_EJEMPLO.\n• Identificación de cambios en comportamiento físico.\n• Evaluación de CONTACTO_FISICO apropiado.\n• Supervisión en ESPACIOS_PRIVADOS.\n• Coordinación con PROFESIONAL_EJEMPLO.\n\n═══════════════════════════════════════\n\nPROTOCOLO DE DOCUMENTACIÓN\n\n• Registro inmediato de observaciones.\n• Comunicación con delegado principal.\n• Coordinación con autoridades si es necesario.\n• Seguimiento de evolución.\n• Documentación exhaustiva."
    }
  }
};

  // Función para generar PDF de un módulo completo
  const generarPDFModuloSuplente = (numeroModulo: number, usuario: Usuario | null) => {
    if (!usuario) return;

    const modulo = formacionDataSuplente[numeroModulo as keyof typeof formacionDataSuplente];
    const doc = new jsPDF();

    // Configuración inicial
    doc.setFont('helvetica');
    let yPos = 20;
    const margenIzq = 20;
    const anchoLinea = 170;

    // Título del documento
    doc.setFontSize(16);
    doc.setFont('helvetica', 'bold');
    doc.text('SU PROCESO DE FORMACIÓN CUSTODIA360 - SUPLENTE', margenIzq, yPos);
    yPos += 10;

    // Información del usuario
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text(`Usuario: ${usuario?.nombre || ''} | Entidad: ${usuario?.entidad || ''}`, margenIzq, yPos);
    doc.text(`Tipo: ${usuario?.tipoEntidad || ''} | Rol: Delegado Suplente | Fecha: ${new Date().toLocaleDateString()}`, margenIzq, yPos + 5);
    yPos += 20;

    // Título del módulo
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text(`MÓDULO ${numeroModulo}: ${modulo.titulo.toUpperCase()}`, margenIzq, yPos);
    yPos += 15;

    // Contenido de las secciones
    modulo.secciones.forEach((seccion, index) => {
      if (yPos > 250) {
        doc.addPage();
        yPos = 20;
      }

      // Título de la sección
      doc.setFontSize(11);
      doc.setFont('helvetica', 'bold');
      const tituloSeccion = doc.splitTextToSize(seccion.titulo, anchoLinea);
      doc.text(tituloSeccion, margenIzq, yPos);
      yPos += tituloSeccion.length * 5 + 5;

      // Contenido de la sección
      doc.setFontSize(9);
      doc.setFont('helvetica', 'normal');
      let contenidoPersonalizado = getContenidoPersonalizado(seccion.contenido, usuario?.tipoEntidad || 'deportivo');

      // Limpiar cualquier %P, %%P, % que pueda aparecer (limpieza exhaustiva)
      contenidoPersonalizado = contenidoPersonalizado
        .replace(/%P/g, '')
        .replace(/%%P/g, '')
        .replace(/%/g, '')
        .replace(/P%/g, '')
        .replace(/\bP\b(?![a-z])/g, '')
        .replace(/\s+/g, ' ')
        .trim();

      // Aplicar formateo para mejor legibilidad
      contenidoPersonalizado = formatearContenido(contenidoPersonalizado);

      const lineasContenido = doc.splitTextToSize(contenidoPersonalizado, anchoLinea);

      lineasContenido.forEach((linea: string) => {
        if (yPos > 280) {
          doc.addPage();
          yPos = 20;
        }
        doc.text(linea, margenIzq, yPos);
        yPos += 4;
      });

      yPos += 10;
    });

    // Pie de página
    const totalPages = doc.internal.pages.length - 1;
    for (let i = 1; i <= totalPages; i++) {
      doc.setPage(i);
      doc.setFontSize(8);
      doc.setFont('helvetica', 'normal');
      doc.text('Custodia360 - Sistema de Formación Integral para Suplentes', margenIzq, 290);
      doc.text(`Página ${i} de ${totalPages}`, 150, 290);
    }

    // Descargar
    doc.save(`Suplente_Modulo_${numeroModulo}_${modulo.titulo.replace(/\s+/g, '_')}.pdf`);
  };

  // Función para descargar todos los módulos
  const descargarTodosModulosSuplente = () => {
    const confirmacion = window.confirm('¿Deseas descargar todos los módulos para suplentes en PDF? Se generarán 8 archivos separados.');
    if (confirmacion) {
      Object.keys(formacionDataSuplente).forEach((numero, index) => {
        setTimeout(() => {
          generarPDFModuloSuplente(parseInt(numero), usuario);
        }, index * 1000);
      });
    }
  };

export default function FormacionSuplentePage() {
  const router = useRouter();
  const [usuario, setUsuario] = useState<Usuario | null>(null);
  const [loading, setLoading] = useState(true);
  const [moduloActual, setModuloActual] = useState(1);
  const [seccionActual, setSeccionActual] = useState(0);
  const [progreso, setProgreso] = useState(0);
  const [lecturaModulos, setLecturaModulos] = useState<{[key: number]: number}>({});
  const [scrollProgress, setScrollProgress] = useState<{[key: string]: number}>({});

  // Función para formatear contenido con separaciones apropiadas
  const formatearContenido = (contenido: string) => {
    return contenido
      // Agregar salto de línea después de puntos seguidos de mayúscula
      .replace(/\. ([A-Z])/g, '.\n\n$1')
      // Agregar salto de línea después de dos puntos seguidos de mayúscula
      .replace(/: ([A-Z][^•])/g, ':\n\n$1')
      // Mantener el formato de listas con viñetas
      .replace(/• /g, '\n• ')
      // Agregar espacio después de títulos con ===
      .replace(/===\n/g, '===\n\n')
      // Separar mejor las secciones numeradas
      .replace(/(\d+\. [A-Z][^:]*:)/g, '\n$1')
      // Limpiar espacios múltiples pero preservar saltos de línea intencionales
      .replace(/\n{3,}/g, '\n\n')
      .trim();
  };

  // Función para obtener contenido personalizado según tipo de entidad (igual que el principal)
  const getContenidoPersonalizado = (contenidoBase: string, tipoEntidad: string) => {
    const personalizaciones: { [key: string]: { [key: string]: string } } = {
      deportivo: {
        'ENTORNO_EJEMPLO': 'club deportivo',
        'ACTIVIDAD_EJEMPLO': 'entrenamientos y competiciones deportivas',
        'PROFESIONAL_EJEMPLO': 'entrenador',
        'SITUACION_EJEMPLO': 'vestuarios, duchas y desplazamientos a competiciones',
        'INSTALACIONES_EJEMPLO': 'gimnasios, pistas deportivas y vestuarios',
        'PARTICIPANTES_EJEMPLO': 'deportistas jóvenes y equipos',
        'RIESGOS_ESPECIFICOS': 'contacto físico durante entrenamientos, situaciones en vestuarios, viajes para competiciones',
        'SUPERVISION_EJEMPLO': 'durante entrenamientos, en vestuarios y en competiciones',
        'CONTACTO_FISICO': 'correcciones técnicas, primeros auxilios deportivos, apoyo en ejercicios',
        'ESPACIOS_PRIVADOS': 'vestuarios, salas de fisioterapia, oficinas de entrenadores',
        'PREVENCION_ESPECIFICA': 'política de puertas abiertas en vestuarios, supervisión cruzada entre entrenadores',
        'FORMACION_ESPECIFICA': 'detección de abuso en contexto deportivo, límites apropiados en entrenamiento'
      },
      educativo: {
        'ENTORNO_EJEMPLO': 'centro educativo',
        'ACTIVIDAD_EJEMPLO': 'clases lectivas y actividades extraescolares',
        'PROFESIONAL_EJEMPLO': 'profesor',
        'SITUACION_EJEMPLO': 'aulas, pasillos y actividades extraescolares',
        'INSTALACIONES_EJEMPLO': 'aulas, laboratorios y espacios educativos',
        'PARTICIPANTES_EJEMPLO': 'alumnos y estudiantes',
        'RIESGOS_ESPECIFICOS': 'tutorías individuales, actividades extraescolares, uso de tecnología educativa',
        'SUPERVISION_EJEMPLO': 'durante clases, en recreos y en actividades extraescolares',
        'CONTACTO_FISICO': 'apoyo en actividades físicas educativas, primeros auxilios escolares',
        'ESPACIOS_PRIVADOS': 'despachos de tutorías, salas de profesores, almacenes',
        'PREVENCION_ESPECIFICA': 'política de puertas abiertas en tutorías, supervisión en actividades extraescolares',
        'FORMACION_ESPECIFICA': 'detección de acoso escolar, protocolos educativos de protección'
      },
      religioso: {
        'ENTORNO_EJEMPLO': 'comunidad religiosa',
        'ACTIVIDAD_EJEMPLO': 'catequesis, actividades pastorales y grupos juveniles',
        'PROFESIONAL_EJEMPLO': 'catequista',
        'SITUACION_EJEMPLO': 'sacristías, salones parroquiales y actividades religiosas',
        'INSTALACIONES_EJEMPLO': 'iglesias, salones parroquiales y espacios de catequesis',
        'PARTICIPANTES_EJEMPLO': 'niños en catequesis y jóvenes en grupos pastorales',
        'RIESGOS_ESPECIFICOS': 'actividades en sacristías, campamentos religiosos, confesiones con menores',
        'SUPERVISION_EJEMPLO': 'durante catequesis, en actividades parroquiales y campamentos',
        'CONTACTO_FISICO': 'saludos religiosos apropiados, apoyo en actividades comunitarias',
        'ESPACIOS_PRIVADOS': 'sacristías, despachos parroquiales, salas de reuniones',
        'PREVENCION_ESPECIFICA': 'política de puertas abiertas en encuentros individuales, supervisión en campamentos',
        'FORMACION_ESPECIFICA': 'ética pastoral en protección infantil, límites apropiados en ministerio'
      },
      ocio: {
        'ENTORNO_EJEMPLO': 'centro de ocio y tiempo libre',
        'ACTIVIDAD_EJEMPLO': 'juegos, talleres recreativos y actividades de tiempo libre',
        'PROFESIONAL_EJEMPLO': 'monitor de ocio',
        'SITUACION_EJEMPLO': 'cabañas, zonas de actividades y espacios recreativos',
        'INSTALACIONES_EJEMPLO': 'centros de día, campamentos y ludotecas',
        'PARTICIPANTES_EJEMPLO': 'niños y adolescentes en actividades recreativas',
        'RIESGOS_ESPECIFICOS': 'actividades nocturnas en campamentos, juegos de contacto, excursiones',
        'SUPERVISION_EJEMPLO': 'durante actividades recreativas, en dormitorios de campamentos y excursiones',
        'CONTACTO_FISICO': 'juegos recreativos apropiados, primeros auxilios en actividades',
        'ESPACIOS_PRIVADOS': 'cabañas, enfermería de campamento, almacenes de material',
        'PREVENCION_ESPECIFICA': 'supervisión constante en dormitorios, protocolos para actividades nocturnas',
        'FORMACION_ESPECIFICA': 'dinámicas de protección en ocio, gestión de grupos en tiempo libre'
      }
    };

    let contenidoPersonalizado = contenidoBase;
    const personalizacion = personalizaciones[tipoEntidad] || personalizaciones['deportivo'];

    Object.entries(personalizacion).forEach(([placeholder, replacement]) => {
      const regex = new RegExp(placeholder, 'g');
      contenidoPersonalizado = contenidoPersonalizado.replace(regex, replacement);
    });

    return contenidoPersonalizado;
  };

  // Función para generar PDF específico (igual que el principal)
  const generarPDFEspecificoSuplente = (numeroModulo: number, tipoPDF: string, usuario: Usuario | null) => {
    if (!usuario) return;

    try {
      const pdfData = pdfEspecificosSuplente[numeroModulo as keyof typeof pdfEspecificosSuplente][tipoPDF];

      if (!pdfData) {
        alert('PDF no encontrado');
        return;
      }

      const doc = new jsPDF();

      // Configuración inicial
      doc.setFont('helvetica');
      let yPos = 20;
      const margenIzq = 20;
      const margenDer = 20;
      const anchoLinea = 210 - margenIzq - margenDer;

      // Encabezado
      doc.setFillColor(37, 99, 235);
      doc.rect(0, 0, 210, 30, 'F');

      doc.setTextColor(255, 255, 255);
      doc.setFontSize(14);
      doc.setFont('helvetica', 'bold');
      doc.text('CUSTODIA360 - FORMACIÓN SUPLENTE', margenIzq, 15);

      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');
      doc.text(`Módulo ${numeroModulo} | ${new Date().toLocaleDateString('es-ES')}`, margenIzq, 22);

      yPos = 40;

      // Título del PDF
      doc.setTextColor(0, 0, 0);
      doc.setFontSize(12);
      doc.setFont('helvetica', 'bold');
      const tituloLineas = doc.splitTextToSize(pdfData.titulo, anchoLinea);

      tituloLineas.forEach((linea: string) => {
        doc.text(linea, margenIzq, yPos);
        yPos += 7;
      });

      yPos += 5;

      // Información del usuario
      doc.setDrawColor(200, 200, 200);
      doc.setFillColor(248, 250, 252);
      doc.roundedRect(margenIzq, yPos, anchoLinea, 20, 2, 2, 'FD');

      doc.setTextColor(0, 0, 0);
      doc.setFontSize(9);
      doc.setFont('helvetica', 'normal');
      doc.text(`Usuario: ${usuario?.nombre || 'N/A'} | Entidad: ${usuario?.entidad || 'N/A'}`, margenIzq + 5, yPos + 7);
      doc.text(`Tipo: ${usuario?.tipoEntidad || 'N/A'} | Delegado Suplente | Generado: ${new Date().toLocaleDateString('es-ES')}`, margenIzq + 5, yPos + 14);

      yPos += 30;

      // Contenido del PDF
      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(0, 0, 0);

      let contenidoPersonalizado = getContenidoPersonalizado(pdfData.contenido, usuario?.tipoEntidad || 'deportivo');

      // Limpiar cualquier %P, %%P, % que pueda aparecer (limpieza exhaustiva)
      contenidoPersonalizado = contenidoPersonalizado
        .replace(/%P/g, '')
        .replace(/%%P/g, '')
        .replace(/%/g, '')
        .replace(/P%/g, '')
        .replace(/\bP\b(?![a-z])/g, '')
        .replace(/\s+/g, ' ')
        .trim();

      // Aplicar formateo para mejor legibilidad
      contenidoPersonalizado = formatearContenido(contenidoPersonalizado);

      const lineasContenido = doc.splitTextToSize(contenidoPersonalizado, anchoLinea);

      lineasContenido.forEach((linea: string) => {
        if (yPos > 270) {
          doc.addPage();
          yPos = 20;
        }

        if (linea.includes('═══') || linea.includes('🚨') || linea.includes('📋')) {
          doc.setFont('helvetica', 'bold');
          doc.setTextColor(37, 99, 235);
        } else if (linea.startsWith('PASO ') || linea.startsWith('FASE ')) {
          doc.setFont('helvetica', 'bold');
          doc.setTextColor(0, 0, 0);
        } else {
          doc.setFont('helvetica', 'normal');
          doc.setTextColor(0, 0, 0);
        }

        doc.text(linea, margenIzq, yPos);
        yPos += 4;
      });

      // Footer
      const totalPages = doc.internal.pages.length - 1;
      for (let i = 1; i <= totalPages; i++) {
        doc.setPage(i);

        doc.setDrawColor(37, 99, 235);
        doc.line(margenIzq, 285, 210 - margenDer, 285);

        doc.setFontSize(8);
        doc.setFont('helvetica', 'normal');
        doc.setTextColor(100, 100, 100);
        doc.text('Custodia360 - Formación Especializada para Delegados Suplentes', margenIzq, 292);
        doc.text(`Página ${i} de ${totalPages}`, 180, 292);
      }

      const nombreArchivo = `Custodia360_Suplente_Modulo${numeroModulo}_${tipoPDF.replace(/-/g, '_')}.pdf`;
      doc.save(nombreArchivo);
    } catch (error) {
      console.error('Error generando PDF:', error);
      alert('Error al generar el PDF. Por favor, inténtelo de nuevo.');
    }
  };

  // Sistema de tracking de lectura basado en scroll
  useEffect(() => {
    const handleScroll = () => {
      const contenedor = document.querySelector('.contenido-modulo');
      if (!contenedor) return;

      const rect = contenedor.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      const contenidoHeight = contenedor.scrollHeight;
      const contenedorTop = contenedor.offsetTop;
      const scrollPosition = window.pageYOffset + windowHeight;
      const contenedorBottom = contenedorTop + contenidoHeight;

      // Verificar si hemos llegado al final del contenido (con un margen de 200px para ser mucho más flexible)
      const hasReachedEnd = scrollPosition >= (contenedorBottom - 200);

      // Calcular porcentaje basado en scroll
      let porcentajeScroll = 0;
      if (hasReachedEnd) {
        porcentajeScroll = 100;
      } else {
        const scrollFromTop = Math.max(0, window.pageYOffset - contenedorTop + windowHeight);
        porcentajeScroll = Math.min(99, Math.max(0, (scrollFromTop / contenidoHeight) * 100));
      }

      const claveSeccion = `${moduloActual}-${seccionActual}`;
      setScrollProgress(prev => ({
        ...prev,
        [claveSeccion]: porcentajeScroll
      }));

      // Actualizar también lecturaModulos para compatibilidad
      setLecturaModulos(prev => ({
        ...prev,
        [claveSeccion]: porcentajeScroll
      }));
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Llamar una vez al montar

    return () => window.removeEventListener('scroll', handleScroll);
  }, [moduloActual, seccionActual]);

  // Reiniciar progreso al cambiar de sección
  useEffect(() => {
    const claveSeccion = `${moduloActual}-${seccionActual}`;
    if (!scrollProgress[claveSeccion]) {
      setScrollProgress(prev => ({
        ...prev,
        [claveSeccion]: 0
      }));
    }
  }, [moduloActual, seccionActual, scrollProgress]);

  useEffect(() => {
    // Calcular progreso total
    const totalSecciones = Object.values(formacionDataSuplente).reduce((total, modulo) => {
      return total + modulo.secciones.length;
    }, 0);

    let seccionesCompletadas = 0;
    for (let i = 1; i < moduloActual; i++) {
      seccionesCompletadas += formacionDataSuplente[i as keyof typeof formacionDataSuplente].secciones.length;
    }
    seccionesCompletadas += seccionActual;

    const porcentajeProgreso = Math.round((seccionesCompletadas / totalSecciones) * 100);
    setProgreso(porcentajeProgreso);
  }, [moduloActual, seccionActual]);

  const avanzarSeccion = () => {
    // Marcar la sección actual como completada antes de avanzar
    const claveSeccion = `${moduloActual}-${seccionActual}`;
    setScrollProgress(prev => ({
      ...prev,
      [claveSeccion]: 100
    }));

    const moduloActualData = formacionDataSuplente[moduloActual as keyof typeof formacionDataSuplente];
    if (seccionActual < moduloActualData.secciones.length - 1) {
      setSeccionActual(seccionActual + 1);
    } else if (moduloActual < 8) {
      setModuloActual(moduloActual + 1);
      setSeccionActual(0);
    }
  };

  const retrocederSeccion = () => {
    if (seccionActual > 0) {
      setSeccionActual(seccionActual - 1);
    } else if (moduloActual > 1) {
      setModuloActual(moduloActual - 1);
      const moduloAnterior = formacionDataSuplente[(moduloActual - 1) as keyof typeof formacionDataSuplente];
      setSeccionActual(moduloAnterior.secciones.length - 1);
    }
  };

  useEffect(() => {
    const userSession = localStorage.getItem('userSession');
    if (userSession) {
      try {
        const userData = JSON.parse(userSession);

        if (userData.expiracion && new Date(userData.expiracion) <= new Date()) {
          localStorage.removeItem('userSession');
          router.push('/login-delegados');
          return;
        }

        if (userData.tipo !== 'suplente') {
          router.push('/formacion-delegado');
          return;
        }

        setUsuario(userData);

        if (!userData.tipoEntidad) {
          userData.tipoEntidad = 'deportivo'
          localStorage.setItem('userSession', JSON.stringify(userData))
        }
      } catch (error) {
        console.error('Error loading session:', error);
        router.push('/login-delegados');
        return;
      }
    } else {
      router.push('/login-delegados');
      return;
    }
    setLoading(false);
  }, [router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-[#2563EB]"></div>
          <p className="mt-4 text-gray-600">Cargando formación...</p>
        </div>
      </div>
    );
  }

  if (!usuario) {
    return null;
  }

  const moduloActualData = formacionDataSuplente[moduloActual as keyof typeof formacionDataSuplente];
  const seccionActualData = moduloActualData.secciones[seccionActual];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Su proceso de formación Custodia360 - Suplente
              </h1>
              <p className="text-gray-600 mt-1">
                Usuario: {usuario.email} | Entidad: {usuario.tipoEntidad || 'No especificada'} | Rol: Delegado Suplente
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <FormacionProgressBar progreso={progreso} />

      {/* Content */}
      <div className="max-w-4xl mx-auto p-6">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          {/* Module Header */}
          <div className="bg-[#2563EB] text-white p-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold">
                  Módulo {moduloActual}: {moduloActualData.titulo}
                </h2>
                <p className="text-blue-100 mt-1">
                  Sección {seccionActual + 1} de {moduloActualData.secciones.length}
                </p>
              </div>
              <div className="text-right">
                <p className="text-sm text-blue-100">Progreso general</p>
                <p className="text-2xl font-bold">{progreso}%</p>
              </div>
            </div>
          </div>

          {/* Section Content */}
          <div className="p-6">
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-xl font-semibold text-gray-900">
                {seccionActualData.titulo}
              </h3>
              <div className="flex flex-col space-y-2">
                <div className="text-xs text-gray-600 text-right mb-1">PDFs Especializados Disponibles:</div>
                <div className="flex flex-wrap gap-2 justify-end">
                  {pdfEspecificosSuplente[moduloActual as keyof typeof pdfEspecificosSuplente] &&
                    Object.entries(pdfEspecificosSuplente[moduloActual as keyof typeof pdfEspecificosSuplente]).map(([tipoPDF, data]) => (
                      <button
                        key={tipoPDF}
                        onClick={() => generarPDFEspecificoSuplente(moduloActual, tipoPDF, usuario)}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-xs font-medium transition-colors"
                        title={data.titulo}
                      >
                        {tipoPDF.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                      </button>
                    ))
                  }
                </div>
              </div>
            </div>
            <div className="prose max-w-none contenido-modulo">
              <div className="whitespace-pre-line text-gray-700 leading-relaxed">
                {formatearContenido(getContenidoPersonalizado(seccionActualData.contenido, usuario?.tipoEntidad || 'deportivo'))}
              </div>
            </div>
          </div>

          {/* Navigation */}
          <div className="bg-gray-50 px-6 py-4 flex justify-between items-center">
            <button
              onClick={retrocederSeccion}
              disabled={moduloActual === 1 && seccionActual === 0}
              className="bg-gray-500 hover:bg-gray-600 disabled:bg-gray-300 disabled:cursor-not-allowed text-white px-6 py-2 rounded-lg transition-colors"
            >
              Anterior
            </button>

            <div className="text-sm text-gray-600">
              {Object.keys(formacionDataSuplente).map((mod) => (
                <span
                  key={mod}
                  className={`inline-block w-3 h-3 rounded-full mx-1 ${
                    parseInt(mod) < moduloActual
                      ? 'bg-green-500'
                      : parseInt(mod) === moduloActual
                      ? 'bg-[#2563EB]'
                      : 'bg-gray-300'
                  }`}
                />
              ))}
            </div>

            {moduloActual === 8 && seccionActual === moduloActualData.secciones.length - 1 ? (
              <button
                onClick={() => router.push('/test-evaluacion')}
                className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg transition-colors"
              >
                Ir al Test de Evaluación
              </button>
            ) : (
              <button
                onClick={avanzarSeccion}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-colors"
              >
                Siguiente
              </button>
            )}
          </div>
        </div>

        {/* Module Summary */}
        <div className="mt-6 bg-white rounded-lg shadow p-6">
          <h4 className="font-semibold text-gray-900 mb-3">Contenido del módulo:</h4>
          <div className="grid gap-2">
            {moduloActualData.secciones.map((seccion, index) => (
              <div
                key={index}
                onClick={() => setSeccionActual(index)}
                className={`p-3 rounded cursor-pointer transition-colors ${
                  index === seccionActual
                    ? 'bg-[#2563EB] text-white'
                    : index < seccionActual
                    ? 'bg-blue-100 text-blue-800 hover:bg-blue-200'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <div className="flex items-center">
                  <span className="text-sm font-medium">
                    {index + 1}. {seccion.titulo}
                  </span>
                  {index < seccionActual && (
                    <span className="ml-auto">Completado</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Panel de PDFs Mejorado para Suplentes */}
        <div className="mt-6 bg-gradient-to-r from-blue-50 to-green-50 rounded-lg shadow p-6 border border-blue-200">
          <div className="mb-4">
            <h4 className="font-semibold text-blue-900 mb-3 flex items-center">
              Sistema de Descarga de Documentos Especializados para Suplentes
            </h4>
            <div className="text-sm text-blue-800 space-y-1">
              <p><strong>PDFs Especializados:</strong> Contenido específico para delegados suplentes</p>
              <p><strong>Contenido Personalizado:</strong> Adaptado a tu tipo de entidad ({usuario?.tipoEntidad})</p>
              <p><strong>Enfoque Suplente:</strong> Énfasis en coordinación y sustitución temporal</p>
            </div>
          </div>

          {/* PDFs del Módulo Actual */}
          <div className="mb-6">
            <h5 className="font-medium text-gray-900 mb-3">Módulo {moduloActual}: Documentos para Suplentes</h5>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {pdfEspecificosSuplente[moduloActual as keyof typeof pdfEspecificosSuplente] &&
                Object.entries(pdfEspecificosSuplente[moduloActual as keyof typeof pdfEspecificosSuplente]).map(([tipoPDF, data]) => (
                  <button
                    key={tipoPDF}
                    onClick={() => generarPDFEspecificoSuplente(moduloActual, tipoPDF, usuario)}
                    className="bg-white border border-blue-300 hover:border-blue-500 hover:bg-blue-50 px-4 py-3 rounded-lg text-sm transition-all duration-200 text-left shadow-sm"
                    title={data.titulo}
                  >
                    <div className="font-medium text-blue-900 text-xs mb-1">
                      {tipoPDF.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                    </div>
                    <div className="text-xs text-gray-600 line-clamp-2">
                      {data.titulo}
                    </div>
                  </button>
                ))
              }
            </div>
          </div>

          {/* Acciones Generales */}
          <div className="flex flex-wrap gap-3 justify-center">
            <button
              onClick={() => generarPDFModuloSuplente(moduloActual, usuario)}
              className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg text-sm font-medium transition-colors"
            >
              Módulo Completo para Suplentes
            </button>
            <button
              onClick={descargarTodosModulosSuplente}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg text-sm font-medium transition-colors"
            >
              Todos los Módulos de Suplente
            </button>
            <button
              onClick={() => {
                const confirmacion = window.confirm('¿Deseas descargar TODOS los PDFs especializados para suplentes? Se generarán múltiples archivos organizados por módulo.');
                if (confirmacion) {
                  Object.keys(pdfEspecificosSuplente).forEach(modulo => {
                    Object.keys(pdfEspecificosSuplente[parseInt(modulo) as keyof typeof pdfEspecificosSuplente]).forEach((tipoPDF, index) => {
                      setTimeout(() => {
                        generarPDFEspecificoSuplente(parseInt(modulo), tipoPDF, usuario);
                      }, index * 1000);
                    });
                  });
                }
              }}
              className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded-lg text-sm font-medium transition-colors"
            >
              Biblioteca Completa para Suplentes
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
