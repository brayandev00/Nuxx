import type { AttendanceRecord, WorkSettings, AttendanceStats, AttendanceFilters } from './attendance-types'

// Mock data for development
const mockWorkSettings: WorkSettings = {
    id: '1',
    tenantId: 'tenant-1',
    normalHours: 8,
    startTime: '09:00',
    endTime: '17:00',
    gracePeriodMinutes: 15,
    salaryFrequency: 'monthly',
    paymentDay: 30,
    roleSchedules: {},
    weekendDays: [0, 6], // Sunday and Saturday
    updatedAt: new Date(),
    updatedBy: 'admin',
}

const mockAttendanceRecords: AttendanceRecord[] = [
    {
        id: '1',
        userId: 'user-1',
        userName: 'Pedro Martínez',
        userAvatar: '/avatars/pedro.jpg',
        clockIn: new Date('2025-12-11T08:55:00'),
        clockOut: new Date('2025-12-11T17:10:00'),
        date: '2025-12-11',
        status: 'on-time',
        hoursWorked: 8.25,
        minutesLate: 0,
        createdAt: new Date('2025-12-11T08:55:00'),
        updatedAt: new Date('2025-12-11T17:10:00'),
    },
    {
        id: '2',
        userId: 'user-2',
        userName: 'Ana García',
        clockIn: new Date('2025-12-11T09:20:00'),
        clockOut: new Date('2025-12-11T17:05:00'),
        date: '2025-12-11',
        status: 'late',
        hoursWorked: 7.75,
        minutesLate: 20,
        createdAt: new Date('2025-12-11T09:20:00'),
        updatedAt: new Date('2025-12-11T17:05:00'),
    },
]

export class AttendanceService {
    private static attendanceRecords: AttendanceRecord[] = [...mockAttendanceRecords]
    private static workSettings: WorkSettings = { ...mockWorkSettings }

    // Clock In
    static clockIn(userId: string, userName: string, userAvatar?: string): AttendanceRecord {
        const now = new Date()
        const today = now.toISOString().split('T')[0]

        // Check if already clocked in today
        const existing = this.attendanceRecords.find(
            (r) => r.userId === userId && r.date === today && !r.clockOut
        )
        if (existing) {
            throw new Error('Ya has registrado entrada hoy')
        }

        const status = this.calculateStatus(now, this.workSettings, userId)
        const minutesLate = this.calculateMinutesLate(now, this.workSettings, userId)

        const record: AttendanceRecord = {
            id: `att-${Date.now()}`,
            userId,
            userName,
            userAvatar,
            clockIn: now,
            date: today,
            status,
            minutesLate: minutesLate > 0 ? minutesLate : 0,
            createdAt: now,
            updatedAt: now,
        }

        this.attendanceRecords.unshift(record)
        return record
    }

    // Clock Out
    static clockOut(userId: string): AttendanceRecord {
        const now = new Date()
        const today = now.toISOString().split('T')[0]

        const record = this.attendanceRecords.find(
            (r) => r.userId === userId && r.date === today && !r.clockOut
        )

        if (!record) {
            throw new Error('No has registrado entrada hoy')
        }

        record.clockOut = now
        record.hoursWorked = this.calculateHours(record.clockIn, now)
        record.updatedAt = now

        return record
    }

    // Calculate hours worked
    private static calculateHours(clockIn: Date, clockOut: Date): number {
        const diff = clockOut.getTime() - clockIn.getTime()
        return Math.round((diff / (1000 * 60 * 60)) * 100) / 100
    }

    // Calculate status based on clock in time
    private static calculateStatus(
        clockIn: Date,
        settings: WorkSettings,
        userId?: string
    ): AttendanceRecord['status'] {
        const minutesLate = this.calculateMinutesLate(clockIn, settings, userId)
        return minutesLate > settings.gracePeriodMinutes ? 'late' : 'on-time'
    }

    // Calculate minutes late
    private static calculateMinutesLate(clockIn: Date, settings: WorkSettings, userId?: string): number {
        // Find user role if userId provided (mocked for now)
        // In real app, we would look up user.roleId

        let startTime = settings.startTime

        // Mock logic: if we had user roles available here we would check roleSchedules
        // For now, we'll use base settings unless "userId" indicates a specific role for demo

        const [hours, minutes] = startTime.split(':').map(Number)
        const scheduledStart = new Date(clockIn)
        scheduledStart.setHours(hours, minutes, 0, 0)

        const diff = clockIn.getTime() - scheduledStart.getTime()
        return Math.max(0, Math.floor(diff / (1000 * 60)))
    }

    // Get today's record for user
    static getTodayRecord(userId: string): AttendanceRecord | undefined {
        const today = new Date().toISOString().split('T')[0]
        return this.attendanceRecords.find((r) => r.userId === userId && r.date === today)
    }

    // Get user's attendance history
    static getUserAttendance(userId: string, days: number = 7): AttendanceRecord[] {
        return this.attendanceRecords
            .filter((r) => r.userId === userId)
            .slice(0, days)
            .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    }

    // Get all attendance with filters
    static getAttendance(filters: AttendanceFilters = {}): AttendanceRecord[] {
        let records = [...this.attendanceRecords]

        if (filters.userId) {
            records = records.filter((r) => r.userId === filters.userId)
        }

        if (filters.status && filters.status !== 'all') {
            records = records.filter((r) => r.status === filters.status)
        }

        if (filters.startDate) {
            records = records.filter((r) => r.date >= filters.startDate!)
        }

        if (filters.endDate) {
            records = records.filter((r) => r.date <= filters.endDate!)
        }

        return records.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    }

    // Calculate stats
    static calculateStats(records: AttendanceRecord[]): AttendanceStats {
        const totalDays = records.length
        const presentDays = records.filter((r) => r.status !== 'absent').length
        const lateDays = records.filter((r) => r.status === 'late').length
        const absentDays = records.filter((r) => r.status === 'absent').length
        const totalHours = records.reduce((sum, r) => sum + (r.hoursWorked || 0), 0)
        const averageHours = totalDays > 0 ? totalHours / totalDays : 0
        const onTimePercentage = totalDays > 0 ? ((presentDays - lateDays) / totalDays) * 100 : 0

        return {
            totalDays,
            presentDays,
            lateDays,
            absentDays,
            totalHours: Math.round(totalHours * 100) / 100,
            averageHours: Math.round(averageHours * 100) / 100,
            onTimePercentage: Math.round(onTimePercentage * 100) / 100,
        }
    }

    // Get work settings
    static getWorkSettings(): WorkSettings {
        return { ...this.workSettings }
    }

    // Update work settings
    static updateWorkSettings(settings: Partial<WorkSettings>, updatedBy: string): WorkSettings {
        this.workSettings = {
            ...this.workSettings,
            ...settings,
            updatedAt: new Date(),
            updatedBy,
        }
        return { ...this.workSettings }
    }
}
