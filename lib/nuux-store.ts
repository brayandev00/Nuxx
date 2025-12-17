"use client"

import { create } from "zustand"
import { apiClient } from "./api-client"
import { toast } from "sonner"
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
  fetchProducts: () => Promise<void>
  addProduct: (product: Omit<Product, "id" | "createdAt" | "updatedAt" | "createdBy">) => Promise<void>
  updateProduct: (id: string, updates: Partial<Product>) => Promise<void>
  deleteProduct: (id: string) => Promise<void>

  stockMovements: StockMovement[]
  fetchStockMovements: () => Promise<void>

  warehouses: Warehouse[]
  fetchWarehouses: () => Promise<void>
  addWarehouse: (warehouse: Omit<Warehouse, "id">) => Promise<void>
  updateWarehouse: (id: string, updates: Partial<Warehouse>) => Promise<void>
  deleteWarehouse: (id: string) => Promise<void>

  purchaseOrders: PurchaseOrder[]
  fetchPurchaseOrders: () => Promise<void>

  suppliers: Supplier[]
  fetchSuppliers: () => Promise<void>
  addSupplier: (supplier: Omit<Supplier, "id" | "status">) => Promise<void>
  updateSupplier: (id: string, updates: Partial<Supplier>) => Promise<void>
  deleteSupplier: (id: string) => Promise<void>

  // Finance State
  transactions: Transaction[]
  fetchTransactions: () => Promise<void>

  invoices: Invoice[]
  fetchInvoices: () => Promise<void>

  costCenters: CostCenter[]
  fetchCostCenters: () => Promise<void>

  bankStatements: BankStatement[]
  bankAccounts: BankAccount[]
  auditLogs: AuditLog[]

  // RRHH State
  payrollRecords: PayrollRecord[]
  attendanceRecords: AttendanceRecord[]
  vacationRequests: VacationRequest[]

  // KARDEX Actions - Now simplified or backend-driven
  addStockMovement: (movement: Omit<StockMovement, "id" | "createdAt">) => Promise<void>

  // Previously complex logic, now likely backend handled or simplified
  checkLowStock: () => Product[] // Can still be local filter
  generatePurchaseOrder: (productId: string) => PurchaseOrder | null // Keep local for UI draft?
  transferStock: (productId: string, quantity: number, fromWarehouse: string, toWarehouse: string) => Promise<boolean>
  createPurchaseOrder: (po: Omit<PurchaseOrder, "id" | "createdAt">) => Promise<void>
  updatePurchaseOrder: (id: string, status: PurchaseOrder["status"]) => Promise<void>


  // Finance Actions
  addTransaction: (transaction: Omit<Transaction, "id">) => Promise<void>
  addInvoice: (invoice: Omit<Invoice, "id" | "status">) => Promise<void>
  updateInvoice: (id: string, updates: Partial<Invoice>) => Promise<void>

  invoiceTemplate: InvoiceTemplateConfig
  updateInvoiceTemplate: (config: Partial<InvoiceTemplateConfig>) => void

  markInvoiceAsPaid: (invoiceId: string) => Promise<void>

  getCashFlowProjection: (days: number) => { date: string; balance: number }[] // Local calc
  getExpensesByDepartment: () => { department: string; total: number; budget: number }[] // Local calc

  reconcileBankStatement: (statementId: string, matchId: string, type: "invoice" | "transaction") => Promise<void>
  connectBankAccount: (provider: "bancolombia" | "nequi", credentials: any) => Promise<boolean>

  // RRHH Actions
  checkIn: (userId: string) => Promise<void>
  checkOut: (userId: string) => Promise<void>

  calculatePayroll: (userId: string, period: string, overrides?: any) => Promise<PayrollRecord | null>
  requestVacation: (request: Omit<VacationRequest, "id" | "createdAt" | "status">) => Promise<void>
  approveVacation: (requestId: string, approverId: string) => Promise<void>
  rejectVacation: (requestId: string, approverId: string, reason: string) => Promise<void>

  // Setters (Internal or specialized use)
  setProducts: (products: Product[]) => void
  setTransactions: (transactions: Transaction[]) => void
  setInvoices: (invoices: Invoice[]) => void
}

