"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import type { Tenant, User, CustomRole } from "./types"

// Datos de ejemplo de empresas (tenants)
const DEMO_TENANTS: Tenant[] = [
  {
    id: "tenant-001",
    name: "Lineas Pereiranas",
    slug: "lineas-pereiranas",
    logo: "/logos/lineas-pereiranas.png",
    plan: "enterprise",
    status: "active",
    createdAt: "2024-01-15",
    maxUsers: 50,
    features: ["inventory", "finance", "payroll", "analytics"],
    settings: {
      currency: "COP",
      timezone: "America/Bogota",
      language: "es",
      fiscalYearStart: "01-01",
      allowCustomRoles: true,
      modules: ["dashboard", "projects", "attendance", "team", "inventory", "finance", "payroll", "analytics", "settings", "roles"],
    },
  },
  {
    id: "tenant-002",
    name: "Tunin Sports",
    slug: "tunin-sports",
    logo: "/logos/tunin-sports.png",
    plan: "professional",
    status: "active",
    createdAt: "2024-03-20",
    maxUsers: 25,
    features: ["inventory", "finance", "analytics"],
    settings: {
      currency: "COP",
      timezone: "America/Bogota",
      language: "es",
      fiscalYearStart: "01-01",
      allowCustomRoles: true,
      modules: ["dashboard", "projects", "attendance", "team", "inventory", "finance", "analytics", "settings", "roles"],
    },
  },
  {
    id: "tenant-003",
    name: "Cafe Andino",
    slug: "cafe-andino",
    logo: "/logos/cafe-andino.png",
    plan: "starter",
    status: "active",
    createdAt: "2024-06-10",
    maxUsers: 10,
    features: ["inventory", "finance"],
    settings: {
      currency: "COP",
      timezone: "America/Bogota",
      language: "es",
      fiscalYearStart: "01-01",
      allowCustomRoles: false,
      modules: ["dashboard", "attendance", "team", "inventory", "finance", "settings"],
    },
  },
]

// Usuarios de ejemplo por tenant
const DEMO_USERS: User[] = [
  // Lineas Pereiranas
  {
    id: "user-001",
    tenantId: "tenant-001",
    name: "Pedro Martinez",
    email: "pedro@lineaspereiranas.com",
    avatar: "/avatars/pedro.jpg",
    roleId: "role-admin",
    department: "Gerencia",
    position: "Gerente General",
    salary: 8500000,
    hireDate: "2020-03-15",
    status: "active",
    phone: "+57 300 123 4567",
    twoFactorEnabled: true,
  },
  {
    id: "user-002",
    tenantId: "tenant-001",
    name: "Ana Rodriguez",
    email: "ana@lineaspereiranas.com",
    avatar: "/avatars/ana.jpg",
    roleId: "role-accountant",
    department: "Contabilidad",
    position: "Contadora",
    salary: 4500000,
    hireDate: "2021-06-01",
    status: "active",
    twoFactorEnabled: false,
  },
  {
    id: "user-003",
    tenantId: "tenant-001",
    name: "Carlos Gomez",
    email: "carlos@lineaspereiranas.com",
    roleId: "role-warehouse",
    department: "Almacen",
    position: "Jefe de Bodega",
    salary: 3200000,
    hireDate: "2022-01-10",
    status: "active",
    twoFactorEnabled: false,
  },
  // Tunin Sports
  {
    id: "user-004",
    tenantId: "tenant-002",
    name: "Paula Sanchez",
    email: "paula@tuninsports.com",
    avatar: "/avatars/paula.jpg",
    roleId: "role-admin",
    department: "Direccion",
    position: "Directora",
    salary: 7000000,
    hireDate: "2024-03-20",
    status: "active",
    twoFactorEnabled: true,
  },
  {
    id: "user-005",
    tenantId: "tenant-002",
    name: "Miguel Torres",
    email: "miguel@tuninsports.com",
    roleId: "role-sales",
    department: "Ventas",
    position: "Vendedor",
    salary: 2800000,
    hireDate: "2024-04-15",
    status: "active",
    twoFactorEnabled: false,
  },
]

