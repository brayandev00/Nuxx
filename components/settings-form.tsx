"use client"

import { useState } from "react"
import { Card } from "./ui/card"
import { Input } from "./ui/input"
import { Label } from "./ui/label"
import { Button } from "./ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar"
import { Switch } from "./ui/switch"
import { Camera, Save, Bell, Shield, Mail, User, Lock, Smartphone, HardDrive, Download, History } from "lucide-react"

export function ProfileSettings() {
  const [name, setName] = useState("Jorge Fernández")
  const [email, setEmail] = useState("jorge@nuux.app")
  const [role, setRole] = useState("Product Manager")

  return (
    <Card className="overflow-hidden bg-zinc-950 border-zinc-900 shadow-xl">
      <div className="p-6 border-b border-zinc-900 bg-zinc-900/30">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20">
            <User className="w-5 h-5 text-emerald-500" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-white">Perfil de Usuario</h3>
            <p className="text-zinc-500 text-sm">Gestiona tu información personal y pública</p>
          </div>
        </div>
      </div>

      <div className="p-6 space-y-8">
        <div className="flex items-start gap-8">
          <div className="relative group">
            <Avatar className="w-24 h-24 border-4 border-zinc-900 shadow-lg">
              <AvatarImage src="/placeholder-user.png" />
              <AvatarFallback className="bg-emerald-500/10 text-emerald-500 text-2xl font-bold">JF</AvatarFallback>
            </Avatar>
            <button className="absolute inset-0 bg-black/60 rounded-full opacity-0 group-hover:opacity-100 transition-all flex items-center justify-center backdrop-blur-sm cursor-pointer border border-white/10">
              <Camera className="w-6 h-6 text-white" />
            </button>
          </div>

          <div className="flex-1 space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-xs uppercase font-bold text-zinc-500 tracking-wider">
                  Nombre completo
                </Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-600" />
                  <Input
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="pl-10 h-11 bg-zinc-900/50 border-zinc-800 text-white focus:ring-emerald-500/20 focus:border-emerald-500/50"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="email" className="text-xs uppercase font-bold text-zinc-500 tracking-wider">
                  Email Corporativo
                </Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-600" />
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10 h-11 bg-zinc-900/50 border-zinc-800 text-white focus:ring-emerald-500/20 focus:border-emerald-500/50"
                  />
                </div>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="role" className="text-xs uppercase font-bold text-zinc-500 tracking-wider">
                Cargo / Rol
              </Label>
              <Input
                id="role"
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="h-11 bg-zinc-900/50 border-zinc-800 text-white focus:ring-emerald-500/20 focus:border-emerald-500/50"
              />
            </div>
          </div>
        </div>

        <div className="flex justify-end pt-4 border-t border-zinc-900">
          <Button className="bg-emerald-600 hover:bg-emerald-700 text-white shadow-lg shadow-emerald-500/20">
            <Save className="w-4 h-4 mr-2" />
            Guardar Cambios
          </Button>
        </div>
      </div>
    </Card>
  )
}

export function NotificationSettings() {
  const [emailNotifs, setEmailNotifs] = useState(true)
  const [pushNotifs, setPushNotifs] = useState(true)
  const [projectUpdates, setProjectUpdates] = useState(true)
  const [taskReminders, setTaskReminders] = useState(false)
  const [weeklyReport, setWeeklyReport] = useState(true)

  return (
    <Card className="overflow-hidden bg-zinc-950 border-zinc-900 shadow-xl">
      <div className="p-6 border-b border-zinc-900 bg-zinc-900/30">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-amber-500/10 flex items-center justify-center border border-amber-500/20">
            <Bell className="w-5 h-5 text-amber-500" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-white">Notificaciones</h3>
            <p className="text-zinc-500 text-sm">Gestiona tus preferencias de alertas</p>
          </div>
        </div>
      </div>

      <div className="p-6 space-y-1">
        {[
          {
            label: "Notificaciones por email",
            desc: "Recibe alertas críticas directamente en tu bandeja de entrada.",
            state: emailNotifs,
            setState: setEmailNotifs,
          },
          {
            label: "Notificaciones Push",
            desc: "Alertas en tiempo real en tu navegador mientras trabajas.",
            state: pushNotifs,
            setState: setPushNotifs,
          },
          {
            label: "Actualizaciones de Proyecto",
            desc: "Notificarme cuando un miembro del equipo actualice estados.",
            state: projectUpdates,
            setState: setProjectUpdates,
          },
          {
            label: "Recordatorios de Tareas",
            desc: "Recibir avisos 1 hora antes de que venza una tarea asignada.",
            state: taskReminders,
            setState: setTaskReminders,
          },
          {
            label: "Resumen Semanal",
            desc: "Recibir un reporte de productividad cada lunes a las 9:00 AM.",
            state: weeklyReport,
            setState: setWeeklyReport,
          },
        ].map((item, i) => (
          <div
            key={item.label}
            className="flex items-center justify-between py-4 border-b border-zinc-900 last:border-0 hover:bg-zinc-900/30 transition-colors px-3 rounded-lg -mx-3"
          >
            <div>
              <p className="font-medium text-zinc-200 text-sm">{item.label}</p>
              <p className="text-zinc-500 text-xs mt-0.5 max-w-[280px]">{item.desc}</p>
            </div>
            <Switch
              checked={item.state}
              onCheckedChange={item.setState}
              className="data-[state=checked]:bg-emerald-500 data-[state=unchecked]:bg-zinc-700"
            />
          </div>
        ))}
      </div>
    </Card>
  )
}

