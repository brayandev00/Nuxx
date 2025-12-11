import { Card } from "./ui/card"
import { Badge } from "./ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar"
import { MoreHorizontal, Clock } from "lucide-react"
import { Button } from "./ui/button"

const projects = [
  {
    id: 1,
    name: "Rediseño App Móvil",
    status: "En progreso",
    progress: 75,
    dueDate: "15 Dic",
    team: [
      { name: "Ana", avatar: "/professional-woman.png" },
      { name: "Carlos", avatar: "/professional-man.png" },
      { name: "María", avatar: "/woman-developer.png" },
    ],
  },
  {
    id: 2,
    name: "Sistema de Facturación",
    status: "Completado",
    progress: 100,
    dueDate: "10 Dic",
    team: [
      { name: "Pedro", avatar: "/man-developer.png" },
      { name: "Laura", avatar: "/woman-designer.png" },
    ],
  },
  {
    id: 3,
    name: "Dashboard Analytics",
    status: "Pendiente",
    progress: 20,
    dueDate: "22 Dic",
    team: [{ name: "Jorge", avatar: "/man-analyst.jpg" }],
  },
  {
    id: 4,
    name: "API REST v2",
    status: "En progreso",
    progress: 45,
    dueDate: "30 Dic",
    team: [
      { name: "Luis", avatar: "/man-programmer.jpg" },
      { name: "Sofia", avatar: "/woman-engineer-at-work.png" },
      { name: "Diego", avatar: "/man-developer.png" },
      { name: "+2", avatar: "" },
    ],
  },
]

const statusColors: Record<string, string> = {
  Completado: "bg-primary/20 text-primary border-primary/30",
  "En progreso": "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
  Pendiente: "bg-muted text-muted-foreground border-border",
}

export function RecentProjects() {
  return (
    <Card className="p-6 bg-card border-border">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-foreground">Proyectos Recientes</h3>
        <Button variant="ghost" size="sm" className="text-primary hover:text-primary/80">
          Ver todos
        </Button>
      </div>

      <div className="space-y-4">
        {projects.map((project) => (
          <div key={project.id} className="p-4 rounded-xl bg-secondary/50 hover:bg-secondary transition-colors group">
            <div className="flex items-start justify-between mb-3">
              <div>
                <h4 className="font-medium text-foreground group-hover:text-primary transition-colors">
                  {project.name}
                </h4>
                <div className="flex items-center gap-2 mt-1 text-sm text-muted-foreground">
                  <Clock className="w-3 h-3" />
                  <span>{project.dueDate}</span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Badge className={statusColors[project.status]} variant="outline">
                  {project.status}
                </Badge>
                <Button
                  variant="ghost"
                  size="icon"
                  className="w-8 h-8 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <MoreHorizontal className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="mb-3">
              <div className="h-1.5 bg-secondary rounded-full overflow-hidden">
                <div
                  className="h-full bg-primary rounded-full transition-all duration-500"
                  style={{ width: `${project.progress}%` }}
                />
              </div>
              <span className="text-xs text-muted-foreground mt-1">{project.progress}% completado</span>
            </div>

            {/* Team */}
            <div className="flex items-center justify-between">
              <div className="flex -space-x-2">
                {project.team.slice(0, 4).map((member, idx) => (
                  <Avatar key={idx} className="w-7 h-7 border-2 border-card">
                    {member.avatar ? <AvatarImage src={member.avatar || "/placeholder.svg"} /> : null}
                    <AvatarFallback className="bg-primary/20 text-primary text-xs">
                      {member.name.includes("+") ? member.name : member.name[0]}
                    </AvatarFallback>
                  </Avatar>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </Card>
  )
}
