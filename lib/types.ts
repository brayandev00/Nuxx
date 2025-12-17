// Types for the entire Nuux system

// User & RBAC Types
export type UserRole = "admin" | "manager" | "employee" | "accountant" | "designer" | "developer"

export type Permission =
  | "view_dashboard"
  | "manage_projects"
  | "view_analytics"
  | "manage_team"
  | "manage_inventory"
  | "manage_finance"
  | "manage_payroll"
  | "view_reports"
  | "god_mode"

export interface Tenant {
  id: string
  name: string
  slug: string
  logo?: string
  plan: "starter" | "professional" | "enterprise"
  status: "active" | "suspended" | "trial"
  createdAt: string
  maxUsers: number
  features: string[]
  settings: TenantSettings
  branding?: TenantBranding
  googleDriveConnected?: boolean
}

export interface TenantBranding {
  primaryColor: string
  logoUrl?: string
  faviconUrl?: string
  companySlogan?: string
  welcomeMessage?: string
  website?: string
  email?: string
  phone?: string
  address?: string
}

export interface TenantSettings {
  currency: string
  timezone: string
  language: string
  fiscalYearStart: string
  allowCustomRoles: boolean
  modules: string[]
}

export interface CustomRole {
  id: string
  tenantId: string
  name: string
  description: string
  color: string
  icon: string
  isSystem: boolean
  isDefault: boolean
  permissions: RolePermissions
  createdAt: string
  createdBy: string
  updatedAt: string
}

export interface RolePermissions {
  dashboard: ModulePermissions
  projects: ModulePermissions
  analytics: ModulePermissions
  team: ModulePermissions
  inventory: ModulePermissions
  finance: ModulePermissions
  payroll: ModulePermissions
  settings: ModulePermissions
  roles: ModulePermissions
  crm: ModulePermissions
  procurement: ModulePermissions
  documents: ModulePermissions
  security: ModulePermissions
  attendance: ModulePermissions
}

export interface ModulePermissions {
  view: boolean
  create: boolean
  edit: boolean
  delete: boolean
  export: boolean
}

export interface User {
  id: string
  tenantId: string
  name: string
  email: string
  avatar?: string
  role: string
  roleId: string
  department: string
  position: string
  salary: number
  hireDate: string
  status: "active" | "inactive" | "vacation"
  phone?: string

  // Rich Profile Fields
  skills?: string[]
  bio?: string
  socialLinks?: {
    linkedin?: string
    twitter?: string
    github?: string
    portfolio?: string
  }
  managerId?: string
  location?: string
  achievements?: string[]
  address?: string
  lastLogin?: string
  twoFactorEnabled: boolean
  vacationDays: number
  usedVacationDays: number
}

// KARDEX Stock Movement Types
export interface StockMovement {
  id: string
  tenantId: string
  productId: string
  type: "entrada" | "salida" | "ajuste" | "transferencia"
  quantity: number
  unitCost: number
  totalCost: number
  reason: string
  reference?: string
  sourceWarehouse?: string
  destinationWarehouse?: string
  lotNumber?: string
  expirationDate?: string
  userId: string
  date: string
  createdAt: string
}

export interface ProductLot {
  id: string
  productId: string
  lotNumber: string
  quantity: number
  unitCost: number
  entryDate: string
  expirationDate?: string
  warehouse: string
}

export interface Warehouse {
  id: string
  tenantId: string
  name: string
  code: string
  address: string
  type: "principal" | "sucursal" | "temporal"
  status: "active" | "inactive"
  manager?: string
}

export interface PurchaseOrder {
  id: string
  tenantId: string
  number: string // PO-2024-001
  supplierId: string
  supplierName?: string // Cache for display
  type: "inventory" | "service" | "asset"
  status: "draft" | "pending_approval" | "approved" | "ordered" | "partial_received" | "received" | "cancelled"

  // Items
  items: PurchaseOrderItem[]

  // Financials
  currency: string
  subtotal: number
  tax: number
  total: number

