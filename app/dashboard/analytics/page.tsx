"use client"

import { Header } from "@/components/header"
import { OverviewAreaChart, TeamPerformanceRadar, ActivityHeatmap, NeonStatCard, ExpensesDonut, ResourceAllocation } from "@/components/advanced-analytics"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Zap, Target, Users, DollarSign, BrainCircuit, MessageSquare, Download, Share2, Clock } from "lucide-react"

export default function AnalyticsPage() {
  return (
    <div className="min-h-screen bg-black/40 relative">
      <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]" />

      <div className="relative z-10">
        <Header title="Nexus Analytics" subtitle="Inteligencia de negocios en tiempo real" />

        <div className="p-8 space-y-8">

          {/* AI Insight Banner */}
          <div className="rounded-2xl bg-gradient-to-r from-indigo-900/50 via-purple-900/50 to-pink-900/50 border border-indigo-500/20 p-6 flex items-start gap-4 animate-in fade-in slide-in-from-top-4 duration-700">
            <div className="p-3 bg-indigo-500/20 rounded-xl border border-indigo-500/30 shrink-0 animate-pulse">
              <BrainCircuit className="w-6 h-6 text-indigo-400" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white mb-1">Nuux AI Insight</h3>
              <p className="text-indigo-200/80 text-sm leading-relaxed">
                Detectamos un <span className="text-white font-bold">aumento del 34%</span> en la productividad del equipo de desarrollo esta semana.
                El pico de actividad ocurre entre las 11:00 AM y 2:00 PM. Se recomienda mantener las reuniones de standup antes de las 10:00 AM para maximizar el flujo.
              </p>
            </div>
          </div>

          {/* Controls */}
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <Tabs defaultValue="overview" className="w-full md:w-auto">
              <TabsList className="bg-zinc-900/50 border border-white/5">
                <TabsTrigger value="overview">General</TabsTrigger>
                <TabsTrigger value="financial">Financiero</TabsTrigger>
                <TabsTrigger value="operations">Operaciones</TabsTrigger>
              </TabsList>
            </Tabs>
            <div className="flex items-center gap-2">
              <Button variant="outline" className="border-white/10 hover:bg-white/5 bg-zinc-900/50 text-xs">
                Oct 20, 2024 - Nov 20, 2024
              </Button>
              <Button variant="outline" size="icon" className="border-white/10 hover:bg-white/5 bg-zinc-900/50"><Download className="w-4 h-4" /></Button>
              <Button variant="outline" size="icon" className="border-white/10 hover:bg-white/5 bg-zinc-900/50"><Share2 className="w-4 h-4" /></Button>
            </div>
          </div>

          {/* Bento Grid Layout */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">

            {/* Stats Row */}
            <NeonStatCard
              title="Ingresos Totales"
              value="$842.3k"
              icon={DollarSign}
              colorClass="bg-purple-500"
              borderClass="border-purple-500/20"
            />
            <NeonStatCard
              title="Usuarios Activos"
              value="2,420"
              icon={Users}
              colorClass="bg-blue-500"
              borderClass="border-blue-500/20"
            />
            <NeonStatCard
              title="Eficiencia"
              value="94.2%"
              icon={Zap}
              colorClass="bg-yellow-500"
              borderClass="border-yellow-500/20"
            />
            <NeonStatCard
              title="Objetivos Cumplidos"
              value="18/20"
              icon={Target}
              colorClass="bg-green-500"
              borderClass="border-green-500/20"
            />

            {/* Main Area Chart - Spans 2 cols, 2 rows */}
            <div className="md:col-span-2 lg:col-span-3 row-span-2">
              <OverviewAreaChart />
            </div>

            {/* Radar Chart */}
            <div className="md:col-span-1 lg:col-span-1">
              <TeamPerformanceRadar />
            </div>

            {/* Activity Feed / Heatmap */}
            <div className="md:col-span-1 lg:col-span-1">
              <ActivityHeatmap />
            </div>

            {/* Recent Logs (Bottom Span) */}
            <div className="md:col-span-2 lg:col-span-4 mt-4">
              <Card className="bg-card/30 backdrop-blur-md border-white/5">
                <CardHeader>
                  <CardTitle>Log de Eventos Críticos</CardTitle>
                  <CardDescription>Actividad reciente del sistema y alertas</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {[1, 2, 3].map(i => (
                      <div key={i} className="flex items-center justify-between p-3 rounded-lg bg-white/5 border border-white/5 hover:bg-white/10 transition-colors">
                        <div className="flex items-center gap-3">
                          <div className="p-2 rounded-full bg-blue-500/20 text-blue-400">
                            <MessageSquare className="w-4 h-4" />
                          </div>
                          <div>
                            <p className="text-sm font-medium text-white">Nuevo reporte de ventas generado</p>
                            <p className="text-xs text-zinc-500">Generado automáticamente por el sistema</p>
                          </div>
                        </div>
                        <span className="text-xs font-mono text-zinc-600">Hace {i * 15} min</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

          </div>
        </div>
      </div>
    </div>
  )
}
