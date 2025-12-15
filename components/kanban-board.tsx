"use client"

import { useState, useMemo } from "react"
import {
  DndContext,
  DragOverlay,
  closestCorners,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragStartEvent,
  DragOverEvent,
  DragEndEvent,
  defaultDropAnimationSideEffects,
  DropAnimation,
  useDroppable
} from "@dnd-kit/core"
import {
  SortableContext,
  arrayMove,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable
} from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import { Button } from "./ui/button"
import { Plus } from "lucide-react"
import { cn } from "@/lib/utils"
// Dialog imports
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "./ui/dialog"
import { Input } from "./ui/input"
import { Label } from "./ui/label"
import { Textarea } from "./ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select"
// New TaskCard import
import { TaskCard } from "./task-card"

interface Task {
  id: string
  title: string
  description?: string
  priority: "low" | "medium" | "high"
  dueDate?: string
  comments: number
  attachments: number
  assignees: { name: string; avatar?: string }[]
  tags: string[]
}

interface Column {
  id: string
  title: string
  tasks: Task[]
}

const initialColumns: Column[] = [
  {
    id: "todo",
    title: "Por Hacer",
    tasks: [
      {
        id: "1",
        title: "Diseño de landing page",
        description: "Crear mockups para la nueva landing page del producto",
        priority: "high",
        dueDate: "20 Dic",
        comments: 3,
        attachments: 2,
        assignees: [{ name: "Ana", avatar: "/professional-woman.png" }],
        tags: ["Diseño", "UI/UX"],
      },
      {
        id: "2",
        title: "Investigación de usuarios",
        priority: "medium",
        dueDate: "22 Dic",
        comments: 1,
        attachments: 0,
        assignees: [
          { name: "Carlos", avatar: "/professional-man.png" },
          { name: "María", avatar: "/woman-developer.png" },
        ],
        tags: ["Research"],
      },
      {
        id: "3",
        title: "Documentación API",
        priority: "low",
        dueDate: "25 Dic",
        comments: 0,
        attachments: 1,
        assignees: [{ name: "Pedro", avatar: "/man-developer.png" }],
        tags: ["Docs"],
      },
    ],
  },
  {
    id: "in-progress",
    title: "En Progreso",
    tasks: [
      {
        id: "4",
        title: "Implementación de autenticación",
        description: "Integrar OAuth2 con Google y GitHub",
        priority: "high",
        dueDate: "18 Dic",
        comments: 5,
        attachments: 3,
        assignees: [
          { name: "Luis", avatar: "/man-programmer.jpg" },
          { name: "Sofia", avatar: "/woman-engineer-at-work.png" },
        ],
        tags: ["Backend", "Security"],
      },
      {
        id: "5",
        title: "Tests unitarios módulo de pagos",
        priority: "medium",
        dueDate: "19 Dic",
        comments: 2,
        attachments: 0,
        assignees: [{ name: "Jorge", avatar: "/man-analyst.jpg" }],
        tags: ["Testing"],
      },
    ],
  },
  {
    id: "review",
    title: "En Revisión",
    tasks: [
      {
        id: "6",
        title: "Optimización de queries",
        description: "Mejorar performance de consultas a DB",
        priority: "medium",
        dueDate: "17 Dic",
        comments: 4,
        attachments: 1,
        assignees: [{ name: "Diego", avatar: "/man-developer.png" }],
        tags: ["Performance", "Database"],
      },
    ],
  },
  {
    id: "done",
    title: "Completado",
    tasks: [
      {
        id: "7",
        title: "Setup de CI/CD",
        priority: "high",
        dueDate: "15 Dic",
        comments: 6,
        attachments: 2,
        assignees: [{ name: "Laura", avatar: "/woman-designer.png" }],
        tags: ["DevOps"],
      },
      {
        id: "8",
        title: "Migración a TypeScript",
        priority: "high",
        dueDate: "12 Dic",
        comments: 8,
        attachments: 4,
        assignees: [
          { name: "Ana", avatar: "/professional-woman.png" },
          { name: "Carlos", avatar: "/professional-man.png" },
        ],
        tags: ["Refactor"],
      },
    ],
  },
]

// Sortable Item Wrapper
function SortableTaskItem({ task, columnId, onEdit, onDelete }: { task: Task; columnId: string; onEdit: any; onDelete: any }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: task.id,
    data: {
      type: "Task",
      task,
    },
  })

  const style = {
    transform: CSS.Translate.toString(transform),
    transition,
    opacity: isDragging ? 0.3 : 1, // Dim original when dragging
  }

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners} className="mb-3 touch-none">
      <TaskCard task={task} columnId={columnId} onEdit={onEdit} onDelete={onDelete} />
    </div>
  )
}

