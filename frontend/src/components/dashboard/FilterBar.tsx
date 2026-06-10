import { Select } from '../ui/Select'
import { formatMonthOption } from '../../helpers/formatHelpers'
import type { DashboardFilters, Meta } from '../../types'

interface FilterBarProps {
  meta: Meta
  filters: DashboardFilters
  onMonthChange: (month: string | null) => void
  onShiftChange: (shift: string | null) => void
}

export function FilterBar({ meta, filters, onMonthChange, onShiftChange }: FilterBarProps) {
  return (
    <div className="flex flex-wrap items-center gap-3">
      <Select
        value={filters.month ?? ''}
        placeholder="Todos os meses"
        options={meta.availableMonths.map((m) => ({ value: m, label: formatMonthOption(m) }))}
        onChange={onMonthChange}
      />
      <Select
        value={filters.shift ?? ''}
        placeholder="Todos os turnos"
        options={meta.availableShifts.map((s) => ({ value: s, label: s }))}
        onChange={onShiftChange}
      />
      <span className="ml-auto text-[11px] text-slate-500">
        Base do cálculo: {meta.headcount} colaboradores · {meta.workingDays} dias úteis no período
      </span>
    </div>
  )
}
