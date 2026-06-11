import { motion } from 'framer-motion'
import { pulseDot } from '../../animations/dashboardAnimations'
import { formatClock } from '../../helpers/formatHelpers'
import { ThemeToggle } from '../ui/ThemeToggle'
import { EmployeeSearch } from './EmployeeSearch'
import type { EmployeeRef } from '../../types'

interface DashboardHeaderProps {
  lastUpdatedAt: string | null
  hasError: boolean
  employees: EmployeeRef[]
  selectedEmployee: EmployeeRef | null
  onEmployeeSelect: (registration: string | null) => void
}

export function DashboardHeader({ lastUpdatedAt, hasError, employees, selectedEmployee, onEmployeeSelect }: DashboardHeaderProps) {
  return (
    <header className="flex flex-wrap items-center justify-between gap-4">
      <div className="flex items-center gap-4">
        <span className="select-none text-3xl font-light tracking-wide text-rose-600">欠勤</span>
        <div>
          <h1 className="text-xl font-semibold tracking-[0.22em] text-[var(--text-1)]">KEKKIN ANDON</h1>
          <p className="text-[11px] uppercase tracking-[0.3em] text-[var(--text-3)]">Painel de absenteísmo da fábrica</p>
        </div>
      </div>
      <div className="flex flex-wrap items-center gap-3">
        <div className="flex h-9 items-center gap-2 rounded-full border border-[var(--panel-border)] bg-[var(--panel)] px-4">
          <motion.span
            animate={pulseDot.animate}
            transition={pulseDot.transition}
            className={`h-2 w-2 rounded-full ${hasError ? 'bg-rose-500' : 'bg-emerald-400'}`}
          />
          <span className="text-[11px] font-medium text-[var(--text-2)]">
            {hasError ? 'SEM CONEXÃO COM A API' : lastUpdatedAt ? `ATUALIZADO ÀS ${formatClock(lastUpdatedAt)}` : 'CARREGANDO'}
          </span>
        </div>
        <EmployeeSearch employees={employees} selected={selectedEmployee} onSelect={onEmployeeSelect} />
        <ThemeToggle />
      </div>
    </header>
  )
}
