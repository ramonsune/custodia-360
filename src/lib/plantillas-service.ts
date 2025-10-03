// Servicio de Plantillas Personalizables por Tipo de Entidad
interface PlantillaDocumento {
  id: string
  nombre: string
  descripcion: string
  tipoDocumento: 'plan_proteccion' | 'codigo_conducta' | 'protocolos_actuacion' | 'evaluacion_riesgos' | 'manual_formacion'
  tipoEntidad: 'deportiva' | 'educativa' | 'social' | 'religiosa' | 'otra'
  version: string
  estructura: EstructuraPlantilla
  configuracion: ConfiguracionPlantilla
  variables: VariablePlantilla[]
  estilos: EstilosPlantilla
  fechaCreacion: string
  fechaActualizacion: string
  creadoPor: string
  activa: boolean
  oficial: boolean  // Plantillas oficiales de Custodia360
}

interface EstructuraPlantilla {
  secciones: SeccionPlantilla[]
  formato: 'html' | 'markdown' | 'docx' | 'pdf'
  metadatos: MetadatosDocumento
}

interface SeccionPlantilla {
  id: string
  titulo: string
  descripcion?: string
  contenido: string
  tipoContenido: 'texto' | 'lista' | 'tabla' | 'imagen' | 'firma' | 'variables'
  obligatoria: boolean
  editable: boolean
  orden: number
  condiciones?: CondicionSeccion[]
  subsecciones?: SeccionPlantilla[]
  configuracion?: {
    mostrarTitulo: boolean
    saltoAntes: boolean
    saltoDespues: boolean
    estilo?: string
  }
}

interface CondicionSeccion {
  variable: string
  operador: '==' | '!=' | '>' | '<' | 'contains' | 'not_contains'
  valor: string
}

interface ConfiguracionPlantilla {
  tipoEntidadEspecifico: {
    deportiva?: ConfiguracionDeportiva
    educativa?: ConfiguracionEducativa
    social?: ConfiguracionSocial
    religiosa?: ConfiguracionReligiosa
  }
  personalizacion: {
    permiteEdicion: boolean
    seccionesOpcionales: string[]
    variablesRequeridas: string[]
    validaciones: ValidacionPlantilla[]
  }
}

interface ConfiguracionDeportiva {
  deportes: string[]
  instalaciones: string[]
  categoriasEdad: string[]
  competiciones: boolean
  entrenamientos: boolean
}

interface ConfiguracionEducativa {
  niveles: string[]
  etapasEducativas: string[]
  extraescolares: boolean
  transporte: boolean
  comedor: boolean
}

interface ConfiguracionSocial {
  actividades: string[]
  gruposEdad: string[]
  servicios: string[]
}

interface ConfiguracionReligiosa {
  culto: string
  actividades: string[]
  ceremonias: boolean
}

interface VariablePlantilla {
  id: string
  nombre: string
  descripcion: string
  tipo: 'texto' | 'numero' | 'fecha' | 'lista' | 'booleano' | 'tabla' | 'imagen'
  requerida: boolean
  valorDefecto?: any
  opciones?: string[]  // Para tipo 'lista'
  validacion?: RegExp
  categoria: 'entidad' | 'responsables' | 'actividades' | 'configuracion' | 'personalizada'
  mostrarEn?: string[]  // Qué tipos de entidad pueden usar esta variable
}

interface ValidacionPlantilla {
  campo: string
  regla: string
  mensaje: string
}

interface EstilosPlantilla {
  tipografia: {
    fuente: string
    tamaño: number
    interlineado: number
  }
  colores: {
    primario: string
    secundario: string
    texto: string
    fondo: string
  }
  margenes: {
    superior: number
    inferior: number
    izquierdo: number
    derecho: number
  }
  encabezado?: string
  piePagina?: string
  logo?: string
}

interface MetadatosDocumento {
  titulo: string
  autor: string
  organizacion: string
  version: string
  fechaCreacion: string
  palabrasClave: string[]
  clasificacion: 'publico' | 'interno' | 'confidencial'
}

class PlantillasService {
  private baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api'

