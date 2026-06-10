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
      className="h-9 rounded-lg border border-white/10 bg-[#161a23] px-3 text-xs font-medium text-slate-200 outline-none transition-colors hover:border-white/20 focus:border-rose-500/60"
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
