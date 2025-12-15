"use client"

import { create } from "zustand"
import type {
  Product,
  StockMovement,
  Warehouse,
  PurchaseOrder,
  Transaction,
  Invoice,
  PayrollRecord,
  AttendanceRecord,
  VacationRequest,
  CostCenter,
  BankStatement,
  AuditLog,
  Supplier,
  BankAccount,
  InvoiceTemplateConfig,
} from "./types"

interface NuuxStore {
  // Inventory State
  products: Product[]
  stockMovements: StockMovement[]
  warehouses: Warehouse[]
  purchaseOrders: PurchaseOrder[]
  suppliers: Supplier[]
  addSupplier: (supplier: Omit<Supplier, "id" | "status">) => void
  updateSupplier: (id: string, updates: Partial<Supplier>) => void
  deleteSupplier: (id: string) => void

  // Finance State
  transactions: Transaction[]
  invoices: Invoice[]
  costCenters: CostCenter[]
  bankStatements: BankStatement[]
  bankAccounts: BankAccount[]
  auditLogs: AuditLog[]

  // RRHH State
  payrollRecords: PayrollRecord[]
  attendanceRecords: AttendanceRecord[]
  vacationRequests: VacationRequest[]

  // KARDEX Actions - FIFO Logic
  addStockMovement: (movement: Omit<StockMovement, "id" | "createdAt">) => void
  processSaleFIFO: (productId: string, quantity: number, reference: string) => { success: boolean; cost: number }
  checkLowStock: () => Product[]
  generatePurchaseOrder: (productId: string) => PurchaseOrder | null
  transferStock: (productId: string, quantity: number, fromWarehouse: string, toWarehouse: string) => boolean
  createPurchaseOrder: (po: Omit<PurchaseOrder, "id" | "createdAt">) => void // Add createPO
  updatePurchaseOrder: (id: string, status: PurchaseOrder["status"]) => void


  // Finance Actions
  addTransaction: (transaction: Omit<Transaction, "id">) => void
  addInvoice: (invoice: Omit<Invoice, "id" | "status">) => void
  updateInvoice: (id: string, updates: Partial<Invoice>) => void
  invoiceTemplate: InvoiceTemplateConfig
  updateInvoiceTemplate: (config: Partial<InvoiceTemplateConfig>) => void
  markInvoiceAsPaid: (invoiceId: string) => void
  getCashFlowProjection: (days: number) => { date: string; balance: number }[]
  getExpensesByDepartment: () => { department: string; total: number; budget: number }[]
  reconcileBankStatement: (statementId: string, matchId: string, type: "invoice" | "transaction") => void
  connectBankAccount: (provider: "bancolombia" | "nequi", credentials: any) => Promise<boolean>

  // RRHH Actions
  checkIn: (userId: string) => void
  checkOut: (userId: string) => void
  calculatePayroll: (userId: string, period: string, overrides?: { baseSalary?: number, bonuses?: { concept: string, amount: number, type: "fixed" | "percentage" }[] }) => PayrollRecord
  requestVacation: (request: Omit<VacationRequest, "id" | "createdAt" | "status">) => void
  approveVacation: (requestId: string, approverId: string) => void
  rejectVacation: (requestId: string, approverId: string, reason: string) => void

  // Cross-Module Actions
  processSaleWithInventoryUpdate: (invoiceId: string) => void
  addSalesCommissionToPayroll: (salesPersonId: string, commission: number, period: string) => void

  // Setters
  setProducts: (products: Product[]) => void
  setTransactions: (transactions: Transaction[]) => void
  setInvoices: (invoices: Invoice[]) => void
}

// Initial mock data
const initialWarehouses: Warehouse[] = [
  {
    id: "WH-001",
    tenantId: "tenant-001",
    name: "Bodega Principal",
    code: "BP",
    address: "Calle 45 #23-15",
    type: "principal",
    status: "active",
  },
  {
    id: "WH-002",
    tenantId: "tenant-001",
    name: "Sucursal A",
    code: "SA",
    address: "Av. Circunvalar #12-30",
    type: "sucursal",
    status: "active",
  },
]

