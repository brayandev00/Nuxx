import { Card } from "./ui/card"
import { Badge } from "./ui/badge"
import { TrendingUp, TrendingDown } from "lucide-react"
import { cn } from "@/lib/utils"

interface TeamMember {
  id: number
  name: string
  role: string
  tasksCompleted: number
  hoursLogged: number
  efficiency: number
  trend: "up" | "down"
}

const teamData: TeamMember[] = [
  {
    id: 1,
    name: "Ana García",
    role: "UI/UX Designer",
    tasksCompleted: 45,
    hoursLogged: 168,
    efficiency: 94,
    trend: "up",
  },
  {
    id: 2,
    name: "Carlos Ruiz",
    role: "Frontend Dev",
    tasksCompleted: 52,
    hoursLogged: 172,
    efficiency: 91,
    trend: "up",
  },
  {
    id: 3,
    name: "María López",
    role: "Backend Dev",
    tasksCompleted: 38,
    hoursLogged: 160,
    efficiency: 88,
    trend: "down",
  },
  {
    id: 4,
    name: "Pedro Sánchez",
    role: "Product Manager",
    tasksCompleted: 28,
    hoursLogged: 145,
    efficiency: 95,
    trend: "up",
  },
  {
    id: 5,
    name: "Laura Martín",
    role: "QA Engineer",
    tasksCompleted: 62,
    hoursLogged: 155,
    efficiency: 92,
    trend: "up",
  },
  {
    id: 6,
    name: "Jorge Fernández",
    role: "DevOps",
    tasksCompleted: 35,
    hoursLogged: 170,
    efficiency: 89,
    trend: "down",
  },
]

export function DataTable() {
  return (
    <Card className="bg-card border-border overflow-hidden">
      <div className="p-6 border-b border-border">
        <h3 className="text-lg font-semibold text-foreground">Rendimiento del Equipo</h3>
        <p className="text-muted-foreground text-sm">Métricas individuales del mes actual</p>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border bg-secondary/30">
              <th className="text-left py-4 px-6 text-muted-foreground text-sm font-medium">Miembro</th>
              <th className="text-left py-4 px-6 text-muted-foreground text-sm font-medium">Rol</th>
              <th className="text-center py-4 px-6 text-muted-foreground text-sm font-medium">Tareas</th>
              <th className="text-center py-4 px-6 text-muted-foreground text-sm font-medium">Horas</th>
              <th className="text-center py-4 px-6 text-muted-foreground text-sm font-medium">Eficiencia</th>
              <th className="text-center py-4 px-6 text-muted-foreground text-sm font-medium">Tendencia</th>
            </tr>
          </thead>
          <tbody>
            {teamData.map((member, idx) => (
              <tr
                key={member.id}
                className={cn(
                  "border-b border-border/50 hover:bg-secondary/20 transition-colors",
                  idx % 2 === 0 && "bg-secondary/10",
                )}
              >
                <td className="py-4 px-6">
                  <span className="font-medium text-foreground">{member.name}</span>
                </td>
                <td className="py-4 px-6">
                  <span className="text-muted-foreground text-sm">{member.role}</span>
                </td>
                <td className="py-4 px-6 text-center">
                  <span className="text-foreground font-medium">{member.tasksCompleted}</span>
                </td>
                <td className="py-4 px-6 text-center">
                  <span className="text-foreground">{member.hoursLogged}h</span>
                </td>
                <td className="py-4 px-6 text-center">
                  <Badge
                    className={cn(
                      "font-medium",
                      member.efficiency >= 90 ? "bg-primary/20 text-primary" : "bg-yellow-500/20 text-yellow-400",
                    )}
                    variant="secondary"
                  >
                    {member.efficiency}%
                  </Badge>
                </td>
                <td className="py-4 px-6 text-center">
                  {member.trend === "up" ? (
                    <TrendingUp className="w-5 h-5 text-primary inline-block" />
                  ) : (
                    <TrendingDown className="w-5 h-5 text-destructive inline-block" />
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  )
}
