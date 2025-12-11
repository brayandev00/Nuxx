"use client"

import { useState } from "react"
import { Header } from "@/components/header"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useTenant } from "@/lib/tenant-context"
import { useNuuxStore } from "@/lib/nuux-store"
import { PermissionsModal } from "@/components/permissions-modal"
import { UserProfileModal } from "@/components/user-profile-modal"
import type { User } from "@/lib/types"
import {
  Plus,
  Users,
  Clock,
  CalendarDays,
  Shield,
  LogIn,
  LogOut,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Calendar,
  Send,
} from "lucide-react"
import { cn } from "@/lib/utils"

export default function TeamPage() {
  const { getTenantUsers, currentUser } = useTenant()
  const { attendanceRecords, vacationRequests, checkIn, checkOut, requestVacation, approveVacation, rejectVacation } =
    useNuuxStore()

  const [vacationDialogOpen, setVacationDialogOpen] = useState(false)
  const [vacationType, setVacationType] = useState<string>("vacation")
  const [startDate, setStartDate] = useState("")
  const [endDate, setEndDate] = useState("")
  const [reason, setReason] = useState("")

  // Modal states
  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  const [permissionsModalOpen, setPermissionsModalOpen] = useState(false)
  const [profileModalOpen, setProfileModalOpen] = useState(false)

  const users = getTenantUsers()
  const today = new Date().toISOString().split("T")[0]

  // Get today's attendance for current user
  const myAttendanceToday = attendanceRecords.find((r) => r.userId === currentUser?.id && r.date === today)

  const activeUsers = users.filter((u) => u.status === "active").length
  const onVacation = users.filter((u) => u.status === "vacation").length
  const pendingVacations = vacationRequests.filter((v) => v.status === "pending").length

  const handleCheckIn = () => {
    if (currentUser) {
      checkIn(currentUser.id)
    }
  }

  const handleCheckOut = () => {
    if (currentUser) {
      checkOut(currentUser.id)
    }
  }

  const handleRequestVacation = () => {
    if (currentUser && startDate && endDate) {
      requestVacation({
        tenantId: currentUser.tenantId,
        userId: currentUser.id,
        type: vacationType as "vacation" | "sick" | "personal",
        startDate,
        endDate,
        reason,
      })
      setVacationDialogOpen(false)
      setStartDate("")
      setEndDate("")
      setReason("")
    }
  }

  const handleApproveVacation = (requestId: string) => {
    if (currentUser) {
      approveVacation(requestId, currentUser.id)
    }
  }

  const handleRejectVacation = (requestId: string) => {
    if (currentUser) {
      rejectVacation(requestId, currentUser.id, "No aprobado")
    }
  }

  const handleOpenPermissions = (user: User) => {
    setSelectedUser(user)
    setPermissionsModalOpen(true)
  }

  const handleOpenProfile = (user: User) => {
    setSelectedUser(user)
    setProfileModalOpen(true)
  }

  // Calculate attendance stats for selected user
  const getAttendanceStats = (userId: string) => {
    const userRecords = attendanceRecords.filter((r) => r.userId === userId)
    if (userRecords.length === 0) return undefined

    return {
      totalDays: userRecords.length,
      presentDays: userRecords.filter((r) => r.status === "present").length,
      lateDays: userRecords.filter((r) => r.status === "late").length,
      totalHours: userRecords.reduce((sum, r) => sum + r.hoursWorked, 0),
      overtimeHours: userRecords.reduce((sum, r) => sum + (r.overtimeHours || 0), 0),
    }
  }

  // Calculate vacation stats for selected user
  const getVacationStats = (userId: string) => {
    const userRequests = vacationRequests.filter((r) => r.userId === userId)
    if (userRequests.length === 0) return undefined

    return {
      totalDays: 20, // Default vacation days per year
      usedDays: userRequests
        .filter((r) => r.status === "approved")
        .reduce((sum, r) => sum + r.totalDays, 0),
      pendingRequests: userRequests.filter((r) => r.status === "pending").length,
    }
  }

  return (
    <div className="min-h-screen">
      <Header title="Nuux Team" subtitle="Recursos humanos, asistencia y control de acceso" />

      <div className="p-8">
        {/* Check-in/Check-out Card */}
        <Card className="p-6 bg-card border-border mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="p-4 rounded-2xl bg-primary/10">
                <Clock className="w-8 h-8 text-primary" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-foreground">Control de Asistencia</h2>
                <p className="text-muted-foreground">
                  {today} - {currentUser?.name || "Usuario"}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              {myAttendanceToday ? (
                <div className="flex items-center gap-6">
                  <div className="text-right">
                    <p className="text-sm text-muted-foreground">Entrada</p>
                    <p className="text-2xl font-bold text-primary">{myAttendanceToday.checkIn || "--:--"}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-muted-foreground">Salida</p>
                    <p className="text-2xl font-bold text-foreground">{myAttendanceToday.checkOut || "--:--"}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-muted-foreground">Horas</p>
                    <p className="text-2xl font-bold text-primary">{myAttendanceToday.hoursWorked.toFixed(1)}h</p>
                  </div>
                  {!myAttendanceToday.checkOut && (
                    <Button
                      size="lg"
                      onClick={handleCheckOut}
                      className="bg-destructive hover:bg-destructive/90 text-white h-14 px-8"
                    >
                      <LogOut className="w-5 h-5 mr-2" />
                      Registrar Salida
                    </Button>
                  )}
                </div>
              ) : (
                <Button
                  size="lg"
                  onClick={handleCheckIn}
                  className="bg-primary hover:bg-primary/90 text-primary-foreground h-14 px-8 neon-glow"
                >
                  <LogIn className="w-5 h-5 mr-2" />
                  Registrar Entrada
                </Button>
              )}
            </div>
          </div>

          {myAttendanceToday?.overtimeHours ? (
            <div className="mt-4 pt-4 border-t border-border">
              <Badge variant="outline" className="bg-yellow-500/10 text-yellow-500">
                Horas extra: {myAttendanceToday.overtimeHours.toFixed(1)}h
              </Badge>
            </div>
          ) : null}
        </Card>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="p-6 bg-card border-border">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-xl bg-primary/10">
                <Users className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="text-muted-foreground text-sm">Total Empleados</p>
                <p className="text-2xl font-bold text-foreground">{users.length}</p>
              </div>
            </div>
          </Card>
          <Card className="p-6 bg-card border-border">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-xl bg-primary/10">
                <CheckCircle2 className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="text-muted-foreground text-sm">Activos Hoy</p>
                <p className="text-2xl font-bold text-primary">{activeUsers}</p>
              </div>
            </div>
          </Card>
          <Card className="p-6 bg-card border-border">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-xl bg-orange-500/10">
                <CalendarDays className="w-5 h-5 text-orange-500" />
              </div>
              <div>
                <p className="text-muted-foreground text-sm">En Vacaciones</p>
                <p className="text-2xl font-bold text-orange-500">{onVacation}</p>
              </div>
            </div>
          </Card>
          <Card className="p-6 bg-card border-border">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-xl bg-yellow-500/10">
                <AlertCircle className="w-5 h-5 text-yellow-500" />
              </div>
              <div>
                <p className="text-muted-foreground text-sm">Solicitudes Pendientes</p>
                <p className="text-2xl font-bold text-yellow-500">{pendingVacations}</p>
              </div>
            </div>
          </Card>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="users" className="space-y-6">
          <div className="flex items-center justify-between">
            <TabsList className="bg-secondary">
              <TabsTrigger value="users">Empleados</TabsTrigger>
              <TabsTrigger value="attendance">Registro de Asistencia</TabsTrigger>
              <TabsTrigger value="vacations">Vacaciones y Ausencias</TabsTrigger>
            </TabsList>
            <div className="flex gap-3">
              <Dialog open={vacationDialogOpen} onOpenChange={setVacationDialogOpen}>
                <DialogTrigger asChild>
                  <Button variant="outline" className="bg-transparent border-primary text-primary hover:bg-primary/10">
                    <Calendar className="w-4 h-4 mr-2" />
                    Solicitar Ausencia
                  </Button>
                </DialogTrigger>
                <DialogContent className="bg-card border-border">
                  <DialogHeader>
                    <DialogTitle>Solicitar Vacaciones / Ausencia</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4 pt-4">
                    <div className="space-y-2">
                      <Label>Tipo de Ausencia</Label>
                      <Select value={vacationType} onValueChange={setVacationType}>
                        <SelectTrigger className="bg-secondary border-border">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="vacation">Vacaciones</SelectItem>
                          <SelectItem value="sick">Enfermedad</SelectItem>
                          <SelectItem value="personal">Personal</SelectItem>
                          <SelectItem value="maternity">Maternidad</SelectItem>
                          <SelectItem value="paternity">Paternidad</SelectItem>
                          <SelectItem value="bereavement">Duelo</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Fecha Inicio</Label>
                        <Input
                          type="date"
                          value={startDate}
                          onChange={(e) => setStartDate(e.target.value)}
                          className="bg-secondary border-border"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Fecha Fin</Label>
                        <Input
                          type="date"
                          value={endDate}
                          onChange={(e) => setEndDate(e.target.value)}
                          className="bg-secondary border-border"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label>Motivo (opcional)</Label>
                      <Textarea
                        value={reason}
                        onChange={(e) => setReason(e.target.value)}
                        className="bg-secondary border-border"
                        placeholder="Describe el motivo de tu solicitud..."
                      />
                    </div>
                    <Button
                      className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
                      onClick={handleRequestVacation}
                    >
                      <Send className="w-4 h-4 mr-2" />
                      Enviar Solicitud
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
              <Button className="bg-primary hover:bg-primary/90 text-primary-foreground neon-glow">
                <Plus className="w-4 h-4 mr-2" />
                Nuevo Empleado
              </Button>
            </div>
          </div>

          <TabsContent value="users">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {users.map((user) => (
                <Card
                  key={user.id}
                  className="p-6 bg-card border-border hover:border-primary/30 transition-all duration-300"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center">
                        <span className="text-primary font-semibold">
                          {user.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </span>
                      </div>
                      <div>
                        <h3 className="font-semibold text-foreground">{user.name}</h3>
                        <p className="text-sm text-muted-foreground">{user.position}</p>
                      </div>
                    </div>
                    <Badge
                      variant="outline"
                      className={cn(
                        user.status === "active"
                          ? "bg-primary/10 text-primary"
                          : user.status === "vacation"
                            ? "bg-orange-500/10 text-orange-500"
                            : "bg-secondary text-muted-foreground",
                      )}
                    >
                      {user.status === "active" ? "Activo" : user.status === "vacation" ? "Vacaciones" : "Inactivo"}
                    </Badge>
                  </div>

                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Departamento</span>
                      <span className="text-foreground">{user.department}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Email</span>
                      <span className="text-foreground truncate max-w-[150px]">{user.email}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Fecha ingreso</span>
                      <span className="text-foreground">{user.hireDate}</span>
                    </div>
                  </div>

                  <div className="mt-4 pt-4 border-t border-border flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1 bg-transparent hover:bg-primary/10 hover:text-primary hover:border-primary/30"
                      onClick={() => handleOpenPermissions(user)}
                    >
                      <Shield className="w-4 h-4 mr-1" />
                      Permisos
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1 bg-transparent hover:bg-primary/10 hover:text-primary hover:border-primary/30"
                      onClick={() => handleOpenProfile(user)}
                    >
                      Ver Perfil
                    </Button>
                  </div>
                </Card>
              ))}

              <Card className="p-6 bg-secondary/30 border-dashed border-2 border-border hover:border-primary/30 transition-all flex items-center justify-center min-h-[280px] cursor-pointer group">
                <div className="text-center">
                  <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-3 group-hover:bg-primary/20 transition-colors">
                    <Plus className="w-6 h-6 text-primary" />
                  </div>
                  <p className="font-medium text-foreground">Agregar Empleado</p>
                  <p className="text-muted-foreground text-sm">Configura roles y permisos</p>
                </div>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="attendance">
            <div className="bg-card rounded-2xl border border-border overflow-hidden">
              <div className="p-6 border-b border-border">
                <h3 className="font-semibold text-foreground">Registro de Asistencia - Hoy</h3>
                <p className="text-sm text-muted-foreground">Control de entrada y salida de empleados</p>
              </div>
              {attendanceRecords.length === 0 ? (
                <div className="p-12 text-center">
                  <Clock className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
                  <p className="text-muted-foreground">No hay registros de asistencia hoy</p>
                  <p className="text-sm text-muted-foreground">
                    Los empleados pueden registrar su entrada usando el boton superior
                  </p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-secondary/50">
                      <tr>
                        <th className="text-left p-4 text-sm font-medium text-muted-foreground">Empleado</th>
                        <th className="text-left p-4 text-sm font-medium text-muted-foreground">Fecha</th>
                        <th className="text-left p-4 text-sm font-medium text-muted-foreground">Entrada</th>
                        <th className="text-left p-4 text-sm font-medium text-muted-foreground">Salida</th>
                        <th className="text-left p-4 text-sm font-medium text-muted-foreground">Horas</th>
                        <th className="text-left p-4 text-sm font-medium text-muted-foreground">H. Extra</th>
                        <th className="text-left p-4 text-sm font-medium text-muted-foreground">Estado</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                      {attendanceRecords.map((record) => {
                        const user = users.find((u) => u.id === record.userId)
                        return (
                          <tr key={record.id} className="hover:bg-secondary/30">
                            <td className="p-4">
                              <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
                                  <span className="text-primary text-xs font-medium">
                                    {user?.name
                                      .split(" ")
                                      .map((n) => n[0])
                                      .join("")}
                                  </span>
                                </div>
                                <span className="text-foreground">{user?.name || record.userId}</span>
                              </div>
                            </td>
                            <td className="p-4 text-sm text-muted-foreground">{record.date}</td>
                            <td className="p-4 text-sm font-medium text-primary">{record.checkIn || "--:--"}</td>
                            <td className="p-4 text-sm font-medium text-foreground">{record.checkOut || "--:--"}</td>
                            <td className="p-4 text-sm font-medium">{record.hoursWorked.toFixed(1)}h</td>
                            <td className="p-4">
                              {record.overtimeHours > 0 ? (
                                <Badge variant="outline" className="bg-yellow-500/10 text-yellow-500">
                                  +{record.overtimeHours.toFixed(1)}h
                                </Badge>
                              ) : (
                                <span className="text-muted-foreground">-</span>
                              )}
                            </td>
                            <td className="p-4">
                              <Badge
                                variant="outline"
                                className={cn(
                                  record.status === "present"
                                    ? "bg-primary/10 text-primary"
                                    : record.status === "late"
                                      ? "bg-yellow-500/10 text-yellow-500"
                                      : record.status === "remote"
                                        ? "bg-blue-500/10 text-blue-500"
                                        : "bg-secondary text-muted-foreground",
                                )}
                              >
                                {record.status === "present"
                                  ? "Presente"
                                  : record.status === "late"
                                    ? "Tarde"
                                    : record.status === "remote"
                                      ? "Remoto"
                                      : record.status}
                              </Badge>
                            </td>
                          </tr>
                        )
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="vacations">
            <div className="bg-card rounded-2xl border border-border overflow-hidden">
              <div className="p-6 border-b border-border flex items-center justify-between">
                <div>
                  <h3 className="font-semibold text-foreground">Solicitudes de Vacaciones y Ausencias</h3>
                  <p className="text-sm text-muted-foreground">
                    Flujo: Solicitud - Notificacion a Gerente - Aprobacion - Deduccion de Saldo
                  </p>
                </div>
              </div>
              {vacationRequests.length === 0 ? (
                <div className="p-12 text-center">
                  <CalendarDays className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
                  <p className="text-muted-foreground">No hay solicitudes de ausencia</p>
                  <p className="text-sm text-muted-foreground">
                    Usa el boton Solicitar Ausencia para crear una nueva solicitud
                  </p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-secondary/50">
                      <tr>
                        <th className="text-left p-4 text-sm font-medium text-muted-foreground">Empleado</th>
                        <th className="text-left p-4 text-sm font-medium text-muted-foreground">Tipo</th>
                        <th className="text-left p-4 text-sm font-medium text-muted-foreground">Desde</th>
                        <th className="text-left p-4 text-sm font-medium text-muted-foreground">Hasta</th>
                        <th className="text-left p-4 text-sm font-medium text-muted-foreground">Dias</th>
                        <th className="text-left p-4 text-sm font-medium text-muted-foreground">Estado</th>
                        <th className="text-left p-4 text-sm font-medium text-muted-foreground">Acciones</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                      {vacationRequests.map((request) => {
                        const user = users.find((u) => u.id === request.userId)
                        return (
                          <tr key={request.id} className="hover:bg-secondary/30">
                            <td className="p-4">
                              <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
                                  <span className="text-primary text-xs font-medium">
                                    {user?.name
                                      .split(" ")
                                      .map((n) => n[0])
                                      .join("")}
                                  </span>
                                </div>
                                <div>
                                  <span className="text-foreground">{user?.name || request.userId}</span>
                                  {request.reason && (
                                    <p className="text-xs text-muted-foreground truncate max-w-[150px]">
                                      {request.reason}
                                    </p>
                                  )}
                                </div>
                              </div>
                            </td>
                            <td className="p-4">
                              <Badge variant="outline" className="bg-secondary capitalize">
                                {request.type === "vacation"
                                  ? "Vacaciones"
                                  : request.type === "sick"
                                    ? "Enfermedad"
                                    : request.type === "personal"
                                      ? "Personal"
                                      : request.type}
                              </Badge>
                            </td>
                            <td className="p-4 text-sm text-muted-foreground">{request.startDate}</td>
                            <td className="p-4 text-sm text-muted-foreground">{request.endDate}</td>
                            <td className="p-4 text-sm font-medium">{request.totalDays}</td>
                            <td className="p-4">
                              <Badge
                                variant="outline"
                                className={cn(
                                  request.status === "approved"
                                    ? "bg-primary/10 text-primary"
                                    : request.status === "pending"
                                      ? "bg-yellow-500/10 text-yellow-500"
                                      : request.status === "rejected"
                                        ? "bg-destructive/10 text-destructive"
                                        : "bg-secondary text-muted-foreground",
                                )}
                              >
                                {request.status === "approved"
                                  ? "Aprobada"
                                  : request.status === "pending"
                                    ? "Pendiente"
                                    : request.status === "rejected"
                                      ? "Rechazada"
                                      : "Cancelada"}
                              </Badge>
                            </td>
                            <td className="p-4">
                              {request.status === "pending" && (
                                <div className="flex gap-2">
                                  <Button
                                    size="sm"
                                    className="bg-primary hover:bg-primary/90 text-primary-foreground h-8"
                                    onClick={() => handleApproveVacation(request.id)}
                                  >
                                    <CheckCircle2 className="w-3 h-3 mr-1" />
                                    Aprobar
                                  </Button>
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    className="bg-transparent border-destructive text-destructive hover:bg-destructive/10 h-8"
                                    onClick={() => handleRejectVacation(request.id)}
                                  >
                                    <XCircle className="w-3 h-3 mr-1" />
                                    Rechazar
                                  </Button>
                                </div>
                              )}
                              {request.status !== "pending" && request.approvedBy && (
                                <span className="text-xs text-muted-foreground">Por: {request.approvedBy}</span>
                              )}
                            </td>
                          </tr>
                        )
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Modals */}
      <PermissionsModal user={selectedUser} open={permissionsModalOpen} onClose={() => setPermissionsModalOpen(false)} />
      <UserProfileModal
        user={selectedUser}
        open={profileModalOpen}
        onClose={() => setProfileModalOpen(false)}
        attendanceStats={selectedUser ? getAttendanceStats(selectedUser.id) : undefined}
        vacationStats={selectedUser ? getVacationStats(selectedUser.id) : undefined}
      />
    </div>
  )
}
