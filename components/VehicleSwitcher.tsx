'use client'
import { useVehicle } from '@/providers/VehicleProvider'
export default function VehicleSwitcher() {
  const { vehicles, activeId, setActiveId } = useVehicle()
  if (!vehicles?.length) return null
  return (
    <div className="flex items-center gap-2">
      <label className="text-sm text-[color:var(--text)]/70">Veicolo:</label>
      <select className="input" value={activeId || ''} onChange={(e)=>setActiveId(e.target.value || undefined)} style={{ maxWidth: 240 }}>
        {vehicles.map((v:any)=> (<option key={v.id} value={v.id}>{v.nickname || `${v.make||''} ${v.model||''}`}</option>))}
      </select>
    </div>
  )
}
