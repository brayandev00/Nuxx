"use client"

import type React from "react"
import type { User } from "@/lib/types"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog"
import { Badge } from "./ui/badge"
import { Card } from "./ui/card"
import {
    User as UserIcon,
    Mail,
    Calendar,
    Briefcase,
    Building2,
    Shield,
    Clock,
    CheckCircle2,
    CalendarDays,
} from "lucide-react"
import { cn } from "@/lib/utils"

interface UserProfileModalProps {
    user: User | null
    open: boolean
    onClose: () => void
    attendanceStats?: {
        totalDays: number
        presentDays: number
        lateDays: number
        totalHours: number
        overtimeHours: number
    }
    vacationStats?: {
        totalDays: number
        usedDays: number
        pendingRequests: number
    }
}

export function UserProfileModal({ user, open, onClose, attendanceStats, vacationStats }: UserProfileModalProps) {
    if (!user) return null

    // Safe access to permissions
    const activePermissions = (user as any).permissions?.length || 0

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className="bg-card border-border max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-3 text-foreground">
                        <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center">
                            <span className="text-primary font-semibold text-lg">
                                {user.name
                                    .split(" ")
                                    .map((n) => n[0])
                                    .join("")}
                            </span>
                        </div>
                        <div>
                            <h2 className="text-xl font-semibold">{user.name}</h2>
                            <p className="text-sm text-muted-foreground font-normal">{user.position}</p>
                        </div>
                    </DialogTitle>
                </DialogHeader>

                <div className="space-y-6 pt-4">
                    {/* Status and Role */}
                    <div className="flex gap-2">
                        <Badge
                            variant="outline"
                            className={cn(
                                "text-sm",
                                user.status === "active"
                                    ? "bg-primary/10 text-primary border-primary/30"
                                    : user.status === "vacation"
                                        ? "bg-orange-500/10 text-orange-500 border-orange-500/30"
                                        : "bg-secondary text-muted-foreground",
                            )}
                        >
                            {user.status === "active" ? "Activo" : user.status === "vacation" ? "De Vacaciones" : "Inactivo"}
                        </Badge>
                        <Badge variant="outline" className="bg-primary/10 text-primary border-primary/30 text-sm">
                            <Shield className="w-3 h-3 mr-1" />
                            {user.role?.toUpperCase() || "USER"}
                        </Badge>
                    </div>

                    {/* Personal Information */}
                    <Card className="p-4 bg-secondary/30 border-border">
                        <h3 className="font-semibold text-foreground mb-3 flex items-center gap-2">
                            <UserIcon className="w-4 h-4 text-primary" />
                            Información Personal
                        </h3>
                        <div className="space-y-2 text-sm">
                            <div className="flex items-center gap-2">
                                <Mail className="w-4 h-4 text-muted-foreground" />
                                <span className="text-muted-foreground">Email:</span>
                                <span className="text-foreground">{user.email}</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Building2 className="w-4 h-4 text-muted-foreground" />
                                <span className="text-muted-foreground">Departamento:</span>
                                <span className="text-foreground">{user.department}</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Briefcase className="w-4 h-4 text-muted-foreground" />
                                <span className="text-muted-foreground">Posición:</span>
                                <span className="text-foreground">{user.position}</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Calendar className="w-4 h-4 text-muted-foreground" />
                                <span className="text-muted-foreground">Fecha de Ingreso:</span>
                                <span className="text-foreground">{user.hireDate}</span>
                            </div>
                        </div>
                    </Card>

                    {/* Permissions Summary */}
                    <Card className="p-4 bg-primary/5 border-primary/20">
                        <h3 className="font-semibold text-foreground mb-3 flex items-center gap-2">
                            <Shield className="w-4 h-4 text-primary" />
                            Permisos y Accesos
                        </h3>
                        <div className="flex items-center justify-between">
                            <span className="text-sm text-muted-foreground">Permisos activos:</span>
                            <Badge variant="outline" className="bg-primary/20 text-primary border-primary/30">
                                {activePermissions} {activePermissions === 1 ? "permiso" : "permisos"}
                            </Badge>
                        </div>
                        <p className="text-xs text-muted-foreground mt-2">
                            Click en "Permisos" para ver el detalle completo de accesos
                        </p>
                    </Card>

                    {/* Attendance Statistics */}
                    {attendanceStats && (
                        <Card className="p-4 bg-secondary/30 border-border">
                            <h3 className="font-semibold text-foreground mb-3 flex items-center gap-2">
                                <Clock className="w-4 h-4 text-primary" />
                                Estadísticas de Asistencia
                            </h3>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1">
                                    <p className="text-xs text-muted-foreground">Días Trabajados</p>
                                    <p className="text-2xl font-bold text-primary">
                                        {attendanceStats.presentDays}/{attendanceStats.totalDays}
                                    </p>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-xs text-muted-foreground">Horas Totales</p>
                                    <p className="text-2xl font-bold text-foreground">{attendanceStats.totalHours.toFixed(1)}h</p>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-xs text-muted-foreground">Llegadas Tarde</p>
                                    <p className="text-2xl font-bold text-yellow-500">{attendanceStats.lateDays}</p>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-xs text-muted-foreground">Horas Extra</p>
                                    <p className="text-2xl font-bold text-primary">+{attendanceStats.overtimeHours.toFixed(1)}h</p>
                                </div>
                            </div>
                        </Card>
                    )}

                    {/* Vacation Statistics */}
                    {vacationStats && (
                        <Card className="p-4 bg-secondary/30 border-border">
                            <h3 className="font-semibold text-foreground mb-3 flex items-center gap-2">
                                <CalendarDays className="w-4 h-4 text-primary" />
                                Vacaciones y Ausencias
                            </h3>
                            <div className="grid grid-cols-3 gap-4">
                                <div className="space-y-1">
                                    <p className="text-xs text-muted-foreground">Total Días</p>
                                    <p className="text-xl font-bold text-foreground">{vacationStats.totalDays}</p>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-xs text-muted-foreground">Días Usados</p>
                                    <p className="text-xl font-bold text-orange-500">{vacationStats.usedDays}</p>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-xs text-muted-foreground">Pendientes</p>
                                    <p className="text-xl font-bold text-yellow-500">{vacationStats.pendingRequests}</p>
                                </div>
                            </div>
                            <div className="mt-3 pt-3 border-t border-border">
                                <div className="flex items-center justify-between text-sm">
                                    <span className="text-muted-foreground">Días Disponibles:</span>
                                    <span className="text-primary font-semibold">
                                        {vacationStats.totalDays - vacationStats.usedDays} días
                                    </span>
                                </div>
                            </div>
                        </Card>
                    )}

                    {/* Quick Info */}
                    <div className="flex items-center gap-2 p-3 rounded-lg bg-primary/5 border border-primary/20">
                        <CheckCircle2 className="w-4 h-4 text-primary" />
                        <p className="text-xs text-muted-foreground">
                            Miembro del equipo desde {user.hireDate} • Tenant: {user.tenantId}
                        </p>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    )
}
