import jsPDF from 'jspdf'
import 'jspdf-autotable'

// Tipos para el sistema de documentos
export interface EntidadData {
  nombre: string
  cif: string
  tipo: string
  direccion: string
  telefono: string
  email: string
  numeroMenores: string
  actividades: string[]
  delegado: {
    nombre: string
    dni: string
    email: string
    telefono: string
    cargo: string
  }
  suplente?: {
    nombre: string
    dni: string
    email: string
  }
}

export interface DocumentoLOPIVI {
  id: string
  tipo: 'plan-proteccion' | 'nombramiento-delegado' | 'certificado-formacion' | 'protocolos' | 'codigo-conducta'
  nombre: string
  contenido: string
  fechaGeneracion: Date
  version: string
  entidadId: string
}

// Plantillas base por tipo de entidad
const PLANTILLAS_ENTIDAD = {
  'club-deportivo': {
    riesgos: ['Vestuarios', 'Viajes deportivos', 'Entrenamientos', 'Competiciones', 'Concentraciones'],
    protocolos: ['Protocolo vestuarios', 'Protocolo viajes', 'Protocolo lesiones', 'Protocolo competición'],
    actividades: ['Entrenamientos regulares', 'Partidos oficiales', 'Torneos', 'Campus deportivos']
  },
  'centro-educativo': {
    riesgos: ['Aulas', 'Patios', 'Baños', 'Excursiones', 'Actividades extraescolares'],
    protocolos: ['Protocolo aula', 'Protocolo excursiones', 'Protocolo acoso', 'Protocolo emergencias'],
    actividades: ['Clases lectivas', 'Recreos', 'Actividades extraescolares', 'Excursiones']
  },
  'parroquia': {
    riesgos: ['Catequesis', 'Campamentos', 'Grupo juvenil', 'Actividades pastorales'],
    protocolos: ['Protocolo catequesis', 'Protocolo campamentos', 'Protocolo pastoral', 'Protocolo sacramentos'],
    actividades: ['Catequesis infantil', 'Grupos juveniles', 'Campamentos', 'Celebraciones']
  },
  'guarderia': {
    riesgos: ['Cambio pañales', 'Hora de comida', 'Siesta', 'Juego libre', 'Entrada/salida'],
    protocolos: ['Protocolo higiene', 'Protocolo alimentación', 'Protocolo descanso', 'Protocolo familias'],
    actividades: ['Cuidado infantil', 'Actividades lúdicas', 'Alimentación', 'Descanso']
  }
}

// Generador principal de documentos
export class DocumentGenerator {

  // 1. PLAN DE PROTECCIÓN INFANTIL (Documento principal)
  async generarPlanProteccion(entidad: EntidadData): Promise<string> {
    const doc = new jsPDF()
    const plantilla = this.obtenerPlantillaEntidad(entidad.tipo)

    // PORTADA
    this.generarPortadaPlan(doc, entidad)

    // ÍNDICE
    doc.addPage()
    this.generarIndicePlan(doc)

    // 1. DATOS DE LA ENTIDAD
    doc.addPage()
    this.generarSeccionDatosEntidad(doc, entidad)

    // 2. DELEGADO DE PROTECCIÓN
    doc.addPage()
    this.generarSeccionDelegado(doc, entidad.delegado, entidad.suplente)

    // 3. EVALUACIÓN DE RIESGOS
    doc.addPage()
    this.generarSeccionRiesgos(doc, plantilla.riesgos, entidad.tipo)

    // 4. PROTOCOLOS DE ACTUACIÓN
    doc.addPage()
    this.generarSeccionProtocolos(doc, plantilla.protocolos)

    // 5. CÓDIGO DE CONDUCTA
    doc.addPage()
    this.generarSeccionCodigoConducta(doc, entidad.tipo)

    // 6. FORMACIÓN DEL PERSONAL
    doc.addPage()
    this.generarSeccionFormacion(doc)

    // 7. COMUNICACIÓN Y DENUNCIAS
    doc.addPage()
    this.generarSeccionComunicacion(doc, entidad)

    // 8. SEGUIMIENTO Y REVISIÓN
    doc.addPage()
    this.generarSeccionSeguimiento(doc)

    return doc.output('datauristring')
  }

