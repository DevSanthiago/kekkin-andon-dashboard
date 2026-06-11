import { motion } from 'framer-motion'
import { splashContainer, splashDot, splashExit } from '../../animations/dashboardAnimations'

const DOTS = [0, 1, 2, 3, 4]

export function LoadingSplash() {
  return (
    <motion.div
      exit={splashExit.exit}
      className="fixed inset-0 z-50 flex flex-col items-center justify-center gap-7 bg-[var(--bg)]"
    >
      <h1 className="text-lg font-semibold tracking-[0.35em] text-[var(--text-1)]">KEKKIN ANDON</h1>
      <motion.div variants={splashContainer} initial="hidden" animate="visible" className="flex items-center gap-3">
        {DOTS.map((dot) => (
          <motion.span key={dot} variants={splashDot} className="h-3 w-3 rounded-full bg-rose-600" />
        ))}
      </motion.div>
      <p className="text-[11px] tracking-[0.3em] text-[var(--text-3)]">CARREGANDO DADOS DA PLANILHA</p>
    </motion.div>
  )
}
