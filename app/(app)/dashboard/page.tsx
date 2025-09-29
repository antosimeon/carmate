'use client'
export const dynamic = 'force-static'

import { useMemo, useState } from 'react'
import { Car, Repeat, Wrench } from 'lucide-react'

import Sidebar from '@/components/layout/Sidebar'

import ExpenseForm from '@/features/expenses/components/ExpenseForm'
import ExpenseList from '@/features/expenses/components/ExpenseList'
import ExportCsvButton from '@/features/expenses/components/ExportCsvButton'
import StatsOverview from '@/features/stats/components/StatsOverview'

import { useVehicle } from '@/providers/VehicleProvider'
import { useExpenses } from '@/features/expenses/hooks/useExpenses'

import { useVehicles } from '@/features/vehicles/hooks/useVehicles'
import VehicleForm from '@/features/vehicles/components/VehicleForm'
import VehicleList from '@/features/vehicles/components/VehicleList'

import { useReminders } from '@/features/reminders/hooks/useReminders'
import ReminderForm from '@/features/reminders/components/ReminderForm'
import ReminderList from '@/features/reminders/components/ReminderList'

type Tab = 'home' | 'vehicles' | 'expenses' | 'reminders' | 'stats'

export default function DashboardPage() {
  const [tab, setTab] = useState<Tab>('home')

  const { activeId } = useVehicle()
  const { data: expenses, reload: reloadExpenses } = useExpenses(activeId)
  const { data: vehicles, loading: vLoading, error: vError, create, remove } = useVehicles()
  const { data: reminders, create: rCreate, remove: rRemove, loading: rLoading, error: rError } = useReminders()

  // KPI (solo Home)
  const upcomingCount = useMemo(() => {
    const today = new Date()
    const limit = new Date()
    limit.setDate(today.getDate() + 30)
    const toISO = (d: Date) => d.toISOString().slice(0, 10)
    const min = toISO(today)
    const max = toISO(limit)
    return (reminders || []).filter(r => r.due_date >= min && r.due_date <= max).length
  }, [reminders])

  const openRepairs: string | number = '—' // collega a tabella riparazioni quando pronta

  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-[240px_1fr]">
      <Sidebar active={tab} onSelect={(t) => setTab(t as Tab)} />

      <section className="space-y-6">
        {/* KPI CARDS (solo Home) */}
        {tab === 'home' && (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <KpiCard title="Veicoli totali" value={String(vehicles?.length ?? 0)} icon={<Car size={18} />} />
            <KpiCard title="Prossime scadenze" value={String(upcomingCount || '—')} icon={<Repeat size={18} />} />
            <KpiCard title="Riparazioni aperte" value={typeof openRepairs === 'number' ? String(openRepairs) : '—'} icon={<Wrench size={18} />} />
          </div>
        )}

        {/* HOME: spese recenti */}
        {tab === 'home' && (
          <div className="card p-4">
            <h3 className="text-base font-semibold mb-2">Spese recenti</h3>
            {!expenses?.length ? (
              <p className="text-sm text-[color:var(--text)]/60">Nessuna spesa</p>
            ) : (
              <ul className="divide-y" style={{ borderColor: 'var(--line)' }}>
                {expenses.slice(0, 5).map((e: any) => (
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
        )}

        {/* VEICOLI */}
        {tab === 'vehicles' && (
          <>
            <div className="card p-4">
              <h3 className="text-base font-semibold mb-3">Aggiungi veicolo</h3>
              <VehicleForm onCreate={create} />
              {vError && <p className="text-sm text-red-500 mt-2">{vError}</p>}
            </div>
            <div className="card p-4">
              <h3 className="text-base font-semibold mb-3">Elenco veicoli</h3>
              {vLoading ? (
                <p className="text-sm text-[color:var(--text)]/60">Caricamento…</p>
              ) : (
                <VehicleList data={vehicles || []} onDelete={remove} />
              )}
            </div>
          </>
        )}

        {/* SPESE */}
        {tab === 'expenses' && (
          <>
            <div className="flex items-center justify-between">
              <h3 className="text-base font-semibold mb-3">Spese</h3>
              <ExportCsvButton />
            </div>
            <div className="card p-4">
              {activeId ? (
                <ExpenseForm vehicleId={activeId} onCreated={reloadExpenses} />
              ) : (
                <p className="text-sm text-[color:var(--text)]/60">Seleziona un veicolo per aggiungere spese.</p>
              )}
              <ExpenseList data={expenses} onReload={reloadExpenses} />
            </div>
          </>
        )}

        {/* PROMEMORIA */}
        {tab === 'reminders' && (
          <>
            <div className="card p-4">
              <h3 className="text-base font-semibold mb-3">Nuovo promemoria</h3>
              <ReminderForm onCreate={rCreate} />
            </div>
            <div className="card p-4">
              <h3 className="text-base font-semibold mb-3">Promemoria</h3>
              {rLoading ? (
                <p className="text-sm text-[color:var(--text)]/60">Caricamento…</p>
              ) : (
                <ReminderList data={reminders} onDelete={rRemove} />
              )}
              {rError && <p className="text-sm text-red-500 mt-2">{rError}</p>}
            </div>
          </>
        )}

        {/* STATISTICHE (con Recharts e filtri) */}
        {tab === 'stats' && <StatsOverview />}
      </section>
    </div>
  )
}

/* ---------- UI bits ---------- */
function KpiCard({ title, value, icon }: { title: string; value: string; icon: React.ReactNode }) {
  return (
    <div className="card p-4">
      <div className="flex items-center gap-2 text-[color:var(--text)]/80">
        <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-[color:var(--accent)]/15 text-[color:var(--accent)]">
          {icon}
        </span>
        <span className="text-sm">{title}</span>
      </div>
      <div className="mt-2 text-2xl font-semibold text-[var(--text)]">{value}</div>
    </div>
  )
}

