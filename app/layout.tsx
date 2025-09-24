import './globals.css'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'CarMate',
  description: 'Your vehicles, reparations, and recurring bills — all in one dashboard.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen">
        {/* Header */}
        <header className="sticky top-0 z-20 h-16 w-full bg-racing-red text-white shadow-soft">
          <div className="mx-auto flex h-full max-w-6xl items-center justify-between px-4">
            <div className="flex items-center gap-3">
              {/* tiny “badge” accent */}
              <span className="inline-block h-3 w-3 rounded-full bg-white/90 shadow" />
              <h1 className="text-lg font-semibold tracking-wide">CarMate</h1>
            </div>
            <span className="text-sm/none opacity-80">Racing Red</span>
          </div>
        </header>

        {/* Main content */}
        <main className="mx-auto max-w-6xl px-4 py-6">{children}</main>
      </body>
    </html>
  )
}

