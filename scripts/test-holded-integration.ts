import { holdedClient } from '../src/lib/holded-client'

async function testHoldedIntegration() {
  console.log('🧪 Testing Holded Integration...\n')
  console.log('=' .repeat(60))

  try {
    // 1. Verificar conexión con Holded API
    console.log('\n1️⃣ Verificando conexión con Holded API...')
    const connected = await holdedClient.verifyConnection()

    if (!connected) {
      console.error('❌ Error: No se pudo conectar a Holded API')
      console.error('   Verifica que HOLDED_API_KEY esté configurada correctamente')
      return
    }

    console.log('✅ Conexión con Holded API exitosa\n')

    // 2. Crear contacto de prueba
    console.log('2️⃣ Creando contacto de prueba en Holded...')
    const testContactId = await holdedClient.upsertContact({
      name: 'Test Custodia360',
      email: 'test@custodia360.es',
      code: 'B12345678',
      tradename: 'Test Entity - Custodia360',
      address: 'Calle Test 123, Madrid',
      phone: '+34 612 345 678',
    })

    if (!testContactId) {
      console.error('❌ Error creando contacto de prueba')
      return
    }

    console.log(`✅ Contacto creado exitosamente`)
    console.log(`   ID: ${testContactId}`)
    console.log(`   Nombre: Test Custodia360`)
    console.log(`   Email: test@custodia360.es\n`)

    // 3. Crear factura de prueba
    console.log('3️⃣ Creando factura de prueba en Holded...')
    const testInvoice = await holdedClient.createInvoice({
      contactId: testContactId,
      contactName: 'Test Custodia360',
      contactCode: 'B12345678',
      date: Math.floor(Date.now() / 1000),
      items: [
        {
          name: 'Plan 250 - Primer Pago (TEST)',
          desc: 'Prueba de integración Holded + Stripe + Custodia360',
          units: 1,
          subtotal: 100.00, // Sin IVA
          discount: 0,
          tax: 21, // 21% IVA
        },
        {
          name: 'Kit de Comunicación LOPIVI (TEST)',
          desc: 'Material profesional de comunicación',
          units: 1,
          subtotal: 40.00,
          discount: 0,
          tax: 21,
        },
      ],
      desc: 'Factura de prueba - Integración Custodia360',
      notes: 'Esta es una factura de prueba generada automáticamente.\nPuede eliminarse desde el Dashboard de Holded.',
    })

    if (!testInvoice) {
      console.error('❌ Error creando factura de prueba')
      return
    }

    console.log('✅ Factura creada exitosamente')
    console.log(`   Número: ${testInvoice.docNumber}`)
    console.log(`   ID: ${testInvoice.id}`)
    console.log(`   Subtotal: ${testInvoice.subtotal}€`)
    console.log(`   IVA (21%): ${testInvoice.tax}€`)
    console.log(`   Total: ${testInvoice.total}€`)
    console.log(`   Estado: ${testInvoice.status}\n`)

    // 4. Resumen final
    console.log('=' .repeat(60))
    console.log('\n🎉 TESTING COMPLETADO EXITOSAMENTE\n')
    console.log('📋 Próximos pasos:')
    console.log('   1. Ir a https://app.holded.com/invoicing/contacts')
    console.log('      → Verificar que aparece "Test Custodia360"')
    console.log('')
    console.log('   2. Ir a https://app.holded.com/invoicing/invoices')
    console.log(`      → Verificar que aparece factura: ${testInvoice.docNumber}`)
    console.log('')
    console.log('   3. Click en la factura y descargar PDF')
    console.log('')
    console.log('   4. IMPORTANTE: Eliminar el contacto y factura de prueba')
    console.log('      desde Holded Dashboard (no son reales)')
    console.log('')
    console.log('   5. Una vez verificado, la integración está lista para')
    console.log('      procesar pagos reales de Stripe → Holded')
    console.log('')
    console.log('=' .repeat(60))

  } catch (error: any) {
    console.error('\n❌ ERROR en testing:')
    console.error(`   ${error.message}`)
    console.error('\n📋 Troubleshooting:')
    console.error('   - Verifica que HOLDED_API_KEY está configurada en .env.local')
    console.error('   - Verifica que la API Key es válida en Holded Dashboard')
    console.error('   - Revisa los logs anteriores para más detalles')
  }
}

// Ejecutar test
testHoldedIntegration()
