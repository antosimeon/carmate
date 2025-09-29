/** @type {import('next').NextConfig} */
const REPO = 'carmate'
const isProd = process.env.NODE_ENV === 'production'
const baseFromEnv = process.env.NEXT_PUBLIC_BASE_PATH

const nextConfig = {
  // Static export per GitHub Pages
  output: 'export',

  // BasePath e assetPrefix per servire asset e rotte sotto /<repo>
  basePath: isProd ? (baseFromEnv || `/${REPO}`) : '',
  assetPrefix: isProd ? (baseFromEnv || `/${REPO}/`) : undefined,

  images: { unoptimized: true },
  trailingSlash: true, // consigliato su Pages

  // Evita dipendenze Node-only nel bundle client (ws/bufferutil/utf-8-validate)
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        ws: false,
        'utf-8-validate': false,
        bufferutil: false,
      }
      config.resolve.alias = {
        ...(config.resolve.alias || {}),
        ws: false,
        'utf-8-validate': false,
        bufferutil: false,
      }
    }
    return config
  },

  experimental: { esmExternals: 'loose' },
}

module.exports = nextConfig

