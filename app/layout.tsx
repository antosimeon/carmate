import './globals.css'
import type { Metadata } from 'next'
import { I18nProvider } from '@/components/I18nProvider'

export const metadata: Metadata = {
  title: 'CarMate',
  description: 'Car management made easy',
  icons: {
    icon: '/favicon-carmate.png',   // ✅ favicon path
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <I18nProvider>{children}</I18nProvider>
      </body>
    </html>
  )
}

