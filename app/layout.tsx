import './globals.css'
import type { Metadata } from 'next'
import { I18nProvider } from '@/components/I18nProvider'
import ClientFooter from '@/components/ClientFooter'

const REPO = 'carmate'
const BASE =
  process.env.NEXT_PUBLIC_BASE_PATH ||
  (process.env.NODE_ENV === 'production' ? `/${REPO}` : '')

export const metadata: Metadata = {
  title: 'CarMate',
  description: 'Car management made easy',
  icons: { icon: `${BASE}/favicon-carmate.png` },
  manifest: `${BASE}/manifest.json`,
  themeColor: '#ffffff',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        {/* ✅ iOS safe-area support */}
        <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <link rel="apple-touch-icon" href={`${BASE}/favicon-carmate-192.png`} />
      </head>
      <body className="flex min-h-screen flex-col">
        <I18nProvider>
          <main className="flex-1">{children}</main>
          {/* Footer hides itself on /auth/* via ClientFooter and has safe-area padding */}
          <ClientFooter />
        </I18nProvider>
      </body>
    </html>
  )
}

