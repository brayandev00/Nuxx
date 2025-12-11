"use client"

import { AttendanceClock } from "@/components/attendance-clock"
import { Card } from "@/components/ui/card"
import { AttendanceService } from "@/lib/attendance-service"
import { useTenant } from "@/lib/tenant-context"
import { Calendar, Clock, TrendingUp, Award } from "lucide-react"

export default function AttendancePage() {
    const { currentUser } = useTenant()

    if (!currentUser) {
        return <div>Loading...</div>
    }

    const recentAttendance = AttendanceService.getUserAttendance(currentUser.id, 7)
    const stats = AttendanceService.calculateStats(recentAttendance)

    return (
        <div className="p-8 space-y-6">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-bold text-white">Asistencias</h1>
                <p className="text-zinc-400 mt-1">Registra tu entrada y salida diaria</p>
            </div>

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
            <Card className="p-6 bg-zinc-900 border-zinc-800">
                <h2 className="text-xl font-bold text-white mb-4">Últimos 7 Días</h2>
                <div className="space-y-3">
                    {recentAttendance.length === 0 ? (
                        <p className="text-zinc-500 text-center py-8">No hay registros recientes</p>
                    ) : (
                        recentAttendance.map((record) => (
                            <div
                                key={record.id}
                                className="flex items-center justify-between p-4 rounded-lg bg-zinc-800/50 border border-zinc-700 hover:border-zinc-600 transition-colors"
                            >
                                <div className="flex items-center gap-4">
                                    <div className="text-center">
                                        <p className="text-2xl font-bold text-white">
                                            {new Date(record.date).getDate()}
                                        </p>
                                        <p className="text-xs text-zinc-500">
                                            {new Date(record.date).toLocaleDateString("es-CO", { month: "short" })}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-white">
                                            {new Date(record.date).toLocaleDateString("es-CO", { weekday: "long" })}
                                        </p>
                                        <div className="flex items-center gap-4 mt-1 text-sm text-zinc-400">
                                            <span>
                                                Entrada:{" "}
                                                {new Date(record.clockIn).toLocaleTimeString("es-CO", {
                                                    hour: "2-digit",
                                                    minute: "2-digit",
                                                })}
                                            </span>
                                            {record.clockOut && (
                                                <span>
                                                    Salida:{" "}
                                                    {new Date(record.clockOut).toLocaleTimeString("es-CO", {
                                                        hour: "2-digit",
                                                        minute: "2-digit",
                                                    })}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                </div>
                                <div className="flex items-center gap-4">
                                    {record.hoursWorked && (
                                        <div className="text-right">
                                            <p className="text-sm text-zinc-400">Horas</p>
                                            <p className="text-lg font-bold text-emerald-500">
                                                {record.hoursWorked.toFixed(2)}
                                            </p>
                                        </div>
                                    )}
                                    <div
                                        className={`px-3 py-1 rounded-full text-xs font-medium ${record.status === "on-time"
                                                ? "bg-emerald-500/10 text-emerald-500"
                                                : record.status === "late"
                                                    ? "bg-amber-500/10 text-amber-500"
                                                    : "bg-zinc-700 text-zinc-300"
                                            }`}
                                    >
                                        {record.status === "on-time" && "A Tiempo"}
                                        {record.status === "late" && `Tarde (${record.minutesLate}m)`}
                                        {record.status === "in-progress" && "En Progreso"}
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </Card>
        </div>
    )
}
