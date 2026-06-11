import { motion } from 'framer-motion'
import { pulseDot } from '../../animations/dashboardAnimations'
import { formatClock } from '../../helpers/formatHelpers'
import { ThemeToggle } from '../ui/ThemeToggle'

interface DashboardHeaderProps {
  lastUpdatedAt: string | null
  hasError: boolean
}

export function DashboardHeader({ lastUpdatedAt, hasError }: DashboardHeaderProps) {
  return (
    <header className="flex flex-wrap items-center justify-between gap-4">
      <div className="flex items-center gap-4">
        <span className="select-none text-3xl font-light tracking-wide text-rose-600">欠勤</span>
        <div>
          <h1 className="text-xl font-semibold tracking-[0.22em] text-[var(--text-1)]">KEKKIN ANDON</h1>
          <p className="text-[11px] uppercase tracking-[0.3em] text-[var(--text-3)]">Painel de absenteísmo da fábrica</p>
        </div>
      </div>
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2 rounded-full border border-[var(--panel-border)] bg-[var(--panel)] px-4 py-1.5">
          <motion.span
            animate={pulseDot.animate}
            transition={pulseDot.transition}
            className={`h-2 w-2 rounded-full ${hasError ? 'bg-rose-500' : 'bg-emerald-400'}`}
          />
          <span className="text-[11px] font-medium text-[var(--text-2)]">
            {hasError ? 'SEM CONEXÃO COM A API' : lastUpdatedAt ? `ATUALIZADO ÀS ${formatClock(lastUpdatedAt)}` : 'CARREGANDO'}
          </span>
        </div>
        <ThemeToggle />
      </div>
    </header>
  )
}
