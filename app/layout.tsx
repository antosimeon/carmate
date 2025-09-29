import './globals.css'
import { I18nProvider } from '@/components/I18nProvider'
import { asset } from '@/lib/basePath'

export const metadata = {
  title: 'CarMate',
  description: 'Car management made easy',
  icons: { icon: asset('/favicon-carmate.png') },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="it">
      <body>
        <I18nProvider>{children}</I18nProvider>
      </body>
    </html>
  )
}

