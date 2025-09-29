// lib/basePath.ts
const REPO = 'carmate'

/**
 * BASE è il prefisso da usare su GitHub Pages (es. /carmate)
 * In locale resta stringa vuota.
 */
export const BASE =
  process.env.NEXT_PUBLIC_BASE_PATH ||
  (process.env.NODE_ENV === 'production' ? `/${REPO}` : '')

/** Helper per costruire i path degli asset (es. asset('/logo.png')) */
export const asset = (p: string) => `${BASE}${p.startsWith('/') ? p : `/${p}`}`

