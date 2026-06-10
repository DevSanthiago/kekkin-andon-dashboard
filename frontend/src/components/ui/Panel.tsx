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
      className={`rounded-2xl border border-white/5 bg-[#11131a] p-5 shadow-[0_8px_30px_rgba(0,0,0,0.35)] ${className}`}
    >
      {title && (
        <header className="mb-4">
          <h2 className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-400">{title}</h2>
          {subtitle && <p className="mt-0.5 text-[11px] text-slate-500">{subtitle}</p>}
        </header>
      )}
      {children}
    </motion.section>
  )
}
