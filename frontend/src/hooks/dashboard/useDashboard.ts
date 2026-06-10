import { useCallback, useEffect, useRef, useState } from 'react'
import { fetchDashboard } from '../../services/api/dashboardService'
import { POLLING_INTERVAL_MS } from '../../constants/dashboard/dashboardConstants'
import type { Dashboard, DashboardFilters } from '../../types'

interface UseDashboardResult {
  data: Dashboard | null
  error: string | null
  isLoading: boolean
  lastUpdatedAt: string | null
  filters: DashboardFilters
  setMonth: (month: string | null) => void
  setShift: (shift: string | null) => void
  refresh: () => void
}

export function useDashboard(): UseDashboardResult {
  const [data, setData] = useState<Dashboard | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [lastUpdatedAt, setLastUpdatedAt] = useState<string | null>(null)
  const [filters, setFilters] = useState<DashboardFilters>({ month: null, shift: null })
  const filtersRef = useRef(filters)
  filtersRef.current = filters

  const load = useCallback(async () => {
    try {
      const dashboard = await fetchDashboard(filtersRef.current)
      setData(dashboard)
      setError(null)
      setLastUpdatedAt(new Date().toISOString())
    } catch {
      setError('Falha ao consultar a API do dashboard.')
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    setIsLoading(true)
    void load()
  }, [load, filters])

  useEffect(() => {
    const interval = setInterval(() => void load(), POLLING_INTERVAL_MS)
    return () => clearInterval(interval)
  }, [load])

  const setMonth = useCallback((month: string | null) => {
    setFilters((prev) => ({ ...prev, month }))
  }, [])

  const setShift = useCallback((shift: string | null) => {
    setFilters((prev) => ({ ...prev, shift }))
  }, [])

  const refresh = useCallback(() => {
    setIsLoading(true)
    void load()
  }, [load])

  return { data, error, isLoading, lastUpdatedAt, filters, setMonth, setShift, refresh }
}
