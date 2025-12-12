"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Search,
  Shield,
  Eye,
  Trash2,
  AlertTriangle,
  Clock,
  User,
  Activity,
  Download,
  Filter,
  LogIn,
  LogOut,
  Edit,
  Package,
  DollarSign,
  FileText,
  Settings,
  Terminal,
  ChevronRight,
  Database,
  Globe,
  Smartphone,
  Server,
  AlertCircle
} from "lucide-react"
import type { AuditLog } from "@/lib/types"

// Enhanced Mock Data
const generateMockLogs = (): AuditLog[] => {
  const users = [
    { id: "u1", name: "Carlos Martinez", role: "Admin" },
    { id: "u2", name: "Maria Lopez", role: "Contador" },
    { id: "u3", name: "Ana Garcia", role: "Manager" },
    { id: "u4", name: "System", role: "Bot" },
  ]
  const modules = ["inventory", "finance", "auth", "team", "settings", "reports"]
  const actions: AuditLog["action"][] = ["create", "update", "delete", "login", "export", "read"]

  return Array.from({ length: 25 }).map((_, i) => {
    const user = users[Math.floor(Math.random() * users.length)]
    const module = modules[Math.floor(Math.random() * modules.length)]
    const action = actions[Math.floor(Math.random() * actions.length)]
    const hour = Math.floor(Math.random() * 24)
    const minute = Math.floor(Math.random() * 60)

    return {
      id: `LOG-${1000 + i}`,
      tenantId: "tenant-001",
      userId: user.id,
      userName: user.name,
      action: action,
      module: module,
      entityType: module === "inventory" ? "Product" : module === "finance" ? "Invoice" : "System",
      entityId: `${module.toUpperCase().slice(0, 3)}-${100 + i}`,
      entityName: module === "inventory" ? `Producto #${100 + i}` : `Registro ${100 + i}`,
      previousValue: action === "update" ? JSON.stringify({ status: "pending", value: 100 }, null, 2) : undefined,
      newValue: action === "update" ? JSON.stringify({ status: "approved", value: 100 }, null, 2) : undefined,
      ipAddress: `192.168.1.${100 + i}`,
      userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64)",
      timestamp: `2024-12-10T${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}:00Z`,
    }
  }).sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
}

const mockAuditLogs = generateMockLogs()

