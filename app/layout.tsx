import './globals.css'
import type { Metadata } from 'next'
import Providers from './providers'
import Header from '@/components/Header'

export const metadata: Metadata = {
  title: 'CarMate',
  description: 'Gestisci veicoli, riparazioni e spese ricorrenti.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="it">
      <body className="min-h-screen">
        <Providers>
          <Header />
          <main className="mx-auto max-w-6xl px-4 py-6">{children}</main>
        </Providers>
      </body>
    </html>
  )
}

