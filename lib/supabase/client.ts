import { createClient } from '@supabase/supabase-js'

// Cliente para uso en client components
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('❌ Variables de Supabase no configuradas')
}

export const supabaseClient = createClient(supabaseUrl, supabaseAnonKey)
