'use client'
import Sidebar from '@/components/layout/Sidebar'
import AddExpenseQuick from '@/features/expenses/components/AddExpenseQuick'
import { useVehicle } from '@/providers/VehicleProvider'
import { useExpenses } from '@/features/expenses/hooks/useExpenses'

export default function DashboardPage() {
  const { vehicles, activeId, setActiveId } = useVehicle()
  const { data: expenses } = useExpenses(activeId)

  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-[240px_1fr]">
      <Sidebar active="vehicles" onSelect={(tab)=>console.log('tab', tab)} />

      <section className="space-y-6">
        <div className="card p-4">
          <h3 className="text-base font-semibold mb-2">Aggiungi spesa rapida</h3>
          {activeId ? (
            <AddExpenseQuick vehicleId={activeId} />
          ) : (
            <p className="text-sm text-[color:var(--text)]/60">Aggiungi un veicolo per registrare spese.</p>
          )}
        </div>

        <div className="card p-4">
          <h3 className="text-base font-semibold mb-2">Spese recenti</h3>
          {!expenses?.length ? (
            <p className="text-sm text-[color:var(--text)]/60">Nessuna spesa</p>
          ) : (
            <ul className="divide-y" style={{ borderColor: 'var(--line)' }}>
              {expenses.slice(0,5).map((e:any)=>(
                <li key={e.id} className="py-3 flex items-center justify-between">
                  <div>
                    <b className="text-[var(--text)]">{e.category}</b>
                    <div className="text-sm text-[color:var(--text)]/60">
                      €{Number(e.amount).toFixed(2)} · {e.date}
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>
    </div>
  )
}
