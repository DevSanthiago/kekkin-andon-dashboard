import { MONTH_LABELS, RATE_THRESHOLDS, ANDON_COLORS } from '../constants/dashboard/dashboardConstants'

export function formatPercent(value: number): string {
  return `${value.toLocaleString('pt-BR', { minimumFractionDigits: 1, maximumFractionDigits: 2 })}%`
}

export function formatInt(value: number): string {
  return value.toLocaleString('pt-BR')
}

export function formatMonthOption(value: string): string {
  const [year, month] = value.split('-')
  return `${MONTH_LABELS[month] ?? month} ${year}`
}

export function formatDayLabel(isoDate: string): string {
  const [, month, day] = isoDate.split('-')
  return `${day}/${month}`
}

export function formatClock(isoDate: string): string {
  return new Date(isoDate).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit', second: '2-digit' })
}

export function rateColor(rate: number): string {
  if (rate < RATE_THRESHOLDS.ok) return ANDON_COLORS.ok
  if (rate < RATE_THRESHOLDS.warning) return ANDON_COLORS.warning
  return ANDON_COLORS.critical
}

export function rateStatusLabel(rate: number): string {
  if (rate < RATE_THRESHOLDS.ok) return 'SAUDÁVEL'
  if (rate < RATE_THRESHOLDS.warning) return 'ATENÇÃO'
  return 'CRÍTICO'
}
