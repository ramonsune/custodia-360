/**
 * CUSTODIA360 - SETUP DEMO USERS
 * ================================
 * Script para crear/actualizar usuarios DEMO en Supabase Auth
 * y asignar roles en entity_user_roles
 *
 * Ejecución: bun run scripts/setup-demo-users.ts
 */

import { createClient } from '@supabase/supabase-js'

// Configuración
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!

if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
  console.error('❌ Faltan variables de entorno: NEXT_PUBLIC_SUPABASE_URL o SUPABASE_SERVICE_ROLE_KEY')
  process.exit(1)
}

// Cliente Supabase con service_role (Admin)
const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
})

// Definición de usuarios DEMO
const DEMO_USERS = [
  {
    email: 'entidad@custodia.com',
    password: '123',
    role: 'ENTIDAD',
    label: 'Representante Legal DEMO'
  },
  {
    email: 'delegado@custodia.com',
    password: '123',
    role: 'DELEGADO',
    label: 'Delegado Principal DEMO'
  },
  {
    email: 'delegados@custodia.com',
    password: '123',
    role: 'SUPLENTE',
    label: 'Delegado Suplente DEMO'
  },
  {
    email: 'ramon@custodia.com',
    password: '123',
    role: 'ADMIN',
    label: 'Administrador DEMO'
  }
]

const DEMO_ENTITY_ID = 'DEMO-ENTITY-001'

/**
 * Registrar en audit_log
 */
async function auditLog(action: string, details: any) {
  await supabase
    .from('audit_log')
    .insert({
      action,
      details,
      metadata: { source: 'setup-demo-users.ts' }
    })
}

/**
 * Crear o actualizar usuario DEMO en Supabase Auth
 */
async function upsertDemoUser(email: string, password: string, label: string) {
  console.log(`\n🔧 Procesando usuario: ${email}`)

  try {
    // 1. Intentar obtener usuario existente
    const { data: existingUsers, error: listError } = await supabase.auth.admin.listUsers()

    if (listError) {
      console.error(`❌ Error listando usuarios:`, listError)
      return null
    }

    const existingUser = existingUsers.users.find(u => u.email === email)

    if (existingUser) {
      console.log(`✅ Usuario existe: ${email} (id: ${existingUser.id})`)

      // Actualizar usuario existente
      const { data: updatedUser, error: updateError } = await supabase.auth.admin.updateUserById(
        existingUser.id,
        {
          password: password,
          email_confirm: true,
          user_metadata: {
            is_demo: true,
            label: label,
            updated_at: new Date().toISOString()
          }
        }
      )

      if (updateError) {
        console.error(`❌ Error actualizando usuario ${email}:`, updateError)
        return null
      }

      console.log(`✅ Usuario actualizado: ${email}`)
      return updatedUser.user

    } else {
      console.log(`🆕 Creando nuevo usuario: ${email}`)

      // Crear nuevo usuario
      const { data: newUser, error: createError } = await supabase.auth.admin.createUser({
        email: email,
        password: password,
        email_confirm: true,
        user_metadata: {
          is_demo: true,
          label: label,
          created_at: new Date().toISOString()
        }
      })

      if (createError) {
        console.error(`❌ Error creando usuario ${email}:`, createError)
        return null
      }

      console.log(`✅ Usuario creado: ${email} (id: ${newUser.user.id})`)
      return newUser.user
    }

  } catch (error) {
    console.error(`❌ Error procesando usuario ${email}:`, error)
    return null
  }
}

/**
 * Asignar rol a usuario en entity_user_roles
 */
async function assignRole(userId: string, email: string, role: string) {
  console.log(`🔐 Asignando rol ${role} a ${email}`)

  try {
    const { data, error } = await supabase
      .from('entity_user_roles')
      .upsert({
        entity_id: DEMO_ENTITY_ID,
        user_id: userId,
        role: role,
        enabled: true,
        is_demo: true,
        updated_at: new Date().toISOString()
      }, {
        onConflict: 'entity_id,user_id,role'
      })
      .select()

    if (error) {
      console.error(`❌ Error asignando rol ${role} a ${email}:`, error)
      return false
    }

    console.log(`✅ Rol ${role} asignado a ${email}`)
    return true

  } catch (error) {
    console.error(`❌ Error asignando rol:`, error)
    return false
  }
}

/**
 * Deshabilitar usuarios @custodia.com antiguos
 */
