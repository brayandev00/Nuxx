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
} from "lucide-react"
import { cn } from "@/lib/utils"
import { useState } from "react"
import { Button } from "./ui/button"
import { useTenant } from "@/lib/tenant-context"

const navItems = [
  { href: "/dashboard", icon: LayoutDashboard, label: "Dashboard", module: "dashboard" },
  { href: "/dashboard/tasks", icon: ClipboardList, label: "Mis Tareas", module: "projects" },
  { href: "/dashboard/crm", icon: Target, label: "CRM", module: "crm" },
  { href: "/dashboard/projects", icon: FolderKanban, label: "Proyectos", module: "projects" },
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

  // Filter nav items based on permissions
  const visibleItems = navItems.filter((item) => {
    if (!currentRole) return true
    return hasPermission(item.module, "view")
  })

  const coreItems = visibleItems.filter((item) => ["dashboard", "projects"].includes(item.module))
  const salesItems = visibleItems.filter((item) => ["crm"].includes(item.module))
  const teamItems = visibleItems.filter((item) => ["team", "roles"].includes(item.module))
  const businessItems = visibleItems.filter((item) =>
    ["inventory", "procurement", "finance", "payroll"].includes(item.module),
  )
  const configItems = visibleItems.filter((item) =>
    ["settings", "analytics", "documents", "security"].includes(item.module),
  )

  const renderNavItems = (items: typeof navItems, title?: string) => (
    <>
      {title && !collapsed && items.length > 0 && (
        <div className="px-4 py-2 text-xs font-semibold text-zinc-600 uppercase tracking-wider">{title}</div>
      )}
      {items.map((item) => {
        const isActive = pathname === item.href || pathname.startsWith(item.href + "/")
        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200",
              isActive ? "bg-primary/10 text-primary" : "text-zinc-500 hover:text-white hover:bg-[#27272A]",
              collapsed && "justify-center px-2",
            )}
          >
            <item.icon className={cn("w-5 h-5 flex-shrink-0", isActive && "text-primary")} />
            {!collapsed && <span className="font-medium">{item.label}</span>}
          </Link>
        )
      })}
    </>
  )

  return (
    <aside
      className={cn(
        "h-screen bg-[#18181B] border-r border-[#27272A] flex flex-col transition-all duration-300 relative",
        collapsed ? "w-20" : "w-64",
      )}
    >
      {/* Company Logo/Info */}
      <div className="p-4 border-b border-[#27272A]">
        {!collapsed ? (
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <NuuxLogo size="small" />
            </div>
            {currentTenant && (
              <div className="p-3 rounded-xl bg-[#09090B] border border-[#27272A]">
                <div className="flex items-center gap-3">
                  {currentTenant.logo ? (
                    <Image
                      src={currentTenant.logo || "/placeholder.svg"}
                      alt={currentTenant.name}
                      width={32}
                      height={32}
                      className="w-8 h-8 rounded-lg object-cover"
                    />
                  ) : (
                    <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center">
                      <Building2 className="w-4 h-4 text-primary" />
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-white truncate">{currentTenant.name}</p>
                    <p className="text-xs text-zinc-500 capitalize">{currentTenant.plan}</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="flex justify-center">
            {currentTenant?.logo ? (
              <Image
                src={currentTenant.logo || "/placeholder.svg"}
                alt={currentTenant.name}
                width={32}
                height={32}
                className="w-8 h-8 rounded-lg object-cover"
              />
            ) : (
              <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center">
                <span className="text-primary font-bold text-sm">N</span>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Collapse Toggle */}
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setCollapsed(!collapsed)}
        className="absolute top-6 -right-3 z-50 w-6 h-6 rounded-full bg-[#18181B] border border-[#27272A] hover:bg-[#27272A]"
      >
        {collapsed ? <ChevronRight className="w-3 h-3" /> : <ChevronLeft className="w-3 h-3" />}
      </Button>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        {renderNavItems(coreItems)}

        {salesItems.length > 0 && (
          <>
            <div className="my-4 border-t border-[#27272A]" />
            {renderNavItems(salesItems, "Ventas")}
          </>
        )}

        {teamItems.length > 0 && (
          <>
            <div className="my-4 border-t border-[#27272A]" />
            {renderNavItems(teamItems, "Equipo")}
          </>
        )}

        {businessItems.length > 0 && (
          <>
            <div className="my-4 border-t border-[#27272A]" />
            {renderNavItems(businessItems, "Negocio")}
          </>
        )}

        {configItems.length > 0 && (
          <>
            <div className="my-4 border-t border-[#27272A]" />
            {renderNavItems(configItems, "Configuracion")}
          </>
        )}
      </nav>

      {/* User Info & Actions */}
      <div className="p-4 border-t border-[#27272A] space-y-3">
        {currentUser && !collapsed && (
          <div className="p-3 rounded-xl bg-[#09090B]">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
                <span className="text-primary font-medium text-sm">{currentUser.name.charAt(0)}</span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-white truncate">{currentUser.name}</p>
                <p className="text-xs text-zinc-500 truncate">{currentRole?.name}</p>
              </div>
            </div>
          </div>
        )}

        <button
          className={cn(
            "flex items-center gap-3 w-full px-4 py-3 rounded-xl text-zinc-500 hover:text-white hover:bg-[#27272A] transition-all",
            collapsed && "justify-center px-2",
          )}
        >
          <Bell className="w-5 h-5" />
          {!collapsed && <span>Notificaciones</span>}
        </button>

        <button
          onClick={logout}
          className={cn(
            "flex items-center gap-3 w-full px-4 py-3 rounded-xl text-zinc-500 hover:text-red-400 hover:bg-red-500/10 transition-all",
            collapsed && "justify-center px-2",
          )}
        >
          <LogOut className="w-5 h-5" />
          {!collapsed && <span>Cerrar Sesion</span>}
        </button>
      </div>
    </aside>
  )
}
