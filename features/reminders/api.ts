// features/reminders/api.ts
import { supabaseBrowser } from '@/lib/supabase'
export type ReminderPayload = { vehicle_id?: string; type: 'insurance'|'tax'|'inspection'|'service'|'other'; due_date: string; recurrence?: 'NONE'|'MONTHLY'|'YEARLY'|'CUSTOM_DAYS'; custom_days?: number; notes?: string }
export async function addReminder(payload: ReminderPayload) {
  const sb = supabaseBrowser()
  const { data, error } = await sb.from('reminders').insert(payload).select('*').single()
  if (error) throw error
  return data
}
export async function listReminders(vehicle_id?: string) {
  const sb = supabaseBrowser()
  let q = sb.from('reminders').select('*').order('due_date', { ascending: true })
  if (vehicle_id) q = q.eq('vehicle_id', vehicle_id)
  const { data, error } = await q
  if (error) throw error
  return data || []
}
export async function deleteReminder(id: string) {
  const sb = supabaseBrowser()
  const { error } = await sb.from('reminders').delete().eq('id', id)
  if (error) throw error
}
