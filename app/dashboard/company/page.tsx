"use client"

import { useState } from "react"
import { Header } from "@/components/header"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Building2, Upload, Save, Globe, Clock, DollarSign, Palette, Users, Package, CheckCircle2 } from "lucide-react"
import { useTenant } from "@/lib/tenant-context"
import { cn } from "@/lib/utils"

export default function CompanySettingsPage() {
  const { currentTenant, updateTenant, getTenantUsers } = useTenant()
  const [isSaving, setIsSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  const [formData, setFormData] = useState({
    name: currentTenant?.name || "",
    slug: currentTenant?.slug || "",
    logo: currentTenant?.logo || "",
    currency: currentTenant?.settings.currency || "COP",
    timezone: currentTenant?.settings.timezone || "America/Bogota",
    language: currentTenant?.settings.language || "es",
    slogan: currentTenant?.branding?.companySlogan || "",
    welcomeMessage: currentTenant?.branding?.welcomeMessage || "",
    primaryColor: currentTenant?.branding?.primaryColor || "#10B981",
  })

  const users = getTenantUsers()

  const handleSave = async () => {
    setIsSaving(true)
    // Simular guardado
    await new Promise((resolve) => setTimeout(resolve, 1000))

    updateTenant({
      name: formData.name,
      slug: formData.slug,
      logo: formData.logo,
      settings: {
        ...currentTenant!.settings,
        currency: formData.currency,
        timezone: formData.timezone,
        language: formData.language,
      },
      branding: {
        primaryColor: formData.primaryColor,
        companySlogan: formData.slogan,
        welcomeMessage: formData.welcomeMessage,
        logoUrl: formData.logo,
      },
    })

    setIsSaving(false)
    setSaved(true)
    setTimeout(() => setSaved(false), 3000)
  }

  if (!currentTenant) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <p className="text-zinc-500">No hay empresa seleccionada</p>
      </div>
    )
  }

  return (
    <div className="flex-1 flex flex-col bg-[#09090B] min-h-screen">
      <Header title="Mi Empresa" subtitle="Configura la informacion y branding de tu empresa" />

      <main className="flex-1 p-8">
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Plan Info */}
          <div className="p-6 rounded-2xl bg-gradient-to-r from-primary/10 to-primary/5 border border-primary/20">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center">
                  <Building2 className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-white">Plan {currentTenant.plan}</h2>
                  <p className="text-sm text-zinc-400">
                    {users.length} de {currentTenant.maxUsers} usuarios activos
                  </p>
                </div>
              </div>
              <Button variant="outline" className="border-primary/30 text-primary hover:bg-primary/10 bg-transparent">
                Mejorar Plan
              </Button>
            </div>
          </div>

          {/* Company Info */}
          <div className="p-6 rounded-2xl bg-[#18181B] border border-[#27272A]">
            <h3 className="text-lg font-semibold text-white mb-6 flex items-center gap-2">
              <Building2 className="w-5 h-5 text-primary" />
              Informacion de la Empresa
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Logo Upload */}
              <div className="md:col-span-2">
                <Label className="text-zinc-400 mb-3 block">Logo de la Empresa</Label>
                <div className="flex items-center gap-6">
                  <div className="w-24 h-24 rounded-2xl bg-[#09090B] border-2 border-dashed border-[#27272A] flex items-center justify-center overflow-hidden">
                    {formData.logo ? (
                      <img
                        src={formData.logo || "/placeholder.svg"}
                        alt="Logo"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <Upload className="w-8 h-8 text-zinc-600" />
                    )}
                  </div>
                  <div className="space-y-2">
                    <Button variant="outline" className="border-[#27272A] hover:bg-[#27272A] bg-transparent">
                      <Upload className="w-4 h-4 mr-2" />
                      Subir Logo
                    </Button>
                    <p className="text-xs text-zinc-600">PNG, JPG hasta 2MB. Recomendado: 512x512px</p>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="name" className="text-zinc-400">
                  Nombre de la Empresa
                </Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="bg-[#09090B] border-[#27272A] text-white focus:border-primary"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="slug" className="text-zinc-400">
                  URL de acceso
                </Label>
                <div className="flex">
                  <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-[#27272A] bg-[#27272A] text-zinc-500 text-sm">
                    nuux.app/
                  </span>
                  <Input
                    id="slug"
                    value={formData.slug}
                    onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                    className="rounded-l-none bg-[#09090B] border-[#27272A] text-white focus:border-primary"
                  />
                </div>
              </div>

              <div className="md:col-span-2 space-y-2">
                <Label htmlFor="slogan" className="text-zinc-400">
                  Slogan o Descripcion
                </Label>
                <Textarea
                  id="slogan"
                  value={formData.slogan}
                  onChange={(e) => setFormData({ ...formData, slogan: e.target.value })}
                  placeholder="Ej: Conectando destinos, transportando sueños"
                  className="bg-[#09090B] border-[#27272A] text-white focus:border-primary resize-none"
                  rows={2}
                />
              </div>
            </div>
          </div>

          {/* Regional Settings */}
          <div className="p-6 rounded-2xl bg-[#18181B] border border-[#27272A]">
            <h3 className="text-lg font-semibold text-white mb-6 flex items-center gap-2">
              <Globe className="w-5 h-5 text-primary" />
              Configuracion Regional
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <Label className="text-zinc-400 flex items-center gap-2">
                  <DollarSign className="w-4 h-4" />
                  Moneda
                </Label>
                <select
                  value={formData.currency}
                  onChange={(e) => setFormData({ ...formData, currency: e.target.value })}
                  className="w-full h-10 px-3 rounded-md bg-[#09090B] border border-[#27272A] text-white focus:border-primary outline-none"
                >
                  <option value="COP">COP - Peso Colombiano</option>
                  <option value="USD">USD - Dolar Americano</option>
                  <option value="EUR">EUR - Euro</option>
                  <option value="MXN">MXN - Peso Mexicano</option>
                </select>
              </div>

              <div className="space-y-2">
                <Label className="text-zinc-400 flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  Zona Horaria
                </Label>
                <select
                  value={formData.timezone}
                  onChange={(e) => setFormData({ ...formData, timezone: e.target.value })}
                  className="w-full h-10 px-3 rounded-md bg-[#09090B] border border-[#27272A] text-white focus:border-primary outline-none"
                >
                  <option value="America/Bogota">America/Bogota (GMT-5)</option>
                  <option value="America/Mexico_City">America/Mexico_City (GMT-6)</option>
                  <option value="America/New_York">America/New_York (GMT-5)</option>
                  <option value="Europe/Madrid">Europe/Madrid (GMT+1)</option>
                </select>
              </div>

              <div className="space-y-2">
                <Label className="text-zinc-400 flex items-center gap-2">
                  <Globe className="w-4 h-4" />
                  Idioma
                </Label>
                <select
                  value={formData.language}
                  onChange={(e) => setFormData({ ...formData, language: e.target.value })}
                  className="w-full h-10 px-3 rounded-md bg-[#09090B] border border-[#27272A] text-white focus:border-primary outline-none"
                >
                  <option value="es">Español</option>
                  <option value="en">English</option>
                  <option value="pt">Portugues</option>
                </select>
              </div>
            </div>
          </div>

          {/* Branding */}
          <div className="p-6 rounded-2xl bg-[#18181B] border border-[#27272A]">
            <h3 className="text-lg font-semibold text-white mb-6 flex items-center gap-2">
              <Palette className="w-5 h-5 text-primary" />
              Personalizacion Visual
            </h3>

            <div className="space-y-6">
              <div className="space-y-2">
                <Label className="text-zinc-400">Color Principal</Label>
                <div className="flex items-center gap-4">
                  <input
                    type="color"
                    value={formData.primaryColor}
                    onChange={(e) => setFormData({ ...formData, primaryColor: e.target.value })}
                    className="w-12 h-12 rounded-lg cursor-pointer border-2 border-[#27272A]"
                  />
                  <Input
                    value={formData.primaryColor}
                    onChange={(e) => setFormData({ ...formData, primaryColor: e.target.value })}
                    className="w-32 bg-[#09090B] border-[#27272A] text-white font-mono"
                  />
                  <div className="flex gap-2">
                    {["#10B981", "#3B82F6", "#8B5CF6", "#EC4899", "#F59E0B"].map((color) => (
                      <button
                        key={color}
                        onClick={() => setFormData({ ...formData, primaryColor: color })}
                        className={cn(
                          "w-8 h-8 rounded-lg transition-all",
                          formData.primaryColor === color && "ring-2 ring-white ring-offset-2 ring-offset-[#18181B]",
                        )}
                        style={{ backgroundColor: color }}
                      />
                    ))}
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="welcome" className="text-zinc-400">
                  Mensaje de Bienvenida
                </Label>
                <Textarea
                  id="welcome"
                  value={formData.welcomeMessage}
                  onChange={(e) => setFormData({ ...formData, welcomeMessage: e.target.value })}
                  placeholder="Ej: Bienvenido al sistema de gestion de Lineas Pereiranas"
                  className="bg-[#09090B] border-[#27272A] text-white focus:border-primary resize-none"
                  rows={2}
                />
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 rounded-xl bg-[#18181B] border border-[#27272A]">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Users className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-white">{users.length}</p>
                  <p className="text-xs text-zinc-500">Usuarios Activos</p>
                </div>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-[#18181B] border border-[#27272A]">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center">
                  <Package className="w-5 h-5 text-blue-500" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-white">{currentTenant.settings.modules.length}</p>
                  <p className="text-xs text-zinc-500">Modulos Activos</p>
                </div>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-[#18181B] border border-[#27272A]">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-amber-500/10 flex items-center justify-center">
                  <Clock className="w-5 h-5 text-amber-500" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-white">
                    {new Date(currentTenant.createdAt).toLocaleDateString("es", { month: "short", year: "numeric" })}
                  </p>
                  <p className="text-xs text-zinc-500">Miembro desde</p>
                </div>
              </div>
            </div>
          </div>

          {/* Save Button */}
          <div className="flex items-center justify-end gap-4">
            {saved && (
              <div className="flex items-center gap-2 text-primary text-sm">
                <CheckCircle2 className="w-4 h-4" />
                Cambios guardados
              </div>
            )}
            <Button
              onClick={handleSave}
              disabled={isSaving}
              className="bg-primary hover:bg-primary/90 text-black font-medium px-8"
            >
              {isSaving ? (
                <div className="w-5 h-5 border-2 border-black/30 border-t-black rounded-full animate-spin" />
              ) : (
                <>
                  <Save className="w-4 h-4 mr-2" />
                  Guardar Cambios
                </>
              )}
            </Button>
          </div>
        </div>
      </main>
    </div>
  )
}
