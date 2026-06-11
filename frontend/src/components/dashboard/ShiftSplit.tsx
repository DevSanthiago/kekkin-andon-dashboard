import { Panel } from '../ui/Panel'
import { formatInt, formatPercent } from '../../helpers/formatHelpers'
import type { BreakdownItem } from '../../types'

interface ShiftSplitProps {
  data: BreakdownItem[]
}

export function ShiftSplit({ data }: ShiftSplitProps) {
  return (
    <Panel title="Por turno" subtitle="Participação de cada turno nas ausências">
      <div className="space-y-4">
        {data.map((item) => (
          <div key={item.label}>
            <div className="mb-1 flex items-baseline justify-between text-xs">
              <span className="font-medium text-[var(--text-2)]">{item.label}</span>
              <span className="tabular-nums text-[var(--text-3)]">
                {formatInt(item.value)} · {formatPercent(item.share)}
              </span>
            </div>
            <div className="h-2 overflow-hidden rounded-full bg-[var(--surface)]">
              <div className="h-full rounded-full bg-gradient-to-r from-rose-600 to-amber-400" style={{ width: `${item.share}%` }} />
            </div>
          </div>
        ))}
      </div>
    </Panel>
  )
}
