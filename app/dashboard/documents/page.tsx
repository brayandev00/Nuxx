"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
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
} from "lucide-react"
import type { Document, Folder as FolderType } from "@/lib/types"

const mockFolders: FolderType[] = [
  { id: "FLD-001", tenantId: "tenant-001", name: "Empleados", parentId: null, type: "system", createdAt: "2024-01-01" },
  { id: "FLD-002", tenantId: "tenant-001", name: "Proyectos", parentId: null, type: "system", createdAt: "2024-01-01" },
  { id: "FLD-003", tenantId: "tenant-001", name: "Clientes", parentId: null, type: "system", createdAt: "2024-01-01" },
  { id: "FLD-004", tenantId: "tenant-001", name: "Legal", parentId: null, type: "system", createdAt: "2024-01-01" },
  {
    id: "FLD-005",
    tenantId: "tenant-001",
    name: "Carlos Martinez",
    parentId: "FLD-001",
    type: "custom",
    entityType: "user",
    entityId: "user-001",
    createdAt: "2024-03-15",
  },
  {
    id: "FLD-006",
    tenantId: "tenant-001",
    name: "Proyecto Alpha",
    parentId: "FLD-002",
    type: "custom",
    entityType: "project",
    entityId: "prj-001",
    createdAt: "2024-06-01",
  },
]

const mockDocuments: Document[] = [
  {
    id: "DOC-001",
    tenantId: "tenant-001",
    name: "Contrato Laboral - Carlos Martinez.pdf",
    type: "contrato",
    category: "empleado",
    fileUrl: "/documents/contract-001.pdf",
    fileSize: 245000,
    mimeType: "application/pdf",
    folderId: "FLD-005",
    relatedEntityId: "user-001",
    relatedEntityType: "user",
    version: 2,
    versions: [
      {
        id: "V1",
        version: 1,
        fileUrl: "/docs/v1.pdf",
        changes: "Version inicial",
        createdBy: "user-001",
        createdAt: "2024-03-15",
      },
      {
        id: "V2",
        version: 2,
        fileUrl: "/docs/v2.pdf",
        changes: "Actualizacion de salario",
        createdBy: "user-001",
        createdAt: "2024-09-01",
      },
    ],
    status: "signed",
    signatures: [
      {
        id: "SIG-001",
        signerId: "user-001",
        signerName: "Carlos Martinez",
        signerEmail: "carlos@empresa.com",
        status: "signed",
        signedAt: "2024-03-16",
      },
      {
        id: "SIG-002",
        signerId: "user-002",
        signerName: "CEO Empresa",
        signerEmail: "ceo@empresa.com",
        status: "signed",
        signedAt: "2024-03-17",
      },
    ],
    createdBy: "user-001",
    createdAt: "2024-03-15",
    updatedAt: "2024-09-01",
    tags: ["contrato", "laboral", "2024"],
  },
  {
    id: "DOC-002",
    tenantId: "tenant-001",
    name: "Brief Proyecto Alpha.docx",
    type: "brief",
    category: "proyecto",
    fileUrl: "/documents/brief-alpha.docx",
    fileSize: 128000,
    mimeType: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    folderId: "FLD-006",
    relatedEntityId: "prj-001",
    relatedEntityType: "project",
    version: 3,
    versions: [],
    status: "draft",
    signatures: [],
    createdBy: "user-002",
    createdAt: "2024-06-01",
    updatedAt: "2024-12-01",
    tags: ["brief", "proyecto", "alpha"],
  },
  {
    id: "DOC-003",
    tenantId: "tenant-001",
    name: "NDA Cliente ABC.pdf",
    type: "contrato",
    category: "cliente",
    fileUrl: "/documents/nda-abc.pdf",
    fileSize: 89000,
    mimeType: "application/pdf",
    folderId: "FLD-003",
    version: 1,
    versions: [],
    status: "pending_signature",
    signatures: [
      {
        id: "SIG-003",
        signerId: "external-001",
        signerName: "Juan Perez (ABC Corp)",
        signerEmail: "juan@abc.com",
        status: "pending",
      },
    ],
    createdBy: "user-001",
    createdAt: "2024-12-05",
    updatedAt: "2024-12-05",
    tags: ["nda", "confidencialidad"],
  },
]

