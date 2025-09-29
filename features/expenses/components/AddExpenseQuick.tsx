'use client'
import { useState } from 'react'
import { addExpense, uploadInvoiceAndLink } from '../api'

export default function AddExpenseQuick({ vehicleId }: { vehicleId: string }) {
  const [amount, setAmount] = useState('')
  const [file, setFile] = useState<File | null>(null)
  const [loading, setLoading] = useState(false)

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!amount) return
    setLoading(true)
    try {
      const expense = await addExpense({ vehicle_id: vehicleId, category: 'maintenance', amount: Number(amount) })
      if (file) await uploadInvoiceAndLink(expense.id, file)
      setAmount(''); setFile(null)
      alert('Spesa inserita!')
    } catch (err: any) {
      alert(err.message || 'Errore')
    } finally { setLoading(false) }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-2">
      <input className="input" placeholder="Importo" value={amount}
             onChange={(e)=>setAmount(e.target.value)} inputMode="decimal" />
      <input type="file" accept="image/*,.pdf" onChange={(e)=>setFile(e.target.files?.[0] ?? null)} />
      <button className="btn btn-primary w-full" type="submit" disabled={loading}>
        {loading ? 'Salvo…' : 'Aggiungi spesa'}
      </button>
    </form>
  )
}
