"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { AttendanceService } from "@/lib/attendance-service"
import type { AttendanceFilters } from "@/lib/attendance-types"
import { Download, Filter, Users, Clock, AlertCircle, CheckCircle2 } from "lucide-react"

export default function AttendanceAdminPage() {
    const [filters, setFilters] = useState<AttendanceFilters>({
        startDate: new Date().toISOString().split("T")[0],
        endDate: new Date().toISOString().split("T")[0],
        status: "all",
    })

    const records = AttendanceService.getAttendance(filters)
    const todayRecords = AttendanceService.getAttendance({
        startDate: new Date().toISOString().split("T")[0],
        endDate: new Date().toISOString().split("T")[0],
    })

    const presentToday = todayRecords.filter((r) => r.status !== "absent").length
    const lateToday = todayRecords.filter((r) => r.status === "late").length
    const onTimeToday = todayRecords.filter((r) => r.status === "on-time").length

    const handleExport = () => {
        const csv = [
            ["Fecha", "Empleado", "Entrada", "Salida", "Horas", "Estado", "Minutos Tarde"].join(","),
            ...records.map((r) =>
                [
                    r.date,
                    r.userName,
                    new Date(r.clockIn).toLocaleTimeString("es-CO"),
                    r.clockOut ? new Date(r.clockOut).toLocaleTimeString("es-CO") : "-",
                    r.hoursWorked?.toFixed(2) || "-",
                    r.status,
                    r.minutesLate || 0,
                ].join(",")
            ),
        ].join("\n")

        const blob = new Blob([csv], { type: "text/csv" })
        const url = URL.createObjectURL(blob)
        const a = document.createElement("a")
        a.href = url
        a.download = `asistencias-${filters.startDate}-${filters.endDate}.csv`
        a.click()
    }

    return (
        <div className="p-8 space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-white">Panel de Asistencias</h1>
                    <p className="text-zinc-400 mt-1">Administra y monitorea la asistencia del equipo</p>
                </div>
                <Button onClick={handleExport} variant="outline" className="gap-2">
                    <Download className="w-4 h-4" />
                    Exportar CSV
                </Button>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Card className="p-4 bg-zinc-900 border-zinc-800">
                    <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-blue-500/10">
                            <Users className="w-5 h-5 text-blue-500" />
                        </div>
                        <div>
                            <p className="text-sm text-zinc-400">Presentes Hoy</p>
                            <p className="text-2xl font-bold text-white">{presentToday}</p>
                        </div>
                    </div>
                </Card>

                <Card className="p-4 bg-zinc-900 border-zinc-800">
                    <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-emerald-500/10">
                            <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                        </div>
                        <div>
                            <p className="text-sm text-zinc-400">A Tiempo</p>
                            <p className="text-2xl font-bold text-white">{onTimeToday}</p>
                        </div>
                    </div>
                </Card>

                <Card className="p-4 bg-zinc-900 border-zinc-800">
                    <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-amber-500/10">
                            <AlertCircle className="w-5 h-5 text-amber-500" />
                        </div>
                        <div>
                            <p className="text-sm text-zinc-400">Tarde</p>
                            <p className="text-2xl font-bold text-white">{lateToday}</p>
                        </div>
                    </div>
                </Card>

                <Card className="p-4 bg-zinc-900 border-zinc-800">
                    <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-purple-500/10">
                            <Clock className="w-5 h-5 text-purple-500" />
                        </div>
                        <div>
                            <p className="text-sm text-zinc-400">Total Registros</p>
                            <p className="text-2xl font-bold text-white">{records.length}</p>
                        </div>
                    </div>
                </Card>
            </div>

            {/* Filters */}
            <Card className="p-6 bg-zinc-900 border-zinc-800">
                <div className="flex items-center gap-2 mb-4">
                    <Filter className="w-5 h-5 text-emerald-500" />
                    <h2 className="text-lg font-semibold text-white">Filtros</h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div>
                        <label className="text-sm text-zinc-400 mb-2 block">Fecha Inicio</label>
                        <Input
                            type="date"
                            value={filters.startDate}
                            onChange={(e) => setFilters({ ...filters, startDate: e.target.value })}
                            className="bg-zinc-800 border-zinc-700 text-white"
                        />
                    </div>
                    <div>
                        <label className="text-sm text-zinc-400 mb-2 block">Fecha Fin</label>
                        <Input
                            type="date"
                            value={filters.endDate}
                            onChange={(e) => setFilters({ ...filters, endDate: e.target.value })}
                            className="bg-zinc-800 border-zinc-700 text-white"
                        />
                    </div>
                    <div>
                        <label className="text-sm text-zinc-400 mb-2 block">Estado</label>
                        <select
                            value={filters.status}
                            onChange={(e) =>
                                setFilters({ ...filters, status: e.target.value as AttendanceFilters["status"] })
                            }
                            className="w-full h-10 px-3 rounded-md bg-zinc-800 border border-zinc-700 text-white"
                        >
                            <option value="all">Todos</option>
                            <option value="on-time">A Tiempo</option>
                            <option value="late">Tarde</option>
                            <option value="in-progress">En Progreso</option>
                        </select>
                    </div>
                    <div className="flex items-end">
                        <Button
                            onClick={() =>
                                setFilters({
                                    startDate: new Date().toISOString().split("T")[0],
                                    endDate: new Date().toISOString().split("T")[0],
                                    status: "all",
                                })
                            }
                            variant="outline"
                            className="w-full"
                        >
                            Limpiar Filtros
                        </Button>
                    </div>
                </div>
            </Card>

            {/* Attendance Table */}
            <Card className="p-6 bg-zinc-900 border-zinc-800">
                <h2 className="text-xl font-bold text-white mb-4">Registros de Asistencia</h2>
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="border-b border-zinc-800">
                                <th className="text-left py-3 px-4 text-sm font-medium text-zinc-400">Fecha</th>
                                <th className="text-left py-3 px-4 text-sm font-medium text-zinc-400">Empleado</th>
                                <th className="text-left py-3 px-4 text-sm font-medium text-zinc-400">Entrada</th>
                                <th className="text-left py-3 px-4 text-sm font-medium text-zinc-400">Salida</th>
                                <th className="text-left py-3 px-4 text-sm font-medium text-zinc-400">Horas</th>
                                <th className="text-left py-3 px-4 text-sm font-medium text-zinc-400">Estado</th>
                            </tr>
                        </thead>
                        <tbody>
                            {records.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="text-center py-8 text-zinc-500">
                                        No hay registros para mostrar
                                    </td>
                                </tr>
                            ) : (
                                records.map((record) => (
                                    <tr key={record.id} className="border-b border-zinc-800 hover:bg-zinc-800/50">
                                        <td className="py-3 px-4 text-sm text-white">{record.date}</td>
                                        <td className="py-3 px-4 text-sm text-white">{record.userName}</td>
                                        <td className="py-3 px-4 text-sm text-zinc-400">
                                            {new Date(record.clockIn).toLocaleTimeString("es-CO", {
                                                hour: "2-digit",
                                                minute: "2-digit",
                                            })}
                                        </td>
                                        <td className="py-3 px-4 text-sm text-zinc-400">
                                            {record.clockOut
                                                ? new Date(record.clockOut).toLocaleTimeString("es-CO", {
                                                    hour: "2-digit",
                                                    minute: "2-digit",
                                                })
                                                : "-"}
                                        </td>
                                        <td className="py-3 px-4 text-sm font-medium text-emerald-500">
                                            {record.hoursWorked?.toFixed(2) || "-"}
                                        </td>
                                        <td className="py-3 px-4">
                                            <span
                                                className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${record.status === "on-time"
                                                        ? "bg-emerald-500/10 text-emerald-500"
                                                        : record.status === "late"
                                                            ? "bg-amber-500/10 text-amber-500"
                                                            : "bg-zinc-700 text-zinc-300"
                                                    }`}
                                            >
                                                {record.status === "on-time" && "A Tiempo"}
                                                {record.status === "late" && `Tarde (${record.minutesLate}m)`}
                                                {record.status === "in-progress" && "En Progreso"}
                                            </span>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </Card>
        </div>
    )
}
