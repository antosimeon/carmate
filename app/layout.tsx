import './globals.css'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'CarMate',
  description: 'Manage your cars, recipes & reminders with family'
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}

