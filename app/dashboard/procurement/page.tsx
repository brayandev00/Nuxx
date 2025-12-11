"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Plus,
  Search,
  Star,
  Phone,
  Mail,
  Truck,
  MoreHorizontal,
  Building2,
  Clock,
  FileText,
  TrendingDown,
  Scale,
} from "lucide-react"
import type { Supplier, SupplierQuote, PurchaseOrder } from "@/lib/types"

const mockSuppliers: (Supplier & { averageScore: number })[] = [
  {
    id: "SUP-001",
    tenantId: "tenant-001",
    name: "TechDistribuidores SA",
    email: "ventas@techdist.co",
    phone: "+57 601 234 5678",
    address: "Calle 100 #15-20, Bogota",
    contactPerson: "Juan Perez",
    products: ["PRD-001", "PRD-002"],
    rating: 4.5,
    paymentTerms: "30 dias",
    priceHistory: [],
    averageScore: 4.5,
  },
  {
    id: "SUP-002",
    tenantId: "tenant-001",
    name: "Importadora Global",
    email: "compras@impglobal.com",
    phone: "+57 602 345 6789",
    address: "Av. El Dorado #68-70, Bogota",
    contactPerson: "Maria Lopez",
    products: ["PRD-002", "PRD-003"],
    rating: 4.2,
    paymentTerms: "45 dias",
    priceHistory: [],
    averageScore: 4.2,
  },
  {
    id: "SUP-003",
    tenantId: "tenant-001",
    name: "Electronica del Sur",
    email: "pedidos@electrosur.co",
    phone: "+57 604 456 7890",
    address: "Carrera 7 #45-10, Medellin",
    contactPerson: "Carlos Ramirez",
    products: ["PRD-001"],
    rating: 3.8,
    paymentTerms: "15 dias",
    priceHistory: [],
    averageScore: 3.8,
  },
]

const mockQuotes: SupplierQuote[] = [
  {
    id: "QUO-001",
    tenantId: "tenant-001",
    supplierId: "SUP-001",
    supplierName: "TechDistribuidores SA",
    productId: "PRD-001",
    productName: 'MacBook Pro 14"',
    quantity: 10,
    unitPrice: 4500000,
    total: 45000000,
    deliveryDays: 5,
    validUntil: "2024-12-20",
    createdAt: "2024-12-05",
  },
  {
    id: "QUO-002",
    tenantId: "tenant-001",
    supplierId: "SUP-002",
    supplierName: "Importadora Global",
    productId: "PRD-001",
    productName: 'MacBook Pro 14"',
    quantity: 10,
    unitPrice: 4650000,
    total: 46500000,
    deliveryDays: 3,
    validUntil: "2024-12-18",
    createdAt: "2024-12-05",
  },
  {
    id: "QUO-003",
    tenantId: "tenant-001",
    supplierId: "SUP-003",
    supplierName: "Electronica del Sur",
    productId: "PRD-001",
    productName: 'MacBook Pro 14"',
    quantity: 10,
    unitPrice: 4400000,
    total: 44000000,
    deliveryDays: 10,
    validUntil: "2024-12-15",
    createdAt: "2024-12-05",
  },
]

const mockPurchaseOrders: PurchaseOrder[] = [
  {
    id: "PO-001",
    tenantId: "tenant-001",
    supplierId: "SUP-001",
    status: "approved",
    items: [{ productId: "PRD-001", quantity: 5, unitCost: 4500000, total: 22500000 }],
    subtotal: 22500000,
    tax: 4275000,
    total: 26775000,
    createdAt: "2024-12-01",
    createdBy: "user-001",
    approvedBy: "user-002",
  },
  {
    id: "PO-002",
    tenantId: "tenant-001",
    supplierId: "SUP-002",
    status: "pending",
    items: [{ productId: "PRD-002", quantity: 10, unitCost: 950000, total: 9500000 }],
    subtotal: 9500000,
    tax: 1805000,
    total: 11305000,
    createdAt: "2024-12-08",
    createdBy: "user-001",
  },
]

