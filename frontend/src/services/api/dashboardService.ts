import axios from 'axios'
import type { Dashboard, DashboardFilters } from '../../types'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:5050/api',
})

export async function fetchDashboard(filters: DashboardFilters, headcount: number | null): Promise<Dashboard> {
  const params: Record<string, string> = {}
  if (filters.month) params.month = filters.month
  if (filters.shift) params.shift = filters.shift
  if (headcount && headcount > 0) params.headcount = String(headcount)
  const { data } = await api.get<Dashboard>('/dashboard', { params })
  return data
}
