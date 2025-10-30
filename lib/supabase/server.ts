import { createClient } from '@supabase/supabase-js'

// ⚠️ SOLO USAR EN SERVER COMPONENTS Y API ROUTES
// NO importar en client components

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl) {
  throw new Error('❌ NEXT_PUBLIC_SUPABASE_URL no está configurada')
}

if (!supabaseServiceKey) {
  console.warn('⚠️ SUPABASE_SERVICE_ROLE_KEY no configurada. Usando anon key como fallback.')
}

// Cliente con service role para operaciones server-side
export const supabaseServer = createClient(
  supabaseUrl,
  supabaseServiceKey || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '',
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  }
)

// Helper para verificar conexión
export async function checkSupabaseConnection(): Promise<{ ok: boolean; error?: string }> {
  try {
    const { data, error } = await supabaseServer
      .from('entities')
      .select('id')
      .limit(1)
      .single()

    if (error && error.code !== 'PGRST116') { // PGRST116 = no rows, pero conexión ok
      return { ok: false, error: error.message }
    }

    return { ok: true }
  } catch (error) {
    return {
      ok: false,
      error: error instanceof Error ? error.message : 'Error desconocido'
    }
  }
}
