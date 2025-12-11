"use client"

import { useState } from "react"
import { Header } from "@/components/header"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { useNuuxStore } from "@/lib/nuux-store"
import {
  Package,
  AlertTriangle,
  QrCode,
  Plus,
  Search,
  MoreHorizontal,
  TrendingUp,
  TrendingDown,
  ArrowRightLeft,
  FileText,
  History,
  Warehouse,
} from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { cn } from "@/lib/utils"

export default function InventoryPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [transferDialogOpen, setTransferDialogOpen] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState<string | null>(null)
  const [transferQty, setTransferQty] = useState("")
  const [fromWarehouse, setFromWarehouse] = useState("")
  const [toWarehouse, setToWarehouse] = useState("")

  const {
    products,
    warehouses,
    stockMovements,
    purchaseOrders,
    checkLowStock,
    generatePurchaseOrder,
    transferStock,
    addStockMovement,
  } = useNuuxStore()

  const lowStockProducts = checkLowStock()
  const totalValue = products.reduce((acc, p) => acc + p.price * p.quantity, 0)
  const totalProducts = products.reduce((acc, p) => acc + p.quantity, 0)

  const filteredProducts = products.filter(
    (p) =>
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.sku.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.id.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const handleGeneratePO = (productId: string) => {
    const po = generatePurchaseOrder(productId)
    if (po) {
      alert(`Orden de compra ${po.id} generada automaticamente`)
    }
  }

  const handleTransfer = () => {
    if (selectedProduct && transferQty && fromWarehouse && toWarehouse) {
      const success = transferStock(selectedProduct, Number.parseInt(transferQty), fromWarehouse, toWarehouse)
      if (success) {
        alert("Transferencia realizada exitosamente")
        setTransferDialogOpen(false)
        setSelectedProduct(null)
        setTransferQty("")
      } else {
        alert("Error: Stock insuficiente en bodega origen")
      }
    }
  }

  return (
    <div className="min-h-screen">
      <Header title="Nuux Stock" subtitle="Sistema KARDEX con logica FIFO" />

      <div className="p-8">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-8">
          <Card className="p-6 bg-card border-border">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-xl bg-primary/10">
                <Package className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="text-muted-foreground text-sm">Total Productos</p>
                <p className="text-2xl font-bold text-foreground">{products.length}</p>
              </div>
            </div>
          </Card>
          <Card className="p-6 bg-card border-border">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-xl bg-primary/10">
                <TrendingUp className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="text-muted-foreground text-sm">Unidades en Stock</p>
                <p className="text-2xl font-bold text-primary">{totalProducts}</p>
              </div>
            </div>
          </Card>
          <Card className="p-6 bg-card border-border">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-xl bg-destructive/10">
                <AlertTriangle className="w-5 h-5 text-destructive" />
              </div>
              <div>
                <p className="text-muted-foreground text-sm">Stock Bajo</p>
                <p className="text-2xl font-bold text-destructive">{lowStockProducts.length}</p>
              </div>
            </div>
          </Card>
          <Card className="p-6 bg-card border-border">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-xl bg-primary/10">
                <Warehouse className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="text-muted-foreground text-sm">Bodegas</p>
                <p className="text-2xl font-bold text-foreground">{warehouses.length}</p>
              </div>
            </div>
          </Card>
          <Card className="p-6 bg-card border-border">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-xl bg-primary/10">
                <TrendingUp className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="text-muted-foreground text-sm">Valor Total</p>
                <p className="text-2xl font-bold text-foreground">${(totalValue / 1000000).toFixed(1)}M</p>
              </div>
            </div>
          </Card>
        </div>

        {/* Low Stock Alert with Auto PO */}
        {lowStockProducts.length > 0 && (
          <div className="mb-6 p-4 rounded-xl bg-destructive/10 border border-destructive/20">
            <div className="flex items-start gap-4">
              <AlertTriangle className="w-6 h-6 text-destructive flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="font-medium text-destructive">Alerta de Stock Bajo - Reabastecimiento Inteligente</p>
                <p className="text-sm text-muted-foreground mb-3">
                  {lowStockProducts.length} producto(s) por debajo del minimo. Genera ordenes de compra automaticas.
                </p>
                <div className="flex flex-wrap gap-2">
                  {lowStockProducts.map((p) => (
                    <div key={p.id} className="flex items-center gap-2 bg-[#09090B] px-3 py-2 rounded-lg">
                      <span className="text-sm text-foreground">{p.name}</span>
                      <Badge variant="outline" className="bg-destructive/20 text-destructive text-xs">
                        {p.quantity}/{p.minStock}
                      </Badge>
                      <Button
                        size="sm"
                        variant="ghost"
                        className="h-6 px-2 text-primary hover:bg-primary/10"
                        onClick={() => handleGeneratePO(p.id)}
                      >
                        <FileText className="w-3 h-3 mr-1" />
                        Generar OC
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tabs */}
        <Tabs defaultValue="products" className="space-y-6">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <TabsList className="bg-secondary">
              <TabsTrigger value="products">Productos</TabsTrigger>
              <TabsTrigger value="movements">Kardex / Movimientos</TabsTrigger>
              <TabsTrigger value="warehouses">Bodegas</TabsTrigger>
              <TabsTrigger value="orders">Ordenes de Compra</TabsTrigger>
            </TabsList>

            <div className="flex items-center gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar por ID, SKU o nombre..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-72 pl-10 bg-secondary border-border"
                />
              </div>
              <Dialog open={transferDialogOpen} onOpenChange={setTransferDialogOpen}>
                <DialogTrigger asChild>
                  <Button variant="outline" className="bg-transparent border-primary text-primary hover:bg-primary/10">
                    <ArrowRightLeft className="w-4 h-4 mr-2" />
                    Transferir
                  </Button>
                </DialogTrigger>
                <DialogContent className="bg-card border-border">
                  <DialogHeader>
                    <DialogTitle>Transferencia entre Bodegas</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4 pt-4">
                    <div className="space-y-2">
                      <Label>Producto</Label>
                      <Select value={selectedProduct || ""} onValueChange={setSelectedProduct}>
                        <SelectTrigger className="bg-secondary border-border">
                          <SelectValue placeholder="Seleccionar producto" />
                        </SelectTrigger>
                        <SelectContent>
                          {products.map((p) => (
                            <SelectItem key={p.id} value={p.id}>
                              {p.name} ({p.quantity} uds)
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Desde</Label>
                        <Select value={fromWarehouse} onValueChange={setFromWarehouse}>
                          <SelectTrigger className="bg-secondary border-border">
                            <SelectValue placeholder="Origen" />
                          </SelectTrigger>
                          <SelectContent>
                            {warehouses.map((w) => (
                              <SelectItem key={w.id} value={w.id}>
                                {w.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label>Hacia</Label>
                        <Select value={toWarehouse} onValueChange={setToWarehouse}>
                          <SelectTrigger className="bg-secondary border-border">
                            <SelectValue placeholder="Destino" />
                          </SelectTrigger>
                          <SelectContent>
                            {warehouses
                              .filter((w) => w.id !== fromWarehouse)
                              .map((w) => (
                                <SelectItem key={w.id} value={w.id}>
                                  {w.name}
                                </SelectItem>
                              ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label>Cantidad</Label>
                      <Input
                        type="number"
                        value={transferQty}
                        onChange={(e) => setTransferQty(e.target.value)}
                        className="bg-secondary border-border"
                        placeholder="0"
                      />
                    </div>
                    <Button
                      className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
                      onClick={handleTransfer}
                    >
                      Realizar Transferencia
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
              <Button className="bg-primary hover:bg-primary/90 text-primary-foreground neon-glow">
                <Plus className="w-4 h-4 mr-2" />
                Nuevo Producto
              </Button>
            </div>
          </div>

          <TabsContent value="products">
            <div className="bg-card rounded-2xl border border-border overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-secondary/50">
                    <tr>
                      <th className="text-left p-4 text-sm font-medium text-muted-foreground">ID / SKU</th>
                      <th className="text-left p-4 text-sm font-medium text-muted-foreground">Producto</th>
                      <th className="text-left p-4 text-sm font-medium text-muted-foreground">Bodega</th>
                      <th className="text-left p-4 text-sm font-medium text-muted-foreground">Lotes (FIFO)</th>
                      <th className="text-left p-4 text-sm font-medium text-muted-foreground">Precio</th>
                      <th className="text-left p-4 text-sm font-medium text-muted-foreground">Stock</th>
                      <th className="text-left p-4 text-sm font-medium text-muted-foreground">Estado</th>
                      <th className="text-left p-4 text-sm font-medium text-muted-foreground">Acciones</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {filteredProducts.map((product) => {
                      const isLowStock = product.quantity <= product.minStock
                      const warehouse = warehouses.find((w) => w.id === product.warehouseId)

                      return (
                        <tr key={product.id} className="hover:bg-secondary/30 transition-colors">
                          <td className="p-4">
                            <div>
                              <p className="font-mono text-xs text-primary">{product.id}</p>
                              <p className="font-mono text-xs text-muted-foreground">{product.sku}</p>
                            </div>
                          </td>
                          <td className="p-4">
                            <div>
                              <p className="font-medium text-foreground">{product.name}</p>
                              <p className="text-xs text-muted-foreground truncate max-w-[200px]">
                                {product.description}
                              </p>
                            </div>
                          </td>
                          <td className="p-4">
                            <Badge variant="outline" className="bg-secondary">
                              {warehouse?.name || "Sin asignar"}
                            </Badge>
                          </td>
                          <td className="p-4">
                            <div className="space-y-1">
                              {product.lots.slice(0, 2).map((lot, i) => (
                                <div key={lot.id} className="text-xs">
                                  <span
                                    className={cn(
                                      "inline-block w-2 h-2 rounded-full mr-1",
                                      i === 0 ? "bg-primary" : "bg-zinc-500",
                                    )}
                                  />
                                  <span className="text-muted-foreground">{lot.lotNumber}:</span>
                                  <span className="text-foreground ml-1">{lot.quantity} uds</span>
                                </div>
                              ))}
                              {product.lots.length > 2 && (
                                <p className="text-xs text-primary">+{product.lots.length - 2} lotes mas</p>
                              )}
                            </div>
                          </td>
                          <td className="p-4">
                            <p className="font-medium text-foreground">${product.price.toLocaleString()}</p>
                            <p className="text-xs text-muted-foreground">Costo: ${product.cost.toLocaleString()}</p>
                          </td>
                          <td className="p-4">
                            <div className="flex items-center gap-2">
                              {isLowStock ? (
                                <TrendingDown className="w-4 h-4 text-destructive" />
                              ) : (
                                <TrendingUp className="w-4 h-4 text-primary" />
                              )}
                              <span className={cn("font-medium", isLowStock ? "text-destructive" : "text-foreground")}>
                                {product.quantity}
                              </span>
                              <span className="text-xs text-muted-foreground">/ min {product.minStock}</span>
                            </div>
                          </td>
                          <td className="p-4">
                            <Badge
                              variant="outline"
                              className={cn(
                                product.status === "active"
                                  ? "bg-primary/10 text-primary"
                                  : product.status === "out_of_stock"
                                    ? "bg-destructive/10 text-destructive"
                                    : "bg-secondary text-muted-foreground",
                              )}
                            >
                              {product.status === "active"
                                ? "Activo"
                                : product.status === "out_of_stock"
                                  ? "Sin Stock"
                                  : "Descontinuado"}
                            </Badge>
                          </td>
                          <td className="p-4">
                            <div className="flex items-center gap-2">
                              <Button variant="ghost" size="icon" className="h-8 w-8">
                                <QrCode className="w-4 h-4 text-primary" />
                              </Button>
                              <Button variant="ghost" size="icon" className="h-8 w-8">
                                <History className="w-4 h-4 text-muted-foreground" />
                              </Button>
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button variant="ghost" size="icon" className="h-8 w-8">
                                    <MoreHorizontal className="w-4 h-4" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end" className="bg-card border-border">
                                  <DropdownMenuItem>Editar producto</DropdownMenuItem>
                                  <DropdownMenuItem>Registrar entrada</DropdownMenuItem>
                                  <DropdownMenuItem>Registrar salida</DropdownMenuItem>
                                  <DropdownMenuItem>Ver Kardex</DropdownMenuItem>
                                  <DropdownMenuItem className="text-destructive">Eliminar</DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </div>
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="movements">
            <div className="bg-card rounded-2xl border border-border overflow-hidden">
              <div className="p-6 border-b border-border">
                <h3 className="font-semibold text-foreground">Historial de Movimientos (KARDEX)</h3>
                <p className="text-sm text-muted-foreground">Registro inmutable de todas las entradas y salidas</p>
              </div>
              {stockMovements.length === 0 ? (
                <div className="p-12 text-center">
                  <History className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
                  <p className="text-muted-foreground">No hay movimientos registrados</p>
                  <p className="text-sm text-muted-foreground">
                    Los movimientos aparecerán aqui cuando se registren entradas, salidas o transferencias
                  </p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-secondary/50">
                      <tr>
                        <th className="text-left p-4 text-sm font-medium text-muted-foreground">ID</th>
                        <th className="text-left p-4 text-sm font-medium text-muted-foreground">Fecha</th>
                        <th className="text-left p-4 text-sm font-medium text-muted-foreground">Tipo</th>
                        <th className="text-left p-4 text-sm font-medium text-muted-foreground">Producto</th>
                        <th className="text-left p-4 text-sm font-medium text-muted-foreground">Cantidad</th>
                        <th className="text-left p-4 text-sm font-medium text-muted-foreground">Costo Unit.</th>
                        <th className="text-left p-4 text-sm font-medium text-muted-foreground">Total</th>
                        <th className="text-left p-4 text-sm font-medium text-muted-foreground">Referencia</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                      {stockMovements.map((mov) => {
                        const product = products.find((p) => p.id === mov.productId)
                        return (
                          <tr key={mov.id} className="hover:bg-secondary/30">
                            <td className="p-4 font-mono text-xs text-primary">{mov.id}</td>
                            <td className="p-4 text-sm">{mov.date}</td>
                            <td className="p-4">
                              <Badge
                                variant="outline"
                                className={cn(
                                  mov.type === "entrada"
                                    ? "bg-primary/10 text-primary"
                                    : mov.type === "salida"
                                      ? "bg-destructive/10 text-destructive"
                                      : "bg-yellow-500/10 text-yellow-500",
                                )}
                              >
                                {mov.type.charAt(0).toUpperCase() + mov.type.slice(1)}
                              </Badge>
                            </td>
                            <td className="p-4 text-sm">{product?.name || mov.productId}</td>
                            <td className="p-4 font-medium">{mov.quantity}</td>
                            <td className="p-4 text-sm">${mov.unitCost.toLocaleString()}</td>
                            <td className="p-4 font-medium">${mov.totalCost.toLocaleString()}</td>
                            <td className="p-4 text-sm text-muted-foreground">{mov.reference || "-"}</td>
                          </tr>
                        )
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="warehouses">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {warehouses.map((warehouse) => (
                <Card key={warehouse.id} className="p-6 bg-card border-border hover:border-primary/30 transition-all">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="p-3 rounded-xl bg-primary/10">
                        <Warehouse className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-foreground">{warehouse.name}</h3>
                        <p className="text-xs text-muted-foreground">{warehouse.code}</p>
                      </div>
                    </div>
                    <Badge
                      variant="outline"
                      className={cn(warehouse.type === "principal" ? "bg-primary/10 text-primary" : "bg-secondary")}
                    >
                      {warehouse.type.charAt(0).toUpperCase() + warehouse.type.slice(1)}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mb-4">{warehouse.address}</p>
                  <div className="pt-4 border-t border-border flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">
                      {products.filter((p) => p.warehouseId === warehouse.id).length} productos
                    </span>
                    <Badge
                      variant="outline"
                      className={cn(warehouse.status === "active" ? "bg-primary/10 text-primary" : "bg-secondary")}
                    >
                      {warehouse.status === "active" ? "Activa" : "Inactiva"}
                    </Badge>
                  </div>
                </Card>
              ))}

              <Card className="p-6 bg-secondary/30 border-dashed border-2 border-border hover:border-primary/30 transition-all flex items-center justify-center min-h-[200px] cursor-pointer group">
                <div className="text-center">
                  <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-3 group-hover:bg-primary/20 transition-colors">
                    <Plus className="w-6 h-6 text-primary" />
                  </div>
                  <p className="font-medium text-foreground">Agregar Bodega</p>
                  <p className="text-muted-foreground text-sm">Nueva ubicacion de almacenamiento</p>
                </div>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="orders">
            {purchaseOrders.length === 0 ? (
              <div className="bg-card rounded-2xl border border-border p-12 text-center">
                <FileText className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
                <p className="text-foreground font-medium mb-1">No hay ordenes de compra</p>
                <p className="text-sm text-muted-foreground mb-4">
                  Las ordenes se generan automaticamente cuando un producto baja del minimo
                </p>
                <Button className="bg-primary hover:bg-primary/90 text-primary-foreground">
                  <Plus className="w-4 h-4 mr-2" />
                  Crear Orden Manual
                </Button>
              </div>
            ) : (
              <div className="bg-card rounded-2xl border border-border overflow-hidden">
                <table className="w-full">
                  <thead className="bg-secondary/50">
                    <tr>
                      <th className="text-left p-4 text-sm font-medium text-muted-foreground">ID</th>
                      <th className="text-left p-4 text-sm font-medium text-muted-foreground">Proveedor</th>
                      <th className="text-left p-4 text-sm font-medium text-muted-foreground">Items</th>
                      <th className="text-left p-4 text-sm font-medium text-muted-foreground">Total</th>
                      <th className="text-left p-4 text-sm font-medium text-muted-foreground">Estado</th>
                      <th className="text-left p-4 text-sm font-medium text-muted-foreground">Acciones</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {purchaseOrders.map((po) => (
                      <tr key={po.id} className="hover:bg-secondary/30">
                        <td className="p-4 font-mono text-xs text-primary">{po.id}</td>
                        <td className="p-4">{po.supplierId}</td>
                        <td className="p-4">{po.items.length} items</td>
                        <td className="p-4 font-medium">${po.total.toLocaleString()}</td>
                        <td className="p-4">
                          <Badge
                            variant="outline"
                            className={cn(
                              po.status === "draft"
                                ? "bg-yellow-500/10 text-yellow-500"
                                : po.status === "approved"
                                  ? "bg-primary/10 text-primary"
                                  : "bg-secondary",
                            )}
                          >
                            {po.status}
                          </Badge>
                        </td>
                        <td className="p-4">
                          <Button size="sm" variant="outline" className="bg-transparent">
                            Ver detalle
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
