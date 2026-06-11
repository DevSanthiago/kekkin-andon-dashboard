import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { Panel } from '../ui/Panel'
import { ANDON_COLORS } from '../../constants/dashboard/dashboardConstants'
import { formatDayLabel } from '../../helpers/formatHelpers'
import { useChartTheme } from '../../hooks/theme/useChartTheme'
import type { DailyPoint } from '../../types'

interface DailyAreaChartProps {
  data: DailyPoint[]
}

export function DailyAreaChart({ data }: DailyAreaChartProps) {
  const chart = useChartTheme()

  return (
    <Panel title="Ausências por dia" subtitle="Série diária do período filtrado" className="xl:col-span-2">
      <ResponsiveContainer width="100%" height={220}>
        <AreaChart data={data} margin={{ top: 8, right: 8, left: -24, bottom: 0 }}>
          <defs>
            <linearGradient id="dailyFill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={ANDON_COLORS.line} stopOpacity={0.35} />
              <stop offset="100%" stopColor={ANDON_COLORS.line} stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid stroke={chart.grid} strokeDasharray="3 3" vertical={false} />
          <XAxis
            dataKey="date"
            tickFormatter={formatDayLabel}
            tick={{ fill: '#64748b', fontSize: 10 }}
            axisLine={false}
            tickLine={false}
            minTickGap={28}
          />
          <YAxis tick={{ fill: '#64748b', fontSize: 11 }} axisLine={false} tickLine={false} allowDecimals={false} />
          <Tooltip
            contentStyle={chart.tooltipStyle}
            labelStyle={{ color: chart.labelColor }}
            labelFormatter={(label) => formatDayLabel(String(label))}
            formatter={(value) => [Number(value ?? 0), 'Ausências']}
          />
          <Area type="monotone" dataKey="total" stroke={ANDON_COLORS.line} strokeWidth={2} fill="url(#dailyFill)" />
        </AreaChart>
      </ResponsiveContainer>
    </Panel>
  )
}
