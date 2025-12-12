"use client"

import { useState } from "react"
import { useNuuxStore } from "@/lib/nuux-store"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card" // Using generic paths, assuming existence or will fix
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Check, Plus, Search, ShoppingCart, Truck, Package, Building2, Calendar, FileText, ChevronRight, MoreVertical } from "lucide-react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { Header } from "@/components/header" // Assuming this exists from other pages
import { cn } from "@/lib/utils"

export default function PurchasesPage() {
    const { purchaseOrders, suppliers, products, createPurchaseOrder } = useNuuxStore()

    // State
    const [activeTab, setActiveTab] = useState("overview")
    const [isNewOrderOpen, setIsNewOrderOpen] = useState(false)

    // -- Stats --
    const pendingOrders = purchaseOrders.filter(po => po.status === 'ordered' || po.status === 'pending_approval').length
    const totalSpent = purchaseOrders.reduce((acc, po) => acc + po.total, 0)

    return (
        <div className="min-h-screen">
            <Header title="Gestión de Compras" subtitle="Control de proveedores y órdenes de compra" />

            <div className="p-8 space-y-8">

                {/* KPI Cards */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <Card className="bg-card border-border">
                        <CardContent className="p-6 flex items-center justify-between">
                            <div>
                                <p className="text-sm text-muted-foreground mb-1">Órdenes Activas</p>
                                <h2 className="text-3xl font-bold">{pendingOrders}</h2>
                            </div>
                            <div className="bg-blue-500/10 p-3 rounded-full text-blue-500">
                                <ShoppingCart className="w-6 h-6" />
                            </div>
                        </CardContent>
                    </Card>
                    <Card className="bg-card border-border">
                        <CardContent className="p-6 flex items-center justify-between">
                            <div>
                                <p className="text-sm text-muted-foreground mb-1">Gastos (YTD)</p>
                                <h2 className="text-3xl font-bold">${(totalSpent / 1000000).toFixed(1)}M</h2>
                            </div>
                            <div className="bg-emerald-500/10 p-3 rounded-full text-emerald-500">
                                <Check className="w-6 h-6" />
                            </div>
                        </CardContent>
                    </Card>
                    <Card className="bg-card border-border">
                        <CardContent className="p-6 flex items-center justify-between">
                            <div>
                                <p className="text-sm text-muted-foreground mb-1">Proveedores</p>
                                <h2 className="text-3xl font-bold">{suppliers.length}</h2>
                            </div>
                            <div className="bg-purple-500/10 p-3 rounded-full text-purple-500">
                                <Building2 className="w-6 h-6" />
                            </div>
                        </CardContent>
                    </Card>
                    <Card className="bg-purple-600 text-white border-0">
                        <CardContent className="p-6 flex flex-col justify-center h-full text-center items-center cursor-pointer hover:bg-purple-700 transition-colors" onClick={() => setIsNewOrderOpen(true)}>
                            <Plus className="w-8 h-8 mb-2" />
                            <span className="font-bold">Nueva Orden</span>
                        </CardContent>
                    </Card>
                </div>

                <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
                    <TabsList className="bg-secondary">
                        <TabsTrigger value="overview">Resumen</TabsTrigger>
                        <TabsTrigger value="orders">Órdenes de Compra</TabsTrigger>
                        <TabsTrigger value="suppliers">Proveedores</TabsTrigger>
                    </TabsList>

                    {/* Overview Content */}
                    <TabsContent value="overview">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {/* Recent Orders List */}
                            <Card className="md:col-span-2">
                                <CardHeader>
                                    <CardTitle>Órdenes Recientes</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <Table>
                                        <TableHeader>
                                            <TableRow>
                                                <TableHead>Número</TableHead>
                                                <TableHead>Proveedor</TableHead>
                                                <TableHead>Fecha</TableHead>
                                                <TableHead>Estado</TableHead>
                                                <TableHead className="text-right">Total</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {purchaseOrders.length === 0 ? (
                                                <TableRow>
                                                    <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">No hay órdenes recientes.</TableCell>
                                                </TableRow>
                                            ) : (
                                                purchaseOrders.slice(0, 5).map(po => (
                                                    <TableRow key={po.id}>
                                                        <TableCell className="font-medium">{po.number}</TableCell>
                                                        <TableCell>{po.supplierName || 'N/A'}</TableCell>
                                                        <TableCell>{new Date(po.createdAt).toLocaleDateString()}</TableCell>
                                                        <TableCell>
                                                            <Badge variant="outline" className="capitalize">{po.status.replace('_', ' ')}</Badge>
                                                        </TableCell>
                                                        <TableCell className="text-right">${po.total.toLocaleString()}</TableCell>
                                                    </TableRow>
                                                ))
                                            )}
                                        </TableBody>
                                    </Table>
                                </CardContent>
                            </Card>

                            {/* Needs Attention / Alerts */}
                            <Card>
                                <CardHeader>
                                    <CardTitle>Por Aprobar</CardTitle>
                                    <CardDescription>Órdenes esperando revisión</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    {purchaseOrders.filter(po => po.status === 'pending_approval').length === 0 ? (
                                        <div className="flex flex-col items-center justify-center py-8 text-muted-foreground">
                                            <Check className="w-12 h-12 text-zinc-800 mb-2" />
                                            <p>Todo al día</p>
                                        </div>
                                    ) : (
                                        <div className="space-y-4">
                                            {purchaseOrders.filter(po => po.status === 'pending_approval').map(po => (
                                                <div key={po.id} className="flex items-center justify-between p-3 border rounded-lg">
                                                    <div>
                                                        <p className="font-bold text-sm">{po.number}</p>
                                                        <p className="text-xs text-muted-foreground">{po.supplierName}</p>
                                                    </div>
                                                    <Button size="sm" variant="outline">Revisar</Button>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </CardContent>
                            </Card>
                        </div>
                    </TabsContent>

                    {/* Orders Tab */}
                    <TabsContent value="orders">
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between">
                                <div>
                                    <CardTitle>Historial de Órdenes</CardTitle>
                                    <CardDescription>Todas las compras realizadas</CardDescription>
                                </div>
                                <div className="flex gap-2">
                                    <Input placeholder="Buscar orden..." className="w-[250px]" />
                                    <Button variant="outline"><FileText className="w-4 h-4 mr-2" /> Exportar</Button>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Número</TableHead>
                                            <TableHead>Proveedor</TableHead>
                                            <TableHead>Tipo</TableHead>
                                            <TableHead>Fecha Creación</TableHead>
                                            <TableHead>Estado</TableHead>
                                            <TableHead className="text-right">Total</TableHead>
                                            <TableHead></TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {purchaseOrders.map(po => (
                                            <TableRow key={po.id}>
                                                <TableCell className="font-mono">{po.number}</TableCell>
                                                <TableCell>{po.supplierName}</TableCell>
                                                <TableCell>
                                                    <Badge variant="secondary" className="capitalize">{po.type}</Badge>
                                                </TableCell>
                                                <TableCell>{new Date(po.createdAt).toLocaleDateString()}</TableCell>
                                                <TableCell>
                                                    <Badge className={cn(
                                                        po.status === 'approved' && "bg-green-500",
                                                        po.status === 'draft' && "bg-zinc-500",
                                                        po.status === 'pending_approval' && "bg-yellow-500"
                                                    )}>
                                                        {po.status}
                                                    </Badge>
                                                </TableCell>
                                                <TableCell className="text-right font-bold">${po.total.toLocaleString()}</TableCell>
                                                <TableCell>
                                                    <Button variant="ghost" size="icon"><ChevronRight className="w-4 h-4" /></Button>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    {/* Suppliers Tab */}
                    <TabsContent value="suppliers">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {suppliers.map(supplier => (
                                <Card key={supplier.id} className="hover:border-primary transition-colors cursor-pointer group">
                                    <CardHeader className="flex flex-row items-start justify-between pb-2">
                                        <div className="w-12 h-12 rounded-full bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center text-xl font-bold text-zinc-500">
                                            {supplier.name.substring(0, 2).toUpperCase()}
                                        </div>
                                        <Button variant="ghost" size="icon" className="opacity-0 group-hover:opacity-100"><MoreVertical className="w-4 h-4" /></Button>
                                    </CardHeader>
                                    <CardContent>
                                        <h3 className="font-bold text-lg mb-1">{supplier.name}</h3>
                                        <Badge variant="outline" className="mb-4 text-xs">{supplier.category}</Badge>

                                        <div className="space-y-2 text-sm text-zinc-500">
                                            <div className="flex justify-between border-b pb-1">
                                                <span>NIT</span>
                                                <span className="font-mono text-zinc-800 dark:text-zinc-200">{supplier.taxId}</span>
                                            </div>
                                            <div className="flex justify-between border-b pb-1">
                                                <span>Contacto</span>
                                                <span className="text-zinc-800 dark:text-zinc-200">{supplier.contactPerson}</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span>Rating</span>
                                                <span className="text-yellow-500">{'★'.repeat(supplier.rating || 0)}</span>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}

                            {/* Add Supplier Card */}
                            <Card className="border-dashed border-2 flex items-center justify-center hover:bg-secondary/50 cursor-pointer min-h-[250px]">
                                <div className="text-center text-muted-foreground">
                                    <Plus className="w-8 h-8 mx-auto mb-2" />
                                    <p>Nuevo Proveedor</p>
                                </div>
                            </Card>
                        </div>
                    </TabsContent>
                </Tabs>

                {/* New Order Dialog */}
                <CreateOrderDialog open={isNewOrderOpen} onOpenChange={setIsNewOrderOpen} suppliers={suppliers} onCreate={(order) => {
                    createPurchaseOrder(order)
                    setIsNewOrderOpen(false)
                }} />

            </div>
        </div>
    )
}

function CreateOrderDialog({ open, onOpenChange, suppliers, onCreate }: any) {
    const [step, setStep] = useState(1)
    const [data, setData] = useState({
        supplierId: '',
        supplierName: '',
        type: 'inventory',
        items: [] as any[],
        notes: ''
    })

    const handleSubmit = () => {
        const total = data.items.reduce((acc, i) => acc + (i.quantity * i.unitCost), 0)
        // Correct mappings
        onCreate({
            tenantId: 'tenant-001',
            number: `PO-${Date.now().toString().slice(-6)}`,
            supplierId: data.supplierId,
            supplierName: data.supplierName,
            type: data.type as any,
            status: 'pending_approval' as any,
            items: data.items,
            currency: 'COP',
            subtotal: total,
            tax: total * 0.19,
            total: total * 1.19,
            createdBy: 'current-user'
        })
        setStep(1) // Reset
        setData({ supplierId: '', supplierName: '', type: 'inventory', items: [], notes: '' })
    }

    const addItem = () => {
        setData({
            ...data,
            items: [...data.items, { id: Date.now(), description: 'Nuevo Item', quantity: 1, unitCost: 0, total: 0 }]
        })
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-2xl">
                <DialogHeader>
                    <DialogTitle>Nueva Orden de Compra</DialogTitle>
                    <DialogDescription>Paso {step} de 2: {step === 1 ? 'Información General' : 'Items'}</DialogDescription>
                </DialogHeader>

                {step === 1 ? (
                    <div className="space-y-4 py-4">
                        <div className="space-y-2">
                            <Label>Proveedor</Label>
                            <Select onValueChange={(val) => {
                                const sup = suppliers.find((s: any) => s.id === val)
                                setData({ ...data, supplierId: val, supplierName: sup?.name })
                            }}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Seleccionar proveedor" />
                                </SelectTrigger>
                                <SelectContent>
                                    {suppliers.map((s: any) => (
                                        <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <Label>Tipo de Compra</Label>
                            <div className="grid grid-cols-3 gap-4">
                                {['inventory', 'service', 'asset'].map((t) => (
                                    <div key={t}
                                        onClick={() => setData({ ...data, type: t })}
                                        className={cn("p-4 border rounded-lg cursor-pointer text-center capitalize hover:bg-secondary", data.type === t ? "border-primary bg-primary/10" : "")}
                                    >
                                        {t === 'inventory' ? 'Inventario' : t === 'service' ? 'Servicios' : 'Activos'}
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label>Notas</Label>
                            <Input placeholder="Referencia interna, proyecto..." value={data.notes} onChange={e => setData({ ...data, notes: e.target.value })} />
                        </div>
                    </div>
                ) : (
                    <div className="space-y-4 py-4">
                        <div className="border rounded-md p-4 bg-secondary/20 max-h-[300px] overflow-y-auto space-y-3">
                            {data.items.map((item, idx) => (
                                <div key={idx} className="grid grid-cols-12 gap-2 items-end">
                                    <div className="col-span-6">
                                        <Label className="text-xs">Descripción</Label>
                                        <Input value={item.description} onChange={(e) => {
                                            const newItems = [...data.items]
                                            newItems[idx].description = e.target.value
                                            setData({ ...data, items: newItems })
                                        }} />
                                    </div>
                                    <div className="col-span-2">
                                        <Label className="text-xs">Cant.</Label>
                                        <Input type="number" value={item.quantity} onChange={(e) => {
                                            const newItems = [...data.items]
                                            newItems[idx].quantity = Number(e.target.value)
                                            newItems[idx].total = newItems[idx].quantity * newItems[idx].unitCost
                                            setData({ ...data, items: newItems })
                                        }} />
                                    </div>
                                    <div className="col-span-3">
                                        <Label className="text-xs">Costo Unit.</Label>
                                        <Input type="number" value={item.unitCost} onChange={(e) => {
                                            const newItems = [...data.items]
                                            newItems[idx].unitCost = Number(e.target.value)
                                            newItems[idx].total = newItems[idx].quantity * newItems[idx].unitCost
                                            setData({ ...data, items: newItems })
                                        }} />
                                    </div>
                                </div>
                            ))}
                            <Button variant="ghost" className="w-full border-dashed border" onClick={addItem}>+ Agregar Item</Button>
                        </div>
                        <div className="flex justify-end text-xl font-bold">
                            Total: ${data.items.reduce((acc, i) => acc + i.total, 0).toLocaleString()}
                        </div>
                    </div>
                )}

                <DialogFooter>
                    {step === 2 && <Button variant="outline" onClick={() => setStep(1)}>Atras</Button>}
                    {step === 1 ? (
                        <Button onClick={() => setStep(2)} disabled={!data.supplierId}>Siguiente</Button>
                    ) : (
                        <Button onClick={handleSubmit}>Crear Orden</Button>
                    )}
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