  // 2. NOMBRAMIENTO DELEGADO
  async generarNombramientoDelegado(entidad: EntidadData): Promise<string> {
    const doc = new jsPDF()

    // Header oficial
    doc.setFontSize(18)
    doc.setFont(undefined, 'bold')
    doc.text('RESOLUCIÓN DE NOMBRAMIENTO', 105, 30, { align: 'center' })
    doc.text('DELEGADO/A DE PROTECCIÓN', 105, 40, { align: 'center' })

    doc.setFontSize(12)
    doc.setFont(undefined, 'normal')

    // Datos de la resolución
    const fecha = new Date().toLocaleDateString('es-ES')
    doc.text(`Fecha: ${fecha}`, 20, 60)
    doc.text(`Resolución Nº: DEL-${entidad.cif}-${Date.now()}`, 20, 70)

    // Cuerpo de la resolución
    const texto = `
En cumplimiento de la Ley Orgánica 8/2021, de 4 de junio, de protección integral a la infancia
y la adolescencia frente a la violencia (LOPIVI), y en ejercicio de las competencias que me confiere
el cargo de responsable de ${entidad.nombre}, con CIF ${entidad.cif},

RESUELVO:

PRIMERO.- Nombrar como DELEGADO/A DE PROTECCIÓN de esta entidad a:

    Nombre: ${entidad.delegado.nombre}
    DNI: ${entidad.delegado.dni}
    Cargo en la entidad: ${entidad.delegado.cargo}
    Email: ${entidad.delegado.email}
    Teléfono: ${entidad.delegado.telefono}

SEGUNDO.- Las funciones del Delegado/a de Protección incluyen:
    - Promover medidas de protección y bienestar de menores
    - Coordinar casos de riesgo y situaciones de desprotección
    - Comunicarse con familias, menores y autoridades competentes
    - Supervisar el cumplimiento del Plan de Protección
    - Formar al personal en materia de protección infantil

TERCERO.- La presente resolución tendrá efectos desde ${fecha} y permanecerá
vigente hasta nueva resolución o cese en las funciones.`

    const lineas = texto.split('\n')
    let y = 90
    lineas.forEach(linea => {
      if (linea.trim()) {
        doc.text(linea.trim(), 20, y)
        y += 7
      } else {
        y += 3
      }
    })

    // Firma
    doc.text('Firmado digitalmente por Custodia360', 20, y + 20)
    doc.text(`Código de verificación: VER-${Date.now()}`, 20, y + 30)

    return doc.output('datauristring')
  }

