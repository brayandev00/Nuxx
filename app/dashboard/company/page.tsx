"use client"

import { useState, useEffect } from "react"
import { Header } from "@/components/header"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Building2, Upload, Save, Globe, Clock, DollarSign, Palette, Users, Package, CheckCircle2, Facebook, Twitter, Linkedin, Instagram, LayoutTemplate } from "lucide-react"
import { useTenant } from "@/lib/tenant-context"
import { cn } from "@/lib/utils"
import { Card } from "@/components/ui/card"

export default function CompanySettingsPage() {
  const { currentTenant, updateTenant, getTenantUsers } = useTenant()
  const [isSaving, setIsSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  // Initialize with defaults if no tenant exists
  const defaultBranding = {
    primaryColor: "#10B981",
    companySlogan: "",
    welcomeMessage: "",
    logoUrl: ""
  }

  const [formData, setFormData] = useState({
    name: currentTenant?.name || "Mi Nueva Empresa",
    slug: currentTenant?.slug || "mi-empresa",
    logo: currentTenant?.logo || "",
    currency: currentTenant?.settings.currency || "COP",
    timezone: currentTenant?.settings.timezone || "America/Bogota",
    language: currentTenant?.settings.language || "es",
    slogan: currentTenant?.branding?.companySlogan || "",
    welcomeMessage: currentTenant?.branding?.welcomeMessage || "",
    primaryColor: currentTenant?.branding?.primaryColor || "#10B981",
    // New fields
    website: "https://",
    linkedin: "",
    twitter: ""
  })

  // Update form data when tenant loads
  useEffect(() => {
    if (currentTenant) {
      setFormData(prev => ({
        ...prev,
        name: currentTenant.name,
        slug: currentTenant.slug,
        logo: currentTenant.logo,
        currency: currentTenant.settings.currency,
        timezone: currentTenant.settings.timezone,
        language: currentTenant.settings.language,
        slogan: currentTenant.branding?.companySlogan || "",
        welcomeMessage: currentTenant.branding?.welcomeMessage || "",
        primaryColor: currentTenant.branding?.primaryColor || "#10B981",
      }))
    }
  }, [currentTenant])

  const users = currentTenant ? getTenantUsers() : []

  const handleSave = async () => {
    setIsSaving(true)
    // Simular guardado
    await new Promise((resolve) => setTimeout(resolve, 1000))

    if (currentTenant) {
      updateTenant({
        name: formData.name,
        slug: formData.slug,
        logo: formData.logo,
        settings: {
          ...currentTenant.settings,
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
    } else {
      // Handle creation scenario (mock)
      console.log("Creating new tenant:", formData)
    }

    setIsSaving(false)
    setSaved(true)
    setTimeout(() => setSaved(false), 3000)
  }

  return (
    <div className="flex-1 flex flex-col min-h-screen">
      <Header title="Perfil de Empresa" subtitle="Gestiona la identidad y configuración global" />

      <main className="flex-1 p-8">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* Main Form Column */}
          <div className="lg:col-span-2 space-y-8">

            {/* Company Info */}
            <div className="p-6 rounded-2xl bg-[#18181B] border border-[#27272A]">
              <h3 className="text-lg font-semibold text-white mb-6 flex items-center gap-2">
                <Building2 className="w-5 h-5 text-emerald-500" />
                Información General
              </h3>

              <div className="space-y-6">
                <div className="flex items-start gap-6">
                  <div className="shrink-0 group relative">
                    <div className="w-24 h-24 rounded-2xl bg-[#09090B] border-2 border-dashed border-[#27272A] flex items-center justify-center overflow-hidden transition-colors group-hover:border-emerald-500/50">
                      {formData.logo ? (
                        <img
                          src={formData.logo}
                          alt="Logo"
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <Upload className="w-8 h-8 text-zinc-600 group-hover:text-emerald-500 transition-colors" />
                      )}
                    </div>
                    <button className="absolute -bottom-2 -right-2 bg-emerald-500 text-black p-1.5 rounded-lg shadow-lg opacity-0 group-hover:opacity-100 transition-opacity">
                      <Upload className="w-3 h-3" />
                    </button>
                  </div>

                  <div className="flex-1 space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="name" className="text-zinc-400">Nombre Legal</Label>
                      <Input
                        id="name"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="bg-[#09090B] border-[#27272A] text-white focus:border-emerald-500 focus:ring-emerald-500/20"
                        placeholder="Ej: Acme Corp S.A.S"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="slogan" className="text-zinc-400">Slogan / Propósito</Label>
                      <Input
                        id="slogan"
                        value={formData.slogan}
                        onChange={(e) => setFormData({ ...formData, slogan: e.target.value })}
                        className="bg-[#09090B] border-[#27272A] text-white focus:border-emerald-500"
                        placeholder="Ej: Innovación constante"
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label className="text-zinc-400">Sitio Web</Label>
                    <div className="relative">
                      <Globe className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                      <Input
                        value={formData.website}
                        onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                        className="pl-9 bg-[#09090B] border-[#27272A] text-white"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-zinc-400">URL del Sistema (Slug)</Label>
                    <div className="flex">
                      <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-[#27272A] bg-[#27272A] text-zinc-500 text-xs">
                        nuux.app/
                      </span>
                      <Input
                        value={formData.slug}
                        onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                        className="rounded-l-none bg-[#09090B] border-[#27272A] text-white font-mono text-sm"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Regional & Localization */}
            <div className="p-6 rounded-2xl bg-[#18181B] border border-[#27272A]">
              <h3 className="text-lg font-semibold text-white mb-6 flex items-center gap-2">
                <Globe className="w-5 h-5 text-blue-500" />
                Región y Formatos
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <Label className="text-zinc-400">Moneda Base</Label>
                  <select
                    value={formData.currency}
                    onChange={(e) => setFormData({ ...formData, currency: e.target.value })}
                    className="w-full h-10 px-3 rounded-md bg-[#09090B] border border-[#27272A] text-white focus:border-blue-500 outline-none"
                  >
                    <option value="COP">COP ($)</option>
                    <option value="USD">USD ($)</option>
                    <option value="EUR">EUR (€)</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <Label className="text-zinc-400">Zona Horaria</Label>
                  <select
                    value={formData.timezone}
                    onChange={(e) => setFormData({ ...formData, timezone: e.target.value })}
                    className="w-full h-10 px-3 rounded-md bg-[#09090B] border border-[#27272A] text-white focus:border-blue-500 outline-none"
                  >
                    <option value="America/Bogota">Bogotá (GMT-5)</option>
                    <option value="America/Mexico_City">CDMX (GMT-6)</option>
                    <option value="America/New_York">New York (GMT-5)</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <Label className="text-zinc-400">Idioma</Label>
                  <select
                    value={formData.language}
                    onChange={(e) => setFormData({ ...formData, language: e.target.value })}
                    className="w-full h-10 px-3 rounded-md bg-[#09090B] border border-[#27272A] text-white focus:border-blue-500 outline-none"
                  >
                    <option value="es">Español</option>
                    <option value="en">English</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Branding & Social */}
            <div className="p-6 rounded-2xl bg-[#18181B] border border-[#27272A]">
              <h3 className="text-lg font-semibold text-white mb-6 flex items-center gap-2">
                <Palette className="w-5 h-5 text-purple-500" />
                Marca y Redes
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-4">
                  <Label className="text-zinc-400">Color de Marca</Label>
                  <div className="flex gap-4 items-center">
                    <input
                      type="color"
                      value={formData.primaryColor}
                      onChange={(e) => setFormData({ ...formData, primaryColor: e.target.value })}
                      className="w-16 h-16 rounded-xl cursor-pointer border-0 p-0"
                    />
                    <div className="flex flex-col gap-2">
                      <Input
                        value={formData.primaryColor}
                        onChange={(e) => setFormData({ ...formData, primaryColor: e.target.value })}
                        className="w-32 bg-[#09090B] border-[#27272A] text-white font-mono uppercase"
                      />
                      <p className="text-xs text-zinc-500">Usado en botones y acentos.</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <Label className="text-zinc-400">Redes Sociales</Label>
                  <div className="relative">
                    <Linkedin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-blue-400" />
                    <Input
                      value={formData.linkedin}
                      onChange={(e) => setFormData({ ...formData, linkedin: e.target.value })}
                      placeholder="LinkedIn URL"
                      className="pl-9 bg-[#09090B] border-[#27272A] text-white mb-2"
                    />
                  </div>
                  <div className="relative">
                    <Twitter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-sky-400" />
                    <Input
                      value={formData.twitter}
                      onChange={(e) => setFormData({ ...formData, twitter: e.target.value })}
                      placeholder="X / Twitter URL"
                      className="pl-9 bg-[#09090B] border-[#27272A] text-white"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-end pt-4">
              <Button
                onClick={handleSave}
                disabled={isSaving}
                className="bg-emerald-500 hover:bg-emerald-600 text-black font-bold px-8 h-12 text-lg shadow-lg shadow-emerald-500/20"
              >
                {isSaving ? (
                  <div className="w-5 h-5 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                ) : (
                  <>
                    <Save className="w-5 h-5 mr-2" />
                    Guardar Cambios
                  </>
                )}
              </Button>
            </div>

          </div>

          {/* Sidebar / Live Preview */}
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-white flex items-center gap-2">
              <LayoutTemplate className="w-5 h-5 text-zinc-400" />
              Vista Previa
            </h3>

            {/* Branding Preview Card */}
            <Card className="bg-[#09090B] border-[#27272A] overflow-hidden">
              <div className="h-32 bg-zinc-900 relative border-b border-[#27272A] overflow-hidden">
                {/* Simulating a banner or header pattern using the brand color */}
                <div
                  className="absolute inset-0 opacity-20"
                  style={{
                    background: `linear-gradient(45deg, ${formData.primaryColor} 0%, transparent 100%)`
                  }}
                />
                <div className="absolute -bottom-10 left-6">
                  <div className="w-24 h-24 rounded-2xl bg-black border-4 border-[#09090B] flex items-center justify-center overflow-hidden shadow-2xl">
                    {formData.logo ? (
                      <img src={formData.logo} className="w-full h-full object-cover" />
                    ) : (
                      <Building2 className="w-10 h-10 text-zinc-700" />
                    )}
                  </div>
                </div>
              </div>

              <div className="mt-12 px-6 pb-6 space-y-4">
                <div>
                  <h2 className="text-xl font-bold text-white leading-none">{formData.name || "Nombre Empresa"}</h2>
                  <p className="text-zinc-500 text-sm mt-1">{formData.slogan || "Slogan de la empresa"}</p>
                </div>

                <div className="flex flex-wrap gap-2 text-xs">
                  <span className="px-2 py-1 rounded bg-[#27272A] text-zinc-300 border border-zinc-800 flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {formData.timezone.split('/')[1]}
                  </span>
                  <span className="px-2 py-1 rounded bg-[#27272A] text-zinc-300 border border-zinc-800 flex items-center gap-1">
                    <DollarSign className="w-3 h-3" />
                    {formData.currency}
                  </span>
                </div>

                <div className="pt-4 border-t border-[#27272A]">
                  <Button
                    className="w-full font-semibold"
                    style={{ backgroundColor: formData.primaryColor, color: '#000' }}
                  >
                    Contactar
                  </Button>
                </div>
              </div>
            </Card>

            {/* Stats Summary (Mock) */}
            <div className="p-4 rounded-xl bg-[#18181B] border border-[#27272A] space-y-4">
              <h4 className="text-sm font-medium text-zinc-400 uppercase tracking-wider">Tu Suscripción</h4>
              <div className="flex items-center justify-between">
                <span className="text-white font-medium">Plan Enterprise</span>
                <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-500 text-xs font-bold border border-emerald-500/20">ACTIVO</span>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm text-zinc-500">
                  <span>Usuarios</span>
                  <span>{users.length} / {currentTenant?.maxUsers || 50}</span>
                </div>
                <div className="h-2 w-full bg-zinc-800 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-blue-500 rounded-full"
                    style={{ width: `${(users.length / (currentTenant?.maxUsers || 50)) * 100}%` }}
                  />
                </div>
              </div>
            </div>

          </div>

        </div>
      </main>
    </div>
  )
}
