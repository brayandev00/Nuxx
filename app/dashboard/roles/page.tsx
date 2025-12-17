"use client"

import { useState } from "react"
import { Header } from "@/components/header"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import {
  Plus,
  Shield,
  Users,
  Search,
  MoreVertical,
  Copy,
  Trash2,
  Check,
  AlertTriangle,
  Lock,
  Building2,
  Eye,
  PenLine,
  Trash,
  Download,
  UserPlus,
  ChevronRight,
  Sparkles,
  Info,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { defaultRoles, usersWithRoles, currentTenant } from "@/lib/roles-data"
import type { CustomRole, RolePermissions, ModulePermissions } from "@/lib/types"
import { SYSTEM_MODULES, PERMISSION_ACTIONS } from "@/lib/types"

// Role color options
const roleColors = [
  { name: "Verde", value: "#10B981" },
  { name: "Azul", value: "#3B82F6" },
  { name: "Amarillo", value: "#F59E0B" },
  { name: "Rosa", value: "#EC4899" },
  { name: "Morado", value: "#8B5CF6" },
  { name: "Rojo", value: "#EF4444" },
  { name: "Cyan", value: "#06B6D4" },
  { name: "Gris", value: "#6B7280" },
]

// Create empty permissions
const createEmptyPermissions = (): RolePermissions => ({
  dashboard: { view: false, create: false, edit: false, delete: false, export: false },
  projects: { view: false, create: false, edit: false, delete: false, export: false },
  analytics: { view: false, create: false, edit: false, delete: false, export: false },
  team: { view: false, create: false, edit: false, delete: false, export: false },
  inventory: { view: false, create: false, edit: false, delete: false, export: false },
  finance: { view: false, create: false, edit: false, delete: false, export: false },
  payroll: { view: false, create: false, edit: false, delete: false, export: false },
  settings: { view: false, create: false, edit: false, delete: false, export: false },
  roles: { view: false, create: false, edit: false, delete: false, export: false },
})

export default function RolesPage() {
  const [roles, setRoles] = useState<CustomRole[]>(defaultRoles)
  const [selectedRole, setSelectedRole] = useState<CustomRole | null>(roles[0])
  const [isCreating, setIsCreating] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [roleToDelete, setRoleToDelete] = useState<CustomRole | null>(null)
  const [assignUserDialogOpen, setAssignUserDialogOpen] = useState(false)

  // New role form state
  const [newRoleName, setNewRoleName] = useState("")
  const [newRoleDescription, setNewRoleDescription] = useState("")
  const [newRoleColor, setNewRoleColor] = useState("#10B981")
  const [newRolePermissions, setNewRolePermissions] = useState<RolePermissions>(createEmptyPermissions())

  // Filter roles by search
  const filteredRoles = roles.filter(
    (role) =>
      role.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      role.description.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  // Get users for a role
  const getUsersForRole = (roleId: string) => {
    return usersWithRoles.filter((user) => user.roleId === roleId)
  }

  // Count total permissions
  const countPermissions = (permissions: RolePermissions): number => {
    return Object.values(permissions).reduce((total, module) => {
      return total + Object.values(module).filter(Boolean).length
    }, 0)
  }

  // Handle permission toggle
  const handlePermissionToggle = (
    moduleId: keyof RolePermissions,
    action: keyof ModulePermissions,
    isNewRole = false,
  ) => {
    if (isNewRole) {
      setNewRolePermissions((prev) => {
        const currentModulePerms = prev[moduleId] || { view: false, create: false, edit: false, delete: false, export: false }
        return {
          ...prev,
          [moduleId]: {
            ...currentModulePerms,
            [action]: !currentModulePerms[action],
          },
        }
      })
    } else if (selectedRole && !selectedRole.isSystem) {
      const currentModulePerms = selectedRole.permissions[moduleId] || {
        view: false,
        create: false,
        edit: false,
        delete: false,
        export: false,
      }
      const updatedRole = {
        ...selectedRole,
        permissions: {
          ...selectedRole.permissions,
          [moduleId]: {
            ...currentModulePerms,
            [action]: !currentModulePerms[action],
          },
        },
        updatedAt: new Date().toISOString().split("T")[0],
      }
      setSelectedRole(updatedRole)
      setRoles((prev) => prev.map((r) => (r.id === updatedRole.id ? updatedRole : r)))
    }
  }

  // Toggle all permissions for a module
  const handleModuleToggleAll = (moduleId: keyof RolePermissions, isNewRole = false) => {
    const permissions = isNewRole ? newRolePermissions : selectedRole?.permissions
    if (!permissions) return

    const modulePerms = permissions[moduleId]
    const allEnabled = Object.values(modulePerms).every(Boolean)

    if (isNewRole) {
      setNewRolePermissions((prev) => ({
        ...prev,
        [moduleId]: {
          view: !allEnabled,
          create: !allEnabled,
          edit: !allEnabled,
          delete: !allEnabled,
          export: !allEnabled,
        },
      }))
    } else if (selectedRole && !selectedRole.isSystem) {
      const updatedRole = {
        ...selectedRole,
        permissions: {
          ...selectedRole.permissions,
          [moduleId]: {
            view: !allEnabled,
            create: !allEnabled,
            edit: !allEnabled,
            delete: !allEnabled,
            export: !allEnabled,
          },
        },
        updatedAt: new Date().toISOString().split("T")[0],
      }
      setSelectedRole(updatedRole)
      setRoles((prev) => prev.map((r) => (r.id === updatedRole.id ? updatedRole : r)))
    }
  }

  // Create new role
  const handleCreateRole = () => {
    if (!newRoleName.trim()) return

    const newRole: CustomRole = {
      id: `role-${Date.now()}`,
      tenantId: currentTenant.id,
      name: newRoleName,
      description: newRoleDescription,
      color: newRoleColor,
      icon: "Shield",
      isSystem: false,
      isDefault: false,
      permissions: newRolePermissions,
      createdAt: new Date().toISOString().split("T")[0],
      createdBy: "user-001",
      updatedAt: new Date().toISOString().split("T")[0],
    }

    setRoles((prev) => [...prev, newRole])
    setSelectedRole(newRole)
    setIsCreating(false)
    resetNewRoleForm()
  }

  // Reset new role form
  const resetNewRoleForm = () => {
    setNewRoleName("")
    setNewRoleDescription("")
    setNewRoleColor("#10B981")
    setNewRolePermissions(createEmptyPermissions())
  }

  // Duplicate role
  const handleDuplicateRole = (role: CustomRole) => {
    const duplicatedRole: CustomRole = {
      ...role,
      id: `role-${Date.now()}`,
      name: `${role.name} (Copia)`,
      isSystem: false,
      isDefault: false,
      createdAt: new Date().toISOString().split("T")[0],
      createdBy: "user-001",
      updatedAt: new Date().toISOString().split("T")[0],
    }
    setRoles((prev) => [...prev, duplicatedRole])
    setSelectedRole(duplicatedRole)
  }

  // Delete role
  const handleDeleteRole = () => {
    if (!roleToDelete) return
    setRoles((prev) => prev.filter((r) => r.id !== roleToDelete.id))
    if (selectedRole?.id === roleToDelete.id) {
      setSelectedRole(roles.find((r) => r.id !== roleToDelete.id) || null)
    }
    setDeleteDialogOpen(false)
    setRoleToDelete(null)
  }

  // Render permissions matrix
  const renderPermissionsMatrix = (permissions: RolePermissions, isEditable: boolean, isNewRole = false) => (
    <div className="space-y-1">
      {/* Header */}
      <div className="grid grid-cols-[200px_repeat(5,1fr)] gap-2 px-4 py-3 bg-secondary/50 rounded-lg mb-2">
        <div className="text-sm font-semibold text-foreground">Modulo</div>
        {PERMISSION_ACTIONS.map((action) => (
          <div key={action.id} className="text-center">
            <div className="text-xs font-medium text-muted-foreground">{action.name}</div>
          </div>
        ))}
      </div>

      {/* Rows */}
      <div className="space-y-1">
        {SYSTEM_MODULES.map((module) => {
          const modulePerms = permissions[module.id as keyof RolePermissions]
          const allEnabled = modulePerms && Object.values(modulePerms).every(Boolean)
          const someEnabled = modulePerms && Object.values(modulePerms).some(Boolean)

          return (
            <div
              key={module.id}
              className={cn(
                "grid grid-cols-[200px_repeat(5,1fr)] gap-2 px-4 py-3 rounded-lg transition-colors",
                someEnabled ? "bg-primary/5 border border-primary/20" : "bg-card border border-border",
              )}
            >
              <div className="flex items-center gap-3">
                <button
                  onClick={() => isEditable && handleModuleToggleAll(module.id as keyof RolePermissions, isNewRole)}
                  disabled={!isEditable}
                  className={cn(
                    "w-5 h-5 rounded border-2 flex items-center justify-center transition-colors",
                    allEnabled
                      ? "bg-primary border-primary"
                      : someEnabled
                        ? "bg-primary/30 border-primary"
                        : "border-muted-foreground/30",
                    isEditable && "cursor-pointer hover:border-primary",
                  )}
                >
                  {allEnabled && <Check className="w-3 h-3 text-primary-foreground" />}
                  {someEnabled && !allEnabled && <div className="w-2 h-2 bg-primary rounded-sm" />}
                </button>
                <div>
                  <div className="text-sm font-medium text-foreground">{module.name}</div>
                  <div className="text-xs text-muted-foreground">{module.description}</div>
                </div>
              </div>

              {PERMISSION_ACTIONS.map((action) => {
                const isChecked = modulePerms?.[action.id as keyof ModulePermissions] || false
                return (
                  <div key={action.id} className="flex items-center justify-center">
                    <Checkbox
                      checked={isChecked}
                      disabled={!isEditable}
                      onCheckedChange={() =>
                        handlePermissionToggle(
                          module.id as keyof RolePermissions,
                          action.id as keyof ModulePermissions,
                          isNewRole,
                        )
                      }
                      className={cn(
                        "w-5 h-5 rounded border-2",
                        isChecked ? "bg-primary border-primary" : "border-muted-foreground/30",
                        isEditable && "cursor-pointer",
                      )}
                    />
                  </div>
                )
              })}
            </div>
          )
        })}
      </div>
    </div>
  )

  return (
    <>
      <Header title="Roles y Permisos" subtitle="Gestiona los niveles de acceso de tu equipo" />

      <main className="flex-1 p-8 overflow-auto">
        {/* Tenant Info Banner */}
        <Card className="bg-gradient-to-r from-primary/10 via-primary/5 to-transparent border-primary/20 mb-6">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center">
                  <Building2 className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold text-foreground">{currentTenant.name}</h3>
                    <Badge className="bg-primary/20 text-primary border-0">{currentTenant.plan}</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Sistema Multi-tenant - {roles.length} roles configurados - {usersWithRoles.length} usuarios activos
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Sparkles className="w-4 h-4 text-primary" />
                <span>Roles personalizados habilitados</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-12 gap-6">
          {/* Roles Panel - Left Side */}
          <div className="col-span-4">
            <Card className="bg-card border-border h-full">
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Shield className="w-5 h-5 text-primary" />
                      Roles
                    </CardTitle>
                    <CardDescription>{roles.length} roles en el sistema</CardDescription>
                  </div>
                  <Dialog open={isCreating} onOpenChange={setIsCreating}>
                    <DialogTrigger asChild>
                      <Button className="bg-primary hover:bg-primary/90 text-primary-foreground neon-glow">
                        <Plus className="w-4 h-4 mr-2" />
                        Crear Rol
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden bg-card border-border">
                      <DialogHeader>
                        <DialogTitle className="flex items-center gap-2">
                          <div
                            className="w-8 h-8 rounded-lg flex items-center justify-center"
                            style={{ backgroundColor: `${newRoleColor}20` }}
                          >
                            <Shield className="w-4 h-4" style={{ color: newRoleColor }} />
                          </div>
                          Crear Nuevo Rol
                        </DialogTitle>
                        <DialogDescription>
                          Define un rol personalizado con permisos especificos para tu organizacion
                        </DialogDescription>
                      </DialogHeader>

                      <div className="space-y-6 py-4 max-h-[60vh] overflow-y-auto">
                        {/* Basic Info */}
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="roleName">Nombre del Rol *</Label>
                            <Input
                              id="roleName"
                              placeholder="Ej: Encargado de Almacen"
                              value={newRoleName}
                              onChange={(e) => setNewRoleName(e.target.value)}
                              className="bg-secondary border-border"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label>Color del Rol</Label>
                            <div className="flex gap-2">
                              {roleColors.map((color) => (
                                <button
                                  key={color.value}
                                  onClick={() => setNewRoleColor(color.value)}
                                  className={cn(
                                    "w-8 h-8 rounded-full transition-all",
                                    newRoleColor === color.value && "ring-2 ring-offset-2 ring-offset-card",
                                  )}
                                  style={{
                                    backgroundColor: color.value,
                                    ringColor: color.value,
                                  }}
                                  title={color.name}
                                />
                              ))}
                            </div>
                          </div>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="roleDesc">Descripcion</Label>
                          <Textarea
                            id="roleDesc"
                            placeholder="Describe las responsabilidades y alcance de este rol..."
                            value={newRoleDescription}
                            onChange={(e) => setNewRoleDescription(e.target.value)}
                            className="bg-secondary border-border resize-none"
                            rows={2}
                          />
                        </div>

                        {/* Permissions Matrix */}
                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <Label className="text-base">Matriz de Permisos</Label>
                            <div className="flex items-center gap-4 text-xs text-muted-foreground">
                              <div className="flex items-center gap-1">
                                <Eye className="w-3 h-3" /> Ver
                              </div>
                              <div className="flex items-center gap-1">
                                <Plus className="w-3 h-3" /> Crear
                              </div>
                              <div className="flex items-center gap-1">
                                <PenLine className="w-3 h-3" /> Editar
                              </div>
                              <div className="flex items-center gap-1">
                                <Trash className="w-3 h-3" /> Eliminar
                              </div>
                              <div className="flex items-center gap-1">
                                <Download className="w-3 h-3" /> Exportar
                              </div>
                            </div>
                          </div>
                          {renderPermissionsMatrix(newRolePermissions, true, true)}
                        </div>
                      </div>

                      <DialogFooter>
                        <Button
                          variant="outline"
                          onClick={() => {
                            setIsCreating(false)
                            resetNewRoleForm()
                          }}
                        >
                          Cancelar
                        </Button>
                        <Button
                          onClick={handleCreateRole}
                          disabled={!newRoleName.trim()}
                          className="bg-primary hover:bg-primary/90 text-primary-foreground"
                        >
                          <Plus className="w-4 h-4 mr-2" />
                          Crear Rol
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </div>

                {/* Search */}
                <div className="relative mt-4">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    placeholder="Buscar roles..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 bg-secondary border-border"
                  />
                </div>
              </CardHeader>

              <CardContent className="pt-0">
                <ScrollArea className="h-[500px] pr-4">
                  <div className="space-y-2">
                    {filteredRoles.map((role) => {
                      const users = getUsersForRole(role.id)
                      const permCount = countPermissions(role.permissions)
                      const isSelected = selectedRole?.id === role.id

                      return (
                        <div
                          key={role.id}
                          onClick={() => setSelectedRole(role)}
                          className={cn(
                            "p-4 rounded-xl border cursor-pointer transition-all",
                            isSelected
                              ? "bg-primary/10 border-primary/50"
                              : "bg-secondary/30 border-border hover:bg-secondary/50 hover:border-primary/30",
                          )}
                        >
                          <div className="flex items-start justify-between">
                            <div className="flex items-start gap-3">
                              <div
                                className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
                                style={{ backgroundColor: `${role.color}20` }}
                              >
                                <Shield className="w-5 h-5" style={{ color: role.color }} />
                              </div>
                              <div className="min-w-0">
                                <div className="flex items-center gap-2">
                                  <h4 className="font-medium text-foreground truncate">{role.name}</h4>
                                  {role.isSystem && <Lock className="w-3 h-3 text-muted-foreground flex-shrink-0" />}
                                  {role.isDefault && (
                                    <Badge variant="outline" className="text-xs border-primary/30 text-primary">
                                      Default
                                    </Badge>
                                  )}
                                </div>
                                <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">{role.description}</p>
                                <div className="flex items-center gap-3 mt-2">
                                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                                    <Users className="w-3 h-3" />
                                    {users.length} usuarios
                                  </div>
                                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                                    <Shield className="w-3 h-3" />
                                    {permCount} permisos
                                  </div>
                                </div>
                              </div>
                            </div>

                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-8 w-8 flex-shrink-0"
                                  onClick={(e) => e.stopPropagation()}
                                >
                                  <MoreVertical className="w-4 h-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end" className="bg-card border-border">
                                <DropdownMenuItem onClick={() => handleDuplicateRole(role)}>
                                  <Copy className="w-4 h-4 mr-2" />
                                  Duplicar
                                </DropdownMenuItem>
                                {!role.isSystem && (
                                  <>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem
                                      onClick={() => {
                                        setRoleToDelete(role)
                                        setDeleteDialogOpen(true)
                                      }}
                                      className="text-destructive focus:text-destructive"
                                    >
                                      <Trash2 className="w-4 h-4 mr-2" />
                                      Eliminar
                                    </DropdownMenuItem>
                                  </>
                                )}
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          </div>

          {/* Role Configuration Panel - Right Side */}
          <div className="col-span-8">
            {selectedRole ? (
              <Card className="bg-card border-border">
                <CardHeader className="pb-4">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-4">
                      <div
                        className="w-14 h-14 rounded-xl flex items-center justify-center"
                        style={{ backgroundColor: `${selectedRole.color}20` }}
                      >
                        <Shield className="w-7 h-7" style={{ color: selectedRole.color }} />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <CardTitle className="text-xl">{selectedRole.name}</CardTitle>
                          {selectedRole.isSystem && (
                            <Badge variant="outline" className="border-muted-foreground/30">
                              <Lock className="w-3 h-3 mr-1" />
                              Sistema
                            </Badge>
                          )}
                        </div>
                        <CardDescription className="mt-1">{selectedRole.description}</CardDescription>
                        <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                          <span>Creado: {selectedRole.createdAt}</span>
                          <span>Actualizado: {selectedRole.updatedAt}</span>
                        </div>
                      </div>
                    </div>

                    {!selectedRole.isSystem && (
                      <div className="flex items-center gap-2">
                        <Button variant="outline" size="sm" onClick={() => handleDuplicateRole(selectedRole)}>
                          <Copy className="w-4 h-4 mr-2" />
                          Duplicar
                        </Button>
                      </div>
                    )}
                  </div>
                </CardHeader>

                <CardContent>
                  <Tabs defaultValue="permissions" className="w-full">
                    <TabsList className="bg-secondary/50 mb-6">
                      <TabsTrigger
                        value="permissions"
                        className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
                      >
                        <Shield className="w-4 h-4 mr-2" />
                        Permisos
                      </TabsTrigger>
                      <TabsTrigger
                        value="users"
                        className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
                      >
                        <Users className="w-4 h-4 mr-2" />
                        Usuarios ({getUsersForRole(selectedRole.id).length})
                      </TabsTrigger>
                      <TabsTrigger
                        value="audit"
                        className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
                      >
                        <Info className="w-4 h-4 mr-2" />
                        Auditoria
                      </TabsTrigger>
                    </TabsList>

                    <TabsContent value="permissions" className="mt-0">
                      {selectedRole.isSystem && (
                        <div className="flex items-center gap-2 p-3 bg-amber-500/10 border border-amber-500/20 rounded-lg mb-4">
                          <AlertTriangle className="w-4 h-4 text-amber-500" />
                          <span className="text-sm text-amber-500">
                            Los roles del sistema no pueden ser modificados. Puedes duplicarlo para crear una version
                            personalizada.
                          </span>
                        </div>
                      )}
                      {renderPermissionsMatrix(selectedRole.permissions, !selectedRole.isSystem)}
                    </TabsContent>

                    <TabsContent value="users" className="mt-0">
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <p className="text-sm text-muted-foreground">Usuarios con el rol de {selectedRole.name}</p>
                          <Dialog open={assignUserDialogOpen} onOpenChange={setAssignUserDialogOpen}>
                            <DialogTrigger asChild>
                              <Button variant="outline" size="sm">
                                <UserPlus className="w-4 h-4 mr-2" />
                                Asignar Usuario
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="bg-card border-border">
                              <DialogHeader>
                                <DialogTitle>Asignar Usuario a {selectedRole.name}</DialogTitle>
                                <DialogDescription>Selecciona un empleado para asignarle este rol</DialogDescription>
                              </DialogHeader>
                              <div className="space-y-4 py-4">
                                <div className="space-y-2">
                                  <Label>Seleccionar Empleado</Label>
                                  <Select>
                                    <SelectTrigger className="bg-secondary border-border">
                                      <SelectValue placeholder="Buscar empleado..." />
                                    </SelectTrigger>
                                    <SelectContent className="bg-card border-border">
                                      {usersWithRoles
                                        .filter((u) => u.roleId !== selectedRole.id)
                                        .map((user) => (
                                          <SelectItem key={user.id} value={user.id}>
                                            <div className="flex items-center gap-2">
                                              <Avatar className="w-6 h-6">
                                                <AvatarImage src={user.avatar || "/placeholder.svg"} />
                                                <AvatarFallback className="text-xs">
                                                  {user.name.charAt(0)}
                                                </AvatarFallback>
                                              </Avatar>
                                              {user.name}
                                            </div>
                                          </SelectItem>
                                        ))}
                                    </SelectContent>
                                  </Select>
                                </div>
                              </div>
                              <DialogFooter>
                                <Button variant="outline" onClick={() => setAssignUserDialogOpen(false)}>
                                  Cancelar
                                </Button>
                                <Button className="bg-primary hover:bg-primary/90">Asignar Rol</Button>
                              </DialogFooter>
                            </DialogContent>
                          </Dialog>
                        </div>

                        <div className="space-y-2">
                          {getUsersForRole(selectedRole.id).map((user) => (
                            <div
                              key={user.id}
                              className="flex items-center justify-between p-4 bg-secondary/30 rounded-xl border border-border"
                            >
                              <div className="flex items-center gap-3">
                                <Avatar
                                  className="w-10 h-10 border-2"
                                  style={{ borderColor: `${selectedRole.color}50` }}
                                >
                                  <AvatarImage src={user.avatar || "/placeholder.svg"} />
                                  <AvatarFallback className="bg-primary/20 text-primary">
                                    {user.name.charAt(0)}
                                  </AvatarFallback>
                                </Avatar>
                                <div>
                                  <div className="font-medium text-foreground">{user.name}</div>
                                  <div className="text-xs text-muted-foreground">
                                    {user.position} - {user.department}
                                  </div>
                                </div>
                              </div>
                              <div className="flex items-center gap-4">
                                <div className="text-right text-xs text-muted-foreground">
                                  <div>Ultimo acceso</div>
                                  <div>{user.lastLogin ? new Date(user.lastLogin).toLocaleDateString() : "Nunca"}</div>
                                </div>
                                <ChevronRight className="w-4 h-4 text-muted-foreground" />
                              </div>
                            </div>
                          ))}

                          {getUsersForRole(selectedRole.id).length === 0 && (
                            <div className="text-center py-8 text-muted-foreground">
                              <Users className="w-12 h-12 mx-auto mb-3 opacity-20" />
                              <p>No hay usuarios con este rol</p>
                              <Button
                                variant="link"
                                className="text-primary mt-2"
                                onClick={() => setAssignUserDialogOpen(true)}
                              >
                                Asignar primer usuario
                              </Button>
                            </div>
                          )}
                        </div>
                      </div>
                    </TabsContent>

                    <TabsContent value="audit" className="mt-0">
                      <div className="space-y-4">
                        <div className="p-4 bg-secondary/30 rounded-xl border border-border">
                          <h4 className="font-medium text-foreground mb-3">Historial de Cambios</h4>
                          <div className="space-y-3">
                            <div className="flex items-center gap-3 text-sm">
                              <div className="w-2 h-2 rounded-full bg-primary" />
                              <span className="text-muted-foreground">Rol creado el {selectedRole.createdAt}</span>
                            </div>
                            {selectedRole.updatedAt !== selectedRole.createdAt && (
                              <div className="flex items-center gap-3 text-sm">
                                <div className="w-2 h-2 rounded-full bg-amber-500" />
                                <span className="text-muted-foreground">
                                  Ultima modificacion el {selectedRole.updatedAt}
                                </span>
                              </div>
                            )}
                          </div>
                        </div>

                        <div className="p-4 bg-secondary/30 rounded-xl border border-border">
                          <h4 className="font-medium text-foreground mb-3">Estadisticas de Uso</h4>
                          <div className="grid grid-cols-3 gap-4">
                            <div className="text-center p-3 bg-card rounded-lg">
                              <div className="text-2xl font-bold text-primary">
                                {getUsersForRole(selectedRole.id).length}
                              </div>
                              <div className="text-xs text-muted-foreground">Usuarios</div>
                            </div>
                            <div className="text-center p-3 bg-card rounded-lg">
                              <div className="text-2xl font-bold text-primary">
                                {countPermissions(selectedRole.permissions)}
                              </div>
                              <div className="text-xs text-muted-foreground">Permisos</div>
                            </div>
                            <div className="text-center p-3 bg-card rounded-lg">
                              <div className="text-2xl font-bold text-primary">
                                {
                                  Object.values(selectedRole.permissions).filter((m) => Object.values(m).some(Boolean))
                                    .length
                                }
                              </div>
                              <div className="text-xs text-muted-foreground">Modulos</div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </TabsContent>
                  </Tabs>
                </CardContent>
              </Card>
            ) : (
              <Card className="bg-card border-border h-full flex items-center justify-center">
                <div className="text-center text-muted-foreground">
                  <Shield className="w-16 h-16 mx-auto mb-4 opacity-20" />
                  <p>Selecciona un rol para ver sus detalles</p>
                </div>
              </Card>
            )}
          </div>
        </div>
      </main>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent className="bg-card border-border">
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-destructive" />
              Eliminar Rol
            </AlertDialogTitle>
            <AlertDialogDescription>
              ¿Estas seguro de eliminar el rol "{roleToDelete?.name}"? Esta accion no se puede deshacer.
              {roleToDelete && getUsersForRole(roleToDelete.id).length > 0 && (
                <span className="block mt-2 text-amber-500">
                  Advertencia: Hay {getUsersForRole(roleToDelete.id).length} usuarios con este rol que seran reasignados
                  al rol por defecto.
                </span>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteRole} className="bg-destructive hover:bg-destructive/90">
              Eliminar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