  // 3. CERTIFICADO DE FORMACIÓN
  async generarCertificadoFormacion(delegado: any, entidad: EntidadData): Promise<string> {
    const doc = new jsPDF('landscape') // Apaisado para certificado

    // Marco decorativo
    doc.setLineWidth(3)
    doc.rect(10, 10, 277, 190)
    doc.setLineWidth(1)
    doc.rect(15, 15, 267, 180)

    // Header
    doc.setFontSize(24)
    doc.setFont(undefined, 'bold')
    doc.text('CERTIFICADO DE FORMACIÓN LOPIVI', 148.5, 40, { align: 'center' })

    doc.setFontSize(16)
    doc.setFont(undefined, 'normal')
    doc.text('PROTECCIÓN INTEGRAL A LA INFANCIA Y ADOLESCENCIA', 148.5, 55, { align: 'center' })

    // Contenido principal
    doc.setFontSize(14)
    const fechaCertificacion = new Date().toLocaleDateString('es-ES')
    const numeroCertificado = `CERT-${entidad.cif}-${Date.now()}`

    const textoCertificado = `
Se certifica que:

${delegado.nombre}
con DNI ${delegado.dni}

Ha completado satisfactoriamente la formación especializada en Protección Integral
a la Infancia y Adolescencia frente a la Violencia (LOPIVI) con una duración de 20 horas,
habiendo obtenido la certificación necesaria para ejercer como:

DELEGADO/A DE PROTECCIÓN

en la entidad: ${entidad.nombre}

Fecha de certificación: ${fechaCertificacion}
Número de certificado: ${numeroCertificado}
Puntuación obtenida: 97/100 puntos`

    const lineas = textoCertificado.split('\n')
    let y = 80
    lineas.forEach(linea => {
      if (linea.includes(delegado.nombre)) {
        doc.setFontSize(18)
        doc.setFont(undefined, 'bold')
        doc.text(linea.trim(), 148.5, y, { align: 'center' })
        doc.setFontSize(14)
        doc.setFont(undefined, 'normal')
      } else if (linea.includes('DELEGADO/A DE PROTECCIÓN')) {
        doc.setFontSize(16)
        doc.setFont(undefined, 'bold')
        doc.text(linea.trim(), 148.5, y, { align: 'center' })
        doc.setFontSize(14)
        doc.setFont(undefined, 'normal')
      } else {
        doc.text(linea.trim(), 148.5, y, { align: 'center' })
      }
      y += 8
    })

    // Footer
    doc.text('Válido para acreditar formación LOPIVI ante inspecciones', 148.5, 170, { align: 'center' })
    doc.text('Custodia360 - Sistema Automatizado de Cumplimiento LOPIVI', 148.5, 180, { align: 'center' })

    return doc.output('datauristring')
  }

  // Métodos auxiliares para generar secciones
  private generarPortadaPlan(doc: jsPDF, entidad: EntidadData) {
    doc.setFontSize(24)
    doc.setFont(undefined, 'bold')
    doc.text('PLAN DE PROTECCIÓN INFANTIL', 105, 60, { align: 'center' })

    doc.setFontSize(18)
    doc.text(entidad.nombre, 105, 80, { align: 'center' })

    doc.setFontSize(14)
    doc.setFont(undefined, 'normal')
    doc.text(`CIF: ${entidad.cif}`, 105, 100, { align: 'center' })
    doc.text(`Tipo de entidad: ${entidad.tipo}`, 105, 110, { align: 'center' })

    const fecha = new Date().toLocaleDateString('es-ES')
    doc.text(`Fecha de elaboración: ${fecha}`, 105, 130, { align: 'center' })
    doc.text('Versión: 1.0', 105, 140, { align: 'center' })

    doc.text('Elaborado por Custodia360', 105, 200, { align: 'center' })
    doc.text('Sistema Automatizado de Cumplimiento LOPIVI', 105, 210, { align: 'center' })
  }

  private generarIndicePlan(doc: jsPDF) {
    doc.setFontSize(18)
    doc.setFont(undefined, 'bold')
    doc.text('ÍNDICE', 20, 30)

    doc.setFontSize(12)
    doc.setFont(undefined, 'normal')

    const indice = [
      '1. Datos de la Entidad ............................................. 3',
      '2. Delegado de Protección ........................................ 4',
      '3. Evaluación de Riesgos .......................................... 5',
      '4. Protocolos de Actuación ........................................ 6',
      '5. Código de Conducta ............................................. 7',
      '6. Formación del Personal ......................................... 8',
      '7. Comunicación y Denuncias ....................................... 9',
      '8. Seguimiento y Revisión ......................................... 10'
    ]

    let y = 50
    indice.forEach(linea => {
      doc.text(linea, 20, y)
      y += 10
    })
  }

  private generarSeccionDatosEntidad(doc: jsPDF, entidad: EntidadData) {
    doc.setFontSize(16)
    doc.setFont(undefined, 'bold')
    doc.text('1. DATOS DE LA ENTIDAD', 20, 30)

    doc.setFontSize(12)
    doc.setFont(undefined, 'normal')

    const datos = [
      `Denominación: ${entidad.nombre}`,
      `CIF: ${entidad.cif}`,
      `Tipo de entidad: ${entidad.tipo}`,
      `Dirección: ${entidad.direccion}`,
      `Teléfono: ${entidad.telefono}`,
      `Email: ${entidad.email}`,
      `Número aproximado de menores: ${entidad.numeroMenores}`,
      '',
      'ACTIVIDADES PRINCIPALES:',
      ...entidad.actividades.map(act => `• ${act}`)
    ]

    let y = 50
    datos.forEach(linea => {
      if (linea.includes('ACTIVIDADES')) {
        doc.setFont(undefined, 'bold')
      }
      doc.text(linea, 20, y)
      doc.setFont(undefined, 'normal')
      y += 8
    })
  }

