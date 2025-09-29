'use client'
import { useState } from 'react'
import { addExpense, uploadInvoiceAndLink, type ExpensePayload } from '../api'
const categories: ExpensePayload['category'][] = ['fuel','maintenance','insurance','tax','fine','toll','parking','accessory','other']
export default function ExpenseForm({ vehicleId, onCreated }:{ vehicleId: string, onCreated: ()=>Promise<void>|void }) {
  const [payload, setPayload] = useState<Partial<ExpensePayload>>({ vehicle_id: vehicleId, category: 'maintenance', date: new Date().toISOString().slice(0,10) })
  const [file, setFile] = useState<File|null>(null); const [loading, setLoading] = useState(false)
  const set = (k: keyof ExpensePayload, v:any)=> setPayload(p => ({ ...p, [k]: v }))
  const onSubmit = async (e: React.FormEvent) => { e.preventDefault(); if (!payload.amount || !payload.category) return; setLoading(true); try { const exp = await addExpense({ vehicle_id: vehicleId, category: payload.category as any, amount: Number(payload.amount), currency: payload.currency || 'EUR', date: payload.date, vendor: payload.vendor, notes: payload.notes }); if (file) await uploadInvoiceAndLink(exp.id, file); setPayload({ vehicle_id: vehicleId, category: 'maintenance', date: new Date().toISOString().slice(0,10) }); setFile(null); await onCreated() } finally { setLoading(false) } }
  return (
    <form onSubmit={onSubmit} className="space-y-3">
      <div className="grid gap-2 sm:grid-cols-6">
        <select className="input" value={payload.category as string} onChange={e=>set('category', e.target.value as any)}>{categories.map(c => <option key={c} value={c}>{c}</option>)}</select>
        <input className="input" placeholder="Importo" inputMode="decimal" value={payload.amount ?? ''} onChange={e=>set('amount', e.target.value)} />
        <input className="input" type="date" value={payload.date ?? ''} onChange={e=>set('date', e.target.value)} />
        <input className="input" placeholder="Fornitore" value={payload.vendor ?? ''} onChange={e=>set('vendor', e.target.value)} />
        <input className="input" placeholder="Note" value={payload.notes ?? ''} onChange={e=>set('notes', e.target.value)} />
        <input type="file" accept="image/*,.pdf" onChange={(e)=>setFile(e.target.files?.[0] ?? null)} />
      </div>
      <button className="btn btn-primary" type="submit" disabled={loading}>{loading ? 'Salvo…' : 'Aggiungi spesa'}</button>
    </form>
  )
}
