import { useTheme } from './useTheme'

const CHART_THEMES = {
  dark: {
    grid: '#1e2430',
    cursor: 'rgba(255,255,255,0.03)',
    labelColor: '#e2e8f0',
    axisStrong: '#94a3b8',
    tooltipBg: '#161a23',
    tooltipBorder: '1px solid rgba(255,255,255,0.08)',
  },
  light: {
    grid: '#e2e8f0',
    cursor: 'rgba(0,0,0,0.04)',
    labelColor: '#0f172a',
    axisStrong: '#475569',
    tooltipBg: '#ffffff',
    tooltipBorder: '1px solid rgba(15,23,42,0.1)',
  },
} as const

export function useChartTheme() {
  const { theme } = useTheme()
  const palette = CHART_THEMES[theme]

  return {
    ...palette,
    tooltipStyle: {
      backgroundColor: palette.tooltipBg,
      border: palette.tooltipBorder,
      borderRadius: 12,
      fontSize: 12,
    },
  }
}