  // CRUD de Plantillas
  async obtenerPlantillas(tipoEntidad?: string, tipoDocumento?: string): Promise<PlantillaDocumento[]> {
    try {
      const params = new URLSearchParams()
      if (tipoEntidad) params.append('tipoEntidad', tipoEntidad)
      if (tipoDocumento) params.append('tipoDocumento', tipoDocumento)

      const response = await fetch(`${this.baseUrl}/plantillas?${params}`, {
        headers: {
          'Authorization': `Bearer ${this.getToken()}`
        }
      })

      if (!response.ok) {
        throw new Error(`Error al obtener plantillas: ${response.statusText}`)
      }

      return await response.json()
    } catch (error) {
      console.error('Error obteniendo plantillas:', error)
      return this.obtenerPlantillasLocal(tipoEntidad, tipoDocumento)
    }
  }

  async crearPlantilla(plantilla: Omit<PlantillaDocumento, 'id' | 'fechaCreacion' | 'fechaActualizacion'>): Promise<PlantillaDocumento> {
    try {
      const nuevaPlantilla = {
        ...plantilla,
        id: this.generarId(),
        fechaCreacion: new Date().toISOString(),
        fechaActualizacion: new Date().toISOString()
      }

      const response = await fetch(`${this.baseUrl}/plantillas`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.getToken()}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(nuevaPlantilla)
      })

      if (!response.ok) {
        throw new Error(`Error al crear plantilla: ${response.statusText}`)
      }

      const plantillaCreada = await response.json()
      this.guardarPlantillaLocal(plantillaCreada)

