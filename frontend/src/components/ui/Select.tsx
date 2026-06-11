interface SelectOption {
  value: string
  label: string
}

interface SelectProps {
  value: string
  options: SelectOption[]
  placeholder: string
  onChange: (value: string | null) => void
}

export function Select({ value, options, placeholder, onChange }: SelectProps) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value === '' ? null : e.target.value)}
      className="h-9 rounded-lg border border-[var(--panel-border)] bg-[var(--surface)] px-3 text-xs font-medium text-[var(--text-1)] outline-none transition-colors hover:border-rose-500/40 focus:border-rose-500/60"
    >
      <option value="">{placeholder}</option>
      {options.map((o) => (
        <option key={o.value} value={o.value}>
          {o.label}
        </option>
      ))}
    </select>
  )
}
