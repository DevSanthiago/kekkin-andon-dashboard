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

export const splashContainer: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.18 } },
}

export const splashDot: Variants = {
  hidden: { opacity: 0.25, scale: 0.8 },
  visible: {
    opacity: [0.25, 1, 0.25],
    scale: [0.8, 1.15, 0.8],
    transition: { duration: 1.2, repeat: Infinity, ease: 'easeInOut' },
  },
}

export const splashExit = {
  exit: { opacity: 0, transition: { duration: 0.5, ease: 'easeOut' as const } },
}
