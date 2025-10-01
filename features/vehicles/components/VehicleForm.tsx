'use client'
import { useState } from 'react'
import type { VehiclePayload } from '../api'

export default function VehicleForm({ onCreate }: { onCreate: (p: VehiclePayload) => Promise<void> | void }) {
  const [make, setMake] = useState('')
  const [model, setModel] = useState('')
  const [plate, setPlate] = useState('')
  const [year, setYear] = useState<string>('')
  const [loading, setLoading] = useState(false)

  const clear = () => { setMake(''); setModel(''); setPlate(''); setYear('') }

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!make && !model) return
    setLoading(true)
    try {
      await onCreate({ make, model, plate, year: year ? Number(year) : undefined })
      clear()
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-3">
      {/* auto-fit columns so fields fill the line even if we add/remove inputs */}
      <div className="grid gap-2 [grid-template-columns:repeat(auto-fit,minmax(12rem,1fr))]">
        <input className="input" placeholder="Marca" value={make} onChange={e => setMake(e.target.value)} />
        <input className="input" placeholder="Modello" value={model} onChange={e => setModel(e.target.value)} />
        <input className="input" placeholder="Targa" value={plate} onChange={e => setPlate(e.target.value)} />
        <input className="input" placeholder="Anno" value={year} onChange={e => setYear(e.target.value)} inputMode="numeric" />
      </div>
      <button className="btn btn-primary" type="submit" disabled={loading}>
        {loading ? 'Salvo…' : 'Aggiungi veicolo'}
      </button>
    </form>
  )
}

