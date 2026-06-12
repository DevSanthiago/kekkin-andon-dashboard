import { Panel } from '../ui/Panel'
import { MEASURE_COLORS, FALLBACK_TYPE_COLOR } from '../../constants/dashboard/dashboardConstants'
import { formatInt, formatPercent } from '../../helpers/formatHelpers'
import type { Disciplinary } from '../../types'

interface MeasureBreakdownProps {
  data: Disciplinary
}

export function MeasureBreakdown({ data }: MeasureBreakdownProps) {
  return (
    <Panel title="Medidas disciplinares" subtitle="Cobertura sobre as faltas sem justificativa do período">
      <div className="mb-5 flex items-baseline gap-2">
        <span className="text-4xl font-semibold tabular-nums text-[var(--text-1)]">{formatPercent(data.coverageRate)}</span>
        <span className="text-[11px] text-[var(--text-3)]">
          {formatInt(data.measuresApplied)} medidas · {formatInt(data.unjustifiedDays)} faltas injustificadas
        </span>
      </div>

      <div className="space-y-4">
        {data.byMeasure.map((item) => {
          const color = MEASURE_COLORS[item.label] ?? FALLBACK_TYPE_COLOR
          return (
            <div key={item.label}>
              <div className="mb-1 flex items-baseline justify-between text-xs">
                <span className="font-medium text-[var(--text-2)]">{item.label}</span>
                <span className="tabular-nums text-[var(--text-3)]">
                  {formatInt(item.value)} · {formatPercent(item.share)}
                </span>
              </div>
              <div className="h-2 overflow-hidden rounded-full bg-[var(--surface)]">
                <div className="h-full rounded-full" style={{ width: `${item.share}%`, backgroundColor: color }} />
              </div>
            </div>
          )
        })}
        {data.byMeasure.length === 0 && (
          <p className="text-xs text-[var(--text-3)]">Nenhuma medida disciplinar no período.</p>
        )}
      </div>

      {data.measuresCancelled > 0 && (
        <p className="mt-4 text-[11px] text-[var(--text-3)]">
          {formatInt(data.measuresCancelled)} {data.measuresCancelled === 1 ? 'medida cancelada' : 'medidas canceladas'} fora do cálculo
        </p>
      )}
    </Panel>
  )
}
