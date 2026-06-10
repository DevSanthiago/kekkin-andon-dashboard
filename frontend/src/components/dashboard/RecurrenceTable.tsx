import { Panel } from '../ui/Panel'
import type { RepeatOffender } from '../../types'

interface RecurrenceTableProps {
  data: RepeatOffender[]
}

export function RecurrenceTable({ data }: RecurrenceTableProps) {
  return (
    <Panel title="Maiores reincidências" subtitle="Colaboradores com mais dias de ausência no período">
      <table className="w-full text-left text-xs">
        <thead>
          <tr className="border-b border-white/5 text-[10px] uppercase tracking-widest text-slate-500">
            <th className="pb-2 font-medium">Colaborador</th>
            <th className="pb-2 font-medium">Turno</th>
            <th className="pb-2 font-medium">Gestor</th>
            <th className="pb-2 text-right font-medium">Dias</th>
          </tr>
        </thead>
        <tbody>
          {data.map((row) => (
            <tr key={row.registration} className="border-b border-white/[0.03] last:border-0">
              <td className="py-2 pr-2">
                <p className="truncate font-medium text-slate-200">{row.name}</p>
                <p className="text-[10px] text-slate-500">mat. {row.registration}</p>
              </td>
              <td className="py-2 pr-2 text-slate-400">{row.shift || '—'}</td>
              <td className="py-2 pr-2 text-slate-400">{row.manager || '—'}</td>
              <td className="py-2 text-right">
                <span className="rounded-md bg-rose-500/10 px-2 py-0.5 font-semibold tabular-nums text-rose-400">{row.days}</span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </Panel>
  )
}
