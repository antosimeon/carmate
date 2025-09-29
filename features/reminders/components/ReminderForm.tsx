'use client'
import { useState } from 'react'
import type { ReminderPayload } from '../api'
import { useVehicle } from '@/providers/VehicleProvider'
export default function ReminderForm({ onCreate }:{ onCreate: (p:ReminderPayload)=>Promise<void>|void }) {
  const { vehicles, activeId } = useVehicle()
  const [form, setForm] = useState<ReminderPayload>({ vehicle_id: activeId, type: 'insurance', due_date: new Date().toISOString().slice(0,10), recurrence: 'YEARLY' })
  const set = (k:keyof ReminderPayload, v:any)=> setForm(f => ({ ...f, [k]: v }))
  const onSubmit = async (e: React.FormEvent) => { e.preventDefault(); await onCreate(form); setForm({ ...form, notes: '' }) }
  return (
    <form onSubmit={onSubmit} className="space-y-3">
      <div className="grid gap-2 sm:grid-cols-5">
        <select className="input" value={form.vehicle_id || ''} onChange={e=>set('vehicle_id', e.target.value||undefined)}>
          <option value="">— nessuno —</option>
          {vehicles.map(v => <option key={v.id} value={v.id}>{v.nickname || `${v.make||''} ${v.model||''}`}</option>)}
        </select>
        <select className="input" value={form.type} onChange={e=>set('type', e.target.value as any)}>
          <option value="insurance">Assicurazione</option><option value="tax">Bollo</option><option value="inspection">Revisione</option><option value="service">Tagliando</option><option value="other">Altro</option>
        </select>
        <input className="input" type="date" value={form.due_date} onChange={e=>set('due_date', e.target.value)} />
        <select className="input" value={form.recurrence||'NONE'} onChange={e=>set('recurrence', e.target.value as any)}>
          <option value="NONE">Una volta</option><option value="MONTHLY">Mensile</option><option value="YEARLY">Annuale</option><option value="CUSTOM_DAYS">Custom</option>
        </select>
        <input className="input" placeholder="Giorni ricorrenza (opz.)" inputMode="numeric" value={form.custom_days ?? ''} onChange={e=>set('custom_days', e.target.value ? Number(e.target.value) : undefined)} />
      </div>
      <input className="input w-full" placeholder="Note (opzionale)" value={form.notes ?? ''} onChange={e=>set('notes', e.target.value)} />
      <button className="btn btn-primary" type="submit">Aggiungi promemoria</button>
    </form>
  )
}
