// next.config.js
const isGithubPages = process.env.GITHUB_PAGES === 'true';
const repo = 'carmate';

/** @type {import('next').NextConfig} */
module.exports = {
  // Needed for GitHub Pages
  output: 'export',
  trailingSlash: true,

  // Make next/image work with static export
  images: { unoptimized: true },

  // Prefix all routes and assets when deploying to GH Pages
  basePath: isGithubPages ? `/${repo}` : undefined,
  assetPrefix: isGithubPages ? `/${repo}/` : undefined,
,
  // Expose the base path to client code
  env: {
    NEXT_PUBLIC_BASE_PATH: isGithubPages ? `/${repo}` : ''
  }
};
