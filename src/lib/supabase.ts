import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Tipos TypeScript para nuestras tablas
export interface Entidad {
  id: string
  nombre: string
  cif: string
  direccion: string
  ciudad: string
  codigo_postal: string
  provincia: string
  telefono: string
  email: string
  website?: string
  numero_menores: string
  tipo_entidad: string
  plan: string
  precio_mensual: number
  dashboard_email: string
  dashboard_password: string
  fecha_alta: string
  estado: 'activa' | 'suspendida' | 'cancelada'
  created_at?: string
  updated_at?: string
}

export interface Delegado {
  id: string
  entidad_id: string
  tipo: 'principal' | 'suplente'
  nombre: string
  apellidos: string
  dni: string
  telefono: string
  email: string
  password: string
  experiencia?: string
  disponibilidad: string
  certificado_penales: boolean
  fecha_vencimiento_cert?: string
  estado: 'activo' | 'inactivo'
  created_at?: string
  updated_at?: string
}

export interface Contratante {
  id: string
  entidad_id: string
  nombre: string
  apellidos: string
  dni: string
  cargo: string
  telefono: string
  email: string
  es_delegado: boolean
  created_at?: string
}

export interface Cumplimiento {
  id: string
  entidad_id: string
  personal_formado: number
  familias_informadas: number
  menores_informados: number
  casos_activos: number
  porcentaje_cumplimiento: number
  alertas_pendientes: any[]
  fecha_actualizacion: string
  created_at?: string
}