  // Dates
  createdAt: string
  expectedDate?: string
  receivedDate?: string

  // Meta
  createdBy: string
  approvedBy?: string
  notes?: string
}

export interface PurchaseOrderItem {
  id: string
  productId?: string // Optional, for inventory items
  description: string // Required, free text for services
  quantity: number
  unitCost: number
  total: number
  receivedQuantity?: number // For partial reception
}

// PROCUREMENT / PURCHASES
export interface Supplier {
  id: string
  tenantId: string
  name: string
  taxId: string // NIT/RUT
  email: string
  phone?: string
  address?: string
  category: "technology" | "services" | "raw_materials" | "office_supplies" | "consulting" | "other"
  paymentTerms: "immediate" | "net30" | "net60"
  rating?: number // 1-5 stars
  contactPerson?: string
  status: "active" | "inactive" | "blacklisted"
}

// Attendance with Check-in/Check-out
export interface AttendanceRecord {
  id: string
  tenantId: string
  userId: string
  date: string
  checkIn?: string
  checkOut?: string
  status: "present" | "absent" | "late" | "vacation" | "sick" | "remote"
  hoursWorked: number
  overtimeHours: number
  notes?: string
  location?: { lat: number; lng: number }
}

// Vacation Request Flow
export interface VacationRequest {
  id: string
  tenantId: string
  userId: string
  type: "vacation" | "sick" | "personal" | "maternity" | "paternity" | "bereavement"
  startDate: string
  endDate: string
  totalDays: number
  status: "pending" | "approved" | "rejected" | "cancelled"
  reason?: string
  approvedBy?: string
  approvedAt?: string
  rejectionReason?: string
  createdAt: string
}

// Payroll with detailed calculations
export interface PayrollRecord {
  id: string
  tenantId: string
  userId: string
  period: string
  baseSalary: number
  overtimeHours: number
  overtimeRate: number
  overtimePay: number
  bonuses: BonusItem[]
  totalEarnings: number
  deductions: DeductionItem[]
  totalDeductions: number
  taxes: TaxItem[]
  totalTaxes: number
  netPay: number
  status: "draft" | "calculated" | "approved" | "paid"
  payDate?: string
  paidBy?: string
  createdAt: string
}

export interface BonusItem {
  concept: string
  amount: number
  type: "fixed" | "percentage"
}

export interface DeductionItem {
  concept: string
  amount: number
  type: "fixed" | "percentage"
}

export interface TaxItem {
  concept: string
  rate: number
  amount: number
}

// Cash Flow Projection
export interface CashFlowProjection {
  date: string
  openingBalance: number
  expectedIncome: number
  expectedExpenses: number
  closingBalance: number
  invoicesDue: Invoice[]
  billsDue: Bill[]
}

export interface Bill {
  id: string
  tenantId: string
  supplierId: string
  supplierName: string
  amount: number
  dueDate: string
  status: "pending" | "paid" | "overdue"
  category: string
}

// Cost Centers
export interface CostCenter {
  id: string
  tenantId: string
  name: string
  code: string
  department: string
  budget: number
  spent: number
  status: "active" | "inactive"
}

export interface ExpenseByDepartment {
  department: string
  costCenterId: string
  totalExpenses: number
  budget: number
  percentage: number
}

// Bank Reconciliation
export interface BankStatement {
  id: string
  tenantId: string
  bankAccount: string
  transactionDate: string
  description: string
  amount: number
  type: "credit" | "debit"
  reference: string
  reconciled: boolean
  matchedInvoiceId?: string
  matchedTransactionId?: string
}

export interface BankAccount {
  id: string
  tenantId: string
  name: string
  type: "bank" | "cash" | "wallet" | "credit_card"
  accountNumber?: string
  bankName: string // e.g. "Bancolombia", "Davivienda"
  currency: string
  balance: number
  status: "active" | "inactive"
  lastReconciled?: string
  color?: string // For UI visualization
  provider?: "bancolombia" | "nequi" | "davivienda" | "other"
  integrationStatus?: "connected" | "disconnected" | "syncing"
}