const initialCostCenters: CostCenter[] = [
  {
    id: "CC-001",
    tenantId: "tenant-001",
    name: "Ventas",
    code: "VNT",
    department: "Ventas",
    budget: 50000000,
    spent: 32000000,
    status: "active",
  },
  {
    id: "CC-002",
    tenantId: "tenant-001",
    name: "Tecnologia",
    code: "TEC",
    department: "TI",
    budget: 80000000,
    spent: 45000000,
    status: "active",
  },
  {
    id: "CC-003",
    tenantId: "tenant-001",
    name: "Administracion",
    code: "ADM",
    department: "Admin",
    budget: 30000000,
    spent: 22000000,
    status: "active",
  },
]

const initialProducts: Product[] = [
  {
    id: "PRD-001",
    tenantId: "tenant-001",
    sku: "LAP-MAC-001",
    name: 'MacBook Pro 14"',
    description: "Laptop Apple MacBook Pro M3 Pro",
    category: "Electronicos",
    price: 5299000,
    cost: 4500000,
    quantity: 15,
    minStock: 5,
    maxStock: 30,
    reorderPoint: 8,
    location: "A-1-01",
    warehouseId: "WH-001",
    supplierId: "SUP-001",
    barcode: "7501234567890",
    createdAt: "2024-01-10",
    updatedAt: "2024-12-01",
    createdBy: "USR-001",
    status: "active",
    lots: [
      {
        id: "LOT-001",
        productId: "PRD-001",
        lotNumber: "LT2024-001",
        quantity: 10,
        unitCost: 4500000,
        entryDate: "2024-10-15",
        warehouse: "WH-001",
      },
      {
        id: "LOT-002",
        productId: "PRD-001",
        lotNumber: "LT2024-002",
        quantity: 5,
        unitCost: 4600000,
        entryDate: "2024-11-20",
        warehouse: "WH-001",
      },
    ],
  },
  {
    id: "PRD-002",
    tenantId: "tenant-001",
    sku: "MON-DEL-001",
    name: 'Monitor Dell 27" 4K',
    description: "Monitor Dell UltraSharp 27 4K USB-C",
    category: "Electronicos",
    price: 1299000,
    cost: 950000,
    quantity: 3,
    minStock: 5,
    maxStock: 20,
    reorderPoint: 6,
    location: "A-2-01",
    warehouseId: "WH-001",
    supplierId: "SUP-002",
    barcode: "7501234567891",
    createdAt: "2024-02-15",
    updatedAt: "2024-11-28",
    createdBy: "USR-001",
    status: "active",
    lots: [
      {
        id: "LOT-003",
        productId: "PRD-002",
        lotNumber: "LT2024-003",
        quantity: 3,
        unitCost: 950000,
        entryDate: "2024-09-10",
        warehouse: "WH-001",
      },
    ],
  },
]

const initialInvoices: Invoice[] = [
  {
    id: "INV-001",
    tenantId: "tenant-001",
    number: "F-2024-0125",
    clientId: "CLI-001",
    clientName: "Acme Corp",
    clientEmail: "pagos@acme.com",
    items: [
      {
        id: "ITM-001",
        productId: "PRD-001",
        description: 'MacBook Pro 14"',
        quantity: 2,
        unitPrice: 5299000,
        total: 10598000,
      },
    ],
    subtotal: 10598000,
    tax: 2013620,
    total: 12611620,
    status: "sent",
    issueDate: "2024-12-01",
    dueDate: "2024-12-15",
    salesCommission: 529900,
    salesPersonId: "user-005",
  },
  {
    id: "INV-002",
    tenantId: "tenant-001",
    number: "F-2024-0126",
    clientId: "CLI-002",
    clientName: "Tech Solutions",
    clientEmail: "contabilidad@techsol.co",
    items: [
      {
        id: "ITM-002",
        productId: "PRD-002",
        description: 'Monitor Dell 27"',
        quantity: 5,
        unitPrice: 1299000,
        total: 6495000,
      },
    ],
    subtotal: 6495000,
    tax: 1234050,
    total: 7729050,
    status: "overdue",
    issueDate: "2024-11-20",
    dueDate: "2024-12-05",
    salesCommission: 324750,
    salesPersonId: "user-005",
  },
]