export function SecuritySettings() {
  return (
    <Card className="overflow-hidden bg-zinc-950 border-zinc-900 shadow-xl">
      <div className="p-6 border-b border-zinc-900 bg-zinc-900/30">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center border border-blue-500/20">
            <Shield className="w-5 h-5 text-blue-500" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-white">Seguridad</h3>
            <p className="text-zinc-500 text-sm">Contraseñas y autenticación</p>
          </div>
        </div>
      </div>

      <div className="p-6 space-y-6">
        <div className="space-y-3">
          <Label htmlFor="current-password" className="text-xs uppercase font-bold text-zinc-500 tracking-wider">
            Contraseña Actual
          </Label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-600" />
            <Input
              id="current-password"
              type="password"
              placeholder="••••••••••••"
              className="pl-10 h-11 bg-zinc-900/50 border-zinc-800 text-white focus:ring-blue-500/20 focus:border-blue-500/50"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-3">
            <Label htmlFor="new-password" className="text-xs uppercase font-bold text-zinc-500 tracking-wider">
              Nueva Contraseña
            </Label>
            <Input
              id="new-password"
              type="password"
              className="h-11 bg-zinc-900/50 border-zinc-800 text-white focus:ring-blue-500/20 focus:border-blue-500/50"
            />
          </div>
          <div className="space-y-3">
            <Label htmlFor="confirm-password" className="text-xs uppercase font-bold text-zinc-500 tracking-wider">
              Confirmar Nueva
            </Label>
            <Input
              id="confirm-password"
              type="password"
              className="h-11 bg-zinc-900/50 border-zinc-800 text-white focus:ring-blue-500/20 focus:border-blue-500/50"
            />
          </div>
        </div>

        <div className="bg-zinc-900/50 border border-zinc-900 p-4 rounded-xl flex items-center justify-between mt-2">
          <div className="flex gap-3">
            <div className="p-2 bg-zinc-950 rounded-lg border border-zinc-800">
              <Smartphone className="w-5 h-5 text-zinc-400" />
            </div>
            <div>
              <p className="font-medium text-zinc-200 text-sm">Autenticación de 2 Pasos (2FA)</p>
              <p className="text-zinc-500 text-xs mt-0.5">Protege tu cuenta con un código temporal.</p>
            </div>
          </div>
          <Switch className="data-[state=checked]:bg-blue-500 data-[state=unchecked]:bg-zinc-700" />
        </div>

        <div className="flex justify-end pt-2">
          <Button variant="outline" className="border-zinc-800 text-zinc-400 hover:text-white hover:bg-zinc-900 hover:border-zinc-700">
            Actualizar Seguridad
          </Button>
        </div>
      </div>
    </Card>
  )
}

export function DataSettings() {
  return (
    <Card className="overflow-hidden bg-zinc-950 border-zinc-900 shadow-xl">
      <div className="p-6 border-b border-zinc-900 bg-zinc-900/30">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-red-500/10 flex items-center justify-center border border-red-500/20">
            <HardDrive className="w-5 h-5 text-red-500" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-white">Datos y Privacidad</h3>
            <p className="text-zinc-500 text-sm">Gestiona tu información y derechos</p>
          </div>
        </div>
      </div>

      <div className="p-6 space-y-6">
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 rounded-xl bg-zinc-900/30 border border-zinc-900 hover:border-zinc-800 transition-colors">
            <div className="flex gap-4">
              <div className="p-2 bg-zinc-900 rounded-lg h-fit">
                <Download className="w-5 h-5 text-zinc-400" />
              </div>
              <div>
                <h4 className="text-sm font-medium text-white">Exportar Datos Personales</h4>
                <p className="text-xs text-zinc-500 mt-1 max-w-sm">
                  Descarga una copia de toda tu actividad, historial y preferencias en formato JSON o CSV.
                </p>
              </div>
            </div>
            <Button variant="outline" className="text-xs border-zinc-800 text-zinc-300 hover:text-white hover:bg-zinc-900">
              Solicitar Archivo
            </Button>
          </div>

          <div className="flex items-center justify-between p-4 rounded-xl bg-zinc-900/30 border border-zinc-900 hover:border-zinc-800 transition-colors">
            <div className="flex gap-4">
              <div className="p-2 bg-zinc-900 rounded-lg h-fit">
                <History className="w-5 h-5 text-zinc-400" />
              </div>
              <div>
                <h4 className="text-sm font-medium text-white">Historial de Accesos</h4>
                <p className="text-xs text-zinc-500 mt-1 max-w-sm">
                  Revisa los dispositivos y ubicaciones desde donde has iniciado sesión recientemente.
                </p>
              </div>
            </div>
            <Button variant="outline" className="text-xs border-zinc-800 text-zinc-300 hover:text-white hover:bg-zinc-900">
              Ver Historial
            </Button>
          </div>
        </div>

        <div className="pt-6 border-t border-zinc-900">
          <div className="p-4 rounded-xl bg-red-500/5 border border-red-500/10">
            <h4 className="text-sm font-medium text-red-500 mb-2">Zona de Peligro</h4>
            <p className="text-xs text-red-500/70 mb-4">
              Una vez que elimines tu cuenta, no hay vuelta atrás. Por favor, asegúrate de haber guardado tus datos.
            </p>
            <Button variant="ghost" className="text-red-500 hover:text-red-400 hover:bg-red-500/10 text-xs h-8 px-3">
              Eliminar mi cuenta permanentemente
            </Button>
          </div>
        </div>
      </div>
    </Card>
  )
}
