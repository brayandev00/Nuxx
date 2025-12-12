"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Search,
  Folder,
  FileText,
  File,
  ImageIcon,
  Upload,
  MoreHorizontal,
  Download,
  Eye,
  Clock,
  CheckCircle2,
  PenTool,
  History,
  FolderOpen,
  ChevronRight,
  Users,
  Building2,
  Briefcase,
  Grid,
  List as ListIcon,
  Filter,
  Plus,
  Trash2,
  Share2,
  MoreVertical,
  FileIcon,
  X,
  CloudUpload
} from "lucide-react"
import type { Document, Folder as FolderType } from "@/lib/types"
import { cn } from "@/lib/utils"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

// Mock Data (Expanded)
const mockFolders: FolderType[] = [
  { id: "FLD-001", tenantId: "tenant-001", name: "Recursos Humanos", parentId: null, type: "system", createdAt: "2024-01-01" },
  { id: "FLD-002", tenantId: "tenant-001", name: "Proyectos Activos", parentId: null, type: "system", createdAt: "2024-01-01" },
  { id: "FLD-003", tenantId: "tenant-001", name: "Finanzas & Legal", parentId: null, type: "system", createdAt: "2024-01-01" },
  { id: "FLD-004", tenantId: "tenant-001", name: "Marketing", parentId: null, type: "system", createdAt: "2024-01-01" },
  {
    id: "FLD-005",
    tenantId: "tenant-001",
    name: "Expedientes Empleados",
    parentId: "FLD-001",
    type: "custom",
    entityType: "user",
    entityId: "user-001",
    createdAt: "2024-03-15",
  },
]

const mockDocuments: Document[] = [
  {
    id: "DOC-001",
    tenantId: "tenant-001",
    name: "Contrato Laboral - Carlos Martinez.pdf",
    description: "Contrato indefinido firmado para el puesto de Desarrollador Senior.",
    type: "contrato",
    category: "empleado",
    fileUrl: "/documents/contract-001.pdf",
    fileSize: 2450000,
    mimeType: "application/pdf",
    folderId: "FLD-005",
    relatedEntityId: "user-001",
    relatedEntityType: "user",
    version: 2,
    versions: [],
    status: "signed",
    signatures: [],
    createdBy: "user-001",
    createdAt: "2024-03-15",
    updatedAt: "2024-09-01",
    tags: ["contrato", "rh"],
  },
  {
    id: "DOC-002",
    tenantId: "tenant-001",
    name: "Presupuesto Q1 2025.xlsx",
    description: "Proyección financiera detallada para el primer trimestre.",
    type: "finance",
    category: "finanzas",
    fileUrl: "/documents/budget.xlsx",
    fileSize: 45000,
    mimeType: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    folderId: "FLD-003",
    relatedEntityId: "prj-001",
    relatedEntityType: "project",
    version: 1,
    versions: [],
    status: "draft",
    signatures: [],
    createdBy: "user-002",
    createdAt: "2024-12-01",
    updatedAt: "2024-12-01",
    tags: ["finanzas", "2025"],
  },
  {
    id: "DOC-003",
    tenantId: "tenant-001",
    name: "Logo Oficial - Alta Calidad.png",
    description: "Versión principal del logo en formato PNG con transparencia.",
    type: "asset",
    category: "marketing",
    fileUrl: "/documents/logo.png",
    fileSize: 5200000,
    mimeType: "image/png",
    folderId: "FLD-004",
    relatedEntityId: "prj-001",
    relatedEntityType: "project",
    version: 5,
    versions: [],
    status: "signed",
    signatures: [],
    createdBy: "user-002",
    createdAt: "2024-12-10",
    updatedAt: "2024-12-10",
    tags: ["branding", "logo"],
  },
]

