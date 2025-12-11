"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Plus,
  Search,
  Key,
  Shield,
  Eye,
  EyeOff,
  Copy,
  Trash2,
  AlertTriangle,
  Clock,
  User,
  Activity,
  Settings,
  Palette,
  Globe,
  RefreshCw,
  Download,
  Filter,
  LogIn,
  LogOut,
  Edit,
  Package,
  DollarSign,
} from "lucide-react"
import type { AuditLog, ApiKey, WhiteLabelConfig } from "@/lib/types"
import { useTenant } from "@/lib/tenant-context"

const mockAuditLogs: AuditLog[] = [
  {
    id: "LOG-001",
    tenantId: "tenant-001",
    userId: "user-001",
    userName: "Carlos Martinez",
    action: "update",
    module: "inventory",
    entityType: "Product",
    entityId: "PRD-001",
    entityName: 'MacBook Pro 14"',
    previousValue: JSON.stringify({ price: 5000000 }),
    newValue: JSON.stringify({ price: 5299000 }),
    ipAddress: "192.168.1.100",
    userAgent: "Mozilla/5.0 Chrome/120.0",
    timestamp: "2024-12-10T15:30:00Z",
  },
  {
    id: "LOG-002",
    tenantId: "tenant-001",
    userId: "user-002",
    userName: "Maria Lopez",
    action: "create",
    module: "finance",
    entityType: "Invoice",
    entityId: "INV-127",
    entityName: "Factura F-2024-0127",
    ipAddress: "192.168.1.105",
    userAgent: "Mozilla/5.0 Safari/17.0",
    timestamp: "2024-12-10T14:22:00Z",
  },
  {
    id: "LOG-003",
    tenantId: "tenant-001",
    userId: "user-001",
    userName: "Carlos Martinez",
    action: "login",
    module: "auth",
    entityType: "Session",
    entityId: "SES-001",
    entityName: "Inicio de sesion",
    ipAddress: "192.168.1.100",
    userAgent: "Mozilla/5.0 Chrome/120.0",
    timestamp: "2024-12-10T09:00:00Z",
  },
  {
    id: "LOG-004",
    tenantId: "tenant-001",
    userId: "user-003",
    userName: "Ana Garcia",
    action: "delete",
    module: "team",
    entityType: "User",
    entityId: "USR-010",
    entityName: "Pedro Ramirez (ex-empleado)",
    ipAddress: "192.168.1.110",
    userAgent: "Mozilla/5.0 Firefox/121.0",
    timestamp: "2024-12-09T16:45:00Z",
  },
  {
    id: "LOG-005",
    tenantId: "tenant-001",
    userId: "user-001",
    userName: "Carlos Martinez",
    action: "export",
    module: "finance",
    entityType: "Report",
    entityId: "RPT-001",
    entityName: "Reporte Financiero Q4",
    ipAddress: "192.168.1.100",
    userAgent: "Mozilla/5.0 Chrome/120.0",
    timestamp: "2024-12-09T11:30:00Z",
  },
]

const mockApiKeys: ApiKey[] = [
  {
    id: "KEY-001",
    tenantId: "tenant-001",
    name: "Integracion Shopify",
    key: "nuux_live_sk_a1b2c3d4e5f6g7h8i9j0",
    permissions: ["inventory:read", "inventory:write", "orders:read"],
    lastUsedAt: "2024-12-10T14:00:00Z",
    createdBy: "user-001",
    createdAt: "2024-06-15",
    status: "active",
  },
  {
    id: "KEY-002",
    tenantId: "tenant-001",
    name: "Webhook Bancolombia",
    key: "nuux_live_sk_z9y8x7w6v5u4t3s2r1q0",
    permissions: ["finance:read", "finance:webhook"],
    lastUsedAt: "2024-12-10T10:30:00Z",
    createdBy: "user-001",
    createdAt: "2024-08-20",
    status: "active",
  },
  {
    id: "KEY-003",
    tenantId: "tenant-001",
    name: "Slack Notificaciones",
    key: "nuux_live_sk_m1n2o3p4q5r6s7t8u9v0",
    permissions: ["notifications:send"],
    createdBy: "user-002",
    createdAt: "2024-09-10",
    status: "revoked",
  },
]

