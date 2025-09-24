'use client'

import { useEffect, useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabaseBrowser } from '@/lib/supabase'
import { format } from 'date-fns'
import { Car, Wrench, Repeat, Settings, Plus, LogOut, Trash2 } from 'lucide-react'
import { useI18n } from '@/components/I18nProvider'

type Tab = 'vehicles' | 'reparations' | 'recurring-bills'

export default function Dashboard() {
  const router = useRouter()
  const sb = supabaseBrowser()
  const { t } = useI18n()

  const [tab, setTab] = useState<Tab>('vehicles')
  const [vehicles, setVehicles] = useState<any[]>([])
  const [rows, setRows] = useState<any[]>([])
  const [ready, setReady] = useState(false)

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
    <div className="grid grid-cols-1 gap-6 md:grid-cols-[240px_1fr]">
      {/* Sidebar */}
      <aside className="card p-4 bg-carbon-800">
        <nav className="space-y-1">
          <SidebarItem icon={<Car size={18} />} label={t('vehicles')} active={tab==='vehicles'} onClick={() => setTab('vehicles')} />
          <SidebarItem icon={<Wrench size={18} />} label={t('reparations')} active={tab==='reparations'} onClick={() => setTab('reparations')} />
          <SidebarItem icon={<Repeat size={18} />} label={t('recurring_bills')} active={tab==='recurring-bills'} onClick={() => setTab('recurring-bills')} />
          <div className="mt-4 border-t border-carbon-600 pt-3">
            <SidebarItem icon={<Settings size={18} />} label={t('settings')} disabled />
          </div>
        </nav>
        <button onClick={logout} className="btn btn-ghost mt-6 w-full justify-center text-sm text-white">
          <LogOut size={16} /> {t('logout')}
        </button>
      </aside>

      {/* Content */}
      <section className="space-y-6">
        {/* KPI Cards */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <KpiCard title={t('total_vehicles')} value={vehicles.length.toString()} icon={<Car size={18} />} />
          <KpiCard title={t('upcoming_bills')} value="—" icon={<Repeat size={18} />} />
          <KpiCard title={t('open_reparations')} value="—" icon={<Wrench size={18} />} />
        </div>

        {/* Panel */}
        <div className="card p-4">
          <PanelHeader tab={tab} />
          {tab === 'vehicles' && <Vehicles t={t} data={rows} onAdd={addVehicle} onDelete={deleteVehicle} />}
          {tab === 'reparations' && <Reparations t={t} data={rows} vehicles={vehicles} onAdd={addReparation} onDelete={deleteReparation} />}
          {tab === 'recurring-bills' && <RecurringBills t={t} data={rows} vehicles={vehicles} onAdd={addRecurringBill} onDelete={deleteRecurringBill} />}
        </div>
      </section>
    </div>
  )
}

/* ---------- UI bits ---------- */

function SidebarItem({ icon, label, active, onClick, disabled }:{
  icon: React.ReactNode, label: string, active?: boolean, onClick?: ()=>void, disabled?: boolean
}) {
  return (
    <button
      disabled={disabled}
      onClick={onClick}
      className={`w-full btn justify-start border-none ${active ? 'bg-racing-accent/90 text-white' : 'hover:bg-carbon-700 text-white/90'} ${disabled ? 'opacity-40 cursor-not-allowed' : ''}`}
    >
      {icon} {label}
    </button>
  )
}

function KpiCard({ title, value, icon }:{ title: string, value: string, icon: React.ReactNode }) {
  return (
    <div className="card p-4">
      <div className="flex items-center gap-2 text-white/80">
        <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-racing-accent/20 text-racing-accent">{icon}</span>
        <span className="text-sm">{title}</span>
      </div>
      <div className="mt-2 text-2xl font-semibold">{value}</div>
    </div>
  )
}

function PanelHeader({ tab }:{ tab: Tab }) {
  const { t } = useI18n()
  const title =
    tab === 'vehicles' ? t('your_garage') :
    tab === 'reparations' ? t('reparations') :
    t('recurring_bills')
  return (
    <div className="mb-3 flex items-center justify-between">
      <h2 className="text-lg font-semibold">{title}</h2>
      <span className="rounded-full bg-racing-accent px-3 py-1 text-xs font-medium text-white">CarMate</span>
    </div>
  )
}

/* ---------- Feature panes ---------- */

function Vehicles({
  t, data, onAdd, onDelete,
}: {
  t: (k: string) => string
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
        <input className="border border-carbon-600 bg-carbon-800 p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-racing-accent/60" placeholder={t('nickname')} value={nickname} onChange={(e)=>setNickname(e.target.value)} />
        <input className="border border-carbon-600 bg-carbon-800 p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-racing-accent/60" placeholder={t('make')} value={make} onChange={(e)=>setMake(e.target.value)} />
        <input className="border border-carbon-600 bg-carbon-800 p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-racing-accent/60" placeholder={t('model')} value={model} onChange={(e)=>setModel(e.target.value)} />
        <input className="border border-carbon-600 bg-carbon-800 p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-racing-accent/60" placeholder={t('plate')} value={plate} onChange={(e)=>setPlate(e.target.value)} />
      </div>
      <button
        className="btn btn-primary"
        onClick={() => { if (!nickname && !make && !model) return; onAdd({ nickname, make, model, plate }); clear() }}
      >
        {t('add_vehicle')}
      </button>

      <ul className="divide-y divide-carbon-600">
        {data.map((v) => (
          <li key={v.id} className="flex items-center justify-between py-3">
            <div>
              <b className="text-white">{v.nickname || `${v.make || ''} ${v.model || ''}`}</b>
              <div className="text-sm text-white/60">{[v.plate, v.year].filter(Boolean).join(' · ')}</div>
            </div>
            <button className="btn btn-ghost text-white/90" onClick={() => onDelete(v.id)}>
              <Trash2 size={16} /> {t('delete')}
            </button>
          </li>
        ))}
      </ul>
    </section>
  )
}

