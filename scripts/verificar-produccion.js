#!/usr/bin/env node

const { createClient } = require('@supabase/supabase-js')
require('dotenv/config')

// Configurar Supabase
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Error: Variables de entorno de Supabase no configuradas')
  console.log('📋 Necesitas configurar:')
  console.log('   NEXT_PUBLIC_SUPABASE_URL=https://tu-proyecto.supabase.co')
  console.log('   SUPABASE_SERVICE_ROLE_KEY=tu_service_role_key')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseKey)

console.log('🔍 VERIFICANDO ESTADO DE CUSTODIA360 PARA PRODUCCIÓN\n')

// Función para verificar tabla
async function verificarTabla(nombreTabla, descripcion) {
  try {
    const { data, error, count } = await supabase
      .from(nombreTabla)
      .select('*', { count: 'exact', head: true })

    if (error) {
      console.log(`❌ ${descripcion}: Tabla NO existe o error de acceso`)
      console.log(`   Error: ${error.message}`)
      return false
    } else {
      const registros = count || 0
      if (registros > 0) {
        console.log(`✅ ${descripcion}: ${registros} registros`)
        return true
      } else {
        console.log(`⚠️  ${descripcion}: Tabla existe pero SIN DATOS (${registros} registros)`)
        return false
      }
    }
  } catch (error) {
    console.log(`❌ ${descripcion}: Error verificando tabla`)
    console.log(`   Error: ${error.message}`)
    return false
  }
}

// Función para verificar datos específicos
async function verificarDatosEspecificos() {
  console.log('\n📊 VERIFICANDO DATOS ESPECÍFICOS:\n')

  // Verificar entidades
  try {
    const { data: entidades, error } = await supabase
      .from('entidades')
      .select('id, nombre, tipo_entidad')
      .limit(5)

    if (error) {
      console.log('❌ No se pudieron cargar entidades')
    } else if (entidades.length > 0) {
      console.log('✅ Entidades encontradas:')
      entidades.forEach(e => console.log(`   - ${e.nombre} (${e.tipo_entidad})`))
    }
  } catch (error) {
    console.log('❌ Error consultando entidades')
  }

  // Verificar delegados
  try {
    const { data: delegados, error } = await supabase
      .from('delegados_lopivi')
      .select('id, nombre_completo, tipo, certificacion_vigente')
      .limit(5)

    if (error) {
      console.log('❌ No se pudieron cargar delegados')
    } else if (delegados.length > 0) {
      console.log('✅ Delegados encontrados:')
      delegados.forEach(d => console.log(`   - ${d.nombre_completo} (${d.tipo}) - Cert: ${d.certificacion_vigente ? 'Vigente' : 'No vigente'}`))
    }
  } catch (error) {
    console.log('❌ Error consultando delegados')
  }
}

// Función principal
async function main() {
  console.log(`🔗 Conectando a: ${supabaseUrl}`)

  // Verificar tablas principales
  const tablasEsenciales = [
    ['entidades', 'Entidades registradas'],
    ['delegados_lopivi', 'Delegados LOPIVI'],
    ['personal_entidad', 'Personal de entidades'],
    ['casos_lopivi', 'Casos LOPIVI'],
    ['formacion_personal_lopivi', 'Formación del personal'],
    ['cumplimiento_lopivi', 'Elementos de cumplimiento'],
    ['tarjetas_delegados', 'Tarjetas de pago guardadas'],
    ['transacciones_pagos', 'Transacciones de pago']
  ]

  console.log('📋 VERIFICANDO TABLAS PRINCIPALES:\n')

  let tablasOK = 0
  let tablasConDatos = 0

  for (const [tabla, descripcion] of tablasEsenciales) {
    const tieneTabla = await verificarTabla(tabla, descripcion)
    if (tieneTabla) {
      tablasOK++
      tablasConDatos++
    } else {
      tablasOK++ // tabla existe pero sin datos
    }
  }

  await verificarDatosEspecificos()

  // Resumen final
  console.log('\n' + '='.repeat(60))
  console.log('📈 RESUMEN PARA PRODUCCIÓN:')
  console.log('='.repeat(60))

  if (tablasConDatos === tablasEsenciales.length) {
    console.log('✅ LISTO PARA PRODUCCIÓN: Todas las tablas tienen datos')
    console.log('🚀 Los cuadros del dashboard mostrarán datos reales')
  } else if (tablasOK === tablasEsenciales.length) {
    console.log('⚠️  PARCIALMENTE LISTO: Tablas creadas pero faltan datos')
    console.log('📝 Necesitas insertar datos iniciales en las tablas vacías')
    console.log('💡 Los cuadros seguirán en modo demo hasta que agregues datos')
  } else {
    console.log('❌ NO LISTO: Faltan tablas en la base de datos')
    console.log('📋 Ejecuta el archivo database/schema.sql en Supabase')
  }

  console.log('\n🔧 PRÓXIMOS PASOS:')
  if (tablasConDatos < tablasEsenciales.length) {
    console.log('1. Ejecuta: database/schema.sql en el editor SQL de Supabase')
    console.log('2. Inserta datos de prueba o reales en las tablas')
    console.log('3. Verifica que .env.local tenga las keys correctas')
    console.log('4. Reinicia: bun run dev')
  } else {
    console.log('1. Reinicia: bun run dev')
    console.log('2. Los cuadros mostrarán "BD: Conectado" en lugar de "BD: Error"')
  }
}

// Ejecutar
main().catch(console.error)
