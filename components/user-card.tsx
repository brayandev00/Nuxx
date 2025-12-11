"use client"

import type { User } from "@/lib/types"
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar"
import { Badge } from "./ui/badge"
import { Button } from "./ui/button"
import { MoreHorizontal, Mail, Phone, Shield } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "./ui/dropdown-menu"
import { cn } from "@/lib/utils"

interface UserCardProps {
  user: User
  onEdit?: (user: User) => void
  onViewPermissions?: (user: User) => void
}

const roleColors: Record<string, string> = {
  admin: "bg-red-500/20 text-red-400 border-red-500/30",
  manager: "bg-blue-500/20 text-blue-400 border-blue-500/30",
  accountant: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
  employee: "bg-gray-500/20 text-gray-400 border-gray-500/30",
  designer: "bg-purple-500/20 text-purple-400 border-purple-500/30",
  developer: "bg-primary/20 text-primary border-primary/30",
}

const statusColors: Record<string, string> = {
  active: "bg-primary/20 text-primary",
  inactive: "bg-gray-500/20 text-gray-400",
  vacation: "bg-orange-500/20 text-orange-400",
}

export function UserCard({ user, onEdit, onViewPermissions }: UserCardProps) {
  return (
    <div className="bg-card rounded-2xl border border-border p-6 hover:border-primary/30 transition-all group">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-4">
          <Avatar className="w-14 h-14 border-2 border-primary/30">
            <AvatarImage src={user.avatar || "/placeholder.svg"} />
            <AvatarFallback className="bg-primary/20 text-primary">
              {user.name
                .split(" ")
                .map((n) => n[0])
                .join("")}
            </AvatarFallback>
          </Avatar>
          <div>
            <h3 className="font-semibold text-foreground">{user.name}</h3>
            <p className="text-sm text-muted-foreground">{user.position}</p>
            <p className="text-xs text-muted-foreground mt-0.5">ID: {user.id}</p>
          </div>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="opacity-0 group-hover:opacity-100 transition-opacity">
              <MoreHorizontal className="w-4 h-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="bg-card border-border">
            <DropdownMenuItem onClick={() => onEdit?.(user)}>Editar usuario</DropdownMenuItem>
            <DropdownMenuItem onClick={() => onViewPermissions?.(user)}>Ver permisos</DropdownMenuItem>
            <DropdownMenuItem className="text-destructive">Desactivar</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div className="flex flex-wrap gap-2 mb-4">
        <Badge variant="outline" className={cn("border", roleColors[user.role])}>
          <Shield className="w-3 h-3 mr-1" />
          {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
        </Badge>
        <Badge variant="outline" className={statusColors[user.status]}>
          {user.status === "active" ? "Activo" : user.status === "vacation" ? "Vacaciones" : "Inactivo"}
        </Badge>
      </div>

      <div className="space-y-2 text-sm">
        <div className="flex items-center gap-2 text-muted-foreground">
          <Mail className="w-4 h-4" />
          <span>{user.email}</span>
        </div>
        {user.phone && (
          <div className="flex items-center gap-2 text-muted-foreground">
            <Phone className="w-4 h-4" />
            <span>{user.phone}</span>
          </div>
        )}
      </div>

      <div className="mt-4 pt-4 border-t border-border flex items-center justify-between text-sm">
        <span className="text-muted-foreground">{user.department}</span>
        <span className="text-primary font-medium">${user.salary.toLocaleString()} MXN</span>
      </div>
    </div>
  )
}
