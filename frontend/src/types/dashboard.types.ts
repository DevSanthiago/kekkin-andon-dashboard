export interface Kpis {
  totalAbsenceDays: number
  distinctEmployees: number
  absenteeismRate: number
  unjustifiedDays: number
  unjustifiedShare: number
  medicalDays: number
  medicalShare: number
  avgDaysPerEmployee: number
}

export interface MonthlyPoint {
  month: string
  year: number
  monthNumber: number
  total: number
  unjustified: number
  medical: number
  rate: number
}

export interface BreakdownItem {
  label: string
  value: number
  share: number
}

export interface RepeatOffender {
  registration: string
  name: string
  shift: string
  manager: string
  days: number
}

export interface DailyPoint {
  date: string
  total: number
}

export interface EmployeeRef {
  registration: string
  name: string
}

export interface Meta {
  headcount: number
  workingDays: number
  periodStart: string
  periodEnd: string
  generatedAt: string
  availableMonths: string[]
  availableShifts: string[]
  employees: EmployeeRef[]
}

export interface Dashboard {
  kpis: Kpis
  monthlyTrend: MonthlyPoint[]
  byType: BreakdownItem[]
  byShift: BreakdownItem[]
  byManager: BreakdownItem[]
  byJustification: BreakdownItem[]
  topRecurrences: RepeatOffender[]
  dailySeries: DailyPoint[]
  meta: Meta
}

export interface DashboardFilters {
  month: string | null
  shift: string | null
  employee: string | null
}