async function disableOldCustodiaUsers() {
  console.log(`\n🧹 Deshabilitando usuarios @custodia.com antiguos...`)

  const allowedEmails = DEMO_USERS.map(u => u.email)

  try {
    const { data: allUsers, error } = await supabase.auth.admin.listUsers()

    if (error) {
      console.error(`❌ Error listando usuarios:`, error)
      return
    }

    const usersToDisable = allUsers.users.filter(u =>
      u.email?.toLowerCase().includes('@custodia.com') &&
      !allowedEmails.includes(u.email!)
    )

    console.log(`📋 Usuarios a deshabilitar: ${usersToDisable.length}`)

    for (const user of usersToDisable) {
      console.log(`🚫 Deshabilitando: ${user.email}`)

      const { error: updateError } = await supabase.auth.admin.updateUserById(
        user.id,
        {
          ban_duration: '876000h', // 100 años (prácticamente permanente)
          user_metadata: {
            ...user.user_metadata,
            disabled_reason: 'Limpieza sistema DEMO - 2025-10-25',
            disabled_at: new Date().toISOString()
          }
        }
      )

      if (updateError) {
        console.error(`❌ Error deshabilitando ${user.email}:`, updateError)
      } else {
        console.log(`✅ Deshabilitado: ${user.email}`)
      }
    }

    // Registrar en audit_log
    await auditLog('demo.cleanup.users_disabled', {
      count: usersToDisable.length,
      emails: usersToDisable.map(u => u.email)
    })

  } catch (error) {
    console.error(`❌ Error en cleanup de usuarios:`, error)
  }
}

/**
 * MAIN - Ejecutar configuración completa
 */
async function main() {
  console.log('═'.repeat(80))
  console.log('🚀 CUSTODIA360 - SETUP DEMO USERS')
  console.log('═'.repeat(80))

  try {
    // Registrar inicio
    await auditLog('demo.users.setup_started', {
      timestamp: new Date().toISOString(),
      users: DEMO_USERS.length
    })

    // PASO 1: Deshabilitar usuarios antiguos @custodia.com
    await disableOldCustodiaUsers()

    // PASO 2: Crear/actualizar usuarios DEMO
    console.log('\n' + '─'.repeat(80))
    console.log('👤 CREANDO/ACTUALIZANDO USUARIOS DEMO')
    console.log('─'.repeat(80))

    const createdUsers: { email: string; userId: string; role: string }[] = []

    for (const demoUser of DEMO_USERS) {
      const user = await upsertDemoUser(demoUser.email, demoUser.password, demoUser.label)

      if (user) {
        createdUsers.push({
          email: demoUser.email,
          userId: user.id,
          role: demoUser.role
        })
      }

      // Pequeña pausa entre usuarios
      await new Promise(resolve => setTimeout(resolve, 500))
    }

    // PASO 3: Asignar roles
    console.log('\n' + '─'.repeat(80))
    console.log('🔐 ASIGNANDO ROLES A ENTIDAD DEMO')
    console.log('─'.repeat(80))

    for (const user of createdUsers) {
      await assignRole(user.userId, user.email, user.role)
      await new Promise(resolve => setTimeout(resolve, 300))
    }

    // Registrar finalización
    await auditLog('demo.users.setup_completed', {
      timestamp: new Date().toISOString(),
      users_created: createdUsers.length,
      users: createdUsers.map(u => ({ email: u.email, role: u.role }))
    })

    // RESUMEN FINAL
    console.log('\n' + '═'.repeat(80))
    console.log('✅ CONFIGURACIÓN DEMO COMPLETADA')
    console.log('═'.repeat(80))
    console.log('\n📊 RESUMEN:')
    console.log(`  • Usuarios creados/actualizados: ${createdUsers.length}`)
    console.log(`  • Entidad DEMO: ${DEMO_ENTITY_ID}`)
    console.log('\n👥 USUARIOS DEMO:')

    createdUsers.forEach(u => {
      console.log(`  • ${u.email.padEnd(30)} → ${u.role}`)
    })

    console.log('\n🔑 CREDENCIALES:')
    console.log('  • Password: 123 (para todos)')

    console.log('\n🔗 ACCESO:')
    console.log('  • ENTIDAD:   /dashboard-entidad')
    console.log('  • DELEGADO:  /dashboard-delegado')
    console.log('  • SUPLENTE:  /dashboard-suplente')
    console.log('  • ADMIN:     /admin')

    console.log('\n✅ Proceso finalizado correctamente\n')

  } catch (error) {
    console.error('\n❌ ERROR CRÍTICO:', error)

    await auditLog('demo.users.setup_failed', {
      timestamp: new Date().toISOString(),
      error: String(error)
    })

    process.exit(1)
  }
}

// Ejecutar
main()
