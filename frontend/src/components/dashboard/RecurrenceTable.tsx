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
          <tr className="border-b border-[var(--panel-border)] text-[10px] uppercase tracking-widest text-[var(--text-3)]">
            <th className="pb-2 font-medium">Colaborador</th>
            <th className="pb-2 font-medium">Turno</th>
            <th className="pb-2 font-medium">Gestor</th>
            <th className="pb-2 text-right font-medium">Dias</th>
          </tr>
        </thead>
        <tbody>
          {data.map((row) => (
            <tr key={row.registration} className="border-b border-[var(--panel-border)] last:border-0">
              <td className="py-2 pr-2">
                <p className="truncate font-medium text-[var(--text-1)]">{row.name}</p>
                <p className="text-[10px] text-[var(--text-3)]">mat. {row.registration}</p>
              </td>
              <td className="py-2 pr-2 text-[var(--text-2)]">{row.shift || '—'}</td>
              <td className="py-2 pr-2 text-[var(--text-2)]">{row.manager || '—'}</td>
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