const initialSuppliers: Supplier[] = [
  {
    id: "SUP-001",
    tenantId: "tenant-001",
    name: "Apple Distribution Inc.",
    taxId: "900.222.333-1",
    email: "orders@apple.com",
    category: "technology",
    paymentTerms: "net30",
    rating: 5,
    status: "active",
    contactPerson: "Steve J."
  },
  {
    id: "SUP-002",
    tenantId: "tenant-001",
    name: "Office Depot",
    taxId: "800.111.999-5",
    email: "sales@officedepot.co",
    category: "office_supplies",
    paymentTerms: "immediate",
    rating: 4,
    status: "active"
  }
]

const initialAuditLogs: AuditLog[] = [
  {
    id: "LOG-001",
    tenantId: "tenant-001",
    userId: "user-001",
    userName: "Admin User",
    action: "create",
    module: "Finance",
    entityType: "Invoice",
    entityId: "INV-2024-001",
    entityName: "Factura de Venta #001",
    timestamp: new Date().toISOString(), // Today
    ipAddress: "192.168.1.1",
    userAgent: "Chrome/120"
  },
  {
    id: "LOG-002",
    tenantId: "tenant-001",
    userId: "user-002",
    userName: "Analista Contable",
    action: "update",
    module: "Finance",
    entityType: "Transaction",
    entityId: "TRX-123456",
    entityName: "Pago Proveedores",
    timestamp: new Date().toISOString(), // Today
    ipAddress: "192.168.1.50",
    userAgent: "Firefox/118"
  },
  {
    id: "LOG-003",
    tenantId: "tenant-001",
    userId: "user-001",
    userName: "Admin User",
    action: "login",
    module: "Security",
    entityType: "Session",
    entityId: "sess-009",
    entityName: "Login",
    timestamp: new Date().toISOString(), // Today
    ipAddress: "192.168.1.1",
    userAgent: "Chrome/120"
  }
]

const initialBankAccounts: BankAccount[] = [
  {
    id: "BA-001",
    tenantId: "tenant-001",
    name: "Cuenta Principal",
    type: "bank",
    bankName: "Bancolombia",
    accountNumber: "**** 4567",
    currency: "COP",
    balance: 15400000,
    status: "active",
    color: "#FCD34D" // Yellow-ish
  },
  {
    id: "BA-002",
    tenantId: "tenant-001",
    name: "Caja Menor",
    type: "cash",
    bankName: "Efectivo",
    currency: "COP",
    balance: 850000,
    status: "active",
    color: "#10B981" // Green
  },
  {
    id: "BA-003",
    tenantId: "tenant-001",
    name: "Nequi Corporativo",
    type: "wallet",
    bankName: "Nequi",
    accountNumber: "3001234567",
    currency: "COP",
    balance: 2100000,
    status: "active",
    color: "#EC4899" // Pink
  }
]

