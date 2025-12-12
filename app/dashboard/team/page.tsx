"use client"

import { useState } from "react"
import { useTenant } from "@/lib/tenant-context"
import { useNuuxStore } from "@/lib/nuux-store"
import { Header } from "@/components/header"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger, SheetFooter } from "@/components/ui/sheet"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import {
  Users, UserPlus, Search, Filter, Mail, Phone, MapPin,
  Linkedin, Github, Twitter, Globe, MoreVertical, Shield,
  Trash2, Edit, Award, Briefcase, Zap, CheckCircle2,
  CalendarDays, Clock, LayoutGrid, List as ListIcon, UserCheck
} from "lucide-react"
import type { User } from "@/lib/types"
import { cn } from "@/lib/utils"

export default function TeamPage() {
  const { getTenantUsers, addUser, updateUser, deleteUser, roles } = useTenant()
  const { attendanceRecords } = useNuuxStore()

  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  const [isSheetOpen, setIsSheetOpen] = useState(false)
  const [isNewUserOpen, setIsNewUserOpen] = useState(false)

  const users = getTenantUsers()

  // Filter
  const filteredUsers = users.filter(u =>
    u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    u.position.toLowerCase().includes(searchQuery.toLowerCase()) ||
    u.department.toLowerCase().includes(searchQuery.toLowerCase())
  )

  // Stats
  const activeUsers = users.filter(u => u.status === "active").length
  const totalPayroll = users.reduce((acc, u) => acc + (u.salary || 0), 0)

  return (
    <div className="min-h-screen pb-20">
      <Header title="Equipo & Talento" subtitle="Gestión avanzada de personal y cultura organizacional" />

      <div className="p-8 space-y-8">

        {/* Hero / Stats Section */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <StatCard icon={Users} label="Total Equipo" value={users.length} color="text-blue-500" bg="bg-blue-500/10" />
          <StatCard icon={UserCheck} label="Activos Ahora" value={activeUsers} color="text-green-500" bg="bg-green-500/10" />
          <StatCard icon={Briefcase} label="Departamentos" value={new Set(users.map(u => u.department)).size} color="text-purple-500" bg="bg-purple-500/10" />
          <Card className="bg-primary text-primary-foreground border-0 cursor-pointer hover:opacity-90 transition-opacity" onClick={() => setIsNewUserOpen(true)}>
            <CardContent className="p-6 flex flex-col items-center justify-center h-full">
              <UserPlus className="w-8 h-8 mb-2" />
              <span className="font-bold">Contratar Talento</span>
            </CardContent>
          </Card>
        </div>

        {/* Toolbar */}
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between bg-card p-4 rounded-xl border shadow-sm">
          <div className="relative w-full md:w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Buscar por nombre, cargo o skills..."
              className="pl-9 bg-secondary/50 border-0 focus-visible:ring-1"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="flex items-center gap-2 bg-secondary/50 p-1 rounded-lg">
            <Button
              variant={viewMode === 'grid' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setViewMode('grid')}
              className="h-8"
            >
              <LayoutGrid className="w-4 h-4 mr-2" /> Grid
            </Button>
            <Button
              variant={viewMode === 'list' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setViewMode('list')}
              className="h-8"
            >
              <ListIcon className="w-4 h-4 mr-2" /> Lista
            </Button>
          </div>
        </div>

        {/* Content */}
        {viewMode === 'grid' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredUsers.map(user => (
              <EmployeeCard
                key={user.id}
                user={user}
                onClick={() => { setSelectedUser(user); setIsSheetOpen(true) }}
              />
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-secondary/50 text-muted-foreground">
                    <tr>
                      <th className="text-left p-4">Empleado</th>
                      <th className="text-left p-4">Cargo</th>
                      <th className="text-left p-4">Departamento</th>
                      <th className="text-left p-4">Estado</th>
                      <th className="text-right p-4">Acciones</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {filteredUsers.map(user => (
                      <tr key={user.id} className="hover:bg-muted/50 cursor-pointer" onClick={() => { setSelectedUser(user); setIsSheetOpen(true) }}>
                        <td className="p-4 flex items-center gap-3">
                          <Avatar className="w-8 h-8">
                            <AvatarImage src={user.avatar} />
                            <AvatarFallback>{user.name.slice(0, 2).toUpperCase()}</AvatarFallback>
                          </Avatar>
                          <span className="font-medium">{user.name}</span>
                        </td>
                        <td className="p-4">{user.position}</td>
                        <td className="p-4"><Badge variant="outline">{user.department}</Badge></td>
                        <td className="p-4">
                          <Badge className={cn(
                            user.status === 'active' ? 'bg-green-500/10 text-green-500' :
                              user.status === 'vacation' ? 'bg-orange-500/10 text-orange-500' : 'bg-zinc-500/10 text-zinc-500'
                          )}>
                            {user.status === 'active' ? 'Activo' : user.status === 'vacation' ? 'Vacaciones' : 'Inactivo'}
                          </Badge>
                        </td>
                        <td className="p-4 text-right">
                          <Button variant="ghost" size="sm">Ver Perfil</Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Profile Sheet */}
        <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
          <SheetContent className="w-[100%] sm:w-[500px] sm:max-w-[600px] overflow-y-auto p-0">
            {selectedUser && (
              <UserProfileView
                user={selectedUser}
                roles={roles}
                onClose={() => setIsSheetOpen(false)}
                onUpdate={(updates: any) => updateUser(selectedUser.id, updates)}
                onDelete={() => { deleteUser(selectedUser.id); setIsSheetOpen(false) }}
              />
            )}
          </SheetContent>
        </Sheet>

        {/* Add User Dialog (Condensed) */}
        <AddUserDialog
          open={isNewUserOpen}
          onOpenChange={setIsNewUserOpen}
          roles={roles}
          onAdd={(data: any) => { addUser(data); setIsNewUserOpen(false) }}
        />

      </div>
    </div>
  )
}

function StatCard({ icon: Icon, label, value, color, bg }: any) {
  return (
    <Card>
      <CardContent className="p-6 flex items-center justify-between">
        <div>
          <p className="text-sm text-muted-foreground mb-1">{label}</p>
          <h2 className="text-3xl font-bold">{value}</h2>
        </div>
        <div className={cn("p-3 rounded-xl", bg, color)}>
          <Icon className="w-6 h-6" />
        </div>
      </CardContent>
    </Card>
  )
}

function EmployeeCard({ user, onClick }: { user: User, onClick: () => void }) {
  return (
    <Card className="group overflow-hidden hover:shadow-lg transition-all duration-300 border-border cursor-pointer" onClick={onClick}>
      <div className="h-24 bg-gradient-to-r from-primary/10 to-primary/5 relative">
        <Badge className={cn("absolute top-2 right-2 backdrop-blur-md",
          user.status === 'active' ? "bg-green-500/80 hover:bg-green-500" : "bg-zinc-500/80"
        )}>
          {user.status === 'active' ? 'Online' : 'Offline'}
        </Badge>
      </div>
      <CardContent className="pt-0 relative">
        <div className="flex justify-between items-start">
          <Avatar className="w-20 h-20 border-4 border-background -mt-10 shadow-sm">
            <AvatarImage src={user.avatar} />
            <AvatarFallback className="text-xl bg-secondary">{user.name.slice(0, 2).toUpperCase()}</AvatarFallback>
          </Avatar>
          <div className="mt-2 flex gap-1">
            {user.socialLinks?.linkedin && <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full"><Linkedin className="w-4 h-4 text-blue-600" /></Button>}
            {user.socialLinks?.github && <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full"><Github className="w-4 h-4" /></Button>}
          </div>
        </div>

        <div className="mt-3">
          <h3 className="font-bold text-lg leading-tight">{user.name}</h3>
          <p className="text-primary text-sm font-medium">{user.position}</p>
          <p className="text-muted-foreground text-xs mt-1">{user.department}</p>
        </div>

        <div className="mt-4 flex flex-wrap gap-1">
          {user.skills?.slice(0, 3).map((skill, i) => (
            <Badge key={i} variant="secondary" className="text-[10px] font-normal">{skill}</Badge>
          ))}
          {(user.skills?.length || 0) > 3 && (
            <Badge variant="secondary" className="text-[10px] font-normal">+{user.skills!.length - 3}</Badge>
          )}
        </div>

        <div className="mt-4 pt-4 border-t flex justify-between items-center text-xs text-muted-foreground">
          <div className="flex items-center gap-1">
            <MapPin className="w-3 h-3" /> {user.location || "Remoto"}
          </div>
          <div>
            Ver Perfil →
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

function UserProfileView({ user, roles, onClose, onUpdate, onDelete }: any) {
  const [editMode, setEditMode] = useState(false)
  const [formData, setFormData] = useState(user)

  const handleSave = () => {
    onUpdate(formData)
    setEditMode(false)
  }

  return (
    <div className="h-full flex flex-col bg-background">
      {/* Header / Cover */}
      <div className="h-40 bg-gradient-to-br from-primary/80 to-purple-600 relative shrink-0">
        <Button variant="ghost" size="icon" className="absolute top-4 left-4 text-white hover:bg-white/20" onClick={onClose}>
          <span className="sr-only">Cerrar</span>
          <LayoutGrid className="w-5 h-5" />
        </Button>
        <div className="absolute bottom-0 left-0 w-full p-6 bg-gradient-to-t from-black/50 to-transparent">
          <h2 className="text-2xl font-bold text-white">{user.name}</h2>
          <p className="text-white/80">{user.position} @ {user.department}</p>
        </div>
      </div>

      <ScrollArea className="flex-1">
        <div className="p-6 space-y-8">

          {/* Basic Info */}
          <div className="flex items-start gap-4">
            <Avatar className="w-24 h-24 border-4 border-background -mt-16 shadow-lg">
              <AvatarImage src={user.avatar} />
              <AvatarFallback className="text-2xl">{user.name.slice(0, 2)}</AvatarFallback>
            </Avatar>
            <div className="pt-2 flex-1 flex justify-end gap-2">
              {editMode ? (
                <>
                  <Button variant="outline" onClick={() => setEditMode(false)}>Cancelar</Button>
                  <Button onClick={handleSave}>Guardar Cambios</Button>
                </>
              ) : (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline">Acciones <MoreVertical className="w-4 h-4 ml-2" /></Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => setEditMode(true)}><Edit className="w-4 h-4 mr-2" /> Editar Perfil</DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem className="text-red-500" onClick={onDelete}><Trash2 className="w-4 h-4 mr-2" /> Desactivar / Eliminar</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              )}
            </div>
          </div>

          {editMode ? (
            <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Nombre</Label>
                  <Input value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} />
                </div>
                <div className="space-y-2">
                  <Label>Cargo</Label>
                  <Input value={formData.position} onChange={e => setFormData({ ...formData, position: e.target.value })} />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Departamento</Label>
                <Input value={formData.department} onChange={e => setFormData({ ...formData, department: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label>Bio / Sobre mí</Label>
                <Textarea value={formData.bio} onChange={e => setFormData({ ...formData, bio: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label>Skills (separados por coma)</Label>
                <Input value={formData.skills?.join(', ')} onChange={e => setFormData({ ...formData, skills: e.target.value.split(',').map((s: string) => s.trim()) })} />
              </div>
            </div>
          ) : (
            <div className="space-y-6">

              {/* Bio */}
              <div className="prose dark:prose-invert">
                <h3 className="font-semibold text-lg">Sobre mí</h3>
                <p className="text-muted-foreground">{user.bio || "Este usuario aún no ha escrito su biografía. ¡Anímalo a completar su perfil!"}</p>
              </div>

              {/* Contact Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 rounded-xl bg-secondary/30 flex items-center gap-3">
                  <Mail className="w-5 h-5 text-primary" />
                  <div className="overflow-hidden">
                    <p className="text-xs text-muted-foreground">Email Corporativo</p>
                    <p className="font-medium truncate">{user.email}</p>
                  </div>
                </div>
                <div className="p-4 rounded-xl bg-secondary/30 flex items-center gap-3">
                  <Phone className="w-5 h-5 text-green-500" />
                  <div>
                    <p className="text-xs text-muted-foreground">Teléfono</p>
                    <p className="font-medium">{user.phone || "No registrado"}</p>
                  </div>
                </div>
                <div className="p-4 rounded-xl bg-secondary/30 flex items-center gap-3">
                  <Shield className="w-5 h-5 text-purple-500" />
                  <div>
                    <p className="text-xs text-muted-foreground">Rol / Acceso</p>
                    <p className="font-medium">{roles.find((r: any) => r.id === user.roleId)?.name || "Empleado"}</p>
                  </div>
                </div>
                <div className="p-4 rounded-xl bg-secondary/30 flex items-center gap-3">
                  <CalendarDays className="w-5 h-5 text-orange-500" />
                  <div>
                    <p className="text-xs text-muted-foreground">Fecha Ingreso</p>
                    <p className="font-medium">{new Date(user.hireDate).toLocaleDateString()}</p>
                  </div>
                </div>
              </div>

              {/* Skills */}
              <div>
                <h3 className="font-semibold text-lg mb-3">Habilidades & Expertise</h3>
                <div className="flex flex-wrap gap-2">
                  {user.skills && user.skills.length > 0 ? user.skills.map((skill: string) => (
                    <Badge key={skill} variant="secondary" className="px-3 py-1 text-sm bg-secondary hover:bg-secondary/80">
                      {skill}
                    </Badge>
                  )) : (
                    <p className="text-muted-foreground text-sm">Sin habilidades registradas</p>
                  )}
                </div>
              </div>

            </div>
          )}

        </div>
      </ScrollArea>
    </div>
  )
}

function AddUserDialog({ open, onOpenChange, onAdd, roles }: any) {
  const [data, setData] = useState({
    name: '', email: '', position: '', department: '', roleId: 'role-employee', status: 'active', hireDate: new Date().toISOString().split('T')[0]
  })

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Contratar Nuevo Talento</DialogTitle>
          <DialogDescription>Añade un nuevo miembro al equipo.</DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label>Nombre Completo</Label>
            <Input onChange={e => setData({ ...data, name: e.target.value })} />
          </div>
          <div className="space-y-2">
            <Label>Email</Label>
            <Input type="email" onChange={e => setData({ ...data, email: e.target.value })} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Cargo</Label>
              <Input onChange={e => setData({ ...data, position: e.target.value })} />
            </div>
            <div className="space-y-2">
              <Label>Departamento</Label>
              <Input onChange={e => setData({ ...data, department: e.target.value })} />
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button onClick={() => onAdd(data)}>Crear Empleado</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
