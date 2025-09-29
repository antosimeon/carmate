import Header from '@/components/Header'
import { VehicleProvider } from '@/providers/VehicleProvider'
import RequireAuth from '@/components/RequireAuth'
export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <RequireAuth>
      <VehicleProvider>
        <Header />
        <div className="mx-auto max-w-6xl px-4 py-6">{children}</div>
      </VehicleProvider>
    </RequireAuth>
  )
}
