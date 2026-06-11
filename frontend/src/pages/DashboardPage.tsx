import { AnimatePresence, motion } from 'framer-motion'
import { useDashboard } from '../hooks/dashboard/useDashboard'
import { useLoadingSplash } from '../hooks/dashboard/useLoadingSplash'
import { containerStagger } from '../animations/dashboardAnimations'
import { SPLASH_DURATION_MS } from '../constants/dashboard/dashboardConstants'
import { LoadingSplash } from '../components/dashboard/LoadingSplash'
import { DashboardHeader } from '../components/dashboard/DashboardHeader'
import { FilterBar } from '../components/dashboard/FilterBar'
import { KpiGrid } from '../components/dashboard/KpiGrid'
import { MonthlyTrendChart } from '../components/dashboard/MonthlyTrendChart'
import { TypeDonutChart } from '../components/dashboard/TypeDonutChart'
import { DailyAreaChart } from '../components/dashboard/DailyAreaChart'
import { ManagerBarChart } from '../components/dashboard/ManagerBarChart'
import { ShiftSplit } from '../components/dashboard/ShiftSplit'
import { RecurrenceTable } from '../components/dashboard/RecurrenceTable'
import { Footer } from '../components/layout/Footer'

export function DashboardPage() {
  const { data, error, lastUpdatedAt, filters, setMonth, setShift, setEmployee, setHeadcount } = useDashboard()
  const showSplash = useLoadingSplash(!data && !error, SPLASH_DURATION_MS)

  const employees = data?.meta.employees ?? []
  const selectedEmployee = filters.employee
    ? employees.find((e) => e.registration === filters.employee) ?? null
    : null

  return (
    <div className="min-h-screen bg-[var(--bg)] px-6 py-6 text-[var(--text-1)] transition-colors lg:px-10">
      <div className="mx-auto max-w-[1600px] space-y-5">
        <DashboardHeader
          lastUpdatedAt={lastUpdatedAt}
          hasError={Boolean(error)}
          employees={employees}
          selectedEmployee={selectedEmployee}
          onEmployeeSelect={setEmployee}
        />

        <AnimatePresence>{showSplash && <LoadingSplash />}</AnimatePresence>

        {!showSplash && error && !data && (
          <p className="py-24 text-center text-sm tracking-widest text-rose-400">{error}</p>
        )}

        {data && (
          <>
            <FilterBar
              meta={data.meta}
              filters={filters}
              employeeSelected={Boolean(filters.employee)}
              onMonthChange={setMonth}
              onShiftChange={setShift}
              onHeadcountChange={setHeadcount}
            />

            <motion.div variants={containerStagger} initial="hidden" animate="visible" className="space-y-5">
              <KpiGrid kpis={data.kpis} />

              <div className="grid grid-cols-1 gap-4 xl:grid-cols-3">
                <MonthlyTrendChart data={data.monthlyTrend} />
                <TypeDonutChart data={data.byType} />
              </div>

              <div className="grid grid-cols-1 gap-4 xl:grid-cols-3">
                <DailyAreaChart data={data.dailySeries} />
                <ShiftSplit data={data.byShift} />
              </div>

              <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
                <ManagerBarChart data={data.byManager} />
                <RecurrenceTable data={data.topRecurrences} />
              </div>
            </motion.div>
          </>
        )}

        <Footer />
      </div>
    </div>
  )
}
