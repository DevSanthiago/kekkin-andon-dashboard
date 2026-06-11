export const POLLING_INTERVAL_MS = 60_000

export const SPLASH_DURATION_MS = 6_000

export const ANDON_COLORS = {
  ok: '#34d399',
  warning: '#fbbf24',
  critical: '#f87171',
  accent: '#e11d48',
  line: '#38bdf8',
  muted: '#64748b',
} as const

export const RATE_THRESHOLDS = {
  ok: 2,
  warning: 3.5,
} as const

export const TYPE_COLORS: Record<string, string> = {
  'ATESTADO MEDICO': '#38bdf8',
  'DECLARAÇÃO DE HORAS': '#a78bfa',
  'SEM JUSTIFICATIVA': '#f87171',
  ATRASO: '#fbbf24',
  ABANDONO: '#e11d48',
  'ABONO LEGAL': '#34d399',
  'BANCO DE HORAS': '#2dd4bf',
  JUSTIFICADO: '#94a3b8',
  'EM ANALISE': '#64748b',
}

export const FALLBACK_TYPE_COLOR = '#475569'

export const MONTH_LABELS: Record<string, string> = {
  '01': 'Janeiro',
  '02': 'Fevereiro',
  '03': 'Março',
  '04': 'Abril',
  '05': 'Maio',
  '06': 'Junho',
  '07': 'Julho',
  '08': 'Agosto',
  '09': 'Setembro',
  '10': 'Outubro',
  '11': 'Novembro',
  '12': 'Dezembro',
}
