"use client"
import { useState } from "react"
import { Header } from "@/components/header"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useNuuxStore } from "@/lib/nuux-store"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar as CalendarComponent } from "@/components/ui/calendar"
import {
  DollarSign,
  TrendingUp,
  TrendingDown,
  ArrowUpRight,
  ArrowDownRight,
  Plus,
  FileText,
  CreditCard,
  Building,
  Banknote,
  PieChart,
  Calendar,
  CheckCircle2,
  AlertCircle,
  Printer,
  X,
  Trash2,
  Download,
  Wallet,
  Landmark,
  ShieldCheck
} from "lucide-react"
import { cn } from "@/lib/utils"
import {
  Area,
  AreaChart,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart as RePieChart,
  Pie,
  Cell,
} from "recharts"
import type { Invoice, InvoiceItem } from "@/lib/types"

export default function FinancePage() {
  const { transactions, invoices, costCenters, bankAccounts, auditLogs, getCashFlowProjection, getExpensesByDepartment, markInvoiceAsPaid, addTransaction, addInvoice, connectBankAccount } =
    useNuuxStore()

  // State for Dialogs
  const [expenseDialogOpen, setExpenseDialogOpen] = useState(false)
  const [invoiceDialogOpen, setInvoiceDialogOpen] = useState(false)
  const [linkBankOpen, setLinkBankOpen] = useState(false)
  const [viewInvoiceId, setViewInvoiceId] = useState<string | null>(null)

  // Link Bank State
  const [linkState, setLinkState] = useState({ provider: 'bancolombia' as 'bancolombia' | 'nequi', username: '', password: '', status: 'idle' as 'idle' | 'loading' | 'success' })

  const handleLinkBank = async () => {
    setLinkState({ ...linkState, status: 'loading' })
    await connectBankAccount(linkState.provider, { user: linkState.username, pass: linkState.password })
    setLinkState({ ...linkState, status: 'success' })
    setTimeout(() => {
      setLinkBankOpen(false)
      setLinkState({ ...linkState, status: 'idle', username: '', password: '' })
    }, 1500)
  }

  // Calendar State
  const [date, setDate] = useState<Date | undefined>(new Date())

  // Expense Form State
  const [expenseData, setExpenseData] = useState({
    description: "",
    amount: "",
    category: "office",
    paymentMethod: "transfer" as const
  })

  // Invoice Form State
  const [invoiceData, setInvoiceData] = useState({
    clientName: "",
    clientEmail: "",
    dueDate: "",
    items: [{ description: "", quantity: 1, unitPrice: 0, total: 0 }] as InvoiceItem[]
  })

  const income = transactions
    .filter((t) => t.type === "income" && t.status === "completed")
    .reduce((acc, t) => acc + t.amount, 0)
  const expenses = transactions
    .filter((t) => t.type === "expense" && t.status === "completed")
    .reduce((acc, t) => acc + t.amount, 0)
  const balance = income - expenses

  // Account Totals
  const totalInBanks = bankAccounts.reduce((acc, b) => acc + b.balance, 0)

  const pendingInvoices = invoices.filter((inv) => inv.status === "sent" || inv.status === "overdue")
  const pendingAmount = pendingInvoices.reduce((acc, inv) => acc + inv.total, 0)
  const overdueAmount = invoices.filter((inv) => inv.status === "overdue").reduce((acc, inv) => acc + inv.total, 0)

  // Cash flow projection for next 30 days
  const cashFlowData = getCashFlowProjection(30)

  // Expenses by department
  const departmentExpenses = getExpensesByDepartment()
  const COLORS = ["#10B981", "#3B82F6", "#F59E0B", "#EC4899", "#8B5CF6"]

  const handleExport = () => {
    const headers = ["ID", "Fecha", "Tipo", "Descripcion", "Categoria", "Monto", "Estado"]
    const rows = transactions.map(t => [
      t.id,
      t.date,
      t.type,
      `"${t.description}"`,
      t.category,
      t.amount,
      t.status
    ])

    const csvContent = [headers.join(","), ...rows.map(r => r.join(","))].join("\n")
    const blob = new Blob([csvContent], { type: "text/csv" })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `financiero_export_${new Date().toISOString().split('T')[0]}.csv`
    a.click()
  }

  const handleRegisterExpense = () => {
    if (!expenseData.description || !expenseData.amount) return

    addTransaction({
      tenantId: "tenant-001",
      type: "expense",
      description: expenseData.description,
      amount: Number(expenseData.amount),
      category: expenseData.category,
      date: new Date().toISOString().split('T')[0],
      status: "completed",
      paymentMethod: expenseData.paymentMethod,
      userId: "current-user"
    })
    setExpenseDialogOpen(false)
    setExpenseData({ description: "", amount: "", category: "office", paymentMethod: "transfer" })
  }

  const handleAddInvoiceItem = () => {
    setInvoiceData({
      ...invoiceData,
      items: [...invoiceData.items, { id: `itm-${Date.now()}`, description: "", quantity: 1, unitPrice: 0, total: 0 }]
    })
  }

  const handleUpdateItem = (index: number, field: keyof InvoiceItem, value: any) => {
    const newItems = [...invoiceData.items]
    newItems[index] = { ...newItems[index], [field]: value }
    // Recalc total
    newItems[index].total = newItems[index].quantity * newItems[index].unitPrice
    setInvoiceData({ ...invoiceData, items: newItems })
  }

  const handleCreateInvoice = () => {
    if (!invoiceData.clientName) return

    const subtotal = invoiceData.items.reduce((acc, item) => acc + item.total, 0)
    const tax = subtotal * 0.19 // 19% VAT example
    const total = subtotal + tax

    addInvoice({
      tenantId: "tenant-001",
      number: `INV-${Date.now().toString().slice(-6)}`,
      clientId: "cli-new",
      clientName: invoiceData.clientName,
      clientEmail: invoiceData.clientEmail,
      items: invoiceData.items,
      subtotal,
      tax,
      total,
      issueDate: new Date().toISOString().split('T')[0],
      dueDate: invoiceData.dueDate || new Date().toISOString().split('T')[0],
    })
    setInvoiceDialogOpen(false)
    setInvoiceData({ clientName: "", clientEmail: "", dueDate: "", items: [{ id: "1", description: "", quantity: 1, unitPrice: 0, total: 0 }] })
  }

  const selectedInvoice = invoices.find(inv => inv.id === viewInvoiceId)

  return (
    <div className="min-h-screen">
      <Header title="Nuux Finance" subtitle="Sistema contable con proyeccion de flujo de caja" />

      <div className="p-8">

        {/* BANK ACCOUNTS SCROLL */}
        <div className="mb-8 overflow-x-auto pb-4">
          <div className="flex gap-4">
            {/* Aggregate Card */}
            <Card className="min-w-[280px] p-6 bg-gradient-to-br from-zinc-800 to-zinc-900 border-zinc-700 text-white relative overflow-hidden group">
              <div className="absolute right-[-20px] top-[-20px] opacity-10 rotate-12 group-hover:rotate-0 transition-all duration-500">
                <Landmark className="w-32 h-32" />
              </div>
              <div className="relative z-10">
                <p className="text-zinc-400 text-sm mb-1">Balance Total</p>
                <h3 className="text-3xl font-bold mb-4">${(totalInBanks / 1000000).toFixed(2)}M</h3>
                <div className="flex gap-2">
                  <Badge variant="outline" className="bg-zinc-800/50 border-zinc-600 text-emerald-400"><TrendingUp className="w-3 h-3 mr-1" /> +2.4%</Badge>
                </div>
              </div>
            </Card>

            {bankAccounts.map(account => (
              <Card key={account.id} className="min-w-[280px] p-6 bg-card border-border relative overflow-hidden hover:border-primary/50 transition-colors">
                <div className="flex justify-between items-start mb-4">
                  <div className={`p-2 rounded-full bg-opacity-20`} style={{ backgroundColor: `${account.color}20` }}>
                    {account.type === 'bank' && <Building className="w-5 h-5" style={{ color: account.color }} />}
                    {account.type === 'cash' && <Banknote className="w-5 h-5" style={{ color: account.color }} />}
                    {account.type === 'wallet' && <Wallet className="w-5 h-5" style={{ color: account.color }} />}
                  </div>
                  <div className="flex gap-2">
                    {account.integrationStatus === 'connected' && <Badge variant="secondary" className="bg-green-500/10 text-green-500 border-green-500/20 text-[10px]"><CheckCircle2 className="w-3 h-3 mr-1" />Sync</Badge>}
                    <Badge variant="outline" className={cn(account.status === 'active' ? "text-emerald-500 bg-emerald-500/10" : "text-zinc-500")}>
                      {account.status === 'active' ? 'Activa' : 'Inactiva'}
                    </Badge>
                  </div>
                </div>
                <div>
                  <h4 className="font-semibold text-foreground">{account.name}</h4>
                  <p className="text-xs text-muted-foreground mb-3">{account.bankName} {account.accountNumber}</p>
                  <h3 className="text-2xl font-bold text-foreground">
                    ${account.balance.toLocaleString()}
                  </h3>
                </div>
              </Card>
            ))}

            <Dialog open={linkBankOpen} onOpenChange={setLinkBankOpen}>
              <DialogTrigger asChild>
                <Card className="min-w-[100px] flex items-center justify-center border-dashed border-2 border-zinc-800 bg-transparent hover:bg-zinc-900 cursor-pointer">
                  <div className="text-center">
                    <Plus className="w-6 h-6 mx-auto text-zinc-600 mb-1" />
                    <span className="text-xs text-zinc-600">Vincular</span>
                  </div>
                </Card>
              </DialogTrigger>
              <DialogContent className="bg-[#18181B] border-[#27272A] text-white">
                <DialogHeader>
                  <DialogTitle>Vincular Cuenta Bancaria</DialogTitle>
                </DialogHeader>
                {linkState.status === 'success' ? (
                  <div className="py-8 text-center">
                    <div className="w-16 h-16 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-4 text-green-500">
                      <CheckCircle2 className="w-8 h-8" />
                    </div>
                    <h3 className="text-xl font-bold text-white mb-2">¡Cuenta Vinculada!</h3>
                    <p className="text-zinc-400">Tus movimientos se sincronizarán automáticamente.</p>
                  </div>
                ) : (
                  <div className="space-y-4 py-4">
                    <div className="space-y-2">
                      <Label>Selecciona tu Banco</Label>
                      <div className="grid grid-cols-2 gap-4">
                        <div
                          onClick={() => setLinkState({ ...linkState, provider: 'bancolombia' })}
                          className={cn("p-4 rounded-lg border cursor-pointer transition-all", linkState.provider === 'bancolombia' ? "border-yellow-400 bg-yellow-400/10" : "border-zinc-800 hover:border-zinc-700")}
                        >
                          <div className="w-8 h-8 bg-yellow-400 rounded-full mb-2 mx-auto" />
                          <p className="text-center font-bold text-sm">Bancolombia</p>
                        </div>
                        <div
                          onClick={() => setLinkState({ ...linkState, provider: 'nequi' })}
                          className={cn("p-4 rounded-lg border cursor-pointer transition-all", linkState.provider === 'nequi' ? "border-pink-500 bg-pink-500/10" : "border-zinc-800 hover:border-zinc-700")}
                        >
                          <div className="w-8 h-8 bg-pink-500 rounded-full mb-2 mx-auto" />
                          <p className="text-center font-bold text-sm">Nequi</p>
                        </div>
                      </div>
                    </div>
                    {linkState.status === 'loading' ? (
                      <div className="py-8 text-center space-y-4">
                        <div className="animate-spin w-8 h-8 border-2 border-primary border-t-transparent rounded-full mx-auto" />
                        <p className="text-zinc-400">Conectando de forma segura...</p>
                      </div>
                    ) : (
                      <>
                        <div className="space-y-2">
                          <Label>Usuario / Cédula</Label>
                          <Input
                            value={linkState.username}
                            onChange={e => setLinkState({ ...linkState, username: e.target.value })}
                            className="bg-zinc-900 border-zinc-800"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Contraseña / Pin</Label>
                          <Input
                            type="password"
                            value={linkState.password}
                            onChange={e => setLinkState({ ...linkState, password: e.target.value })}
                            className="bg-zinc-900 border-zinc-800"
                          />
                        </div>
                        <Button onClick={handleLinkBank} className="w-full bg-primary mt-4" disabled={!linkState.username || !linkState.password}>
                          Conectar Cuenta
                        </Button>
                        <p className="text-xs text-center text-zinc-500 mt-2">
                          <span className="flex items-center justify-center gap-1"><ShieldCheck className="w-3 h-3" /> Conexión encriptada de extremo a extremo</span>
                        </p>
                      </>
                    )}
                  </div>
                )}
              </DialogContent>
            </Dialog>
          </div>
        </div>


        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-8">
          <Card className="p-6 bg-card border-border">
            <div className="flex items-center justify-between mb-2">
              <p className="text-muted-foreground text-sm">Ingresos</p>
              <div className="p-2 rounded-lg bg-primary/10">
                <TrendingUp className="w-4 h-4 text-primary" />
              </div>
            </div>
            <p className="text-2xl font-bold text-primary">${(income / 1000000).toFixed(1)}M</p>
            <div className="flex items-center gap-1 mt-2 text-xs text-primary">
              <ArrowUpRight className="w-3 h-3" />
              <span>+12.5% vs mes anterior</span>
            </div>
          </Card>

          <Card className="p-6 bg-card border-border">
            <div className="flex items-center justify-between mb-2">
              <p className="text-muted-foreground text-sm">Egresos</p>
              <div className="p-2 rounded-lg bg-destructive/10">
                <TrendingDown className="w-4 h-4 text-destructive" />
              </div>
            </div>
            <p className="text-2xl font-bold text-destructive">${(expenses / 1000000).toFixed(1)}M</p>
            <div className="flex items-center gap-1 mt-2 text-xs text-destructive">
              <ArrowDownRight className="w-3 h-3" />
              <span>+5.2% vs mes anterior</span>
            </div>
          </Card>

          <Card className="p-6 bg-card border-border">
            <div className="flex items-center justify-between mb-2">
              <p className="text-muted-foreground text-sm">Balance</p>
              <div className={cn("p-2 rounded-lg", balance >= 0 ? "bg-primary/10" : "bg-destructive/10")}>
                <DollarSign className={cn("w-4 h-4", balance >= 0 ? "text-primary" : "text-destructive")} />
              </div>
            </div>
            <p className={cn("text-2xl font-bold", balance >= 0 ? "text-primary" : "text-destructive")}>
              ${balance >= 0 ? "+" : ""}
              {(balance / 1000000).toFixed(1)}M
            </p>
            <p className="text-xs text-muted-foreground mt-2">Flujo neto del periodo</p>
          </Card>

          <Card className="p-6 bg-card border-border">
            <div className="flex items-center justify-between mb-2">
              <p className="text-muted-foreground text-sm">Por Cobrar</p>
              <div className="p-2 rounded-lg bg-yellow-500/10">
                <FileText className="w-4 h-4 text-yellow-500" />
              </div>
            </div>
            <p className="text-2xl font-bold text-yellow-500">${(pendingAmount / 1000000).toFixed(1)}M</p>
            <p className="text-xs text-muted-foreground mt-2">{pendingInvoices.length} facturas pendientes</p>
          </Card>

          <Card className="p-6 bg-card border-border">
            <div className="flex items-center justify-between mb-2">
              <p className="text-muted-foreground text-sm">Vencido</p>
              <div className="p-2 rounded-lg bg-destructive/10">
                <AlertCircle className="w-4 h-4 text-destructive" />
              </div>
            </div>
            <p className="text-2xl font-bold text-destructive">${(overdueAmount / 1000000).toFixed(1)}M</p>
            <p className="text-xs text-muted-foreground mt-2">Requiere seguimiento</p>
          </Card>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <Card className="col-span-2 p-6 bg-card border-border">
            {/* ... Existing Chart Code ... */}
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="font-semibold text-foreground">Proyeccion de Flujo de Caja</h3>
                <p className="text-sm text-muted-foreground">Proximos 30 dias basado en facturas por cobrar</p>
              </div>
              <Badge variant="outline" className="bg-primary/10 text-primary">
                <Calendar className="w-3 h-3 mr-1" />
                30 dias
              </Badge>
            </div>
            <div className="h-[250px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={cashFlowData.slice(0, 15)}>
                  <defs>
                    <linearGradient id="colorBalance" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10B981" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#10B981" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="date" stroke="#71717A" fontSize={10} tickFormatter={(value) => value.slice(5)} />
                  <YAxis
                    stroke="#71717A"
                    fontSize={10}
                    tickFormatter={(value) => `$${(value / 1000000).toFixed(0)}M`}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#18181B",
                      border: "1px solid #27272A",
                      borderRadius: "8px",
                    }}
                    formatter={(value: number) => [`$${value.toLocaleString()}`, "Balance"]}
                  />
                  <Area type="monotone" dataKey="balance" stroke="#10B981" fillOpacity={1} fill="url(#colorBalance)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </Card>

          <Card className="p-6 bg-card border-border">
            {/* ... Existing Pie Chart Code ... */}
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="font-semibold text-foreground">Gastos por Departamento</h3>
                <p className="text-sm text-muted-foreground">Centros de costo</p>
              </div>
              <PieChart className="w-5 h-5 text-primary" />
            </div>
            <div className="h-[150px] mb-4">
              <ResponsiveContainer width="100%" height="100%">
                <RePieChart>
                  <Pie
                    data={departmentExpenses}
                    cx="50%"
                    cy="50%"
                    innerRadius={40}
                    outerRadius={60}
                    paddingAngle={5}
                    dataKey="total"
                  >
                    {departmentExpenses.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#18181B",
                      border: "1px solid #27272A",
                      borderRadius: "8px",
                    }}
                    formatter={(value: number) => `$${(value / 1000000).toFixed(1)}M`}
                  />
                </RePieChart>
              </ResponsiveContainer>
            </div>
            <div className="space-y-2">
              {departmentExpenses.map((dept, index) => (
                <div key={dept.department} className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }} />
                    <span className="text-muted-foreground">{dept.department}</span>
                  </div>
                  <div className="text-right">
                    <span className="text-foreground">${(dept.total / 1000000).toFixed(1)}M</span>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="invoices" className="space-y-6">
          <div className="flex items-center justify-between">
            <TabsList className="bg-secondary">
              <TabsTrigger value="invoices">Facturas por Cobrar</TabsTrigger>
              <TabsTrigger value="transactions">Transacciones</TabsTrigger>
              <TabsTrigger value="costcenters">Centros de Costo</TabsTrigger>
              <TabsTrigger value="calendar">Calendario</TabsTrigger>
            </TabsList>
            <div className="flex gap-3">
              <Button onClick={handleExport} variant="outline" className="bg-transparent border-primary text-primary hover:bg-primary/10">
                <Download className="w-4 h-4 mr-2" />
                Exportar Reporte
              </Button>
              <Dialog open={expenseDialogOpen} onOpenChange={setExpenseDialogOpen}>
                <DialogTrigger asChild>
                  <Button variant="outline" className="bg-transparent border-primary text-primary hover:bg-primary/10">
                    <ArrowDownRight className="w-4 h-4 mr-2" />
                    Registrar Egreso
                  </Button>
                </DialogTrigger>
                <DialogContent className="bg-[#18181B] border-[#27272A] text-white">
                  <DialogHeader><DialogTitle>Registrar Gasto</DialogTitle></DialogHeader>
                  <div className="space-y-4 py-4">
                    <div className="space-y-2">
                      <Label>Descripción</Label>
                      <Input
                        placeholder="Ej: Pago de Internet"
                        className="bg-zinc-900 border-zinc-800"
                        value={expenseData.description}
                        onChange={e => setExpenseData({ ...expenseData, description: e.target.value })}
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Monto</Label>
                        <div className="relative">
                          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500">$</span>
                          <Input
                            type="number"
                            className="pl-6 bg-zinc-900 border-zinc-800"
                            value={expenseData.amount}
                            onChange={e => setExpenseData({ ...expenseData, amount: e.target.value })}
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label>Categoría</Label>
                        <Select
                          value={expenseData.category}
                          onValueChange={v => setExpenseData({ ...expenseData, category: v })}
                        >
                          <SelectTrigger className="bg-zinc-900 border-zinc-800"><SelectValue /></SelectTrigger>
                          <SelectContent className="bg-zinc-900 border-zinc-800 text-white">
                            <SelectItem value="office">Oficina</SelectItem>
                            <SelectItem value="marketing">Marketing</SelectItem>
                            <SelectItem value="services">Servicios</SelectItem>
                            <SelectItem value="travel">Viáticos</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label>Método de Pago</Label>
                      <Select
                        value={expenseData.paymentMethod}
                        onValueChange={v => setExpenseData({ ...expenseData, paymentMethod: v as any })}
                      >
                        <SelectTrigger className="bg-zinc-900 border-zinc-800"><SelectValue /></SelectTrigger>
                        <SelectContent className="bg-zinc-900 border-zinc-800 text-white">
                          <SelectItem value="transfer">Transferencia</SelectItem>
                          <SelectItem value="cash">Efectivo</SelectItem>
                          <SelectItem value="card">Tarjeta</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <DialogFooter>
                    <Button onClick={handleRegisterExpense} className="bg-red-600 hover:bg-red-700">Registrar Gasto</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>

              <Dialog open={invoiceDialogOpen} onOpenChange={setInvoiceDialogOpen}>
                <DialogTrigger asChild>
                  <Button className="bg-primary hover:bg-primary/90 text-primary-foreground neon-glow">
                    <Plus className="w-4 h-4 mr-2" />
                    Nueva Factura
                  </Button>
                </DialogTrigger>
                <DialogContent className="bg-[#18181B] border-[#27272A] text-white max-w-2xl">
                  <DialogHeader><DialogTitle>Crear Factura de Venta</DialogTitle></DialogHeader>
                  <div className="space-y-6 py-4">

                    {/* Client Info */}
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Cliente / Empresa</Label>
                        <Input
                          placeholder="Nombre del Cliente"
                          className="bg-zinc-900 border-zinc-800"
                          value={invoiceData.clientName}
                          onChange={e => setInvoiceData({ ...invoiceData, clientName: e.target.value })}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Email Facturación</Label>
                        <Input
                          placeholder="email@cliente.com"
                          className="bg-zinc-900 border-zinc-800"
                          value={invoiceData.clientEmail}
                          onChange={e => setInvoiceData({ ...invoiceData, clientEmail: e.target.value })}
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label>Fecha Vencimiento</Label>
                      <Input
                        type="date"
                        className="bg-zinc-900 border-zinc-800"
                        value={invoiceData.dueDate}
                        onChange={e => setInvoiceData({ ...invoiceData, dueDate: e.target.value })}
                      />
                    </div>

                    {/* Items */}
                    <div className="space-y-3">
                      <div className="flex justify-between items-center text-sm text-muted-foreground">
                        <span>Items</span>
                        <Button variant="ghost" size="sm" onClick={handleAddInvoiceItem}><Plus className="w-3 h-3 mr-1" /> Agregar Item</Button>
                      </div>
                      <div className="space-y-2 max-h-[200px] overflow-y-auto pr-2">
                        {invoiceData.items.map((item, idx) => (
                          <div key={idx} className="flex gap-2 items-start">
                            <Input
                              placeholder="Descripción"
                              className="flex-1 bg-zinc-900 border-zinc-800"
                              value={item.description}
                              onChange={e => handleUpdateItem(idx, 'description', e.target.value)}
                            />
                            <Input
                              type="number"
                              placeholder="Cant"
                              className="w-16 bg-zinc-900 border-zinc-800"
                              value={item.quantity}
                              onChange={e => handleUpdateItem(idx, 'quantity', Number(e.target.value))}
                            />
                            <Input
                              type="number"
                              placeholder="Precio Unit."
                              className="w-24 bg-zinc-900 border-zinc-800"
                              value={item.unitPrice}
                              onChange={e => handleUpdateItem(idx, 'unitPrice', Number(e.target.value))}
                            />
                            <div className="w-20 pt-2 text-right font-mono text-sm">
                              ${(item.total).toLocaleString()}
                            </div>
                          </div>
                        ))}
                      </div>
                      <div className="flex justify-end pt-4 border-t border-zinc-800">
                        <div className="text-right space-y-1">
                          <p className="text-sm text-muted-foreground">Subtotal: ${invoiceData.items.reduce((a, b) => a + b.total, 0).toLocaleString()}</p>
                          <p className="text-sm text-muted-foreground">IVA (19%): ${(invoiceData.items.reduce((a, b) => a + b.total, 0) * 0.19).toLocaleString()}</p>
                          <p className="text-lg font-bold text-primary">Total: ${(invoiceData.items.reduce((a, b) => a + b.total, 0) * 1.19).toLocaleString()}</p>
                        </div>
                      </div>
                    </div>

                  </div>
                  <DialogFooter>
                    <Button onClick={handleCreateInvoice} className="bg-blue-600 hover:bg-blue-700 w-full">Crear Factura</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          </div>

          <TabsContent value="invoices">
            <div className="bg-card rounded-2xl border border-border overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-secondary/50">
                    <tr>
                      <th className="text-left p-4 text-sm font-medium text-muted-foreground">Factura</th>
                      <th className="text-left p-4 text-sm font-medium text-muted-foreground">Cliente</th>
                      <th className="text-left p-4 text-sm font-medium text-muted-foreground">Emision</th>
                      <th className="text-left p-4 text-sm font-medium text-muted-foreground">Vencimiento</th>
                      <th className="text-left p-4 text-sm font-medium text-muted-foreground">Monto</th>
                      <th className="text-left p-4 text-sm font-medium text-muted-foreground">Estado</th>
                      <th className="text-left p-4 text-sm font-medium text-muted-foreground">Acciones</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {invoices.map((invoice) => (
                      <tr key={invoice.id} className="hover:bg-secondary/30 transition-colors">
                        <td className="p-4">
                          <p className="font-mono text-sm text-primary">{invoice.number}</p>
                          <p className="font-mono text-xs text-muted-foreground">{invoice.id}</p>
                        </td>
                        <td className="p-4">
                          <p className="font-medium text-foreground">{invoice.clientName}</p>
                          <p className="text-xs text-muted-foreground">{invoice.clientEmail}</p>
                        </td>
                        <td className="p-4 text-sm text-muted-foreground">{invoice.issueDate}</td>
                        <td className="p-4">
                          <span
                            className={cn(
                              "text-sm",
                              invoice.status === "overdue" ? "text-destructive font-medium" : "text-muted-foreground",
                            )}
                          >
                            {invoice.dueDate}
                          </span>
                        </td>
                        <td className="p-4">
                          <p className="font-bold text-foreground">${invoice.total.toLocaleString()}</p>
                        </td>
                        <td className="p-4">
                          <Badge
                            variant="outline"
                            className={cn(
                              invoice.status === "paid"
                                ? "bg-primary/10 text-primary"
                                : invoice.status === "sent"
                                  ? "bg-yellow-500/10 text-yellow-500"
                                  : invoice.status === "overdue"
                                    ? "bg-destructive/10 text-destructive"
                                    : "bg-secondary text-muted-foreground",
                            )}
                          >
                            {invoice.status === "paid" ? "Pagada" : invoice.status === "sent" ? "Enviada" : invoice.status === "overdue" ? "Vencida" : "Borrador"}
                          </Badge>
                        </td>
                        <td className="p-4">
                          <div className="flex items-center gap-2">
                            <Button size="sm" variant="ghost" className="h-8" onClick={() => setViewInvoiceId(invoice.id)}>
                              Ver
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="transactions">
            {transactions.length === 0 ? (
              <div className="bg-card rounded-2xl border border-border p-12 text-center">
                <DollarSign className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
                <p className="text-foreground font-medium mb-1">No hay transacciones</p>
                <p className="text-sm text-muted-foreground">
                  Las transacciones se registran automaticamente al procesar pagos
                </p>
              </div>
            ) : (
              <div className="bg-card rounded-2xl border border-border overflow-hidden">
                <table className="w-full">
                  <thead className="bg-secondary/50">
                    <tr>
                      <th className="text-left p-4 text-sm font-medium text-muted-foreground">ID</th>
                      <th className="text-left p-4 text-sm font-medium text-muted-foreground">Tipo</th>
                      <th className="text-left p-4 text-sm font-medium text-muted-foreground">Descripcion</th>
                      <th className="text-left p-4 text-sm font-medium text-muted-foreground">Categoria</th>
                      <th className="text-left p-4 text-sm font-medium text-muted-foreground">Monto</th>
                      <th className="text-left p-4 text-sm font-medium text-muted-foreground">Estado</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {transactions.map((tx) => (
                      <tr key={tx.id} className="hover:bg-secondary/30">
                        <td className="p-4 font-mono text-xs text-primary">{tx.id}</td>
                        <td className="p-4">
                          <Badge
                            variant="outline"
                            className={cn(
                              tx.type === "income"
                                ? "bg-primary/10 text-primary"
                                : "bg-destructive/10 text-destructive",
                            )}
                          >
                            {tx.type === "income" ? "Ingreso" : "Egreso"}
                          </Badge>
                        </td>
                        <td className="p-4">{tx.description}</td>
                        <td className="p-4">
                          <Badge variant="outline" className="bg-secondary">
                            {tx.category}
                          </Badge>
                        </td>
                        <td className="p-4 font-bold">${tx.amount.toLocaleString()}</td>
                        <td className="p-4">
                          <Badge
                            variant="outline"
                            className={cn(
                              tx.status === "completed"
                                ? "bg-primary/10 text-primary"
                                : "bg-yellow-500/10 text-yellow-500",
                            )}
                          >
                            {tx.status}
                          </Badge>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </TabsContent>

          <TabsContent value="costcenters">
            {/* Cost centers content same as before ... */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {costCenters.map((cc) => {
                const percentage = Math.round((cc.spent / cc.budget) * 100)
                return (
                  <Card key={cc.id} className="p-6 bg-card border-border">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <h3 className="font-semibold text-foreground">{cc.name}</h3>
                        <p className="text-xs text-muted-foreground">
                          {cc.code} - {cc.department}
                        </p>
                      </div>
                      <Badge variant="outline" className="bg-primary/10 text-primary">{percentage}%</Badge>
                    </div>
                    {/* ... progress bar ... */}
                    <div className="space-y-3">
                      <div className="w-full bg-secondary rounded-full h-2">
                        <div className="h-2 rounded-full bg-primary transition-all" style={{ width: `${Math.min(percentage, 100)}%` }} />
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Gastado: ${(cc.spent / 1000000).toFixed(1)}M</span>
                        <span className="text-foreground">Presupuesto: ${(cc.budget / 1000000).toFixed(1)}M</span>
                      </div>
                    </div>
                  </Card>
                )
              })}
            </div>
          </TabsContent>

          <TabsContent value="calendar">
            <div className="grid grid-cols-1 md:grid-cols-[300px_1fr] gap-6">
              <Card className="p-4 bg-card border-border">
                <CalendarComponent
                  mode="single"
                  selected={date}
                  onSelect={setDate}
                  className="rounded-md border-0"
                />
              </Card>
              <Card className="p-6 bg-card border-border">
                <h3 className="text-lg font-semibold mb-4">Eventos: {date?.toLocaleDateString()}</h3>
                <div className="space-y-4">
                  {invoices.filter(i => i.dueDate === date?.toISOString().split('T')[0]).length > 0 ? (
                    invoices.filter(i => i.dueDate === date?.toISOString().split('T')[0]).map(inv => (
                      <div key={inv.id} className="flex items-center justify-between p-3 rounded-lg bg-zinc-800/50 border border-zinc-800">
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-yellow-500/10 rounded-full text-yellow-500"><AlertCircle className="w-4 h-4" /></div>
                          <div>
                            <p className="font-medium text-white">Vencimiento Factura #{inv.number}</p>
                            <p className="text-xs text-zinc-400">{inv.clientName}</p>
                          </div>
                        </div>
                        <span className="font-bold text-white">${inv.total.toLocaleString()}</span>
                      </div>
                    ))
                  ) : (
                    <div className="text-center text-zinc-500 py-12">
                      <p>No hay eventos para esta fecha.</p>
                    </div>
                  )}
                </div>
              </Card>
            </div>
          </TabsContent>

        </Tabs>

        {/* INVOICE DETAIL VIEW MODAL (PRINTABLE) */}
        <Dialog open={!!viewInvoiceId} onOpenChange={() => setViewInvoiceId(null)}>
          <DialogContent className="bg-white text-black max-w-3xl p-0 overflow-hidden border-none sm:rounded-lg">
            {selectedInvoice && (
              <div className="flex flex-col h-[85vh] md:h-auto">
                <div className="flex-1 p-8 overflow-y-auto bg-white" id="printable-invoice">

                  {/* Invoice Header */}
                  <div className="flex justify-between mb-8">
                    <div>
                      <h2 className="text-3xl font-bold text-slate-900 tracking-tight">FACTURA DE VENTA</h2>
                      <p className="text-slate-500 mt-1">N° {selectedInvoice.number}</p>
                    </div>
                    <div className="text-right">
                      <h3 className="font-bold text-slate-900 text-lg">Nuux Enterprise S.A.S</h3>
                      <p className="text-sm text-slate-500">NIT: 900.123.456-7</p>
                      <p className="text-sm text-slate-500">Bogotá D.C, Colombia</p>
                    </div>
                  </div>

                  {/* Info Grid */}
                  <div className="grid grid-cols-2 gap-8 mb-8 bg-slate-50 p-6 rounded-lg border border-slate-100">
                    <div>
                      <p className="text-xs text-slate-500 uppercase tracking-wider font-semibold mb-1">FACTURADO A</p>
                      <p className="text-slate-900 font-bold text-lg">{selectedInvoice.clientName}</p>
                      <p className="text-slate-600">{selectedInvoice.clientEmail}</p>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-xs text-slate-500 uppercase tracking-wider font-semibold mb-1">FECHA DE EMISIÓN</p>
                        <p className="text-slate-900 font-medium">{selectedInvoice.issueDate}</p>
                      </div>
                      <div>
                        <p className="text-xs text-slate-500 uppercase tracking-wider font-semibold mb-1">VENCIMIENTO</p>
                        <p className="text-slate-900 font-medium">{selectedInvoice.dueDate}</p>
                      </div>
                    </div>
                  </div>

                  {/* Items Table */}
                  <table className="w-full mb-8">
                    <thead className="border-b border-slate-200">
                      <tr>
                        <th className="text-left py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Descripción</th>
                        <th className="text-center py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Cant.</th>
                        <th className="text-right py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Precio Unit.</th>
                        <th className="text-right py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Total</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {selectedInvoice.items.map((item, i) => (
                        <tr key={i}>
                          <td className="py-4 text-slate-700 font-medium">{item.description}</td>
                          <td className="py-4 text-center text-slate-600">{item.quantity}</td>
                          <td className="py-4 text-right text-slate-600">${item.unitPrice.toLocaleString()}</td>
                          <td className="py-4 text-right text-slate-900 font-bold">${item.total.toLocaleString()}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>

                  {/* Totals */}
                  <div className="flex justify-end">
                    <div className="w-64 space-y-3">
                      <div className="flex justify-between text-slate-600">
                        <span>Subtotal</span>
                        <span>${selectedInvoice.subtotal.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between text-slate-600">
                        <span>IVA (19%)</span>
                        <span>${selectedInvoice.tax.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between text-slate-900 font-bold text-xl pt-3 border-t border-slate-200">
                        <span>Total</span>
                        <span>${selectedInvoice.total.toLocaleString()}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Footer Actions */}
                <div className="bg-slate-50 p-6 border-t border-slate-200 flex justify-between items-center">
                  <span className="text-xs text-slate-400">Generado por Nuux Finance</span>
                  <div className="flex gap-2">
                    <Button variant="outline" className="border-slate-300 text-slate-700 hover:bg-slate-200">
                      <Printer className="w-4 h-4 mr-2" /> Imprimir
                    </Button>
                    <Button className="bg-slate-900 text-white hover:bg-slate-800">
                      <Download className="w-4 h-4 mr-2" /> Descargar PDF
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
}
