'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabaseBrowser } from '@/lib/supabase'
import { format } from 'date-fns'

type Tab = 'recipes' | 'vehicles' | 'reminders'

export default function Dashboard() {
  const router = useRouter()
  const sb = supabaseBrowser()
  const [tab, setTab] = useState<Tab>('recipes')
  const [data, setData] = useState<any[]>([])
  const [ready, setReady] = useState(false)

  useEffect(() => {
    ;(async () => {
      const { data: auth } = await sb.auth.getUser()
      if (!auth.user) {
        router.replace('/auth/login') // respects basePath on GitHub Pages
        return
      }
      setReady(true)
      await load()
    })()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tab])

  const load = async () => {
    const { data: rows, error } = await sb
      .from(tab)
      .select('*')
      .order('created_at', { ascending: false })
    if (error) {
      console.error(error)
      setData([])
      return
    }
    setData(rows || [])
  }

  const add = async (payload: any) => {
    // Ensure there is at least one household and the user is a member
    const { data: hh } = await sb.from('households').select('id').limit(1).single()
    const household_id = hh?.id ?? null
    const { error } = await sb.from(tab).insert({ ...payload, household_id })
    if (error) {
      console.error(error)
      return
    }
    await load()
  }

  const logout = async () => {
    await sb.auth.signOut()
    router.replace('/auth/login')
  }

  return (
    <main className="p-6 max-w-5xl mx-auto">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-3xl font-bold">CarMate</h1>
        <button className="px-3 py-2 rounded border" onClick={logout}>
          Logout
        </button>
      </div>

      <div className="flex gap-2 mb-6">
        {(['recipes', 'vehicles', 'reminders'] as Tab[]).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-3 py-2 rounded border ${tab === t ? 'bg-black text-white' : ''}`}
          >
            {t}
          </button>
        ))}
      </div>

      {!ready ? (
        <p className="text-sm text-gray-500">Checking session…</p>
      ) : (
        <>
          {tab === 'recipes' && <Recipes data={data} onAdd={add} />}
          {tab === 'vehicles' && <Vehicles data={data} onAdd={add} />}
          {tab === 'reminders' && <Reminders data={data} onAdd={add} />}
        </>
      )}
    </main>
  )
}

function Recipes({ data, onAdd }: { data: any[]; onAdd: (p: any) => void }) {
  const [title, setTitle] = useState('')
  const [notes, setNotes] = useState('')
  return (
    <section className="space-y-4">
      <div className="flex gap-2">
        <input
          className="border p-2 rounded flex-1"
          placeholder="Recipe title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <button
          className="px-3 py-2 rounded bg-black text-white"
          onClick={() => {
            if (!title.trim()) return
            onAdd({ title, notes })
            setTitle('')
            setNotes('')
          }}
        >
          Add
        </button>
      </div>
      <textarea
        className="w-full border p-2 rounded"
        placeholder="Notes"
        value={notes}
        onChange={(e) => setNotes(e.target.value)}
      />
      <ul className="divide-y">
        {data.map((r) => (
          <li key={r.id} className="py-3">
            <b>{r.title}</b>
            {r.tags?.length ? ` · ${r.tags.join(',')}` : ''}
            <div className="text-sm text-gray-500">{r.notes}</div>
          </li>
        ))}
      </ul>
    </section>
  )
}

function Vehicles({ data, onAdd }: { data: any[]; onAdd: (p: any) => void }) {
  const [nickname, setNickname] = useState('')
  return (
    <section className="space-y-4">
      <div className="flex gap-2">
        <input
          className="border p-2 rounded flex-1"
          placeholder="Nickname"
          value={nickname}
          onChange={(e) => setNickname(e.target.value)}
        />
        <button
          className="px-3 py-2 rounded bg-black text-white"
          onClick={() => {
            if (!nickname.trim()) return
            onAdd({ nickname })
            setNickname('')
          }}
        >
          Add
        </button>
      </div>
      <ul className="divide-y">
        {data.map((v) => (
          <li key={v.id} className="py-3">
            <b>{v.nickname || `${v.make || ''} ${v.model || ''}`}</b>
            <div className="text-sm text-gray-500">{v.plate || ''}</div>
          </li>
        ))}
      </ul>
    </section>
  )
}

function Reminders({ data, onAdd }: { data: any[]; onAdd: (p: any) => void }) {
  const [title, setTitle] = useState('')
  const [due, setDue] = useState('')
  return (
    <section className="space-y-4">
      <div className="grid gap-2 sm:grid-cols-[1fr_auto_auto]">
        <input
          className="border p-2 rounded"
          placeholder="Reminder title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <input
          type="date"
          className="border p-2 rounded"
          value={due}
          onChange={(e) => setDue(e.target.value)}
        />
        <button
          className="px-3 py-2 rounded bg-black text-white"
          onClick={() => {
            if (!title.trim() || !due) return
            onAdd({ title, due_date: due })
            setTitle('')
            setDue('')
          }}
        >
          Add
        </button>
      </div>
      <ul className="divide-y">
        {data.map((it) => (
          <li key={it.id} className="py-3 flex justify-between">
            <div>
              <b>{it.title}</b>
              <div className="text-sm text-gray-500">
                Due {it.due_date ? format(new Date(it.due_date), 'PPP') : '—'}
              </div>
            </div>
            {it.done ? (
              <span className="text-green-600">Done</span>
            ) : (
              <span className="text-amber-600">Open</span>
            )}
          </li>
        ))}
      </ul>
    </section>
  )
}

