"use client"

import type { AttendanceRecord, User } from "@/lib/types"
import { Badge } from "./ui/badge"
import { Clock, CheckCircle2, XCircle, AlertCircle, Palmtree, Thermometer } from "lucide-react"
import { cn } from "@/lib/utils"

interface AttendanceTableProps {
  records: AttendanceRecord[]
  users: User[]
}

const statusConfig = {
  present: { label: "Presente", icon: CheckCircle2, color: "text-primary bg-primary/10" },
  absent: { label: "Ausente", icon: XCircle, color: "text-destructive bg-destructive/10" },
  late: { label: "Tardanza", icon: AlertCircle, color: "text-yellow-500 bg-yellow-500/10" },
  vacation: { label: "Vacaciones", icon: Palmtree, color: "text-orange-500 bg-orange-500/10" },
  sick: { label: "Enfermo", icon: Thermometer, color: "text-blue-400 bg-blue-400/10" },
}

export function AttendanceTable({ records, users }: AttendanceTableProps) {
  const getUser = (userId: string) => users.find((u) => u.id === userId)

  return (
    <div className="bg-card rounded-2xl border border-border overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-secondary/50">
            <tr>
              <th className="text-left p-4 text-sm font-medium text-muted-foreground">Empleado</th>
              <th className="text-left p-4 text-sm font-medium text-muted-foreground">Entrada</th>
              <th className="text-left p-4 text-sm font-medium text-muted-foreground">Salida</th>
              <th className="text-left p-4 text-sm font-medium text-muted-foreground">Horas</th>
              <th className="text-left p-4 text-sm font-medium text-muted-foreground">Estado</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {records.map((record) => {
              const user = getUser(record.userId)
              const status = statusConfig[record.status]
              const StatusIcon = status.icon

              return (
                <tr key={record.id} className="hover:bg-secondary/30 transition-colors">
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary text-sm font-medium">
                        {user?.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("") || "?"}
                      </div>
                      <div>
                        <p className="font-medium text-foreground">{user?.name || "Desconocido"}</p>
                        <p className="text-xs text-muted-foreground">{user?.position}</p>
                      </div>
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-2 text-foreground">
                      <Clock className="w-4 h-4 text-muted-foreground" />
                      {record.checkIn || "-"}
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-2 text-foreground">
                      <Clock className="w-4 h-4 text-muted-foreground" />
                      {record.checkOut || "-"}
                    </div>
                  </td>
                  <td className="p-4">
                    <span
                      className={cn("font-mono", record.hoursWorked >= 8 ? "text-primary" : "text-muted-foreground")}
                    >
                      {record.hoursWorked > 0 ? `${record.hoursWorked.toFixed(1)}h` : "-"}
                    </span>
                  </td>
                  <td className="p-4">
                    <Badge variant="outline" className={cn("gap-1", status.color)}>
                      <StatusIcon className="w-3 h-3" />
                      {status.label}
                    </Badge>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}