export default function SecurityPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedModule, setSelectedModule] = useState<string>("all")
  const [selectedAction, setSelectedAction] = useState<string>("all")
  const [selectedLog, setSelectedLog] = useState<AuditLog | null>(null)

  // Filter Logic
  const filteredLogs = mockAuditLogs.filter(log => {
    const matchesSearch =
      log.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.entityName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.id.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesModule = selectedModule === "all" || log.module === selectedModule
    const matchesAction = selectedAction === "all" || log.action === selectedAction

    return matchesSearch && matchesModule && matchesAction
  })

  const handleExportPDF = () => {
    window.print()
  }

  // Action Badge Helper
  const getActionBadge = (action: string) => {
    switch (action) {
      case "create": return <Badge className="bg-emerald-500/10 text-emerald-500 border-emerald-500/20 hover:bg-emerald-500/20">Creó</Badge>
      case "update": return <Badge className="bg-blue-500/10 text-blue-500 border-blue-500/20 hover:bg-blue-500/20">Modificó</Badge>
      case "delete": return <Badge className="bg-red-500/10 text-red-500 border-red-500/20 hover:bg-red-500/20">Eliminó</Badge>
      case "login": return <Badge className="bg-purple-500/10 text-purple-500 border-purple-500/20 hover:bg-purple-500/20">Login</Badge>
      case "export": return <Badge className="bg-amber-500/10 text-amber-500 border-amber-500/20 hover:bg-amber-500/20">Exportó</Badge>
      default: return <Badge variant="outline" className="text-zinc-400">Ver</Badge>
    }
  }

  // Module Icon Helper
  const getModuleIcon = (module: string) => {
    switch (module) {
      case "inventory": return <Package className="w-4 h-4 text-emerald-400" />
      case "finance": return <DollarSign className="w-4 h-4 text-amber-400" />
      case "auth": return <Shield className="w-4 h-4 text-purple-400" />
      case "team": return <User className="w-4 h-4 text-blue-400" />
      case "settings": return <Settings className="w-4 h-4 text-zinc-400" />
      default: return <Activity className="w-4 h-4 text-zinc-400" />
    }
  }

  return (
    <div className="p-8 space-y-6 max-w-[1600px] mx-auto print:p-0 print:max-w-none">
      <style jsx global>{`
        @media print {
          /* Hide sidebar, navigation, and non-essential UI */
          aside, nav, header, footer, .no-print {
            display: none !important;
          }
          /* Hide filter controls and export button itself */
          button, input, .select-trigger {
            display: none !important;
          }
          /* Ensure stats cards are visible but simplified */
          .grid {
            display: flex;
            flex-wrap: wrap;
            gap: 1rem;
            margin-bottom: 2rem;
          }
          /* Clean up table for print */
          table {
            width: 100%;
            border-collapse: collapse;
          }
          th, td {
            border: 1px solid #ddd;
            padding: 8px;
            color: black !important;
          }
          /* Force light theme for printing */
          body, .bg-zinc-900, .bg-zinc-950, .bg-black {
            background-color: white !important;
            background: white !important;
            color: black !important;
          }
          /* Restore visibility for main content */
          .card, .p-8 {
            background: white !important;
            border: none !important;
            box-shadow: none !important;
            padding: 0 !important;
          }
          /* Hide avatars/icons to save ink/clutter */
          svg, img {
            display: none !important;
          }
        }
      `}</style>

      {/* Header with Stats */}
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-white flex items-center gap-3">
            <Shield className="w-8 h-8 text-emerald-500" />
            Auditoría de Sistema
          </h1>
          <p className="text-zinc-400 mt-2">Registro inmutable de todas las acciones realizadas en la plataforma.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="p-4 bg-zinc-900 border-zinc-800 flex items-center gap-4">
            <div className="p-3 rounded-xl bg-emerald-500/10">
              <Activity className="w-6 h-6 text-emerald-500" />
            </div>
            <div>
              <p className="text-sm text-zinc-400">Eventos Hoy</p>
              <p className="text-2xl font-bold text-white">1,248</p>
            </div>
          </Card>
          <Card className="p-4 bg-zinc-900 border-zinc-800 flex items-center gap-4">
            <div className="p-3 rounded-xl bg-amber-500/10">
              <AlertTriangle className="w-6 h-6 text-amber-500" />
            </div>
            <div>
              <p className="text-sm text-zinc-400">Acciones Críticas</p>
              <p className="text-2xl font-bold text-white">12</p>
            </div>
          </Card>
          <Card className="p-4 bg-zinc-900 border-zinc-800 flex items-center gap-4">
            <div className="p-3 rounded-xl bg-blue-500/10">
              <Server className="w-6 h-6 text-blue-500" />
            </div>
            <div>
              <p className="text-sm text-zinc-400">Sistema</p>
              <p className="text-2xl font-bold text-white">Saludable</p>
            </div>
          </Card>
          <Card className="p-4 bg-zinc-900 border-zinc-800 flex items-center gap-4">
            <div className="p-3 rounded-xl bg-purple-500/10">
              <Database className="w-6 h-6 text-purple-500" />
            </div>
            <div>
              <p className="text-sm text-zinc-400">Retención</p>
              <p className="text-2xl font-bold text-white">90 Días</p>
            </div>
          </Card>
        </div>
      </div>

      {/* Main Panel */}
      <Card className="border-zinc-800 bg-zinc-900/50 backdrop-blur-sm overflow-hidden">
        {/* Controls Toolbar */}
        <div className="p-4 border-b border-zinc-800 flex flex-col md:flex-row gap-4 justify-between items-center bg-zinc-900/80">
          <div className="flex items-center gap-2 w-full md:w-auto relative">
            <Search className="w-4 h-4 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2" />
            <Input
              placeholder="Buscar por ID, Usuario o Entidad..."
              className="pl-9 w-full md:w-80 bg-zinc-950 border-zinc-800 text-white placeholder:text-zinc-600 focus:ring-emerald-500/20"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="flex items-center gap-2 w-full md:w-auto">
            <Select value={selectedModule} onValueChange={setSelectedModule}>
              <SelectTrigger className="w-[140px] bg-zinc-950 border-zinc-800 text-white">
                <SelectValue placeholder="Módulo" />
              </SelectTrigger>
              <SelectContent className="bg-zinc-900 border-zinc-800 text-white">
                <SelectItem value="all">Todos</SelectItem>
                <SelectItem value="inventory">Inventario</SelectItem>
                <SelectItem value="finance">Finanzas</SelectItem>
                <SelectItem value="auth">Seguridad</SelectItem>
                <SelectItem value="team">Equipo</SelectItem>
              </SelectContent>
            </Select>

            <Select value={selectedAction} onValueChange={setSelectedAction}>
              <SelectTrigger className="w-[140px] bg-zinc-950 border-zinc-800 text-white">
                <SelectValue placeholder="Acción" />
              </SelectTrigger>
              <SelectContent className="bg-zinc-900 border-zinc-800 text-white">
                <SelectItem value="all">Todas</SelectItem>
                <SelectItem value="create">Creación</SelectItem>
                <SelectItem value="update">Modificación</SelectItem>
                <SelectItem value="delete">Eliminación</SelectItem>
                <SelectItem value="login">Acceso</SelectItem>
              </SelectContent>
            </Select>

            <Button
              variant="outline"
              className="border-zinc-800 text-zinc-400 hover:text-white hover:bg-zinc-800 gap-2"
              onClick={handleExportPDF}
            >
              <Download className="w-4 h-4" />
              Exportar PDF
            </Button>
          </div>
        </div>

        {/* Data Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-zinc-950/50 text-zinc-400 capitalize">
              <tr>
                <th className="px-6 py-4 font-medium">Fecha/Hora</th>
                <th className="px-6 py-4 font-medium">ID Evento</th>
                <th className="px-6 py-4 font-medium">Usuario</th>
                <th className="px-6 py-4 font-medium">Acción</th>
                <th className="px-6 py-4 font-medium">Módulo</th>
                <th className="px-6 py-4 font-medium">Entidad Afectada</th>
                <th className="px-6 py-4 font-medium text-right">Detalles</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800/50">
              {filteredLogs.map((log) => (
                <tr
                  key={log.id}
                  className="hover:bg-zinc-800/30 transition-colors group cursor-pointer"
                  onClick={() => setSelectedLog(log)}
                >
                  <td className="px-6 py-4">
                    <div className="flex flex-col">
                      <span className="text-zinc-300 font-medium">
                        {new Date(log.timestamp).toLocaleDateString("es-CO", { day: '2-digit', month: 'short' })}
                      </span>
                      <span className="text-zinc-500 text-xs">
                        {new Date(log.timestamp).toLocaleTimeString("es-CO", { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="font-mono text-xs text-zinc-500 bg-zinc-950 px-2 py-1 rounded border border-zinc-800">
                      {log.id}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-zinc-800 flex items-center justify-center text-xs font-bold text-zinc-400 border border-zinc-700">
                        {log.userName.charAt(0)}
                      </div>
                      <div className="flex flex-col">
                        <span className="text-zinc-300">{log.userName}</span>
                        <span className="text-zinc-600 text-xs">{log.ipAddress}</span>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    {getActionBadge(log.action)}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2 text-zinc-400">
                      {getModuleIcon(log.module)}
                      <span className="capitalize">{log.module}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <span className="text-zinc-300">{log.entityName}</span>
                      <span className="text-zinc-600 text-xs text-mono">({log.entityType})</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <Button size="icon" variant="ghost" className="text-zinc-500 hover:text-white opacity-0 group-hover:opacity-100 transition-opacity">
                      <ChevronRight className="w-4 h-4" />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Details Dialog */}
      <Dialog open={!!selectedLog} onOpenChange={(open) => !open && setSelectedLog(null)}>
        <DialogContent className="bg-zinc-950 border-zinc-800 text-white max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-xl">
              <Terminal className="w-5 h-5 text-emerald-500" />
              Detalles del Evento {selectedLog?.id}
            </DialogTitle>
            <DialogDescription className="text-zinc-400">
              Información técnica completa del registro de auditoría.
            </DialogDescription>
          </DialogHeader>

          {selectedLog && (
            <div className="grid grid-cols-2 gap-6 mt-4">
              <div className="space-y-4 col-span-2 md:col-span-1">
                <div>
                  <h4 className="text-xs uppercase text-zinc-500 font-semibold mb-2">Información de Usuario</h4>
                  <div className="p-3 rounded-lg bg-zinc-900 border border-zinc-800 space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-zinc-400">Nombre:</span>
                      <span className="text-white">{selectedLog.userName}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-zinc-400">ID Usuario:</span>
                      <span className="text-zinc-500 font-mono text-xs">{selectedLog.userId}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-zinc-400">IP:</span>
                      <span className="text-emerald-500 font-mono text-xs">{selectedLog.ipAddress}</span>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="text-xs uppercase text-zinc-500 font-semibold mb-2">Contexto</h4>
                  <div className="p-3 rounded-lg bg-zinc-900 border border-zinc-800 space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-zinc-400">Módulo:</span>
                      <span className="capitalize text-white">{selectedLog.module}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-zinc-400">Acción:</span>
                      <span className="capitalize text-white">{selectedLog.action}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="col-span-2 md:col-span-1">
                <h4 className="text-xs uppercase text-zinc-500 font-semibold mb-2">Datos Técnicos</h4>
                <div className="p-3 rounded-lg bg-black border border-zinc-800 font-mono text-xs text-zinc-300 h-full overflow-auto max-h-[200px]">
                  <p className="text-zinc-500 mb-1">// User Agent</p>
                  <p className="mb-4 text-emerald-500/80">{selectedLog.userAgent}</p>

                  {selectedLog.previousValue && (
                    <>
                      <p className="text-red-400 mb-1">- Valor Anterior:</p>
                      <pre className="mb-2 text-zinc-400 whitespace-pre-wrap">{selectedLog.previousValue}</pre>
                    </>
                  )}
                  {selectedLog.newValue && (
                    <>
                      <p className="text-green-400 mb-1">+ Valor Nuevo:</p>
                      <pre className="text-zinc-400 whitespace-pre-wrap">{selectedLog.newValue}</pre>
                    </>
                  )}
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
