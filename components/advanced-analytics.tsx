"use client"

import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
    Area, AreaChart, Bar, BarChart, CartesianGrid, Cell,
    Line, LineChart, Pie, PieChart, Radar, RadarChart,
    PolarGrid, PolarAngleAxis, PolarRadiusAxis,
    ResponsiveContainer, Tooltip, XAxis, YAxis, TooltipProps
} from "recharts"
import { ArrowUp, ArrowDown, TrendingUp, Zap, Target, Users } from "lucide-react"

// --- Data ---
const revenueData = [
    { name: "Ene", revenue: 4000, profit: 2400 },
    { name: "Feb", revenue: 3000, profit: 1398 },
    { name: "Mar", revenue: 2000, profit: 9800 },
    { name: "Abr", revenue: 2780, profit: 3908 },
    { name: "May", revenue: 1890, profit: 4800 },
    { name: "Jun", revenue: 2390, profit: 3800 },
    { name: "Jul", revenue: 3490, profit: 4300 },
    { name: "Ago", revenue: 4200, profit: 5400 },
    { name: "Sep", revenue: 5100, profit: 6200 },
    { name: "Oct", revenue: 4800, profit: 5900 },
    { name: "Nov", revenue: 5600, profit: 7100 },
    { name: "Dic", revenue: 6200, profit: 7800 },
]

const radarData = [
    { subject: 'Ventas', A: 120, B: 110, fullMark: 150 },
    { subject: 'Marketing', A: 98, B: 130, fullMark: 150 },
    { subject: 'Dev', A: 86, B: 130, fullMark: 150 },
    { subject: 'Soporte', A: 99, B: 100, fullMark: 150 },
    { subject: 'Finanzas', A: 85, B: 90, fullMark: 150 },
    { subject: 'HR', A: 65, B: 85, fullMark: 150 },
]

const activityData = [
    { hour: "09am", value: 20 },
    { hour: "10am", value: 45 },
    { hour: "11am", value: 80 },
    { hour: "12pm", value: 50 },
    { hour: "01pm", value: 30 },
    { hour: "02pm", value: 70 },
    { hour: "03pm", value: 90 },
    { hour: "04pm", value: 65 },
    { hour: "05pm", value: 40 },
]

// --- Components ---

const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
        return (
            <div className="bg-zinc-950/90 border border-white/10 p-4 rounded-xl shadow-2xl backdrop-blur-md">
                <p className="text-zinc-400 text-xs mb-2">{label}</p>
                {payload.map((entry, index) => (
                    <div key={index} className="flex items-center gap-2 mb-1 last:mb-0">
                        <div className="w-2 h-2 rounded-full" style={{ backgroundColor: entry.color }} />
                        <span className="text-sm font-semibold text-white">
                            {entry.name}: {typeof entry.value === 'number' ? entry.value.toLocaleString() : entry.value}
                        </span>
                    </div>
                ))}
            </div>
        )
    }
    return null
}

export function OverviewAreaChart() {
    return (
        <Card className="p-6 bg-card/40 backdrop-blur-xl border-white/5 relative overflow-hidden group hover:border-white/10 transition-all duration-500">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-purple-500/5 -z-10" />
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h3 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-white/60">Crecimiento Anual</h3>
                    <p className="text-zinc-500 text-sm">Ingresos vs Utilidad Neta</p>
                </div>
                <Badge variant="outline" className="bg-green-500/10 text-green-500 border-green-500/20 py-1 px-3">
                    <TrendingUp className="w-3 h-3 mr-1" /> +24.5% YTD
                </Badge>
            </div>

            <div className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={revenueData}>
                        <defs>
                            <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3} />
                                <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
                            </linearGradient>
                            <linearGradient id="colorProfit" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                                <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                            </linearGradient>
                        </defs>
                        <Tooltip content={<CustomTooltip />} cursor={{ stroke: 'rgba(255,255,255,0.1)', strokeWidth: 1 }} />
                        <Area
                            type="monotone"
                            dataKey="revenue"
                            stroke="#8b5cf6"
                            strokeWidth={3}
                            fillOpacity={1}
                            fill="url(#colorRevenue)"
                            name="Ingresos"
                        />
                        <Area
                            type="monotone"
                            dataKey="profit"
                            stroke="#10b981"
                            strokeWidth={3}
                            fillOpacity={1}
                            fill="url(#colorProfit)"
                            name="Utilidad"
                        />
                    </AreaChart>
                </ResponsiveContainer>
            </div>
        </Card>
    )
}

export function TeamPerformanceRadar() {
    return (
        <Card className="p-6 bg-card/40 backdrop-blur-xl border-white/5 relative overflow-hidden h-full">
            <div className="flex justify-between items-center mb-4">
                <div>
                    <h3 className="text-lg font-bold">Rendimiento por Área</h3>
                    <p className="text-zinc-500 text-sm">Objetivos vs Realidad</p>
                </div>
            </div>
            <div className="h-[250px] w-full flex items-center justify-center">
                <ResponsiveContainer width="100%" height="100%">
                    <RadarChart cx="50%" cy="50%" outerRadius="80%" data={radarData}>
                        <PolarGrid stroke="rgba(255,255,255,0.1)" />
                        <PolarAngleAxis dataKey="subject" tick={{ fill: '#71717a', fontSize: 10 }} />
                        <PolarRadiusAxis angle={30} domain={[0, 150]} tick={false} axisLine={false} />
                        <Radar
                            name="Meta"
                            dataKey="B"
                            stroke="#3f3f46"
                            strokeWidth={2}
                            fill="#3f3f46"
                            fillOpacity={0.1}
                        />
                        <Radar
                            name="Actual"
                            dataKey="A"
                            stroke="#ec4899"
                            strokeWidth={3}
                            fill="#ec4899"
                            fillOpacity={0.4}
                        />
                        <Tooltip content={<CustomTooltip />} />
                    </RadarChart>
                </ResponsiveContainer>
            </div>
        </Card>
    )
}