      return plantillaCreada
    } catch (error) {
      console.error('Error creando plantilla:', error)
      throw error
    }
  }

  async actualizarPlantilla(id: string, cambios: Partial<PlantillaDocumento>): Promise<PlantillaDocumento> {
    try {
      const response = await fetch(`${this.baseUrl}/plantillas/${id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${this.getToken()}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          ...cambios,
          fechaActualizacion: new Date().toISOString()
        })
      })

      if (!response.ok) {
        throw new Error(`Error al actualizar plantilla: ${response.statusText}`)
      }

      const plantillaActualizada = await response.json()
      this.actualizarPlantillaLocal(id, plantillaActualizada)

      return plantillaActualizada
    } catch (error) {
      console.error('Error actualizando plantilla:', error)
      throw error
    }
  }

  // Generación de Documentos
  async generarDocumento(
    plantillaId: string,
    variables: Record<string, any>,
    formato: 'html' | 'pdf' | 'docx' = 'pdf'
  ): Promise<{ contenido: string; archivo?: Blob }> {
    try {
      const response = await fetch(`${this.baseUrl}/plantillas/${plantillaId}/generar`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.getToken()}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          variables,
          formato
        })
      })

      if (!response.ok) {
        throw new Error(`Error al generar documento: ${response.statusText}`)
      }

      if (formato === 'html') {
        const contenido = await response.text()
        return { contenido }
      } else {
        const archivo = await response.blob()
        return { contenido: '', archivo }
      }
    } catch (error) {
      console.error('Error generando documento:', error)
      // Fallback a generación local
      return this.generarDocumentoLocal(plantillaId, variables, formato)
    }
  }

  // Plantillas Predefinidas por Tipo de Entidad
  async obtenerPlantillasOficiales(tipoEntidad: string): Promise<PlantillaDocumento[]> {
    return this.getPlantillasOficialesPorTipo(tipoEntidad as any)
  }

  private getPlantillasOficialesPorTipo(tipoEntidad: 'deportiva' | 'educativa' | 'social' | 'religiosa'): PlantillaDocumento[] {
    const plantillasBase = this.getPlantillasBase()

    switch (tipoEntidad) {
      case 'deportiva':
        return this.adaptarPlantillasDeportivas(plantillasBase)
      case 'educativa':
        return this.adaptarPlantillasEducativas(plantillasBase)
      case 'social':
        return this.adaptarPlantillasSociales(plantillasBase)
      case 'religiosa':
        return this.adaptarPlantillasReligiosas(plantillasBase)
      default:
        return plantillasBase
    }
  }

  private getPlantillasBase(): PlantillaDocumento[] {
    return [
      {
        id: 'plan-proteccion-base',
        nombre: 'Plan de Protección de la Infancia',
        descripcion: 'Plantilla base para el plan de protección según LOPIVI',
        tipoDocumento: 'plan_proteccion',
        tipoEntidad: 'otra',
        version: '1.0',
        estructura: {
          secciones: [
            {
              id: 'introduccion',
              titulo: '1. Introducción',
              contenido: `
                <h2>1. Introducción</h2>
                <p>La entidad <strong>{nombreEntidad}</strong> con CIF {cifEntidad}, se compromete con la protección integral de todos los menores que participan en nuestras actividades.</p>
                <p>Este Plan de Protección se elabora en cumplimiento de la Ley Orgánica 8/2021, de 4 de junio, de protección integral a la infancia y la adolescencia frente a la violencia (LOPIVI).</p>
              `,
              tipoContenido: 'texto',
              obligatoria: true,
              editable: true,
              orden: 1
            },
            {
              id: 'responsables',
              titulo: '2. Responsables de Protección',
              contenido: `
                <h2>2. Responsables de Protección</h2>
                <h3>2.1 Delegado Principal</h3>
                <p><strong>Nombre:</strong> {nombreDelegadoPrincipal}</p>
                <p><strong>DNI:</strong> {dniDelegadoPrincipal}</p>
                <p><strong>Funciones:</strong> {funcionesDelegadoPrincipal}</p>

                <h3>2.2 Delegado Suplente</h3>
                <p><strong>Nombre:</strong> {nombreDelegadoSuplente}</p>
                <p><strong>DNI:</strong> {dniDelegadoSuplente}</p>
                <p><strong>Funciones:</strong> {funcionesDelegadoSuplente}</p>
              `,
              tipoContenido: 'variables',
              obligatoria: true,
              editable: true,
              orden: 2
            },
            {
              id: 'actividades',
              titulo: '3. Actividades y Ámbito de Aplicación',
              contenido: `
                <h2>3. Actividades y Ámbito de Aplicación</h2>
                <p>Este plan se aplica a todas las actividades desarrolladas por {nombreEntidad}:</p>
                {listaActividades}
              `,
              tipoContenido: 'lista',
              obligatoria: true,
              editable: true,
              orden: 3
            },
            {
              id: 'protocolos',
              titulo: '4. Protocolos de Actuación',
              contenido: `
                <h2>4. Protocolos de Actuación</h2>
                <p>En caso de detectar cualquier situación de riesgo o violencia hacia menores, se activará inmediatamente el siguiente protocolo:</p>
                <ol>
                  <li>Garantizar la seguridad inmediata del menor</li>
                  <li>Comunicación inmediata al Delegado de Protección</li>
                  <li>Documentación del incidente</li>
                  <li>Comunicación a las autoridades competentes</li>
                  <li>Seguimiento y apoyo al menor</li>
                </ol>
              `,
              tipoContenido: 'texto',
              obligatoria: true,
              editable: true,
              orden: 4
            }
          ],
          formato: 'html',
          metadatos: {
            titulo: 'Plan de Protección de la Infancia',
            autor: '{nombreDelegadoPrincipal}',
            organizacion: '{nombreEntidad}',
            version: '1.0',
            fechaCreacion: '{fechaCreacion}',
            palabrasClave: ['LOPIVI', 'protección', 'menores', 'plan'],
            clasificacion: 'interno'
          }
        },
        configuracion: {
          tipoEntidadEspecifico: {},
          personalizacion: {
            permiteEdicion: true,
            seccionesOpcionales: ['introduccion'],
            variablesRequeridas: ['nombreEntidad', 'cifEntidad', 'nombreDelegadoPrincipal'],
            validaciones: [
              {
                campo: 'nombreEntidad',
                regla: 'required',
                mensaje: 'El nombre de la entidad es obligatorio'
              }
            ]
          }
        },
        variables: this.getVariablesBase(),
        estilos: this.getEstilosDefecto(),
        fechaCreacion: new Date().toISOString(),
        fechaActualizacion: new Date().toISOString(),
        creadoPor: 'sistema',
        activa: true,
        oficial: true
      }
    ]
  }

  private adaptarPlantillasDeportivas(plantillasBase: PlantillaDocumento[]): PlantillaDocumento[] {
    return plantillasBase.map(plantilla => ({
      ...plantilla,
      id: `${plantilla.id}-deportiva`,
      tipoEntidad: 'deportiva',
      configuracion: {
        ...plantilla.configuracion,
        tipoEntidadEspecifico: {
          deportiva: {
            deportes: [],
            instalaciones: [],
            categoriasEdad: ['Pre-benjamín', 'Benjamín', 'Alevín', 'Infantil', 'Cadete', 'Juvenil'],
            competiciones: true,
            entrenamientos: true
          }
        }
      },
      variables: [
        ...plantilla.variables,
        {
          id: 'deportesPracticados',
          nombre: 'Deportes Practicados',
          descripcion: 'Lista de deportes que se practican en la entidad',
          tipo: 'lista',
          requerida: true,
          categoria: 'actividades',
          mostrarEn: ['deportiva']
        },
        {
          id: 'instalacionesDeportivas',
          nombre: 'Instalaciones Deportivas',
          descripcion: 'Instalaciones donde se desarrollan las actividades',
          tipo: 'lista',
          requerida: true,
          categoria: 'actividades',
          mostrarEn: ['deportiva']
        },
        {
          id: 'horarioEntrenamientos',
          nombre: 'Horarios de Entrenamientos',
          descripcion: 'Horarios habituales de entrenamientos',
          tipo: 'tabla',
          requerida: true,
          categoria: 'actividades',
          mostrarEn: ['deportiva']
        }
      ],
      estructura: {
        ...plantilla.estructura,
        secciones: [
          ...plantilla.estructura.secciones,
          {
            id: 'instalaciones-deportivas',
            titulo: '5. Instalaciones y Espacios Deportivos',
            contenido: `
              <h2>5. Instalaciones y Espacios Deportivos</h2>
              <p>Las actividades deportivas se desarrollan en las siguientes instalaciones:</p>
              {instalacionesDeportivas}

              <h3>5.1 Medidas de Protección en Instalaciones</h3>
              <ul>
                <li>Supervisión constante de adultos responsables</li>
                <li>Vestuarios con protocolo de acompañamiento</li>
                <li>Zonas comunes bajo vigilancia</li>
                <li>Acceso controlado a instalaciones</li>
              </ul>
            `,
            tipoContenido: 'variables',
            obligatoria: true,
            editable: true,
            orden: 5
          },
          {
            id: 'competiciones',
            titulo: '6. Protocolo para Competiciones',
            contenido: `
              <h2>6. Protocolo para Competiciones</h2>
              <p>En competiciones y eventos deportivos se aplicarán las siguientes medidas adicionales:</p>
              <ul>
                <li>Acompañamiento parental o de tutores designados</li>
                <li>Identificación de responsables por equipo</li>
                <li>Protocolo de desplazamientos</li>
                <li>Comunicación con familias</li>
              </ul>
            `,
            tipoContenido: 'texto',
            obligatoria: false,
            editable: true,
            orden: 6,
            condiciones: [
              {
                variable: 'competiciones',
                operador: '==',
                valor: 'true'
              }
            ]
          }
        ]
      }
    }))
  }

  private adaptarPlantillasEducativas(plantillasBase: PlantillaDocumento[]): PlantillaDocumento[] {
    return plantillasBase.map(plantilla => ({
      ...plantilla,
      id: `${plantilla.id}-educativa`,
      tipoEntidad: 'educativa',
      configuracion: {
        ...plantilla.configuracion,
        tipoEntidadEspecifico: {
          educativa: {
            niveles: ['Infantil', 'Primaria', 'ESO', 'Bachillerato'],
            etapasEducativas: [],
            extraescolares: true,
            transporte: false,
            comedor: false
          }
        }
      },
      variables: [
        ...plantilla.variables,
        {
          id: 'nivelesEducativos',
          nombre: 'Niveles Educativos',
          descripcion: 'Etapas educativas que atiende el centro',
          tipo: 'lista',
          requerida: true,
          categoria: 'actividades',
          mostrarEn: ['educativa']
        },
        {
          id: 'actividadesExtraescolares',
          nombre: 'Actividades Extraescolares',
          descripcion: 'Lista de actividades extraescolares ofertadas',
          tipo: 'lista',
          requerida: false,
          categoria: 'actividades',
          mostrarEn: ['educativa']
        }
      ]
    }))
  }

  private adaptarPlantillasSociales(plantillasBase: PlantillaDocumento[]): PlantillaDocumento[] {
    return plantillasBase.map(plantilla => ({
      ...plantilla,
      id: `${plantilla.id}-social`,
      tipoEntidad: 'social',
      configuracion: {
        ...plantilla.configuracion,
        tipoEntidadEspecifico: {
          social: {
            actividades: ['Talleres', 'Apoyo escolar', 'Ocio y tiempo libre', 'Formación'],
            gruposEdad: ['0-3 años', '4-7 años', '8-12 años', '13-17 años'],
            servicios: []
          }
        }
      }
    }))
  }

  private adaptarPlantillasReligiosas(plantillasBase: PlantillaDocumento[]): PlantillaDocumento[] {
    return plantillasBase.map(plantilla => ({
      ...plantilla,
      id: `${plantilla.id}-religiosa`,
      tipoEntidad: 'religiosa',
      configuracion: {
        ...plantilla.configuracion,
        tipoEntidadEspecifico: {
          religiosa: {
            culto: '',
            actividades: ['Catequesis', 'Grupos juveniles', 'Campamentos', 'Celebraciones'],
            ceremonias: true
          }
        }
      }
    }))
  }

  private getVariablesBase(): VariablePlantilla[] {
    return [
      {
        id: 'nombreEntidad',
        nombre: 'Nombre de la Entidad',
        descripcion: 'Denominación oficial de la entidad',
        tipo: 'texto',
        requerida: true,
        categoria: 'entidad'
      },
      {
        id: 'cifEntidad',
        nombre: 'CIF de la Entidad',
        descripcion: 'Código de Identificación Fiscal',
        tipo: 'texto',
        requerida: true,
        validacion: /^[A-Z]\d{8}$/,
        categoria: 'entidad'
      },
      {
        id: 'nombreDelegadoPrincipal',
        nombre: 'Nombre del Delegado Principal',
        descripcion: 'Nombre completo del delegado principal de protección',
        tipo: 'texto',
        requerida: true,
        categoria: 'responsables'
      },
      {
        id: 'dniDelegadoPrincipal',
        nombre: 'DNI del Delegado Principal',
        descripcion: 'Documento Nacional de Identidad',
        tipo: 'texto',
        requerida: true,
        validacion: /^\d{8}[A-Z]$/,
        categoria: 'responsables'
      },
      {
        id: 'nombreDelegadoSuplente',
        nombre: 'Nombre del Delegado Suplente',
        descripcion: 'Nombre completo del delegado suplente de protección',
        tipo: 'texto',
        requerida: false,
        categoria: 'responsables'
      },
      {
        id: 'fechaCreacion',
        nombre: 'Fecha de Creación',
        descripcion: 'Fecha de creación del documento',
        tipo: 'fecha',
        requerida: true,
        valorDefecto: new Date().toISOString().split('T')[0],
        categoria: 'configuracion'
      }
    ]
  }

  private getEstilosDefecto(): EstilosPlantilla {
    return {
      tipografia: {
        fuente: 'Arial, sans-serif',
        tamaño: 12,
        interlineado: 1.5
      },
      colores: {
        primario: '#2563eb',
        secundario: '#64748b',
        texto: '#1f2937',
        fondo: '#ffffff'
      },
      margenes: {
        superior: 2.5,
        inferior: 2.5,
        izquierdo: 2.5,
        derecho: 2.5
      },
      encabezado: '{nombreEntidad} - {tipoDocumento}',
      piePagina: 'Página {numeroPagina} de {totalPaginas} - Documento LOPIVI'
    }
  }

  // Métodos privados para generación local
  private async generarDocumentoLocal(
    plantillaId: string,
    variables: Record<string, any>,
    formato: 'html' | 'pdf' | 'docx'
  ): Promise<{ contenido: string; archivo?: Blob }> {
    const plantilla = this.obtenerPlantillaLocal(plantillaId)
    if (!plantilla) {
      throw new Error('Plantilla no encontrada')
    }

    let contenidoHTML = this.procesarPlantilla(plantilla, variables)

    if (formato === 'html') {
      return { contenido: contenidoHTML }
    }

    // Para PDF, usar jsPDF o similar (simulado)
    console.log('Generando documento local:', { plantillaId, variables, formato })
    return { contenido: contenidoHTML }
  }

  private procesarPlantilla(plantilla: PlantillaDocumento, variables: Record<string, any>): string {
    let contenido = ''

    // Procesar cada sección
    for (const seccion of plantilla.estructura.secciones) {
      if (this.evaluarCondiciones(seccion, variables)) {
        contenido += this.procesarSeccion(seccion, variables)
      }
    }

    return contenido
  }

  private procesarSeccion(seccion: SeccionPlantilla, variables: Record<string, any>): string {
    let contenido = seccion.contenido

    // Reemplazar variables
    Object.entries(variables).forEach(([clave, valor]) => {
      const regex = new RegExp(`{${clave}}`, 'g')
      contenido = contenido.replace(regex, String(valor))
    })

    return contenido
  }

  private evaluarCondiciones(seccion: SeccionPlantilla, variables: Record<string, any>): boolean {
    if (!seccion.condiciones || seccion.condiciones.length === 0) {
      return true
    }

    return seccion.condiciones.every(condicion => {
      const valor = variables[condicion.variable]

      switch (condicion.operador) {
        case '==':
          return valor == condicion.valor
        case '!=':
          return valor != condicion.valor
        case '>':
          return Number(valor) > Number(condicion.valor)
        case '<':
          return Number(valor) < Number(condicion.valor)
        case 'contains':
          return String(valor).includes(condicion.valor)
        case 'not_contains':
          return !String(valor).includes(condicion.valor)
        default:
          return true
      }
    })
  }

  // Métodos de almacenamiento local
  private obtenerPlantillasLocal(tipoEntidad?: string, tipoDocumento?: string): PlantillaDocumento[] {
    const stored = localStorage.getItem('plantillas_documentos')
    let plantillas = stored ? JSON.parse(stored) : this.getPlantillasBase()

    if (tipoEntidad) {
      plantillas = plantillas.filter((p: PlantillaDocumento) => p.tipoEntidad === tipoEntidad)
    }

    if (tipoDocumento) {
      plantillas = plantillas.filter((p: PlantillaDocumento) => p.tipoDocumento === tipoDocumento)
    }

    return plantillas
  }

  private obtenerPlantillaLocal(id: string): PlantillaDocumento | null {
    const plantillas = this.obtenerPlantillasLocal()
    return plantillas.find(p => p.id === id) || null
  }

  private guardarPlantillaLocal(plantilla: PlantillaDocumento): void {
    const plantillas = this.obtenerPlantillasLocal()
    const index = plantillas.findIndex(p => p.id === plantilla.id)

    if (index >= 0) {
      plantillas[index] = plantilla
    } else {
      plantillas.push(plantilla)
    }

    localStorage.setItem('plantillas_documentos', JSON.stringify(plantillas))
  }

  private actualizarPlantillaLocal(id: string, plantilla: PlantillaDocumento): void {
    this.guardarPlantillaLocal(plantilla)
  }

  private getToken(): string {
    const session = localStorage.getItem('userSession')
    if (session) {
      const data = JSON.parse(session)
      return data.token || 'demo-token'
    }
    return 'demo-token'
  }

  private generarId(): string {
    return `plantilla_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  }
}

// Instancia singleton
export const plantillasService = new PlantillasService()

// Tipos exportados
export type {
  PlantillaDocumento,
  EstructuraPlantilla,
  SeccionPlantilla,
  ConfiguracionPlantilla,
  VariablePlantilla,
  EstilosPlantilla,
  MetadatosDocumento
}
