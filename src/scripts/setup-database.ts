import { supabase } from '@/lib/supabase'

// Script para configurar la base de datos automáticamente
export async function setupDatabase() {
  console.log('🔧 Iniciando configuración de base de datos...')

  try {
    // 1. CREAR TABLA ENTIDADES
    console.log('📋 Creando tabla entidades...')
    const { error: entidadesError } = await supabase.rpc('exec_sql', {
      sql: `
        CREATE TABLE IF NOT EXISTS entidades (
          id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
          nombre TEXT NOT NULL,
          cif TEXT UNIQUE NOT NULL,
          direccion TEXT NOT NULL,
          ciudad TEXT NOT NULL,
          codigo_postal TEXT NOT NULL,
          provincia TEXT NOT NULL,
          telefono TEXT NOT NULL,
          email TEXT NOT NULL,
          website TEXT,
          numero_menores TEXT NOT NULL,
          tipo_entidad TEXT NOT NULL,
          plan TEXT NOT NULL,
          precio_mensual DECIMAL(10,2) NOT NULL,
          dashboard_email TEXT UNIQUE NOT NULL,
          dashboard_password TEXT NOT NULL,
          fecha_alta DATE DEFAULT CURRENT_DATE,
          estado TEXT DEFAULT 'activa' CHECK (estado IN ('activa', 'suspendida', 'cancelada')),
          created_at TIMESTAMPTZ DEFAULT NOW(),
          updated_at TIMESTAMPTZ DEFAULT NOW()
        );
      `
    })

    if (entidadesError) {
      console.error('❌ Error creando tabla entidades:', entidadesError)
      throw entidadesError
    }

    // 2. CREAR TABLA CONTRATANTES
    console.log('📋 Creando tabla contratantes...')
    const { error: contratantesError } = await supabase.rpc('exec_sql', {
      sql: `
        CREATE TABLE IF NOT EXISTS contratantes (
          id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
          entidad_id UUID REFERENCES entidades(id) ON DELETE CASCADE,
          nombre TEXT NOT NULL,
          apellidos TEXT NOT NULL,
          dni TEXT NOT NULL,
          cargo TEXT NOT NULL,
          telefono TEXT NOT NULL,
          email TEXT NOT NULL,
          es_delegado BOOLEAN DEFAULT FALSE,
          created_at TIMESTAMPTZ DEFAULT NOW()
        );
      `
    })

    if (contratantesError) {
      console.error('❌ Error creando tabla contratantes:', contratantesError)
      throw contratantesError
    }

    // 3. CREAR TABLA DELEGADOS
    console.log('📋 Creando tabla delegados...')
    const { error: delegadosError } = await supabase.rpc('exec_sql', {
      sql: `
        CREATE TABLE IF NOT EXISTS delegados (
          id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
          entidad_id UUID REFERENCES entidades(id) ON DELETE CASCADE,
          tipo TEXT NOT NULL CHECK (tipo IN ('principal', 'suplente')),
          nombre TEXT NOT NULL,
          apellidos TEXT NOT NULL,
          dni TEXT NOT NULL,
          telefono TEXT NOT NULL,
          email TEXT UNIQUE NOT NULL,
          password TEXT NOT NULL,
          experiencia TEXT,
          disponibilidad TEXT NOT NULL,
          certificado_penales BOOLEAN DEFAULT FALSE,
          fecha_vencimiento_cert DATE,
          estado TEXT DEFAULT 'activo' CHECK (estado IN ('activo', 'inactivo')),
          created_at TIMESTAMPTZ DEFAULT NOW(),
          updated_at TIMESTAMPTZ DEFAULT NOW()
        );
      `
    })

    if (delegadosError) {
      console.error('❌ Error creando tabla delegados:', delegadosError)
      throw delegadosError
    }

    // 4. CREAR TABLA CUMPLIMIENTO
    console.log('📋 Creando tabla cumplimiento...')
    const { error: cumplimientoError } = await supabase.rpc('exec_sql', {
      sql: `
        CREATE TABLE IF NOT EXISTS cumplimiento (
          id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
          entidad_id UUID REFERENCES entidades(id) ON DELETE CASCADE,
          personal_formado INTEGER DEFAULT 0,
          familias_informadas INTEGER DEFAULT 0,
          menores_informados INTEGER DEFAULT 0,
          casos_activos INTEGER DEFAULT 0,
          porcentaje_cumplimiento DECIMAL(5,2) DEFAULT 0,
          alertas_pendientes JSONB DEFAULT '[]',
          fecha_actualizacion TIMESTAMPTZ DEFAULT NOW(),
          created_at TIMESTAMPTZ DEFAULT NOW()
        );
      `
    })

    if (cumplimientoError) {
      console.error('❌ Error creando tabla cumplimiento:', cumplimientoError)
      throw cumplimientoError
    }

    console.log('✅ ¡Base de datos configurada exitosamente!')

    // Insertar datos de prueba
    await insertarDatosPrueba()

    return { success: true }

  } catch (error) {
    console.error('❌ Error configurando base de datos:', error)
    return { success: false, error }
  }
}

async function insertarDatosPrueba() {
  console.log('🔧 Insertando datos de prueba...')

  // Verificar si ya existen datos
  const { data: entidadesExistentes } = await supabase
    .from('entidades')
    .select('id')
    .limit(1)

  if (entidadesExistentes && entidadesExistentes.length > 0) {
    console.log('ℹ️ Ya existen datos en la base de datos')
    return
  }

  try {
    // Insertar entidad de ejemplo
    const { data: entidad, error: entidadError } = await supabase
      .from('entidades')
      .insert({
        nombre: 'Club Deportivo Ejemplo',
        cif: 'B12345678',
        direccion: 'Calle Deporte 123',
        ciudad: 'Barcelona',
        codigo_postal: '08001',
        provincia: 'Barcelona',
        telefono: '93 123 45 67',
        email: 'info@clubejemplo.com',
        numero_menores: '201-500',
        tipo_entidad: 'club-deportivo',
        plan: 'Plan 500',
        precio_mensual: 105.00,
        dashboard_email: 'admin@clubejemplo.com',
        dashboard_password: 'password123'
      })
      .select()
      .single()

    if (entidadError) throw entidadError

    // Insertar delegado de ejemplo
    const { error: delegadoError } = await supabase
      .from('delegados')
      .insert({
        entidad_id: entidad.id,
        tipo: 'principal',
        nombre: 'Juan',
        apellidos: 'García Rodríguez',
        dni: '12345678A',
        telefono: '666 777 888',
        email: 'juan.garcia@clubejemplo.com',
        password: 'delegado123',
        disponibilidad: 'completa',
        certificado_penales: true
      })

    if (delegadoError) throw delegadoError

    // Insertar cumplimiento de ejemplo
    const { error: cumplimientoError } = await supabase
      .from('cumplimiento')
      .insert({
        entidad_id: entidad.id,
        personal_formado: 28,
        familias_informadas: 156,
        menores_informados: 218,
        casos_activos: 1,
        porcentaje_cumplimiento: 87.5,
        alertas_pendientes: [
          {
            tipo: 'certificacion',
            mensaje: 'Certificación de María López caduca en 15 días'
          },
          {
            tipo: 'documentos',
            mensaje: '4 familias pendientes de firmar código de conducta'
          }
        ]
      })

    if (cumplimientoError) throw cumplimientoError

    console.log('✅ Datos de prueba insertados correctamente')

  } catch (error) {
    console.error('❌ Error insertando datos de prueba:', error)
  }
}

// Función para ejecutar en desarrollo
if (typeof window !== 'undefined') {
  (window as any).setupDatabase = setupDatabase
}