export default function DocumentsPage() {
  const [documents, setDocuments] = useState(mockDocuments)
  const [folders, setFolders] = useState(mockFolders)
  const [searchQuery, setSearchQuery] = useState("")
  const [currentFolder, setCurrentFolder] = useState<string | null>(null)
  const [selectedDocument, setSelectedDocument] = useState<Document | null>(null)
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [isDragging, setIsDragging] = useState(false)

  // Dialog States
  const [isNewFolderOpen, setIsNewFolderOpen] = useState(false)
  const [isUploadOpen, setIsUploadOpen] = useState(false)

  // Form States (Mock)
  const [newFolderName, setNewFolderName] = useState("")
  const [uploadFiles, setUploadFiles] = useState<File[]>([])

  const rootFolders = folders.filter((f) => f.parentId === null)
  const currentFolderData = currentFolder ? folders.find((f) => f.id === currentFolder) : null
  const childFolders = folders.filter((f) => f.parentId === currentFolder)
  const folderDocuments = documents.filter((d) => d.folderId === currentFolder)

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
  }

  const getFileIcon = (mimeType: string) => {
    if (mimeType.includes("pdf")) return <FileText className="w-8 h-8 text-rose-500" />
    if (mimeType.includes("sheet") || mimeType.includes("excel")) return <FileText className="w-8 h-8 text-emerald-500" />
    if (mimeType.includes("image")) return <ImageIcon className="w-8 h-8 text-blue-500" />
    return <File className="w-8 h-8 text-zinc-500" />
  }

  const getFolderIcon = (folder: FolderType) => {
    if (folder.name.includes("Humanos")) return <Users className="w-10 h-10 text-rose-400" />
    if (folder.name.includes("Proyectos")) return <Briefcase className="w-10 h-10 text-blue-400" />
    if (folder.name.includes("Finanzas")) return <Building2 className="w-10 h-10 text-emerald-400" />
    if (folder.name.includes("Marketing")) return <ImageIcon className="w-10 h-10 text-purple-400" />
    return <Folder className="w-10 h-10 text-zinc-600 fill-zinc-600/20" />
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = () => {
    setIsDragging(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    setIsUploadOpen(true) // Open upload dialog
  }

  const handleCreateFolder = () => {
    // Mock creation
    const newFolder: FolderType = {
      id: `FLD-${Date.now()}`,
      tenantId: "tenant-001",
      name: newFolderName,
      parentId: currentFolder,
      type: "custom",
      createdAt: new Date().toISOString()
    }
    setFolders([...folders, newFolder])
    setNewFolderName("")
    setIsNewFolderOpen(false)
  }

  return (
    <div className="flex bg-black h-screen overflow-hidden">

      {/* Sidebar Filters */}
      <div className="w-64 border-r border-[#27272A] bg-[#09090B] p-4 hidden md:flex flex-col gap-6">
        <div className="flex items-center gap-2 mb-2 px-2">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
            <FolderOpen className="w-5 h-5 text-white" />
          </div>
          <h2 className="font-bold text-lg text-white">Drive</h2>
        </div>

        <div className="space-y-1">
          <Button variant="ghost" className="w-full justify-start text-zinc-400 hover:text-white hover:bg-zinc-800">
            <Clock className="w-4 h-4 mr-2" /> Recientes
          </Button>
          <Button variant="ghost" className="w-full justify-start text-zinc-400 hover:text-white hover:bg-zinc-800">
            <CheckCircle2 className="w-4 h-4 mr-2" /> Firmados
          </Button>
          <Button variant="ghost" className="w-full justify-start text-zinc-400 hover:text-white hover:bg-zinc-800">
            <Trash2 className="w-4 h-4 mr-2" /> Papelera
          </Button>
        </div>

        <div className="space-y-4">
          <p className="text-xs font-medium text-zinc-500 px-2 uppercase tracking-wider">Etiquetas</p>
          <div className="flex flex-wrap gap-2 px-2">
            {["Contratos", "Facturas", "Marketing", "Legal"].map(tag => (
              <Badge key={tag} variant="outline" className="cursor-pointer hover:bg-zinc-800 border-zinc-700 text-zinc-400">
                #{tag}
              </Badge>
            ))}
          </div>
        </div>

        {/* Storage Widget */}
        <div className="mt-auto p-4 rounded-xl bg-zinc-900 border border-zinc-800">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-zinc-400">Almacenamiento</span>
            <span className="text-xs text-white">75%</span>
          </div>
          <div className="h-1.5 w-full bg-zinc-800 rounded-full overflow-hidden">
            <div className="h-full bg-gradient-to-r from-blue-500 to-purple-500 w-3/4" />
          </div>
          <p className="text-xs text-zinc-500 mt-2">15GB de 20GB usados</p>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col h-full bg-black/50"
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        {/* Top Bar */}
        <div className="h-16 border-b border-[#27272A] flex items-center justify-between px-6 bg-[#09090B]">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-sm text-zinc-400">
            <button
              onClick={() => setCurrentFolder(null)}
              className="hover:text-white transition-colors flex items-center gap-1"
            >
              <Folder className="w-4 h-4" />
              Inicio
            </button>
            {currentFolderData && (
              <>
                <ChevronRight className="w-4 h-4" />
                <span className="text-white font-medium">{currentFolderData.name}</span>
              </>
            )}
          </div>

          {/* Actions */}
          <div className="flex items-center gap-3">
            <div className="relative w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
              <Input
                placeholder="Buscar..."
                className="pl-9 bg-zinc-900 border-zinc-800 text-sm h-9 focus:ring-blue-500/20"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            <div className="h-6 w-px bg-zinc-800 mx-2" />

            <div className="flex bg-zinc-900 rounded-md p-1 border border-zinc-800">
              <button
                onClick={() => setViewMode("grid")}
                className={`p-1.5 rounded transition-all ${viewMode === 'grid' ? 'bg-zinc-800 text-white shadow-sm' : 'text-zinc-500 hover:text-zinc-300'}`}
              >
                <Grid className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={`p-1.5 rounded transition-all ${viewMode === 'list' ? 'bg-zinc-800 text-white shadow-sm' : 'text-zinc-500 hover:text-zinc-300'}`}
              >
                <ListIcon className="w-4 h-4" />
              </button>
            </div>

            <Button
              variant="outline"
              className="border-zinc-800 text-zinc-300 hover:bg-zinc-900"
              onClick={() => setIsNewFolderOpen(true)}
            >
              <Plus className="w-4 h-4 mr-2" /> Carpeta
            </Button>

            <Button
              className="bg-blue-600 hover:bg-blue-700 text-white h-9 px-4 shadow-lg shadow-blue-500/20"
              onClick={() => setIsUploadOpen(true)}
            >
              <Upload className="w-4 h-4 mr-2" /> Subir
            </Button>
          </div>
        </div>

        {/* File Area */}
        <div className="flex-1 overflow-y-auto p-6 relative">
          {isDragging && (
            <div className="absolute inset-4 border-2 border-dashed border-blue-500 bg-blue-500/10 rounded-xl z-50 flex flex-col items-center justify-center backdrop-blur-sm">
              <Upload className="w-16 h-16 text-blue-500 mb-4 animate-bounce" />
              <h3 className="text-2xl font-bold text-white">Suelta los archivos aquí</h3>
              <p className="text-blue-200">para subirlos a {currentFolderData?.name || "Inicio"}</p>
            </div>
          )}

          <div className="max-w-[1920px] mx-auto space-y-8">

            {/* Folders Section */}
            <section>
              <h3 className="text-sm font-medium text-zinc-500 mb-4 flex items-center gap-2">
                <Folder className="w-4 h-4" />
                Carpetas
              </h3>
              <div className={`grid gap-4 ${viewMode === 'grid' ? 'grid-cols-2 md:grid-cols-4 lg:grid-cols-5' : 'grid-cols-1'}`}>
                {(currentFolder ? childFolders : rootFolders).map((folder) => (
                  viewMode === 'grid' ? (
                    <Card
                      key={folder.id}
                      className="bg-zinc-900/50 border-zinc-800/50 p-4 cursor-pointer hover:bg-zinc-800 hover:border-zinc-700 transition-all group"
                      onClick={() => setCurrentFolder(folder.id)}
                    >
                      <div className="flex items-start justify-between">
                        {getFolderIcon(folder)}
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity">
                              <MoreHorizontal className="w-4 h-4 text-zinc-400" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent className="bg-zinc-900 border-zinc-800 text-zinc-300">
                            <DropdownMenuItem>Renombrar</DropdownMenuItem>
                            <DropdownMenuItem className="text-red-500">Eliminar</DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                      <p className="font-medium text-zinc-200 mt-3 truncate">{folder.name}</p>
                      <p className="text-xs text-zinc-500 mt-1">
                        {documents.filter((d) => d.folderId === folder.id).length} archivos
                      </p>
                    </Card>
                  ) : (
                    <div
                      key={folder.id}
                      onClick={() => setCurrentFolder(folder.id)}
                      className="flex items-center gap-4 p-3 rounded-lg hover:bg-zinc-900 border border-transparent hover:border-zinc-800 cursor-pointer group"
                    >
                      {getFolderIcon(folder)}
                      <div className="flex-1">
                        <p className="font-medium text-zinc-200">{folder.name}</p>
                      </div>
                      <div className="text-xs text-zinc-600 mr-4">
                        {new Date(folder.createdAt).toLocaleDateString()}
                      </div>
                      <ChevronRight className="w-4 h-4 text-zinc-600 group-hover:translate-x-1 transition-transform" />
                    </div>
                  )
                ))}
              </div>
            </section>

            {/* Documents Section */}
            <section>
              <h3 className="text-sm font-medium text-zinc-500 mb-4 flex items-center gap-2">
                <FileIcon className="w-4 h-4" />
                Archivos
              </h3>

              {folderDocuments.length === 0 && (
                <div className="flex flex-col items-center justify-center py-12 border-2 border-dashed border-zinc-800 rounded-xl bg-zinc-900/30">
                  <div className="w-16 h-16 rounded-full bg-zinc-900 flex items-center justify-center mb-4">
                    <Upload className="w-8 h-8 text-zinc-600" />
                  </div>
                  <p className="text-zinc-400 font-medium">Esta carpeta está vacía</p>
                  <p className="text-sm text-zinc-600 mt-1">Arrastra archivos aquí para subir</p>
                </div>
              )}

              <div className={`grid gap-4 ${viewMode === 'grid' ? 'grid-cols-2 md:grid-cols-4 lg:grid-cols-6' : 'grid-cols-1'}`}>
                {folderDocuments.map((doc) => (
                  viewMode === 'grid' ? (
                    <Card
                      key={doc.id}
                      className="bg-zinc-900/50 border-zinc-800/50 group cursor-pointer hover:bg-zinc-800 hover:border-blue-500/30 transition-all overflow-hidden relative"
                      onClick={() => setSelectedDocument(doc)}
                    >
                      <div className="aspect-[4/3] bg-zinc-950/50 flex items-center justify-center border-b border-zinc-800/50 group-hover:border-zinc-800 transition-colors relative">
                        {/* Mock Preview Tint */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

                        {getFileIcon(doc.mimeType)}

                        <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <Button variant="secondary" size="icon" className="h-6 w-6">
                            <MoreHorizontal className="w-3 h-3" />
                          </Button>
                        </div>
                      </div>
                      <div className="p-3">
                        <p className="font-medium text-zinc-200 text-sm truncate" title={doc.name}>{doc.name}</p>
                        <div className="flex items-center justify-between mt-2">
                          <span className="text-[10px] text-zinc-500 bg-zinc-900 px-1.5 py-0.5 rounded border border-zinc-800">
                            {formatFileSize(doc.fileSize)}
                          </span>
                          {doc.status === 'signed' && <CheckCircle2 className="w-3 h-3 text-emerald-500" />}
                        </div>
                      </div>
                    </Card>
                  ) : (
                    <div
                      key={doc.id}
                      onClick={() => setSelectedDocument(doc)}
                      className="flex items-center gap-4 p-3 rounded-lg hover:bg-zinc-900 border border-transparent hover:border-zinc-800 cursor-pointer group"
                    >
                      <div className="p-2 bg-zinc-950 rounded border border-zinc-800">
                        {getFileIcon(doc.mimeType)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-zinc-200 truncate">{doc.name}</p>
                        <p className="text-xs text-zinc-500">v{doc.version} • {new Date(doc.updatedAt).toLocaleDateString()}</p>
                      </div>
                      <div className="text-sm text-zinc-400 w-32 text-right">
                        {formatFileSize(doc.fileSize)}
                      </div>
                    </div>
                  )
                ))}
              </div>
            </section>

          </div>
        </div>
      </div>

      {/* NEW FOLDER DIALOG */}
      <Dialog open={isNewFolderOpen} onOpenChange={setIsNewFolderOpen}>
        <DialogContent className="bg-[#18181B] border-[#27272A] sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-white">Nueva Carpeta</DialogTitle>
            <DialogDescription className="text-zinc-500">
              Crea una carpeta para organizar tus documentos.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label className="text-zinc-400">Nombre</Label>
              <Input
                value={newFolderName}
                onChange={(e) => setNewFolderName(e.target.value)}
                className="bg-zinc-900 border-zinc-800 text-white"
                placeholder="Ej: Contratos 2024"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setIsNewFolderOpen(false)} className="text-zinc-400">Cancelar</Button>
            <Button onClick={handleCreateFolder} className="bg-blue-600 text-white hover:bg-blue-700">
              Crear Carpeta
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* UPLOAD DIALOG */}
      <Dialog open={isUploadOpen} onOpenChange={setIsUploadOpen}>
        <DialogContent className="bg-[#18181B] border-[#27272A] sm:max-w-xl">
          <DialogHeader>
            <DialogTitle className="text-white">Subir Archivos</DialogTitle>
          </DialogHeader>
          <div
            className="border-2 border-dashed border-zinc-800 hover:border-blue-500/50 bg-zinc-900/50 rounded-xl p-12 flex flex-col items-center justify-center transition-all cursor-pointer"
          >
            <div className="w-16 h-16 bg-zinc-900 rounded-full flex items-center justify-center mb-4">
              <CloudUpload className="w-8 h-8 text-blue-500" />
            </div>
            <p className="text-zinc-300 font-medium text-lg">Haz clic o arrastra archivos aquí</p>
            <p className="text-zinc-500 text-sm mt-2">Soporta PDF, DOCX, XLSX, PNG, JPG (Max 50MB)</p>
          </div>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setIsUploadOpen(false)} className="text-zinc-400">Cancelar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* File Detail Dialog (PREVIEW) */}
      {selectedDocument && (
        <Dialog open={!!selectedDocument} onOpenChange={() => setSelectedDocument(null)}>
          <DialogContent className="bg-[#18181B] border-[#27272A] max-w-5xl p-0 overflow-hidden flex flex-col md:flex-row h-[85vh]">

            {/* Left: Preview */}
            <div className="flex-1 bg-[#09090B] flex flex-col relative border-r border-[#27272A]">
              <div className="h-14 border-b border-[#27272A] flex items-center justify-between px-4 bg-[#09090B]">
                <span className="text-zinc-400 text-sm">Vista Previa</span>
                <div className="flex gap-2">
                  <Button variant="ghost" size="icon" className="h-8 w-8 text-zinc-400"><Download className="w-4 h-4" /></Button>
                  <Button variant="ghost" size="icon" className="h-8 w-8 text-zinc-400"><Share2 className="w-4 h-4" /></Button>
                </div>
              </div>
              <div className="flex-1 flex items-center justify-center p-8 bg-zinc-950/50">
                <div className="text-center space-y-4">
                  <div className="w-32 h-32 mx-auto rounded-2xl bg-zinc-900 flex items-center justify-center border border-zinc-800 shadow-2xl">
                    {getFileIcon(selectedDocument.mimeType)}
                  </div>
                  <p className="text-zinc-500">Vista previa del archivo no disponible</p>
                </div>
              </div>
            </div>

            {/* Right: Metadata */}
            <div className="w-full md:w-[400px] bg-[#18181B] flex flex-col">
              <div className="p-6 border-b border-[#27272A]">
                <h2 className="text-xl font-bold text-white leading-tight mb-2">{selectedDocument.name}</h2>
                <Badge variant="secondary" className="bg-zinc-800 text-zinc-400 hover:bg-zinc-800">{selectedDocument.mimeType}</Badge>
              </div>

              <div className="flex-1 overflow-y-auto p-6 space-y-8">

                {/* Description */}
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">Descripción</label>
                  <p className="text-zinc-300 text-sm leading-relaxed">
                    {selectedDocument.description || "Sin descripción proporcionada."}
                  </p>
                </div>

                <div className="h-px bg-zinc-800" />

                {/* Status */}
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">Estado</label>
                  <div className="flex items-center gap-2">
                    {selectedDocument.status === 'signed' ? (
                      <Badge className="bg-emerald-500/10 text-emerald-500 border-emerald-500/20 hover:bg-emerald-500/20 px-3 py-1">Firmado</Badge>
                    ) : (
                      <Badge className="bg-yellow-500/10 text-yellow-500 border-yellow-500/20 hover:bg-yellow-500/20 px-3 py-1">Pendiente</Badge>
                    )}
                    <span className="text-xs text-zinc-500 ml-auto">Versión {selectedDocument.version}</span>
                  </div>
                </div>

                {/* Metadata Grid */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-3 rounded-lg bg-zinc-900/50 border border-zinc-800">
                    <span className="text-xs text-zinc-500 block mb-1">Tamaño</span>
                    <span className="text-sm text-white font-medium">{formatFileSize(selectedDocument.fileSize)}</span>
                  </div>
                  <div className="p-3 rounded-lg bg-zinc-900/50 border border-zinc-800">
                    <span className="text-xs text-zinc-500 block mb-1">Tipo</span>
                    <span className="text-sm text-white font-medium truncate">{selectedDocument.category}</span>
                  </div>
                </div>

                {/* Dates */}
                <div className="space-y-3 pt-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-zinc-500">Creado</span>
                    <span className="text-zinc-300">{new Date(selectedDocument.createdAt).toLocaleDateString()}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-zinc-500">Última edición</span>
                    <span className="text-zinc-300">{new Date(selectedDocument.updatedAt).toLocaleDateString()}</span>
                  </div>
                </div>

              </div>

              {/* Actions Footer */}
              <div className="p-6 border-t border-[#27272A] bg-zinc-900/30">
                <div className="grid grid-cols-2 gap-3">
                  <Button variant="outline" className="border-zinc-800 hover:bg-zinc-800 text-zinc-300">
                    <PenTool className="w-4 h-4 mr-2" /> Editar
                  </Button>
                  <Button variant="ghost" className="text-red-400 hover:text-red-300 hover:bg-red-500/10">
                    <Trash2 className="w-4 h-4 mr-2" /> Eliminar
                  </Button>
                </div>
              </div>

            </div>
          </DialogContent>
        </Dialog>
      )}

    </div>
  )
}
