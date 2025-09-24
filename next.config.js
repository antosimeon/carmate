/** @type {import('next').NextConfig} */
const isPages = process.env.GITHUB_PAGES === 'true'
const repo = process.env.GITHUB_REPOSITORY?.split('/')[1] || ''

module.exports = {
  output: 'export',
  images: { unoptimized: true },
  trailingSlash: true,
  // Serve assets from /<REPO>/ when building for Pages
  assetPrefix: isPages && repo ? `/${repo}/` : undefined,
}

