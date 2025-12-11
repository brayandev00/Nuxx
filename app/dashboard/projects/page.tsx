import { Header } from "@/components/header"
import { KanbanBoard } from "@/components/kanban-board"
import { Button } from "@/components/ui/button"
import { Filter, LayoutGrid, List, Users } from "lucide-react"

export default function ProjectsPage() {
  return (
    <div className="min-h-screen">
      <Header title="Proyectos" subtitle="Gestiona tus proyectos y tareas" />

      <div className="p-8">
        {/* Toolbar */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" className="border-border hover:border-primary/30 bg-transparent">
              <Filter className="w-4 h-4 mr-2" />
              Filtrar
            </Button>
            <Button variant="outline" size="sm" className="border-border hover:border-primary/30 bg-transparent">
              <Users className="w-4 h-4 mr-2" />
              Asignados
            </Button>
          </div>
          <div className="flex items-center gap-1 bg-secondary rounded-lg p-1">
            <Button variant="ghost" size="sm" className="bg-card">
              <LayoutGrid className="w-4 h-4" />
            </Button>
            <Button variant="ghost" size="sm">
              <List className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Kanban Board */}
        <KanbanBoard />
      </div>
    </div>
  )
}
