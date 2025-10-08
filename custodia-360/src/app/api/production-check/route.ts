import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function GET() {
  try {
    console.log('🔍 VERIFICACIÓN DE PRODUCCIÓN INICIADA')

    const results = {
      timestamp: new Date().toISOString(),
      production_ready: true,
      checks: {
        supabase: { status: 'testing', details: null },
        resend: { status: 'testing', details: null },
        database: { status: 'testing', details: null },
        environment: { status: 'testing', details: null }
      },
      errors: []
    }

    // 1. Verificar variables de entorno críticas
    console.log('📋 Verificando variables de entorno...')
    const requiredEnvs = [
      'NEXT_PUBLIC_SUPABASE_URL',
      'NEXT_PUBLIC_SUPABASE_ANON_KEY',
      'SUPABASE_SERVICE_ROLE_KEY',
      'RESEND_API_KEY',
      'RESEND_FROM_EMAIL'
    ]

    const missingEnvs = requiredEnvs.filter(env => !process.env[env])

    if (missingEnvs.length > 0) {
      results.checks.environment = {
        status: 'error',
        details: `Variables faltantes: ${missingEnvs.join(', ')}`
      }
      results.production_ready = false
      results.errors.push('Variables de entorno incompletas')
    } else {
      results.checks.environment = {
        status: 'success',
        details: 'Todas las variables de entorno configuradas'
      }
    }

    // 2. Test Supabase Connection
    console.log('🗄️ Probando conexión Supabase...')
    try {
      const { data: testData, error: supabaseError } = await supabase
        .from('entidades')
        .select('id, nombre')
        .limit(1)

      if (supabaseError) {
        throw supabaseError
      }

      results.checks.supabase = {
        status: 'success',
        details: `Conexión exitosa. Datos disponibles: ${testData?.length || 0} registros`
      }
      console.log('✅ Supabase conectado')
    } catch (error) {
      results.checks.supabase = {
        status: 'error',
        details: `Error de conexión: ${(error as Error).message}`
      }
      results.production_ready = false
      results.errors.push('Supabase no conectado')
      console.error('❌ Supabase error:', error)
    }

    // 3. Test Database Schema
    console.log('📊 Verificando esquema de base de datos...')
    try {
      const requiredTables = ['entidades', 'delegados', 'casos', 'audit_logs']
      const tableChecks = []

      for (const table of requiredTables) {
        try {
          const { data, error } = await supabase
            .from(table)
            .select('*')
            .limit(1)

          if (error && !error.message.includes('permission denied')) {
            throw error
          }

          tableChecks.push({ table, status: 'exists', count: data?.length || 0 })
        } catch (error) {
          tableChecks.push({ table, status: 'missing', error: (error as Error).message })
          results.production_ready = false
          results.errors.push(`Tabla ${table} no disponible`)
        }
      }

      results.checks.database = {
        status: tableChecks.every(t => t.status === 'exists') ? 'success' : 'error',
        details: tableChecks
      }
      console.log('✅ Esquema verificado')
    } catch (error) {
      results.checks.database = {
        status: 'error',
        details: `Error verificando esquema: ${(error as Error).message}`
      }
      results.production_ready = false
      results.errors.push('Error en esquema de base de datos')
    }

    // 4. Test Resend (solo verificar si la key parece válida)
    console.log('📧 Verificando configuración Resend...')
    const resendKey = process.env.RESEND_API_KEY
    const resendEmail = process.env.RESEND_FROM_EMAIL

    if (!resendKey || resendKey.includes('PRODUCTION') || resendKey.includes('example')) {
      results.checks.resend = {
        status: 'warning',
        details: 'API Key de Resend parece ser de ejemplo. Reemplazar con clave real.'
      }
      results.errors.push('Resend API Key no configurada')
    } else if (!resendEmail || !resendEmail.includes('@')) {
      results.checks.resend = {
        status: 'error',
        details: 'Email FROM de Resend no válido'
      }
      results.production_ready = false
      results.errors.push('Email FROM de Resend no configurado')
    } else {
      results.checks.resend = {
        status: 'success',
        details: `Configurado para enviar desde: ${resendEmail}`
      }
    }

    // 5. Verificar que los delegados de demo existan
    console.log('👥 Verificando delegados de demo...')
    try {
      const { data: delegados, error } = await supabase
        .from('delegados')
        .select('email, tipo, estado')
        .in('email', ['maria.garcia@clubdeportivo.com', 'carlos.rodriguez@clubdeportivo.com'])

      if (error) throw error

      const principalExists = delegados?.some(d => d.email === 'maria.garcia@clubdeportivo.com' && d.tipo === 'principal')
      const suplenteExists = delegados?.some(d => d.email === 'carlos.rodriguez@clubdeportivo.com' && d.tipo === 'suplente')

      if (!principalExists || !suplenteExists) {
        results.errors.push('Delegados de demo no encontrados en base de datos')
        results.production_ready = false
      }
    } catch (error) {
      console.warn('⚠️ No se pudieron verificar delegados:', error)
    }

    console.log(`🎯 VERIFICACIÓN COMPLETADA - Ready: ${results.production_ready}`)

    return NextResponse.json({
      ...results,
      message: results.production_ready
        ? '🟢 SISTEMA LISTO PARA PRODUCCIÓN'
        : '🔴 SISTEMA NO LISTO - Revisar errores',
      next_steps: results.production_ready
        ? ['Deploy a Netlify', 'Configurar dominio', 'Monitorear logs']
        : ['Configurar Supabase real', 'Configurar Resend real', 'Ejecutar SQL setup']
    })

  } catch (error) {
    console.error('❌ Error en verificación de producción:', error)
    return NextResponse.json({
      production_ready: false,
      error: 'Error crítico en verificación',
      details: error instanceof Error ? error.message : 'Error desconocido',
      timestamp: new Date().toISOString()
    }, { status: 500 })
  }
}
