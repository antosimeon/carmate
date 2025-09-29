/** @type {import('next').NextConfig} */
const REPO = 'carmate'
const isProd = process.env.NODE_ENV === 'production'

const nextConfig = {
  output: 'export',         // per GitHub Pages
  basePath: isProd ? `/${REPO}` : '',
  images: { unoptimized: true }
}

module.exports = nextConfig
