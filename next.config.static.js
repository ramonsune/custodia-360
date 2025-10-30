/** @type {import('next').NextConfig} */
const nextConfig = {
  // Static export configuration for Netlify
  output: 'export',
  trailingSlash: true,
  skipTrailingSlashRedirect: true,

  // Build settings
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },

  // Image optimization must be disabled for static export
  images: {
    unoptimized: true,
  },

  // Disable server-side features for static export
  reactStrictMode: true,

  // Environment variables
  env: {
    NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
    NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  },

  // webpack configuration
  webpack: (config, { isServer }) => {
    config.resolve.fallback = {
      ...config.resolve.fallback,
      fs: false,
      net: false,
      tls: false,
      crypto: false,
    };

    config.ignoreWarnings = [
      { module: /node_modules\/punycode/ },
      { module: /node_modules\/node-fetch/ },
      { module: /node_modules\/puppeteer/ },
    ];

    return config;
  },

  // Increase timeout for static generation
  staticPageGenerationTimeout: 300,

  // Ensure proper handling of dynamic imports
  swcMinify: true,

  // Disable experimental features that require server-side rendering
  experimental: {},
}

module.exports = nextConfig
