"use client"

import { Card } from "./ui/card"
import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"

const data = [
  { month: "Ene", revenue: 18500, expenses: 12000 },
  { month: "Feb", revenue: 22300, expenses: 13500 },
  { month: "Mar", revenue: 19800, expenses: 11800 },
  { month: "Abr", revenue: 28400, expenses: 15200 },
  { month: "May", revenue: 32100, expenses: 16800 },
  { month: "Jun", revenue: 35600, expenses: 18200 },
  { month: "Jul", revenue: 38200, expenses: 19500 },
  { month: "Ago", revenue: 41800, expenses: 20100 },
  { month: "Sep", revenue: 45200, expenses: 21800 },
  { month: "Oct", revenue: 48900, expenses: 23400 },
  { month: "Nov", revenue: 52100, expenses: 24800 },
  { month: "Dic", revenue: 58400, expenses: 26200 },
]

export function RevenueChart() {
  return (
    <Card className="p-6 bg-card border-border">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-foreground">Ingresos vs Gastos</h3>
          <p className="text-muted-foreground text-sm">Rendimiento anual 2024</p>
        </div>
        <div className="flex items-center gap-4 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-primary" />
            <span className="text-muted-foreground">Ingresos</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-primary/30" />
            <span className="text-muted-foreground">Gastos</span>
          </div>
        </div>
      </div>

      <ResponsiveContainer width="100%" height={300}>
        <AreaChart data={data}>
          <defs>
            <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#10B981" stopOpacity={0.4} />
              <stop offset="100%" stopColor="#10B981" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="expenseGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#10B981" stopOpacity={0.15} />
              <stop offset="100%" stopColor="#10B981" stopOpacity={0} />
            </linearGradient>
          </defs>
          <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: "#71717a", fontSize: 12 }} />
          <YAxis
            axisLine={false}
            tickLine={false}
            tick={{ fill: "#71717a", fontSize: 12 }}
            tickFormatter={(value) => `$${value / 1000}k`}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: "#18181b",
              border: "1px solid #27272a",
              borderRadius: "8px",
              color: "#fafafa",
            }}
            formatter={(value: number) => [`$${value.toLocaleString()}`, ""]}
          />
          <Area
            type="monotone"
            dataKey="expenses"
            stroke="#10B981"
            strokeOpacity={0.3}
            fill="url(#expenseGradient)"
            strokeWidth={2}
          />
          <Area type="monotone" dataKey="revenue" stroke="#10B981" fill="url(#revenueGradient)" strokeWidth={2} />
        </AreaChart>
      </ResponsiveContainer>
    </Card>
  )
}
