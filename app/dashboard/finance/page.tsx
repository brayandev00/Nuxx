"use client"
import { Header } from "@/components/header"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useNuuxStore } from "@/lib/nuux-store"
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

export default function FinancePage() {
  const { transactions, invoices, costCenters, getCashFlowProjection, getExpensesByDepartment, markInvoiceAsPaid } =
    useNuuxStore()

  const income = transactions
    .filter((t) => t.type === "income" && t.status === "completed")
    .reduce((acc, t) => acc + t.amount, 0)
  const expenses = transactions
    .filter((t) => t.type === "expense" && t.status === "completed")
    .reduce((acc, t) => acc + t.amount, 0)
  const balance = income - expenses

  const pendingInvoices = invoices.filter((inv) => inv.status === "sent" || inv.status === "overdue")
  const pendingAmount = pendingInvoices.reduce((acc, inv) => acc + inv.total, 0)
  const overdueAmount = invoices.filter((inv) => inv.status === "overdue").reduce((acc, inv) => acc + inv.total, 0)

  // Cash flow projection for next 30 days
  const cashFlowData = getCashFlowProjection(30)

  // Expenses by department
  const departmentExpenses = getExpensesByDepartment()
  const COLORS = ["#10B981", "#3B82F6", "#F59E0B", "#EC4899", "#8B5CF6"]

  const paymentIcons = {
    cash: Banknote,
    transfer: Building,
    card: CreditCard,
    check: FileText,
  }

  const handleMarkAsPaid = (invoiceId: string) => {
    markInvoiceAsPaid(invoiceId)
  }

  return (
    <div className="min-h-screen">
      <Header title="Nuux Finance" subtitle="Sistema contable con proyeccion de flujo de caja" />

      <div className="p-8">
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

        {/* Cash Flow Projection Chart */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <Card className="col-span-2 p-6 bg-card border-border">
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
                    <span className="text-xs text-muted-foreground ml-2">
                      ({Math.round((dept.total / dept.budget) * 100)}%)
                    </span>
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
            </TabsList>
            <div className="flex gap-3">
              <Button variant="outline" className="bg-transparent border-primary text-primary hover:bg-primary/10">
                <ArrowDownRight className="w-4 h-4 mr-2" />
                Registrar Egreso
              </Button>
              <Button className="bg-primary hover:bg-primary/90 text-primary-foreground neon-glow">
                <Plus className="w-4 h-4 mr-2" />
                Nueva Factura
              </Button>
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
                          {invoice.salesCommission && (
                            <p className="text-xs text-primary">Com: ${invoice.salesCommission.toLocaleString()}</p>
                          )}
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
                            {invoice.status === "paid"
                              ? "Pagada"
                              : invoice.status === "sent"
                                ? "Enviada"
                                : invoice.status === "overdue"
                                  ? "Vencida"
                                  : invoice.status === "draft"
                                    ? "Borrador"
                                    : "Cancelada"}
                          </Badge>
                        </td>
                        <td className="p-4">
                          <div className="flex items-center gap-2">
                            {(invoice.status === "sent" || invoice.status === "overdue") && (
                              <Button
                                size="sm"
                                className="bg-primary hover:bg-primary/90 text-primary-foreground h-8"
                                onClick={() => handleMarkAsPaid(invoice.id)}
                              >
                                <CheckCircle2 className="w-3 h-3 mr-1" />
                                Marcar Pagada
                              </Button>
                            )}
                            <Button size="sm" variant="ghost" className="h-8">
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
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {costCenters.map((cc) => {
                const percentage = Math.round((cc.spent / cc.budget) * 100)
                const isOverBudget = percentage > 90

                return (
                  <Card key={cc.id} className="p-6 bg-card border-border">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <h3 className="font-semibold text-foreground">{cc.name}</h3>
                        <p className="text-xs text-muted-foreground">
                          {cc.code} - {cc.department}
                        </p>
                      </div>
                      <Badge
                        variant="outline"
                        className={cn(
                          isOverBudget ? "bg-destructive/10 text-destructive" : "bg-primary/10 text-primary",
                        )}
                      >
                        {percentage}%
                      </Badge>
                    </div>
                    <div className="space-y-3">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Gastado</span>
                        <span className="text-foreground font-medium">${(cc.spent / 1000000).toFixed(1)}M</span>
                      </div>
                      <div className="w-full bg-secondary rounded-full h-2">
                        <div
                          className={cn(
                            "h-2 rounded-full transition-all",
                            isOverBudget ? "bg-destructive" : "bg-primary",
                          )}
                          style={{ width: `${Math.min(percentage, 100)}%` }}
                        />
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Presupuesto</span>
                        <span className="text-foreground">${(cc.budget / 1000000).toFixed(1)}M</span>
                      </div>
                    </div>
                  </Card>
                )
              })}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
