'use client'
import { useEffect, useState } from 'react'
import { listExpenses } from '../api'

export function useExpenses(vehicleId?: string) {
  const [data, setData] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let alive = true
    setLoading(true)
    listExpenses(vehicleId)
      .then(d => { if (alive) { setData(d); setError(null) } })
      .catch(e => { if (alive) { setError(e.message || 'Errore') } })
      .finally(() => { if (alive) setLoading(false) })
    return () => { alive = false }
  }, [vehicleId])

  return { data, loading, error, reload: async () => setData(await listExpenses(vehicleId)) }
}
