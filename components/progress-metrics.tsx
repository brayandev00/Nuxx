import type React from "react"
import { Card } from "./ui/card"
import { Target, Clock, Zap, Award } from "lucide-react"

interface MetricProps {
  label: string
  value: number
  max: number
  icon: React.ElementType
  color: string
}

function CircularProgress({ label, value, max, icon: Icon, color }: MetricProps) {
  const percentage = (value / max) * 100
  const circumference = 2 * Math.PI * 40
  const offset = circumference - (percentage / 100) * circumference

  return (
    <div className="flex flex-col items-center">
      <div className="relative w-28 h-28">
        <svg className="w-28 h-28 -rotate-90">
          <circle cx="56" cy="56" r="40" fill="none" stroke="currentColor" strokeWidth="8" className="text-secondary" />
          <circle
            cx="56"
            cy="56"
            r="40"
            fill="none"
            stroke={color}
            strokeWidth="8"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            className="transition-all duration-500"
            style={{ filter: `drop-shadow(0 0 8px ${color}50)` }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <Icon className="w-5 h-5 text-muted-foreground mb-1" />
          <span className="text-xl font-bold text-foreground">{Math.round(percentage)}%</span>
        </div>
      </div>
      <span className="text-sm text-muted-foreground mt-3">{label}</span>
    </div>
  )
}

export function ProgressMetrics() {
  return (
    <Card className="p-6 bg-card border-border">
      <h3 className="text-lg font-semibold text-foreground mb-2">Métricas de Progreso</h3>
      <p className="text-muted-foreground text-sm mb-8">Objetivos del trimestre actual</p>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        <CircularProgress label="Proyectos" value={18} max={24} icon={Target} color="#10B981" />
        <CircularProgress label="Horas Meta" value={420} max={500} icon={Clock} color="#14b8a6" />
        <CircularProgress label="Velocidad" value={88} max={100} icon={Zap} color="#059669" />
        <CircularProgress label="Calidad" value={94} max={100} icon={Award} color="#047857" />
      </div>
    </Card>
  )
}