// Invoice
export interface Invoice {
  id: string
  tenantId: string
  number: string
  clientId: string
  clientName: string
  clientEmail: string
  items: InvoiceItem[]
  subtotal: number
  tax: number
  total: number
  status: "draft" | "sent" | "paid" | "overdue" | "cancelled"
  issueDate: string
  dueDate: string
  paidDate?: string
  notes?: string
  salesCommission?: number
  salesPersonId?: string
}

export interface InvoiceTemplateConfig {
  companyName: string
  companyAddress: string
  companyLogo?: string // URL
  primaryColor: string // Hex code e.g. #000000
  footerText: string
  showLogo: boolean
}

export interface InvoiceItem {
  id: string
  productId?: string
  description: string
  quantity: number
  unitPrice: number
  total: number
}

// Transaction
export interface Transaction {
  id: string
  tenantId: string
  type: "income" | "expense"
  category: string
  costCenterId?: string
  amount: number
  description: string
  date: string
  reference?: string
  status: "pending" | "completed" | "cancelled"
  paymentMethod: "cash" | "transfer" | "card" | "check"
  userId: string
  relatedInvoiceId?: string
  attachments?: string[]
}

// Product
export interface Product {
  id: string
  tenantId: string
  sku: string
  name: string
  description: string
  category: string
  price: number
  cost: number
  quantity: number
  minStock: number
  maxStock: number
  reorderPoint: number
  location: string
  warehouseId: string
  supplierId: string
  barcode?: string
  qrCode?: string
  createdAt: string
  updatedAt: string
  createdBy: string
  status: "active" | "discontinued" | "out_of_stock"
  lots: ProductLot[]
}

// Supplier
// Supplier (moved up)

export interface PriceHistoryEntry {
  productId: string
  price: number
  date: string
}

// Task
export interface Task {
  id: string
  tenantId: string
  title: string
  description: string
  assignedTo: string
  assignedBy: string
  projectId?: string
  priority: "low" | "medium" | "high" | "urgent"
  status: "pending" | "in_progress" | "review" | "completed" | "cancelled"
  dueDate: string
  createdAt: string
  updatedAt: string
  comments: TaskComment[]
  attachments?: string[]
  tags: string[]
}

export interface TaskComment {
  id: string
  userId: string
  content: string
  createdAt: string
}

// CRM Types
export interface Lead {
  id: string
  tenantId: string
  name: string
  company: string
  email: string
  phone: string
  stage: "prospecto" | "contactado" | "propuesta" | "negociacion" | "ganado" | "perdido"
  value: number
  probability: number
  assignedTo: string
  source: "web" | "referido" | "cold_call" | "evento" | "publicidad"
  notes: Note[]
  activities: Activity[]
  relatedInvoices: string[]
  relatedProjects: string[]
  createdAt: string
  updatedAt: string
  expectedCloseDate: string
  tags: string[]
}

export interface Note {
  id: string
  content: string
  createdBy: string
  createdAt: string
  type: "nota" | "llamada" | "email" | "reunion"
}

export interface Activity {
  id: string
  type: "llamada" | "email" | "reunion" | "tarea" | "nota"
  title: string
  description: string
  date: string
  completed: boolean
  createdBy: string
}

// Procurement Types
export interface SupplierQuote {
  id: string
  tenantId: string
  supplierId: string
  supplierName: string
  productId: string
  productName: string
  quantity: number
  unitPrice: number
  total: number
  deliveryDays: number
  validUntil: string
  notes?: string
  createdAt: string
}

export interface SupplierEvaluation {
  id: string
  supplierId: string
  category: "quality" | "delivery" | "price" | "service"
  score: number
  comment?: string
  evaluatedBy: string
  evaluatedAt: string
}

