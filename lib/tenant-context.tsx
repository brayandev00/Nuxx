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
    role: "admin",
    roleId: "role-admin",
    department: "Gerencia",
    position: "Gerente General",
    salary: 8500000,
    hireDate: "2020-03-15",
    status: "active",
    phone: "+57 300 123 4567",
    twoFactorEnabled: true,
    vacationDays: 15,
    usedVacationDays: 5,
  },
  {
    id: "user-002",
    tenantId: "tenant-001",
    name: "Ana Rodriguez",
    email: "ana@lineaspereiranas.com",
    avatar: "/avatars/ana.jpg",
    role: "accountant",
    roleId: "role-accountant",
    department: "Contabilidad",
    position: "Contadora",
    salary: 4500000,
    hireDate: "2021-06-01",
    status: "active",
    twoFactorEnabled: false,
    vacationDays: 15,
    usedVacationDays: 2,
  },
  {
    id: "user-003",
    tenantId: "tenant-001",
    name: "Carlos Gomez",
    email: "carlos@lineaspereiranas.com",
    role: "warehouse",
    roleId: "role-warehouse",
    department: "Almacen",
    position: "Jefe de Bodega",
    salary: 3200000,
    hireDate: "2022-01-10",
    status: "active",
    twoFactorEnabled: false,
    vacationDays: 15,
    usedVacationDays: 0,
  },
  // Tunin Sports
  {
    id: "user-004",
    tenantId: "tenant-002",
    name: "Paula Sanchez",
    email: "paula@tuninsports.com",
    avatar: "/avatars/paula.jpg",
    role: "admin",
    roleId: "role-admin",
    department: "Direccion",
    position: "Directora",
    salary: 7000000,
    hireDate: "2024-03-20",
    status: "active",
    twoFactorEnabled: true,
    vacationDays: 15,
    usedVacationDays: 0,
  },
  {
    id: "user-005",
    tenantId: "tenant-002",
    name: "Miguel Torres",
    email: "miguel@tuninsports.com",
    role: "sales",
    roleId: "role-sales",
    department: "Ventas",
    position: "Vendedor",
    salary: 2800000,
    hireDate: "2024-04-15",
    status: "active",
    twoFactorEnabled: false,
    vacationDays: 15,
    usedVacationDays: 0,
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
      settings: { view: true, create: true, edit: true, delete: true, export: true },
      roles: { view: true, create: true, edit: true, delete: true, export: true },
      crm: { view: true, create: true, edit: true, delete: true, export: true },
      procurement: { view: true, create: true, edit: true, delete: true, export: true },
      documents: { view: true, create: true, edit: true, delete: true, export: true },
      security: { view: true, create: true, edit: true, delete: true, export: true },
      attendance: { view: true, create: true, edit: true, delete: true, export: true },
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
      settings: { view: false, create: false, edit: false, delete: false, export: false },
      roles: { view: false, create: false, edit: false, delete: false, export: false },
      crm: { view: false, create: false, edit: false, delete: false, export: false },
      procurement: { view: true, create: true, edit: true, delete: true, export: true },
      documents: { view: true, create: true, edit: true, delete: false, export: true },
      security: { view: false, create: false, edit: false, delete: false, export: false },
      attendance: { view: true, create: true, edit: false, delete: false, export: true },
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
      settings: { view: false, create: false, edit: false, delete: false, export: false },
      roles: { view: false, create: false, edit: false, delete: false, export: false },
      crm: { view: false, create: false, edit: false, delete: false, export: false },
      procurement: { view: true, create: true, edit: true, delete: false, export: false },
      documents: { view: false, create: false, edit: false, delete: false, export: false },
      security: { view: false, create: false, edit: false, delete: false, export: false },
      attendance: { view: true, create: true, edit: false, delete: false, export: false },
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
      settings: { view: false, create: false, edit: false, delete: false, export: false },
      roles: { view: false, create: false, edit: false, delete: false, export: false },
      crm: { view: true, create: true, edit: true, delete: false, export: false },
      procurement: { view: false, create: false, edit: false, delete: false, export: false },
      documents: { view: true, create: true, edit: false, delete: false, export: false },
      security: { view: false, create: false, edit: false, delete: false, export: false },
      attendance: { view: true, create: true, edit: false, delete: false, export: false },
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
  addUser: (user: Omit<User, "id">) => void
  updateUser: (userId: string, updates: Partial<User>) => void
  deleteUser: (userId: string) => void
}

const TenantContext = createContext<TenantContextType | undefined>(undefined)