export const useNuuxStore = create<NuuxStore>((set, get) => ({
  // Initial State
  products: initialProducts,
  stockMovements: [],
  warehouses: initialWarehouses,
  purchaseOrders: [],
  suppliers: initialSuppliers,
  transactions: [],
  invoices: initialInvoices,
  costCenters: initialCostCenters,
  bankStatements: [],
  bankAccounts: initialBankAccounts,
  auditLogs: initialAuditLogs,
  payrollRecords: [],
  attendanceRecords: [],
  vacationRequests: [],

  // Invoice Template Default
  invoiceTemplate: {
    companyName: "Nuux Enterprise S.A.S",
    companyAddress: "Bogotá D.C, Colombia | NIT: 900.123.456-7",
    primaryColor: "#0f172a", // slate-900
    footerText: "Gracias por su compra. Generado por Nuux Finance.",
    showLogo: true,
  },

  // KARDEX - FIFO Stock Out
  processSaleFIFO: (productId, quantity, reference) => {
    const { products, stockMovements } = get()
    const product = products.find((p) => p.id === productId)

    if (!product || product.quantity < quantity) {
      return { success: false, cost: 0 }
    }

    let remainingQty = quantity
    let totalCost = 0
    const updatedLots = [...product.lots].sort(
      (a, b) => new Date(a.entryDate).getTime() - new Date(b.entryDate).getTime(),
    )

    // FIFO: Take from oldest lots first
    for (const lot of updatedLots) {
      if (remainingQty <= 0) break

      const takeQty = Math.min(lot.quantity, remainingQty)
      totalCost += takeQty * lot.unitCost
      lot.quantity -= takeQty
      remainingQty -= takeQty
    }

    // Filter out empty lots
    const finalLots = updatedLots.filter((lot) => lot.quantity > 0)
    const newQuantity = product.quantity - quantity

    // Create stock movement
    const movement: StockMovement = {
      id: `MOV-${Date.now()}`,
      tenantId: product.tenantId,
      productId,
      type: "salida",
      quantity,
      unitCost: totalCost / quantity,
      totalCost,
      reason: "Venta",
      reference,
      userId: "system",
      date: new Date().toISOString().split("T")[0],
      createdAt: new Date().toISOString(),
    }

    set((state) => ({
      products: state.products.map((p) =>
        p.id === productId
          ? { ...p, quantity: newQuantity, lots: finalLots, status: newQuantity === 0 ? "out_of_stock" : p.status }
          : p,
      ),
      stockMovements: [...state.stockMovements, movement],
    }))

    return { success: true, cost: totalCost }
  },

  addStockMovement: (movement) => {
    const newMovement: StockMovement = {
      ...movement,
      id: `MOV-${Date.now()}`,
      createdAt: new Date().toISOString(),
    }

    set((state) => {
      const product = state.products.find((p) => p.id === movement.productId)
      if (!product) return state

      let newQuantity = product.quantity
      const newLots = [...product.lots]

      if (movement.type === "entrada") {
        newQuantity += movement.quantity
        newLots.push({
          id: `LOT-${Date.now()}`,
          productId: movement.productId,
          lotNumber: movement.lotNumber || `LT${Date.now()}`,
          quantity: movement.quantity,
          unitCost: movement.unitCost,
          entryDate: movement.date,
          expirationDate: movement.expirationDate,
          warehouse: movement.destinationWarehouse || product.warehouseId,
        })
      } else if (movement.type === "salida") {
        newQuantity -= movement.quantity
      }

      return {
        stockMovements: [...state.stockMovements, newMovement],
        products: state.products.map((p) =>
          p.id === movement.productId ? { ...p, quantity: newQuantity, lots: newLots } : p,
        ),
      }
    })
  },

  checkLowStock: () => {
    const { products } = get()
    return products.filter((p) => p.quantity <= p.minStock)
  },

  generatePurchaseOrder: (productId) => {
    const { products } = get()
    const product = products.find((p) => p.id === productId)

    if (!product || product.quantity > product.reorderPoint) return null

    const orderQuantity = product.maxStock - product.quantity
    const po: PurchaseOrder = {
      id: `PO-${Date.now()}`,
      tenantId: product.tenantId,
      number: `PO-${Date.now().toString().slice(-6)}`,
      supplierId: product.supplierId,
      supplierName: "Proveedor Auto",
      type: "inventory",
      status: "draft",
      currency: "COP",
      items: [
        {
          id: `ITEM-${Date.now()}`,
          productId: product.id,
          description: product.name,
          quantity: orderQuantity,
          unitCost: product.cost,
          total: orderQuantity * product.cost,
        },
      ],
      subtotal: orderQuantity * product.cost,
      tax: orderQuantity * product.cost * 0.19,
      total: orderQuantity * product.cost * 1.19,
      createdAt: new Date().toISOString(),
      createdBy: "system",
    }

    set((state) => ({
      purchaseOrders: [...state.purchaseOrders, po],
    }))

    return po
  },

  createPurchaseOrder: (po) => {
    const newPO: PurchaseOrder = {
      ...po,
      id: `PO-${Date.now()}`,
      createdAt: new Date().toISOString(),
    }
    set(state => ({ purchaseOrders: [...state.purchaseOrders, newPO] }))
  },

  updatePurchaseOrder: (id, status) => {
    set(state => ({
      purchaseOrders: state.purchaseOrders.map(po => po.id === id ? { ...po, status } : po)
    }))
  },

  addSupplier: (supplier) => {
    const newSupplier: Supplier = {
      ...supplier,
      id: `SUP-${Date.now()}`,
      status: 'active'
    }
    set(state => ({ suppliers: [...state.suppliers, newSupplier] }))
  },

  updateSupplier: (id, updates) => {
    set(state => ({
      suppliers: state.suppliers.map(s => s.id === id ? { ...s, ...updates } : s)
    }))
  },

  deleteSupplier: (id) => {
    set(state => ({
      suppliers: state.suppliers.filter(s => s.id !== id)
    }))
  },

  transferStock: (productId, quantity, fromWarehouse, toWarehouse) => {
    const { products } = get()
    const product = products.find((p) => p.id === productId)

    if (!product) return false

    const fromLots = product.lots.filter((l) => l.warehouse === fromWarehouse)
    const totalFromWarehouse = fromLots.reduce((sum, l) => sum + l.quantity, 0)

    if (totalFromWarehouse < quantity) return false

    // Create transfer movement
    const movement: StockMovement = {
      id: `MOV-${Date.now()}`,
      tenantId: product.tenantId,
      productId,
      type: "transferencia",
      quantity,
      unitCost: product.cost,
      totalCost: quantity * product.cost,
      reason: `Transferencia de ${fromWarehouse} a ${toWarehouse}`,
      sourceWarehouse: fromWarehouse,
      destinationWarehouse: toWarehouse,
      userId: "system",
      date: new Date().toISOString().split("T")[0],
      createdAt: new Date().toISOString(),
    }

    set((state) => ({
      stockMovements: [...state.stockMovements, movement],
    }))

    return true
  },

  // Finance Actions
  addTransaction: (transaction) => {
    const newTransaction: Transaction = {
      ...transaction,
      id: `TRX-${Date.now()}`,
    }
    set((state) => ({
      transactions: [...state.transactions, newTransaction],
    }))
  },

  addInvoice: (invoice) => {
    const newInvoice: Invoice = {
      ...invoice,
      id: `INV-${Date.now()}`,
      status: 'sent', // Default to sent for now
    }
    set((state) => ({
      invoices: [newInvoice, ...state.invoices],
    }))
  },

  updateInvoice: (id, updates) => {
    set((state) => ({
      invoices: state.invoices.map((inv) =>
        inv.id === id ? { ...inv, ...updates } : inv
      ),
    }))
  },

  updateInvoiceTemplate: (config) => {
    set((state) => ({
      invoiceTemplate: { ...state.invoiceTemplate, ...config }
    }))
  },



  markInvoiceAsPaid: (invoiceId) => {
    set((state) => ({
      invoices: state.invoices.map((inv) =>
        inv.id === invoiceId ? { ...inv, status: "paid", paidDate: new Date().toISOString().split("T")[0] } : inv,
      ),
    }))

    // Trigger inventory update and commission
    get().processSaleWithInventoryUpdate(invoiceId)
  },

  getCashFlowProjection: (days) => {
    const { invoices, transactions } = get()
    const projection: { date: string; balance: number }[] = []
    let balance = transactions
      .filter((t) => t.status === "completed")
      .reduce((sum, t) => sum + (t.type === "income" ? t.amount : -t.amount), 0)

    for (let i = 0; i < days; i++) {
      const date = new Date()
      date.setDate(date.getDate() + i)
      const dateStr = date.toISOString().split("T")[0]

      // Expected income from invoices due
      const dueInvoices = invoices.filter((inv) => inv.dueDate === dateStr && inv.status !== "paid")
      const expectedIncome = dueInvoices.reduce((sum, inv) => sum + inv.total, 0)

      balance += expectedIncome
      projection.push({ date: dateStr, balance })
    }

    return projection
  },

  getExpensesByDepartment: () => {
    const { costCenters } = get()
    return costCenters.map((cc) => ({
      department: cc.department,
      total: cc.spent,
      budget: cc.budget,
    }))
  },

  reconcileBankStatement: (statementId, matchId, type) => {
    set((state) => ({
      bankStatements: state.bankStatements.map((stmt) =>
        stmt.id === statementId
          ? {
            ...stmt,
            reconciled: true,
            ...(type === "invoice" ? { matchedInvoiceId: matchId } : { matchedTransactionId: matchId }),
          }
          : stmt,
      ),
    }))
  },

  connectBankAccount: async (provider, credentials) => {
    // Mock API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Mock success
    return true;
  },

  // RRHH Actions
  checkIn: (userId) => {
    const today = new Date().toISOString().split("T")[0]
    const now = new Date().toTimeString().slice(0, 5)
    const isLate = now > "09:00"

    const record: AttendanceRecord = {
      id: `ATT-${Date.now()}`,
      tenantId: "tenant-001",
      userId,
      date: today,
      checkIn: now,
      status: isLate ? "late" : "present",
      hoursWorked: 0,
      overtimeHours: 0,
    }

    set((state) => ({
      attendanceRecords: [...state.attendanceRecords, record],
    }))
  },

  checkOut: (userId) => {
    const today = new Date().toISOString().split("T")[0]
    const now = new Date().toTimeString().slice(0, 5)

    set((state) => ({
      attendanceRecords: state.attendanceRecords.map((rec) => {
        if (rec.userId === userId && rec.date === today && !rec.checkOut) {
          const checkInTime = rec.checkIn
            ? Number.parseInt(rec.checkIn.split(":")[0]) * 60 + Number.parseInt(rec.checkIn.split(":")[1])
            : 0
          const checkOutTime = Number.parseInt(now.split(":")[0]) * 60 + Number.parseInt(now.split(":")[1])
          const hoursWorked = (checkOutTime - checkInTime) / 60
          const overtimeHours = Math.max(0, hoursWorked - 8)

          return {
            ...rec,
            checkOut: now,
            hoursWorked: Math.round(hoursWorked * 100) / 100,
            overtimeHours: Math.round(overtimeHours * 100) / 100,
          }
        }
        return rec
      }),
    }))
  },

  calculatePayroll: (userId, period, overrides) => {
    const { attendanceRecords } = get()

    // Get attendance for the period
    const periodRecords = attendanceRecords.filter((rec) => rec.userId === userId && rec.date.startsWith(period))

    const totalHours = periodRecords.reduce((sum, rec) => sum + rec.hoursWorked, 0)
    const totalOvertime = periodRecords.reduce((sum, rec) => sum + rec.overtimeHours, 0)

    // Base calculations (allow overrides)
    const baseSalary = overrides?.baseSalary || 4500000
    const hourlyRate = baseSalary / 192 // 192 hours/month
    const overtimeRate = hourlyRate * 1.5
    const overtimePay = totalOvertime * overtimeRate

    // Deductions
    const healthDeduction = baseSalary * 0.04
    const pensionDeduction = baseSalary * 0.04

    // Taxes (simplified ISR calculation)
    const taxableIncome = baseSalary + overtimePay
    const isr = taxableIncome * 0.25

    const extraBonuses = overrides?.bonuses || []

    const payroll: PayrollRecord = {
      id: `PAY-${Date.now()}`,
      tenantId: "tenant-001",
      userId,
      period,
      baseSalary,
      overtimeHours: totalOvertime,
      overtimeRate,
      overtimePay,
      bonuses: [...extraBonuses],
      totalEarnings: baseSalary + overtimePay + extraBonuses.reduce((acc, b) => acc + b.amount, 0),
      deductions: [
        { concept: "Salud", amount: healthDeduction, type: "percentage" },
        { concept: "Pension", amount: pensionDeduction, type: "percentage" },
      ],
      totalDeductions: healthDeduction + pensionDeduction,
      taxes: [{ concept: "ISR", rate: 0.25, amount: isr }],
      totalTaxes: isr,
      netPay: baseSalary + overtimePay + extraBonuses.reduce((acc, b) => acc + b.amount, 0) - healthDeduction - pensionDeduction - isr,
      status: "calculated",
      createdAt: new Date().toISOString(),
    }

    set((state) => ({
      payrollRecords: [...state.payrollRecords, payroll],
    }))

    return payroll
  },

  requestVacation: (request) => {
    const startDate = new Date(request.startDate)
    const endDate = new Date(request.endDate)
    const totalDays = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)) + 1

    const vacationRequest: VacationRequest = {
      ...request,
      id: `VAC-${Date.now()}`,
      totalDays,
      status: "pending",
      createdAt: new Date().toISOString(),
    }

    set((state) => ({
      vacationRequests: [...state.vacationRequests, vacationRequest],
    }))
  },

  approveVacation: (requestId, approverId) => {
    set((state) => ({
      vacationRequests: state.vacationRequests.map((req) =>
        req.id === requestId
          ? { ...req, status: "approved", approvedBy: approverId, approvedAt: new Date().toISOString() }
          : req,
      ),
    }))
  },

  rejectVacation: (requestId, approverId, reason) => {
    set((state) => ({
      vacationRequests: state.vacationRequests.map((req) =>
        req.id === requestId ? { ...req, status: "rejected", approvedBy: approverId, rejectionReason: reason } : req,
      ),
    }))
  },

  // Cross-Module Actions
  processSaleWithInventoryUpdate: (invoiceId) => {
    const { invoices, processSaleFIFO, addSalesCommissionToPayroll } = get()
    const invoice = invoices.find((inv) => inv.id === invoiceId)

    if (!invoice) return

    // Update inventory for each item (FIFO)
    invoice.items.forEach((item) => {
      if (item.productId) {
        processSaleFIFO(item.productId, item.quantity, invoice.number)
      }
    })

    // Add commission to salesperson payroll
    if (invoice.salesCommission && invoice.salesPersonId) {
      const period = new Date().toISOString().slice(0, 7) // YYYY-MM
      addSalesCommissionToPayroll(invoice.salesPersonId, invoice.salesCommission, period)
    }
  },

  addSalesCommissionToPayroll: (salesPersonId, commission, period) => {
    set((state) => {
      const existingPayroll = state.payrollRecords.find((p) => p.userId === salesPersonId && p.period === period)

      if (existingPayroll) {
        return {
          payrollRecords: state.payrollRecords.map((p) =>
            p.id === existingPayroll.id
              ? {
                ...p,
                bonuses: [...p.bonuses, { concept: "Comision de Venta", amount: commission, type: "fixed" as const }],
                totalEarnings: p.totalEarnings + commission,
                netPay: p.netPay + commission,
              }
              : p,
          ),
        }
      }

      return state
    })
  },

  // Setters
  setProducts: (products) => set({ products }),
  setTransactions: (transactions) => set({ transactions }),
  setInvoices: (invoices) => set({ invoices }),
}))
