"use client"

import type React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { NuuxLogo } from "@/components/nuux-logo"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Eye, EyeOff, ArrowRight, Building2, AlertCircle } from "lucide-react"
import { useTenant } from "@/lib/tenant-context"

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const router = useRouter()
  const { login, tenants } = useTenant()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    const result = await login(email, password)

    if (result.success) {
      router.push("/dashboard")
    } else {
      setError(result.error || "Error al iniciar sesion")
    }

    setIsLoading(false)
  }

  const demoAccounts = [
    { email: "pedro@lineaspereiranas.com", company: "Lineas Pereiranas", role: "Administrador" },
    { email: "paula@tuninsports.com", company: "Tunin Sports", role: "Directora" },
    { email: "carlos@lineaspereiranas.com", company: "Lineas Pereiranas", role: "Jefe Bodega" },
    { email: "test@nuux.com", company: "Empresa de Prueba", role: "Cuenta Limpia (Offline)" },
  ]

  return (
    <div className="min-h-screen bg-[#09090B] flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background gradient effects */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 -left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 -right-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
      </div>

      <div className="w-full max-w-md relative z-10">
        <div className="flex justify-center mb-8">
          <NuuxLogo />
        </div>

        {/* Tagline */}
        <p className="text-center text-zinc-500 text-sm mb-6">Software de Gestion Empresarial Multi-Tenant</p>

        {/* Tenant Badge */}
        <div className="flex justify-center mb-6">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#18181B] border border-[#27272A] text-sm text-zinc-400">
            <Building2 className="w-4 h-4 text-primary" />
            <span>{tenants.length} empresas activas en Nuux</span>
          </div>
        </div>

        {/* Login Card */}
        <div className="bg-[#18181B] border border-[#27272A] rounded-2xl p-8">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-semibold text-white mb-2">Accede a tu empresa</h1>
            <p className="text-zinc-500 text-sm">Ingresa con tu correo corporativo</p>
          </div>

          {error && (
            <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center gap-3 text-red-400 text-sm">
              <AlertCircle className="w-5 h-5 flex-shrink-0" />
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-zinc-300 text-sm">
                Correo Corporativo
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="tu@empresa.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-[#09090B] border-[#27272A] h-12 text-white placeholder:text-zinc-600 focus:border-primary focus:ring-primary/20 transition-all"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-zinc-300 text-sm">
                Contrasena
              </Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="********"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="bg-[#09090B] border-[#27272A] h-12 text-white placeholder:text-zinc-600 focus:border-primary focus:ring-primary/20 pr-12 transition-all"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-white transition-colors"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" className="w-4 h-4 rounded border-[#27272A] bg-[#09090B] accent-primary" />
                <span className="text-zinc-500">Recordarme</span>
              </label>
              <a href="#" className="text-primary hover:text-primary/80 transition-colors">
                Olvidaste tu contrasena?
              </a>
            </div>

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full h-12 bg-primary hover:bg-primary/90 text-black font-semibold text-base transition-all duration-300 hover:shadow-[0_0_30px_rgba(16,185,129,0.3)]"
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-black/30 border-t-black rounded-full animate-spin" />
              ) : (
                <>
                  Iniciar Sesion
                  <ArrowRight className="w-5 h-5 ml-2" />
                </>
              )}
            </Button>
          </form>
        </div>

        {/* Demo Accounts */}
        <div className="mt-6 bg-[#18181B] border border-[#27272A] rounded-2xl p-6">
          <h3 className="text-sm font-medium text-zinc-400 mb-4 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
            Cuentas de demostracion
          </h3>
          <div className="space-y-2">
            {demoAccounts.map((account) => (
              <button
                key={account.email}
                type="button"
                onClick={() => {
                  setEmail(account.email)
                  setPassword("demo123")
                }}
                className="w-full text-left p-3 rounded-xl bg-[#09090B] hover:bg-[#27272A] border border-transparent hover:border-primary/30 transition-all group"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-white group-hover:text-primary transition-colors">{account.email}</p>
                    <p className="text-xs text-zinc-600">
                      {account.company} - {account.role}
                    </p>
                  </div>
                  <ArrowRight className="w-4 h-4 text-zinc-600 group-hover:text-primary transition-colors" />
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Footer */}
        <p className="text-center text-zinc-600 text-xs mt-8">
          2025 Nuux. Software de gestion empresarial multi-tenant.
        </p>
      </div>
    </div>
  )
}
