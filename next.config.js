/** @type {import('next').NextConfig} */
const isStrict = String(process.env.NEXT_BUILD_STRICT || "false") === "true"

const nextConfig = {
  // Build mode control: strict when NEXT_BUILD_STRICT=true
  eslint: {
    ignoreDuringBuilds: !isStrict,
  },
  typescript: {
    // Si NO estamos en estricto, no rompas la build por errores de TS
    ignoreBuildErrors: !isStrict,
  },
  // Recomendado en Netlify
  output: "standalone",
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

  // Redirects for legacy dashboard routes
  async redirects() {
    return [
      // Redirect old dashboard routes to new ones
      {
        source: '/dashboard-custodia',
        destination: '/dashboard-custodia360',
        permanent: true,
      },
      {
        source: '/dashboard-custodia/:path*',
        destination: '/dashboard-custodia360/:path*',
        permanent: true,
      },
      {
        source: '/dashboard-directo',
        destination: '/dashboard-custodia360',
        permanent: true,
      },
      {
        source: '/dashboard-automatizado',
        destination: '/dashboard-custodia360',
        permanent: true,
      },
      {
        source: '/dashboard-delegado-miembros',
        destination: '/dashboard-delegado/miembros-activos',
        permanent: true,
      },
      {
        source: '/panel-delegado',
        destination: '/dashboard-delegado',
        permanent: true,
      },
      {
        source: '/panel-delegado/:path*',
        destination: '/dashboard-delegado/:path*',
        permanent: true,
      },
    ]
  },
}

module.exports = nextConfig
