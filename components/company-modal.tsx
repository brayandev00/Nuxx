"use client"

import { useState, useRef } from "react"
import Image from "next/image"
import { useTenant } from "@/lib/tenant-context"
import {
    Dialog,
    DialogContent,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
    Building2,
    Clock,
    DollarSign,
    Globe,
    Mail,
    MapPin,
    Phone,
    Users,
    HardDrive,
    CheckCircle2,
    ExternalLink,
    Crown,
    Loader2,
    Upload,
} from "lucide-react"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

interface CompanyModalProps {
    open: boolean
    onOpenChange: (open: boolean) => void
}

export function CompanyModal({ open, onOpenChange }: CompanyModalProps) {
    const { currentTenant, uploadTenantLogo, updateTenant } = useTenant()
    const [activeTab, setActiveTab] = useState("overview")
    const [isUploading, setIsUploading] = useState(false)
    const fileInputRef = useRef<HTMLInputElement>(null)

    // Ensure safeTenant is always defined to prevent runtime errors
    const safeTenant = currentTenant || {
        id: "demo-tenant",
        name: "Empresa Demo",
        slug: "empresa-demo",
        plan: "starter" as const,
        status: "active" as const,
        createdAt: new Date().toISOString(),
        maxUsers: 5,
        features: [],
        settings: {
            currency: "COP",
            timezone: "America/Bogota",
            language: "es",
            fiscalYearStart: "01-01",
            allowCustomRoles: false,
            modules: ["dashboard"],
        },
        logo: undefined,
        branding: {
            primaryColor: "#000000",
            companySlogan: "",
            website: "",
            phone: "",
            address: "",
            email: ""
        }
    }

    const tenantDetails = {
        address: safeTenant.branding?.address || "Calle 123, Ciudad Empresarial",
        phone: safeTenant.branding?.phone || "+57 300 123 4567",
        website: safeTenant.branding?.website || "https://lineaspereiranas.com",
        email: safeTenant.branding?.email || "contacto@lineaspereiranas.com",
    }

    const isEnterprise = safeTenant.plan === "enterprise"

    const handleLogoClick = () => {
        fileInputRef.current?.click()
    }

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (!file) return

        setIsUploading(true)
        try {
            await uploadTenantLogo(file)
        } finally {
            setIsUploading(false)
        }
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[500px] p-0 overflow-hidden bg-zinc-950 border-zinc-900 shadow-2xl">
                {/* Header */}
                <div className="p-5 bg-zinc-950">
                    <div className="flex items-start justify-between mb-6">
                        <div className="flex gap-4">
                            <div className="relative group">
                                <div className="w-16 h-16 rounded-xl bg-zinc-900 border border-zinc-800 flex items-center justify-center shrink-0 overflow-hidden">
                                    {safeTenant.logo ? (
                                        <Image
                                            src={safeTenant.logo}
                                            alt={safeTenant.name}
                                            width={64}
                                            height={64}
                                            className="w-full h-full object-cover"
                                        />
                                    ) : (
                                        <Building2 className="w-8 h-8 text-emerald-500" />
                                    )}
                                </div>
                                <div className={`absolute -bottom-1 -right-1 w-3.5 h-3.5 border-2 border-zinc-950 rounded-full ${safeTenant.status === 'active' ? 'bg-emerald-500' : 'bg-red-500'}`} />
                            </div>

                            <div className="space-y-1">
                                <h2 className="text-xl font-bold text-white tracking-tight leading-none">
                                    {safeTenant.name}
                                </h2>
                                <div className="flex items-center gap-2 text-zinc-500 text-xs">
                                    <span className="font-mono bg-zinc-900 px-1.5 py-0.5 rounded text-[10px]">
                                        {safeTenant.id.split('-')[0]}-...
                                    </span>
                                    <span>•</span>
                                    <span className="flex items-center gap-1">
                                        <Users className="w-3 h-3" />
                                        {safeTenant.maxUsers} Usuarios
                                    </span>
                                </div>
                            </div>
                        </div>

                        <div className="flex flex-col items-end gap-2">
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => window.open(`https://nuux.app/${safeTenant.slug}`, '_blank')}
                                className="h-8 text-xs bg-transparent border-emerald-500/20 text-emerald-500 hover:bg-emerald-500/10 hover:border-emerald-500/50"
                            >
                                <ExternalLink className="w-3 h-3 mr-1.5" />
                                Visitar Portal
                            </Button>
                            <input
                                type="file"
                                ref={fileInputRef}
                                className="hidden"
                                accept="image/*"
                                onChange={handleFileChange}
                            />
                        </div>
                    </div>

                    <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                        <TabsList className="w-full bg-zinc-900/50 border border-zinc-800/50 h-auto p-1 rounded-lg grid grid-cols-4">
                            {["overview", "details", "modules", "integrations"].map((tab) => (
                                <TabsTrigger
                                    key={tab}
                                    value={tab}
                                    className="text-[11px] font-medium py-1.5 rounded-md data-[state=active]:bg-zinc-800 data-[state=active]:text-white text-zinc-500 capitalize transition-all"
                                >
                                    {tab === "overview" && "General"}
                                    {tab === "details" && "Detalles"}
                                    {tab === "modules" && "Módulos"}
                                    {tab === "integrations" && "Conexiones"}
                                </TabsTrigger>
                            ))}
                        </TabsList>
                    </Tabs>
                </div>

                {/* Content */}
                <div className="p-6 pt-0">
                    <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                        {/* Wrapper for content projection since TabsList is now in header */}

                        <TabsContent value="overview" className="space-y-5 focus-visible:outline-none focus-visible:ring-0">
                            {/* Minimalism: Just Identity */}
                            <div className="flex gap-4 items-start">
                                <div
                                    onClick={handleLogoClick}
                                    className="w-20 h-20 shrink-0 rounded-xl bg-zinc-900/30 border border-dashed border-zinc-800 hover:border-emerald-500 hover:bg-zinc-800/50 transition-all cursor-pointer flex flex-col items-center justify-center gap-1 group"
                                >
                                    {isUploading ? (
                                        <Loader2 className="w-4 h-4 text-emerald-500 animate-spin" />
                                    ) : (
                                        <Upload className="w-4 h-4 text-zinc-600 group-hover:text-emerald-500" />
                                    )}
                                    <span className="text-[9px] font-medium text-zinc-600 group-hover:text-zinc-400">Logo</span>
                                </div>

                                <div className="flex-1 space-y-3">
                                    <div className="space-y-1">
                                        <Label className="text-[10px] text-zinc-500 uppercase font-bold tracking-wider">Nombre de Empresa</Label>
                                        <Input
                                            defaultValue={safeTenant.name}
                                            className="h-8 bg-zinc-900/50 border-zinc-800 text-white text-xs focus:ring-emerald-500/20 placeholder:text-zinc-700"
                                            onChange={(e) => updateTenant({ name: e.target.value })}
                                        />
                                    </div>
                                    <div className="space-y-1">
                                        <Label className="text-[10px] text-zinc-500 uppercase font-bold tracking-wider">Slogan</Label>
                                        <Input
                                            defaultValue={safeTenant.branding?.companySlogan}
                                            placeholder="Descripción corta..."
                                            className="h-8 bg-zinc-900/50 border-zinc-800 text-white text-xs focus:ring-emerald-500/20 placeholder:text-zinc-700"
                                            onChange={(e) => updateTenant({
                                                branding: { ...safeTenant.branding!, companySlogan: e.target.value }
                                            })}
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Optional: Minimal domain display */}
                            <div className="pt-2 border-t border-zinc-900/50 flex items-center justify-between">
                                <div className="space-y-0.5">
                                    <Label className="text-[10px] text-zinc-500 uppercase font-bold tracking-wider">Dominio</Label>
                                    <div className="flex items-center text-xs text-zinc-400">
                                        nuux.app/<span className="text-emerald-500 font-medium ml-0.5">{safeTenant.slug}</span>
                                    </div>
                                </div>
                                <div className="space-y-0.5 text-right">
                                    <Label className="text-[10px] text-zinc-500 uppercase font-bold tracking-wider">Plan</Label>
                                    <div className="text-xs text-white capitalize">{safeTenant.plan}</div>
                                </div>
                            </div>
                        </TabsContent>

                        <TabsContent value="details" className="space-y-4 focus-visible:outline-none focus-visible:ring-0">
                            <div className="grid grid-cols-1 gap-4">
                                <div className="space-y-3">
                                    <div className="flex items-start gap-2">
                                        <MapPin className="w-3.5 h-3.5 text-zinc-500 mt-0.5" />
                                        <div>
                                            <p className="text-xs font-medium text-zinc-300">Dirección Principal</p>
                                            <p className="text-xs text-zinc-500 break-words max-w-[300px]">{tenantDetails.address}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-2">
                                        <Globe className="w-3.5 h-3.5 text-zinc-500 mt-0.5" />
                                        <div>
                                            <p className="text-xs font-medium text-zinc-300">Sitio Web</p>
                                            <a href={tenantDetails.website} target="_blank" className="text-xs text-emerald-500 hover:underline flex items-center gap-1">
                                                {tenantDetails.website}
                                            </a>
                                        </div>
                                    </div>
                                </div>
                                <div className="space-y-3">
                                    <div className="flex items-start gap-2">
                                        <Mail className="w-3.5 h-3.5 text-zinc-500 mt-0.5" />
                                        <div>
                                            <p className="text-xs font-medium text-zinc-300">Email</p>
                                            <p className="text-xs text-zinc-500">{tenantDetails.email}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-2">
                                        <Phone className="w-3.5 h-3.5 text-zinc-500 mt-0.5" />
                                        <div>
                                            <p className="text-xs font-medium text-zinc-300">Teléfono</p>
                                            <p className="text-xs text-zinc-500">{tenantDetails.phone}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </TabsContent>

                        <TabsContent value="modules" className="space-y-4">
                            <ScrollArea className="h-[180px] pr-4">
                                <div className="flex flex-col gap-2">
                                    {(safeTenant.features || []).map((feature, i) => (
                                        <div key={i} className="flex items-center gap-2 p-2 rounded-lg bg-zinc-900/50 border border-zinc-800">
                                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                                            <span className="text-xs text-zinc-300 capitalize">{feature.replace('_', ' ')}</span>
                                        </div>
                                    ))}
                                </div>
                            </ScrollArea>
                        </TabsContent>

                        <TabsContent value="integrations" className="space-y-6">
                            <div className="p-4 rounded-xl border border-zinc-800 bg-zinc-900/30">
                                <div className="flex items-start justify-between">
                                    <div className="flex gap-4">
                                        <div className="w-12 h-12 rounded-lg bg-blue-500/10 flex items-center justify-center">
                                            <HardDrive className="w-6 h-6 text-blue-500" />
                                        </div>
                                        <div>
                                            <h3 className="font-medium text-white">Google Drive</h3>
                                            <p className="text-sm text-zinc-400 max-w-sm">
                                                Conecta tu almacenamiento corporativo para sincronizar facturas y documentos automáticamente.
                                            </p>
                                            {!isEnterprise && (
                                                <div className="flex items-center gap-2 mt-2 text-xs text-amber-500 bg-amber-500/10 w-fit px-2 py-1 rounded">
                                                    <Crown className="w-3 h-3" />
                                                    Requiere Plan Enterprise
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                    <Button
                                        disabled={!isEnterprise}
                                        variant={isEnterprise ? "default" : "secondary"}
                                        className={isEnterprise ? "bg-blue-600 hover:bg-blue-700" : "opacity-50"}
                                    >
                                        {isEnterprise ? "Conectar" : "Upgrade"}
                                    </Button>
                                </div>
                            </div>
                        </TabsContent>

                    </Tabs>
                </div>
            </DialogContent>
        </Dialog>
    )
}
