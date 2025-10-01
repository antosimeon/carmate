'use client'
export const dynamic = 'force-static'

import { useMemo, useState } from 'react'
import { Car, Repeat } from 'lucide-react'

import Sidebar from '@/components/layout/Sidebar'
import VehicleSwitcher from '@/components/VehicleSwitcher'

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

import { ResponsiveContainer, ComposedChart, CartesianGrid, XAxis, YAxis, Tooltip, Legend, Bar, Line } from 'recharts'

type Tab = 'home' | 'vehicles' | 'expenses' | 'reminders' | 'stats'

export default function DashboardPage() {
  const [tab, setTab] = useState<Tab>('home')

  const { activeId } = useVehicle()
  const { data: expenses, reload: reloadExpenses } = useExpenses(activeId)
  const { data: allExpenses, reload: reloadAllExpenses } = useExpenses()
  const { data: vehicles, loading: vLoading, error: vError, create, remove } = useVehicles()
  const { data: reminders, create: rCreate, remove: rRemove, loading: rLoading, error: rError } = useReminders(activeId)

  // Helper: name by vehicle id
  const nameById = (id?: string) => {
    if (!id) return '—'
    const v = (vehicles || []).find((x: any) => x.id === id)
    return v ? (v.nickname || `${v.make || ''} ${v.model || ''}`) : '—'
  }

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

  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-[240px_1fr]">
      <Sidebar active={tab} onSelect={(t) => setTab(t as Tab)} />

      <section className="space-y-6">
        {/* KPI CARDS (solo Home) */}
        {tab === 'home' && (
          <div className="grid gap-4 sm:grid-cols-1 lg:grid-cols-2">
            <KpiCard
              title="Veicoli totali"
              value={String(vehicles?.length ?? 0)}
              icon={<Car size={18} />}
            >
              {vehicles && vehicles.length ? (
                <ul className="list-disc pl-4">
                  {vehicles.slice(0, 5).map((v: any) => (
                    <li key={v.id}>{v.nickname || `${v.make || ''} ${v.model || ''}`}</li>
                  ))}
                  {vehicles.length > 5 && (
                    <li>…e altri {vehicles.length - 5}</li>
                  )}
                </ul>
              ) : (
                <span className="text-[color:var(--text)]/60">Nessun veicolo</span>
              )}
            </KpiCard>

            <KpiCard
              title="Prossime scadenze (entro 30 giorni)"
              value={String(upcomingCount || '—')}
              icon={<Repeat size={18} />}
            >
              {(() => {
                const today = new Date()
                const limit = new Date()
                limit.setDate(today.getDate() + 30)
                const toISO = (d: Date) => d.toISOString().slice(0, 10)
                const min = toISO(today); const max = toISO(limit)
                const fmt = (iso: string) => { const [y,m,d] = iso.split('-'); return (y&&m&&d) ? `${d}-${m}-${y}` : iso }
                const label = (t: string) => ({insurance: 'Assicurazione', tax: 'Bollo', inspection: 'Revisione', service: 'Tagliando', other: 'Altro'} as any)[t] || t
                const items = (reminders || []).filter((r: any) => r.due_date >= min && r.due_date <= max).slice(0, 5)
                return items.length ? (
                  <ul className="list-disc pl-4">
                    {items.map((r: any) => (
                      <li key={r.id}>{label(r.type)} · {fmt(r.due_date)} · {nameById(r.vehicle_id)}</li>
                    ))}
                    {(reminders || []).filter((r: any) => r.due_date >= min && r.due_date <= max).length > 5 && (
                      <li>…e altre {(reminders || []).filter((r: any) => r.due_date >= min && r.due_date <= max).length - 5}</li>
                    )}
                  </ul>
                ) : (<span className="text-[color:var(--text)]/60">Nessuna scadenza</span>)
              })()}
            </KpiCard>
          </div>
        )}

        {/* HOME: spese recenti + grafico */}
        {tab === 'home' && (
          <>
            <div className="card p-4">
              <div className="mb-3 flex items-center justify-between">
                <h3 className="text-base font-semibold">Spese recenti</h3>
                <ExportCsvButton />
              </div>
              {!allExpenses?.length ? (
                <p className="text-sm text-[color:var(--text)]/60">Nessuna spesa</p>
              ) : (
                <ExpenseList data={allExpenses.slice(0, 10)} onReload={reloadAllExpenses} getVehicleName={nameById} />
              )}
            </div>

            <div className="card p-4">
              <h3 className="text-base font-semibold mb-3">Andamento spese (tutte le auto)</h3>
              {(() => {
                const byMonth: Record<string, any> = {}
                const label = (v: any) => v ? (v.nickname || `${v.make || ''} ${v.model || ''}`) : '—'
                const ordered = (allExpenses || []).slice().sort((a:any,b:any)=> (a.date||'').localeCompare(b.date||''))
                const months = new Set<string>()
                const add = (key:string, vehKey:string, amt:number) => { byMonth[key] = byMonth[key] || { month: key }; byMonth[key][vehKey] = (byMonth[key][vehKey]||0) + amt }
                for (const e of ordered) {
                  const d = e.date || ''
                  const m = d.slice(0,7) // yyyy-mm
                  if (!m) continue
                  months.add(m)
                  const v = (vehicles||[]).find((x:any)=> x.id === e.vehicle_id)
                  const vehKey = v ? (v.nickname || `${v.make||''} ${v.model||''}`) : '—'
                  add(m, vehKey, Number(e.amount)||0)
                }
                const data = Array.from(months).sort().map(m => {
                  const row:any = { month: `${m.slice(5,7)}-${m.slice(0,4)}` }
                  const obj = byMonth[m] || {}
                  let tot = 0
                  for (const k of Object.keys(obj)) if (k !== 'month') { row[k] = obj[k]; tot += obj[k] }
                  row['Totale'] = tot
                  return row
                })
                const vehNames = (vehicles||[]).map((v:any)=> label(v))
                const palette = ['#2563eb','#10b981','#f59e0b','#ef4444','#8b5cf6','#06b6d4','#84cc16']
                return data.length ? (
                  <div style={{ width: '100%', height: 300 }}>
                    <ResponsiveContainer>
                      <ComposedChart data={data}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="month" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        {vehNames.map((vn, i) => (
                          <Bar key={vn} dataKey={vn} stackId="a" barSize={12} fill={palette[i % palette.length]} radius={[4,4,0,0]} />
                        ))}
                        <Line type="monotone" dataKey="Totale" dot={false} strokeWidth={2} />
                      </ComposedChart>
                    </ResponsiveContainer>
                  </div>
                ) : (
                  <p className="text-sm text-[color:var(--text)]/60">Nessun dato disponibile</p>
                )
              })()}
            </div>
          </>
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
            <div className="mb-2"><VehicleSwitcher /></div>
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
          <div className="grid gap-4 lg:grid-cols-2">
            <div className="card p-4">
              <h3 className="text-base font-semibold mb-3">Aggiungi promemoria</h3>
              <ReminderForm onCreate={rCreate} />
            </div>
            <div className="card p-4">
              <h3 className="text-base font-semibold mb-3">Promemoria</h3>
              {rError && <p className="text-sm text-red-600">{rError}</p>}
              {rLoading ? (
                <p className="text-sm text-[color:var(--text)]/60">Caricamento…</p>
              ) : (
                <ReminderList data={reminders} onDelete={rRemove} />
              )}
            </div>
          </div>
        )}

        {/* STATISTICHE */}
        {tab === 'stats' && (
          <div className="space-y-3">
            <div className="mb-2"><VehicleSwitcher /></div>
            <div className="card p-4"><StatsOverview /></div>
          </div>
        )}
      </section>
    </div>
  )
}

/** Card KPI generica con slot opzionale per dettagli */
function KpiCard({ title, value, icon, children }: { title: string; value: string; icon: React.ReactNode; children?: React.ReactNode }) {
  return (
    <div className="card p-4">
      <div className="flex items-center gap-2 text-[color:var(--text)]/80">
        <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-[color:var(--accent)]/15 text-[color:var(--accent)]">
          {icon}
        </span>
        <span className="text-sm">{title}</span>
      </div>
      <div className="mt-2 text-2xl font-semibold text-[var(--text)]">{value}</div>
      {children ? (
        <div className="mt-2 text-sm text-[color:var(--text)]/70 space-y-1">
          {children}
        </div>
      ) : null}
    </div>
  )
}
