'use client'
import { Home, Car, Wrench, Repeat, BarChart3, Settings, LogOut } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { supabaseBrowser } from '@/lib/supabase'

export default function Sidebar({ onSelect, active }:{ onSelect: (tab: string)=>void, active: string }) {
  const router = useRouter()
  const logout = async () => { await supabaseBrowser().auth.signOut(); router.replace('/auth/login') }
  const Item = ({id,icon,label}:{id:string,icon:React.ReactNode,label:string}) => (
    <button onClick={()=>onSelect(id)} className={`w-full btn justify-start ${active===id?'btn-primary':'btn-ghost'}`}>{icon} {label}</button>
  )
  return (
    <aside className="card p-4">
      <nav className="space-y-1">
        <Item id="home"            icon={<Home size={18}/>}       label="Home" />
        <Item id="vehicles"        icon={<Car size={18}/>}        label="Veicoli" />
        <Item id="expenses"        icon={<BarChart3 size={18}/>}  label="Spese" />
        <Item id="reminders"       icon={<Repeat size={18}/>}     label="Promemoria" />
        <Item id="stats"           icon={<BarChart3 size={18}/>}  label="Statistiche" />
        <div className="mt-4 border-t" style={{ borderColor: 'var(--line)' }} />
        <button className="btn btn-ghost w-full justify-start opacity-60 cursor-not-allowed">
          <Settings size={18}/> Impostazioni
        </button>
      </nav>
      <button onClick={logout} className="btn btn-ghost mt-6 w-full justify-center text-sm"><LogOut size={16}/> Esci</button>
    </aside>
  )
}