function Reparations({
  t, data, vehicles, onAdd, onDelete,
}: {
  t: (k: string) => string
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
        <select className="border border-carbon-600 bg-carbon-800 p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-racing-accent/60" value={vehicleId} onChange={e=>setVehicleId(e.target.value)}>
          <option value="">{t('select_vehicle')}</option>
          {vehicles.map(v => (
            <option key={v.id} value={v.id}>{v.nickname || `${v.make || ''} ${v.model || ''}`}</option>
          ))}
        </select>
        <input className="border border-carbon-600 bg-carbon-800 p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-racing-accent/60" placeholder={t('reparation_title')} value={title} onChange={e=>setTitle(e.target.value)} />
        <input className="border border-carbon-600 bg-carbon-800 p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-racing-accent/60" placeholder={t('cost_example')} value={cost} onChange={e=>setCost(e.target.value)} />
        <button
          className="btn btn-primary"
          onClick={() => { if (!vehicleId || !title.trim()) return; const amount = cost ? Number(cost) : null; onAdd({ vehicle_id: vehicleId, title, amount }); setTitle(''); setCost('') }}
        >
          {t('add')}
        </button>
      </div>

      <ul className="divide-y divide-carbon-600">
        {data.map((r) => (
          <li key={r.id} className="flex items-center justify-between py-3">
            <div>
              <b className="text-white">{r.title}</b>{typeof r.amount === 'number' ? ` · €${r.amount.toFixed(2)}` : ''}
              <div className="text-sm text-white/60">
                {vehicleMap[r.vehicle_id] ? (vehicleMap[r.vehicle_id].nickname || `${vehicleMap[r.vehicle_id].make||''} ${vehicleMap[r.vehicle_id].model||''}`) : '—'}
                {r.performed_at ? ` · ${format(new Date(r.performed_at), 'PPP')}` : ''}
              </div>
            </div>
            <button className="btn btn-ghost text-white/90" onClick={() => onDelete(r.id)}>
              <Trash2 size={16} /> {t('delete')}
            </button>
          </li>
        ))}
      </ul>
    </section>
  )
}

function RecurringBills({
  t, data, vehicles, onAdd, onDelete,
}: {
  t: (k: string) => string
  data: any[]
  vehicles: any[]
  onAdd: (p: any) => void
  onDelete: (id: string) => void
}) {
  const [vehicleId, setVehicleId] = useState<string>('')
  const [title, setTitle] = useState('')
  const [amount, setAmount] = useState<string>('')
  const [interval, setInterval] = useState<'monthly'|'yearly'>('monthly')
  const [nextDue, setNextDue] = useState('')

  const vehicleLabel = (v:any) => v.nickname || `${v.make || ''} ${v.model || ''}`

  return (
    <section className="space-y-4">
      <div className="grid gap-2 sm:grid-cols-[1fr_2fr_1fr_1fr_1fr_auto]">
        <select className="border border-carbon-600 bg-carbon-800 p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-racing-accent/60" value={vehicleId} onChange={e=>setVehicleId(e.target.value)}>
          <option value="">{t('select_vehicle')}</option>
          {vehicles.map(v => <option key={v.id} value={v.id}>{vehicleLabel(v)}</option>)}
        </select>
        <input className="border border-carbon-600 bg-carbon-800 p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-racing-accent/60" placeholder={t('bill_name')} value={title} onChange={e=>setTitle(e.target.value)} />
        <input className="border border-carbon-600 bg-carbon-800 p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-racing-accent/60" placeholder={t('amount_example')} value={amount} onChange={e=>setAmount(e.target.value)} />
        <select className="border border-carbon-600 bg-carbon-800 p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-racing-accent/60" value={interval} onChange={e=>setInterval(e.target.value as any)}>
          <option value="monthly">{t('monthly')}</option>
          <option value="yearly">{t('yearly')}</option>
        </select>
        <input type="date" className="border border-carbon-600 bg-carbon-800 p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-racing-accent/60" value={nextDue} onChange={e=>setNextDue(e.target.value)} />
        <button
          className="btn btn-primary"
          onClick={() => { if (!vehicleId || !title.trim() || !nextDue) return; const amt = amount ? Number(amount) : null; onAdd({ vehicle_id: vehicleId, title, amount: amt, interval, next_due: nextDue }); setTitle(''); setAmount(''); setNextDue('') }}
        >
          {t('add')}
        </button>
      </div>

      <ul className="divide-y divide-carbon-600">
        {data.map((b) => (
          <li key={b.id} className="flex items-center justify-between py-3">
            <div>
              <b className="text-white">{b.title}</b>{typeof b.amount === 'number' ? ` · €${b.amount.toFixed(2)}` : ''}
              <div className="text-sm text-white/60">
                {b.interval ? `${b.interval === 'monthly' ? t('monthly') : t('yearly')}` : ''}
                {b.next_due ? ` · ${t('next_due_on')} ${format(new Date(b.next_due), 'PPP')}` : ''}
              </div>
            </div>
            <button className="btn btn-ghost text-white/90" onClick={() => onDelete(b.id)}>
              <Trash2 size={16} /> {t('delete')}
            </button>
          </li>
        ))}
      </ul>
    </section>
  )
}