  private generarSeccionDelegado(doc: jsPDF, delegado: any, suplente?: any) {
    doc.setFontSize(16)
    doc.setFont(undefined, 'bold')
    doc.text('2. DELEGADO DE PROTECCIÓN', 20, 30)

    doc.setFontSize(12)
    doc.setFont(undefined, 'normal')

    let y = 50

    // Delegado principal
    doc.setFont(undefined, 'bold')
    doc.text('DELEGADO PRINCIPAL:', 20, y)
    y += 10
    doc.setFont(undefined, 'normal')

    const datosDelegado = [
      `Nombre: ${delegado.nombre}`,
      `DNI: ${delegado.dni}`,
      `Cargo: ${delegado.cargo}`,
      `Email: ${delegado.email}`,
      `Teléfono: ${delegado.telefono}`
    ]

    datosDelegado.forEach(dato => {
      doc.text(dato, 20, y)
      y += 8
    })

    // Suplente si existe
    if (suplente) {
      y += 10
      doc.setFont(undefined, 'bold')
      doc.text('DELEGADO SUPLENTE:', 20, y)
      y += 10
      doc.setFont(undefined, 'normal')

      const datosSuplente = [
        `Nombre: ${suplente.nombre}`,
        `DNI: ${suplente.dni}`,
        `Email: ${suplente.email}`
      ]

      datosSuplente.forEach(dato => {
        doc.text(dato, 20, y)
        y += 8
      })
    }
  }

  private generarSeccionRiesgos(doc: jsPDF, riesgos: string[], tipoEntidad: string) {
    doc.setFontSize(16)
    doc.setFont(undefined, 'bold')
    doc.text('3. EVALUACIÓN DE RIESGOS', 20, 30)

    doc.setFontSize(12)
    doc.setFont(undefined, 'normal')

    let y = 50

    doc.text('Los principales espacios y situaciones de riesgo identificados son:', 20, y)
    y += 15

    riesgos.forEach(riesgo => {
      doc.text(`• ${riesgo}`, 25, y)
      y += 8
    })

    y += 10
    doc.text('Para cada uno de estos riesgos se han establecido medidas preventivas', 20, y)
    doc.text('específicas y protocolos de actuación detallados.', 20, y + 8)
  }

  private generarSeccionProtocolos(doc: jsPDF, protocolos: string[]) {
    doc.setFontSize(16)
    doc.setFont(undefined, 'bold')
    doc.text('4. PROTOCOLOS DE ACTUACIÓN', 20, 30)

    doc.setFontSize(12)
    doc.setFont(undefined, 'normal')

    let y = 50

    doc.text('Se han establecido los siguientes protocolos específicos:', 20, y)
    y += 15

    protocolos.forEach(protocolo => {
      doc.text(`• ${protocolo}`, 25, y)
      y += 8
    })
  }

  private generarSeccionCodigoConducta(doc: jsPDF, tipoEntidad: string) {
    doc.setFontSize(16)
    doc.setFont(undefined, 'bold')
    doc.text('5. CÓDIGO DE CONDUCTA', 20, 30)

    doc.setFontSize(12)
    doc.setFont(undefined, 'normal')

    let y = 50

    const normas = [
      'Respetar la dignidad, derechos e integridad de todos los menores',
      'Mantener una comunicación apropiada y profesional',
      'Garantizar la supervisión adecuada en todas las actividades',
      'Respetar la privacidad y confidencialidad',
      'Reportar inmediatamente cualquier situación de riesgo'
    ]

    doc.text('Todo el personal debe cumplir las siguientes normas:', 20, y)
    y += 15

    normas.forEach(norma => {
      doc.text(`• ${norma}`, 25, y)
      y += 8
    })
  }

