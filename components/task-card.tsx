"use client"

import { Card } from "./ui/card"
import { Badge } from "./ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar"
import { Button } from "./ui/button"
import { MoreHorizontal, Calendar, MessageSquare, Paperclip, CheckCircle2, Trash2, Edit } from "lucide-react"
import { cn } from "@/lib/utils"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "./ui/dropdown-menu"

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

interface TaskCardProps {
    task: Task
    isOverlay?: boolean
    columnId?: string // Optional, for styling completed items
    onEdit?: (task: Task) => void
    onDelete?: (taskId: string) => void
    attributes?: any
    listeners?: any
    style?: any
}

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

export function TaskCard({
    task,
    isOverlay,
    columnId,
    onEdit,
    onDelete,
    attributes,
    listeners,
    style
}: TaskCardProps) {
    return (
        <Card
            style={style}
            {...attributes}
            {...listeners}
            className={cn(
                "p-4 bg-card border-border relative group touch-none",
                "transition-all duration-200",
                columnId === "done" && "opacity-70",
                isOverlay ? "shadow-2xl scale-105 border-primary/50 cursor-grabbing bg-zinc-900 rotate-2 z-50" : "hover:border-primary/30 cursor-grab active:cursor-grabbing"
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
                    {columnId === "done" && <CheckCircle2 className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />}
                    <h4
                        className={cn(
                            "font-medium text-foreground text-sm leading-snug",
                            columnId === "done" && "line-through text-muted-foreground",
                        )}
                    >
                        {task.title}
                    </h4>
                </div>

                {/* Only show menu if handlers are provided (not in overlay usually, or maybe yes) */}
                {!isOverlay && onEdit && onDelete && (
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button
                                variant="ghost"
                                size="icon"
                                className="w-6 h-6 opacity-0 group-hover:opacity-100 transition-opacity -mt-1 -mr-1"
                            >
                                <MoreHorizontal className="w-4 h-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => onEdit(task)}>
                                <Edit className="w-4 h-4 mr-2" />
                                Editar
                            </DropdownMenuItem>
                            <DropdownMenuItem className="text-destructive focus:text-destructive" onClick={() => onDelete(task.id)}>
                                <Trash2 className="w-4 h-4 mr-2" />
                                Eliminar
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                )}
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
    )
}
