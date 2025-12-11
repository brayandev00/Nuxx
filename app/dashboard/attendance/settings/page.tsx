"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { AttendanceService } from "@/lib/attendance-service"
import { useTenant } from "@/lib/tenant-context"
import { Settings, Clock, Save, DollarSign, Users } from "lucide-react"

export default function AttendanceSettingsPage() {
    const { currentUser, roles } = useTenant()
    const [settings, setSettings] = useState(AttendanceService.getWorkSettings())
    const [saved, setSaved] = useState(false)

    const handleSave = () => {
        if (!currentUser) return
        AttendanceService.updateWorkSettings(settings, currentUser.id)
        setSaved(true)
        setTimeout(() => setSaved(false), 3000)
    }

    return (
        <div className="p-8 space-y-6">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-bold text-white">Configuración de Asistencias</h1>
                <p className="text-zinc-400 mt-1">
                    Configura las reglas y horarios de trabajo para tu empresa
                </p>
            </div>

            {/* Work Hours Settings */}
            <Card className="p-6 bg-zinc-900 border-zinc-800">
                <div className="flex items-center gap-2 mb-6">
                    <Clock className="w-5 h-5 text-emerald-500" />
                    <h2 className="text-xl font-semibold text-white">Horario Laboral</h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="text-sm font-medium text-zinc-300 mb-2 block">
                            Horas Normales de Trabajo
                        </label>
                        <Input
                            type="number"
                            value={settings.normalHours}
                            onChange={(e) =>
                                setSettings({ ...settings, normalHours: Number(e.target.value) })
                            }
                            className="bg-zinc-800 border-zinc-700 text-white"
                            min="1"
                            max="24"
                        />
                        <p className="text-xs text-zinc-500 mt-1">Horas esperadas por día laboral</p>
                    </div>

                    <div>
                        <label className="text-sm font-medium text-zinc-300 mb-2 block">
                            Período de Gracia (minutos)
                        </label>
                        <Input
                            type="number"
                            value={settings.gracePeriodMinutes}
                            onChange={(e) =>
                                setSettings({ ...settings, gracePeriodMinutes: Number(e.target.value) })
                            }
                            className="bg-zinc-800 border-zinc-700 text-white"
                            min="0"
                            max="60"
                        />
                        <p className="text-xs text-zinc-500 mt-1">
                            Minutos de tolerancia antes de marcar como tarde
                        </p>
                    </div>

                    <div>
                        <label className="text-sm font-medium text-zinc-300 mb-2 block">
                            Hora de Entrada
                        </label>
                        <Input
                            type="time"
                            value={settings.startTime}
                            onChange={(e) => setSettings({ ...settings, startTime: e.target.value })}
                            className="bg-zinc-800 border-zinc-700 text-white"
                        />
                        <p className="text-xs text-zinc-500 mt-1">Hora oficial de inicio de jornada</p>
                    </div>

                    <div>
                        <label className="text-sm font-medium text-zinc-300 mb-2 block">
                            Hora de Salida
                        </label>
                        <Input
                            type="time"
                            value={settings.endTime}
                            onChange={(e) => setSettings({ ...settings, endTime: e.target.value })}
                            className="bg-zinc-800 border-zinc-700 text-white"
                        />
                        <p className="text-xs text-zinc-500 mt-1">Hora oficial de fin de jornada</p>
                    </div>
                </div>

                <div className="mt-8 flex items-center gap-2 mb-6">
                    <DollarSign className="w-5 h-5 text-emerald-500" />
                    <h2 className="text-xl font-semibold text-white">Nómina y Pagos</h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="text-sm font-medium text-zinc-300 mb-2 block">
                            Frecuencia de Pago
                        </label>
                        <select
                            value={settings.salaryFrequency}
                            onChange={(e) =>
                                setSettings({
                                    ...settings,
                                    salaryFrequency: e.target.value as "monthly" | "biweekly" | "weekly",
                                })
                            }
                            className="w-full h-10 px-3 rounded-md bg-zinc-800 border-zinc-700 text-white"
                        >
                            <option value="monthly">Mensual</option>
                            <option value="biweekly">Quincenal</option>
                            <option value="weekly">Semanal</option>
                        </select>
                        <p className="text-xs text-zinc-500 mt-1">Cada cuánto se realizan los pagos</p>
                    </div>

                    <div>
                        <label className="text-sm font-medium text-zinc-300 mb-2 block">
                            Día de Pago
                        </label>
                        <Input
                            type="number"
                            value={settings.paymentDay}
                            onChange={(e) =>
                                setSettings({ ...settings, paymentDay: Number(e.target.value) })
                            }
                            className="bg-zinc-800 border-zinc-700 text-white"
                            min="1"
                            max="31"
                        />
                        <p className="text-xs text-zinc-500 mt-1">Día del mes para el corte/pago</p>
                    </div>
                </div>

                <div className="mt-8 flex items-center gap-2 mb-6">
                    <Users className="w-5 h-5 text-blue-500" />
                    <h2 className="text-xl font-semibold text-white">Horarios por Rol</h2>
                </div>

                <div className="space-y-4">
                    {roles.filter(r => !r.isSystem).map((role) => (
                        <div key={role.id} className="p-4 rounded-lg bg-zinc-800/50 border border-zinc-800">
                            <h3 className="text-sm font-medium text-white mb-3 flex items-center gap-2">
                                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: role.color }} />
                                {role.name}
                            </h3>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="text-xs text-zinc-400 mb-1 block">Entrada</label>
                                    <Input
                                        type="time"
                                        value={settings.roleSchedules[role.id]?.startTime || settings.startTime}
                                        onChange={(e) =>
                                            setSettings({
                                                ...settings,
                                                roleSchedules: {
                                                    ...settings.roleSchedules,
                                                    [role.id]: {
                                                        startTime: e.target.value,
                                                        endTime: settings.roleSchedules[role.id]?.endTime || settings.endTime,
                                                    },
                                                },
                                            })
                                        }
                                        className="h-8 bg-zinc-900 border-zinc-700 text-white text-xs"
                                    />
                                </div>
                                <div>
                                    <label className="text-xs text-zinc-400 mb-1 block">Salida</label>
                                    <Input
                                        type="time"
                                        value={settings.roleSchedules[role.id]?.endTime || settings.endTime}
                                        onChange={(e) =>
                                            setSettings({
                                                ...settings,
                                                roleSchedules: {
                                                    ...settings.roleSchedules,
                                                    [role.id]: {
                                                        startTime: settings.roleSchedules[role.id]?.startTime || settings.startTime,
                                                        endTime: e.target.value,
                                                    },
                                                },
                                            })
                                        }
                                        className="h-8 bg-zinc-900 border-zinc-700 text-white text-xs"
                                    />
                                </div>
                            </div>
                        </div>
                    ))}
                    {roles.filter(r => !r.isSystem).length === 0 && (
                        <p className="text-sm text-zinc-500 italic">
                            No hay roles personalizados creados. Ve a la sección de Roles para crear uno.
                        </p>
                    )}
                </div>

                <div className="mt-6 pt-6 border-t border-zinc-800">
                    <Button
                        onClick={handleSave}
                        className="gap-2 bg-emerald-600 hover:bg-emerald-700"
                    >
                        <Save className="w-4 h-4" />
                        {saved ? "Guardado ✓" : "Guardar Cambios"}
                    </Button>
                </div>
            </Card>

            {/* Preview */}
            <Card className="p-6 bg-zinc-900 border-zinc-800">
                <div className="flex items-center gap-2 mb-4">
                    <Settings className="w-5 h-5 text-blue-500" />
                    <h2 className="text-xl font-semibold text-white">Vista Previa</h2>
                </div>

                <div className="space-y-3 text-sm">
                    <div className="flex justify-between p-3 rounded-lg bg-zinc-800/50">
                        <span className="text-zinc-400">Jornada Laboral:</span>
                        <span className="text-white font-medium">
                            {settings.startTime} - {settings.endTime}
                        </span>
                    </div>
                    <div className="flex justify-between p-3 rounded-lg bg-zinc-800/50">
                        <span className="text-zinc-400">Horas Esperadas:</span>
                        <span className="text-white font-medium">{settings.normalHours} horas</span>
                    </div>
                    <div className="flex justify-between p-3 rounded-lg bg-zinc-800/50">
                        <span className="text-zinc-400">Tolerancia:</span>
                        <span className="text-white font-medium">{settings.gracePeriodMinutes} minutos</span>
                    </div>
                    <div className="flex justify-between p-3 rounded-lg bg-zinc-800/50">
                        <span className="text-zinc-400">Tarde después de:</span>
                        <span className="text-amber-500 font-medium">
                            {(() => {
                                const [h, m] = settings.startTime.split(":").map(Number)
                                const graceMinutes = settings.gracePeriodMinutes
                                const totalMinutes = h * 60 + m + graceMinutes
                                const newH = Math.floor(totalMinutes / 60)
                                const newM = totalMinutes % 60
                                return `${newH.toString().padStart(2, "0")}:${newM.toString().padStart(2, "0")}`
                            })()}
                        </span>
                    </div>
                </div>
            </Card>
        </div>
    )
}
