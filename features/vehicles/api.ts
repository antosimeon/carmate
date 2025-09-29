// features/vehicles/api.ts
import { supabaseBrowser } from '@/lib/supabase'
export type VehiclePayload = { vin?: string; make?: string; model?: string; year?: number; plate?: string; nickname?: string; photo_url?: string }
export async function listVehicles() {
  const sb = supabaseBrowser()
  const { data, error } = await sb.from('vehicles').select('*').order('created_at', { ascending: false })
  if (error) throw error
  return data || []
}
export async function addVehicle(payload: VehiclePayload) {
  const sb = supabaseBrowser()
  const { data, error } = await sb.from('vehicles').insert(payload).select('*').single()
  if (error) throw error
  return data
}
export async function deleteVehicle(id: string) {
  const sb = supabaseBrowser()
  const { error } = await sb.from('vehicles').delete().eq('id', id)
  if (error) throw error
}
