'use client'
import { getInvoiceSignedUrl, deleteExpense } from '../api'
import type { ExpensePayload } from '../api'

function formatDate(iso?: string) {
  if (!iso) return ''
  const [y,m,d] = iso.split('-')
  if (y && m && d) return `${d}-${m}-${y}`
  try { const dt = new Date(iso); const dd = String(dt.getDate()).padStart(2,'0'); const mm = String(dt.getMonth()+1).padStart(2,'0'); const yy = String(dt.getFullYear()); return `${dd}-${mm}-${yy}` } catch { return iso }
}

const categoryLabels: Record<ExpensePayload['category'], string> = {
  fuel: 'Carburante',
  maintenance: 'Manutenzione',
  insurance: 'Assicurazione',
  tax: 'Bollo',
  fine: 'Multa',
  toll: 'Pedaggio',
  parking: 'Parcheggio',
  accessory: 'Accessori',
  other: 'Altro',
}

function parseNotes(notes?: string) {
  if (!notes) return []
  return notes.split(' · ').map(s => s.trim()).filter(Boolean)
}

function getRepairTypeFromNotes(notes?: string): string | null {
  if (!notes) return null
  const m = notes.split(' · ').find(p => p.toLowerCase().startsWith('tipo riparazione:'))
  return m ? m.split(':').slice(1).join(':').trim() : null
}

export default function ExpenseList({ data, onReload, getVehicleName }:{ data:any[], onReload: ()=>Promise<void>|void; getVehicleName?: (id?: string)=>string }) {
  const download = async (file_path: string) => {
    const url = await getInvoiceSignedUrl(file_path, 60)
    window.open(url, '_blank')
  }
  const del = async (id: string) => {
    if (!confirm('Eliminare questa spesa?')) return
    await deleteExpense(id)
    await onReload()
  }
  return (
    <ul className="divide-y" style={{ borderColor: 'var(--line)' }}>
      {data.map((e)=> {
        const details = parseNotes(e.notes)
        const repairType = e.category === 'maintenance' ? getRepairTypeFromNotes(e.notes) : null
        const title = repairType || (categoryLabels[e.category as ExpensePayload['category']] ?? e.category)
        const detailsToShow = repairType ? details.filter(d => !d.toLowerCase().startsWith('tipo riparazione:')) : details
        return (
          <li key={e.id} className="py-3 flex items-center justify-between gap-4">
            <div className="min-w-0">
              <b className="text-[var(--text)]">{title}</b>
              <div className="text-sm text-[color:var(--text)]/60">
                €{Number(e.amount).toFixed(2)} · {formatDate(e.date)}{getVehicleName ? ` · ${getVehicleName(e.vehicle_id)}` : ''}{e.vendor ? ` · ${e.vendor}` : ''}
              </div>
              {!!detailsToShow.length && (
                <ul className="mt-1 text-sm text-[color:var(--text)]/70 space-y-0.5 list-disc pl-4">
                  {detailsToShow.map((d, idx) => <li key={idx}>{d}</li>)}
                </ul>
              )}
            </div>
            <div className="shrink-0 flex items-center gap-2">
              {!!e.expense_files?.length && (
                <button className="btn btn-ghost" onClick={() => download(e.expense_files[0].file_path)}>Apri allegato</button>
              )}
              <button className="btn btn-ghost" onClick={() => del(e.id)}>Elimina</button>
            </div>
          </li>
        )
      })}
      {data.length === 0 && <li className="py-3 text-sm text-[color:var(--text)]/60">Nessuna spesa</li>}
    </ul>
  )
}
