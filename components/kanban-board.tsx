"use client"

import type React from "react"

import { useState } from "react"
import { Card } from "./ui/card"
import { Badge } from "./ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar"
import { Button } from "./ui/button"
import { Plus, MoreHorizontal, Calendar, MessageSquare, Paperclip, CheckCircle2 } from "lucide-react"
import { cn } from "@/lib/utils"

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

const priorityColors = {
  low: "bg-muted text-muted-foreground",
  medium: "bg-yellow-500/20 text-yellow-400",
  high: "bg-destructive/20 text-destructive",
}

const tagColors: Record<string, string> = {
  Diseño: "bg-purple-500/20 text-purple-400",
  "UI/UX": "bg-pink-500/20 text-pink-400",
  Research: "bg-blue-500/20 text-blue-400",
  Docs: "bg-slate-500/20 text-slate-400",
  Backend: "bg-orange-500/20 text-orange-400",
  Security: "bg-red-500/20 text-red-400",
  Testing: "bg-cyan-500/20 text-cyan-400",
  Performance: "bg-amber-500/20 text-amber-400",
  Database: "bg-emerald-500/20 text-emerald-400",
  DevOps: "bg-indigo-500/20 text-indigo-400",
  Refactor: "bg-violet-500/20 text-violet-400",
}

export function KanbanBoard() {
  const [columns, setColumns] = useState(initialColumns)
  const [draggedTask, setDraggedTask] = useState<{ task: Task; columnId: string } | null>(null)

  const handleDragStart = (task: Task, columnId: string) => {
    setDraggedTask({ task, columnId })
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
  }

  const handleDrop = (targetColumnId: string) => {
    if (!draggedTask || draggedTask.columnId === targetColumnId) {
      setDraggedTask(null)
      return
    }

    setColumns((prev) =>
      prev.map((col) => {
        if (col.id === draggedTask.columnId) {
          return { ...col, tasks: col.tasks.filter((t) => t.id !== draggedTask.task.id) }
        }
        if (col.id === targetColumnId) {
          return { ...col, tasks: [...col.tasks, draggedTask.task] }
        }
        return col
      }),
    )
    setDraggedTask(null)
  }

  return (
    <div className="flex gap-6 overflow-x-auto pb-4">
      {columns.map((column) => (
        <div
          key={column.id}
          className="flex-shrink-0 w-80"
          onDragOver={handleDragOver}
          onDrop={() => handleDrop(column.id)}
        >
          {/* Column Header */}
          <div className="flex items-center justify-between mb-4 px-1">
            <div className="flex items-center gap-3">
              <h3 className="font-semibold text-foreground">{column.title}</h3>
              <span className="w-6 h-6 rounded-full bg-secondary text-muted-foreground text-xs flex items-center justify-center">
                {column.tasks.length}
              </span>
            </div>
            <Button variant="ghost" size="icon" className="w-8 h-8">
              <Plus className="w-4 h-4" />
            </Button>
          </div>

          {/* Tasks */}
          <div className="space-y-3">
            {column.tasks.map((task) => (
              <Card
                key={task.id}
                draggable
                onDragStart={() => handleDragStart(task, column.id)}
                className={cn(
                  "p-4 bg-card border-border cursor-grab active:cursor-grabbing",
                  "hover:border-primary/30 transition-all duration-200 group",
                  column.id === "done" && "opacity-70",
                )}
              >
                {/* Tags */}
                <div className="flex flex-wrap gap-1.5 mb-3">
                  {task.tags.map((tag) => (
                    <Badge
                      key={tag}
                      className={cn("text-xs font-normal", tagColors[tag] || "bg-secondary")}
                      variant="secondary"
                    >
                      {tag}
                    </Badge>
                  ))}
                </div>

                {/* Title */}
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-start gap-2">
                    {column.id === "done" && <CheckCircle2 className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />}
                    <h4
                      className={cn(
                        "font-medium text-foreground text-sm leading-snug",
                        column.id === "done" && "line-through text-muted-foreground",
                      )}
                    >
                      {task.title}
                    </h4>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="w-6 h-6 opacity-0 group-hover:opacity-100 transition-opacity -mt-1 -mr-1"
                  >
                    <MoreHorizontal className="w-4 h-4" />
                  </Button>
                </div>

                {/* Description */}
                {task.description && (
                  <p className="text-muted-foreground text-xs mb-3 line-clamp-2">{task.description}</p>
                )}

                {/* Footer */}
                <div className="flex items-center justify-between pt-2 border-t border-border/50">
                  <div className="flex items-center gap-3 text-xs text-muted-foreground">
                    {task.dueDate && (
                      <div className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        <span>{task.dueDate}</span>
                      </div>
                    )}
                    {task.comments > 0 && (
                      <div className="flex items-center gap-1">
                        <MessageSquare className="w-3 h-3" />
                        <span>{task.comments}</span>
                      </div>
                    )}
                    {task.attachments > 0 && (
                      <div className="flex items-center gap-1">
                        <Paperclip className="w-3 h-3" />
                        <span>{task.attachments}</span>
                      </div>
                    )}
                  </div>

                  {/* Assignees */}
                  <div className="flex -space-x-1.5">
                    {task.assignees.slice(0, 3).map((assignee, idx) => (
                      <Avatar key={idx} className="w-6 h-6 border-2 border-card">
                        {assignee.avatar && <AvatarImage src={assignee.avatar || "/placeholder.svg"} />}
                        <AvatarFallback className="bg-primary/20 text-primary text-[10px]">
                          {assignee.name[0]}
                        </AvatarFallback>
                      </Avatar>
                    ))}
                  </div>
                </div>

                {/* Priority indicator */}
                <div className={cn("absolute top-0 left-0 w-1 h-full rounded-l-lg", priorityColors[task.priority])} />
              </Card>
            ))}

            {/* Add Task Button */}
            <Button
              variant="ghost"
              className="w-full h-10 border border-dashed border-border text-muted-foreground hover:text-foreground hover:border-primary/30 transition-colors"
            >
              <Plus className="w-4 h-4 mr-2" />
              Añadir tarea
            </Button>
          </div>
        </div>
      ))}
    </div>
  )
}
