/* eslint-disable */
import { createClient } from '@supabase/supabase-js'

async function checkSchema(){
  const url = process.env.SUPABASE_URL!
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY!
  if(!url||!key) throw new Error('Faltan credenciales SUPABASE')

  const supa = createClient(url, key, { auth: { persistSession:false } })

  // Intentar insertar y ver qué campos acepta entities
  console.log('Verificando schema de entities...')
  const { data, error } = await supa.from('entities').select('*').limit(1)

  if (error) {
    console.error('Error leyendo entities:', error)
  } else {
    console.log('Sample entity:', data?.[0] || 'No hay datos')
  }

  // Verificar entity_compliance
  console.log('\nVerificando schema de entity_compliance...')
  const { data: comp, error: eComp } = await supa.from('entity_compliance').select('*').limit(1)
  if (eComp) {
    console.error('Error leyendo entity_compliance:', eComp)
  } else {
    console.log('Sample compliance:', comp?.[0] || 'No hay datos')
  }

  // Verificar entity_people
  console.log('\nVerificando schema de entity_people...')
  const { data: people, error: ePeople } = await supa.from('entity_people').select('*').limit(1)
  if (ePeople) {
    console.error('Error leyendo entity_people:', ePeople)
  } else {
    console.log('Sample person:', people?.[0] || 'No hay datos')
  }
}

checkSchema().catch(e=>{ console.error('Error:', e?.message||e); process.exit(1) })