export function KanbanBoard() {
  const [columns, setColumns] = useState<Column[]>(initialColumns)
  const [activeTask, setActiveTask] = useState<Task | null>(null)

  // Dialog State
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingTask, setEditingTask] = useState<Task | null>(null)
  const [targetColumnId, setTargetColumnId] = useState<string | null>(null)

  // Form State
  const [formData, setFormData] = useState<Partial<Task>>({
    title: "",
    description: "",
    priority: "medium",
    tags: []
  })

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8, // Require movement of 8px to start drag (prevents accidental clicks)
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  )

  // Dialog Handlers
  const handleAddTask = (columnId: string) => {
    setEditingTask(null)
    setTargetColumnId(columnId)
    setFormData({ title: "", description: "", priority: "medium", tags: [] })
    setIsDialogOpen(true)
  }

  const handleEditTask = (task: Task) => {
    setEditingTask(task)
    setFormData({ ...task })
    setIsDialogOpen(true)
  }

  const handleDeleteTask = (taskId: string) => { // Updated to search all columns
    setColumns(prev => prev.map(col => ({
      ...col,
      tasks: col.tasks.filter(t => t.id !== taskId)
    })))
  }

  const handleSaveTask = () => {
    if (!formData.title) return

    if (editingTask) {
      // Update existing
      setColumns(prev => prev.map(col => ({
        ...col,
        tasks: col.tasks.map(t => t.id === editingTask.id ? { ...t, ...formData } as Task : t)
      })))
    } else if (targetColumnId) {
      // Create new
      const newTask: Task = {
        id: Math.random().toString(36).substr(2, 9),
        title: formData.title,
        description: formData.description,
        priority: (formData.priority as any) || "medium",
        comments: 0,
        attachments: 0,
        assignees: [],
        tags: formData.tags || [],
        dueDate: new Date().toLocaleDateString('es-CO', { day: '2-digit', month: 'short' }),
        ...formData
      } as Task

      setColumns(prev => prev.map(col => {
        if (col.id === targetColumnId) {
          return { ...col, tasks: [...col.tasks, newTask] }
        }
        return col
      }))
    }
    setIsDialogOpen(false)
  }

  // DND Handlers
  const onDragStart = (event: DragStartEvent) => {
    if (event.active.data.current?.type === "Task") {
      setActiveTask(event.active.data.current.task)
    }
  }

  const onDragOver = (event: DragOverEvent) => {
    const { active, over } = event
    if (!over) return

    const activeId = active.id
    const overId = over.id

    if (activeId === overId) return

    const isActiveTask = active.data.current?.type === "Task"
    const isOverTask = over.data.current?.type === "Task"

    if (!isActiveTask) return

    // Dropping a Task over another Task
    if (isActiveTask && isOverTask) {
      setColumns((columns) => {
        const activeColumnIndex = columns.findIndex((col) => col.tasks.some((t) => t.id === activeId))
        const overColumnIndex = columns.findIndex((col) => col.tasks.some((t) => t.id === overId))

        if (activeColumnIndex === -1 || overColumnIndex === -1) return columns // Safety check

        const activeColumn = columns[activeColumnIndex]
        const overColumn = columns[overColumnIndex]

        // If different columns, move task
        if (activeColumnIndex !== overColumnIndex) {
          const activeTaskIndex = activeColumn.tasks.findIndex((t) => t.id === activeId)
          const overTaskIndex = overColumn.tasks.findIndex((t) => t.id === overId)

          const newActiveTasks = [...activeColumn.tasks]
          const [movedTask] = newActiveTasks.splice(activeTaskIndex, 1)

          const newOverTasks = [...overColumn.tasks]
          // Insert relative to cursor is tricky in dragOver, just insert at index
          // Better logic handles "isBelowOverItem" etc, but simple splice is often enough for cross-column

          // Simple approach: Insert before the over task
          newOverTasks.splice(overTaskIndex, 0, movedTask)

          return columns.map((col, index) => {
            if (index === activeColumnIndex) return { ...col, tasks: newActiveTasks }
            if (index === overColumnIndex) return { ...col, tasks: newOverTasks }
            return col
          })
        }
        return columns // Reordering same column handled in DragEnd
      })
    }

    // Dropping a Task over a Column (empty area)
    const isOverColumn = columns.some(col => col.id === overId)
    if (isActiveTask && isOverColumn) {
      setColumns((columns) => {
        const activeColumnIndex = columns.findIndex((col) => col.tasks.some((t) => t.id === activeId))
        const overColumnIndex = columns.findIndex((col) => col.id === overId)

        if (activeColumnIndex === overColumnIndex) return columns

        const activeColumn = columns[activeColumnIndex]
        const overColumn = columns[overColumnIndex]

        const activeTaskIndex = activeColumn.tasks.findIndex((t) => t.id === activeId)
        const newActiveTasks = [...activeColumn.tasks]
        const [movedTask] = newActiveTasks.splice(activeTaskIndex, 1)

        const newOverTasks = [...overColumn.tasks, movedTask] // Append to end

        return columns.map((col, index) => {
          if (index === activeColumnIndex) return { ...col, tasks: newActiveTasks }
          if (index === overColumnIndex) return { ...col, tasks: newOverTasks }
          return col
        })
      })
    }
  }

  const onDragEnd = (event: DragEndEvent) => {
    setActiveTask(null)
    const { active, over } = event
    if (!over) return

    const activeId = active.id
    const overId = over.id

    if (activeId === overId) return

    setColumns((columns) => {
      const activeColumnIndex = columns.findIndex((col) => col.tasks.some((t) => t.id === activeId))
      const overColumnIndex = columns.findIndex((col) => col.tasks.some((t) => t.id === overId))

      if (activeColumnIndex === -1 && overColumnIndex === -1) return columns // safety

      // Reordering within the same column
      if (activeColumnIndex === overColumnIndex) {
        // Must be same column reordering
        const columnIndex = activeColumnIndex // or overColumnIndex
        const column = columns[columnIndex]

        const oldIndex = column.tasks.findIndex((t) => t.id === activeId)
        const newIndex = column.tasks.findIndex((t) => t.id === overId)

        const newTasks = arrayMove(column.tasks, oldIndex, newIndex)

        return columns.map((col, idx) => idx === columnIndex ? { ...col, tasks: newTasks } : col)
      }

      return columns
    })
  }

  const dropAnimation: DropAnimation = {
    sideEffects: defaultDropAnimationSideEffects({
      styles: {
        active: {
          opacity: '0.4',
        },
      },
    }),
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCorners}
      onDragStart={onDragStart}
      onDragOver={onDragOver}
      onDragEnd={onDragEnd}
    >
      <div className="flex gap-6 overflow-x-auto pb-4 items-start">
        {columns.map((column) => (
          <div
            key={column.id}
            className="flex-shrink-0 w-80 bg-zinc-900/30 rounded-xl p-2 border border-zinc-900/50"
          >
            {/* Column Header */}
            <div className="flex items-center justify-between mb-4 px-2 pt-2">
              <div className="flex items-center gap-3">
                <h3 className="font-semibold text-foreground">{column.title}</h3>
                <span className="w-6 h-6 rounded-full bg-secondary text-muted-foreground text-xs flex items-center justify-center">
                  {column.tasks.length}
                </span>
              </div>
              {/* Make column droppable for empty state */}
              <SortableContext items={column.tasks.map(t => t.id)} strategy={verticalListSortingStrategy}>
                {/* We need a droppable area even if empty */}
              </SortableContext>
            </div>

            {/* Droppable Area */}
            <SortableContext items={column.tasks.map(t => t.id)} strategy={verticalListSortingStrategy}>
              <div className="space-y-3 min-h-[100px]" ref={(node) => {
                // This technically needs to be a droppable if using useDroppable
                // but SortableContext usually handles items.
                // IMPORTANT: To drop into empty column, we need useDroppable on the column logic
                // BUT for simplicity in this swift refactor, I added handling in onDragOver for 'over.id === column.id'
                // I need to ensure the column div is a valid drop target.
                // The simple way in dnd-kit sortable is to ensure the SortableContext wraps the items.
                // The container 'over' check logic above handles column ID matches.
              }}>
                {/* We need to attach ref to column ID if we want to drop on empty column */}
                <DroppableColumn id={column.id} items={column.tasks}>
                  {column.tasks.map((task) => (
                    <SortableTaskItem
                      key={task.id}
                      task={task}
                      columnId={column.id}
                      onEdit={handleEditTask}
                      onDelete={() => handleDeleteTask(task.id)}
                    />
                  ))}
                </DroppableColumn>
              </div>
            </SortableContext>

            {/* Add Task Button */}
            <Button
              variant="ghost"
              className="w-full h-10 border border-dashed border-border text-muted-foreground hover:text-foreground hover:border-primary/30 transition-colors mt-3"
              onClick={() => handleAddTask(column.id)}
            >
              <Plus className="w-4 h-4 mr-2" />
              Añadir tarea
            </Button>
          </div>
        ))}
      </div>

      {/* Drag Overlay for Pretty Dragging */}
      <DragOverlay dropAnimation={dropAnimation}>
        {activeTask ? (
          <TaskCard task={activeTask} isOverlay />
        ) : null}
      </DragOverlay>

      {/* Dialogs */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="bg-card border-border sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>{editingTask ? "Editar Tarea" : "Nueva Tarea"}</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="title">Título</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="bg-secondary/50 border-input"
                placeholder="Ej: Diseñar interfaz..."
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="desc">Descripción</Label>
              <Textarea
                id="desc"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="bg-secondary/50 border-input resize-none"
                placeholder="Detalles de la tarea..."
                rows={3}
              />
            </div>
            <div className="grid gap-2">
              <Label>Prioridad</Label>
              <Select
                value={formData.priority}
                onValueChange={(val: any) => setFormData({ ...formData, priority: val })}
              >
                <SelectTrigger className="bg-secondary/50 border-input">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Baja</SelectItem>
                  <SelectItem value="medium">Media</SelectItem>
                  <SelectItem value="high">Alta</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Cancelar</Button>
            <Button onClick={handleSaveTask}>Guardar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </DndContext>
  )
}

// Helper for Droppable Column (needed for empty state dropping)
function DroppableColumn({ id, items, children }: { id: string, items: Task[], children: React.ReactNode }) {
  const { setNodeRef } = useDroppable({
    id: id,
    data: {
      type: "Column",
      items
    }
  })

  return (
    <div ref={setNodeRef} className="space-y-3 min-h-[100px]">
      {children}
    </div>
  )
}
