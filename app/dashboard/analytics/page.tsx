import { Header } from "@/components/header"
import { StatsCard } from "@/components/stats-card"
import { WeeklyPerformanceChart, ProjectDistributionChart, MonthlyTrendChart } from "@/components/analytics-charts"
import { DataTable } from "@/components/data-table"
import { ProgressMetrics } from "@/components/progress-metrics"
import { BarChart3, Clock, CheckCircle, Users } from "lucide-react"

export default function AnalyticsPage() {
  return (
    <div className="min-h-screen">
      <Header title="Analítica" subtitle="Métricas y rendimiento del equipo" />

      <div className="p-8 space-y-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatsCard title="Tareas Completadas" value="248" change={15.3} icon={CheckCircle} trend="up" />
          <StatsCard title="Horas Registradas" value="1,240" change={8.7} icon={Clock} trend="up" />
          <StatsCard title="Proyectos Activos" value="12" change={4.2} icon={BarChart3} trend="up" />
          <StatsCard title="Miembros Activos" value="18" change={-2.1} icon={Users} trend="down" />
        </div>

        {/* Progress Metrics */}
        <ProgressMetrics />

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <WeeklyPerformanceChart />
          <ProjectDistributionChart />
        </div>

        {/* Trend Chart */}
        <MonthlyTrendChart />

        {/* Data Table */}
        <DataTable />
      </div>
    </div>
  )
}