// Roles por defecto del sistema
const DEFAULT_ROLES: CustomRole[] = [
  {
    id: "role-admin",
    tenantId: "system",
    name: "Administrador",
    description: "Acceso total al sistema",
    color: "#10B981",
    icon: "Shield",
    isSystem: true,
    isDefault: false,
    permissions: {
      dashboard: { view: true, create: true, edit: true, delete: true, export: true },
      projects: { view: true, create: true, edit: true, delete: true, export: true },
      analytics: { view: true, create: true, edit: true, delete: true, export: true },
      team: { view: true, create: true, edit: true, delete: true, export: true },
      inventory: { view: true, create: true, edit: true, delete: true, export: true },
      finance: { view: true, create: true, edit: true, delete: true, export: true },
      payroll: { view: true, create: true, edit: true, delete: true, export: true },
      attendance: { view: true, create: true, edit: true, delete: true, export: true },
      settings: { view: true, create: true, edit: true, delete: true, export: true },
      roles: { view: true, create: true, edit: true, delete: true, export: true },
    },
    createdAt: "2024-01-01",
    createdBy: "system",
    updatedAt: "2024-01-01",
  },
  {
    id: "role-accountant",
    tenantId: "system",
    name: "Contador",
    description: "Acceso a modulos financieros",
    color: "#3B82F6",
    icon: "Calculator",
    isSystem: true,
    isDefault: false,
    permissions: {
      dashboard: { view: true, create: false, edit: false, delete: false, export: true },
      projects: { view: false, create: false, edit: false, delete: false, export: false },
      analytics: { view: true, create: false, edit: false, delete: false, export: true },
      team: { view: true, create: false, edit: false, delete: false, export: false },
      inventory: { view: true, create: false, edit: false, delete: false, export: true },
      finance: { view: true, create: true, edit: true, delete: false, export: true },
      payroll: { view: true, create: true, edit: true, delete: false, export: true },
      attendance: { view: true, create: false, edit: false, delete: false, export: true },
      settings: { view: false, create: false, edit: false, delete: false, export: false },
      roles: { view: false, create: false, edit: false, delete: false, export: false },
    },
    createdAt: "2024-01-01",
    createdBy: "system",
    updatedAt: "2024-01-01",
  },
  {
    id: "role-warehouse",
    tenantId: "system",
    name: "Encargado Almacen",
    description: "Gestion de inventario",
    color: "#F59E0B",
    icon: "Package",
    isSystem: true,
    isDefault: false,
    permissions: {
      dashboard: { view: true, create: false, edit: false, delete: false, export: false },
      projects: { view: false, create: false, edit: false, delete: false, export: false },
      analytics: { view: false, create: false, edit: false, delete: false, export: false },
      team: { view: true, create: false, edit: false, delete: false, export: false },
      inventory: { view: true, create: true, edit: true, delete: true, export: true },
      finance: { view: false, create: false, edit: false, delete: false, export: false },
      payroll: { view: false, create: false, edit: false, delete: false, export: false },
      attendance: { view: true, create: false, edit: false, delete: false, export: false },
      settings: { view: false, create: false, edit: false, delete: false, export: false },
      roles: { view: false, create: false, edit: false, delete: false, export: false },
    },
    createdAt: "2024-01-01",
    createdBy: "system",
    updatedAt: "2024-01-01",
  },
  {
    id: "role-sales",
    tenantId: "system",
    name: "Ventas",
    description: "Acceso a ventas e inventario",
    color: "#EC4899",
    icon: "ShoppingCart",
    isSystem: true,
    isDefault: true,
    permissions: {
      dashboard: { view: true, create: false, edit: false, delete: false, export: false },
      projects: { view: true, create: true, edit: true, delete: false, export: false },
      analytics: { view: true, create: false, edit: false, delete: false, export: false },
      team: { view: true, create: false, edit: false, delete: false, export: false },
      inventory: { view: true, create: false, edit: false, delete: false, export: false },
      finance: { view: false, create: false, edit: false, delete: false, export: false },
      payroll: { view: false, create: false, edit: false, delete: false, export: false },
      attendance: { view: true, create: false, edit: false, delete: false, export: false },
      settings: { view: false, create: false, edit: false, delete: false, export: false },
      roles: { view: false, create: false, edit: false, delete: false, export: false },
    },
    createdAt: "2024-01-01",
    createdBy: "system",
    updatedAt: "2024-01-01",
  },
]

interface TenantContextType {
  currentTenant: Tenant | null
  currentUser: User | null
  currentRole: CustomRole | null
  tenants: Tenant[]
  users: User[]
  roles: CustomRole[]
  setCurrentTenant: (tenant: Tenant | null) => void
  setCurrentUser: (user: User | null) => void
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>
  logout: () => void
  hasPermission: (module: string, action: string) => boolean
  getTenantUsers: () => User[]
  getTenantRoles: () => CustomRole[]
  updateTenant: (updates: Partial<Tenant>) => void
  addRole: (role: Omit<CustomRole, "id" | "createdAt" | "updatedAt">) => void
  updateRole: (roleId: string, updates: Partial<CustomRole>) => void
  deleteRole: (roleId: string) => void
}

