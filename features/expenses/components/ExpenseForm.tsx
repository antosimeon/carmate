'use client'
import { useMemo, useState } from 'react'
import { addExpense, type ExpensePayload } from '../api'

type UICategory =
  | 'Carburante'
  | 'Manutenzione'
  | 'Assicurazione'
  | 'Multa'
  | 'Bollo'
  | 'Parcheggio'
  | 'Lavaggio'
  | 'Accessori'
  | 'Revisione'
  | 'Tagliando'
  | 'Altro'

const toBackend: Record<UICategory, ExpensePayload['category']> = {
  Carburante: 'fuel',
  Manutenzione: 'maintenance',
  Assicurazione: 'insurance',
  Multa: 'fine',
  Bollo: 'tax',
  Parcheggio: 'parking',
  Lavaggio: 'other',
  Accessori: 'accessory',
  Revisione: 'other',
  Tagliando: 'maintenance',
  Altro: 'other',
}

const fuelTypes = ['Benzina', 'Diesel', 'Metano', 'GPL', 'Elettrico'] as const
type FuelType = typeof fuelTypes[number]

export default function ExpenseForm({ vehicleId, onCreated }:{ vehicleId: string; onCreated: ()=>Promise<void>|void }) {
  const [category, setCategory] = useState<UICategory>('Carburante')
  const [amount, setAmount] = useState<string>('')
  const [date, setDate] = useState<string>(new Date().toISOString().slice(0,10))

  // common notes field reused by categories that have "Note"
  const [notes, setNotes] = useState<string>('')

  // specific
  const [fuelType, setFuelType] = useState<FuelType | ''>('')
  const [repairType, setRepairType] = useState<string>('')
  const [insuranceCompany, setInsuranceCompany] = useState<string>('')
  const [insurancePeriod, setInsurancePeriod] = useState<'Mensile'|'Annuale'|''>('')
  const [multaViolazione, setMultaViolazione] = useState<string>('')
  const [multaLuogo, setMultaLuogo] = useState<string>('')

  const [loading, setLoading] = useState(false)

  const categories: UICategory[] = [
    'Carburante','Manutenzione','Assicurazione','Multa',
    'Bollo','Parcheggio','Lavaggio','Accessori','Revisione','Tagliando','Altro'
  ]

  const isBasic = useMemo(() => (
    category === 'Bollo' || category === 'Parcheggio' || category === 'Lavaggio' ||
    category === 'Accessori' || category === 'Revisione' || category === 'Tagliando' || category === 'Altro'
  ), [category])

  const clear = () => {
    setAmount(''); setDate(new Date().toISOString().slice(0,10))
    setFuelType(''); setRepairType(''); setInsuranceCompany(''); setInsurancePeriod('')
    setMultaViolazione(''); setMultaLuogo(''); setNotes('')
  }

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!amount || !date) return

    // validations for required specific fields
    if (category === 'Carburante' && !fuelType) return
    if (category === 'Manutenzione' && !repairType) return
    if (category === 'Assicurazione' && (!insuranceCompany || !insurancePeriod)) return
    if (category === 'Multa' && (!multaViolazione || !multaLuogo)) return

    setLoading(true)
    try {
      const parts: string[] = []
      if (category === 'Carburante') { parts.push(`Tipo: ${fuelType}`); if (notes) parts.push(notes) }
      if (category === 'Manutenzione') { parts.push(`Tipo riparazione: ${repairType}`); if (notes) parts.push(notes) }
      if (category === 'Assicurazione') { parts.push(`Periodo: ${insurancePeriod}`); if (notes) parts.push(notes) }
      if (category === 'Multa') { parts.push(`Violazione: ${multaViolazione}`, `Luogo: ${multaLuogo}`) }
      if (isBasic && notes) { parts.push(notes) }

      await addExpense({
        vehicle_id: vehicleId,
        category: toBackend[category],
        amount: Number(amount),
        date,
        vendor: category === 'Assicurazione' ? insuranceCompany : undefined,
        notes: parts.join(' · '),
      } as ExpensePayload)

      clear()
      await onCreated()
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-3">
      <div className="grid gap-2 [grid-template-columns:repeat(auto-fit,minmax(12rem,1fr))]">
        <select className="input" value={category} onChange={e=>setCategory(e.target.value as UICategory)}>
          {categories.map(c => <option key={c} value={c}>{c}</option>)}
        </select>
        <input className="input" placeholder="Importo" inputMode="decimal" value={amount} onChange={e=>setAmount(e.target.value)} />
        <input className="input" type="date" value={date} onChange={e=>setDate(e.target.value)} />
      </div>

      {category === 'Carburante' && (
        <div className="grid gap-2 [grid-template-columns:repeat(auto-fit,minmax(12rem,1fr))]">
          <select className="input" value={fuelType} onChange={e=>setFuelType(e.target.value as FuelType)}>
            <option value="">Tipo carburante…</option>
            {fuelTypes.map(f => <option key={f} value={f}>{f}</option>)}
          </select>
          <input className="input" placeholder="Note" value={notes} onChange={e=>setNotes(e.target.value)} />
        </div>
      )}

      {category === 'Manutenzione' && (
        <div className="grid gap-2 [grid-template-columns:repeat(auto-fit,minmax(12rem,1fr))]">
          <input className="input" placeholder="Tipo riparazione" value={repairType} onChange={e=>setRepairType(e.target.value)} />
          <input className="input" placeholder="Note" value={notes} onChange={e=>setNotes(e.target.value)} />
        </div>
      )}

      {category === 'Assicurazione' && (
        <div className="grid gap-2 [grid-template-columns:repeat(auto-fit,minmax(12rem,1fr))]">
          <input className="input" placeholder="Compagnia" value={insuranceCompany} onChange={e=>setInsuranceCompany(e.target.value)} />
          <select className="input" value={insurancePeriod} onChange={e=>setInsurancePeriod(e.target.value as any)}>
            <option value="">Periodo…</option>
            <option value="Mensile">Mensile</option>
            <option value="Annuale">Annuale</option>
          </select>
          <input className="input" placeholder="Note" value={notes} onChange={e=>setNotes(e.target.value)} />
        </div>
      )}

      {category === 'Multa' && (
        <div className="grid gap-2 [grid-template-columns:repeat(auto-fit,minmax(12rem,1fr))]">
          <input className="input" placeholder="Violazione" value={multaViolazione} onChange={e=>setMultaViolazione(e.target.value)} />
          <input className="input" placeholder="Luogo" value={multaLuogo} onChange={e=>setMultaLuogo(e.target.value)} />
        </div>
      )}

      {isBasic && (
        <div className="grid gap-2 [grid-template-columns:repeat(auto-fit,minmax(12rem,1fr))]">
          <input className="input" placeholder="Note" value={notes} onChange={e=>setNotes(e.target.value)} />
        </div>
      )}

      <button className="btn btn-primary" type="submit" disabled={loading}>
        {loading ? 'Salvo…' : 'Aggiungi spesa'}
      </button>
    </form>
  )
}
