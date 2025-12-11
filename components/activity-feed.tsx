import { Card } from "./ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar"
import { CheckCircle2, MessageSquare, FileText, UserPlus } from "lucide-react"

const activities = [
  {
    id: 1,
    user: { name: "Ana García", avatar: "/professional-woman.png" },
    action: "completó la tarea",
    target: "Diseño de wireframes",
    time: "Hace 5 min",
    icon: CheckCircle2,
    iconColor: "text-primary bg-primary/10",
  },
  {
    id: 2,
    user: { name: "Carlos Ruiz", avatar: "/professional-man.png" },
    action: "comentó en",
    target: "API Integration",
    time: "Hace 15 min",
    icon: MessageSquare,
    iconColor: "text-blue-400 bg-blue-400/10",
  },
  {
    id: 3,
    user: { name: "María López", avatar: "/woman-developer.png" },
    action: "subió documento",
    target: "Especificaciones técnicas.pdf",
    time: "Hace 1 hora",
    icon: FileText,
    iconColor: "text-orange-400 bg-orange-400/10",
  },
  {
    id: 4,
    user: { name: "Pedro Sánchez", avatar: "/man-developer.png" },
    action: "añadió a",
    target: "Laura Martín al equipo",
    time: "Hace 2 horas",
    icon: UserPlus,
    iconColor: "text-purple-400 bg-purple-400/10",
  },
]

export function ActivityFeed() {
  return (
    <Card className="p-6 bg-card border-border">
      <h3 className="text-lg font-semibold text-foreground mb-6">Actividad Reciente</h3>

      <div className="space-y-4">
        {activities.map((activity) => (
          <div key={activity.id} className="flex items-start gap-3">
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${activity.iconColor}`}
            >
              <activity.icon className="w-4 h-4" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm text-foreground">
                <span className="font-medium">{activity.user.name}</span>{" "}
                <span className="text-muted-foreground">{activity.action}</span>{" "}
                <span className="text-primary font-medium">{activity.target}</span>
              </p>
              <span className="text-xs text-muted-foreground">{activity.time}</span>
            </div>
            <Avatar className="w-6 h-6">
              <AvatarImage src={activity.user.avatar || "/placeholder.svg"} />
              <AvatarFallback className="text-xs bg-secondary">{activity.user.name[0]}</AvatarFallback>
            </Avatar>
          </div>
        ))}
      </div>
    </Card>
  )
}
