'use client'

import { usePathname } from 'next/navigation'

export default function ClientFooter() {
  const pathname = usePathname() || ''
  // Hide on any /auth/* route (works even with basePath like /carmate/auth/...)
  if (pathname.includes('/auth/')) return null

  return (
    <footer
      className="p-4 pt-4 text-center text-sm text-muted-foreground"
      style={{ paddingBottom: 'calc(env(safe-area-inset-bottom) + 16px)' }}
    >
      © {new Date().getFullYear()} Antonello Simeon
    </footer>
  )
}

