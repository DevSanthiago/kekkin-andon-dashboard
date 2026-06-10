import type { Variants } from 'framer-motion'

export const containerStagger: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.06 } },
}

export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 14 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.45, ease: 'easeOut' } },
}

export const pulseDot = {
  animate: { opacity: [1, 0.25, 1] },
  transition: { duration: 2, repeat: Infinity, ease: 'easeInOut' as const },
}
