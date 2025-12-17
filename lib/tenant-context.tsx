"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import type { Tenant, User, CustomRole } from "./types"
import { apiClient } from "./api-client"
import { toast } from "sonner"

// Datos de ejemplo limitados solo para inicialización segura si falla todo (Fallback)
const FALLBACK_TENANT: Tenant = {
  id: "tenant-fallback",
  name: "Empresa Demo",
  slug: "empresa-demo",
  logo: undefined,
  plan: "starter",
  status: "active",
  createdAt: new Date().toISOString(),
  maxUsers: 5,
  features: [],
  settings: {
    currency: "COP",
    timezone: "America/Bogota",
    language: "es",
    fiscalYearStart: "01-01",
    allowCustomRoles: false,
    modules: ["dashboard"],
  },
}

interface AuthResponse {
  access_token: string
  token_type: string
  usuario: any
  inquilino: any
}

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
  uploadTenantLogo: (file: File) => Promise<boolean>
}

const TenantContext = createContext<TenantContextType | undefined>(undefined)

export function TenantProvider({ children }: { children: ReactNode }) {
  const [tenants, setTenants] = useState<Tenant[]>([])
  const [users, setUsers] = useState<User[]>([])
  const [roles, setRoles] = useState<CustomRole[]>([])

  const [currentTenant, setCurrentTenant] = useState<Tenant | null>(null)
  const [currentUser, setCurrentUser] = useState<User | null>(null)

  // Derived state
  const currentRole = currentUser && roles.length > 0
    ? roles.find((r) => r.id === currentUser.roleId) || null
    : null

  // Restore session from token
  useEffect(() => {
    const restoreSession = async () => {
      const token = localStorage.getItem("token")
      if (!token) return

      try {
        // 1. Get User Data
        const userData = await apiClient.get<any>("/usuarios/me")

        // 2. Get Tenant Data
        const tenantData = await apiClient.get<any>(`/inquilinos/${userData.inquilino_id}`)

        // Map Backend -> Frontend
        const mappedUser = mapUserFromBackend(userData)
        const mappedTenant = mapTenantFromBackend(tenantData)

        setCurrentUser(mappedUser)
        setCurrentTenant(mappedTenant)

        // Load metadata (Roles, etc)
        // In a real app we might fetch this from an API too
        // For now we keep using empty or minimal defaults until we implement those endpoints
      } catch (error) {
        console.error("Session restore failed", error)
        // apiClient handles redirect on 401, so we just clear local state here
        localStorage.removeItem("token")
        localStorage.removeItem("nuux_session")
      }
    }

    restoreSession()
  }, [])

  const mapUserFromBackend = (data: any): User => ({
    id: data.id,
    tenantId: data.inquilino_id,
    name: data.nombre,
    email: data.email,
    role: data.rol,
    roleId: "role-admin", // TODO: Map this correctly from backend if available
    department: data.departamento || "General",
    position: data.puesto || "Empleado",
    salary: data.salario || 0,
    hireDate: data.fecha_contratacion || new Date().toISOString(),
    status: data.estado === "activo" ? "active" : "inactive",
    avatar: data.avatar || "/placeholder.jpg",
    twoFactorEnabled: false,
    vacationDays: data.dias_vacaciones || 0,
    usedVacationDays: 0,
  })

  const mapTenantFromBackend = (data: any): Tenant => ({
    id: data.id,
    name: data.nombre,
    slug: data.slug,
    plan: data.plan as any,
    status: data.estado === "activo" ? "active" : "suspended",
    createdAt: data.fecha_creacion,
    maxUsers: 100,
    features: [],
    settings: data.configuracion || FALLBACK_TENANT.settings
  })

  const login = async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    try {
      const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000"

      const res = await fetch(`${API_URL}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ email, password }),
      })

      if (!res.ok) {
        const err = await res.json().catch(() => ({}))
        return { success: false, error: err.detail || "Credenciales inválidas" }
      }

      const data: AuthResponse = await res.json()

      localStorage.setItem("token", data.access_token)

      const mappedUser = mapUserFromBackend(data.usuario)
      const mappedTenant = mapTenantFromBackend(data.inquilino)

      setCurrentUser(mappedUser)
      setCurrentTenant(mappedTenant)

      localStorage.setItem("nuux_session", JSON.stringify({ tenantId: mappedTenant.id, userId: mappedUser.id }))
      toast.success(`Bienvenido, ${mappedUser.name}`)

      return { success: true }
    } catch (error: any) {
      console.error("Login error:", error)
      return { success: false, error: "Error de conexión con el servidor" }
    }
  }

  const logout = () => {
    // Optimistic logout
    setCurrentUser(null)
    setCurrentTenant(null)
    localStorage.removeItem("nuux_session")
    localStorage.removeItem("token")

    // Notify backend
    apiClient.post("/auth/logout").catch((e) => console.error("Logout error", e))

    window.location.href = "/login"
  }

  // Placeholder functions for compatibility until fully refactored
  const hasPermission = (module: string, action: string) => true // Allow all for now during dev

  const getTenantUsers = () => users
  const getTenantRoles = () => roles

  const updateTenant = async (updates: Partial<Tenant>) => {
    if (!currentTenant) return

    try {
      // Optimistic update
      const updatedTenant = { ...currentTenant, ...updates }
      setCurrentTenant(updatedTenant)

      // In real app: await apiClient.put(`/inquilinos/${currentTenant.id}`, updates)
      toast.success("Información actualizada")
    } catch (error) {
      console.error("Error updating tenant", error)
      toast.error("Error al actualizar la información")
      // Revert would go here
    }
  }
  const addRole = (role: any) => console.log("addRole not implemented", role)
  const updateRole = (id: string, updates: any) => console.log("updateRole not implemented", id, updates)
  const deleteRole = (id: string) => console.log("deleteRole not implemented", id)
  const addUser = (user: any) => console.log("addUser not implemented", user)
  const updateUser = (id: string, updates: any) => console.log("updateUser not implemented", id, updates)
  const deleteUser = (id: string) => console.log("deleteUser not implemented", id)

  const uploadTenantLogo = async (file: File) => {
    if (!currentTenant) return false

    try {
      const formData = new FormData()
      formData.append("logo", file)

      // Mock implementation for now as backend endpoint might vary
      // In real scenario: await apiClient.post(`/inquilinos/${currentTenant.id}/logo`, formData)

      // Simulate success and update local state
      const reader = new FileReader()
      reader.onload = (e) => {
        if (e.target?.result && currentTenant) {
          setCurrentTenant({
            ...currentTenant,
            logo: e.target.result as string
          })
        }
      }
      reader.readAsDataURL(file)

      toast.success("Logo actualizado correctamente")
      return true
    } catch (error) {
      console.error("Error uploading logo:", error)
      toast.error("Error al actualizar el logo")
      return false
    }
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
        uploadTenantLogo,
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
