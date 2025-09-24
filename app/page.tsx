'use client'

import { useEffect, useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabaseBrowser } from '@/lib/supabase'
import { format } from 'date-fns'

type Tab = 'vehicles' | 'reparations' | 'recurring-bills'

export default function Dashboard() {
  const router = useRouter()
  const sb = supabaseBrowser()

  const [tab, setTab] = useState<Tab>('vehicles')
  const [vehicles, setVehicles] = useState<any[]>([])
  const [rows, setRows] = useState<any[]>([])
  const [ready, setReady] = useState(false)

  // Load on tab change (after auth)
  useEffect(() => {
    ;(async () => {
      const { data: auth } = await sb.auth.getUser()
      if (!auth.user) { router.replace('/auth/login'); return }
      setReady(true)
      await loadVehicles()
      await loadTab()
    })()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tab])

  const loadVehicles = async () => {
    const { data, error } = await sb.from('vehicles').select('*').order('created_at', { ascending: false })
    if (error) { console.error(error); setVehicles([]); return }
    setVehicles(data || [])
  }

  const loadTab = async () => {
    let from = tab
    // DB table names map
    if (tab === 'recurring-bills') from = 'recurring_bills'
    const { data, error } = await sb.from(from).select('*').order('created_at', { ascending: false })
    if (error) { console.error(error); setRows([]); return }
    setRows(data || [])
  }

  const getDefaultHouseholdId = async () => {
    const { data: hh } = await sb.from('households').select('id').limit(1).single()
    return hh?.id ?? null
  }

  // CREATE
  const addVehicle = async (payload: any) => {
    const household_id = await getDefaultHouseholdId()
    const { error } = await sb.from('vehicles').insert({ ...payload, household_id })
    if (error) { console.error(error); return }
    await loadVehicles()
    if (tab === 'vehicles') await loadTab()
  }

  const addReparation = async (payload: any) => {
    const household_id = await getDefaultHouseholdId()
    const { error } = await sb.from('reparations').insert({ ...payload, household_id })
    if (error) { console.error(error); return }
    await loadTab()
  }

  const addRecurringBill = async (payload: any) => {
    const household_id = await getDefaultHouseholdId()
    const { error } = await sb.from('recurring_bills').insert({ ...payload, household_id })
    if (error) { console.error(error); return }
    await loadTab()
  }

  // DELETE
  const deleteVehicle = async (id: string) => {
    const { error } = await sb.from('vehicles').delete().eq('id', id)
    if (error) { console.error(error); return }
    await loadVehicles()
    if (tab === 'vehicles') await loadTab()
  }
  const deleteReparation = async (id: string) => {
    const { error } = await sb.from('reparations').delete().eq('id', id)
    if (error) { console.error(error); return }
    await loadTab()
  }
  const deleteRecurringBill = async (id: string) => {
    const { error } = await sb.from('recurring_bills').delete().eq('id', id)
    if (error) { console.error(error); return }
    await loadTab()
  }

  const logout = async () => {
    await sb.auth.signOut()
    router.replace('/auth/login')
  }

  return (
    <main className="p-6 max-w-5xl mx-auto">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-3xl font-bold">CarMate</h1>
        <button className="px-3 py-2 rounded border" onClick={logout}>Logout</button>
      </div>

      <div className="flex gap-2 mb-6">
        {(['vehicles','reparations','recurring-bills'] as Tab[]).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-3 py-2 rounded border ${tab === t ? 'bg-black text-white' : ''}`}
          >
            {t.replace('-', ' ')}
          </button>
        ))}
      </div>

      {!ready ? (
        <p className="text-sm text-gray-500">Checking session…</p>
      ) : (
        <>
          {tab === 'vehicles' && (
            <Vehicles
              data={rows}
              onAdd={addVehicle}
              onDelete={deleteVehicle}
            />
          )}
          {tab === 'reparations' && (
            <Reparations
              data={rows}
              vehicles={vehicles}
              onAdd={addReparation}
              onDelete={deleteReparation}
            />
          )}
          {tab === 'recurring-bills' && (
            <RecurringBills
              data={rows}
              vehicles={vehicles}
              onAdd={addRecurringBill}
              onDelete={deleteRecurringBill}
            />
          )}
        </>
      )}
    </main>
  )
}

/* ---------------- Components ---------------- */

function Vehicles({
  data,
  onAdd,
  onDelete,
}: {
  data: any[]
  onAdd: (p: any) => void
  onDelete: (id: string) => void
}) {
  const [nickname, setNickname] = useState('')
  const [make, setMake] = useState('')
  const [model, setModel] = useState('')
  const [plate, setPlate] = useState('')
  const clear = () => { setNickname(''); setMake(''); setModel(''); setPlate('') }

  return (
    <section className="space-y-4">
      <div className="grid gap-2 sm:grid-cols-4">
        <input className="border p-2 rounded" placeholder="Nickname" value={nickname} onChange={(e)=>setNickname(e.target.value)} />
        <input className="border p-2 rounded" placeholder="Make" value={make} onChange={(e)=>setMake(e.target.value)} />
        <input className="border p-2 rounded" placeholder="Model" value={model} onChange={(e)=>setModel(e.target.value)} />
        <input className="border p-2 rounded" placeholder="Plate" value={plate} onChange={(e)=>setPlate(e.target.value)} />
      </div>
      <button
        className="px-3 py-2 rounded bg-black text-white"
        onClick={() => {
          if (!nickname && !make && !model) return
          onAdd({ nickname, make, model, plate })
          clear()
        }}
      >
        Add vehicle
      </button>

      <ul className="divide-y">
        {data.map((v) => (
          <li key={v.id} className="py-3 flex items-center justify-between">
            <div>
              <b>{v.nickname || `${v.make || ''} ${v.model || ''}`}</b>
              <div className="text-sm text-gray-500">{[v.plate, v.year].filter(Boolean).join(' · ')}</div>
            </div>
            <button className="text-sm border px-2 py-1 rounded hover:bg-gray-50" onClick={() => onDelete(v.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </section>
  )
}

function Reparations({
  data,
  vehicles,
  onAdd,
  onDelete,
}: {
  data: any[]
  vehicles: any[]
  onAdd: (p: any) => void
  onDelete: (id: string) => void
}) {
  const [vehicleId, setVehicleId] = useState<string>('')
  const [title, setTitle] = useState('')
  const [cost, setCost] = useState<string>('')

  const vehicleMap = useMemo(() => Object.fromEntries(vehicles.map(v => [v.id, v])), [vehicles])

  return (
    <section className="space-y-4">
      <div className="grid gap-2 sm:grid-cols-[1fr_2fr_1fr_auto]">
        <select className="border p-2 rounded" value={vehicleId} onChange={e=>setVehicleId(e.target.value)}>
          <option value="">Select vehicle</option>
          {vehicles.map(v => (
            <option key={v.id} value={v.id}>{v.nickname || `${v.make || ''} ${v.model || ''}`}</option>
          ))}
        </select>
        <input className="border p-2 rounded" placeholder="Reparation title" value={title} onChange={e=>setTitle(e.target.value)} />
        <input className="border p-2 rounded" placeholder="Cost (e.g. 120.50)" value={cost} onChange={e=>setCost(e.target.value)} />
        <button
          className="px-3 py-2 rounded bg-black text-white"
          onClick={() => {
            if (!vehicleId || !title.trim()) return
            const amount = cost ? Number(cost) : null
            onAdd({ vehicle_id: vehicleId, title, amount })
            setTitle(''); setCost('')
          }}
        >
          Add
        </button>
      </div>

      <ul className="divide-y">
        {data.map((r) => (
          <li key={r.id} className="py-3 flex items-center justify-between">
            <div>
              <b>{r.title}</b> {typeof r.amount === 'number' ? `· €${r.amount.toFixed(2)}` : ''}
              <div className="text-sm text-gray-500">
                {vehicleMap[r.vehicle_id] ? (vehicleMap[r.vehicle_id].nickname || `${vehicleMap[r.vehicle_id].make||''} ${vehicleMap[r.vehicle_id].model||''}`) : '—'}
                {r.performed_at ? ` · ${format(new Date(r.performed_at), 'PPP')}` : ''}
              </div>
            </div>
            <button className="text-sm border px-2 py-1 rounded hover:bg-gray-50" onClick={() => onDelete(r.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </section>
  )
}

function RecurringBills({
  data,
  vehicles,
  onAdd,
  onDelete,
}: {
  data: any[]
  vehicles: any[]
  onAdd: (p: any) => void
  onDelete: (id: string) => void
}) {
  const [vehicleId, setVehicleId] = useState<string>('')
  const [title, setTitle] = useState('')
  const [amount, setAmount] = useState<string>('') // monthly amount
  const [interval, setInterval] = useState<'monthly'|'yearly'>('monthly')
  const [nextDue, setNextDue] = useState('')

  const vehicleLabel = (v:any) => v.nickname || `${v.make || ''} ${v.model || ''}`

  return (
    <section className="space-y-4">
      <div className="grid gap-2 sm:grid-cols-[1fr_2fr_1fr_1fr_1fr_auto]">
        <select className="border p-2 rounded" value={vehicleId} onChange={e=>setVehicleId(e.target.value)}>
          <option value="">Select vehicle</option>
          {vehicles.map(v => <option key={v.id} value={v.id}>{vehicleLabel(v)}</option>)}
        </select>
        <input className="border p-2 rounded" placeholder="Bill name (e.g. Insurance)" value={title} onChange={e=>setTitle(e.target.value)} />
        <input className="border p-2 rounded" placeholder="Amount (e.g. 50)" value={amount} onChange={e=>setAmount(e.target.value)} />
        <select className="border p-2 rounded" value={interval} onChange={e=>setInterval(e.target.value as any)}>
          <option value="monthly">Monthly</option>
          <option value="yearly">Yearly</option>
        </select>
        <input type="date" className="border p-2 rounded" value={nextDue} onChange={e=>setNextDue(e.target.value)} />
        <button
          className="px-3 py-2 rounded bg-black text-white"
          onClick={() => {
            if (!vehicleId || !title.trim() || !nextDue) return
            const amt = amount ? Number(amount) : null
            onAdd({ vehicle_id: vehicleId, title, amount: amt, interval, next_due: nextDue })
            setTitle(''); setAmount(''); setNextDue('')
          }}
        >
          Add
        </button>
      </div>

      <ul className="divide-y">
        {data.map((b) => (
          <li key={b.id} className="py-3 flex items-center justify-between">
            <div>
              <b>{b.title}</b>{typeof b.amount === 'number' ? ` · €${b.amount.toFixed(2)}` : ''}
              <div className="text-sm text-gray-500">
                {b.interval ? `${b.interval}` : ''}{b.next_due ? ` · next due ${format(new Date(b.next_due), 'PPP')}` : ''}
              </div>
            </div>
            <button className="text-sm border px-2 py-1 rounded hover:bg-gray-50" onClick={() => onDelete(b.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </section>
  )
}

