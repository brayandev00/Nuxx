"use client"

import { useState, useEffect } from "react"
import { Clock, LogIn, LogOut, Timer } from "lucide-react"
import { Button } from "./ui/button"
import { Card } from "./ui/card"
import { AttendanceService } from "@/lib/attendance-service"
import type { AttendanceRecord } from "@/lib/attendance-types"
import { useTenant } from "@/lib/tenant-context"

export function AttendanceClock() {
    const { currentUser } = useTenant()
    const [currentTime, setCurrentTime] = useState(new Date())
    const [todayRecord, setTodayRecord] = useState<AttendanceRecord | undefined>()
    const [sessionDuration, setSessionDuration] = useState<string>("00:00:00")
    const [loading, setLoading] = useState(false)

    // Update current time every second
    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentTime(new Date())
        }, 1000)
        return () => clearInterval(timer)
    }, [])

    // Load today's record
    useEffect(() => {
        if (currentUser?.id) {
            const record = AttendanceService.getTodayRecord(currentUser.id)
            setTodayRecord(record)
        }
    }, [currentUser])

    // Update session duration
    useEffect(() => {
        if (todayRecord && todayRecord.clockIn && !todayRecord.clockOut) {
            const timer = setInterval(() => {
                const now = new Date()
                const diff = now.getTime() - todayRecord.clockIn.getTime()
                const hours = Math.floor(diff / (1000 * 60 * 60))
                const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
                const seconds = Math.floor((diff % (1000 * 60)) / 1000)
                setSessionDuration(
                    `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`
                )
            }, 1000)
            return () => clearInterval(timer)
        }
    }, [todayRecord])

    const handleClockIn = async () => {
        if (!currentUser) return
        setLoading(true)
        try {
            const record = AttendanceService.clockIn(
                currentUser.id,
                currentUser.name,
                currentUser.avatar
            )
            setTodayRecord(record)
        } catch (error) {
            alert(error instanceof Error ? error.message : "Error al registrar entrada")
        } finally {
            setLoading(false)
        }
    }

    const handleClockOut = async () => {
        if (!currentUser) return
        setLoading(true)
        try {
            const record = AttendanceService.clockOut(currentUser.id)
            setTodayRecord(record)
        } catch (error) {
            alert(error instanceof Error ? error.message : "Error al registrar salida")
        } finally {
            setLoading(false)
        }
    }

    const isClockedIn = todayRecord && !todayRecord.clockOut

    return (
        <Card className="p-8 bg-gradient-to-br from-zinc-900 to-zinc-950 border-zinc-800">
            <div className="space-y-6">
                {/* Current Time */}
                <div className="text-center">
                    <div className="flex items-center justify-center gap-2 mb-2">
                        <Clock className="w-5 h-5 text-emerald-500" />
                        <span className="text-sm font-medium text-zinc-400">Hora Actual</span>
                    </div>
                    <div className="text-5xl font-bold text-white tabular-nums">
                        {currentTime.toLocaleTimeString("es-CO", {
                            hour: "2-digit",
                            minute: "2-digit",
                            second: "2-digit",
                        })}
                    </div>
                    <div className="text-sm text-zinc-500 mt-1">
                        {currentTime.toLocaleDateString("es-CO", {
                            weekday: "long",
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                        })}
                    </div>
                </div>

                {/* Status */}
                {todayRecord && (
                    <div className="p-4 rounded-lg bg-zinc-800/50 border border-zinc-700">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-zinc-400">Estado</p>
                                <p className="text-lg font-semibold text-white">
                                    {isClockedIn ? "En Turno" : "Turno Finalizado"}
                                </p>
                            </div>
                            <div
                                className={`w-3 h-3 rounded-full ${isClockedIn ? "bg-emerald-500 animate-pulse" : "bg-zinc-600"}`}
                            />
                        </div>

                        {isClockedIn && (
                            <div className="mt-3 pt-3 border-t border-zinc-700">
                                <div className="flex items-center gap-2 text-zinc-400">
                                    <Timer className="w-4 h-4" />
                                    <span className="text-sm">Tiempo en turno:</span>
                                    <span className="text-lg font-mono font-bold text-emerald-500">
                                        {sessionDuration}
                                    </span>
                                </div>
                            </div>
                        )}

                        {todayRecord.clockOut && (
                            <div className="mt-3 pt-3 border-t border-zinc-700 grid grid-cols-2 gap-4">
                                <div>
                                    <p className="text-xs text-zinc-500">Entrada</p>
                                    <p className="text-sm font-medium text-white">
                                        {new Date(todayRecord.clockIn).toLocaleTimeString("es-CO", {
                                            hour: "2-digit",
                                            minute: "2-digit",
                                        })}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-xs text-zinc-500">Salida</p>
                                    <p className="text-sm font-medium text-white">
                                        {new Date(todayRecord.clockOut).toLocaleTimeString("es-CO", {
                                            hour: "2-digit",
                                            minute: "2-digit",
                                        })}
                                    </p>
                                </div>
                                <div className="col-span-2">
                                    <p className="text-xs text-zinc-500">Horas Trabajadas</p>
                                    <p className="text-lg font-bold text-emerald-500">
                                        {todayRecord.hoursWorked?.toFixed(2)} hrs
                                    </p>
                                </div>
                            </div>
                        )}
                    </div>
                )}

                {/* Action Buttons */}
                <div className="grid grid-cols-2 gap-4">
                    <Button
                        onClick={handleClockIn}
                        disabled={loading || isClockedIn}
                        size="lg"
                        className="h-16 bg-emerald-600 hover:bg-emerald-700 text-white disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <LogIn className="w-5 h-5 mr-2" />
                        Registrar Entrada
                    </Button>

                    <Button
                        onClick={handleClockOut}
                        disabled={loading || !isClockedIn}
                        size="lg"
                        variant="destructive"
                        className="h-16 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <LogOut className="w-5 h-5 mr-2" />
                        Registrar Salida
                    </Button>
                </div>

                {/* Status Badge */}
                {todayRecord && todayRecord.status && (
                    <div className="flex justify-center">
                        <div
                            className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium ${todayRecord.status === "on-time"
                                    ? "bg-emerald-500/10 text-emerald-500 border border-emerald-500/20"
                                    : todayRecord.status === "late"
                                        ? "bg-amber-500/10 text-amber-500 border border-amber-500/20"
                                        : "bg-zinc-700 text-zinc-300"
                                }`}
                        >
                            {todayRecord.status === "on-time" && "✓ A Tiempo"}
                            {todayRecord.status === "late" &&
                                `⚠ Tarde (${todayRecord.minutesLate} min)`}
                            {todayRecord.status === "in-progress" && "⏱ En Progreso"}
                        </div>
                    </div>
                )}
            </div>
        </Card>
    )
}
