#!/usr/bin/env bun

import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

async function createBucket() {
  try {
    console.log('📦 Creando bucket "docs" en Supabase Storage...')

    // Intentar crear el bucket
    const { data, error } = await supabase.storage.createBucket('docs', {
      public: true,
      fileSizeLimit: 52428800, // 50MB
    })

    if (error) {
      if (error.message.includes('already exists')) {
        console.log('✅ El bucket "docs" ya existe')
        return true
      }
      throw error
    }

    console.log('✅ Bucket "docs" creado exitosamente')
    console.log('Configuración:')
    console.log('  - Público: true')
    console.log('  - Tamaño máximo: 50MB')

    return true
  } catch (error: any) {
    console.error('❌ Error creando bucket:', error.message)
    return false
  }
}

createBucket()