const TenantContext = createContext<TenantContextType | undefined>(undefined)

export function TenantProvider({ children }: { children: ReactNode }) {
  const [currentTenant, setCurrentTenant] = useState<Tenant | null>(null)
  const [currentUser, setCurrentUser] = useState<User | null>(null)
  const [tenants, setTenants] = useState<Tenant[]>(DEMO_TENANTS)
  const [users] = useState<User[]>(DEMO_USERS)
  const [roles, setRoles] = useState<CustomRole[]>(DEFAULT_ROLES)

  const currentRole = currentUser ? roles.find((r) => r.id === currentUser.roleId) || null : null

  // Restore session from localStorage
  useEffect(() => {
    const savedSession = localStorage.getItem("nuux_session")
    if (savedSession) {
      try {
        const { tenantId, userId } = JSON.parse(savedSession)
        const tenant = tenants.find((t) => t.id === tenantId)
        const user = users.find((u) => u.id === userId)
        if (tenant && user) {
          setCurrentTenant(tenant)
          setCurrentUser(user)
        }
      } catch {
        localStorage.removeItem("nuux_session")
      }
    }
  }, [tenants, users])

  const login = async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    // Simular delay de red
    await new Promise((resolve) => setTimeout(resolve, 800))

    // Buscar usuario por email
    const user = users.find((u) => u.email.toLowerCase() === email.toLowerCase())

    if (!user) {
      return { success: false, error: "Usuario no encontrado" }
    }

    // En produccion aqui iria la validacion real de password
    // Para demo, cualquier password funciona

    const tenant = tenants.find((t) => t.id === user.tenantId)

    if (!tenant) {
      return { success: false, error: "Empresa no encontrada" }
    }

    if (tenant.status === "suspended") {
      return { success: false, error: "La cuenta de esta empresa esta suspendida" }
    }

    setCurrentUser(user)
    setCurrentTenant(tenant)

    // Save session
    localStorage.setItem(
      "nuux_session",
      JSON.stringify({
        tenantId: tenant.id,
        userId: user.id,
      }),
    )

    return { success: true }
  }

  const logout = () => {
    setCurrentUser(null)
    setCurrentTenant(null)
    localStorage.removeItem("nuux_session")
  }

  const hasPermission = (module: string, action: string): boolean => {
    if (!currentRole) return false
    const modulePerms = currentRole.permissions[module as keyof typeof currentRole.permissions]
    if (!modulePerms) return false
    return modulePerms[action as keyof typeof modulePerms] ?? false
  }

  const getTenantUsers = (): User[] => {
    if (!currentTenant) return []
    return users.filter((u) => u.tenantId === currentTenant.id)
  }

  const getTenantRoles = (): CustomRole[] => {
    if (!currentTenant) return roles.filter((r) => r.tenantId === "system")
    return roles.filter((r) => r.tenantId === "system" || r.tenantId === currentTenant.id)
  }

  const updateTenant = (updates: Partial<Tenant>) => {
    if (!currentTenant) return
    setTenants((prev) => prev.map((t) => (t.id === currentTenant.id ? { ...t, ...updates } : t)))
    setCurrentTenant((prev) => (prev ? { ...prev, ...updates } : null))
  }

  const addRole = (role: Omit<CustomRole, "id" | "createdAt" | "updatedAt">) => {
    const newRole: CustomRole = {
      ...role,
      id: `role-${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
    setRoles((prev) => [...prev, newRole])
  }

  const updateRole = (roleId: string, updates: Partial<CustomRole>) => {
    setRoles((prev) =>
      prev.map((r) => (r.id === roleId ? { ...r, ...updates, updatedAt: new Date().toISOString() } : r)),
    )
  }

  const deleteRole = (roleId: string) => {
    const role = roles.find((r) => r.id === roleId)
    if (role?.isSystem) return // Cannot delete system roles
    setRoles((prev) => prev.filter((r) => r.id !== roleId))
  }

  return (
    <TenantContext.Provider
      value={{
        currentTenant,
        currentUser,
        currentRole,
        tenants,
        users,
        roles,
        setCurrentTenant,
        setCurrentUser,
        login,
        logout,
        hasPermission,
        getTenantUsers,
        getTenantRoles,
        updateTenant,
        addRole,
        updateRole,
        deleteRole,
      }}
    >
      {children}
    </TenantContext.Provider>
  )
}

export function useTenant() {
  const context = useContext(TenantContext)
  if (context === undefined) {
    throw new Error("useTenant must be used within a TenantProvider")
  }
  return context
}
