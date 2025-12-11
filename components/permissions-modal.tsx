"use client"

import type React from "react"

import type { User, Permission } from "@/lib/types"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog"
import { Switch } from "./ui/switch"
import { Badge } from "./ui/badge"
import { Shield, Eye, Settings, Users, Package, DollarSign, FileText, BarChart3 } from "lucide-react"

interface PermissionsModalProps {
  user: User | null
  open: boolean
  onClose: () => void
}

const permissionInfo: Record<Permission, { label: string; icon: React.ReactNode; description: string }> = {
  god_mode: { label: "God Mode", icon: <Shield className="w-4 h-4" />, description: "Acceso total al sistema" },
  view_dashboard: {
    label: "Ver Dashboard",
    icon: <Eye className="w-4 h-4" />,
    description: "Acceso al panel principal",
  },
  manage_projects: {
    label: "Gestionar Proyectos",
    icon: <FileText className="w-4 h-4" />,
    description: "Crear y editar proyectos",
  },
  view_analytics: {
    label: "Ver Analítica",
    icon: <BarChart3 className="w-4 h-4" />,
    description: "Acceso a reportes y métricas",
  },
  manage_team: {
    label: "Gestionar Equipo",
    icon: <Users className="w-4 h-4" />,
    description: "Administrar usuarios y roles",
  },
  manage_inventory: {
    label: "Gestionar Inventario",
    icon: <Package className="w-4 h-4" />,
    description: "Control de stock y productos",
  },
  manage_finance: {
    label: "Gestionar Finanzas",
    icon: <DollarSign className="w-4 h-4" />,
    description: "Acceso a contabilidad",
  },
  manage_payroll: {
    label: "Gestionar Nóminas",
    icon: <DollarSign className="w-4 h-4" />,
    description: "Procesar pagos de empleados",
  },
  view_reports: {
    label: "Ver Reportes",
    icon: <FileText className="w-4 h-4" />,
    description: "Acceso a reportes generales",
  },
}

const allPermissions: Permission[] = [
  "god_mode",
  "view_dashboard",
  "manage_projects",
  "view_analytics",
  "manage_team",
  "manage_inventory",
  "manage_finance",
  "manage_payroll",
  "view_reports",
]

export function PermissionsModal({ user, open, onClose }: PermissionsModalProps) {
  if (!user) return null

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="bg-card border-border max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-foreground">
            <Settings className="w-5 h-5 text-primary" />
            Permisos de {user.name}
          </DialogTitle>
        </DialogHeader>

        <div className="flex items-center gap-2 mb-4">
          <Badge variant="outline" className="bg-primary/10 text-primary border-primary/30">
            {user.role?.toUpperCase() || "USER"}
          </Badge>
          <span className="text-sm text-muted-foreground">{user.position}</span>
        </div>

        <div className="space-y-3 max-h-96 overflow-y-auto">
          {allPermissions.map((permission) => {
            const info = permissionInfo[permission]
            const hasPermission = user.permissions.includes(permission)

            return (
              <div
                key={permission}
                className={`flex items-center justify-between p-3 rounded-xl border ${hasPermission ? "bg-primary/5 border-primary/20" : "bg-secondary/50 border-border"
                  }`}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`p-2 rounded-lg ${hasPermission ? "bg-primary/20 text-primary" : "bg-secondary text-muted-foreground"}`}
                  >
                    {info.icon}
                  </div>
                  <div>
                    <p className={`font-medium ${hasPermission ? "text-foreground" : "text-muted-foreground"}`}>
                      {info.label}
                    </p>
                    <p className="text-xs text-muted-foreground">{info.description}</p>
                  </div>
                </div>
                <Switch
                  checked={hasPermission}
                  disabled
                  className={hasPermission ? "data-[state=checked]:bg-primary" : ""}
                />
              </div>
            )
          })}
        </div>
      </DialogContent>
    </Dialog>
  )
}
