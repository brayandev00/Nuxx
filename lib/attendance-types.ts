export interface AttendanceRecord {
    id: string
    userId: string
    userName: string
    userAvatar?: string
    clockIn: Date
    clockOut?: Date
    date: string // YYYY-MM-DD format
    status: 'on-time' | 'late' | 'absent' | 'in-progress'
    hoursWorked?: number
    minutesLate?: number
    notes?: string
    createdAt: Date
    updatedAt: Date
}

export interface WorkSettings {
    id: string
    tenantId: string
    normalHours: number // e.g., 8
    startTime: string // e.g., "09:00"
    endTime: string // e.g., "17:00"
    gracePeriodMinutes: number // e.g., 15
    salaryFrequency: 'monthly' | 'biweekly' | 'weekly'
    paymentDay: number // e.g., 15 or 30
    roleSchedules: Record<string, { startTime: string; endTime: string }>
    weekendDays: number[] // 0 = Sunday, 6 = Saturday
    updatedAt: Date
    updatedBy: string
}

export interface AttendanceStats {
    totalDays: number
    presentDays: number
    lateDays: number
    absentDays: number
    totalHours: number
    averageHours: number
    onTimePercentage: number
}

export interface AttendanceFilters {
    startDate?: string
    endDate?: string
    userId?: string
    status?: AttendanceRecord['status'] | 'all'
}