export function ActivityHeatmap() {
    return (
        <Card className="p-6 bg-card/40 backdrop-blur-xl border-white/5">
            <h3 className="text-lg font-bold mb-4">Actividad en Tiempo Real</h3>
            <div className="flex items-end justify-between h-[100px] gap-2">
                {activityData.map((item, idx) => (
                    <div key={idx} className="flex-1 flex flex-col items-center gap-2 group">
                        <div
                            className="w-full bg-primary/20 rounded-t-sm relative overflow-hidden transition-all duration-300 group-hover:bg-primary/40"
                            style={{ height: `${item.value}%` }}
                        >
                            <div className="absolute bottom-0 left-0 w-full h-full bg-gradient-to-t from-primary to-transparent opacity-50" />
                        </div>
                        <span className="text-[10px] text-zinc-500">{item.hour}</span>
                    </div>
                ))}
            </div>
        </Card>
    )
}

// --- Additional Data ---
const expensesData = [
    { name: 'Nómina', value: 45000, color: '#8b5cf6' },
    { name: 'Infraestructura', value: 25000, color: '#ec4899' },
    { name: 'Marketing', value: 15000, color: '#10b981' },
    { name: 'Operarión', value: 10000, color: '#f59e0b' },
]

const allocationData = [
    { name: 'Dev Team', active: 85, idle: 15 },
    { name: 'Design', active: 90, idle: 10 },
    { name: 'Marketing', active: 70, idle: 30 },
]

export function ExpensesDonut() {
    return (
        <Card className="p-6 bg-card/40 backdrop-blur-xl border-white/5 relative overflow-hidden h-full">
            <h3 className="text-lg font-bold mb-4">Desglose de Gastos</h3>
            <div className="h-[250px] w-full relative">
                <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                        <Pie
                            data={expensesData}
                            cx="50%"
                            cy="50%"
                            innerRadius={60}
                            outerRadius={80}
                            paddingAngle={5}
                            dataKey="value"
                        >
                            {expensesData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.color} stroke="rgba(0,0,0,0)" />
                            ))}
                        </Pie>
                        <Tooltip content={<CustomTooltip />} />
                    </PieChart>
                </ResponsiveContainer>
                {/* Center Text */}
                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                    <span className="text-2xl font-bold text-white">$95k</span>
                    <span className="text-xs text-zinc-500">Total Mes</span>
                </div>
            </div>
            <div className="grid grid-cols-2 gap-2 mt-4">
                {expensesData.map((item, idx) => (
                    <div key={idx} className="flex items-center gap-2 text-xs text-zinc-400">
                        <div className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }} />
                        <span>{item.name}</span>
                    </div>
                ))}
            </div>
        </Card>
    )
}

export function ResourceAllocation() {
    return (
        <Card className="p-6 bg-card/40 backdrop-blur-xl border-white/5 relative overflow-hidden h-full">
            <h3 className="text-lg font-bold mb-4">Asignación de Recursos</h3>
            <div className="space-y-6">
                {allocationData.map((item, idx) => (
                    <div key={idx}>
                        <div className="flex justify-between text-sm mb-2">
                            <span className="text-zinc-300">{item.name}</span>
                            <span className="text-emerald-400">{item.active}% Activo</span>
                        </div>
                        <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden flex">
                            <div className="h-full bg-emerald-500" style={{ width: `${item.active}%` }} />
                            <div className="h-full bg-zinc-800" style={{ width: `${item.idle}%` }} />
                        </div>
                    </div>
                ))}
            </div>
        </Card>
    )
}

export function NeonStatCard({ title, value, sub, icon: Icon, colorClass, borderClass }: any) {
    return (
        <Card className={`p-6 bg-zinc-950/50 backdrop-blur-2xl border ${borderClass} relative overflow-hidden group`}>
            {/* Glow Effect */}
            <div className={`absolute -right-10 -top-10 w-32 h-32 ${colorClass} blur-[60px] opacity-20 group-hover:opacity-30 transition-opacity duration-500`} />

            <div className="relative z-10">
                <div className="flex justify-between items-start mb-4">
                    <div className={`p-3 rounded-xl bg-white/5 border border-white/10 ${colorClass.replace('bg-', 'text-')}`}>
                        <Icon className="w-5 h-5" />
                    </div>
                    <Badge variant="outline" className="bg-white/5 border-white/10 text-xs">
                        <ArrowUp className="w-3 h-3 mr-1 text-green-500" /> 12%
                    </Badge>
                </div>
                <h3 className="text-3xl font-bold text-white mb-1">{value}</h3>
                <p className="text-zinc-400 text-sm">{title}</p>
                <div className="mt-4 h-1 w-full bg-white/5 rounded-full overflow-hidden">
                    <div className={`h-full w-[70%] ${colorClass} rounded-full`} />
                </div>
            </div>
        </Card>
    )
}
