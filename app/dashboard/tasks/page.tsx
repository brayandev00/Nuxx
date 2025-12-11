"use client"

import { useState } from "react"
import { Header } from "@/components/header"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Plus, Clock, CheckCircle2, Circle, AlertCircle, Calendar, User, Tag, ChevronRight, X } from "lucide-react"
import { useTenant } from "@/lib/tenant-context"
import { cn } from "@/lib/utils"
import type { Task } from "@/lib/types"

// Mock tasks data
const MOCK_TASKS: Task[] = [
  {
    id: "task-001",
    tenantId: "tenant-001",
    title: "Revisar inventario de bodega principal",
    description: "Hacer conteo fisico de productos en bodega y comparar con sistema",
    assignedTo: "user-003",
    assignedBy: "user-001",
    priority: "high",
    status: "in_progress",
    dueDate: "2025-01-15",
    createdAt: "2025-01-10",
    updatedAt: "2025-01-10",
    comments: [],
    tags: ["inventario", "urgente"],
  },
  {
    id: "task-002",
    tenantId: "tenant-001",
    title: "Preparar reporte mensual de ventas",
    description: "Consolidar datos de ventas de diciembre para junta directiva",
    assignedTo: "user-002",
    assignedBy: "user-001",
    priority: "medium",
    status: "pending",
    dueDate: "2025-01-20",
    createdAt: "2025-01-08",
    updatedAt: "2025-01-08",
    comments: [],
    tags: ["reportes", "finanzas"],
  },
  {
    id: "task-003",
    tenantId: "tenant-001",
    title: "Actualizar precios de catalogo",
    description: "Aplicar incremento del 5% a productos de la categoria electronica",
    assignedTo: "user-003",
    assignedBy: "user-001",
    priority: "low",
    status: "completed",
    dueDate: "2025-01-12",
    createdAt: "2025-01-05",
    updatedAt: "2025-01-11",
    comments: [],
    tags: ["precios", "catalogo"],
  },
  {
    id: "task-004",
    tenantId: "tenant-001",
    title: "Capacitar nuevo personal de ventas",
    description: "Sesion de induccion sobre el sistema Nuux y procesos internos",
    assignedTo: "user-001",
    assignedBy: "user-001",
    priority: "urgent",
    status: "pending",
    dueDate: "2025-01-13",
    createdAt: "2025-01-10",
    updatedAt: "2025-01-10",
    comments: [],
    tags: ["capacitacion", "rrhh"],
  },
]

const priorityConfig = {
  low: { label: "Baja", color: "text-zinc-400", bg: "bg-zinc-500/10", border: "border-zinc-500/20" },
  medium: { label: "Media", color: "text-blue-400", bg: "bg-blue-500/10", border: "border-blue-500/20" },
  high: { label: "Alta", color: "text-amber-400", bg: "bg-amber-500/10", border: "border-amber-500/20" },
  urgent: { label: "Urgente", color: "text-red-400", bg: "bg-red-500/10", border: "border-red-500/20" },
}

const statusConfig = {
  pending: { label: "Pendiente", icon: Circle, color: "text-zinc-400" },
  in_progress: { label: "En Progreso", icon: Clock, color: "text-blue-400" },
  review: { label: "En Revision", icon: AlertCircle, color: "text-amber-400" },
  completed: { label: "Completada", icon: CheckCircle2, color: "text-primary" },
  cancelled: { label: "Cancelada", icon: X, color: "text-red-400" },
}

