'use client'
import { Car, Wrench, Repeat, Settings, LogOut } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { supabaseBrowser } from '@/lib/supabase'

export default function Sidebar({ onSelect, active }:{ onSelect: (tab: string)=>void, active: string }) {
  const router = useRouter()
  const logout = async () => { await supabaseBrowser().auth.signOut(); router.replace('/auth/login') }
  const Item = ({id,icon,label}:{id:string,icon:React.ReactNode,label:string}) => (
    <button onClick={()=>onSelect(id)} className={`w-full btn justify-start ${active===id?'btn-primary':'btn-ghost'}`}>
      {icon} {label}
    </button>
  )
  return (
    <aside className="card p-4">
      <nav className="space-y-1">
        <Item id="vehicles" icon={<Car size={18}/>} label="Veicoli" />
        <Item id="reparations" icon={<Wrench size={18}/>} label="Riparazioni" />
        <Item id="recurring-bills" icon={<Repeat size={18}/>} label="Spese ricorrenti" />
        <div className="mt-4 border-t" style={{ borderColor: 'var(--line)' }} />
        <button className="btn btn-ghost w-full justify-start opacity-60 cursor-not-allowed">
          <Settings size={18}/> Impostazioni
        </button>
      </nav>
      <button onClick={logout} className="btn btn-ghost mt-6 w-full justify-center text-sm">
        <LogOut size={16}/> Esci
      </button>
    </aside>
  )
}
