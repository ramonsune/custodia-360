import { useState } from 'react'
import { supabase, type Entidad, type Delegado, type Contratante } from '@/lib/supabase'

interface ContratacionData {
  entidad: {
    nombreEntidad: string
    cif: string
    direccion: string
    ciudad: string
    codigoPostal: string
    provincia: string
    telefono: string
    email: string
    website?: string
    numeroMenores: string
    tipoEntidad: string
    emailDashboard: string
    passwordDashboard: string
  }
  contratante: {
    nombreContratante: string
    apellidosContratante: string
    dniContratante: string
    cargoContratante: string
    telefonoContratante: string
    emailContratante: string
    esDelegado: boolean
  }
  delegado: {
    nombreDelegado: string
    apellidosDelegado: string
    dniDelegado: string
    telefonoDelegado: string
    emailDelegado: string
    passwordDelegado: string
    experiencia?: string
    disponibilidad: string
    certificadoPenales: boolean
    incluirSuplente: boolean
    // Suplente (opcional)
    nombreSuplente?: string
    apellidosSuplente?: string
    dniSuplente?: string
    telefonoSuplente?: string
    emailSuplente?: string
    passwordSuplente?: string
    experienciaSuplente?: string
    disponibilidadSuplente?: string
    certificadoPenalesSuplente?: boolean
  }
}

