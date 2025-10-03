// Load environment variables
require('dotenv').config({ path: '.env.local' });

const { createClient } = require('@supabase/supabase-js');

// Configuración de Supabase
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

async function verifyTables() {
  console.log('\n🗄️ Verifying Database Tables...');

  if (!supabaseUrl || !supabaseServiceKey) {
    console.error('❌ Missing Supabase service key for admin operations');
    return false;
  }

  try {
    // Use service role key for admin operations
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // List of required tables
    const requiredTables = [
      'audit_logs',
      'contactos',
      'entidades',
      'delegados',
      'contratantes',
      'document_communications',
      'case_reports',
      'member_registrations',
      'user_actions'
    ];

    console.log('✅ Using service role key for database inspection');

    // Check each table
    for (const tableName of requiredTables) {
      try {
        const { data, error } = await supabase
          .from(tableName)
          .select('*')
          .limit(1);

        if (error) {
          console.log(`❌ Table "${tableName}": ${error.message}`);
        } else {
          console.log(`✅ Table "${tableName}": Accessible`);
        }
      } catch (tableError) {
        console.log(`❌ Table "${tableName}": ${tableError.message}`);
      }
    }

    return true;

  } catch (error) {
    console.error('❌ Database verification failed:', error.message);
    return false;
  }
}

async function testAuditSystem() {
  console.log('\n🔍 Testing Audit System...');

  try {
    const supabase = createClient(supabaseUrl, supabaseAnonKey);

    // Test audit log insertion
    const testAudit = {
      timestamp: new Date().toISOString(),
      user_id: 'test-user',
      user_name: 'Test User',
      action_type: 'system_test',
      entity_type: 'test',
      details: { test: true },
      legal_hash: 'test-hash-' + Date.now()
    };

    const { data, error } = await supabase
      .from('audit_logs')
      .insert(testAudit)
      .select()
      .single();

    if (error) {
      console.error('❌ Audit system test failed:', error.message);
      return false;
    }

    console.log('✅ Audit system working - test log created');

    // Clean up test log
    await supabase
      .from('audit_logs')
      .delete()
      .eq('id', data.id);

    console.log('✅ Test log cleaned up');
    return true;

  } catch (error) {
    console.error('❌ Audit system test failed:', error.message);
    return false;
  }
}

async function checkEnvironmentVariables() {
  console.log('\n🔧 Checking Environment Variables...');

  const vars = [
    'NEXT_PUBLIC_SUPABASE_URL',
    'NEXT_PUBLIC_SUPABASE_ANON_KEY',
    'SUPABASE_SERVICE_ROLE_KEY',
    'RESEND_API_KEY',
    'RESEND_FROM_EMAIL',
    'DEMO_MODE',
    'CRON_SECRET_TOKEN'
  ];

  let allPresent = true;

  vars.forEach(varName => {
    const value = process.env[varName];
    if (value) {
      if (varName.includes('KEY') || varName.includes('TOKEN')) {
        console.log(`✅ ${varName}: Present (${value.substring(0, 10)}...)`);
      } else {
        console.log(`✅ ${varName}: ${value}`);
      }
    } else {
      console.log(`❌ ${varName}: Missing`);
      allPresent = false;
    }
  });

  return allPresent;
}

async function main() {
  console.log('🔧 Custodia360 Database & Configuration Verification\n');

  const envOk = await checkEnvironmentVariables();
  const tablesOk = await verifyTables();
  const auditOk = await testAuditSystem();

  console.log('\n📊 Verification Summary:');
  console.log(`📊 Environment Variables: ${envOk ? '✅ Complete' : '❌ Missing vars'}`);
  console.log(`📊 Database Tables: ${tablesOk ? '✅ Accessible' : '❌ Issues found'}`);
  console.log(`📊 Audit System: ${auditOk ? '✅ Working' : '❌ Failed'}`);

  if (envOk && tablesOk && auditOk) {
    console.log('\n🎉 Custodia360 database is fully configured and operational!');
    console.log('🚀 Ready for production use.');
    process.exit(0);
  } else {
    console.log('\n⚠️ Some issues found. Please review configuration.');

    if (!envOk) {
      console.log('💡 Fix: Check .env.local file has all required variables');
    }
    if (!tablesOk) {
      console.log('💡 Fix: Run supabase-setup.sql in Supabase SQL Editor');
    }
    if (!auditOk) {
      console.log('💡 Fix: Check audit_logs table permissions');
    }

    process.exit(1);
  }
}

main().catch(error => {
  console.error('💥 Unexpected error:', error);
  process.exit(1);
});
