export interface Delegado {
  id: string
  nombre: string
  email: string
  entidad: string
  tipo: 'titular' | 'suplente'
  password: string
  fechaContratacion: string
  progreso: ProgresoDelegado
}

export interface ProgresoDelegado {
  etapaActual: 'bienvenida' | 'formacion' | 'test' | 'certificado'
  modulosDescargados: string[]
  testCompletado: boolean
  puntuacionTest?: number
  certificadoGenerado: boolean
  fechaInicio?: string
  fechaFinalizacion?: string
}

export interface Modulo {
  id: string
  titulo: string
  descripcion: string
  archivo: string
  orden: number
}

export interface PreguntaTest {
  id: string
  pregunta: string
  opciones: string[]
  respuestaCorrecta: number
}

export interface Entidad {
  id: string
  nombre: string
  email: string
  delegados: string[]
}
