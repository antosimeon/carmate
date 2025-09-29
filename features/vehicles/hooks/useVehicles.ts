'use client'
import { useEffect, useState, useCallback } from 'react'
import { addVehicle, deleteVehicle, listVehicles, type VehiclePayload } from '../api'
export function useVehicles() {
  const [data, setData] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string|null>(null)
  const reload = useCallback(async () => {
    setLoading(true)
    try { const v = await listVehicles(); setData(v); setError(null) } 
    catch (e:any) { setError(e.message || 'Errore') } 
    finally { setLoading(false) }
  }, [])
  useEffect(() => { reload() }, [reload])
  const create = useCallback(async (payload: VehiclePayload) => { await addVehicle(payload); await reload() }, [reload])
  const remove = useCallback(async (id: string) => { await deleteVehicle(id); await reload() }, [reload])
  return { data, loading, error, reload, create, remove }
}