  private generarSeccionFormacion(doc: jsPDF) {
    doc.setFontSize(16)
    doc.setFont(undefined, 'bold')
    doc.text('6. FORMACIÓN DEL PERSONAL', 20, 30)

    doc.setFontSize(12)
    doc.setFont(undefined, 'normal')

    let y = 50

    const contenidoFormacion = [
      'Todo el personal recibirá formación específica en:',
      '',
      '• Fundamentos de la LOPIVI',
      '• Detección de indicios de violencia',
      '• Protocolos de actuación',
      '• Comunicación apropiada con menores',
      '• Procedimientos de denuncia',
      '',
      'La formación se actualizará anualmente y se documentará',
      'adecuadamente para su verificación.'
    ]

    contenidoFormacion.forEach(linea => {
      doc.text(linea, 20, y)
      y += 8
    })
  }

  private generarSeccionComunicacion(doc: jsPDF, entidad: EntidadData) {
    doc.setFontSize(16)
    doc.setFont(undefined, 'bold')
    doc.text('7. COMUNICACIÓN Y DENUNCIAS', 20, 30)

    doc.setFontSize(12)
    doc.setFont(undefined, 'normal')

    let y = 50

    const comunicacion = [
      'CANALES DE COMUNICACIÓN:',
      '',
      `• Delegado de Protección: ${entidad.delegado.email}`,
      `• Teléfono de emergencia: ${entidad.delegado.telefono}`,
      '• Email institucional: ' + entidad.email,
      '',
      'AUTORIDADES COMPETENTES:',
      '',
      '• Servicios Sociales: 112',
      '• Policía Nacional: 091',
      '• Guardia Civil: 062',
      '• Teléfono ANAR: 900 20 20 10'
    ]

    comunicacion.forEach(linea => {
      if (linea.includes('CANALES') || linea.includes('AUTORIDADES')) {
        doc.setFont(undefined, 'bold')
      }
      doc.text(linea, 20, y)
      doc.setFont(undefined, 'normal')
      y += 8
    })
  }

  private generarSeccionSeguimiento(doc: jsPDF) {
    doc.setFontSize(16)
    doc.setFont(undefined, 'bold')
    doc.text('8. SEGUIMIENTO Y REVISIÓN', 20, 30)

    doc.setFontSize(12)
    doc.setFont(undefined, 'normal')

    let y = 50

    const seguimiento = [
      'Este Plan de Protección será revisado y actualizado:',
      '',
      '• Anualmente o cuando cambien las circunstancias',
      '• Tras modificaciones en la normativa LOPIVI',
      '• Después de incidentes significativos',
      '• Por recomendación de las autoridades',
      '',
      'Todas las actualizaciones serán comunicadas al personal',
      'y documentadas adecuadamente.',
      '',
      'Fecha de próxima revisión: ' + new Date(Date.now() + 365*24*60*60*1000).toLocaleDateString('es-ES')
    ]

    seguimiento.forEach(linea => {
      doc.text(linea, 20, y)
      y += 8
    })
  }

  private obtenerPlantillaEntidad(tipo: string) {
    return PLANTILLAS_ENTIDAD[tipo as keyof typeof PLANTILLAS_ENTIDAD] || PLANTILLAS_ENTIDAD['club-deportivo']
  }
}

// API para generar documentos
export async function generarDocumentosCompletos(entidad: EntidadData): Promise<{
  planProteccion: string
  nombramientoDelegado: string
  certificadoFormacion: string
}> {
  const generator = new DocumentGenerator()

  const [planProteccion, nombramientoDelegado, certificadoFormacion] = await Promise.all([
    generator.generarPlanProteccion(entidad),
    generator.generarNombramientoDelegado(entidad),
    generator.generarCertificadoFormacion(entidad.delegado, entidad)
  ])

  return {
    planProteccion,
    nombramientoDelegado,
    certificadoFormacion
  }
}

export default DocumentGenerator
