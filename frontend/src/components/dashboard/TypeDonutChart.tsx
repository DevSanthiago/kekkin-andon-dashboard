import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts'
import { Panel } from '../ui/Panel'
import { FALLBACK_TYPE_COLOR, TYPE_COLORS } from '../../constants/dashboard/dashboardConstants'
import { formatPercent } from '../../helpers/formatHelpers'
import type { BreakdownItem } from '../../types'

interface TypeDonutChartProps {
  data: BreakdownItem[]
}

export function TypeDonutChart({ data }: TypeDonutChartProps) {
  return (
    <Panel title="Por tipo de ocorrência" subtitle="Distribuição das ausências registradas">
      <div className="flex items-center gap-4">
        <ResponsiveContainer width="55%" height={220}>
          <PieChart>
            <Pie data={data} dataKey="value" nameKey="label" innerRadius={56} outerRadius={92} paddingAngle={2} strokeWidth={0}>
              {data.map((item) => (
                <Cell key={item.label} fill={TYPE_COLORS[item.label] ?? FALLBACK_TYPE_COLOR} />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{ backgroundColor: '#161a23', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 12, fontSize: 12 }}
              formatter={(value, _name, entry) => {
                const item = entry?.payload as BreakdownItem | undefined
                return [`${Number(value ?? 0)} (${formatPercent(item?.share ?? 0)})`, item?.label ?? '']
              }}
            />
          </PieChart>
        </ResponsiveContainer>
        <ul className="flex-1 space-y-1.5 text-[11px]">
          {data.slice(0, 6).map((item) => (
            <li key={item.label} className="flex items-center gap-2">
              <span className="h-2 w-2 shrink-0 rounded-full" style={{ backgroundColor: TYPE_COLORS[item.label] ?? FALLBACK_TYPE_COLOR }} />
              <span className="truncate text-slate-300">{item.label}</span>
              <span className="ml-auto tabular-nums text-slate-500">{formatPercent(item.share)}</span>
            </li>
          ))}
        </ul>
      </div>
    </Panel>
  )
}
