import { useCallback, useEffect, useRef, useState } from 'react'
import { fetchDashboard } from '../../services/api/dashboardService'
import { POLLING_INTERVAL_MS } from '../../constants/dashboard/dashboardConstants'
import { STORAGE_KEYS } from '../../constants/storage/storageKeys'
import type { Dashboard, DashboardFilters } from '../../types'

interface UseDashboardResult {
  data: Dashboard | null
  error: string | null
  isLoading: boolean
  lastUpdatedAt: string | null
  filters: DashboardFilters
  headcount: number | null
  setMonth: (month: string | null) => void
  setShift: (shift: string | null) => void
  setHeadcount: (headcount: number | null) => void
  refresh: () => void
}

function readStoredHeadcount(): number | null {
  const stored = localStorage.getItem(STORAGE_KEYS.HEADCOUNT)
  const parsed = stored ? Number(stored) : NaN
  return Number.isFinite(parsed) && parsed > 0 ? parsed : null
}

export function useDashboard(): UseDashboardResult {
  const [data, setData] = useState<Dashboard | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [lastUpdatedAt, setLastUpdatedAt] = useState<string | null>(null)
  const [filters, setFilters] = useState<DashboardFilters>({ month: null, shift: null })
  const [headcount, setHeadcountState] = useState<number | null>(readStoredHeadcount)
  const filtersRef = useRef(filters)
  const headcountRef = useRef(headcount)
  filtersRef.current = filters
  headcountRef.current = headcount

  const load = useCallback(async () => {
    try {
      const dashboard = await fetchDashboard(filtersRef.current, headcountRef.current)
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
  }, [load, filters, headcount])

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

  const setHeadcount = useCallback((value: number | null) => {
    if (value && value > 0) {
      localStorage.setItem(STORAGE_KEYS.HEADCOUNT, String(value))
      setHeadcountState(value)
    } else {
      localStorage.removeItem(STORAGE_KEYS.HEADCOUNT)
      setHeadcountState(null)
    }
  }, [])

  const refresh = useCallback(() => {
    setIsLoading(true)
    void load()
  }, [load])

  return { data, error, isLoading, lastUpdatedAt, filters, headcount, setMonth, setShift, setHeadcount, refresh }
}