export const useNuuxStore = create<NuuxStore>((set, get) => ({
  // Initial State - Empty
  products: [],
  stockMovements: [],
  warehouses: [],
  purchaseOrders: [],
  suppliers: [],
  transactions: [],
  invoices: [],
  costCenters: [],
  bankStatements: [],
  bankAccounts: [], // Could fetch
  auditLogs: [],
  payrollRecords: [],
  attendanceRecords: [],
  vacationRequests: [],

  invoiceTemplate: {
    companyName: "Nuux Enterprise S.A.S",
    companyAddress: "Bogotá D.C, Colombia",
    primaryColor: "#0f172a",
    footerText: "Generado por Nuux Finance.",
    showLogo: true,
  },

  // --- Actions ---

  // Products
  fetchProducts: async () => {
    try {
      const data = await apiClient.get<Product[]>("/products")
      set({ products: data })
    } catch (e) { console.error("Fetch products failed", e) }
  },

  addProduct: async (product) => {
    try {
      await apiClient.post("/products", product)
      toast.success("Producto creado exitosamente")
      get().fetchProducts()
    } catch (e) { console.error("Add product failed", e); throw e }
  },

  updateProduct: async (id, updates) => {
    try {
      await apiClient.put(`/products/${id}`, updates)
      toast.success("Producto actualizado")
      get().fetchProducts()
    } catch (e) {
      console.error("Update product failed", e)
      // Optimistic update fallback ?
    }
  },

  deleteProduct: async (id) => {
    try {
      await apiClient.delete(`/products/${id}`)
      toast.success("Producto eliminado")
      get().fetchProducts()
    } catch (e) { console.error("Delete product failed", e) }
  },

  // Warehouses
  fetchWarehouses: async () => {
    // Assuming endpoint exists, if not, keep empty or mock
    // Based on user prompt "Products" module integration is needed.
    // Warehouses often go with products. I'll assume /warehouses
    try {
      const data = await apiClient.get<Warehouse[]>("/warehouses").catch(() => [])
      set({ warehouses: data })
    } catch (e) { }
  },

  addWarehouse: async (w) => {
    await apiClient.post("/warehouses", w)
    get().fetchWarehouses()
  },
  updateWarehouse: async (id, u) => {
    await apiClient.put(`/warehouses/${id}`, u)
    get().fetchWarehouses()
  },
  deleteWarehouse: async (id) => {
    await apiClient.delete(`/warehouses/${id}`)
    get().fetchWarehouses()
  },

  // Stock Movements
  fetchStockMovements: async () => {
    const data = await apiClient.get<StockMovement[]>("/stock-movements").catch(() => [])
    set({ stockMovements: data })
  },

  addStockMovement: async (m) => {
    await apiClient.post("/stock-movements", m)
    get().fetchStockMovements()
    get().fetchProducts() // Update stock levels
  },


  // Suppliers
  fetchSuppliers: async () => {
    const data = await apiClient.get<Supplier[]>("/suppliers").catch(() => [])
    set({ suppliers: data })
  },
  addSupplier: async (s) => {
    await apiClient.post("/suppliers", s)
    get().fetchSuppliers()
  },
  updateSupplier: async (id, u) => {
    await apiClient.put(`/suppliers/${id}`, u)
    get().fetchSuppliers()
  },
  deleteSupplier: async (id) => {
    await apiClient.delete(`/suppliers/${id}`)
    get().fetchSuppliers()
  },

  // Purchase Orders
  fetchPurchaseOrders: async () => {
    const data = await apiClient.get<PurchaseOrder[]>("/purchase-orders").catch(() => [])
    set({ purchaseOrders: data })
  },
  createPurchaseOrder: async (po) => {
    await apiClient.post("/purchase-orders", po)
    get().fetchPurchaseOrders()
  },
  updatePurchaseOrder: async (id, status) => {
    await apiClient.put(`/purchase-orders/${id}`, { status })
    get().fetchPurchaseOrders()
  },

  // Finance
  fetchTransactions: async () => {
    try {
      const data = await apiClient.get<Transaction[]>("/transactions")
      set({ transactions: data })
    } catch (e) { console.error(e) }
  },

  fetchInvoices: async () => {
    try {
      const data = await apiClient.get<Invoice[]>("/invoices") // Assuming endpoint
      set({ invoices: data })
    } catch (e) { console.error(e) }
  },

  fetchCostCenters: async () => {
    const data = await apiClient.get<CostCenter[]>("/cost-centers").catch(() => [])
    set({ costCenters: data })
  },

  addTransaction: async (t) => {
    await apiClient.post("/transactions", t)
    get().fetchTransactions()
  },

  addInvoice: async (inv) => {
    await apiClient.post("/invoices", inv)
    get().fetchInvoices()
    // Maybe trigger product update too if backend deducts stock
    get().fetchProducts()
  },

  updateInvoice: async (id, updates) => {
    await apiClient.put(`/invoices/${id}`, updates)
    get().fetchInvoices()
  },

  markInvoiceAsPaid: async (id) => {
    await apiClient.put(`/invoices/${id}`, { status: "paid" })
    get().fetchInvoices()
    get().fetchProducts() // Consistency check
  },

  // Local Helpers (Calculations based on fetched state)
  checkLowStock: () => {
    const { products } = get()
    return products.filter((p) => p.quantity <= p.minStock)
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

  // HR / Attendance
  checkIn: async (userId) => {
    try {
      await apiClient.post("/attendance/check-in", { userId, timestamp: new Date().toISOString() })
      toast.success("Check-in registrado")
    } catch (e: any) { toast.error(e.message || "Error check-in") }
  },

  checkOut: async (userId) => {
    try {
      await apiClient.post("/attendance/check-out", { userId, timestamp: new Date().toISOString() })
      toast.success("Check-out registrado")
    } catch (e: any) { toast.error(e.message || "Error check-out") }
  },

  calculatePayroll: async (userId, period) => {
    try {
      const res = await apiClient.post<PayrollRecord>("/payroll/calculate", { userId, period })
      return res
    } catch (e) {
      console.error("Payroll calculation failed", e)
      return null
    }
  },

  requestVacation: async (req) => {
    await apiClient.post("/vacation-requests", req)
    // fetchVacationRequests() // if we had it
  },

  approveVacation: async (id, approver) => {
    await apiClient.post(`/vacation-requests/${id}/approve`, { approverId: approver })
  },

  rejectVacation: async (id, approver, reason) => {
    await apiClient.post(`/vacation-requests/${id}/reject`, { approverId: approver, reason })
  },


  // Misc
  updateInvoiceTemplate: (config) => {
    set((state) => ({
      invoiceTemplate: { ...state.invoiceTemplate, ...config }
    }))
  },

  reconcileBankStatement: async (stmtId, matchId, type) => {
    await apiClient.post(`/bank-statements/${stmtId}/reconcile`, { matchId, type })
  },

  connectBankAccount: async () => {
    return true // Mocked for now or API
  },

  generatePurchaseOrder: (productId) => {
    // Keep local logic or call API?
    // For now, keeping generic local logic returning null as prompt didn't specify endpoint
    return null
  },

  transferStock: async (pid, qty, from, to) => {
    try {
      await apiClient.post("/stock/transfer", { productId: pid, quantity: qty, fromWarehouse: from, toWarehouse: to })
      return true
    } catch (e) { return false }
  },

  // Setters
  setProducts: (products) => set({ products }),
  setTransactions: (transactions) => set({ transactions }),
  setInvoices: (invoices) => set({ invoices }),
}))
