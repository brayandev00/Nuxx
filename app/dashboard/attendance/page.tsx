"use client"

import { AttendanceClock } from "@/components/attendance-clock"
import { AttendanceTable } from "@/components/attendance-table"
import { Card } from "@/components/ui/card"
import { AttendanceService } from "@/lib/attendance-service"
import { useTenant } from "@/lib/tenant-context"
import { Calendar, Clock, TrendingUp, Award, Users } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { cn } from "@/lib/utils"

export default function AttendancePage() {
    const { currentUser, currentRole, getTenantUsers } = useTenant()

    if (!currentUser) {
        return <div>Loading...</div>
    }

    const recentAttendance = AttendanceService.getUserAttendance(currentUser.id, 7)
    const stats = AttendanceService.calculateStats(recentAttendance)
    const users = getTenantUsers()
    const isAdmin = currentRole?.name === "Administrador" || currentRole?.name === "Gerente"

    // Mock team stats
    const teamStats = users.map(user => {
        const userAtt = AttendanceService.getUserAttendance(user.id, 1) // Today
        return {
            user,
            today: userAtt[0],
            weeklyStats: AttendanceService.calculateStats(AttendanceService.getUserAttendance(user.id, 7))
        }
    })

    return (
        <div className="p-8 space-y-6">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-bold text-white">Asistencias</h1>
                <p className="text-zinc-400 mt-1">Registra tu entrada y salida diaria</p>
            </div>

            {/* Content Tabs */}
            <Tabs defaultValue="my-attendance" className="space-y-6">
                {isAdmin && (
                    <TabsList className="bg-zinc-900 border border-zinc-800">
                        <TabsTrigger value="my-attendance">Mi Asistencia</TabsTrigger>
                        <TabsTrigger value="team-report">Reporte de Equipo</TabsTrigger>
                    </TabsList>
                )}

                <TabsContent value="my-attendance" className="space-y-6">
                    {/* Clock Widget */}
                    <AttendanceClock />

                    {/* Stats Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <Card className="p-4 bg-zinc-900 border-zinc-800">
                            <div className="flex items-center gap-3">
                                <div className="p-2 rounded-lg bg-emerald-500/10">
                                    <Calendar className="w-5 h-5 text-emerald-500" />
                                </div>
                                <div>
                                    <p className="text-sm text-zinc-400">Días Trabajados</p>
                                    <p className="text-2xl font-bold text-white">{stats.presentDays}</p>
                                </div>
                            </div>
                        </Card>

                        <Card className="p-4 bg-zinc-900 border-zinc-800">
                            <div className="flex items-center gap-3">
                                <div className="p-2 rounded-lg bg-blue-500/10">
                                    <Clock className="w-5 h-5 text-blue-500" />
                                </div>
                                <div>
                                    <p className="text-sm text-zinc-400">Horas Totales</p>
                                    <p className="text-2xl font-bold text-white">{stats.totalHours.toFixed(1)}</p>
                                </div>
                            </div>
                        </Card>

                        <Card className="p-4 bg-zinc-900 border-zinc-800">
                            <div className="flex items-center gap-3">
                                <div className="p-2 rounded-lg bg-amber-500/10">
                                    <TrendingUp className="w-5 h-5 text-amber-500" />
                                </div>
                                <div>
                                    <p className="text-sm text-zinc-400">Promedio Diario</p>
                                    <p className="text-2xl font-bold text-white">{stats.averageHours.toFixed(1)}h</p>
                                </div>
                            </div>
                        </Card>

                        <Card className="p-4 bg-zinc-900 border-zinc-800">
                            <div className="flex items-center gap-3">
                                <div className="p-2 rounded-lg bg-purple-500/10">
                                    <Award className="w-5 h-5 text-purple-500" />
                                </div>
                                <div>
                                    <p className="text-sm text-zinc-400">Puntualidad</p>
                                    <p className="text-2xl font-bold text-white">{stats.onTimePercentage.toFixed(0)}%</p>
                                </div>
                            </div>
                        </Card>
                    </div>

                    {/* Recent Attendance */}
                    <div className="mt-8">
                        <h2 className="text-xl font-bold text-white mb-4">Mis Registros Recientes</h2>
                        <AttendanceTable records={recentAttendance} users={users} />
                    </div>
                </TabsContent>

                {isAdmin && (
                    <TabsContent value="team-report">
                        <Card className="bg-zinc-900 border-zinc-800">
                            <div className="p-6">
                                <div className="flex items-center justify-between mb-6">
                                    <h2 className="text-xl font-bold text-white">Reporte de Equipo</h2>
                                    <div className="flex gap-2">
                                        <button className="px-3 py-1 text-sm bg-zinc-800 text-zinc-300 rounded-md hover:bg-zinc-700">Hoy</button>
                                        <button className="px-3 py-1 text-sm bg-zinc-800 text-zinc-300 rounded-md hover:bg-zinc-700">Esta Semana</button>
                                    </div>
                                </div>
                                <AttendanceTable
                                    records={users.flatMap(u => AttendanceService.getUserAttendance(u.id, 5))}
                                    users={users}
                                />
                            </div>
                        </Card>
                    </TabsContent>
                )}
            </Tabs>
        </div>
    )
}
