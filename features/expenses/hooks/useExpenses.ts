'use client'
import { useEffect, useState } from 'react'
import { listExpenses } from '../api'
export function useExpenses(vehicleId?: string) {
  const [data, setData] = useState<any[]>([])
  useEffect(() => { let alive=true; listExpenses(vehicleId).then(d=>{ if(alive) setData(d) }).catch(()=>setData([])); return ()=>{alive=false} }, [vehicleId])
  return { data, reload: async ()=> setData(await listExpenses(vehicleId)) }
}
