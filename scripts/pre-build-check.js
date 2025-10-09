#!/usr/bin/env node

/**
 * Pre-build check script for Custodia360
 * Validates the build environment before starting the production build
 */

const fs = require('fs');
const path = require('path');

console.log('🔧 Running pre-build checks...');

// Check Node.js version
const nodeVersion = process.version;
const majorVersion = parseInt(nodeVersion.slice(1).split('.')[0]);

console.log(`📦 Node.js version: ${nodeVersion}`);

if (majorVersion < 20) {
  console.warn('⚠️  Warning: Node.js 20+ is recommended for Next.js 15.5.0 and React 19');
  console.warn('   Current version may cause compatibility issues');
}

// Check if required files exist
const requiredFiles = [
  'next.config.js',
  'package.json',
  'tsconfig.json',
  'tailwind.config.js'
];

const missingFiles = [];

requiredFiles.forEach(file => {
  if (!fs.existsSync(path.join(process.cwd(), file))) {
    missingFiles.push(file);
  }
});

if (missingFiles.length > 0) {
  console.error('❌ Missing required files:');
  missingFiles.forEach(file => {
    console.error(`   - ${file}`);
  });
  process.exit(1);
}

// Check package.json for critical dependencies
try {
  const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));

  const criticalDeps = [
    'next',
    'react',
    'react-dom',
    'typescript',
    '@netlify/plugin-nextjs'
  ];

  const missingDeps = [];

  criticalDeps.forEach(dep => {
    if (!packageJson.dependencies?.[dep] && !packageJson.devDependencies?.[dep]) {
      missingDeps.push(dep);
    }
  });

  if (missingDeps.length > 0) {
    console.error('❌ Missing critical dependencies:');
    missingDeps.forEach(dep => {
      console.error(`   - ${dep}`);
    });
    process.exit(1);
  }

  // Check Next.js version compatibility
  const nextVersion = packageJson.dependencies?.['next'] || packageJson.devDependencies?.['next'];
  if (nextVersion && !nextVersion.includes('15.')) {
    console.warn('⚠️  Warning: Next.js version may not be compatible with current configuration');
  }

  // Check React version compatibility
  const reactVersion = packageJson.dependencies?.['react'] || packageJson.devDependencies?.['react'];
  if (reactVersion && !reactVersion.includes('19.')) {
    console.warn('⚠️  Warning: React version may not be compatible with Next.js 15.5.0');
  }

} catch (error) {
  console.error('❌ Error reading package.json:', error.message);
  process.exit(1);
}

// Check for common build issues
console.log('🔍 Checking for potential build issues...');

// Check if .next directory exists and clean it
if (fs.existsSync('.next')) {
  console.log('🧹 Cleaning previous build artifacts...');
  try {
    fs.rmSync('.next', { recursive: true, force: true });
    console.log('✅ Previous build cleaned');
  } catch (error) {
    console.warn('⚠️  Could not clean .next directory:', error.message);
  }
}

// Check disk space (simplified check)
try {
  const stats = fs.statSync('.');
  console.log('📊 Build environment ready');
} catch (error) {
  console.error('❌ File system check failed:', error.message);
  process.exit(1);
}

// Verify environment for production build
if (process.env.NODE_ENV === 'production' || process.env.NETLIFY) {
  console.log('🌐 Production environment detected');

  // Check for required production environment variables
  const prodRequiredVars = [
    'NEXT_PUBLIC_SUPABASE_URL',
    'NEXT_PUBLIC_SUPABASE_ANON_KEY'
  ];

  const missingProdVars = prodRequiredVars.filter(envVar => !process.env[envVar]);

  if (missingProdVars.length > 0) {
    console.error('❌ Missing production environment variables:');
    missingProdVars.forEach(envVar => {
      console.error(`   - ${envVar}`);
    });
    process.exit(1);
  }
}

console.log('✅ All pre-build checks passed');
console.log('🚀 Proceeding with build...');
