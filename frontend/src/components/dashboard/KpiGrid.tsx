import { Panel } from '../ui/Panel'
import { formatInt, formatPercent, rateColor, rateStatusLabel } from '../../helpers/formatHelpers'
import type { Kpis } from '../../types'

interface KpiGridProps {
  kpis: Kpis
}

interface KpiCardProps {
  label: string
  value: string
  detail: string
  accentColor?: string
  badge?: string
}

function KpiCard({ label, value, detail, accentColor, badge }: KpiCardProps) {
  return (
    <Panel>
      <div className="flex items-start justify-between">
        <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-400">{label}</p>
        {badge && (
          <span
            className="rounded-full px-2 py-0.5 text-[10px] font-bold tracking-widest"
            style={{ color: accentColor, backgroundColor: `${accentColor}1a` }}
          >
            {badge}
          </span>
        )}
      </div>
      <p className="mt-3 text-4xl font-semibold tabular-nums" style={{ color: accentColor ?? '#e2e8f0' }}>
        {value}
      </p>
      <p className="mt-2 text-[11px] text-slate-500">{detail}</p>
    </Panel>
  )
}

export function KpiGrid({ kpis }: KpiGridProps) {
  const color = rateColor(kpis.absenteeismRate)

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
      <KpiCard
        label="Taxa de absenteísmo"
        value={formatPercent(kpis.absenteeismRate)}
        detail="Dias de ausência ÷ capacidade (efetivo × dias úteis)"
        accentColor={color}
        badge={rateStatusLabel(kpis.absenteeismRate)}
      />
      <KpiCard
        label="Dias de ausência"
        value={formatInt(kpis.totalAbsenceDays)}
        detail={`${formatInt(kpis.distinctEmployees)} colaboradores · média ${kpis.avgDaysPerEmployee.toLocaleString('pt-BR')} dias cada`}
      />
      <KpiCard
        label="Sem justificativa"
        value={formatInt(kpis.unjustifiedDays)}
        detail={`${formatPercent(kpis.unjustifiedShare)} do total (inclui abandonos)`}
        accentColor="#f87171"
      />
      <KpiCard
        label="Atestados médicos"
        value={formatInt(kpis.medicalDays)}
        detail={`${formatPercent(kpis.medicalShare)} do total de ausências`}
        accentColor="#38bdf8"
      />
    </div>
  )
}
