import type { ReactNode } from 'react'
import { motion } from 'framer-motion'
import { fadeUp } from '../../animations/dashboardAnimations'

interface PanelProps {
  title?: string
  subtitle?: string
  className?: string
  children: ReactNode
}

export function Panel({ title, subtitle, className = '', children }: PanelProps) {
  return (
    <motion.section
      variants={fadeUp}
      className={`rounded-2xl border border-[var(--panel-border)] bg-[var(--panel)] p-5 shadow-[var(--panel-shadow)] transition-colors ${className}`}
    >
      {title && (
        <header className="mb-4">
          <h2 className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[var(--text-2)]">{title}</h2>
          {subtitle && <p className="mt-0.5 text-[11px] text-[var(--text-3)]">{subtitle}</p>}
        </header>
      )}
      {children}
    </motion.section>
  )
}
