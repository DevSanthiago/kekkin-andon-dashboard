import type { KeyboardEvent, FocusEvent } from 'react'
import { Select } from '../ui/Select'
import { formatMonthOption } from '../../helpers/formatHelpers'
import type { DashboardFilters, Meta } from '../../types'

interface FilterBarProps {
  meta: Meta
  filters: DashboardFilters
  onMonthChange: (month: string | null) => void
  onShiftChange: (shift: string | null) => void
  onHeadcountChange: (headcount: number | null) => void
}

export function FilterBar({ meta, filters, onMonthChange, onShiftChange, onHeadcountChange }: FilterBarProps) {
  const commitHeadcount = (raw: string) => {
    const parsed = Number(raw)
    onHeadcountChange(Number.isFinite(parsed) && parsed > 0 ? Math.floor(parsed) : null)
  }

  const handleBlur = (e: FocusEvent<HTMLInputElement>) => commitHeadcount(e.target.value)

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') commitHeadcount(e.currentTarget.value)
  }

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
      <label className="flex items-center gap-2 text-[11px] font-medium text-[var(--text-2)]">
        Efetivo total
        <input
          key={meta.headcount}
          type="number"
          min={1}
          defaultValue={meta.headcount}
          onBlur={handleBlur}
          onKeyDown={handleKeyDown}
          className="h-9 w-24 rounded-lg border border-[var(--panel-border)] bg-[var(--surface)] px-3 text-xs font-medium text-[var(--text-1)] outline-none transition-colors hover:border-rose-500/40 focus:border-rose-500/60 [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
        />
      </label>
      <span className="ml-auto text-[11px] text-[var(--text-3)]">
        Base do cálculo: {meta.headcount} colaboradores · {meta.workingDays} dias úteis no período
      </span>
    </div>
  )
}