export default function SecurityPage() {
  const { currentTenant } = useTenant()
  const [auditLogs] = useState(mockAuditLogs)
  const [apiKeys, setApiKeys] = useState(mockApiKeys)
  const [searchQuery, setSearchQuery] = useState("")
  const [showApiKey, setShowApiKey] = useState<string | null>(null)
  const [whiteLabelConfig, setWhiteLabelConfig] = useState<WhiteLabelConfig>({
    id: "WL-001",
    tenantId: "tenant-001",
    primaryColor: "#10B981",
    secondaryColor: "#18181B",
    accentColor: "#10B981",
    companyName: currentTenant?.name || "Mi Empresa",
    hideNuuxBranding: false,
  })

  const getActionIcon = (action: AuditLog["action"]) => {
    switch (action) {
      case "login":
        return <LogIn className="w-4 h-4 text-primary" />
      case "logout":
        return <LogOut className="w-4 h-4 text-zinc-500" />
      case "create":
        return <Plus className="w-4 h-4 text-primary" />
      case "update":
        return <Edit className="w-4 h-4 text-yellow-500" />
      case "delete":
        return <Trash2 className="w-4 h-4 text-red-500" />
      case "export":
        return <Download className="w-4 h-4 text-blue-500" />
      default:
        return <Activity className="w-4 h-4 text-zinc-500" />
    }
  }

  const getModuleIcon = (module: string) => {
    switch (module) {
      case "inventory":
        return <Package className="w-4 h-4" />
      case "finance":
        return <DollarSign className="w-4 h-4" />
      case "team":
        return <User className="w-4 h-4" />
      case "auth":
        return <Shield className="w-4 h-4" />
      default:
        return <Settings className="w-4 h-4" />
    }
  }

  const getActionBadge = (action: AuditLog["action"]) => {
    const colors: Record<string, string> = {
      login: "bg-primary/10 text-primary",
      logout: "bg-zinc-500/10 text-zinc-400",
      create: "bg-primary/10 text-primary",
      update: "bg-yellow-500/10 text-yellow-500",
      delete: "bg-red-500/10 text-red-500",
      export: "bg-blue-500/10 text-blue-500",
    }
    const labels: Record<string, string> = {
      login: "Inicio Sesion",
      logout: "Cerro Sesion",
      create: "Creo",
      update: "Modifico",
      delete: "Elimino",
      export: "Exporto",
    }
    return <Badge className={colors[action] || "bg-zinc-500/10 text-zinc-400"}>{labels[action] || action}</Badge>
  }

  const formatTimestamp = (ts: string) => {
    const date = new Date(ts)
    return date.toLocaleString("es-CO", {
      day: "2-digit",
      month: "short",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Seguridad y Configuracion</h1>
          <p className="text-zinc-500">Auditoria, API Keys y Marca Blanca</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4">
        <Card className="bg-[#18181B] border-[#27272A] p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary/10">
              <Activity className="w-5 h-5 text-primary" />
            </div>
            <div>
              <p className="text-xs text-zinc-500">Eventos Hoy</p>
              <p className="text-lg font-bold text-white">
                {auditLogs.filter((l) => l.timestamp.startsWith("2024-12-10")).length}
              </p>
            </div>
          </div>
        </Card>
        <Card className="bg-[#18181B] border-[#27272A] p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-yellow-500/10">
              <AlertTriangle className="w-5 h-5 text-yellow-500" />
            </div>
            <div>
              <p className="text-xs text-zinc-500">Acciones Criticas</p>
              <p className="text-lg font-bold text-white">{auditLogs.filter((l) => l.action === "delete").length}</p>
            </div>
          </div>
        </Card>
        <Card className="bg-[#18181B] border-[#27272A] p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-blue-500/10">
              <Key className="w-5 h-5 text-blue-500" />
            </div>
            <div>
              <p className="text-xs text-zinc-500">API Keys Activas</p>
              <p className="text-lg font-bold text-white">{apiKeys.filter((k) => k.status === "active").length}</p>
            </div>
          </div>
        </Card>
        <Card className="bg-[#18181B] border-[#27272A] p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary/10">
              <Shield className="w-5 h-5 text-primary" />
            </div>
            <div>
              <p className="text-xs text-zinc-500">Nivel Seguridad</p>
              <p className="text-lg font-bold text-primary">Alto</p>
            </div>
          </div>
        </Card>
      </div>

      <Tabs defaultValue="audit" className="space-y-4">
        <TabsList className="bg-[#18181B] border border-[#27272A]">
          <TabsTrigger value="audit">Bitacora de Auditoria</TabsTrigger>
          <TabsTrigger value="apikeys">API Keys</TabsTrigger>
          <TabsTrigger value="whitelabel">Marca Blanca</TabsTrigger>
        </TabsList>

        {/* Audit Log Tab */}
        <TabsContent value="audit" className="space-y-4">
          <div className="flex items-center gap-4">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
              <Input
                className="pl-10 bg-[#18181B] border-[#27272A]"
                placeholder="Buscar en bitacora..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Button variant="outline" className="border-[#27272A] text-zinc-400 bg-transparent">
              <Filter className="w-4 h-4 mr-2" />
              Filtros
            </Button>
            <Button variant="outline" className="border-[#27272A] text-zinc-400 bg-transparent">
              <Download className="w-4 h-4 mr-2" />
              Exportar
            </Button>
          </div>

          <Card className="bg-[#18181B] border-[#27272A]">
            <Table>
              <TableHeader>
                <TableRow className="border-[#27272A]">
                  <TableHead className="text-zinc-400">Fecha/Hora</TableHead>
                  <TableHead className="text-zinc-400">Usuario</TableHead>
                  <TableHead className="text-zinc-400">Accion</TableHead>
                  <TableHead className="text-zinc-400">Modulo</TableHead>
                  <TableHead className="text-zinc-400">Entidad</TableHead>
                  <TableHead className="text-zinc-400">IP</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {auditLogs.map((log) => (
                  <TableRow key={log.id} className="border-[#27272A]">
                    <TableCell className="text-zinc-400 text-sm">
                      <div className="flex items-center gap-2">
                        <Clock className="w-3 h-3" />
                        {formatTimestamp(log.timestamp)}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center">
                          <span className="text-primary text-xs">{log.userName.charAt(0)}</span>
                        </div>
                        <span className="text-white text-sm">{log.userName}</span>
                      </div>
                    </TableCell>
                    <TableCell>{getActionBadge(log.action)}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2 text-zinc-400">
                        {getModuleIcon(log.module)}
                        <span className="capitalize">{log.module}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-white text-sm">{log.entityName}</TableCell>
                    <TableCell className="font-mono text-xs text-zinc-500">{log.ipAddress}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Card>
        </TabsContent>

        {/* API Keys Tab */}
        <TabsContent value="apikeys" className="space-y-4">
          <div className="flex items-center justify-between">
            <p className="text-zinc-400">Gestiona las claves de API para integraciones externas</p>
            <Dialog>
              <DialogTrigger asChild>
                <Button className="bg-primary hover:bg-primary/90">
                  <Plus className="w-4 h-4 mr-2" />
                  Nueva API Key
                </Button>
              </DialogTrigger>
              <DialogContent className="bg-[#18181B] border-[#27272A]">
                <DialogHeader>
                  <DialogTitle className="text-white">Crear Nueva API Key</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label className="text-zinc-400">Nombre</Label>
                    <Input className="bg-[#09090B] border-[#27272A]" placeholder="Ej: Integracion Shopify" />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-zinc-400">Permisos</Label>
                    <div className="grid grid-cols-2 gap-2">
                      {["inventory:read", "inventory:write", "finance:read", "orders:read", "notifications:send"].map(
                        (perm) => (
                          <label key={perm} className="flex items-center gap-2 p-2 rounded bg-[#09090B]">
                            <input type="checkbox" className="rounded border-[#27272A]" />
                            <span className="text-sm text-zinc-400">{perm}</span>
                          </label>
                        ),
                      )}
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-zinc-400">Expiracion (opcional)</Label>
                    <Input type="date" className="bg-[#09090B] border-[#27272A]" />
                  </div>
                  <Button className="w-full bg-primary hover:bg-primary/90">Generar API Key</Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          <div className="grid gap-4">
            {apiKeys.map((key) => (
              <Card key={key.id} className="bg-[#18181B] border-[#27272A] p-5">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-4">
                    <div className={`p-3 rounded-xl ${key.status === "active" ? "bg-primary/10" : "bg-red-500/10"}`}>
                      <Key className={`w-5 h-5 ${key.status === "active" ? "text-primary" : "text-red-500"}`} />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold text-white">{key.name}</h3>
                        <Badge
                          className={
                            key.status === "active" ? "bg-primary/10 text-primary" : "bg-red-500/10 text-red-500"
                          }
                        >
                          {key.status === "active" ? "Activa" : "Revocada"}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-2 mt-2">
                        <code className="px-2 py-1 rounded bg-[#09090B] text-zinc-400 text-sm font-mono">
                          {showApiKey === key.id ? key.key : `${key.key.slice(0, 20)}...`}
                        </code>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => setShowApiKey(showApiKey === key.id ? null : key.id)}
                        >
                          {showApiKey === key.id ? (
                            <EyeOff className="w-4 h-4 text-zinc-500" />
                          ) : (
                            <Eye className="w-4 h-4 text-zinc-500" />
                          )}
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => copyToClipboard(key.key)}
                        >
                          <Copy className="w-4 h-4 text-zinc-500" />
                        </Button>
                      </div>
                      <div className="flex flex-wrap gap-1 mt-2">
                        {key.permissions.map((perm) => (
                          <Badge key={perm} variant="secondary" className="bg-[#27272A] text-zinc-400 text-xs">
                            {perm}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-zinc-500">Creada: {key.createdAt}</p>
                    {key.lastUsedAt && (
                      <p className="text-xs text-zinc-500">Ultimo uso: {formatTimestamp(key.lastUsedAt)}</p>
                    )}
                    {key.status === "active" && (
                      <Button
                        variant="ghost"
                        size="sm"
                        className="mt-2 text-red-500 hover:text-red-400 hover:bg-red-500/10"
                      >
                        Revocar
                      </Button>
                    )}
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* White Label Tab */}
        <TabsContent value="whitelabel" className="space-y-4">
          <Card className="bg-[#18181B] border-[#27272A] p-6">
            <h3 className="text-lg font-semibold text-white mb-6 flex items-center gap-2">
              <Palette className="w-5 h-5 text-primary" />
              Personalizacion de Marca
            </h3>

            <div className="grid grid-cols-2 gap-6">
              {/* Branding */}
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label className="text-zinc-400">Nombre de la Empresa</Label>
                  <Input
                    className="bg-[#09090B] border-[#27272A]"
                    value={whiteLabelConfig.companyName}
                    onChange={(e) => setWhiteLabelConfig({ ...whiteLabelConfig, companyName: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-zinc-400">Logo de la Empresa</Label>
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 rounded-xl bg-[#09090B] border border-[#27272A] flex items-center justify-center">
                      {whiteLabelConfig.logoUrl ? (
                        <img
                          src={whiteLabelConfig.logoUrl || "/placeholder.svg"}
                          alt="Logo"
                          className="w-12 h-12 object-contain"
                        />
                      ) : (
                        <Palette className="w-6 h-6 text-zinc-500" />
                      )}
                    </div>
                    <Button variant="outline" className="border-[#27272A] bg-transparent">
                      Subir Logo
                    </Button>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-zinc-400">Color Primario</Label>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={whiteLabelConfig.primaryColor}
                      onChange={(e) => setWhiteLabelConfig({ ...whiteLabelConfig, primaryColor: e.target.value })}
                      className="w-10 h-10 rounded border-0 cursor-pointer"
                    />
                    <Input
                      className="bg-[#09090B] border-[#27272A] font-mono"
                      value={whiteLabelConfig.primaryColor}
                      onChange={(e) => setWhiteLabelConfig({ ...whiteLabelConfig, primaryColor: e.target.value })}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-zinc-400">Color de Acento</Label>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={whiteLabelConfig.accentColor}
                      onChange={(e) => setWhiteLabelConfig({ ...whiteLabelConfig, accentColor: e.target.value })}
                      className="w-10 h-10 rounded border-0 cursor-pointer"
                    />
                    <Input
                      className="bg-[#09090B] border-[#27272A] font-mono"
                      value={whiteLabelConfig.accentColor}
                      onChange={(e) => setWhiteLabelConfig({ ...whiteLabelConfig, accentColor: e.target.value })}
                    />
                  </div>
                </div>
              </div>

              {/* Advanced */}
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label className="text-zinc-400">Dominio Personalizado</Label>
                  <div className="flex items-center gap-2">
                    <Globe className="w-4 h-4 text-zinc-500" />
                    <Input
                      className="bg-[#09090B] border-[#27272A]"
                      placeholder="app.tuempresa.com"
                      value={whiteLabelConfig.customDomain || ""}
                      onChange={(e) => setWhiteLabelConfig({ ...whiteLabelConfig, customDomain: e.target.value })}
                    />
                  </div>
                  <p className="text-xs text-zinc-500">Requiere configuracion DNS</p>
                </div>

                <div className="space-y-2">
                  <Label className="text-zinc-400">Email de Soporte</Label>
                  <Input
                    className="bg-[#09090B] border-[#27272A]"
                    placeholder="soporte@tuempresa.com"
                    value={whiteLabelConfig.supportEmail || ""}
                    onChange={(e) => setWhiteLabelConfig({ ...whiteLabelConfig, supportEmail: e.target.value })}
                  />
                </div>

                <div className="p-4 rounded-xl bg-[#09090B] border border-[#27272A]">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-white">Ocultar Branding de Nuux</p>
                      <p className="text-xs text-zinc-500">Elimina "Powered by Nuux" del footer</p>
                    </div>
                    <Switch
                      checked={whiteLabelConfig.hideNuuxBranding}
                      onCheckedChange={(checked) =>
                        setWhiteLabelConfig({ ...whiteLabelConfig, hideNuuxBranding: checked })
                      }
                    />
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-yellow-500/10 border border-yellow-500/20">
                  <div className="flex items-start gap-3">
                    <AlertTriangle className="w-5 h-5 text-yellow-500 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm text-yellow-500 font-medium">Plan Enterprise Requerido</p>
                      <p className="text-xs text-yellow-500/80">
                        El dominio personalizado y ocultar branding requieren plan Enterprise.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-2 mt-6 pt-6 border-t border-[#27272A]">
              <Button variant="outline" className="border-[#27272A] bg-transparent">
                <RefreshCw className="w-4 h-4 mr-2" />
                Restablecer
              </Button>
              <Button className="bg-primary hover:bg-primary/90">Guardar Cambios</Button>
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
