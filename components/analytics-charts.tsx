"use client"

import { Card } from "./ui/card"
import {
  Bar,
  BarChart,
  Line,
  LineChart,
  Pie,
  PieChart,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  Legend,
} from "recharts"

const performanceData = [
  { name: "Lun", completed: 12, pending: 4 },
  { name: "Mar", completed: 18, pending: 6 },
  { name: "Mié", completed: 15, pending: 3 },
  { name: "Jue", completed: 22, pending: 8 },
  { name: "Vie", completed: 28, pending: 5 },
  { name: "Sáb", completed: 8, pending: 2 },
  { name: "Dom", completed: 5, pending: 1 },
]

const projectDistribution = [
  { name: "Desarrollo", value: 45, color: "#10B981" },
  { name: "Diseño", value: 25, color: "#14b8a6" },
  { name: "Marketing", value: 15, color: "#059669" },
  { name: "Soporte", value: 15, color: "#047857" },
]

const monthlyTrend = [
  { month: "Ene", tasks: 120, productivity: 85 },
  { month: "Feb", tasks: 145, productivity: 88 },
  { month: "Mar", tasks: 138, productivity: 82 },
  { month: "Abr", tasks: 165, productivity: 91 },
  { month: "May", tasks: 178, productivity: 89 },
  { month: "Jun", tasks: 195, productivity: 94 },
]

export function WeeklyPerformanceChart() {
  return (
    <Card className="p-6 bg-card border-border">
      <h3 className="text-lg font-semibold text-foreground mb-2">Rendimiento Semanal</h3>
      <p className="text-muted-foreground text-sm mb-6">Tareas completadas vs pendientes</p>
      <ResponsiveContainer width="100%" height={250}>
        <BarChart data={performanceData} barGap={4}>
          <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: "#71717a", fontSize: 12 }} />
          <YAxis axisLine={false} tickLine={false} tick={{ fill: "#71717a", fontSize: 12 }} />
          <Tooltip
            contentStyle={{
              backgroundColor: "#18181b",
              border: "1px solid #27272a",
              borderRadius: "8px",
              color: "#fafafa",
            }}
          />
          <Bar dataKey="completed" fill="#10B981" radius={[4, 4, 0, 0]} name="Completadas" />
          <Bar dataKey="pending" fill="#10B981" fillOpacity={0.3} radius={[4, 4, 0, 0]} name="Pendientes" />
        </BarChart>
      </ResponsiveContainer>
    </Card>
  )
}

export function ProjectDistributionChart() {
  return (
    <Card className="p-6 bg-card border-border">
      <h3 className="text-lg font-semibold text-foreground mb-2">Distribución por Área</h3>
      <p className="text-muted-foreground text-sm mb-6">Proyectos activos por departamento</p>
      <div className="flex items-center gap-8">
        <div className="w-1/2 h-[200px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={projectDistribution}
                cx="50%"
                cy="50%"
                innerRadius={50}
                outerRadius={80}
                paddingAngle={4}
                dataKey="value"
              >
                {projectDistribution.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: "#18181b",
                  border: "1px solid #27272a",
                  borderRadius: "8px",
                  color: "#fafafa",
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="space-y-3">
          {projectDistribution.map((item) => (
            <div key={item.name} className="flex items-center gap-3">
              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
              <span className="text-sm text-muted-foreground">{item.name}</span>
              <span className="text-sm font-semibold text-foreground">{item.value}%</span>
            </div>
          ))}
        </div>
      </div>
    </Card>
  )
}

export function MonthlyTrendChart() {
  return (
    <Card className="p-6 bg-card border-border">
      <h3 className="text-lg font-semibold text-foreground mb-2">Tendencia Mensual</h3>
      <p className="text-muted-foreground text-sm mb-6">Tareas completadas y productividad</p>
      <ResponsiveContainer width="100%" height={250}>
        <LineChart data={monthlyTrend}>
          <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: "#71717a", fontSize: 12 }} />
          <YAxis axisLine={false} tickLine={false} tick={{ fill: "#71717a", fontSize: 12 }} />
          <Tooltip
            contentStyle={{
              backgroundColor: "#18181b",
              border: "1px solid #27272a",
              borderRadius: "8px",
              color: "#fafafa",
            }}
          />
          <Legend />
          <Line
            type="monotone"
            dataKey="tasks"
            stroke="#10B981"
            strokeWidth={3}
            dot={{ fill: "#10B981", strokeWidth: 0, r: 4 }}
            name="Tareas"
          />
          <Line
            type="monotone"
            dataKey="productivity"
            stroke="#10B981"
            strokeOpacity={0.4}
            strokeWidth={2}
            strokeDasharray="5 5"
            dot={false}
            name="Productividad %"
          />
        </LineChart>
      </ResponsiveContainer>
    </Card>
  )
}
