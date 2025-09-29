'use client'
import { useEffect, useState, useCallback } from 'react'
import { addReminder, deleteReminder, listReminders, type ReminderPayload } from '../api'
export function useReminders() {
  const [data, setData] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string|null>(null)
  const reload = useCallback(async () => {
    setLoading(true)
    try { const r = await listReminders(); setData(r); setError(null) } 
    catch (e:any) { setError(e.message || 'Errore') } 
    finally { setLoading(false) }
  }, [])
  useEffect(()=>{ reload() }, [reload])
  const create = useCallback(async (payload: ReminderPayload) => { await addReminder(payload); await reload() }, [reload])
  const remove = useCallback(async (id: string) => { await deleteReminder(id); await reload() }, [reload])
  return { data, loading, error, reload, create, remove }
}
