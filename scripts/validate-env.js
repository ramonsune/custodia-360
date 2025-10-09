#!/usr/bin/env node

/**
 * Environment validation script for Custodia360
 * Ensures all required environment variables are present for production builds
 */

const requiredEnvVars = [
  'NEXT_PUBLIC_SUPABASE_URL',
  'NEXT_PUBLIC_SUPABASE_ANON_KEY',
  'SUPABASE_SERVICE_ROLE_KEY',
  'RESEND_API_KEY',
  'RESEND_FROM_EMAIL',
  'NEXT_PUBLIC_APP_URL',
  'CRON_SECRET_TOKEN',
  'PDFSHIFT_API_KEY'
];

const optionalEnvVars = [
  'DEMO_MODE',
  'BOE_MONITOREO_ACTIVO',
  'BOE_FRECUENCIA_DIAS',
  'AUDIT_RETENTION_YEARS',
  'AUDIT_TIMEZONE',
  'LOPIVI_COMPLIANCE_MODE'
];

console.log('🔍 Validating environment variables...');

let hasErrors = false;
const missing = [];
const present = [];

// Check required environment variables
requiredEnvVars.forEach(envVar => {
  if (!process.env[envVar]) {
    missing.push(envVar);
    hasErrors = true;
  } else {
    present.push(envVar);
  }
});

// Report results
console.log(`✅ Found ${present.length} required environment variables`);

if (missing.length > 0) {
  console.error('❌ Missing required environment variables:');
  missing.forEach(envVar => {
    console.error(`   - ${envVar}`);
  });
  console.error('\nPlease ensure all required environment variables are set in your netlify.toml or Netlify dashboard.');
  process.exit(1);
}

// Check optional variables (just for information)
const optionalPresent = optionalEnvVars.filter(envVar => process.env[envVar]);
const optionalMissing = optionalEnvVars.filter(envVar => !process.env[envVar]);

if (optionalPresent.length > 0) {
  console.log(`ℹ️  Found ${optionalPresent.length} optional environment variables`);
}

if (optionalMissing.length > 0) {
  console.log(`⚠️  Missing ${optionalMissing.length} optional environment variables (using defaults)`);
}

// Validate URL formats
if (process.env.NEXT_PUBLIC_SUPABASE_URL && !process.env.NEXT_PUBLIC_SUPABASE_URL.startsWith('https://')) {
  console.error('❌ NEXT_PUBLIC_SUPABASE_URL must start with https://');
  hasErrors = true;
}

if (process.env.NEXT_PUBLIC_APP_URL && !process.env.NEXT_PUBLIC_APP_URL.startsWith('https://')) {
  console.error('❌ NEXT_PUBLIC_APP_URL must start with https://');
  hasErrors = true;
}

// Validate email format
if (process.env.RESEND_FROM_EMAIL && !process.env.RESEND_FROM_EMAIL.includes('@')) {
  console.error('❌ RESEND_FROM_EMAIL must be a valid email address');
  hasErrors = true;
}

if (hasErrors) {
  console.error('\n❌ Environment validation failed');
  process.exit(1);
}

console.log('✅ All environment variables validated successfully');
console.log('🚀 Ready for production build');
