"use client"

import type { VacationRequest, User } from "@/lib/types"
import { Badge } from "./ui/badge"
import { CalendarDays, CheckCircle2, Clock, XCircle } from "lucide-react"
import { cn } from "@/lib/utils"

interface VacationCalendarProps {
  requests: VacationRequest[]
  users: User[]
}

const typeLabels = {
  vacation: "Vacaciones",
  sick: "Enfermedad",
  personal: "Personal",
  maternity: "Maternidad",
  other: "Otro",
}

const statusConfig = {
  pending: { label: "Pendiente", icon: Clock, color: "bg-yellow-500/20 text-yellow-400" },
  approved: { label: "Aprobado", icon: CheckCircle2, color: "bg-primary/20 text-primary" },
  rejected: { label: "Rechazado", icon: XCircle, color: "bg-destructive/20 text-destructive" },
}

export function VacationCalendar({ requests, users }: VacationCalendarProps) {
  const getUser = (userId: string) => users.find((u) => u.id === userId)

  const getDaysDiff = (start: string, end: string) => {
    const startDate = new Date(start)
    const endDate = new Date(end)
    return Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)) + 1
  }

  return (
    <div className="bg-card rounded-2xl border border-border p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
          <CalendarDays className="w-5 h-5 text-primary" />
          Solicitudes de Ausencia
        </h3>
      </div>

      <div className="space-y-4">
        {requests.map((request) => {
          const user = getUser(request.userId)
          const status = statusConfig[request.status]
          const StatusIcon = status.icon
          const days = getDaysDiff(request.startDate, request.endDate)

          return (
            <div
              key={request.id}
              className={cn(
                "p-4 rounded-xl border transition-all",
                request.status === "approved"
                  ? "bg-primary/5 border-primary/20"
                  : request.status === "pending"
                    ? "bg-yellow-500/5 border-yellow-500/20"
                    : "bg-secondary/50 border-border",
              )}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-primary text-sm font-medium">
                    {user?.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("") || "?"}
                  </div>
                  <div>
                    <p className="font-medium text-foreground">{user?.name}</p>
                    <p className="text-sm text-muted-foreground">{typeLabels[request.type]}</p>
                  </div>
                </div>
                <Badge variant="outline" className={cn("gap-1", status.color)}>
                  <StatusIcon className="w-3 h-3" />
                  {status.label}
                </Badge>
              </div>

              <div className="mt-3 flex items-center gap-4 text-sm">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <CalendarDays className="w-4 h-4" />
                  <span>
                    {request.startDate} - {request.endDate}
                  </span>
                </div>
                <Badge variant="outline" className="bg-secondary text-foreground">
                  {days} día{days > 1 ? "s" : ""}
                </Badge>
              </div>

              {request.reason && <p className="mt-2 text-sm text-muted-foreground">{request.reason}</p>}
            </div>
          )
        })}
      </div>
    </div>
  )
}