export default function DocumentsPage() {
  const [documents] = useState(mockDocuments)
  const [folders] = useState(mockFolders)
  const [searchQuery, setSearchQuery] = useState("")
  const [currentFolder, setCurrentFolder] = useState<string | null>(null)
  const [selectedDocument, setSelectedDocument] = useState<Document | null>(null)

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
    if (mimeType.includes("pdf")) return <FileText className="w-5 h-5 text-red-500" />
    if (mimeType.includes("word")) return <FileText className="w-5 h-5 text-blue-500" />
    if (mimeType.includes("image")) return <ImageIcon className="w-5 h-5 text-primary" />
    return <File className="w-5 h-5 text-zinc-500" />
  }

  const getFolderIcon = (folder: FolderType) => {
    if (folder.name === "Empleados") return <Users className="w-5 h-5 text-blue-500" />
    if (folder.name === "Proyectos") return <Briefcase className="w-5 h-5 text-primary" />
    if (folder.name === "Clientes") return <Building2 className="w-5 h-5 text-yellow-500" />
    if (folder.name === "Legal") return <FileText className="w-5 h-5 text-red-500" />
    return <Folder className="w-5 h-5 text-primary" />
  }

  const getStatusBadge = (status: Document["status"]) => {
    switch (status) {
      case "signed":
        return (
          <Badge className="bg-primary/10 text-primary">
            <CheckCircle2 className="w-3 h-3 mr-1" /> Firmado
          </Badge>
        )
      case "pending_signature":
        return (
          <Badge className="bg-yellow-500/10 text-yellow-500">
            <Clock className="w-3 h-3 mr-1" /> Pendiente Firma
          </Badge>
        )
      case "draft":
        return (
          <Badge className="bg-zinc-500/10 text-zinc-400">
            <FileText className="w-3 h-3 mr-1" /> Borrador
          </Badge>
        )
      case "archived":
        return <Badge className="bg-blue-500/10 text-blue-500">Archivado</Badge>
      default:
        return null
    }
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Gestion Documental</h1>
          <p className="text-zinc-500">Repositorio centralizado de documentos</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="border-[#27272A] text-zinc-400 bg-transparent">
            <FolderOpen className="w-4 h-4 mr-2" />
            Nueva Carpeta
          </Button>
          <Button className="bg-primary hover:bg-primary/90">
            <Upload className="w-4 h-4 mr-2" />
            Subir Documento
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4">
        <Card className="bg-[#18181B] border-[#27272A] p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary/10">
              <FileText className="w-5 h-5 text-primary" />
            </div>
            <div>
              <p className="text-xs text-zinc-500">Total Documentos</p>
              <p className="text-lg font-bold text-white">{documents.length}</p>
            </div>
          </div>
        </Card>
        <Card className="bg-[#18181B] border-[#27272A] p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-yellow-500/10">
              <PenTool className="w-5 h-5 text-yellow-500" />
            </div>
            <div>
              <p className="text-xs text-zinc-500">Pendientes Firma</p>
              <p className="text-lg font-bold text-white">
                {documents.filter((d) => d.status === "pending_signature").length}
              </p>
            </div>
          </div>
        </Card>
        <Card className="bg-[#18181B] border-[#27272A] p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary/10">
              <CheckCircle2 className="w-5 h-5 text-primary" />
            </div>
            <div>
              <p className="text-xs text-zinc-500">Firmados</p>
              <p className="text-lg font-bold text-white">{documents.filter((d) => d.status === "signed").length}</p>
            </div>
          </div>
        </Card>
        <Card className="bg-[#18181B] border-[#27272A] p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-blue-500/10">
              <Folder className="w-5 h-5 text-blue-500" />
            </div>
            <div>
              <p className="text-xs text-zinc-500">Carpetas</p>
              <p className="text-lg font-bold text-white">{folders.length}</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Search */}
      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
          <Input
            className="pl-10 bg-[#18181B] border-[#27272A]"
            placeholder="Buscar documentos..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm">
        <button
          onClick={() => setCurrentFolder(null)}
          className={`hover:text-primary transition-colors ${!currentFolder ? "text-primary" : "text-zinc-400"}`}
        >
          Inicio
        </button>
        {currentFolderData && (
          <>
            <ChevronRight className="w-4 h-4 text-zinc-600" />
            {currentFolderData.parentId && (
              <>
                <button
                  onClick={() => setCurrentFolder(currentFolderData.parentId)}
                  className="text-zinc-400 hover:text-primary transition-colors"
                >
                  {folders.find((f) => f.id === currentFolderData.parentId)?.name}
                </button>
                <ChevronRight className="w-4 h-4 text-zinc-600" />
              </>
            )}
            <span className="text-white">{currentFolderData.name}</span>
          </>
        )}
      </div>

      {/* Content */}
      <div className="grid grid-cols-4 gap-4">
        {/* Show root folders or child folders */}
        {(currentFolder ? childFolders : rootFolders).map((folder) => (
          <Card
            key={folder.id}
            className="bg-[#18181B] border-[#27272A] p-4 cursor-pointer hover:border-primary/50 transition-colors"
            onClick={() => setCurrentFolder(folder.id)}
          >
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-xl bg-[#09090B]">{getFolderIcon(folder)}</div>
              <div>
                <p className="font-medium text-white">{folder.name}</p>
                <p className="text-xs text-zinc-500">
                  {folders.filter((f) => f.parentId === folder.id).length} carpetas,{" "}
                  {documents.filter((d) => d.folderId === folder.id).length} archivos
                </p>
              </div>
            </div>
          </Card>
        ))}

        {/* Show documents in current folder */}
        {folderDocuments.map((doc) => (
          <Card
            key={doc.id}
            className="bg-[#18181B] border-[#27272A] p-4 cursor-pointer hover:border-primary/50 transition-colors"
            onClick={() => setSelectedDocument(doc)}
          >
            <div className="flex items-start justify-between mb-3">
              <div className="p-3 rounded-xl bg-[#09090B]">{getFileIcon(doc.mimeType)}</div>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <MoreHorizontal className="w-4 h-4 text-zinc-500" />
              </Button>
            </div>
            <p className="font-medium text-white text-sm truncate mb-1">{doc.name}</p>
            <div className="flex items-center justify-between">
              <span className="text-xs text-zinc-500">{formatFileSize(doc.fileSize)}</span>
              {getStatusBadge(doc.status)}
            </div>
            {doc.version > 1 && (
              <div className="mt-2 flex items-center gap-1 text-xs text-zinc-500">
                <History className="w-3 h-3" />v{doc.version}
              </div>
            )}
          </Card>
        ))}
      </div>

      {/* Document Detail Modal */}
      {selectedDocument && (
        <Dialog open={!!selectedDocument} onOpenChange={() => setSelectedDocument(null)}>
          <DialogContent className="bg-[#18181B] border-[#27272A] max-w-2xl">
            <DialogHeader>
              <DialogTitle className="text-white flex items-center gap-3">
                {getFileIcon(selectedDocument.mimeType)}
                {selectedDocument.name}
              </DialogTitle>
            </DialogHeader>

            <div className="space-y-4 py-4">
              <div className="flex items-center justify-between p-4 rounded-xl bg-[#09090B]">
                <div className="space-y-1">
                  <p className="text-sm text-zinc-400">Estado</p>
                  {getStatusBadge(selectedDocument.status)}
                </div>
                <div className="space-y-1 text-right">
                  <p className="text-sm text-zinc-400">Version</p>
                  <p className="text-white">v{selectedDocument.version}</p>
                </div>
              </div>

              {/* Signatures */}
              {selectedDocument.signatures.length > 0 && (
                <div className="space-y-2">
                  <h4 className="text-sm font-medium text-zinc-400">Firmas</h4>
                  {selectedDocument.signatures.map((sig) => (
                    <div key={sig.id} className="flex items-center justify-between p-3 rounded-lg bg-[#09090B]">
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-8 h-8 rounded-full flex items-center justify-center ${
                            sig.status === "signed" ? "bg-primary/20" : "bg-yellow-500/20"
                          }`}
                        >
                          {sig.status === "signed" ? (
                            <CheckCircle2 className="w-4 h-4 text-primary" />
                          ) : (
                            <Clock className="w-4 h-4 text-yellow-500" />
                          )}
                        </div>
                        <div>
                          <p className="text-sm text-white">{sig.signerName}</p>
                          <p className="text-xs text-zinc-500">{sig.signerEmail}</p>
                        </div>
                      </div>
                      {sig.signedAt && <span className="text-xs text-zinc-500">{sig.signedAt}</span>}
                    </div>
                  ))}
                </div>
              )}

              {/* Version History */}
              {selectedDocument.versions.length > 0 && (
                <div className="space-y-2">
                  <h4 className="text-sm font-medium text-zinc-400">Historial de Versiones</h4>
                  {selectedDocument.versions.map((ver) => (
                    <div key={ver.id} className="flex items-center justify-between p-3 rounded-lg bg-[#09090B]">
                      <div>
                        <p className="text-sm text-white">Version {ver.version}</p>
                        <p className="text-xs text-zinc-500">{ver.changes}</p>
                      </div>
                      <span className="text-xs text-zinc-500">{ver.createdAt}</span>
                    </div>
                  ))}
                </div>
              )}

              {/* Actions */}
              <div className="flex gap-2 pt-4">
                <Button variant="outline" className="flex-1 border-[#27272A] bg-transparent">
                  <Eye className="w-4 h-4 mr-2" />
                  Vista Previa
                </Button>
                <Button variant="outline" className="flex-1 border-[#27272A] bg-transparent">
                  <Download className="w-4 h-4 mr-2" />
                  Descargar
                </Button>
                {selectedDocument.status === "pending_signature" && (
                  <Button className="flex-1 bg-primary hover:bg-primary/90">
                    <PenTool className="w-4 h-4 mr-2" />
                    Enviar Recordatorio
                  </Button>
                )}
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
}