export const useSupabase = () => {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Obtener precio del plan
  const getPrecio = (numeroMenores: string): number => {
    switch (numeroMenores) {
      case '1-50': return 19.00
      case '51-200': return 49.00
      case '201-500': return 105.00
      case '501+': return 250.00
      default: return 0
    }
  }

  // Crear contratación completa
  const crearContratacion = async (data: ContratacionData) => {
    setLoading(true)
    setError(null)

    try {
      // 1. Crear entidad
      const entidadData: Omit<Entidad, 'id' | 'created_at' | 'updated_at'> = {
        nombre: data.entidad.nombreEntidad,
        cif: data.entidad.cif,
        direccion: data.entidad.direccion,
        ciudad: data.entidad.ciudad,
        codigo_postal: data.entidad.codigoPostal,
        provincia: data.entidad.provincia,
        telefono: data.entidad.telefono,
        email: data.entidad.email,
        website: data.entidad.website || null,
        numero_menores: data.entidad.numeroMenores,
        tipo_entidad: data.entidad.tipoEntidad,
        plan: `Plan ${data.entidad.numeroMenores.split('-')[0] === '1' ? '50' : data.entidad.numeroMenores === '501+' ? '500+' : data.entidad.numeroMenores.split('-')[1]}`,
        precio_mensual: getPrecio(data.entidad.numeroMenores),
        dashboard_email: data.entidad.emailDashboard,
        dashboard_password: data.entidad.passwordDashboard,
        fecha_alta: new Date().toISOString().split('T')[0],
        estado: 'activa'
      }

      const { data: entidad, error: entidadError } = await supabase
        .from('entidades')
        .insert(entidadData)
        .select()
        .single()

      if (entidadError) throw entidadError

      // 2. Crear contratante
      const contratanteData: Omit<Contratante, 'id' | 'created_at'> = {
        entidad_id: entidad.id,
        nombre: data.contratante.nombreContratante,
        apellidos: data.contratante.apellidosContratante,
        dni: data.contratante.dniContratante,
        cargo: data.contratante.cargoContratante,
        telefono: data.contratante.telefonoContratante,
        email: data.contratante.emailContratante,
        es_delegado: data.contratante.esDelegado
      }

      const { error: contratanteError } = await supabase
        .from('contratantes')
        .insert(contratanteData)

      if (contratanteError) throw contratanteError

      // 3. Crear delegado principal
      const delegadoPrincipalData: Omit<Delegado, 'id' | 'created_at' | 'updated_at'> = {
        entidad_id: entidad.id,
        tipo: 'principal',
        nombre: data.delegado.nombreDelegado,
        apellidos: data.delegado.apellidosDelegado,
        dni: data.delegado.dniDelegado,
        telefono: data.delegado.telefonoDelegado,
        email: data.delegado.emailDelegado,
        password: data.delegado.passwordDelegado,
        experiencia: data.delegado.experiencia,
        disponibilidad: data.delegado.disponibilidad,
        certificado_penales: data.delegado.certificadoPenales,
        fecha_vencimiento_cert: null,
        estado: 'activo'
      }

      const { error: delegadoError } = await supabase
        .from('delegados')
        .insert(delegadoPrincipalData)

      if (delegadoError) throw delegadoError

      // 4. Crear delegado suplente (si está incluido)
      if (data.delegado.incluirSuplente && data.delegado.nombreSuplente) {
        const delegadoSuplenteData: Omit<Delegado, 'id' | 'created_at' | 'updated_at'> = {
          entidad_id: entidad.id,
          tipo: 'suplente',
          nombre: data.delegado.nombreSuplente,
          apellidos: data.delegado.apellidosSuplente!,
          dni: data.delegado.dniSuplente!,
          telefono: data.delegado.telefonoSuplente!,
          email: data.delegado.emailSuplente!,
          password: data.delegado.passwordSuplente!,
          experiencia: data.delegado.experienciaSuplente,
          disponibilidad: data.delegado.disponibilidadSuplente!,
          certificado_penales: data.delegado.certificadoPenalesSuplente!,
          fecha_vencimiento_cert: null,
          estado: 'activo'
        }

        const { error: suplenteError } = await supabase
          .from('delegados')
          .insert(delegadoSuplenteData)

        if (suplenteError) throw suplenteError
      }

      // 5. Crear registro inicial de cumplimiento
      const cumplimientoData = {
        entidad_id: entidad.id,
        personal_formado: 0,
        familias_informadas: 0,
        menores_informados: 0,
        casos_activos: 0,
        porcentaje_cumplimiento: 0,
        alertas_pendientes: [],
        fecha_actualizacion: new Date().toISOString()
      }

      const { error: cumplimientoError } = await supabase
        .from('cumplimiento')
        .insert(cumplimientoData)

      if (cumplimientoError) throw cumplimientoError

      return { success: true, entidad }

    } catch (err: any) {
      console.error('Error creating contratacion:', err)
      setError(err.message || 'Error al crear la contratación')
      return { success: false, error: err.message }
    } finally {
      setLoading(false)
    }
  }

  // Obtener todas las entidades
  const getEntidades = async () => {
    setLoading(true)
    setError(null)

    try {
      const { data, error } = await supabase
        .from('entidades')
        .select(`
          *,
          cumplimiento (
            porcentaje_cumplimiento,
            alertas_pendientes,
            casos_activos
          ),
          delegados (
            nombre,
            apellidos,
            tipo,
            estado
          )
        `)
        .order('created_at', { ascending: false })

      if (error) throw error
      return { success: true, data }

    } catch (err: any) {
      console.error('Error fetching entidades:', err)
      setError(err.message)
      return { success: false, error: err.message }
    } finally {
      setLoading(false)
    }
  }

  // Autenticación simple (después implementaremos Supabase Auth)
  const login = async (email: string, password: string, tipo: 'entidad' | 'delegado') => {
    setLoading(true)
    setError(null)

    try {
      let query
      if (tipo === 'entidad') {
        query = supabase
          .from('entidades')
          .select('*')
          .eq('dashboard_email', email)
          .eq('dashboard_password', password)
          .single()
      } else {
        query = supabase
          .from('delegados')
          .select('*, entidades(*)')
          .eq('email', email)
          .eq('password', password)
          .single()
      }

      const { data, error } = await query

      if (error || !data) {
        throw new Error('Credenciales incorrectas')
      }

      return { success: true, user: data }

    } catch (err: any) {
      console.error('Error logging in:', err)
      setError(err.message)
      return { success: false, error: err.message }
    } finally {
      setLoading(false)
    }
  }

  return {
    loading,
    error,
    crearContratacion,
    getEntidades,
    login
  }
}
