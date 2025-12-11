"use client"

import { useState } from "react"
import { Header } from "@/components/header"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { useTenant } from "@/lib/tenant-context"
import { useNuuxStore } from "@/lib/nuux-store"
import { Receipt, DollarSign, Calendar, CheckCircle2, Clock, FileText, Download, Calculator, Plus } from "lucide-react"
import { cn } from "@/lib/utils"

export default function PayrollPage() {
  const { getTenantUsers } = useTenant()
  const { payrollRecords, attendanceRecords, calculatePayroll } = useNuuxStore()

  const [calculateDialogOpen, setCalculateDialogOpen] = useState(false)
  const [selectedUserId, setSelectedUserId] = useState("")
  const [selectedPeriod, setSelectedPeriod] = useState("")

  const users = getTenantUsers()

  const totalPayroll = payrollRecords.reduce((acc, p) => acc + p.netPay, 0)
  const totalTaxes = payrollRecords.reduce((acc, p) => acc + p.totalTaxes, 0)
  const totalBonuses = payrollRecords.reduce((acc, p) => acc + p.bonuses.reduce((b, bonus) => b + bonus.amount, 0), 0)
  const approved = payrollRecords.filter((p) => p.status === "approved" || p.status === "paid").length
  const pending = payrollRecords.filter((p) => p.status === "draft" || p.status === "calculated").length

  const handleCalculatePayroll = () => {
    if (selectedUserId && selectedPeriod) {
      calculatePayroll(selectedUserId, selectedPeriod)
      setCalculateDialogOpen(false)
      setSelectedUserId("")
      setSelectedPeriod("")
    }
  }

  const getUser = (userId: string) => users.find((u) => u.id === userId)

  // Get current period
  const currentPeriod = new Date().toISOString().slice(0, 7)
  const periods = [
    { value: currentPeriod, label: `${currentPeriod} (Actual)` },
    {
      value: new Date(new Date().setMonth(new Date().getMonth() - 1)).toISOString().slice(0, 7),
      label: "Mes Anterior",
    },
  ]

  return (
    <div className="min-h-screen">
      <Header
        title="Nuux Payroll"
        subtitle="Calculadora de nomina: Neto = Base + HorasExtras - Deducciones - Impuestos"
      />

      <div className="p-8">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-8">
          <Card className="p-6 bg-card border-border">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-xl bg-primary/10">
                <DollarSign className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="text-muted-foreground text-sm">Total Nomina</p>
                <p className="text-2xl font-bold text-primary">${(totalPayroll / 1000000).toFixed(1)}M</p>
              </div>
            </div>
          </Card>
          <Card className="p-6 bg-card border-border">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-xl bg-destructive/10">
                <Receipt className="w-5 h-5 text-destructive" />
              </div>
              <div>
                <p className="text-muted-foreground text-sm">Impuestos</p>
                <p className="text-2xl font-bold text-destructive">${(totalTaxes / 1000000).toFixed(1)}M</p>
              </div>
            </div>
          </Card>
          <Card className="p-6 bg-card border-border">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-xl bg-yellow-500/10">
                <Plus className="w-5 h-5 text-yellow-500" />
              </div>
              <div>
                <p className="text-muted-foreground text-sm">Bonos/Comisiones</p>
                <p className="text-2xl font-bold text-yellow-500">${(totalBonuses / 1000000).toFixed(1)}M</p>
              </div>
            </div>
          </Card>
          <Card className="p-6 bg-card border-border">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-xl bg-primary/10">
                <CheckCircle2 className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="text-muted-foreground text-sm">Aprobadas</p>
                <p className="text-2xl font-bold text-foreground">{approved}</p>
              </div>
            </div>
          </Card>
          <Card className="p-6 bg-card border-border">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-xl bg-orange-500/10">
                <Clock className="w-5 h-5 text-orange-500" />
              </div>
              <div>
                <p className="text-muted-foreground text-sm">Pendientes</p>
                <p className="text-2xl font-bold text-orange-500">{pending}</p>
              </div>
            </div>
          </Card>
        </div>

        {/* Period Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <Calendar className="w-5 h-5 text-primary" />
            <h2 className="text-xl font-semibold text-foreground">Periodo: {currentPeriod}</h2>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" className="bg-transparent">
              <Download className="w-4 h-4 mr-2" />
              Exportar
            </Button>
            <Dialog open={calculateDialogOpen} onOpenChange={setCalculateDialogOpen}>
              <DialogTrigger asChild>
                <Button className="bg-primary hover:bg-primary/90 text-primary-foreground neon-glow">
                  <Calculator className="w-4 h-4 mr-2" />
                  Calcular Nomina
                </Button>
              </DialogTrigger>
              <DialogContent className="bg-card border-border">
                <DialogHeader>
                  <DialogTitle>Calcular Nomina de Empleado</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 pt-4">
                  <div className="space-y-2">
                    <Label>Empleado</Label>
                    <Select value={selectedUserId} onValueChange={setSelectedUserId}>
                      <SelectTrigger className="bg-secondary border-border">
                        <SelectValue placeholder="Seleccionar empleado" />
                      </SelectTrigger>
                      <SelectContent>
                        {users.map((user) => (
                          <SelectItem key={user.id} value={user.id}>
                            {user.name} - {user.position}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Periodo</Label>
                    <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
                      <SelectTrigger className="bg-secondary border-border">
                        <SelectValue placeholder="Seleccionar periodo" />
                      </SelectTrigger>
                      <SelectContent>
                        {periods.map((period) => (
                          <SelectItem key={period.value} value={period.value}>
                            {period.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="p-4 rounded-xl bg-secondary/50 text-sm">
                    <p className="text-muted-foreground mb-2">Formula de calculo:</p>
                    <p className="text-foreground font-mono">
                      Neto = SalarioBase + (HorasExtra x TarifaExtra) - Deducciones - Impuestos
                    </p>
                  </div>
                  <Button
                    className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
                    onClick={handleCalculatePayroll}
                  >
                    <Calculator className="w-4 h-4 mr-2" />
                    Calcular
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* Payroll List */}
        {payrollRecords.length === 0 ? (
          <Card className="p-12 bg-card border-border text-center">
            <Receipt className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
            <p className="text-foreground font-medium mb-1">No hay nominas calculadas</p>
            <p className="text-sm text-muted-foreground mb-4">
              Usa el boton Calcular Nomina para generar la primera nomina basada en asistencia
            </p>
          </Card>
        ) : (
          <div className="space-y-4">
            {payrollRecords.map((payroll) => {
              const user = getUser(payroll.userId)
              const totalBonusAmount = payroll.bonuses.reduce((sum, b) => sum + b.amount, 0)

              return (
                <Card key={payroll.id} className="p-6 bg-card border-border hover:border-primary/20 transition-all">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center text-primary font-medium">
                        {user?.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("") || "?"}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-semibold text-foreground">{user?.name || payroll.userId}</h3>
                          <Badge
                            variant="outline"
                            className={cn(
                              payroll.status === "paid"
                                ? "bg-primary/10 text-primary"
                                : payroll.status === "approved"
                                  ? "bg-blue-500/10 text-blue-500"
                                  : payroll.status === "calculated"
                                    ? "bg-yellow-500/10 text-yellow-500"
                                    : "bg-secondary text-muted-foreground",
                            )}
                          >
                            {payroll.status === "paid"
                              ? "Pagado"
                              : payroll.status === "approved"
                                ? "Aprobado"
                                : payroll.status === "calculated"
                                  ? "Calculado"
                                  : "Borrador"}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {user?.position} - Periodo: {payroll.period}
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">ID: {payroll.id}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-8">
                      <div className="grid grid-cols-5 gap-6 text-sm">
                        <div>
                          <p className="text-muted-foreground">Salario Base</p>
                          <p className="font-medium text-foreground">${payroll.baseSalary.toLocaleString()}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Horas Extra</p>
                          <p className="font-medium text-primary">
                            +${payroll.overtimePay.toLocaleString()}
                            {payroll.overtimeHours > 0 && (
                              <span className="text-xs text-muted-foreground ml-1">
                                ({payroll.overtimeHours.toFixed(1)}h)
                              </span>
                            )}
                          </p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Bonos</p>
                          <p className="font-medium text-yellow-500">+${totalBonusAmount.toLocaleString()}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Deducciones</p>
                          <p className="font-medium text-destructive">
                            -${(payroll.totalDeductions + payroll.totalTaxes).toLocaleString()}
                          </p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Neto a Pagar</p>
                          <p className="font-bold text-primary text-lg">${payroll.netPay.toLocaleString()}</p>
                        </div>
                      </div>

                      <div className="flex gap-2">
                        <Button variant="outline" size="sm" className="bg-transparent">
                          <FileText className="w-4 h-4 mr-1" />
                          Colilla
                        </Button>
                        {payroll.status === "calculated" && (
                          <Button size="sm" className="bg-primary hover:bg-primary/90 text-primary-foreground">
                            Aprobar
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Detailed Breakdown */}
                  <div className="mt-4 pt-4 border-t border-border">
                    <div className="grid grid-cols-3 gap-6">
                      <div>
                        <p className="text-xs font-medium text-muted-foreground mb-2">PERCEPCIONES</p>
                        <div className="space-y-1">
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-muted-foreground">Salario Base</span>
                            <span className="text-primary">+${payroll.baseSalary.toLocaleString()}</span>
                          </div>
                          {payroll.overtimePay > 0 && (
                            <div className="flex items-center justify-between text-sm">
                              <span className="text-muted-foreground">
                                Horas Extra ({payroll.overtimeHours.toFixed(1)}h)
                              </span>
                              <span className="text-primary">+${payroll.overtimePay.toLocaleString()}</span>
                            </div>
                          )}
                          {payroll.bonuses.map((bonus, i) => (
                            <div key={i} className="flex items-center justify-between text-sm">
                              <span className="text-muted-foreground">{bonus.concept}</span>
                              <span className="text-yellow-500">+${bonus.amount.toLocaleString()}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                      <div>
                        <p className="text-xs font-medium text-muted-foreground mb-2">DEDUCCIONES</p>
                        <div className="space-y-1">
                          {payroll.deductions.map((ded, i) => (
                            <div key={i} className="flex items-center justify-between text-sm">
                              <span className="text-muted-foreground">{ded.concept}</span>
                              <span className="text-destructive">-${ded.amount.toLocaleString()}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                      <div>
                        <p className="text-xs font-medium text-muted-foreground mb-2">IMPUESTOS</p>
                        <div className="space-y-1">
                          {payroll.taxes.map((tax, i) => (
                            <div key={i} className="flex items-center justify-between text-sm">
                              <span className="text-muted-foreground">
                                {tax.concept} ({(tax.rate * 100).toFixed(0)}%)
                              </span>
                              <span className="text-destructive">-${tax.amount.toLocaleString()}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
