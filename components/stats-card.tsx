import { Card } from "./ui/card"
import { cn } from "@/lib/utils"
import { TrendingUp, TrendingDown } from "lucide-react"
import type { LucideIcon } from "lucide-react"

interface StatsCardProps {
  title: string
  value: string
  change: number
  icon: LucideIcon
  trend?: "up" | "down"
}

export function StatsCard({ title, value, change, icon: Icon, trend = "up" }: StatsCardProps) {
  const isPositive = trend === "up"

  return (
    <Card className="p-6 bg-card border-border hover:border-primary/30 transition-all duration-300 group">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-muted-foreground text-sm font-medium">{title}</p>
          <p className="text-3xl font-bold text-foreground mt-2">{value}</p>
          <div
            className={cn(
              "flex items-center gap-1 mt-2 text-sm font-medium",
              isPositive ? "text-primary" : "text-destructive",
            )}
          >
            {isPositive ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
            <span>
              {isPositive ? "+" : ""}
              {change}%
            </span>
            <span className="text-muted-foreground ml-1">vs mes anterior</span>
          </div>
        </div>
        <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
          <Icon className="w-6 h-6 text-primary" />
        </div>
      </div>
    </Card>
  )
}