export function TenantProvider({ children }: { children: ReactNode }) {
  const [tenants, setTenants] = useState<Tenant[]>(DEMO_TENANTS)
  const [users, setUsers] = useState<User[]>(DEMO_USERS)
  const [roles, setRoles] = useState<CustomRole[]>(DEFAULT_ROLES)

  // Default to first user/tenant for Demo purposes if no session
  const [currentTenant, setCurrentTenant] = useState<Tenant | null>(DEMO_TENANTS[0])
  const [currentUser, setCurrentUser] = useState<User | null>(DEMO_USERS[0])

  const currentRole = currentUser ? roles.find((r) => r.id === currentUser.roleId) || null : null

  // Restore session from token
  useEffect(() => {
    const restoreSession = async () => {
      const token = localStorage.getItem("token")
      if (!token) return

      try {
        // Fetch User Details
        const userRes = await fetch("http://localhost:8000/usuarios/me", {
          headers: { Authorization: `Bearer ${token}` },
        })
        if (!userRes.ok) throw new Error("Sesión expirada")
        const userData = await userRes.json()

        // Fetch Tenant Details
        const tenantRes = await fetch(`http://localhost:8000/inquilinos/${userData.inquilino_id}`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        if (!tenantRes.ok) throw new Error("Error empresa")
        const tenantData = await tenantRes.json()

        // Map Backend -> Frontend Types (Duplicate logic, ideally refactor to function but inline is fine for now)
        const mappedUser: User = {
          id: userData.id,
          tenantId: userData.inquilino_id,
          name: userData.nombre,
          email: userData.email,
          role: userData.rol,
          roleId: "role-admin",
          department: userData.departamento || "General",
          position: userData.puesto || "Empleado",
          salary: userData.salario || 0,
          hireDate: userData.fecha_contratacion || new Date().toISOString(),
          status: userData.estado === "activo" ? "active" : "inactive",
          avatar: userData.avatar || "/placeholder.jpg",
          twoFactorEnabled: false,
          vacationDays: userData.dias_vacaciones || 0,
          usedVacationDays: 0,
        }

        const mappedTenant: Tenant = {
          id: tenantData.id,
          name: tenantData.nombre,
          slug: tenantData.slug,
          plan: tenantData.plan as any,
          status: tenantData.estado === "activo" ? "active" : "suspended",
          createdAt: tenantData.fecha_creacion,
          maxUsers: 100,
          features: [],
          settings: tenantData.configuracion || {
            currency: "COP",
            timezone: "America/Bogota",
            language: "es",
            fiscalYearStart: "01-01",
            allowCustomRoles: true,
            modules: [],
          }
        }

        setCurrentUser(mappedUser)
        setCurrentTenant(mappedTenant)
      } catch (error) {
        console.error("Session restore failed", error)
        localStorage.removeItem("token")
        localStorage.removeItem("nuux_session")
      }
    }

    restoreSession()
  }, [])

  const login = async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    try {
      const formData = new FormData()
      formData.append("username", email)
      formData.append("password", password)

      const res = await fetch("http://localhost:8000/token", {
        method: "POST",
        body: formData,
      })

      if (!res.ok) {
        const err = await res.json()
        return { success: false, error: err.detail || "Error al iniciar sesión" }
      }

      // Backend now returns everything in one go!
      const data = await res.json()
      const token = data.access_token
      const userData = data.usuario
      const tenantData = data.inquilino

      localStorage.setItem("token", token)

      // Map Backend -> Frontend Types
      const mappedUser: User = {
        id: userData.id,
        tenantId: userData.inquilino_id,
        name: userData.nombre,
        email: userData.email,
        role: userData.rol,
        roleId: "role-admin",
        department: userData.departamento || "General",
        position: userData.puesto || "Empleado",
        salary: userData.salario || 0,
        hireDate: userData.fecha_contratacion || new Date().toISOString(),
        status: userData.estado === "activo" ? "active" : "inactive",
        avatar: userData.avatar || "/placeholder.jpg",
        twoFactorEnabled: false,
        vacationDays: userData.dias_vacaciones || 0,
        usedVacationDays: 0,
      }

      const mappedTenant: Tenant = {
        id: tenantData.id,
        name: tenantData.nombre,
        slug: tenantData.slug,
        plan: tenantData.plan as any,
        status: tenantData.estado === "activo" ? "active" : "suspended",
        createdAt: tenantData.fecha_creacion,
        maxUsers: 100,
        features: [],
        settings: { // Backend might not send settings yet, use defaults
          currency: "COP",
          timezone: "America/Bogota",
          language: "es",
          fiscalYearStart: "01-01",
          allowCustomRoles: true,
          modules: [],
        }
      }

      setCurrentUser(mappedUser)
      setCurrentTenant(mappedTenant)

      // Save session
      localStorage.setItem("nuux_session", JSON.stringify({ tenantId: mappedTenant.id, userId: mappedUser.id }))

      return { success: true }
    } catch (error: any) {
      console.error("Login error:", error)
      return { success: false, error: error.message || "Error de conexión" }
    }
  }

  const logout = () => {
    // 1. Clear local session immediately
    setCurrentUser(null)
    setCurrentTenant(null)
    localStorage.removeItem("nuux_session")
    localStorage.removeItem("token")

    // 2. Notify backend (Fire and forget, don't await)
    fetch("http://localhost:8000/logout", { method: "POST" }).catch(e =>
      console.error("Logout background error", e)
    )

    // 3. Force redirect to ensure clean state
    window.location.href = "/login"
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

  const addUser = (user: Omit<User, "id">) => {
    const newUser: User = {
      ...user,
      id: `user-${Date.now()}`,
    }
    setUsers(prev => [...prev, newUser])
  }

  const updateUser = (userId: string, updates: Partial<User>) => {
    setUsers(prev => prev.map(u => u.id === userId ? { ...u, ...updates } : u))
  }

  const deleteUser = (userId: string) => {
    setUsers(prev => prev.filter(u => u.id !== userId))
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
        addUser,
        updateUser,
        deleteUser,
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
