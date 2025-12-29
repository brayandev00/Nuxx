"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "sonner"
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
  CloudUpload,
  HardDrive,
  RefreshCw,
  LogOut,
  RotateCcw,
  AlertTriangle
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
import { useTenant } from "@/lib/tenant-context"
import { GoogleConnectButton } from "@/components/google-connect-button"

// Mock Data
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

const driveFolders: FolderType[] = [
  { id: "DRV-001", tenantId: "tenant-001", name: "Google Drive - Compartido", parentId: null, type: "system", createdAt: "2024-01-01" },
  { id: "DRV-002", tenantId: "tenant-001", name: "Drive - Finanzas", parentId: "DRV-001", type: "system", createdAt: "2024-01-01" },
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
    deletedAt: null
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
    deletedAt: null
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
    deletedAt: null
  },
]

export default function DocumentsPage() {
  const { currentTenant } = useTenant()
  const [documents, setDocuments] = useState(mockDocuments)
  const [folders, setFolders] = useState(mockFolders)
  const [searchQuery, setSearchQuery] = useState("")
  const [currentFolder, setCurrentFolder] = useState<string | null>(null)
  const [selectedDocument, setSelectedDocument] = useState<Document | null>(null)
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [isDragging, setIsDragging] = useState(false)

  // App State
  const [activeSection, setActiveSection] = useState<"drive" | "trash">("drive")
  const [isDriveConnected, setIsDriveConnected] = useState(false)
  const [isConnectingDrive, setIsConnectingDrive] = useState(false)

  // Dialog States
  const [isNewFolderOpen, setIsNewFolderOpen] = useState(false)
  const [isUploadOpen, setIsUploadOpen] = useState(false)
  const [isEditOpen, setIsEditOpen] = useState(false)

  // Form States
  const [newFolderName, setNewFolderName] = useState("")
  const [editName, setEditName] = useState("")
  const [editDesc, setEditDesc] = useState("")

  const rootFolders = folders.filter((f) => f.parentId === null)
  const currentFolderData = currentFolder ? folders.find((f) => f.id === currentFolder) : null
  const childFolders = folders.filter((f) => f.parentId === currentFolder)
  const folderDocuments = documents.filter((d) => d.folderId === currentFolder && !d.deletedAt)

  // Trash Logic
  const trashDocuments = documents.filter(d => d.deletedAt !== null)
  const activeDocumentsCount = documents.filter(d => d.deletedAt === null).length
  const trashCount = trashDocuments.length

  const handleConnectDrive = () => {
    // Legacy mock function - kept for reference if needed
  }

  /* 
   * FRONTEND-ONLY GOOGLE DRIVE INTEGRATION
   * Uses the Access Token to fetch files directly from Google API.
   * No backend required for this view-only mode.
   */
  const handleDriveSuccess = async (tokenResponse: any) => {
    setIsConnectingDrive(true)
    try {
      const accessToken = tokenResponse.access_token

      console.log("Drive Sync Debug:", {
        hasToken: !!accessToken,
        tokenLength: accessToken?.length,
        scopes: tokenResponse.scope
      })

      if (!accessToken) {
        throw new Error("No access token received from Google")
      }

      toast.info("Conectando con Drive...", { description: "Obteniendo tus archivos..." })

      // 1. Fetch Files from Google Drive API
      const response = await fetch("https://www.googleapis.com/drive/v3/files?pageSize=10&fields=files(id,name,mimeType,webViewLink,iconLink,size)&q=trashed=false", {
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      })

      if (!response.ok) {
        const errorBody = await response.text()
        console.error("Google Drive API Error:", response.status, response.statusText, errorBody)
        throw new Error(`Failed to fetch drive files: ${response.status} ${response.statusText}`)
      }

      const data = await response.json()

      // 2. Map Drive Files to our Folder/Document structure
      const driveDocs: Document[] = data.files.map((f: any) => ({
        id: f.id,
        tenantId: currentTenant?.id || "default",
        name: f.name,
        description: "Importado desde Google Drive",
        type: "asset",
        category: "general",
        fileUrl: f.webViewLink,
        fileSize: parseInt(f.size || "0"),
        mimeType: f.mimeType,
        folderId: "DRV-ROOT", // Check if folder or file
        relatedEntityId: null,
        relatedEntityType: null,
        version: 1,
        versions: [],
        status: "draft",
        signatures: [],
        createdBy: "google-user",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        tags: ["drive"],
        deletedAt: null
      }))

      // 3. Create a Root Drive Folder
      const rootDriveFolder: FolderType = {
        id: "DRV-ROOT",
        tenantId: currentTenant?.id || "default",
        name: "Mi Unidad (Google Drive)",
        parentId: null,
        type: "system",
        createdAt: new Date().toISOString()
      }

      setIsDriveConnected(true)
      setFolders(prev => [...prev, rootDriveFolder])
      setDocuments(prev => [...prev, ...driveDocs])

      toast.success("¡Sincronización Exitosa!", {
        description: `Se han importado ${driveDocs.length} archivos de tu Google Drive.`
      })

    } catch (error) {
      console.error("Drive Sync Error:", error)
      let msg = "No se pudieron obtener los archivos."
      if (error instanceof TypeError && error.message.includes("Failed to fetch")) {
        msg = "Error de conexión. Verifica tu ad-blocker o antivirus."
      } else if (error instanceof Error) {
        msg = error.message
      }
      toast.error("Error al sincronizar", { description: msg })
    } finally {
      setIsConnectingDrive(false)
    }
  }

  const handleDisconnectDrive = () => {
    setIsDriveConnected(false)
    setFolders(folders.filter(f => !f.id.startsWith("DRV")))
    toast.info("Cuenta de Google desconectada")
  }

  const handleDelete = (doc: Document) => {
    setDocuments(prev => prev.map(d => d.id === doc.id ? { ...d, deletedAt: new Date().toISOString() } : d))
    setSelectedDocument(null)
    toast.success("Archivo movido a la papelera")
  }

  const handleRestore = (doc: Document) => {
    setDocuments(prev => prev.map(d => d.id === doc.id ? { ...d, deletedAt: null } : d))
    toast.success("Archivo restaurado", { description: "Lo encontrarás en su carpeta original." })
  }

  const handlePermanentDelete = (doc: Document) => {
    setDocuments(prev => prev.filter(d => d.id !== doc.id))
    toast.error("Archivo eliminado permanentemente", { description: "Esta acción no se puede deshacer." })
  }

  const handleSign = (doc: Document) => {
    setDocuments(prev => prev.map(d => d.id === doc.id ? {
      ...d,
      status: "signed",
      signedAt: new Date().toISOString(),
      signedBy: "Jorge Fernández"
    } : d))
    setSelectedDocument(prev => prev ? { ...prev, status: "signed" } : null)
    toast.success("Documento firmado exitosamente")
  }

  const handleSaveEdit = () => {
    if (!selectedDocument) return
    setDocuments(prev => prev.map(d => d.id === selectedDocument.id ? { ...d, name: editName, description: editDesc } : d))
    setSelectedDocument(prev => prev ? { ...prev, name: editName, description: editDesc } : null)
    setIsEditOpen(false)
    toast.success("Cambios guardados")
  }

  const openEdit = (doc: Document) => {
    setEditName(doc.name)
    setEditDesc(doc.description || "")
    setSelectedDocument(doc)
    setIsEditOpen(true)
  }

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
    if (folder.name.includes("Drive")) return <HardDrive className="w-10 h-10 text-blue-500" />
    if (folder.name.includes("Humanos")) return <Users className="w-10 h-10 text-rose-400" />
    if (folder.name.includes("Proyectos")) return <Briefcase className="w-10 h-10 text-blue-400" />
    if (folder.name.includes("Finanzas")) return <Building2 className="w-10 h-10 text-emerald-400" />
    if (folder.name.includes("Marketing")) return <ImageIcon className="w-10 h-10 text-purple-400" />
    return <Folder className="w-10 h-10 text-zinc-600 fill-zinc-600/20" />
  }

  // ... Drag and Drop logic remains same ...
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
    setIsUploadOpen(true)
  }

  return (
    <div className="flex bg-black h-screen overflow-hidden">

      {/* Sidebar */}
      <div className="w-64 border-r border-[#27272A] bg-[#09090B] p-4 hidden md:flex flex-col gap-6">
        <div className="flex items-center gap-2 mb-2 px-2">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
            <FolderOpen className="w-5 h-5 text-white" />
          </div>
          <h2 className="font-bold text-lg text-white">Drive</h2>
        </div>

        <div className="space-y-1">
          <Button
            variant="ghost"
            className={cn("w-full justify-start", activeSection === 'drive' ? "bg-zinc-800 text-white" : "text-zinc-400 hover:text-white hover:bg-zinc-800")}
            onClick={() => setActiveSection("drive")}
          >
            <HardDrive className="w-4 h-4 mr-2" /> Mis Archivos
          </Button>
          <Button variant="ghost" className="w-full justify-start text-zinc-400 hover:text-white hover:bg-zinc-800">
            <Clock className="w-4 h-4 mr-2" /> Recientes
          </Button>
          <Button variant="ghost" className="w-full justify-start text-zinc-400 hover:text-white hover:bg-zinc-800">
            <CheckCircle2 className="w-4 h-4 mr-2" /> Firmados
          </Button>
          <Button
            variant="ghost"
            className={cn("w-full justify-start", activeSection === 'trash' ? "bg-red-500/10 text-red-500" : "text-zinc-400 hover:text-red-400 hover:bg-zinc-800")}
            onClick={() => { setActiveSection("trash"); setCurrentFolder(null); }}
          >
            <Trash2 className="w-4 h-4 mr-2" /> Papelera
            {trashCount > 0 && <span className="ml-auto text-xs bg-red-500 text-white px-1.5 rounded-full">{trashCount}</span>}
          </Button>
        </div>

        <div className="space-y-4 pt-4 border-t border-zinc-800">
          <p className="text-xs font-medium text-zinc-500 px-2 uppercase tracking-wider">Integraciones</p>
          <GoogleConnectButton
            onSuccess={handleDriveSuccess}
            isConnected={isDriveConnected}
            onDisconnect={handleDisconnectDrive}
          />
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
          <div className="flex items-center gap-2 text-sm text-zinc-400">
            {activeSection === 'trash' ? (
              <span className="text-red-500 font-medium flex items-center gap-2"><Trash2 className="w-4 h-4" /> Papelera de Reciclaje</span>
            ) : (
              <>
                <button onClick={() => setCurrentFolder(null)} className="hover:text-white transition-colors flex items-center gap-1">
                  <Folder className="w-4 h-4" /> Inicio
                </button>
                {currentFolderData && (
                  <>
                    <ChevronRight className="w-4 h-4" />
                    <span className="text-white font-medium">{currentFolderData.name}</span>
                  </>
                )}
              </>
            )}
          </div>

          <div className="flex items-center gap-3">
            {activeSection !== 'trash' && (
              <>
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
              </>
            )}
          </div>
        </div>

        {/* File Area */}
        <div className="flex-1 overflow-y-auto p-6 relative">

          {activeSection === 'trash' ? (
            <div className="max-w-[1920px] mx-auto space-y-8">
              {trashDocuments.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20 text-zinc-500">
                  <Trash2 className="w-16 h-16 mb-4 opacity-20" />
                  <p>La papelera está vacía</p>
                </div>
              ) : (
                <div className="grid gap-4 grid-cols-1 md:grid-cols-3 lg:grid-cols-4">
                  {trashDocuments.map(doc => (
                    <Card key={doc.id} className="bg-zinc-900/30 border-red-500/10 p-4 opacity-75 hover:opacity-100 transition-opacity">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="p-2 bg-zinc-950 rounded">{getFileIcon(doc.mimeType)}</div>
                        <div className="min-w-0">
                          <p className="text-white font-medium truncate">{doc.name}</p>
                          <p className="text-xs text-zinc-500">Eliminado el {new Date(doc.deletedAt!).toLocaleDateString()}</p>
                        </div>
                      </div>
                      <div className="flex gap-2 mt-2">
                        <Button size="sm" variant="secondary" className="w-full h-8 text-xs" onClick={() => handleRestore(doc)}>
                          <RotateCcw className="w-3 h-3 mr-1.5" /> Restaurar
                        </Button>
                        <Button size="icon" variant="destructive" className="h-8 w-8" onClick={() => handlePermanentDelete(doc)}>
                          <X className="w-3 h-3" />
                        </Button>
                      </div>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          ) : (
            <div className="max-w-[1920px] mx-auto space-y-8">
              {/* Folders */}
              <section>
                <h3 className="text-sm font-medium text-zinc-500 mb-4 flex items-center gap-2">
                  <Folder className="w-4 h-4" /> Carpetas
                </h3>
                <div className={`grid gap-4 grid-cols-2 md:grid-cols-4 lg:grid-cols-5`}>
                  {(currentFolder ? childFolders : rootFolders).map((folder) => (
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
                  ))}
                </div>
              </section>

              {/* Documents */}
              <section>
                <h3 className="text-sm font-medium text-zinc-500 mb-4 flex items-center gap-2">
                  <FileIcon className="w-4 h-4" /> Archivos
                </h3>
                <div className="grid gap-4 grid-cols-2 md:grid-cols-4 lg:grid-cols-6">
                  {folderDocuments.map((doc) => (
                    <Card
                      key={doc.id}
                      className="bg-zinc-900/50 border-zinc-800/50 group cursor-pointer hover:bg-zinc-800 hover:border-blue-500/30 transition-all overflow-hidden relative"
                      onClick={() => setSelectedDocument(doc)}
                    >
                      <div className="aspect-[4/3] bg-zinc-950/50 flex items-center justify-center border-b border-zinc-800/50 group-hover:border-zinc-800 transition-colors relative">
                        {getFileIcon(doc.mimeType)}
                        {doc.status === 'signed' && (
                          <div className="absolute top-2 right-2 bg-emerald-500 text-white text-[10px] uppercase font-bold px-1.5 py-0.5 rounded shadow-lg">Firmado</div>
                        )}
                      </div>
                      <div className="p-3">
                        <p className="font-medium text-zinc-200 text-sm truncate" title={doc.name}>{doc.name}</p>
                        <div className="flex items-center justify-between mt-2">
                          <span className="text-[10px] text-zinc-500 bg-zinc-900 px-1.5 py-0.5 rounded border border-zinc-800">
                            {formatFileSize(doc.fileSize)}
                          </span>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              </section>
            </div>
          )}

        </div>
      </div>

      {/* NEW FOLDER DIALOG */}
      <Dialog open={isNewFolderOpen} onOpenChange={setIsNewFolderOpen}>
        <DialogContent className="bg-[#18181B] border-[#27272A] sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-white">Nueva Carpeta</DialogTitle>
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
            <Button onClick={() => { setFolders([...folders, { id: `FLD-${Date.now()}`, tenantId: "1", name: newFolderName, parentId: currentFolder, type: "custom", createdAt: new Date().toISOString() }]); setIsNewFolderOpen(false); setNewFolderName("") }} className="bg-blue-600 text-white">Crear</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* EDIT DIALOG */}
      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent className="bg-[#18181B] border-[#27272A] sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-white">Editar Documento</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Nombre</Label>
              <Input value={editName} onChange={e => setEditName(e.target.value)} className="bg-zinc-900 border-zinc-800 text-white" />
            </div>
            <div className="space-y-2">
              <Label>Descripción</Label>
              <Textarea value={editDesc} onChange={e => setEditDesc(e.target.value)} className="bg-zinc-900 border-zinc-800 text-white" />
            </div>
          </div>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setIsEditOpen(false)}>Cancelar</Button>
            <Button onClick={handleSaveEdit} className="bg-emerald-600 text-white">Guardar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>


      {/* DETAIL DIALOG */}
      {selectedDocument && activeSection !== 'trash' && (
        <Dialog open={!!selectedDocument} onOpenChange={() => setSelectedDocument(null)}>
          <DialogContent className="bg-[#18181B] border-[#27272A] max-w-5xl p-0 overflow-hidden flex flex-col md:flex-row h-[85vh]">

            <div className="flex-1 bg-[#09090B] flex flex-col relative border-r border-[#27272A]">
              <div className="h-14 border-b border-[#27272A] flex items-center justify-center px-4 bg-[#09090B]"><span className="text-zinc-400 text-sm">Vista Previa</span></div>
              <div className="flex-1 flex items-center justify-center p-8 bg-zinc-950/50">
                <div className="text-center space-y-4">
                  <div className="w-32 h-32 mx-auto rounded-2xl bg-zinc-900 flex items-center justify-center border border-zinc-800 shadow-2xl relative">
                    {getFileIcon(selectedDocument.mimeType)}
                  </div>
                  <p className="text-zinc-500">Vista previa no disponible</p>
                </div>
              </div>
            </div>

            <div className="w-full md:w-[400px] bg-[#18181B] flex flex-col">
              <div className="p-6 border-b border-[#27272A]">
                <h2 className="text-xl font-bold text-white leading-tight mb-2">{selectedDocument.name}</h2>
                <div className="flex items-center gap-2">
                  <Badge variant="secondary" className="bg-zinc-800 text-zinc-400">{selectedDocument.mimeType}</Badge>
                  {selectedDocument.status === 'signed' && <Badge className="bg-emerald-500 text-white">Firmado</Badge>}
                </div>
              </div>

              <div className="flex-1 overflow-y-auto p-6 space-y-8">
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">Descripción</label>
                  <p className="text-zinc-300 text-sm leading-relaxed">{selectedDocument.description || "Sin descripción"}</p>
                </div>

                {selectedDocument.status === 'signed' && (
                  <div className="p-4 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-emerald-500 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-emerald-400">Firmado Digitalmente</p>
                      <p className="text-xs text-emerald-500/70 mt-1">Por {selectedDocument.signedBy || "Usuario"} el {new Date(selectedDocument.signedAt!).toLocaleDateString()}</p>
                    </div>
                  </div>
                )}

                <div className="grid grid-cols-2 gap-4">
                  <div className="p-3 bg-zinc-900 rounded border border-zinc-800">
                    <span className="text-xs text-zinc-500">Creado</span>
                    <p className="text-sm text-white">{new Date(selectedDocument.createdAt).toLocaleDateString()}</p>
                  </div>
                  <div className="p-3 bg-zinc-900 rounded border border-zinc-800">
                    <span className="text-xs text-zinc-500">Tamaño</span>
                    <p className="text-sm text-white">{formatFileSize(selectedDocument.fileSize)}</p>
                  </div>
                </div>
              </div>

              <div className="p-6 border-t border-[#27272A] bg-zinc-900/30 grid grid-cols-2 gap-3">
                <Button variant="outline" className="border-zinc-800 text-zinc-300" onClick={() => openEdit(selectedDocument)}>
                  <PenTool className="w-4 h-4 mr-2" /> Editar
                </Button>
                {selectedDocument.status !== 'signed' && (
                  <Button className="bg-blue-600 hover:bg-blue-700 text-white" onClick={() => handleSign(selectedDocument)}>
                    <PenTool className="w-4 h-4 mr-2" /> Firmar
                  </Button>
                )}
                <Button variant="ghost" className="col-span-2 text-red-500 hover:bg-red-500/10" onClick={() => handleDelete(selectedDocument)}>
                  <Trash2 className="w-4 h-4 mr-2" /> Mover a Papelera
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}

    </div>
  )
}
