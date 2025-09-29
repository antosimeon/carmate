'use client'
export default function ReminderList({ data, onDelete }:{ data:any[], onDelete:(id:string)=>Promise<void>|void }) {
  return (
    <ul className="divide-y" style={{ borderColor: 'var(--line)' }}>
      {data.map((r)=>(
        <li key={r.id} className="py-3 flex items-center justify-between">
          <div>
            <b className="text-[var(--text)]">{r.type}</b>
            <div className="text-sm text-[color:var(--text)]/60">Scadenza: {r.due_date}{r.recurrence && r.recurrence !== 'NONE' ? ` · ${r.recurrence}` : ''}</div>
          </div>
          <button className="btn btn-ghost" onClick={()=>onDelete(r.id)}>Elimina</button>
        </li>
      ))}
      {data.length === 0 && <li className="py-3 text-sm text-[color:var(--text)]/60">Nessun promemoria</li>}
    </ul>
  )
}
