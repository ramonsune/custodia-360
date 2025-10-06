/** @type {import('next').NextConfig} */
const nextConfig = {
  // Dynamic Next.js app for Netlify

  // Build settings
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },

  // Image optimization for dynamic apps
  images: {
    unoptimized: true, // Required for Netlify deployment
  },

  // React strict mode
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

  // Experimental features configuration
  experimental: {},
}

module.exports = nextConfig
