"use client"

import { useState } from "react"
import { Header } from "@/components/header"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { useTenant } from "@/lib/tenant-context"
import { useNuuxStore } from "@/lib/nuux-store"
import {
  Receipt,
  DollarSign,
  Calendar,
  CheckCircle2,
  Clock,
  FileText,
  Download,
  Calculator,
  Plus,
  Printer,
  Send,
  ArrowRight,
  Building2,
  Briefcase
} from "lucide-react"
import { cn } from "@/lib/utils"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

export default function PayrollPage() {
  const { getTenantUsers, currentTenant } = useTenant()
  const { payrollRecords, calculatePayroll } = useNuuxStore()

  const [calculateDialogOpen, setCalculateDialogOpen] = useState(false)
  const [selectedUserId, setSelectedUserId] = useState("")
  const [selectedPeriod, setSelectedPeriod] = useState("")
  const [viewPayslipId, setViewPayslipId] = useState<string | null>(null)

  const users = getTenantUsers()

  // Metrics
  const totalPayroll = payrollRecords.reduce((acc, p) => acc + p.netPay, 0)
  const totalTaxes = payrollRecords.reduce((acc, p) => acc + p.totalTaxes, 0)
  const pendingCount = payrollRecords.filter((p) => p.status === "draft" || p.status === "calculated").length

  const handleCalculatePayroll = () => {
    if (selectedUserId && selectedPeriod) {
      calculatePayroll(selectedUserId, selectedPeriod)
      setCalculateDialogOpen(false)
      setSelectedUserId("")
      setSelectedPeriod("")
    }
  }

  const getUser = (userId: string) => users.find((u) => u.id === userId)
  const currentPeriod = new Date().toISOString().slice(0, 7)
  const periods = [
    { value: currentPeriod, label: `${currentPeriod} (Actual)` },
    { value: "2024-11", label: "2024-11 (Anterior)" },
  ]

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'paid': return <Badge className="bg-emerald-500/10 text-emerald-500 border-emerald-500/20">Pagado</Badge>
      case 'approved': return <Badge className="bg-blue-500/10 text-blue-500 border-blue-500/20">Aprobado</Badge>
      case 'calculated': return <Badge className="bg-yellow-500/10 text-yellow-500 border-yellow-500/20">Calculado</Badge>
      default: return <Badge variant="outline" className="text-zinc-500">Borrador</Badge>
    }
  }

  const selectedPayslip = payrollRecords.find(p => p.id === viewPayslipId)
  const selectedPayslipUser = selectedPayslip ? getUser(selectedPayslip.userId) : null

  return (
    <div className="min-h-screen bg-black/20">
      <Header
        title="Nómina Profesional"
        subtitle="Gestión centralizada de salarios y compensaciones"
      />

      <div className="p-8 space-y-8">

        {/* Top Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="bg-[#18181B] border-[#27272A] p-6">
            <div className="flex justify-between items-start mb-4">
              <div className="p-2 bg-blue-500/10 rounded-lg">
                <DollarSign className="w-5 h-5 text-blue-500" />
              </div>
              <span className="text-xs text-zinc-500 bg-zinc-900 px-2 py-1 rounded">Mes Actual</span>
            </div>
            <p className="text-zinc-400 text-sm">Total a Dispersar</p>
            <h3 className="text-2xl font-bold text-white mt-1">${(totalPayroll / 1000000).toFixed(2)}M</h3>
          </Card>
          <Card className="bg-[#18181B] border-[#27272A] p-6">
            <div className="flex justify-between items-start mb-4">
              <div className="p-2 bg-rose-500/10 rounded-lg">
                <Building2 className="w-5 h-5 text-rose-500" />
              </div>
            </div>
            <p className="text-zinc-400 text-sm">Cargas Sociales/Impuestos</p>
            <h3 className="text-2xl font-bold text-white mt-1">${(totalTaxes / 1000000).toFixed(2)}M</h3>
          </Card>
          <Card className="bg-[#18181B] border-[#27272A] p-6">
            <div className="flex justify-between items-start mb-4">
              <div className="p-2 bg-amber-500/10 rounded-lg">
                <Clock className="w-5 h-5 text-amber-500" />
              </div>
              {pendingCount > 0 && <span className="absolute top-4 right-4 h-2 w-2 rounded-full bg-amber-500 animate-pulse" />}
            </div>
            <p className="text-zinc-400 text-sm">Pendientes de Aprobación</p>
            <h3 className="text-2xl font-bold text-white mt-1">{pendingCount}</h3>
          </Card>
          <Card className="bg-[#18181B] border-[#27272A] p-6 flex flex-col justify-center gap-3">
            <Button className="w-full bg-blue-600 hover:bg-blue-700" onClick={() => setCalculateDialogOpen(true)}>
              <Calculator className="w-4 h-4 mr-2" />
              Calcular Nueva
            </Button>
            <Button variant="outline" className="w-full border-zinc-800 text-zinc-300 hover:bg-zinc-800">
              <Download className="w-4 h-4 mr-2" />
              Exportar Reporte
            </Button>
          </Card>
        </div>

        {/* Main Content Tabs */}
        <Tabs defaultValue="current" className="space-y-6">
          <TabsList className="bg-[#18181B] border border-[#27272A] p-1">
            <TabsTrigger value="current">Nómina Actual ({currentPeriod})</TabsTrigger>
            <TabsTrigger value="history">Historial</TabsTrigger>
            <TabsTrigger value="settings">Configuración</TabsTrigger>
          </TabsList>

          <TabsContent value="current">
            <Card className="bg-[#18181B] border-[#27272A] overflow-hidden">
              <div className="p-4 border-b border-[#27272A] flex justify-between items-center bg-zinc-900/50">
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold text-white">Listado de Empleados</h3>
                  <Badge variant="secondary" className="bg-zinc-800 text-zinc-400">{payrollRecords.length}</Badge>
                </div>
                <div className="flex gap-2">
                  <Button size="sm" variant="ghost" className="text-zinc-400"><Filter className="w-4 h-4 mr-2" /> Filtros</Button>
                </div>
              </div>

              {payrollRecords.length === 0 ? (
                <div className="p-12 text-center text-zinc-500">
                  <Receipt className="w-12 h-12 mx-auto mb-3 opacity-20" />
                  <p>No hay registros de nómina para este periodo.</p>
                  <Button variant="link" onClick={() => setCalculateDialogOpen(true)} className="text-blue-500">Calcular ahora</Button>
                </div>
              ) : (
                <Table>
                  <TableHeader className="bg-zinc-900/50">
                    <TableRow className="border-zinc-800 hover:bg-transparent">
                      <TableHead className="text-zinc-400">Empleado</TableHead>
                      <TableHead className="text-zinc-400 text-right">Salario Base</TableHead>
                      <TableHead className="text-zinc-400 text-right">Bonos/Extras</TableHead>
                      <TableHead className="text-zinc-400 text-right">Deducciones</TableHead>
                      <TableHead className="text-zinc-400 text-right">Neto</TableHead>
                      <TableHead className="text-zinc-400 text-center">Estado</TableHead>
                      <TableHead className="text-zinc-400 text-right">Acciones</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {payrollRecords.map((payroll) => {
                      const user = getUser(payroll.userId)
                      const totalBonus = payroll.bonuses.reduce((acc, b) => acc + b.amount, 0) + payroll.overtimePay
                      const totalDeductions = payroll.totalDeductions + payroll.totalTaxes
                      return (
                        <TableRow key={payroll.id} className="border-zinc-800 hover:bg-zinc-900/50 transition-colors">
                          <TableCell>
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 rounded-full bg-zinc-800 flex items-center justify-center text-xs font-medium text-zinc-400">
                                {user?.name.substring(0, 2).toUpperCase()}
                              </div>
                              <div>
                                <p className="font-medium text-white text-sm">{user?.name}</p>
                                <p className="text-xs text-zinc-500">{user?.position}</p>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell className="text-right text-zinc-300">${payroll.baseSalary.toLocaleString()}</TableCell>
                          <TableCell className="text-right text-emerald-500">+${totalBonus.toLocaleString()}</TableCell>
                          <TableCell className="text-right text-rose-500">-${totalDeductions.toLocaleString()}</TableCell>
                          <TableCell className="text-right font-bold text-white">${payroll.netPay.toLocaleString()}</TableCell>
                          <TableCell className="text-center">{getStatusBadge(payroll.status)}</TableCell>
                          <TableCell className="text-right">
                            <Button
                              size="sm"
                              variant="ghost"
                              className="h-8 w-8 p-0"
                              onClick={() => setViewPayslipId(payroll.id)}
                            >
                              <FileText className="w-4 h-4 text-zinc-400 hover:text-white" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      )
                    })}
                  </TableBody>
                </Table>
              )}
            </Card>
          </TabsContent>

          <TabsContent value="history">
            <Card className="bg-[#18181B] border-[#27272A] p-12 text-center text-zinc-500">
              Historial de nóminas anteriores aparecerá aquí.
            </Card>
          </TabsContent>
        </Tabs>

        {/* CALCULATE DIALOG */}
        <Dialog open={calculateDialogOpen} onOpenChange={setCalculateDialogOpen}>
          <DialogContent className="bg-[#18181B] border-[#27272A]">
            <DialogHeader>
              <DialogTitle className="text-white">Generar Nómina</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label className="text-zinc-400">Empleado</Label>
                <Select value={selectedUserId} onValueChange={setSelectedUserId}>
                  <SelectTrigger className="bg-zinc-900 border-zinc-800 text-white">
                    <SelectValue placeholder="Seleccionar..." />
                  </SelectTrigger>
                  <SelectContent className="bg-zinc-900 border-zinc-800 text-white">
                    {users.map((user) => (
                      <SelectItem key={user.id} value={user.id}>
                        {user.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label className="text-zinc-400">Periodo</Label>
                <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
                  <SelectTrigger className="bg-zinc-900 border-zinc-800 text-white">
                    <SelectValue placeholder="Seleccionar..." />
                  </SelectTrigger>
                  <SelectContent className="bg-zinc-900 border-zinc-800 text-white">
                    {periods.map((period) => (
                      <SelectItem key={period.value} value={period.value}>
                        {period.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button onClick={handleCalculatePayroll} className="bg-blue-600 hover:bg-blue-700 w-full">Calcular</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* PAYSLIP MODAL (Profesional) */}
        <Dialog open={!!selectedPayslip} onOpenChange={() => setViewPayslipId(null)}>
          <DialogContent className="bg-white text-black max-w-3xl p-0 overflow-hidden border-none sm:rounded-lg">
            {selectedPayslip && selectedPayslipUser && (
              <div className="flex flex-col h-[80vh] md:h-auto">
                <div className="flex-1 p-8 overflow-y-auto" id="printable-payslip">
                  {/* Header */}
                  <div className="flex justify-between items-start border-b-2 border-zinc-200 pb-6 mb-6">
                    <div>
                      <h2 className="text-2xl font-bold text-zinc-900 uppercase tracking-wide">Comprobante de Pago</h2>
                      <p className="text-zinc-500 text-sm mt-1">Periodo: {selectedPayslip.period}</p>
                    </div>
                    <div className="text-right">
                      <h3 className="font-bold text-zinc-900">{currentTenant?.name || "Empresa Demo"}</h3>
                      <p className="text-sm text-zinc-500">NIT: 900.123.456-7</p>
                      <p className="text-sm text-zinc-500">Calle 100 # 15-20, Bogotá</p>
                    </div>
                  </div>

                  {/* Employee Info */}
                  <div className="bg-zinc-50 rounded-lg p-4 mb-6 grid grid-cols-2 gap-4 text-sm border border-zinc-100">
                    <div>
                      <p className="text-xs text-zinc-500 uppercase">Empleado</p>
                      <p className="font-bold text-zinc-900">{selectedPayslipUser.name}</p>
                    </div>
                    <div>
                      <p className="text-xs text-zinc-500 uppercase">Cargo</p>
                      <p className="font-medium text-zinc-900">{selectedPayslipUser.position || "N/A"}</p>
                    </div>
                    <div>
                      <p className="text-xs text-zinc-500 uppercase">Identificación</p>
                      <p className="font-medium text-zinc-900">CC 1.234.567.890</p>
                    </div>
                    <div>
                      <p className="text-xs text-zinc-500 uppercase">Fecha de Pago</p>
                      <p className="font-medium text-zinc-900">{new Date().toLocaleDateString()}</p>
                    </div>
                  </div>

                  {/* Details Table */}
                  <div className="grid grid-cols-2 gap-8 mb-8">
                    {/* Earnings */}
                    <div>
                      <h4 className="font-bold text-emerald-700 bg-emerald-50 p-2 rounded mb-3 text-sm border border-emerald-100">DEVENGADO</h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between py-1 border-b border-zinc-100">
                          <span>Salario Base</span>
                          <span className="font-medium">${selectedPayslip.baseSalary.toLocaleString()}</span>
                        </div>
                        {selectedPayslip.overtimePay > 0 && (
                          <div className="flex justify-between py-1 border-b border-zinc-100">
                            <span>Horas Extra ({selectedPayslip.overtimeHours}h)</span>
                            <span className="font-medium">${selectedPayslip.overtimePay.toLocaleString()}</span>
                          </div>
                        )}
                        {selectedPayslip.bonuses.map((b, i) => (
                          <div key={i} className="flex justify-between py-1 border-b border-zinc-100">
                            <span>{b.concept}</span>
                            <span className="font-medium">${b.amount.toLocaleString()}</span>
                          </div>
                        ))}
                      </div>
                      <div className="mt-4 pt-2 border-t border-zinc-200 flex justify-between font-bold">
                        <span>Total Devengado</span>
                        <span>${(selectedPayslip.baseSalary + selectedPayslip.overtimePay + selectedPayslip.bonuses.reduce((a, b) => a + b.amount, 0)).toLocaleString()}</span>
                      </div>
                    </div>

                    {/* Deductions */}
                    <div>
                      <h4 className="font-bold text-rose-700 bg-rose-50 p-2 rounded mb-3 text-sm border border-rose-100">DEDUCCIONES</h4>
                      <div className="space-y-2 text-sm">
                        {selectedPayslip.taxes.map((t, i) => (
                          <div key={i} className="flex justify-between py-1 border-b border-zinc-100">
                            <span>{t.concept}</span>
                            <span className="font-medium">${t.amount.toLocaleString()}</span>
                          </div>
                        ))}
                        {selectedPayslip.deductions.map((d, i) => (
                          <div key={i} className="flex justify-between py-1 border-b border-zinc-100">
                            <span>{d.concept}</span>
                            <span className="font-medium">${d.amount.toLocaleString()}</span>
                          </div>
                        ))}
                      </div>
                      <div className="mt-4 pt-2 border-t border-zinc-200 flex justify-between font-bold">
                        <span>Total Deducido</span>
                        <span>${(selectedPayslip.totalDeductions + selectedPayslip.totalTaxes).toLocaleString()}</span>
                      </div>
                    </div>
                  </div>

                  {/* Net Pay */}
                  <div className="bg-zinc-900 text-white p-6 rounded-xl flex justify-between items-center shadow-lg">
                    <div>
                      <p className="text-zinc-400 text-sm uppercase tracking-wider font-medium">Neto a Pagar</p>
                      <p className="text-xs text-zinc-500 mt-1">Cuenta: Ahorros Bancolombia *****1234</p>
                    </div>
                    <p className="text-3xl font-bold">${selectedPayslip.netPay.toLocaleString()}</p>
                  </div>
                </div>

                {/* Footer Actions */}
                <div className="bg-zinc-50 p-4 border-t border-zinc-200 flex justify-between items-center">
                  <Button variant="outline" className="text-zinc-600 border-zinc-300 hover:bg-zinc-100">
                    <Printer className="w-4 h-4 mr-2" /> Imprimir
                  </Button>
                  <div className="flex gap-2">
                    <Button variant="outline" className="text-zinc-600 border-zinc-300 hover:bg-zinc-100">
                      <Download className="w-4 h-4 mr-2" /> PDF
                    </Button>
                    <Button className="bg-blue-600 hover:bg-blue-700 text-white shadow-md">
                      <Send className="w-4 h-4 mr-2" /> Enviar al Empleado
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

function Filter(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
    </svg>
  )
}