export default function TasksPage() {
  const { currentUser, currentTenant, getTenantUsers, currentRole, hasPermission } = useTenant()
  const [tasks, setTasks] = useState<Task[]>(MOCK_TASKS)
  const [selectedTask, setSelectedTask] = useState<Task | null>(null)
  const [isCreating, setIsCreating] = useState(false)
  const [filter, setFilter] = useState<"all" | "my" | "assigned">("all")
  const [statusFilter, setStatusFilter] = useState<string>("all")

  const users = getTenantUsers()
  const canAssignTasks = hasPermission("projects", "create") || currentRole?.name === "Administrador"

  // Filter tasks
  const filteredTasks = tasks.filter((task) => {
    if (task.tenantId !== currentTenant?.id) return false
    if (filter === "my" && task.assignedTo !== currentUser?.id) return false
    if (filter === "assigned" && task.assignedBy !== currentUser?.id) return false
    if (statusFilter !== "all" && task.status !== statusFilter) return false
    return true
  })

  const getUserName = (userId: string) => {
    const user = users.find((u) => u.id === userId)
    return user?.name || "Usuario"
  }

  const [newTask, setNewTask] = useState({
    title: "",
    description: "",
    assignedTo: "",
    priority: "medium" as Task["priority"],
    dueDate: "",
    tags: "",
  })

  const handleCreateTask = () => {
    if (!newTask.title || !newTask.assignedTo || !currentUser || !currentTenant) return

    const task: Task = {
      id: `task-${Date.now()}`,
      tenantId: currentTenant.id,
      title: newTask.title,
      description: newTask.description,
      assignedTo: newTask.assignedTo,
      assignedBy: currentUser.id,
      priority: newTask.priority,
      status: "pending",
      dueDate: newTask.dueDate,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      comments: [],
      tags: newTask.tags
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean),
    }

    setTasks([task, ...tasks])
    setNewTask({ title: "", description: "", assignedTo: "", priority: "medium", dueDate: "", tags: "" })
    setIsCreating(false)
  }

  const updateTaskStatus = (taskId: string, status: Task["status"]) => {
    setTasks(tasks.map((t) => (t.id === taskId ? { ...t, status, updatedAt: new Date().toISOString() } : t)))
    if (selectedTask?.id === taskId) {
      setSelectedTask({ ...selectedTask, status })
    }
  }

  return (
    <div className="flex-1 flex flex-col bg-[#09090B] min-h-screen">
      <Header title="Tareas" subtitle="Gestiona y asigna tareas a tu equipo" />

      <main className="flex-1 p-8">
        <div className="flex gap-8 h-[calc(100vh-12rem)]">
          {/* Tasks List */}
          <div className="flex-1 flex flex-col">
            {/* Actions Bar */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                {/* Filter Tabs */}
                <div className="flex items-center p-1 rounded-xl bg-[#18181B] border border-[#27272A]">
                  {[
                    { id: "all", label: "Todas" },
                    { id: "my", label: "Mis Tareas" },
                    { id: "assigned", label: "Asignadas por mi" },
                  ].map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setFilter(tab.id as typeof filter)}
                      className={cn(
                        "px-4 py-2 rounded-lg text-sm font-medium transition-all",
                        filter === tab.id ? "bg-primary text-black" : "text-zinc-400 hover:text-white",
                      )}
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>

                {/* Status Filter */}
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="h-10 px-3 rounded-lg bg-[#18181B] border border-[#27272A] text-white text-sm focus:border-primary outline-none"
                >
                  <option value="all">Todos los estados</option>
                  <option value="pending">Pendiente</option>
                  <option value="in_progress">En Progreso</option>
                  <option value="review">En Revision</option>
                  <option value="completed">Completada</option>
                </select>
              </div>

              {canAssignTasks && (
                <Button
                  onClick={() => setIsCreating(true)}
                  className="bg-primary hover:bg-primary/90 text-black font-medium"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Nueva Tarea
                </Button>
              )}
            </div>

            {/* Tasks Grid */}
            <div className="flex-1 overflow-y-auto space-y-3 pr-2">
              {filteredTasks.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-64 text-center">
                  <div className="w-16 h-16 rounded-2xl bg-[#18181B] flex items-center justify-center mb-4">
                    <CheckCircle2 className="w-8 h-8 text-zinc-600" />
                  </div>
                  <p className="text-zinc-400 mb-2">No hay tareas</p>
                  <p className="text-sm text-zinc-600">Las tareas asignadas apareceran aqui</p>
                </div>
              ) : (
                filteredTasks.map((task) => {
                  const StatusIcon = statusConfig[task.status].icon
                  return (
                    <button
                      key={task.id}
                      onClick={() => setSelectedTask(task)}
                      className={cn(
                        "w-full p-4 rounded-xl bg-[#18181B] border border-[#27272A] hover:border-primary/30 transition-all text-left group",
                        selectedTask?.id === task.id && "border-primary",
                      )}
                    >
                      <div className="flex items-start gap-4">
                        <div
                          className={cn(
                            "w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0",
                            priorityConfig[task.priority].bg,
                          )}
                        >
                          <StatusIcon className={cn("w-5 h-5", statusConfig[task.status].color)} />
                        </div>

                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2 mb-1">
                            <h3 className="font-medium text-white truncate">{task.title}</h3>
                            <span
                              className={cn(
                                "px-2 py-0.5 rounded text-xs font-medium",
                                priorityConfig[task.priority].bg,
                                priorityConfig[task.priority].color,
                              )}
                            >
                              {priorityConfig[task.priority].label}
                            </span>
                          </div>

                          <p className="text-sm text-zinc-500 line-clamp-1 mb-3">{task.description}</p>

                          <div className="flex items-center gap-4 text-xs text-zinc-500">
                            <span className="flex items-center gap-1">
                              <User className="w-3 h-3" />
                              {getUserName(task.assignedTo)}
                            </span>
                            <span className="flex items-center gap-1">
                              <Calendar className="w-3 h-3" />
                              {new Date(task.dueDate).toLocaleDateString("es", { day: "numeric", month: "short" })}
                            </span>
                            {task.tags.length > 0 && (
                              <span className="flex items-center gap-1">
                                <Tag className="w-3 h-3" />
                                {task.tags.length}
                              </span>
                            )}
                          </div>
                        </div>

                        <ChevronRight className="w-5 h-5 text-zinc-600 group-hover:text-primary transition-colors flex-shrink-0" />
                      </div>
                    </button>
                  )
                })
              )}
            </div>
          </div>

          {/* Task Detail / Create Panel */}
          <div className="w-96 flex-shrink-0">
            {isCreating ? (
              // Create Task Form
              <div className="h-full rounded-2xl bg-[#18181B] border border-[#27272A] p-6 flex flex-col">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold text-white">Nueva Tarea</h3>
                  <Button variant="ghost" size="icon" onClick={() => setIsCreating(false)}>
                    <X className="w-5 h-5" />
                  </Button>
                </div>

                <div className="flex-1 space-y-4 overflow-y-auto">
                  <div className="space-y-2">
                    <Label className="text-zinc-400">Titulo</Label>
                    <Input
                      value={newTask.title}
                      onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                      placeholder="Ej: Revisar inventario"
                      className="bg-[#09090B] border-[#27272A] text-white focus:border-primary"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label className="text-zinc-400">Descripcion</Label>
                    <Textarea
                      value={newTask.description}
                      onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                      placeholder="Describe la tarea..."
                      className="bg-[#09090B] border-[#27272A] text-white focus:border-primary resize-none"
                      rows={3}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label className="text-zinc-400">Asignar a</Label>
                    <select
                      value={newTask.assignedTo}
                      onChange={(e) => setNewTask({ ...newTask, assignedTo: e.target.value })}
                      className="w-full h-10 px-3 rounded-md bg-[#09090B] border border-[#27272A] text-white focus:border-primary outline-none"
                    >
                      <option value="">Seleccionar empleado...</option>
                      {users.map((user) => (
                        <option key={user.id} value={user.id}>
                          {user.name} - {user.position}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label className="text-zinc-400">Prioridad</Label>
                      <select
                        value={newTask.priority}
                        onChange={(e) => setNewTask({ ...newTask, priority: e.target.value as Task["priority"] })}
                        className="w-full h-10 px-3 rounded-md bg-[#09090B] border border-[#27272A] text-white focus:border-primary outline-none"
                      >
                        <option value="low">Baja</option>
                        <option value="medium">Media</option>
                        <option value="high">Alta</option>
                        <option value="urgent">Urgente</option>
                      </select>
                    </div>

                    <div className="space-y-2">
                      <Label className="text-zinc-400">Fecha limite</Label>
                      <Input
                        type="date"
                        value={newTask.dueDate}
                        onChange={(e) => setNewTask({ ...newTask, dueDate: e.target.value })}
                        className="bg-[#09090B] border-[#27272A] text-white focus:border-primary"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-zinc-400">Etiquetas (separadas por coma)</Label>
                    <Input
                      value={newTask.tags}
                      onChange={(e) => setNewTask({ ...newTask, tags: e.target.value })}
                      placeholder="Ej: urgente, inventario"
                      className="bg-[#09090B] border-[#27272A] text-white focus:border-primary"
                    />
                  </div>
                </div>

                <Button
                  onClick={handleCreateTask}
                  disabled={!newTask.title || !newTask.assignedTo}
                  className="w-full mt-6 bg-primary hover:bg-primary/90 text-black font-medium"
                >
                  Crear Tarea
                </Button>
              </div>
            ) : selectedTask ? (
              // Task Detail
              <div className="h-full rounded-2xl bg-[#18181B] border border-[#27272A] p-6 flex flex-col">
                <div className="flex items-center justify-between mb-6">
                  <span
                    className={cn(
                      "px-3 py-1 rounded-full text-xs font-medium",
                      priorityConfig[selectedTask.priority].bg,
                      priorityConfig[selectedTask.priority].color,
                    )}
                  >
                    {priorityConfig[selectedTask.priority].label}
                  </span>
                  <Button variant="ghost" size="icon" onClick={() => setSelectedTask(null)}>
                    <X className="w-5 h-5" />
                  </Button>
                </div>

                <h2 className="text-xl font-semibold text-white mb-2">{selectedTask.title}</h2>
                <p className="text-zinc-400 text-sm mb-6">{selectedTask.description}</p>

                {/* Status Selector */}
                <div className="space-y-2 mb-6">
                  <Label className="text-zinc-500 text-xs">Estado</Label>
                  <div className="grid grid-cols-2 gap-2">
                    {(["pending", "in_progress", "review", "completed"] as const).map((status) => {
                      const StatusIcon = statusConfig[status].icon
                      return (
                        <button
                          key={status}
                          onClick={() => updateTaskStatus(selectedTask.id, status)}
                          className={cn(
                            "flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-all",
                            selectedTask.status === status
                              ? "bg-primary/10 text-primary border border-primary/30"
                              : "bg-[#09090B] text-zinc-400 border border-[#27272A] hover:border-zinc-600",
                          )}
                        >
                          <StatusIcon className="w-4 h-4" />
                          {statusConfig[status].label}
                        </button>
                      )
                    })}
                  </div>
                </div>

                {/* Details */}
                <div className="space-y-4 flex-1">
                  <div className="flex items-center justify-between py-3 border-b border-[#27272A]">
                    <span className="text-sm text-zinc-500">Asignado a</span>
                    <span className="text-sm text-white">{getUserName(selectedTask.assignedTo)}</span>
                  </div>
                  <div className="flex items-center justify-between py-3 border-b border-[#27272A]">
                    <span className="text-sm text-zinc-500">Asignado por</span>
                    <span className="text-sm text-white">{getUserName(selectedTask.assignedBy)}</span>
                  </div>
                  <div className="flex items-center justify-between py-3 border-b border-[#27272A]">
                    <span className="text-sm text-zinc-500">Fecha limite</span>
                    <span className="text-sm text-white">
                      {new Date(selectedTask.dueDate).toLocaleDateString("es", {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                      })}
                    </span>
                  </div>

                  {selectedTask.tags.length > 0 && (
                    <div className="pt-3">
                      <span className="text-sm text-zinc-500 block mb-2">Etiquetas</span>
                      <div className="flex flex-wrap gap-2">
                        {selectedTask.tags.map((tag) => (
                          <span key={tag} className="px-2 py-1 rounded-md bg-[#27272A] text-xs text-zinc-400">
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              // Empty State
              <div className="h-full rounded-2xl bg-[#18181B] border border-[#27272A] flex items-center justify-center">
                <div className="text-center p-8">
                  <div className="w-16 h-16 rounded-2xl bg-[#27272A] flex items-center justify-center mx-auto mb-4">
                    <CheckCircle2 className="w-8 h-8 text-zinc-600" />
                  </div>
                  <p className="text-zinc-400 mb-1">Selecciona una tarea</p>
                  <p className="text-sm text-zinc-600">Ver detalles y actualizar estado</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}
