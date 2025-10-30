import { createClient } from '@supabase/supabase-js'

async function debugToken() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!supabaseUrl || !supabaseServiceKey) {
    console.error('❌ Variables de Supabase no configuradas')
    process.exit(1)
  }

  const supabase = createClient(supabaseUrl, supabaseServiceKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  })

  console.log('\n🔍 === DIAGNÓSTICO DE TOKENS ===\n')

  // 1. Verificar si existe la entidad demo
  console.log('1️⃣ Verificando entidad demo...')
  const { data: demoEntity, error: entityError } = await supabase
    .from('entities')
    .select('*')
    .eq('id', '00000000-0000-0000-0000-000000000001')
    .single()

  if (entityError) {
    console.error('❌ Error:', entityError.message)
  } else if (demoEntity) {
    console.log('✅ Entidad demo encontrada:')
    console.log('   - ID:', demoEntity.id)
    console.log('   - Nombre:', demoEntity.nombre)
    console.log('   - Sector:', demoEntity.sector_code)
  } else {
    console.log('⚠️  Entidad demo NO encontrada')
  }

  // 2. Listar todos los tokens
  console.log('\n2️⃣ Listando todos los tokens...')
  const { data: allTokens, error: tokensError } = await supabase
    .from('entity_invite_tokens')
    .select('*')
    .order('created_at', { ascending: false })

  if (tokensError) {
    console.error('❌ Error:', tokensError.message)
  } else if (allTokens && allTokens.length > 0) {
    console.log(`✅ ${allTokens.length} token(s) encontrado(s):`)
    allTokens.forEach((token, i) => {
      console.log(`\n   Token #${i + 1}:`)
      console.log('   - Token:', token.token)
      console.log('   - Entity ID:', token.entity_id)
      console.log('   - Active:', token.active)
      console.log('   - Created:', token.created_at)
      console.log('   - Expires:', token.expires_at)
    })
  } else {
    console.log('⚠️  NO hay tokens en la base de datos')
  }

  // 3. Verificar estructura de la tabla
  console.log('\n3️⃣ Verificando estructura de entity_invite_tokens...')
  const { data: sampleToken } = await supabase
    .from('entity_invite_tokens')
    .select('*')
    .limit(1)
    .single()

  if (sampleToken) {
    console.log('✅ Columnas disponibles:')
    console.log('   ', Object.keys(sampleToken).join(', '))
  }

  console.log('\n🏁 === FIN DEL DIAGNÓSTICO ===\n')
}

debugToken().catch(console.error)
