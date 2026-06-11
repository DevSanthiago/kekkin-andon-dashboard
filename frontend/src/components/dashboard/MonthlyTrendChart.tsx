import {
  Bar,
  ComposedChart,
  CartesianGrid,
  Line,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { Panel } from '../ui/Panel'
import { ANDON_COLORS } from '../../constants/dashboard/dashboardConstants'
import { useChartTheme } from '../../hooks/theme/useChartTheme'
import type { MonthlyPoint } from '../../types'

interface MonthlyTrendChartProps {
  data: MonthlyPoint[]
}

export function MonthlyTrendChart({ data }: MonthlyTrendChartProps) {
  const chart = useChartTheme()

  return (
    <Panel title="Tendência mensal" subtitle="Dias de ausência e taxa de absenteísmo por mês" className="xl:col-span-2">
      <ResponsiveContainer width="100%" height={280}>
        <ComposedChart data={data} margin={{ top: 8, right: 8, left: -16, bottom: 0 }}>
          <CartesianGrid stroke={chart.grid} strokeDasharray="3 3" vertical={false} />
          <XAxis dataKey="month" tick={{ fill: '#64748b', fontSize: 11 }} axisLine={false} tickLine={false} />
          <YAxis yAxisId="days" tick={{ fill: '#64748b', fontSize: 11 }} axisLine={false} tickLine={false} />
          <YAxis
            yAxisId="rate"
            orientation="right"
            tick={{ fill: '#64748b', fontSize: 11 }}
            axisLine={false}
            tickLine={false}
            unit="%"
          />
          <Tooltip
            contentStyle={chart.tooltipStyle}
            labelStyle={{ color: chart.labelColor }}
            formatter={(value, name) => (name === 'Taxa' ? [`${String(value)}%`, name] : [Number(value ?? 0), name])}
          />
          <Bar yAxisId="days" dataKey="total" name="Ausências" fill="#334155" radius={[6, 6, 0, 0]} maxBarSize={48} />
          <Bar yAxisId="days" dataKey="unjustified" name="Sem justificativa" fill={ANDON_COLORS.critical} radius={[6, 6, 0, 0]} maxBarSize={48} />
          <Line
            yAxisId="rate"
            type="monotone"
            dataKey="rate"
            name="Taxa"
            stroke={ANDON_COLORS.warning}
            strokeWidth={2.5}
            dot={{ r: 4, fill: ANDON_COLORS.warning, strokeWidth: 0 }}
          />
        </ComposedChart>
      </ResponsiveContainer>
    </Panel>
  )
}
