"use client"

import type React from "react"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Plus,
  Search,
  Phone,
  Mail,
  Calendar,
  DollarSign,
  MoreHorizontal,
  Building2,
  FileText,
  Clock,
  Target,
  TrendingUp,
  CheckCircle2,
  ArrowRight,
  Filter,
} from "lucide-react"
import type { Lead } from "@/lib/types"

const initialLeads: Lead[] = [
  {
    id: "LEAD-001",
    tenantId: "tenant-001",
    name: "Carlos Martinez",
    company: "TechSolutions SAS",
    email: "carlos@techsolutions.co",
    phone: "+57 300 123 4567",
    stage: "propuesta",
    value: 45000000,
    probability: 60,
    assignedTo: "user-001",
    source: "web",
    notes: [
      {
        id: "N1",
        content: "Interesado en implementar ERP completo",
        createdBy: "user-001",
        createdAt: "2024-12-01",
        type: "nota",
      },
      {
        id: "N2",
        content: "Llamada de seguimiento - muy interesado",
        createdBy: "user-001",
        createdAt: "2024-12-05",
        type: "llamada",
      },
    ],
    activities: [],
    relatedInvoices: [],
    relatedProjects: [],
    createdAt: "2024-11-15",
    updatedAt: "2024-12-05",
    expectedCloseDate: "2024-12-30",
    tags: ["enterprise", "erp"],
  },
  {
    id: "LEAD-002",
    tenantId: "tenant-001",
    name: "Maria Rodriguez",
    company: "Distribuciones ABC",
    email: "maria@distri-abc.com",
    phone: "+57 301 987 6543",
    stage: "contactado",
    value: 18000000,
    probability: 30,
    assignedTo: "user-002",
    source: "referido",
    notes: [],
    activities: [],
    relatedInvoices: [],
    relatedProjects: [],
    createdAt: "2024-12-01",
    updatedAt: "2024-12-03",
    expectedCloseDate: "2025-01-15",
    tags: ["pyme", "inventario"],
  },
  {
    id: "LEAD-003",
    tenantId: "tenant-001",
    name: "Andres Gomez",
    company: "Logistica del Sur",
    email: "agomez@logisur.co",
    phone: "+57 302 456 7890",
    stage: "negociacion",
    value: 72000000,
    probability: 80,
    assignedTo: "user-001",
    source: "evento",
    notes: [],
    activities: [],
    relatedInvoices: [],
    relatedProjects: [],
    createdAt: "2024-10-20",
    updatedAt: "2024-12-08",
    expectedCloseDate: "2024-12-20",
    tags: ["enterprise", "logistica"],
  },
  {
    id: "LEAD-004",
    tenantId: "tenant-001",
    name: "Laura Sanchez",
    company: "Importadora Norte",
    email: "lsanchez@impnorte.com",
    phone: "+57 303 111 2233",
    stage: "prospecto",
    value: 25000000,
    probability: 10,
    assignedTo: "user-003",
    source: "publicidad",
    notes: [],
    activities: [],
    relatedInvoices: [],
    relatedProjects: [],
    createdAt: "2024-12-08",
    updatedAt: "2024-12-08",
    expectedCloseDate: "2025-02-01",
    tags: ["nuevo"],
  },
  {
    id: "LEAD-005",
    tenantId: "tenant-001",
    name: "Roberto Vargas",
    company: "Constructora Andina",
    email: "rvargas@constandina.co",
    phone: "+57 304 555 6677",
    stage: "ganado",
    value: 95000000,
    probability: 100,
    assignedTo: "user-001",
    source: "referido",
    notes: [],
    activities: [],
    relatedInvoices: ["INV-003"],
    relatedProjects: ["PRJ-001"],
    createdAt: "2024-09-01",
    updatedAt: "2024-11-30",
    expectedCloseDate: "2024-11-30",
    tags: ["enterprise", "construccion"],
  },
]

const stages = [
  { id: "prospecto", name: "Prospecto", color: "bg-zinc-500" },
  { id: "contactado", name: "Contactado", color: "bg-blue-500" },
  { id: "propuesta", name: "Propuesta", color: "bg-yellow-500" },
  { id: "negociacion", name: "Negociacion", color: "bg-orange-500" },
  { id: "ganado", name: "Ganado", color: "bg-primary" },
  { id: "perdido", name: "Perdido", color: "bg-red-500" },
]

