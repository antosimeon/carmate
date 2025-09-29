'use client'
import { Trash2 } from 'lucide-react'
export default function VehicleList({ data, onDelete }:{ data: any[], onDelete: (id:string)=>Promise<void>|void }) {
  return (
    <ul className="divide-y" style={{ borderColor: 'var(--line)' }}>
      {data.map((v) => (
        <li key={v.id} className="flex items-center justify-between py-3">
          <div>
            <b className="text-[var(--text)]">{v.nickname || `${v.make||''} ${v.model||''}`}</b>
            <div className="text-sm text-[color:var(--text)]/60"> {[v.plate, v.year].filter(Boolean).join(' · ')} </div>
          </div>
          <button className="btn btn-ghost" onClick={() => onDelete(v.id)}><Trash2 size={16} /> Elimina</button>
        </li>
      ))}
      {data.length === 0 && <li className="py-3 text-sm text-[color:var(--text)]/60">Nessun veicolo</li>}
    </ul>
  )
}
