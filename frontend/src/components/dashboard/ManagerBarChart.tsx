import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { Panel } from '../ui/Panel'
import { useChartTheme } from '../../hooks/theme/useChartTheme'
import type { BreakdownItem } from '../../types'

interface ManagerBarChartProps {
  data: BreakdownItem[]
}

export function ManagerBarChart({ data }: ManagerBarChartProps) {
  const chart = useChartTheme()

  return (
    <Panel title="Por gestor" subtitle="Ausências registradas sob cada gestor">
      <ResponsiveContainer width="100%" height={Math.max(200, data.length * 28)}>
        <BarChart data={data} layout="vertical" margin={{ top: 0, right: 16, left: 8, bottom: 0 }}>
          <CartesianGrid stroke={chart.grid} strokeDasharray="3 3" horizontal={false} />
          <XAxis type="number" tick={{ fill: '#64748b', fontSize: 11 }} axisLine={false} tickLine={false} />
          <YAxis
            type="category"
            dataKey="label"
            width={92}
            tick={{ fill: chart.axisStrong, fontSize: 11 }}
            axisLine={false}
            tickLine={false}
          />
          <Tooltip
            cursor={{ fill: chart.cursor }}
            contentStyle={chart.tooltipStyle}
            labelStyle={{ color: chart.labelColor }}
            formatter={(value) => [Number(value ?? 0), 'Ausências']}
          />
          <Bar dataKey="value" fill="#7c5cf0" radius={[0, 6, 6, 0]} maxBarSize={16} />
        </BarChart>
      </ResponsiveContainer>
    </Panel>
  )
}
