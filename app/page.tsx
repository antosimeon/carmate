'use client'

import { useEffect, useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabaseBrowser } from '@/lib/supabase'
import { format } from 'date-fns'
import { Car, Wrench, Repeat, Settings, Plus, LogOut, Trash2 } from 'lucide-react'
import { useI18n } from '@/components/I18nProvider'
import Header from '@/components/Header' // ⬅️ added

type Tab = 'vehicles' | 'reparations' | 'recurring-bills'

const tableMap: Record<Tab, string> = {
  vehicles: 'vehicles',
  reparations: 'reparations',
  'recurring-bills': 'recurring_bills', // trattino → underscore
}

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
    const table = tableMap[tab]
    const { data, error } = await sb.from(table).select('*').order('created_at', { ascending: false })
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
    <>
      {/* ⬇️ Top bar only on the dashboard */}
      <Header />

      {/* Your original dashboard content */}
      <div className="mx-auto max-w-6xl grid grid-cols-1 gap-6 md:grid-cols-[240px_1fr] px-4 py-6">
        {/* Sidebar */}
        <aside className="card p-4">
          <nav className="space-y-1">
            <SidebarItem icon={<Car size={18} />} label={t('vehicles')} active={tab==='vehicles'} onClick={() => setTab('vehicles')} />
            <SidebarItem icon={<Wrench size={18} />} label={t('reparations')} active={tab==='reparations'} onClick={() => setTab('reparations')} />
            <SidebarItem icon={<Repeat size={18} />} label={t('recurring_bills')} active={tab==='recurring-bills'} onClick={() => setTab('recurring-bills')} />
            <div className="mt-4 border-t" style={{ borderColor: 'var(--line)' }}>
              <div className="pt-3">
                <SidebarItem icon={<Settings size={18} />} label={t('settings')} disabled />
              </div>
            </div>
          </nav>
          <button onClick={logout} className="btn btn-ghost mt-6 w-full justify-center text-sm">
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
    </>
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
      className={`w-full btn justify-start ${active ? 'btn-primary' : 'btn-ghost'} ${disabled ? 'opacity-40 cursor-not-allowed' : ''}`}
    >
      {icon} {label}
    </button>
  )
}

function KpiCard({ title, value, icon }:{ title: string, value: string, icon: React.ReactNode }) {
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

function PanelHeader({ tab }:{ tab: Tab }) {
  const { t } = useI18n()
  const title =
    tab === 'vehicles' ? t('your_garage') :
    tab === 'reparations' ? t('reparations') :
    t('recurring_bills')
  return (
    <div className="mb-3 flex items-center justify-between">
      <h2 className="text-lg font-semibold text-[var(--text)]">{title}</h2>
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
        <input className="input" placeholder={t('nickname')} value={nickname} onChange={(e)=>setNickname(e.target.value)} />
        <input className="input" placeholder={t('make')} value={make} onChange={(e)=>setMake(e.target.value)} />
        <input className="input" placeholder={t('model')} value={model} onChange={(e)=>setModel(e.target.value)} />
        <input className="input" placeholder={t('plate')} value={plate} onChange={(e)=>setPlate(e.target.value)} />
      </div>
      <button
        className="btn btn-primary"
        onClick={() => { if (!nickname && !make && !model) return; onAdd({ nickname, make, model, plate }); clear() }}
      >
        {t('add_vehicle')}
      </button>

      <ul className="divide-y" style={{ borderColor: 'var(--line)' }}>
        {data.map((v) => (
          <li key={v.id} className="flex items-center justify-between py-3">
            <div>
              <b className="text-[var(--text)]">{v.nickname || `${v.make || ''} ${v.model || ''}`}</b>
              <div className="text-sm text-[color:var(--text)]/60">{[v.plate, v.year].filter(Boolean).join(' · ')}</div>
            </div>
            <button className="btn btn-ghost" onClick={() => onDelete(v.id)}>
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
        <select className="input" value={vehicleId} onChange={e=>setVehicleId(e.target.value)}>
          <option value="">{t('select_vehicle')}</option>
          {vehicles.map(v => (
            <option key={v.id} value={v.id}>{v.nickname || `${v.make || ''} ${v.model || ''}`}</option>
          ))}
        </select>
        <input className="input" placeholder={t('reparation_title')} value={title} onChange={e=>setTitle(e.target.value)} />
        <input className="input" placeholder={t('cost_example')} value={cost} onChange={e=>setCost(e.target.value)} />
        <button
          className="btn btn-primary"
          onClick={() => { if (!vehicleId || !title.trim()) return; const amount = cost ? Number(cost) : null; onAdd({ vehicle_id: vehicleId, title, amount }); setTitle(''); setCost('') }}
        >
          <Plus size={16} /> {t('add')}
        </button>
      </div>

      <ul className="divide-y" style={{ borderColor: 'var(--line)' }}>
        {data.map((r) => (
          <li key={r.id} className="flex items-center justify-between py-3">
            <div>
              <b className="text-[var(--text)]">{r.title}</b>{typeof r.amount === 'number' ? ` · €${r.amount.toFixed(2)}` : ''}
              <div className="text-sm text-[color:var(--text)]/60">
                {vehicleMap[r.vehicle_id] ? (vehicleMap[r.vehicle_id].nickname || `${vehicleMap[r.vehicle_id].make||''} ${vehicleMap[r.vehicle_id].model||''}`) : '—'}
                {r.performed_at ? ` · ${format(new Date(r.performed_at), 'PPP')}` : ''}
              </div>
            </div>
            <button className="btn btn-ghost" onClick={() => onDelete(r.id)}>
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
        <select className="input" value={vehicleId} onChange={e=>setVehicleId(e.target.value)}>
          <option value="">{t('select_vehicle')}</option>
          {vehicles.map(v => <option key={v.id} value={v.id}>{vehicleLabel(v)}</option>)}
        </select>
        <input className="input" placeholder={t('bill_name')} value={title} onChange={e=>setTitle(e.target.value)} />
        <input className="input" placeholder={t('amount_example')} value={amount} onChange={e=>setAmount(e.target.value)} />
        <select className="input" value={interval} onChange={e=>setInterval(e.target.value as any)}>
          <option value="monthly">{t('monthly')}</option>
          <option value="yearly">{t('yearly')}</option>
        </select>
        <input type="date" className="input" value={nextDue} onChange={e=>setNextDue(e.target.value)} />
        <button
          className="btn btn-primary"
          onClick={() => { if (!vehicleId || !title.trim() || !nextDue) return; const amt = amount ? Number(amount) : null; onAdd({ vehicle_id: vehicleId, title, amount: amt, interval, next_due: nextDue }); setTitle(''); setAmount(''); setNextDue('') }}
        >
          <Plus size={16} /> {t('add')}
        </button>
      </div>

      <ul className="divide-y" style={{ borderColor: 'var(--line)' }}>
        {data.map((b) => (
          <li key={b.id} className="flex items-center justify-between py-3">
            <div>
              <b className="text-[var(--text)]">{b.title}</b>{typeof b.amount === 'number' ? ` · €${b.amount.toFixed(2)}` : ''}
              <div className="text-sm text-[color:var(--text)]/60">
                {b.interval ? `${b.interval === 'monthly' ? t('monthly') : t('yearly')}` : ''}
                {b.next_due ? ` · ${t('next_due_on')} ${format(new Date(b.next_due), 'PPP')}` : ''}
              </div>
            </div>
            <button className="btn btn-ghost" onClick={() => onDelete(b.id)}>
              <Trash2 size={16} /> {t('delete')}
            </button>
          </li>
        ))}
      </ul>
    </section>
  )
}

