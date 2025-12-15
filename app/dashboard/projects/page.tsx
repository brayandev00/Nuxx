import { Header } from "@/components/header"
import { KanbanBoard } from "@/components/kanban-board"
import { Button } from "@/components/ui/button"
import { Filter, LayoutGrid, List, Users, Plus } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export default function ProjectsPage() {
  return (
    <div className="min-h-screen">
      <Header title="Proyectos" subtitle="Gestiona tus proyectos y tareas" />

      <div className="p-8">
        {/* Toolbar */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" className="border-border hover:border-primary/30 bg-transparent text-zinc-400 hover:text-white">
              <Filter className="w-4 h-4 mr-2" />
              Filtrar
            </Button>
            <Button variant="outline" size="sm" className="border-border hover:border-primary/30 bg-transparent text-zinc-400 hover:text-white">
              <Users className="w-4 h-4 mr-2" />
              Asignados
            </Button>
          </div>

          <div className="flex items-center gap-4">
            <Dialog>
              <DialogTrigger asChild>
                <Button className="bg-primary text-black hover:bg-primary/90">
                  <Plus className="w-4 h-4 mr-2" /> Nuevo Proyecto
                </Button>
              </DialogTrigger>
              <DialogContent className="bg-[#18181B] border-[#27272A] text-white">
                <DialogHeader>
                  <DialogTitle>Crear Nuevo Proyecto</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label>Nombre del Proyecto</Label>
                    <Input placeholder="Ej: Rediseño Web" className="bg-zinc-900 border-zinc-800" />
                  </div>
                  <div className="space-y-2">
                    <Label>Cliente / Area</Label>
                    <Input placeholder="Ej: Marketing" className="bg-zinc-900 border-zinc-800" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Fecha Inicio</Label>
                      <Input type="date" className="bg-zinc-900 border-zinc-800" />
                    </div>
                    <div className="space-y-2">
                      <Label>Fecha Fin</Label>
                      <Input type="date" className="bg-zinc-900 border-zinc-800" />
                    </div>
                  </div>
                </div>
                <DialogFooter>
                  <Button className="bg-primary text-black w-full">Crear Proyecto</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>

            <div className="flex items-center gap-1 bg-secondary rounded-lg p-1">
              <Button variant="ghost" size="sm" className="bg-card text-white">
                <LayoutGrid className="w-4 h-4" />
              </Button>
              <Button variant="ghost" size="sm" className="text-zinc-400">
                <List className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Kanban Board */}
        <KanbanBoard />
      </div>
    </div>
  )
}
