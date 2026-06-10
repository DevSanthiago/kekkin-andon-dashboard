import { motion } from 'framer-motion'
import { useDashboard } from '../hooks/dashboard/useDashboard'
import { containerStagger } from '../animations/dashboardAnimations'
import { DashboardHeader } from '../components/dashboard/DashboardHeader'
import { FilterBar } from '../components/dashboard/FilterBar'
import { KpiGrid } from '../components/dashboard/KpiGrid'
import { MonthlyTrendChart } from '../components/dashboard/MonthlyTrendChart'
import { TypeDonutChart } from '../components/dashboard/TypeDonutChart'
import { DailyAreaChart } from '../components/dashboard/DailyAreaChart'
import { ManagerBarChart } from '../components/dashboard/ManagerBarChart'
import { ShiftSplit } from '../components/dashboard/ShiftSplit'
import { RecurrenceTable } from '../components/dashboard/RecurrenceTable'

export function DashboardPage() {
  const { data, error, isLoading, lastUpdatedAt, filters, setMonth, setShift } = useDashboard()

  return (
    <div className="min-h-screen bg-[#0a0b10] px-6 py-6 text-slate-200 lg:px-10">
      <div className="mx-auto max-w-[1600px] space-y-5">
        <DashboardHeader lastUpdatedAt={lastUpdatedAt} hasError={Boolean(error)} />

        {isLoading && !data && (
          <p className="py-24 text-center text-sm tracking-widest text-slate-500">CARREGANDO DADOS DA PLANILHA…</p>
        )}

        {error && !data && (
          <p className="py-24 text-center text-sm tracking-widest text-rose-400">{error}</p>
        )}

        {data && (
          <>
            <FilterBar meta={data.meta} filters={filters} onMonthChange={setMonth} onShiftChange={setShift} />

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
      </div>
    </div>
  )
}
