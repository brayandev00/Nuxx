"use client"
import { Header } from "@/components/header"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Progress } from "@/components/ui/progress"
import {
  Building2,
  Users,
  Package,
  DollarSign,
  Settings,
  MoreVertical,
  Plus,
  Globe,
  Shield,
  Clock,
  TrendingUp,
  CheckCircle2,
  AlertCircle,
} from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

const tenants = [
  {
    id: "tenant-001",
    name: "Acme Corporation",
    slug: "acme-corp",
    logo: "/generic-company-logo.png",
    plan: "enterprise",
    status: "active",
    users: 45,
    maxUsers: 50,
    storage: 78,
    createdAt: "2024-01-15",
    mrr: 2500,
  },
  {
    id: "tenant-002",
    name: "Tech Solutions MX",
    slug: "techsol-mx",
    logo: "/tech-company-logo.jpg",
    plan: "professional",
    status: "active",
    users: 18,
    maxUsers: 25,
    storage: 45,
    createdAt: "2024-03-20",
    mrr: 990,
  },
  {
    id: "tenant-003",
    name: "Retail Plus",
    slug: "retail-plus",
    logo: "/retail-store-logo.png",
    plan: "starter",
    status: "trial",
    users: 5,
    maxUsers: 10,
    storage: 12,
    createdAt: "2024-11-01",
    mrr: 0,
  },
]

const planColors = {
  starter: "bg-gray-500/20 text-gray-400",
  professional: "bg-blue-500/20 text-blue-400",
  enterprise: "bg-primary/20 text-primary",
}

const statusColors = {
  active: "bg-primary/20 text-primary",
  suspended: "bg-destructive/20 text-destructive",
  trial: "bg-amber-500/20 text-amber-400",
}

export default function TenantsPage() {
  return (
    <>
      <Header title="Gestion de Empresas" subtitle="Administra las organizaciones en el sistema multi-tenant" />

      <main className="flex-1 p-8 overflow-auto">
        {/* Stats Overview */}
        <div className="grid grid-cols-4 gap-6 mb-8">
          <Card className="bg-card border-border">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Empresas</p>
                  <p className="text-3xl font-bold text-foreground mt-1">{tenants.length}</p>
                </div>
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                  <Building2 className="w-6 h-6 text-primary" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card border-border">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Usuarios Totales</p>
                  <p className="text-3xl font-bold text-foreground mt-1">{tenants.reduce((a, t) => a + t.users, 0)}</p>
                </div>
                <div className="w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center">
                  <Users className="w-6 h-6 text-blue-500" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card border-border">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">MRR Total</p>
                  <p className="text-3xl font-bold text-foreground mt-1">
                    ${tenants.reduce((a, t) => a + t.mrr, 0).toLocaleString()}
                  </p>
                </div>
                <div className="w-12 h-12 rounded-xl bg-emerald-500/10 flex items-center justify-center">
                  <TrendingUp className="w-6 h-6 text-emerald-500" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card border-border">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">En Trial</p>
                  <p className="text-3xl font-bold text-foreground mt-1">
                    {tenants.filter((t) => t.status === "trial").length}
                  </p>
                </div>
                <div className="w-12 h-12 rounded-xl bg-amber-500/10 flex items-center justify-center">
                  <Clock className="w-6 h-6 text-amber-500" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tenants List */}
        <Card className="bg-card border-border">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-lg">Organizaciones</CardTitle>
                <CardDescription>Lista de todas las empresas registradas</CardDescription>
              </div>
              <Button className="bg-primary hover:bg-primary/90 text-primary-foreground">
                <Plus className="w-4 h-4 mr-2" />
                Nueva Empresa
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {tenants.map((tenant) => (
                <div
                  key={tenant.id}
                  className="p-6 bg-secondary/30 rounded-xl border border-border hover:border-primary/30 transition-colors"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-4">
                      <Avatar className="w-14 h-14 rounded-xl border-2 border-border">
                        <AvatarImage src={tenant.logo || "/placeholder.svg"} />
                        <AvatarFallback className="bg-primary/20 text-primary rounded-xl">
                          {tenant.name.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="flex items-center gap-3">
                          <h3 className="font-semibold text-lg text-foreground">{tenant.name}</h3>
                          <Badge className={planColors[tenant.plan as keyof typeof planColors]}>{tenant.plan}</Badge>
                          <Badge className={statusColors[tenant.status as keyof typeof statusColors]}>
                            {tenant.status === "active" && <CheckCircle2 className="w-3 h-3 mr-1" />}
                            {tenant.status === "trial" && <Clock className="w-3 h-3 mr-1" />}
                            {tenant.status === "suspended" && <AlertCircle className="w-3 h-3 mr-1" />}
                            {tenant.status}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-2 mt-1 text-sm text-muted-foreground">
                          <Globe className="w-4 h-4" />
                          {tenant.slug}.nuux.app
                        </div>
                        <div className="flex items-center gap-6 mt-4">
                          <div className="flex items-center gap-2 text-sm">
                            <Users className="w-4 h-4 text-muted-foreground" />
                            <span className="text-foreground">{tenant.users}</span>
                            <span className="text-muted-foreground">/ {tenant.maxUsers} usuarios</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm">
                            <DollarSign className="w-4 h-4 text-muted-foreground" />
                            <span className="text-foreground">${tenant.mrr}</span>
                            <span className="text-muted-foreground">/ mes</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <Button variant="outline" size="sm">
                        <Settings className="w-4 h-4 mr-2" />
                        Configurar
                      </Button>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreVertical className="w-4 h-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="bg-card border-border">
                          <DropdownMenuItem>
                            <Shield className="w-4 h-4 mr-2" />
                            Ver Roles
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Users className="w-4 h-4 mr-2" />
                            Ver Usuarios
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Package className="w-4 h-4 mr-2" />
                            Cambiar Plan
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>

                  {/* Usage Bar */}
                  <div className="mt-4 pt-4 border-t border-border">
                    <div className="flex items-center justify-between text-sm mb-2">
                      <span className="text-muted-foreground">Uso de almacenamiento</span>
                      <span className="text-foreground">{tenant.storage}%</span>
                    </div>
                    <Progress value={tenant.storage} className="h-2" />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </main>
    </>
  )
}
