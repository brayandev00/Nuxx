"use client"

import { Bell, Search, Plus, Building2 } from "lucide-react"
import { Button } from "./ui/button"
import { Input } from "./ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar"
import { useTenant } from "@/lib/tenant-context"

interface HeaderProps {
  title: string
  subtitle?: string
}

export function Header({ title, subtitle }: HeaderProps) {
  const { currentTenant, currentUser, currentRole } = useTenant()

  return (
    <header className="h-20 border-b border-[#27272A] bg-[#18181B]/50 backdrop-blur-sm px-8 flex items-center justify-between sticky top-0 z-40">
      <div>
        <h1 className="text-2xl font-semibold text-white">{title}</h1>
        {subtitle && <p className="text-zinc-500 text-sm">{subtitle}</p>}
      </div>

      <div className="flex items-center gap-4">
        {/* Tenant Badge */}
        {currentTenant && (
          <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#27272A] border border-[#3F3F46]">
            <Building2 className="w-4 h-4 text-primary" />
            <span className="text-sm text-zinc-400">{currentTenant.name}</span>
          </div>
        )}

        {/* Search */}
        <div className="relative hidden md:block">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
          <Input
            placeholder="Buscar..."
            className="w-64 pl-10 bg-[#09090B] border-[#27272A] focus:border-primary text-white placeholder:text-zinc-600"
          />
        </div>

        {/* Quick Action */}
        <Button className="bg-primary hover:bg-primary/90 text-black font-medium">
          <Plus className="w-4 h-4 mr-2" />
          Nuevo
        </Button>

        {/* Notifications */}
        <Button variant="ghost" size="icon" className="relative text-zinc-400 hover:text-white">
          <Bell className="w-5 h-5" />
          <span className="absolute top-1 right-1 w-2 h-2 bg-primary rounded-full" />
        </Button>

        {/* User */}
        <div className="flex items-center gap-3">
          <Avatar className="w-10 h-10 border-2 border-primary/30">
            <AvatarImage src={currentUser?.avatar || "/placeholder.svg"} />
            <AvatarFallback className="bg-primary/20 text-primary">
              {currentUser?.name?.charAt(0) || "U"}
            </AvatarFallback>
          </Avatar>
          <div className="hidden lg:block">
            <p className="text-sm font-medium text-white">{currentUser?.name || "Usuario"}</p>
            <p className="text-xs text-zinc-500">{currentRole?.name || "Sin rol"}</p>
          </div>
        </div>
      </div>
    </header>
  )
}