export default function ProcurementPage() {
  const [suppliers] = useState(mockSuppliers)
  const [quotes] = useState(mockQuotes)
  const [purchaseOrders] = useState(mockPurchaseOrders)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedQuotes, setSelectedQuotes] = useState<string[]>([])

  const filteredSuppliers = suppliers.filter(
    (sup) =>
      sup.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      sup.contactPerson.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const renderStars = (rating: number) => {
    return (
      <div className="flex items-center gap-0.5">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`w-3 h-3 ${star <= rating ? "fill-yellow-500 text-yellow-500" : "text-zinc-600"}`}
          />
        ))}
        <span className="ml-1 text-xs text-zinc-400">{rating.toFixed(1)}</span>
      </div>
    )
  }

  const getBestQuote = () => {
    if (quotes.length === 0) return null
    return quotes.reduce((best, current) => (current.unitPrice < best.unitPrice ? current : best))
  }

  const bestQuote = getBestQuote()

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Compras y Proveedores</h1>
          <p className="text-zinc-500">Gestiona tus proveedores y ordenes de compra</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="border-[#27272A] text-zinc-400 bg-transparent">
            <Scale className="w-4 h-4 mr-2" />
            Comparar Precios
          </Button>
          <Button className="bg-primary hover:bg-primary/90">
            <Plus className="w-4 h-4 mr-2" />
            Nueva Orden
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4">
        <Card className="bg-[#18181B] border-[#27272A] p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary/10">
              <Building2 className="w-5 h-5 text-primary" />
            </div>
            <div>
              <p className="text-xs text-zinc-500">Proveedores</p>
              <p className="text-lg font-bold text-white">{suppliers.length}</p>
            </div>
          </div>
        </Card>
        <Card className="bg-[#18181B] border-[#27272A] p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-yellow-500/10">
              <Clock className="w-5 h-5 text-yellow-500" />
            </div>
            <div>
              <p className="text-xs text-zinc-500">OC Pendientes</p>
              <p className="text-lg font-bold text-white">
                {purchaseOrders.filter((po) => po.status === "pending").length}
              </p>
            </div>
          </div>
        </Card>
        <Card className="bg-[#18181B] border-[#27272A] p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-blue-500/10">
              <FileText className="w-5 h-5 text-blue-500" />
            </div>
            <div>
              <p className="text-xs text-zinc-500">Cotizaciones</p>
              <p className="text-lg font-bold text-white">{quotes.length}</p>
            </div>
          </div>
        </Card>
        <Card className="bg-[#18181B] border-[#27272A] p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary/10">
              <TrendingDown className="w-5 h-5 text-primary" />
            </div>
            <div>
              <p className="text-xs text-zinc-500">Mejor Precio</p>
              <p className="text-lg font-bold text-white">
                {bestQuote ? `$${(bestQuote.unitPrice / 1000000).toFixed(1)}M` : "-"}
              </p>
            </div>
          </div>
        </Card>
      </div>

      <Tabs defaultValue="suppliers" className="space-y-4">
        <TabsList className="bg-[#18181B] border border-[#27272A]">
          <TabsTrigger value="suppliers">Proveedores</TabsTrigger>
          <TabsTrigger value="quotes">Cotizaciones</TabsTrigger>
          <TabsTrigger value="orders">Ordenes de Compra</TabsTrigger>
        </TabsList>

        {/* Suppliers Tab */}
        <TabsContent value="suppliers" className="space-y-4">
          <div className="flex items-center gap-4">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
              <Input
                className="pl-10 bg-[#18181B] border-[#27272A]"
                placeholder="Buscar proveedores..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Button className="bg-primary hover:bg-primary/90">
              <Plus className="w-4 h-4 mr-2" />
              Agregar Proveedor
            </Button>
          </div>

          <div className="grid grid-cols-3 gap-4">
            {filteredSuppliers.map((supplier) => (
              <Card key={supplier.id} className="bg-[#18181B] border-[#27272A] p-5">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                      <Building2 className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-white">{supplier.name}</h3>
                      <p className="text-sm text-zinc-500">{supplier.contactPerson}</p>
                    </div>
                  </div>
                  <Button variant="ghost" size="icon">
                    <MoreHorizontal className="w-4 h-4 text-zinc-500" />
                  </Button>
                </div>

                <div className="space-y-3">
                  {renderStars(supplier.rating)}

                  <div className="flex items-center gap-2 text-sm text-zinc-400">
                    <Mail className="w-4 h-4" />
                    <span>{supplier.email}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-zinc-400">
                    <Phone className="w-4 h-4" />
                    <span>{supplier.phone}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-zinc-400">
                    <Truck className="w-4 h-4" />
                    <span>Pago: {supplier.paymentTerms}</span>
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t border-[#27272A] flex gap-2">
                  <Button variant="outline" size="sm" className="flex-1 border-[#27272A] bg-transparent">
                    Ver Historial
                  </Button>
                  <Button size="sm" className="flex-1 bg-primary hover:bg-primary/90">
                    Solicitar Cotizacion
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Quotes Comparison Tab */}
        <TabsContent value="quotes" className="space-y-4">
          <Card className="bg-[#18181B] border-[#27272A] p-4">
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <Scale className="w-5 h-5 text-primary" />
              Comparador de Cotizaciones - MacBook Pro 14"
            </h3>
            <Table>
              <TableHeader>
                <TableRow className="border-[#27272A]">
                  <TableHead className="text-zinc-400">Proveedor</TableHead>
                  <TableHead className="text-zinc-400">Precio Unit.</TableHead>
                  <TableHead className="text-zinc-400">Cantidad</TableHead>
                  <TableHead className="text-zinc-400">Total</TableHead>
                  <TableHead className="text-zinc-400">Entrega</TableHead>
                  <TableHead className="text-zinc-400">Valido Hasta</TableHead>
                  <TableHead className="text-zinc-400">Accion</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {quotes.map((quote) => (
                  <TableRow
                    key={quote.id}
                    className={`border-[#27272A] ${bestQuote?.id === quote.id ? "bg-primary/5" : ""}`}
                  >
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {bestQuote?.id === quote.id && <Badge className="bg-primary text-xs">Mejor</Badge>}
                        <span className="text-white">{quote.supplierName}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-primary font-medium">${quote.unitPrice.toLocaleString()}</TableCell>
                    <TableCell className="text-zinc-400">{quote.quantity}</TableCell>
                    <TableCell className="text-white">${quote.total.toLocaleString()}</TableCell>
                    <TableCell>
                      <Badge
                        variant="secondary"
                        className={
                          quote.deliveryDays <= 5 ? "bg-primary/10 text-primary" : "bg-yellow-500/10 text-yellow-500"
                        }
                      >
                        {quote.deliveryDays} dias
                      </Badge>
                    </TableCell>
                    <TableCell className="text-zinc-400">{quote.validUntil}</TableCell>
                    <TableCell>
                      <Button size="sm" className="bg-primary hover:bg-primary/90">
                        Seleccionar
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Card>
        </TabsContent>

        {/* Purchase Orders Tab */}
        <TabsContent value="orders" className="space-y-4">
          <Card className="bg-[#18181B] border-[#27272A]">
            <Table>
              <TableHeader>
                <TableRow className="border-[#27272A]">
                  <TableHead className="text-zinc-400">No. Orden</TableHead>
                  <TableHead className="text-zinc-400">Proveedor</TableHead>
                  <TableHead className="text-zinc-400">Total</TableHead>
                  <TableHead className="text-zinc-400">Estado</TableHead>
                  <TableHead className="text-zinc-400">Fecha</TableHead>
                  <TableHead className="text-zinc-400">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {purchaseOrders.map((po) => {
                  const supplier = suppliers.find((s) => s.id === po.supplierId)
                  return (
                    <TableRow key={po.id} className="border-[#27272A]">
                      <TableCell className="font-mono text-primary">{po.id}</TableCell>
                      <TableCell className="text-white">{supplier?.name || "-"}</TableCell>
                      <TableCell className="text-white">${po.total.toLocaleString()}</TableCell>
                      <TableCell>
                        <Badge
                          variant="secondary"
                          className={
                            po.status === "approved"
                              ? "bg-primary/10 text-primary"
                              : po.status === "pending"
                                ? "bg-yellow-500/10 text-yellow-500"
                                : po.status === "received"
                                  ? "bg-blue-500/10 text-blue-500"
                                  : "bg-zinc-500/10 text-zinc-500"
                          }
                        >
                          {po.status === "approved"
                            ? "Aprobada"
                            : po.status === "pending"
                              ? "Pendiente"
                              : po.status === "received"
                                ? "Recibida"
                                : po.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-zinc-400">{po.createdAt}</TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          {po.status === "pending" && (
                            <Button size="sm" className="bg-primary hover:bg-primary/90">
                              Aprobar
                            </Button>
                          )}
                          <Button size="sm" variant="outline" className="border-[#27272A] bg-transparent">
                            Ver
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
