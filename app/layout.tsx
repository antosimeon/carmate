import './globals.css'
import type { Metadata } from 'next'
import { I18nProvider } from '@/components/I18nProvider'

export const metadata: Metadata = {
  title: 'CarMate',
  description: 'Car management made easy',
  icons: { icon: `${BASE}/favicon-carmate.png` },
  manifest: `${BASE}/manifest.json`, // ✅ add this
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <link rel="apple-touch-icon" href={`${BASE}/favicon-carmate.png`} />
      </head>
      <body>
        <I18nProvider>{children}</I18nProvider>
      </body>
    </html>
  )
}

