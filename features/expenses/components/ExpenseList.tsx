'use client'
import { getInvoiceSignedUrl, deleteExpense } from '../api'
export default function ExpenseList({ data, onReload }:{ data:any[], onReload: ()=>Promise<void>|void }) {
  const download = async (file_path: string) => { const url = await getInvoiceSignedUrl(file_path, 60); window.open(url, '_blank') }
  const del = async (id: string) => { if (!confirm('Eliminare questa spesa?')) return; await deleteExpense(id); await onReload() }
  return (
    <ul className="divide-y" style={{ borderColor: 'var(--line)' }}>
      {data.map((e)=> (
        <li key={e.id} className="py-3 flex items-center justify-between gap-4">
          <div className="min-w-0">
            <b className="text-[var(--text)]">{e.category}</b>
            <div className="text-sm text-[color:var(--text)]/60 truncate">€{Number(e.amount).toFixed(2)} · {e.date} {e.vendor ? `· ${e.vendor}` : ''}</div>
          </div>
          <div className="shrink-0 flex items-center gap-2">
            {!!e.expense_files?.length && (<button className="btn btn-ghost" onClick={()=>download(e.expense_files[0].file_path)}>Scarica</button>)}
            <button className="btn btn-ghost" onClick={()=>del(e.id)}>Elimina</button>
          </div>
        </li>
      ))}
      {data.length === 0 && <li className="py-3 text-sm text-[color:var(--text)]/60">Nessuna spesa</li>}
    </ul>
  )
}
