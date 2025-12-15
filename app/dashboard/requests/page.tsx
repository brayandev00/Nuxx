"use client"

import { useState } from "react"
import { Header } from "@/components/header"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { useTenant } from "@/lib/tenant-context"
import { FileText, Plus, Search, Filter, Clock, CheckCircle2, XCircle } from "lucide-react"

// Mock Data
interface Request {
    id: string
    type: "vacation" | "equipment" | "access" | "other"
    title: string
    description: string
    status: "pending" | "approved" | "rejected"
    requesterId: string
    requesterName: string
    createdAt: string
}

const MOCK_REQUESTS: Request[] = [
    {
        id: "REQ-001",
        type: "vacation",
        title: "Vacaciones Enero",
        description: "Solicito vacaciones del 15 al 20 de Enero.",
        status: "approved",
        requesterId: "user-001",
        requesterName: "Pedro Martinez",
        createdAt: "2025-01-05",
    },
    {
        id: "REQ-002",
        type: "equipment",
        title: "Nuevo Monitor",
        description: "Necesito un monitor adicional para desarrollo.",
        status: "pending",
        requesterId: "user-002",
        requesterName: "Maria Garcia",
        createdAt: "2025-01-10",
    },
]

const TYPE_LABELS = {
    vacation: "Vacaciones",
    equipment: "Equipo / Materiales",
    access: "Permisos / Accesos",
    other: "Otro",
}

const STATUS_CONFIG = {
    pending: { label: "Pendiente", color: "bg-yellow-500/10 text-yellow-500", icon: Clock },
    approved: { label: "Aprobado", color: "bg-emerald-500/10 text-emerald-500", icon: CheckCircle2 },
    rejected: { label: "Rechazado", color: "bg-red-500/10 text-red-500", icon: XCircle },
}

export default function RequestsPage() {
    const { currentUser, currentRole } = useTenant()
    const [requests, setRequests] = useState<Request[]>(MOCK_REQUESTS)
    const [isDialogOpen, setIsDialogOpen] = useState(false)
    const [newRequest, setNewRequest] = useState({ type: "other", title: "", description: "" })

    const handleCreateRequest = () => {
        if (!currentUser) return
        const request: Request = {
            id: `REQ-${Date.now()}`,
            type: newRequest.type as Request["type"],
            title: newRequest.title,
            description: newRequest.description,
            status: "pending",
            requesterId: currentUser.id,
            requesterName: currentUser.name,
            createdAt: new Date().toISOString().split("T")[0],
        }
        setRequests([request, ...requests])
        setIsDialogOpen(false)
        setNewRequest({ type: "other", title: "", description: "" })
    }

    const isAdmin = currentRole?.name === "Administrador"

    return (
        <div className="flex-1 flex flex-col bg-[#09090B] min-h-screen">
            <Header title="Solicitudes" subtitle="Gestiona requerimientos y aprobaciones" />

            <main className="flex-1 p-8">
                <div className="max-w-5xl mx-auto space-y-6">

                    {/* Toolbar */}
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                                <Input placeholder="Buscar solicitudes..." className="pl-9 w-64 bg-[#18181B] border-[#27272A]" />
                            </div>
                        </div>
                        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                            <DialogTrigger asChild>
                                <Button className="bg-emerald-500 hover:bg-emerald-600 text-black font-medium">
                                    <Plus className="w-4 h-4 mr-2" /> Nueva Solicitud
                                </Button>
                            </DialogTrigger>
                            <DialogContent className="bg-[#18181B] border-[#27272A] text-white">
                                <DialogHeader>
                                    <DialogTitle>Crear Nueva Solicitud</DialogTitle>
                                </DialogHeader>
                                <div className="space-y-4 py-4">
                                    <div className="space-y-2">
                                        <Label>Tipo</Label>
                                        <Select
                                            value={newRequest.type}
                                            onValueChange={(val) => setNewRequest({ ...newRequest, type: val })}
                                        >
                                            <SelectTrigger className="bg-zinc-900 border-zinc-800">
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="vacation">Vacaciones</SelectItem>
                                                <SelectItem value="equipment">Equipo / Materiales</SelectItem>
                                                <SelectItem value="access">Permisos / Accesos</SelectItem>
                                                <SelectItem value="other">Otro</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Título</Label>
                                        <Input
                                            placeholder="Ej: Solicitud de vacaciones"
                                            className="bg-zinc-900 border-zinc-800"
                                            value={newRequest.title}
                                            onChange={e => setNewRequest({ ...newRequest, title: e.target.value })}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Descripción</Label>
                                        <Textarea
                                            placeholder="Detalles de la solicitud..."
                                            className="bg-zinc-900 border-zinc-800"
                                            value={newRequest.description}
                                            onChange={e => setNewRequest({ ...newRequest, description: e.target.value })}
                                        />
                                    </div>
                                </div>
                                <DialogFooter>
                                    <Button variant="ghost" onClick={() => setIsDialogOpen(false)}>Cancelar</Button>
                                    <Button onClick={handleCreateRequest} className="bg-emerald-500 hover:bg-emerald-600 text-black">Crear Solicitud</Button>
                                </DialogFooter>
                            </DialogContent>
                        </Dialog>
                    </div>

                    {/* Requests List */}
                    <div className="space-y-3">
                        {requests.length === 0 ? (
                            <div className="text-center py-12 text-zinc-500">No hay solicitudes registradas</div>
                        ) : (
                            requests.map(req => {
                                const StatusConf = STATUS_CONFIG[req.status]
                                return (
                                    <div key={req.id} className="p-4 rounded-xl bg-[#18181B] border border-[#27272A] flex items-center justify-between group hover:border-emerald-500/30 transition-all">
                                        <div className="flex items-start gap-4">
                                            <div className="w-10 h-10 rounded-lg bg-zinc-900 flex items-center justify-center text-zinc-400">
                                                <FileText className="w-5 h-5" />
                                            </div>
                                            <div>
                                                <h3 className="font-medium text-white">{req.title}</h3>
                                                <p className="text-sm text-zinc-400 line-clamp-1">{req.description}</p>
                                                <div className="flex items-center gap-3 mt-2 text-xs text-zinc-500">
                                                    <span>{req.requesterName}</span>
                                                    <span>•</span>
                                                    <span>{req.createdAt}</span>
                                                    <span>•</span>
                                                    <span>{TYPE_LABELS[req.type]}</span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-4">
                                            <div className={`px-3 py-1 rounded-full flex items-center gap-2 text-xs font-medium ${StatusConf.color}`}>
                                                <StatusConf.icon className="w-3 h-3" />
                                                {StatusConf.label}
                                            </div>
                                            {isAdmin && req.status === 'pending' && (
                                                <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                    <Button size="sm" variant="ghost" className="text-emerald-500 hover:text-emerald-400 hover:bg-emerald-500/10">Aprobar</Button>
                                                    <Button size="sm" variant="ghost" className="text-red-500 hover:text-red-400 hover:bg-red-500/10">Rechazar</Button>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                )
                            })
                        )}
                    </div>

                </div>
            </main>
        </div>
    )
}
