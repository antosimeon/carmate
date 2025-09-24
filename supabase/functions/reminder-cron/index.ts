// deno runtime
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2"

const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY')!
const NOTIFY_FROM_EMAIL = Deno.env.get('NOTIFY_FROM_EMAIL')!
const DAYS_AHEAD = 7

async function sendEmail(to: string, subject: string, html: string) {
  await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${RESEND_API_KEY}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ from: NOTIFY_FROM_EMAIL, to, subject, html })
  })
}

serve(async () => {
  const supabase = createClient(Deno.env.get('SUPABASE_URL')!, Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!)
  const today = new Date()
  const { data: reminders } = await supabase.from('reminders').select('id,title,due_date,household_id,notify_days_before')
  const upcoming = (reminders||[]).filter(r => {
    const due = new Date(r.due_date)
    const days = Math.ceil((+due - +today)/86400000)
    return days === (r.notify_days_before ?? DAYS_AHEAD)
  })
  for (const r of upcoming){
    const { data: members } = await supabase.from('household_members').select('user_id').eq('household_id', r.household_id)
    if (!members) continue
    for (const m of members){
      const { data: user } = await supabase.auth.admin.getUserById(m.user_id)
      const email = (user as any)?.user?.email
      if (email) await sendEmail(email, `Reminder: ${r.title}`, `<p>Due on ${new Date(r.due_date).toDateString()}</p>`)
    }
  }
  return new Response(JSON.stringify({ ok: true, count: upcoming.length }), { headers: { 'Content-Type': 'application/json' } })
})
