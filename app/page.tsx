'use client'
import { useEffect, useState } from 'react'
import { supabaseBrowser } from '@/lib/supabase'
import { format } from 'date-fns'

type Tab = 'recipes' | 'vehicles' | 'reminders'

export default function Dashboard(){
  const sb = supabaseBrowser()
  const [tab, setTab] = useState<Tab>('recipes')
  const [data, setData] = useState<any[]>([])

  useEffect(() => { (async () => {
    const { data: { user } } = await sb.auth.getUser()
    if(!user) window.location.href = '/auth/login'
    else await load()
  })() }, [tab])

  const load = async () => {
    const table = tab
    const { data: rows } = await sb.from(table).select('*').order('created_at', { ascending:false })
    setData(rows||[])
  }

  const add = async (payload: any) => {
    const { data: hh } = await sb.from('households').select('id').limit(1).single()
    await sb.from(tab).insert({ ...payload, household_id: hh?.id })
    await load()
  }

  const logout = async () => {
    await sb.auth.signOut()
    window.location.href = '/auth/login'
  }

  return (
    <main className="p-6 max-w-5xl mx-auto">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-3xl font-bold">CarMate</h1>
        <button className="px-3 py-2 rounded border" onClick={logout}>Logout</button>
      </div>
      <div className="flex gap-2 mb-6">
        {(['recipes','vehicles','reminders'] as Tab[]).map((t) => (
          <button key={t} onClick={()=>setTab(t)} className={`px-3 py-2 rounded border ${tab===t?'bg-black text-white':''}`}>{t}</button>
        ))}
      </div>

      {tab==='recipes' && <Recipes data={data} onAdd={add} />}
      {tab==='vehicles' && <Vehicles data={data} onAdd={add} />}
      {tab==='reminders' && <Reminders data={data} onAdd={add} />}
    </main>
  )
}

function Recipes({ data, onAdd }:{data:any[], onAdd:(p:any)=>void}){
  const [title,setTitle]=useState('')
  const [notes,setNotes]=useState('')
  return (
    <section className="space-y-4">
      <div className="flex gap-2">
        <input className="border p-2 rounded flex-1" placeholder="Recipe title" value={title} onChange={e=>setTitle(e.target.value)} />
        <button className="px-3 py-2 rounded bg-black text-white" onClick={()=>{onAdd({title,notes}); setTitle(''); setNotes('')}}>Add</button>
      </div>
      <textarea className="w-full border p-2 rounded" placeholder="Notes" value={notes} onChange={e=>setNotes(e.target.value)} />
      <ul className="divide-y">
        {data.map(r=> (
          <li key={r.id} className="py-3"><b>{r.title}</b>{r.tags?.length?` · ${r.tags.join(',')}`:''}<div className="text-sm text-gray-500">{r.notes}</div></li>
        ))}
      </ul>
    </section>
  )
}

function Vehicles({ data, onAdd }:{data:any[], onAdd:(p:any)=>void}){
  const [nickname,setNickname]=useState('')
  return (
    <section className="space-y-4">
      <div className="flex gap-2">
        <input className="border p-2 rounded flex-1" placeholder="Nickname" value={nickname} onChange={e=>setNickname(e.target.value)} />
        <button className="px-3 py-2 rounded bg-black text-white" onClick={()=>{onAdd({nickname}); setNickname('')}}>Add</button>
      </div>
      <ul className="divide-y">
        {data.map(v=> (
          <li key={v.id} className="py-3"><b>{v.nickname||`${v.make||''} ${v.model||''}`}</b><div className="text-sm text-gray-500">{v.plate||''}</div></li>
        ))}
      </ul>
    </section>
  )
}

function Reminders({ data, onAdd }:{data:any[], onAdd:(p:any)=>void}){
  const [title,setTitle]=useState('')
  const [due,setDue]=useState('')
  return (
    <section className="space-y-4">
      <div className="grid gap-2 sm:grid-cols-[1fr_auto_auto]">
        <input className="border p-2 rounded" placeholder="Reminder title" value={title} onChange={e=>setTitle(e.target.value)} />
        <input type="date" className="border p-2 rounded" value={due} onChange={e=>setDue(e.target.value)} />
        <button className="px-3 py-2 rounded bg-black text-white" onClick={()=>{onAdd({title, due_date: due}); setTitle(''); setDue('')}}>Add</button>
      </div>
      <ul className="divide-y">
        {data.map(it=> (
          <li key={it.id} className="py-3 flex justify-between">
            <div><b>{it.title}</b><div className="text-sm text-gray-500">Due {format(new Date(it.due_date), 'PPP')}</div></div>
            {it.done ? <span className="text-green-600">Done</span> : <span className="text-amber-600">Open</span>}
          </li>
        ))}
      </ul>
    </section>
  )
}
