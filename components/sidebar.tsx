"use client"

import Link from "next/link"
import Image from "next/image"
import { usePathname } from "next/navigation"
import { NuuxLogo } from "./nuux-logo"
import {
  LayoutDashboard,
  FolderKanban,
  BarChart3,
  Settings,
  Users,
  Bell,
  LogOut,
  ChevronLeft,
  ChevronRight,
  Package,
  DollarSign,
  Receipt,
  Shield,
  Building2,
  ClipboardList,
  ShoppingCart,
  FileText,
  Lock,
  Target,
  Clock,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { useState } from "react"
import { Button } from "./ui/button"
import { useTenant } from "@/lib/tenant-context"

const navItems = [
  { href: "/dashboard", icon: LayoutDashboard, label: "Dashboard", module: "dashboard" },
  { href: "/dashboard/tasks", icon: ClipboardList, label: "Mis Tareas", module: "projects" },
  { href: "/dashboard/attendance", icon: Clock, label: "Asistencias", module: "attendance" },
  { href: "/dashboard/projects", icon: FolderKanban, label: "Proyectos", module: "projects" },
  { href: "/dashboard/crm", icon: Target, label: "CRM", module: "crm" },
  { href: "/dashboard/analytics", icon: BarChart3, label: "Analitica", module: "analytics" },
  { href: "/dashboard/team", icon: Users, label: "Equipo", module: "team" },
  { href: "/dashboard/roles", icon: Shield, label: "Roles y Permisos", module: "roles" },
  { href: "/dashboard/inventory", icon: Package, label: "Inventario", module: "inventory" },
  { href: "/dashboard/procurement", icon: ShoppingCart, label: "Compras", module: "procurement" },
  { href: "/dashboard/finance", icon: DollarSign, label: "Finanzas", module: "finance" },
  { href: "/dashboard/payroll", icon: Receipt, label: "Nominas", module: "payroll" },
  { href: "/dashboard/documents", icon: FileText, label: "Documentos", module: "documents" },
  { href: "/dashboard/company", icon: Building2, label: "Mi Empresa", module: "settings" },
  { href: "/dashboard/settings", icon: Settings, label: "Ajustes", module: "settings" },
  { href: "/dashboard/security", icon: Lock, label: "Seguridad", module: "security" },
]

export function Sidebar() {
  const pathname = usePathname()
  const [collapsed, setCollapsed] = useState(false)
  const { currentTenant, currentUser, currentRole, logout, hasPermission } = useTenant()

  const visibleItems = navItems.filter((item) => {
    if (!currentRole) return true
    return hasPermission(item.module, "view")
  })

  return (
    <aside
      className={cn(
        "h-screen bg-zinc-950 border-r border-zinc-800 flex flex-col transition-all duration-300 relative",
        collapsed ? "w-20" : "w-64"
      )}
    >
      {/* Header */}
      <div className={cn(
        "p-6 border-b border-zinc-800 flex items-center justify-center",
        collapsed ? "p-4" : "p-6"
      )}>
        <NuuxLogo size={collapsed ? "small" : "default"} />
      </div>

      {/* Tenant Info */}
      {!collapsed && (
        <div className="p-4 border-b border-zinc-800">
          <div className="flex items-center gap-3 p-3 rounded-lg bg-zinc-900 hover:bg-zinc-800 transition-colors cursor-pointer">
            {currentTenant?.logo ? (
              <Image
                src={currentTenant.logo}
                alt={currentTenant.name}
                width={32}
                height={32}
                className="w-8 h-8 rounded-full"
              />
            ) : (
              <div className="w-8 h-8 rounded-full bg-emerald-500/10 flex items-center justify-center">
                <span className="text-emerald-500 font-bold text-sm">L</span>
              </div>
            )}
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-white truncate">{currentTenant?.name || "Lineas Pereiranas"}</p>
              <p className="text-xs text-zinc-500">Enterprise</p>
            </div>
            <ChevronRight className="w-4 h-4 text-zinc-500" />
          </div>
        </div>
      )}

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto p-2">
        {visibleItems.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(item.href + "/")
          const Icon = item.icon

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 mb-1 rounded-lg transition-all group relative",
                collapsed && "justify-center",
                isActive
                  ? "bg-emerald-500/10 text-emerald-500"
                  : "text-zinc-400 hover:text-white hover:bg-zinc-900"
              )}
            >
              {isActive && (
                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-emerald-500 rounded-r" />
              )}
              <Icon className="w-5 h-5 flex-shrink-0" />
              {!collapsed && <span className="text-sm font-medium">{item.label}</span>}
            </Link>
          )
        })}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-zinc-800">
        {!collapsed ? (
          <div className="space-y-2">
            <div className="flex items-center gap-3 p-2 rounded-lg">
              <div className="w-8 h-8 rounded-full bg-emerald-500/10 flex items-center justify-center">
                <span className="text-emerald-500 font-bold text-sm">
                  {currentUser?.name?.charAt(0) || "U"}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-white truncate">{currentUser?.name || "Usuario"}</p>
                <p className="text-xs text-zinc-500">{currentRole?.name || "Admin"}</p>
              </div>
            </div>
            <div className="flex gap-2">
              <button className="flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-white transition-colors text-sm">
                <Bell className="w-4 h-4" />
                <span>Alertas</span>
              </button>
              <button
                onClick={logout}
                className="flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-lg bg-zinc-900 hover:bg-red-500/10 text-zinc-400 hover:text-red-400 transition-colors text-sm"
              >
                <LogOut className="w-4 h-4" />
                <span>Salir</span>
              </button>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-emerald-500/10 flex items-center justify-center">
              <span className="text-emerald-500 font-bold text-sm">
                {currentUser?.name?.charAt(0) || "U"}
              </span>
            </div>
            <button
              onClick={logout}
              className="text-zinc-400 hover:text-red-400 transition-colors"
            >
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        )}
      </div>

      {/* Collapse Toggle */}
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="absolute -right-3 top-6 w-6 h-6 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
      >
        {collapsed ? <ChevronRight className="w-3 h-3" /> : <ChevronLeft className="w-3 h-3" />}
      </button>
    </aside>
  )
}
