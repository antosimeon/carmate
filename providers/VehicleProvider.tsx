'use client'
import { createContext, useContext, useEffect, useState } from 'react'
import { supabaseBrowser } from '@/lib/supabase'
type Ctx = { activeId?: string; setActiveId: (id?: string)=>void; vehicles: any[] }
const VehicleCtx = createContext<Ctx>({ activeId: undefined, setActiveId: () => {}, vehicles: [] })
export function VehicleProvider({ children }: { children: React.ReactNode }) {
  const sb = supabaseBrowser()
  const [vehicles, setVehicles] = useState<any[]>([])
  const [activeId, setActiveId] = useState<string | undefined>(undefined)
  useEffect(() => {
    let alive = true
    sb.from('vehicles').select('*').order('created_at', { ascending: false }).then(({ data, error }) => {
      if (!alive) return
      if (error) { console.error(error); setVehicles([]); return }
      setVehicles(data || [])
      setActiveId(data && data[0]?.id)
    })
    return () => { alive = false }
  }, [])
  return <VehicleCtx.Provider value={{ activeId, setActiveId, vehicles }}>{children}</VehicleCtx.Provider>
}
export const useVehicle = () => useContext(VehicleCtx)
