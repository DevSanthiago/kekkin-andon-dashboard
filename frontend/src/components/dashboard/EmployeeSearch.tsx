import { useEmployeeSearch } from '../../hooks/dashboard/useEmployeeSearch'
import type { EmployeeRef } from '../../types'

interface EmployeeSearchProps {
  employees: EmployeeRef[]
  selected: EmployeeRef | null
  onSelect: (registration: string | null) => void
}

export function EmployeeSearch({ employees, selected, onSelect }: EmployeeSearchProps) {
  const search = useEmployeeSearch(employees, onSelect)

  if (selected) {
    return (
      <div className="flex h-9 items-center gap-2 rounded-full border border-rose-500/40 bg-[var(--panel)] pl-4 pr-2">
        <span className="max-w-44 truncate text-[11px] font-semibold text-rose-500">{selected.name}</span>
        <span className="text-[10px] text-[var(--text-3)]">mat. {selected.registration}</span>
        <button
          type="button"
          onClick={() => onSelect(null)}
          aria-label="Limpar colaborador"
          className="flex h-5 w-5 items-center justify-center rounded-full bg-rose-500/15 text-rose-500 transition-colors hover:bg-rose-500/30"
        >
          <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round">
            <path d="M18 6 6 18M6 6l12 12" />
          </svg>
        </button>
      </div>
    )
  }

  return (
    <div className="relative">
      <input
        type="text"
        value={search.query}
        placeholder="Colaborador (nome ou matrícula)"
        onChange={(e) => {
          search.setQuery(e.target.value)
          search.open()
        }}
        onFocus={search.open}
        onBlur={() => setTimeout(search.close, 150)}
        className="h-9 w-60 rounded-full border border-[var(--panel-border)] bg-[var(--panel)] px-4 text-[11px] font-medium text-[var(--text-1)] outline-none transition-colors placeholder:text-[var(--text-3)] hover:border-rose-500/40 focus:border-rose-500/60"
      />
      {search.isOpen && search.suggestions.length > 0 && (
        <ul className="absolute right-0 top-10 z-20 w-72 overflow-hidden rounded-xl border border-[var(--panel-border)] bg-[var(--panel)] shadow-[var(--panel-shadow)]">
          {search.suggestions.map((employee) => (
            <li key={employee.registration}>
              <button
                type="button"
                onMouseDown={() => search.select(employee)}
                className="flex w-full items-baseline justify-between gap-2 px-4 py-2 text-left transition-colors hover:bg-rose-500/10"
              >
                <span className="truncate text-xs font-medium text-[var(--text-1)]">{employee.name}</span>
                <span className="shrink-0 text-[10px] tabular-nums text-[var(--text-3)]">mat. {employee.registration}</span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
