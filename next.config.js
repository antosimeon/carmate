/** @type {import('next').NextConfig} */
const isPages = process.env.GITHUB_PAGES === 'true'
const repo = process.env.GITHUB_REPOSITORY?.split('/')[1] || 'carmate'

module.exports = {
  output: 'export',
  images: { unoptimized: true },
  trailingSlash: true,
  // IMPORTANT: basePath affects routes; assetPrefix affects static assets
  basePath: isPages ? `/${repo}` : undefined,
  assetPrefix: isPages ? `/${repo}/` : undefined,
}