// Document Management Types
export interface Document {
  id: string
  tenantId: string
  name: string
  type: "contrato" | "factura" | "certificado" | "brief" | "entregable" | "otro"
  category: "empleado" | "proyecto" | "cliente" | "proveedor" | "legal"
  fileUrl: string
  description?: string
  fileSize: number
  mimeType: string
  folderId: string
  relatedEntityId?: string
  relatedEntityType?: "user" | "project" | "client" | "supplier"
  version: number
  versions: DocumentVersion[]
  signatures: DigitalSignature[]
  createdBy: string
  createdAt: string
  updatedAt: string
  tags: string[]
  deletedAt?: string | null
  signedAt?: string
  signedBy?: string
}

export interface DocumentVersion {
  id: string
  version: number
  fileUrl: string
  changes: string
  createdBy: string
  createdAt: string
}

export interface DigitalSignature {
  id: string
  signerId: string
  signerName: string
  signerEmail: string
  status: "pending" | "signed" | "rejected"
  signedAt?: string
  ipAddress?: string
}

export interface Folder {
  id: string
  tenantId: string
  name: string
  parentId: string | null
  type: "system" | "custom"
  entityType?: "user" | "project" | "client"
  entityId?: string
  createdAt: string
}

// Audit & Security Types
export interface AuditLog {
  id: string
  tenantId: string
  userId: string
  userName: string
  action: "create" | "read" | "update" | "delete" | "login" | "logout" | "export" | "import"
  module: string
  entityType: string
  entityId: string
  entityName: string
  previousValue?: string
  newValue?: string
  ipAddress: string
  userAgent: string
  timestamp: string
  metadata?: Record<string, unknown>
}

export interface ApiKey {
  id: string
  tenantId: string
  name: string
  key: string
  permissions: string[]
  expiresAt?: string
  lastUsedAt?: string
  createdBy: string
  createdAt: string
  status: "active" | "revoked"
}

export interface WhiteLabelConfig {
  id: string
  tenantId: string
  primaryColor: string
  secondaryColor: string
  accentColor: string
  logoUrl?: string
  faviconUrl?: string
  companyName: string
  supportEmail?: string
  customDomain?: string
  hideNuuxBranding: boolean
  customCss?: string
}

// Updated SYSTEM_MODULES with CRM and Procurement modules
export const SYSTEM_MODULES = [
  { id: "dashboard", name: "Dashboard", icon: "LayoutDashboard", description: "Panel principal y resumen" },
  { id: "crm", name: "CRM", icon: "Users", description: "Gestion de clientes y ventas" },
  { id: "projects", name: "Proyectos", icon: "FolderKanban", description: "Gestion de proyectos y tareas" },
  { id: "analytics", name: "Analitica", icon: "BarChart3", description: "Reportes y estadisticas" },
  { id: "team", name: "Equipo", icon: "Users", description: "Gestion de empleados" },
  { id: "inventory", name: "Inventario", icon: "Package", description: "Control de stock y productos" },
  { id: "procurement", name: "Compras", icon: "ShoppingCart", description: "Proveedores y ordenes de compra" },
  { id: "finance", name: "Finanzas", icon: "DollarSign", description: "Contabilidad y transacciones" },
  { id: "payroll", name: "Nominas", icon: "Receipt", description: "Pagos y compensaciones" },
  { id: "documents", name: "Documentos", icon: "FileText", description: "Gestion documental" },
  { id: "settings", name: "Configuracion", icon: "Settings", description: "Ajustes del sistema" },
  { id: "roles", name: "Roles", icon: "Shield", description: "Permisos y accesos" },
  { id: "security", name: "Seguridad", icon: "Lock", description: "Auditoria y API Keys" },
] as const

export const PERMISSION_ACTIONS = [
  { id: "view", name: "Ver", description: "Visualizar informacion" },
  { id: "create", name: "Crear", description: "Agregar nuevos registros" },
  { id: "edit", name: "Editar", description: "Modificar registros existentes" },
  { id: "delete", name: "Eliminar", description: "Borrar registros" },
  { id: "export", name: "Exportar", description: "Descargar datos" },
] as const