export default function CRMPage() {
  const [leads, setLeads] = useState<Lead[]>(initialLeads)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null)
  const [showNewLeadDialog, setShowNewLeadDialog] = useState(false)
  const [draggedLead, setDraggedLead] = useState<Lead | null>(null)

  const filteredLeads = leads.filter(
    (lead) =>
      lead.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lead.company.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const getLeadsByStage = (stageId: string) => filteredLeads.filter((lead) => lead.stage === stageId)

  const getStageValue = (stageId: string) => getLeadsByStage(stageId).reduce((sum, lead) => sum + lead.value, 0)

  const handleDragStart = (lead: Lead) => setDraggedLead(lead)

  const handleDragOver = (e: React.DragEvent) => e.preventDefault()

  const handleDrop = (stageId: string) => {
    if (!draggedLead) return

    setLeads((prev) =>
      prev.map((lead) =>
        lead.id === draggedLead.id
          ? {
              ...lead,
              stage: stageId as Lead["stage"],
              updatedAt: new Date().toISOString().split("T")[0],
              probability: stageId === "ganado" ? 100 : stageId === "perdido" ? 0 : lead.probability,
            }
          : lead,
      ),
    )
    setDraggedLead(null)
  }

  const totalPipeline = leads
    .filter((l) => !["ganado", "perdido"].includes(l.stage))
    .reduce((sum, l) => sum + l.value, 0)
  const weightedPipeline = leads
    .filter((l) => !["ganado", "perdido"].includes(l.stage))
    .reduce((sum, l) => sum + l.value * (l.probability / 100), 0)
  const wonDeals = leads.filter((l) => l.stage === "ganado").reduce((sum, l) => sum + l.value, 0)

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">CRM - Pipeline de Ventas</h1>
          <p className="text-zinc-500">Gestiona tus oportunidades y clientes</p>
        </div>
        <Dialog open={showNewLeadDialog} onOpenChange={setShowNewLeadDialog}>
          <DialogTrigger asChild>
            <Button className="bg-primary hover:bg-primary/90">
              <Plus className="w-4 h-4 mr-2" />
              Nuevo Lead
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-[#18181B] border-[#27272A] max-w-md">
            <DialogHeader>
              <DialogTitle className="text-white">Crear Nuevo Lead</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-zinc-400">Nombre</Label>
                  <Input className="bg-[#09090B] border-[#27272A]" placeholder="Nombre completo" />
                </div>
                <div className="space-y-2">
                  <Label className="text-zinc-400">Empresa</Label>
                  <Input className="bg-[#09090B] border-[#27272A]" placeholder="Nombre empresa" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-zinc-400">Email</Label>
                  <Input className="bg-[#09090B] border-[#27272A]" type="email" placeholder="email@empresa.com" />
                </div>
                <div className="space-y-2">
                  <Label className="text-zinc-400">Telefono</Label>
                  <Input className="bg-[#09090B] border-[#27272A]" placeholder="+57 300..." />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-zinc-400">Valor Estimado</Label>
                  <Input className="bg-[#09090B] border-[#27272A]" type="number" placeholder="0" />
                </div>
                <div className="space-y-2">
                  <Label className="text-zinc-400">Fuente</Label>
                  <Select>
                    <SelectTrigger className="bg-[#09090B] border-[#27272A]">
                      <SelectValue placeholder="Seleccionar" />
                    </SelectTrigger>
                    <SelectContent className="bg-[#18181B] border-[#27272A]">
                      <SelectItem value="web">Sitio Web</SelectItem>
                      <SelectItem value="referido">Referido</SelectItem>
                      <SelectItem value="cold_call">Llamada en Frio</SelectItem>
                      <SelectItem value="evento">Evento</SelectItem>
                      <SelectItem value="publicidad">Publicidad</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-2">
                <Label className="text-zinc-400">Notas</Label>
                <Textarea className="bg-[#09090B] border-[#27272A]" placeholder="Notas iniciales..." />
              </div>
              <Button className="w-full bg-primary hover:bg-primary/90" onClick={() => setShowNewLeadDialog(false)}>
                Crear Lead
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4">
        <Card className="bg-[#18181B] border-[#27272A] p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary/10">
              <Target className="w-5 h-5 text-primary" />
            </div>
            <div>
              <p className="text-xs text-zinc-500">Pipeline Total</p>
              <p className="text-lg font-bold text-white">${(totalPipeline / 1000000).toFixed(1)}M</p>
            </div>
          </div>
        </Card>
        <Card className="bg-[#18181B] border-[#27272A] p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-blue-500/10">
              <TrendingUp className="w-5 h-5 text-blue-500" />
            </div>
            <div>
              <p className="text-xs text-zinc-500">Pipeline Ponderado</p>
              <p className="text-lg font-bold text-white">${(weightedPipeline / 1000000).toFixed(1)}M</p>
            </div>
          </div>
        </Card>
        <Card className="bg-[#18181B] border-[#27272A] p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary/10">
              <CheckCircle2 className="w-5 h-5 text-primary" />
            </div>
            <div>
              <p className="text-xs text-zinc-500">Negocios Ganados</p>
              <p className="text-lg font-bold text-white">${(wonDeals / 1000000).toFixed(1)}M</p>
            </div>
          </div>
        </Card>
        <Card className="bg-[#18181B] border-[#27272A] p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-yellow-500/10">
              <Clock className="w-5 h-5 text-yellow-500" />
            </div>
            <div>
              <p className="text-xs text-zinc-500">Leads Activos</p>
              <p className="text-lg font-bold text-white">
                {leads.filter((l) => !["ganado", "perdido"].includes(l.stage)).length}
              </p>
            </div>
          </div>
        </Card>
      </div>

      {/* Search & Filter */}
      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
          <Input
            className="pl-10 bg-[#18181B] border-[#27272A]"
            placeholder="Buscar leads..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <Button variant="outline" className="border-[#27272A] text-zinc-400 bg-transparent">
          <Filter className="w-4 h-4 mr-2" />
          Filtros
        </Button>
      </div>

      {/* Pipeline Kanban */}
      <div className="grid grid-cols-6 gap-4 overflow-x-auto pb-4">
        {stages.map((stage) => (
          <div key={stage.id} className="min-w-[280px]" onDragOver={handleDragOver} onDrop={() => handleDrop(stage.id)}>
            {/* Stage Header */}
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className={`w-3 h-3 rounded-full ${stage.color}`} />
                <span className="font-medium text-white">{stage.name}</span>
                <Badge variant="secondary" className="bg-[#27272A] text-zinc-400">
                  {getLeadsByStage(stage.id).length}
                </Badge>
              </div>
            </div>
            <p className="text-xs text-zinc-500 mb-3">${(getStageValue(stage.id) / 1000000).toFixed(1)}M</p>

            {/* Lead Cards */}
            <div className="space-y-3">
              {getLeadsByStage(stage.id).map((lead) => (
                <Card
                  key={lead.id}
                  draggable
                  onDragStart={() => handleDragStart(lead)}
                  onClick={() => setSelectedLead(lead)}
                  className="bg-[#18181B] border-[#27272A] p-4 cursor-pointer hover:border-primary/50 transition-colors"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <Avatar className="w-8 h-8">
                        <AvatarFallback className="bg-primary/20 text-primary text-xs">
                          {lead.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="text-sm font-medium text-white">{lead.name}</p>
                        <p className="text-xs text-zinc-500">{lead.company}</p>
                      </div>
                    </div>
                    <Button variant="ghost" size="icon" className="h-6 w-6">
                      <MoreHorizontal className="w-4 h-4 text-zinc-500" />
                    </Button>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-zinc-500">Valor</span>
                      <span className="text-sm font-medium text-primary">${(lead.value / 1000000).toFixed(1)}M</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-zinc-500">Probabilidad</span>
                      <span className="text-sm text-zinc-400">{lead.probability}%</span>
                    </div>
                    <div className="w-full bg-[#27272A] rounded-full h-1.5">
                      <div
                        className="bg-primary h-1.5 rounded-full transition-all"
                        style={{ width: `${lead.probability}%` }}
                      />
                    </div>
                  </div>
                  {lead.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-3">
                      {lead.tags.slice(0, 2).map((tag) => (
                        <Badge key={tag} variant="secondary" className="bg-[#27272A] text-zinc-400 text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  )}
                </Card>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Lead Detail Panel */}
      {selectedLead && (
        <Dialog open={!!selectedLead} onOpenChange={() => setSelectedLead(null)}>
          <DialogContent className="bg-[#18181B] border-[#27272A] max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-white flex items-center gap-3">
                <Avatar className="w-10 h-10">
                  <AvatarFallback className="bg-primary/20 text-primary">
                    {selectedLead.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p>{selectedLead.name}</p>
                  <p className="text-sm font-normal text-zinc-500">{selectedLead.company}</p>
                </div>
              </DialogTitle>
            </DialogHeader>

            <Tabs defaultValue="info" className="mt-4">
              <TabsList className="bg-[#09090B] border border-[#27272A]">
                <TabsTrigger value="info">Informacion</TabsTrigger>
                <TabsTrigger value="activities">Actividades</TabsTrigger>
                <TabsTrigger value="notes">Notas</TabsTrigger>
                <TabsTrigger value="related">Relacionados</TabsTrigger>
              </TabsList>

              <TabsContent value="info" className="space-y-4 mt-4">
                <div className="grid grid-cols-2 gap-4">
                  <Card className="bg-[#09090B] border-[#27272A] p-4">
                    <div className="flex items-center gap-3 mb-3">
                      <Mail className="w-4 h-4 text-zinc-500" />
                      <span className="text-sm text-zinc-400">Email</span>
                    </div>
                    <p className="text-white">{selectedLead.email}</p>
                  </Card>
                  <Card className="bg-[#09090B] border-[#27272A] p-4">
                    <div className="flex items-center gap-3 mb-3">
                      <Phone className="w-4 h-4 text-zinc-500" />
                      <span className="text-sm text-zinc-400">Telefono</span>
                    </div>
                    <p className="text-white">{selectedLead.phone}</p>
                  </Card>
                  <Card className="bg-[#09090B] border-[#27272A] p-4">
                    <div className="flex items-center gap-3 mb-3">
                      <DollarSign className="w-4 h-4 text-zinc-500" />
                      <span className="text-sm text-zinc-400">Valor Estimado</span>
                    </div>
                    <p className="text-primary font-bold">${selectedLead.value.toLocaleString()}</p>
                  </Card>
                  <Card className="bg-[#09090B] border-[#27272A] p-4">
                    <div className="flex items-center gap-3 mb-3">
                      <Calendar className="w-4 h-4 text-zinc-500" />
                      <span className="text-sm text-zinc-400">Cierre Esperado</span>
                    </div>
                    <p className="text-white">{selectedLead.expectedCloseDate}</p>
                  </Card>
                </div>

                <Card className="bg-[#09090B] border-[#27272A] p-4">
                  <h4 className="text-sm font-medium text-zinc-400 mb-3">Cambiar Etapa</h4>
                  <div className="flex flex-wrap gap-2">
                    {stages.map((stage) => (
                      <Button
                        key={stage.id}
                        variant={selectedLead.stage === stage.id ? "default" : "outline"}
                        size="sm"
                        className={selectedLead.stage === stage.id ? "bg-primary" : "border-[#27272A]"}
                        onClick={() => {
                          setLeads((prev) =>
                            prev.map((l) =>
                              l.id === selectedLead.id ? { ...l, stage: stage.id as Lead["stage"] } : l,
                            ),
                          )
                          setSelectedLead({ ...selectedLead, stage: stage.id as Lead["stage"] })
                        }}
                      >
                        {stage.name}
                      </Button>
                    ))}
                  </div>
                </Card>
              </TabsContent>

              <TabsContent value="notes" className="space-y-4 mt-4">
                <div className="space-y-3">
                  {selectedLead.notes.map((note) => (
                    <Card key={note.id} className="bg-[#09090B] border-[#27272A] p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <Badge variant="secondary" className="bg-[#27272A] text-xs">
                          {note.type}
                        </Badge>
                        <span className="text-xs text-zinc-500">{note.createdAt}</span>
                      </div>
                      <p className="text-white text-sm">{note.content}</p>
                    </Card>
                  ))}
                </div>
                <div className="flex gap-2">
                  <Textarea className="bg-[#09090B] border-[#27272A]" placeholder="Agregar nota..." />
                  <Button className="bg-primary hover:bg-primary/90">
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
              </TabsContent>

              <TabsContent value="activities" className="mt-4">
                <p className="text-zinc-500 text-center py-8">No hay actividades registradas</p>
              </TabsContent>

              <TabsContent value="related" className="space-y-4 mt-4">
                <Card className="bg-[#09090B] border-[#27272A] p-4">
                  <h4 className="text-sm font-medium text-zinc-400 mb-3 flex items-center gap-2">
                    <FileText className="w-4 h-4" />
                    Facturas Relacionadas
                  </h4>
                  {selectedLead.relatedInvoices.length > 0 ? (
                    <div className="space-y-2">
                      {selectedLead.relatedInvoices.map((inv) => (
                        <div key={inv} className="flex items-center justify-between p-2 rounded bg-[#18181B]">
                          <span className="text-white">{inv}</span>
                          <ArrowRight className="w-4 h-4 text-zinc-500" />
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-zinc-500 text-sm">Sin facturas relacionadas</p>
                  )}
                </Card>
                <Card className="bg-[#09090B] border-[#27272A] p-4">
                  <h4 className="text-sm font-medium text-zinc-400 mb-3 flex items-center gap-2">
                    <Building2 className="w-4 h-4" />
                    Proyectos Relacionados
                  </h4>
                  {selectedLead.relatedProjects.length > 0 ? (
                    <div className="space-y-2">
                      {selectedLead.relatedProjects.map((prj) => (
                        <div key={prj} className="flex items-center justify-between p-2 rounded bg-[#18181B]">
                          <span className="text-white">{prj}</span>
                          <ArrowRight className="w-4 h-4 text-zinc-500" />
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-zinc-500 text-sm">Sin proyectos relacionados</p>
                  )}
                </Card>
              </TabsContent>
            </Tabs>
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
}
