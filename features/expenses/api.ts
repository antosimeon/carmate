// features/expenses/api.ts
import { supabaseBrowser } from '@/lib/supabase'
export type ExpensePayload = { vehicle_id: string; category: 'fuel'|'maintenance'|'insurance'|'tax'|'fine'|'toll'|'parking'|'accessory'|'other'; amount: number; currency?: string; date?: string; vendor?: string; notes?: string }
export async function addExpense(payload: ExpensePayload) {
  const sb = supabaseBrowser()
  const { data, error } = await sb.from('expenses').insert(payload).select('*').single()
  if (error) throw error
  return data
}
export async function deleteExpense(id: string) {
  const sb = supabaseBrowser()
  const { error } = await sb.from('expenses').delete().eq('id', id)
  if (error) throw error
}
export async function listExpenses(vehicle_id?: string) {
  const sb = supabaseBrowser()
  let q = sb.from('expenses').select('*, expense_files(*)').order('date', { ascending: false })
  if (vehicle_id) q = q.eq('vehicle_id', vehicle_id)
  const { data, error } = await q
  if (error) throw error
  return data || []
}
export async function uploadInvoiceAndLink(expenseId: string, file: File) {
  const sb = supabaseBrowser()
  const { data: { user } } = await sb.auth.getUser()
  if (!user) throw new Error('Non autenticato')
  const year = new Date().getFullYear()
  const ext = (file.name.split('.').pop() || 'png').toLowerCase()
  const path = `${user.id}/${year}/${expenseId}-${Date.now()}.${ext}`
  const up = await sb.storage.from('invoices').upload(path, file, { cacheControl: '3600', upsert: false })
  if (up.error) throw up.error
  const { data, error } = await sb.from('expense_files').insert({ expense_id: expenseId, file_path: path }).select('*').single()
  if (error) throw error
  return data
}
export async function getInvoiceSignedUrl(file_path: string, expiresIn = 60) {
  const sb = supabaseBrowser()
  const { data, error } = await sb.storage.from('invoices').createSignedUrl(file_path, expiresIn)
  if (error) throw error
  return data?.signedUrl as string
}
