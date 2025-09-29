'use client'
import { listExpenses } from '@/features/expenses/api'
import { useVehicle } from '@/providers/VehicleProvider'
export default function ExportCsvButton() {
  const { activeId } = useVehicle()
  const exportCsv = async () => {
    const data = await listExpenses(activeId)
    const headers = ['id','vehicle_id','category','amount','currency','date','vendor','notes']
    const rows = data.map(e => headers.map(h => (e[h] ?? '')).join(','))
    const csv = [headers.join(','), ...rows].join('\n')
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a'); a.href = url; a.download = activeId ? `expenses_${activeId}.csv` : 'expenses.csv'
    document.body.appendChild(a); a.click(); document.body.removeChild(a); URL.revokeObjectURL(url)
  }
  return <button className="btn btn-ghost" onClick={exportCsv}>Esporta CSV</button>
}
