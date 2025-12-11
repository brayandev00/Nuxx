"use client"

import { Header } from "@/components/header"
import { StatsCard } from "@/components/stats-card"
import { RevenueChart } from "@/components/revenue-chart"
import { RecentProjects } from "@/components/recent-projects"
import { ActivityFeed } from "@/components/activity-feed"
import { DollarSign, Users, FolderKanban, Building2, ClipboardList, AlertCircle } from "lucide-react"
import { useTenant } from "@/lib/tenant-context"
import { useRouter } from "next/navigation"
import { useEffect } from "react"

export default function DashboardPage() {
  const { currentTenant, currentUser, getTenantUsers, currentRole } = useTenant()
  const router = useRouter()
  const users = getTenantUsers()

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!currentUser) {
      router.push("/login")
    }
  }, [currentUser, router])

  if (!currentUser || !currentTenant) {
    return (
      <div className="min-h-screen bg-[#09090B] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#09090B]">
      <Header
        title={currentTenant.branding?.welcomeMessage || `Bienvenido, ${currentUser.name.split(" ")[0]}`}
        subtitle={`${currentTenant.name} - ${currentRole?.name || "Usuario"}`}
      />

      <div className="p-8 space-y-8">
        {/* Welcome Banner */}
        <div className="p-6 rounded-2xl bg-gradient-to-r from-primary/10 via-primary/5 to-transparent border border-primary/20">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-primary/20 flex items-center justify-center">
                <Building2 className="w-7 h-7 text-primary" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-white">{currentTenant.name}</h2>
                <p className="text-zinc-400 text-sm">
                  Plan {currentTenant.plan} - {users.length} usuarios activos
                </p>
              </div>
            </div>
            <div className="hidden md:flex items-center gap-2 px-4 py-2 rounded-xl bg-[#18181B] border border-[#27272A]">
              <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
              <span className="text-sm text-zinc-400">Sistema operativo</span>
            </div>
          </div>
        </div>

        {/* Quick Tasks Alert */}
        <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center gap-4">
          <AlertCircle className="w-5 h-5 text-amber-400 flex-shrink-0" />
          <div className="flex-1">
            <p className="text-sm text-amber-200">Tienes 3 tareas pendientes para hoy</p>
          </div>
          <button
            onClick={() => router.push("/dashboard/tasks")}
            className="text-sm text-amber-400 hover:text-amber-300 font-medium"
          >
            Ver tareas
          </button>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatsCard title="Ingresos del Mes" value="$58,400" change={12.5} icon={DollarSign} trend="up" />
          <StatsCard title="Proyectos Activos" value="24" change={8.2} icon={FolderKanban} trend="up" />
          <StatsCard title="Empleados" value={users.length.toString()} change={0} icon={Users} trend="up" />
          <StatsCard title="Tareas Completadas" value="87%" change={5.3} icon={ClipboardList} trend="up" />
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <RevenueChart />
          </div>
          <ActivityFeed />
        </div>

        {/* Projects */}
        <RecentProjects />
      </div>
    </div>
  )
}
