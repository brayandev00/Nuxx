"use client"

import { useState } from "react"
import { Card } from "./ui/card"
import { Input } from "./ui/input"
import { Label } from "./ui/label"
import { Button } from "./ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar"
import { Switch } from "./ui/switch"
import { Camera, Save, Bell, Shield, Palette, Globe } from "lucide-react"

export function ProfileSettings() {
  const [name, setName] = useState("Jorge Fernández")
  const [email, setEmail] = useState("jorge@nuux.app")
  const [role, setRole] = useState("Product Manager")

  return (
    <Card className="p-6 bg-card border-border">
      <h3 className="text-lg font-semibold text-foreground mb-6">Perfil de Usuario</h3>

      <div className="flex items-start gap-6 mb-8">
        <div className="relative group">
          <Avatar className="w-24 h-24 border-4 border-primary/30">
            <AvatarImage src="/placeholder-user.png" />
            <AvatarFallback className="bg-primary/20 text-primary text-2xl">JF</AvatarFallback>
          </Avatar>
          <button className="absolute inset-0 bg-background/80 rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
            <Camera className="w-6 h-6 text-foreground" />
          </button>
        </div>
        <div className="flex-1 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-foreground">
                Nombre completo
              </Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="bg-secondary border-border focus:border-primary"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email" className="text-foreground">
                Email
              </Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-secondary border-border focus:border-primary"
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="role" className="text-foreground">
              Rol / Cargo
            </Label>
            <Input
              id="role"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="bg-secondary border-border focus:border-primary"
            />
          </div>
        </div>
      </div>

      <Button className="bg-primary hover:bg-primary/90 text-primary-foreground neon-glow">
        <Save className="w-4 h-4 mr-2" />
        Guardar Cambios
      </Button>
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
    <Card className="p-6 bg-card border-border">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
          <Bell className="w-5 h-5 text-primary" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-foreground">Notificaciones</h3>
          <p className="text-muted-foreground text-sm">Configura cómo recibir alertas</p>
        </div>
      </div>

      <div className="space-y-4">
        {[
          {
            label: "Notificaciones por email",
            desc: "Recibe alertas importantes en tu correo",
            state: emailNotifs,
            setState: setEmailNotifs,
          },
          {
            label: "Notificaciones push",
            desc: "Alertas en tiempo real en el navegador",
            state: pushNotifs,
            setState: setPushNotifs,
          },
          {
            label: "Actualizaciones de proyectos",
            desc: "Cuando hay cambios en tus proyectos",
            state: projectUpdates,
            setState: setProjectUpdates,
          },
          {
            label: "Recordatorios de tareas",
            desc: "Alertas antes del vencimiento",
            state: taskReminders,
            setState: setTaskReminders,
          },
          {
            label: "Reporte semanal",
            desc: "Resumen de actividad cada lunes",
            state: weeklyReport,
            setState: setWeeklyReport,
          },
        ].map((item) => (
          <div
            key={item.label}
            className="flex items-center justify-between py-3 border-b border-border/50 last:border-0"
          >
            <div>
              <p className="font-medium text-foreground">{item.label}</p>
              <p className="text-muted-foreground text-sm">{item.desc}</p>
            </div>
            <Switch checked={item.state} onCheckedChange={item.setState} className="data-[state=checked]:bg-primary" />
          </div>
        ))}
      </div>
    </Card>
  )
}

export function SecuritySettings() {
  return (
    <Card className="p-6 bg-card border-border">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
          <Shield className="w-5 h-5 text-primary" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-foreground">Seguridad</h3>
          <p className="text-muted-foreground text-sm">Protege tu cuenta</p>
        </div>
      </div>

      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="current-password" className="text-foreground">
            Contraseña actual
          </Label>
          <Input
            id="current-password"
            type="password"
            placeholder="••••••••"
            className="bg-secondary border-border focus:border-primary"
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="new-password" className="text-foreground">
              Nueva contraseña
            </Label>
            <Input
              id="new-password"
              type="password"
              placeholder="••••••••"
              className="bg-secondary border-border focus:border-primary"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="confirm-password" className="text-foreground">
              Confirmar contraseña
            </Label>
            <Input
              id="confirm-password"
              type="password"
              placeholder="••••••••"
              className="bg-secondary border-border focus:border-primary"
            />
          </div>
        </div>
        <div className="flex items-center justify-between py-3 border-t border-border/50 mt-4">
          <div>
            <p className="font-medium text-foreground">Autenticación en dos pasos</p>
            <p className="text-muted-foreground text-sm">Añade una capa extra de seguridad</p>
          </div>
          <Switch className="data-[state=checked]:bg-primary" />
        </div>
        <Button variant="outline" className="border-border hover:border-primary/30 bg-transparent">
          Actualizar Contraseña
        </Button>
      </div>
    </Card>
  )
}

export function AppearanceSettings() {
  const [theme, setTheme] = useState("dark")
  const [language, setLanguage] = useState("es")

  return (
    <Card className="p-6 bg-card border-border">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
          <Palette className="w-5 h-5 text-primary" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-foreground">Apariencia</h3>
          <p className="text-muted-foreground text-sm">Personaliza la interfaz</p>
        </div>
      </div>

      <div className="space-y-6">
        <div className="space-y-3">
          <Label className="text-foreground">Tema</Label>
          <div className="flex gap-3">
            {[
              { value: "dark", label: "Oscuro" },
              { value: "light", label: "Claro" },
              { value: "system", label: "Sistema" },
            ].map((option) => (
              <button
                key={option.value}
                onClick={() => setTheme(option.value)}
                className={`flex-1 py-3 px-4 rounded-xl border transition-all ${
                  theme === option.value
                    ? "border-primary bg-primary/10 text-primary neon-border"
                    : "border-border bg-secondary text-muted-foreground hover:border-primary/30"
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
            <Globe className="w-5 h-5 text-primary" />
          </div>
          <div className="flex-1">
            <Label htmlFor="language" className="text-foreground">
              Idioma
            </Label>
            <select
              id="language"
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="w-full mt-2 bg-secondary border border-border rounded-lg px-4 py-2.5 text-foreground focus:border-primary focus:outline-none transition-colors"
            >
              <option value="es">Español</option>
              <option value="en">English</option>
              <option value="pt">Português</option>
            </select>
          </div>
        </div>
      </div>
    </Card>
  )
}
