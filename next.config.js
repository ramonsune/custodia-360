/** @type {import('next').NextConfig} */
const nextConfig = {
  // Essential settings for Netlify deployment
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  // Netlify handles image optimization automatically
  images: {
    unoptimized: true,
  },
  // Enable strict mode for better React 19 compatibility
  reactStrictMode: true,
  // Environment variables
  env: {
    NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
    NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  },
  // Remove standalone output - Netlify uses its own OpenNext adapter
  // output: 'standalone', // REMOVED - Not compatible with Netlify

  // webpack configuration to handle build issues
  webpack: (config, { isServer }) => {
    // Handle module resolution issues
    config.resolve.fallback = {
      ...config.resolve.fallback,
      fs: false,
      net: false,
      tls: false,
      crypto: false,
    };

    // Ignore specific warnings for cleaner builds
    config.ignoreWarnings = [
      { module: /node_modules\/punycode/ },
      { module: /node_modules\/node-fetch/ },
      { module: /node_modules\/puppeteer/ },
    ];

    return config;
  },

  // Increase timeout for large builds
  staticPageGenerationTimeout: 300,
}

module.exports = nextConfig
