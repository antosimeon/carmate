'use client'
import { useEffect, useMemo, useState } from 'react'
import { listExpenses } from '@/features/expenses/api'
import { useVehicle } from '@/providers/VehicleProvider'
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from 'recharts'

type Mode = 'yearly' | 'monthly'

type Exp = {
  id: string
  amount: number
  date?: string // YYYY-MM-DD
  category?: string
}

/* ---------- helpers ---------- */
const monthsIT = ['Gen','Feb','Mar','Apr','Mag','Giu','Lug','Ago','Set','Ott','Nov','Dic']

function getYear(d?: string) {
  if (!d) return undefined
  const y = Number(d.slice(0, 4))
  return Number.isFinite(y) ? y : undefined
}
function getMonthIdx(d?: string) {
  if (!d) return undefined
  const m = Number(d.slice(5, 7))
  return Number.isFinite(m) ? m - 1 : undefined
}

/* ---------- component ---------- */
export default function StatsOverview() {
  const { activeId } = useVehicle()
  const [expenses, setExpenses] = useState<Exp[]>([])
  const [mode, setMode] = useState<Mode>('monthly')
  const [year, setYear] = useState<number | undefined>(undefined)

  // carica spese del veicolo selezionato
  useEffect(() => {
    let alive = true
    ;(async () => {
      const data = await listExpenses(activeId)
      if (!alive) return
      setExpenses(data as any)
    })().catch(() => setExpenses([]))
    return () => {
      alive = false
    }
  }, [activeId])

  // anni disponibili dai dati
  const years = useMemo(() => {
    const s = new Set<number>()
    for (const e of expenses) {
      const y = getYear(e.date)
      if (y) s.add(y)
    }
    const arr = [...s].sort((a, b) => a - b)
    return arr
  }, [expenses])

  // imposta anno di default: ultimo disponibile
  useEffect(() => {
    if (years.length && (year == null || !years.includes(year))) {
      setYear(years[years.length - 1])
    }
  }, [years, year])

  // dataset per grafico
  const data = useMemo(() => {
    if (mode === 'yearly') {
      // somma per anno (tutti gli anni)
      const map: Record<number, number> = {}
      for (const e of expenses) {
        const y = getYear(e.date)
        if (!y) continue
        map[y] = (map[y] || 0) + Number(e.amount || 0)
      }
      return Object.entries(map)
        .sort((a, b) => Number(a[0]) - Number(b[0]))
        .map(([y, v]) => ({ label: y, totale: Number(v.toFixed(2)) }))
    }
    // mode === 'monthly' → 12 mesi dell'anno selezionato
    const arr = Array.from({ length: 12 }, (_, i) => ({ label: monthsIT[i], totale: 0 }))
    if (year) {
      for (const e of expenses) {
        const y = getYear(e.date)
        if (y !== year) continue
        const m = getMonthIdx(e.date)
        if (m == null) continue
        arr[m].totale += Number(e.amount || 0)
      }
    }
    return arr.map(r => ({ ...r, totale: Number(r.totale.toFixed(2)) }))
  }, [mode, year, expenses])

  const total = useMemo(
    () => expenses.reduce((s, e) => s + Number(e.amount || 0), 0),
    [expenses]
  )

  return (
    <div className="space-y-6">
      {/* filtro + KPI semplice */}
      <div className="card p-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="text-sm text-[color:var(--text)]/60">Totale spese (tutte)</div>
            <div className="text-2xl font-semibold text-[var(--text)]">€{total.toFixed(2)}</div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <select
              className="input"
              value={mode}
              onChange={(e) => setMode(e.target.value as Mode)}
            >
              <option value="monthly">Mensile (per mese dell&apos;anno)</option>
              <option value="yearly">Annuale (per anno)</option>
            </select>

            {mode === 'monthly' && (
              <select
                className="input"
                value={year ?? ''}
                onChange={(e) =>
                  setYear(e.target.value ? Number(e.target.value) : undefined)
                }
              >
                {years.length === 0 && <option value="">—</option>}
                {years.map((y) => (
                  <option key={y} value={y}>
                    {y}
                  </option>
                ))}
              </select>
            )}
          </div>
        </div>
      </div>

      {/* grafico */}
      <div className="card p-4">
        <h3 className="text-base font-semibold mb-3">
          {mode === 'yearly' ? 'Spese per anno' : `Spese per mese${year ? ` · ${year}` : ''}`}
        </h3>

        <div style={{ width: '100%', height: 320 }}>
          <ResponsiveContainer>
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="label" />
              <YAxis />
              <Tooltip formatter={(v: any) => `€${Number(v).toFixed(2)}`} />
              <Bar dataKey="totale" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  )
}

