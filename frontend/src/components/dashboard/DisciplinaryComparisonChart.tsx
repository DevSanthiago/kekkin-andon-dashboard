import {
  Bar,
  ComposedChart,
  CartesianGrid,
  Legend,
  Line,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { Panel } from '../ui/Panel'
import { ANDON_COLORS } from '../../constants/dashboard/dashboardConstants'
import { useChartTheme } from '../../hooks/theme/useChartTheme'
import type { DisciplinaryMonthlyPoint } from '../../types'

interface DisciplinaryComparisonChartProps {
  data: DisciplinaryMonthlyPoint[]
}

export function DisciplinaryComparisonChart({ data }: DisciplinaryComparisonChartProps) {
  const chart = useChartTheme()

  return (
    <Panel
      title="Faltas injustificadas × medidas disciplinares"
      subtitle="Comparativo mensal e cobertura de medidas aplicadas"
      className="xl:col-span-2"
    >
      <ResponsiveContainer width="100%" height={280}>
        <ComposedChart data={data} margin={{ top: 8, right: 8, left: -16, bottom: 0 }}>
          <CartesianGrid stroke={chart.grid} strokeDasharray="3 3" vertical={false} />
          <XAxis dataKey="month" tick={{ fill: '#64748b', fontSize: 11 }} axisLine={false} tickLine={false} />
          <YAxis yAxisId="count" tick={{ fill: '#64748b', fontSize: 11 }} axisLine={false} tickLine={false} />
          <YAxis
            yAxisId="coverage"
            orientation="right"
            tick={{ fill: '#64748b', fontSize: 11 }}
            axisLine={false}
            tickLine={false}
            unit="%"
          />
          <Tooltip
            contentStyle={chart.tooltipStyle}
            labelStyle={{ color: chart.labelColor }}
            formatter={(value, name) => (name === 'Cobertura' ? [`${String(value)}%`, name] : [Number(value ?? 0), name])}
          />
          <Legend wrapperStyle={{ fontSize: 11 }} />
          <Bar
            yAxisId="count"
            dataKey="unjustified"
            name="Faltas injustificadas"
            fill={ANDON_COLORS.critical}
            radius={[6, 6, 0, 0]}
            maxBarSize={48}
          />
          <Bar
            yAxisId="count"
            dataKey="measures"
            name="Medidas aplicadas"
            fill={ANDON_COLORS.line}
            radius={[6, 6, 0, 0]}
            maxBarSize={48}
          />
          <Line
            yAxisId="coverage"
            type="monotone"
            dataKey="coverage"
            name="Cobertura"
            stroke={ANDON_COLORS.warning}
            strokeWidth={2.5}
            dot={{ r: 4, fill: ANDON_COLORS.warning, strokeWidth: 0 }}
          />
        </ComposedChart>
      </ResponsiveContainer>
    </Panel>
  )
}
