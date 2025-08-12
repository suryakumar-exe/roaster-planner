export enum WorkType {
    WFH = 1,
    WFO = 2,
    Leave = 3,
    Holiday = 4
}

export interface Roster {
    id: number;
    userId: number;
    userName: string;
    email?: string;
    role?: 'Admin' | 'TeamLead' | 'Employee';
    teamId: number;
    teamName: string;
    weekStartDate: string;
    weekEndDate: string;
    workFromOfficeDays: string[];
    workFromHomeDays: string[];
    leaveDays: string[];
    status: 'Draft' | 'Submitted' | 'Approved' | 'Rejected';
    submittedAt?: string;
    approvedAt?: string;
    approvedBy?: number;
    approvedByName?: string;
    createdAt: string;
    updatedAt: string;
    createdBy: number;
    updatedBy: number;
    isSystemGenerated?: boolean;
}

export interface RosterValidationResult {
    isValid: boolean;
    errors: string[];
    warnings: string[];
    wfoDaysCount: number;
    wfhDaysCount: number;
    leaveDaysCount: number;
    holidayDaysCount: number;
}

export interface CreateRosterRequest {
    weekStartDate: string;
    weekEndDate: string;
    workFromOfficeDays: string[];
    workFromHomeDays: string[];
    leaveDays?: string[];
    status?: 'Draft' | 'Submitted' | 'Approved' | 'Rejected';
    userId: number;
    userName?: string;
    email?: string;
    role?: 'Admin' | 'TeamLead' | 'Employee';
    teamId?: number;
    teamName?: string;
}

export interface UpdateRosterRequest {
    workFromOfficeDays?: string[];
    workFromHomeDays?: string[];
    leaveDays?: string[];
    status?: 'Draft' | 'Submitted' | 'Approved' | 'Rejected';
}

export interface RosterFilter {
    teamId?: number;
    userId?: number;
    startDate?: string;
    endDate?: string;
    status?: string;
}

export interface RosterStats {
    totalRosters: number;
    submittedRosters: number;
    approvedRosters: number;
    pendingApproval: number;
    complianceRate: number;
}

export interface WeeklyRosterSummary {
    weekStartDate: Date;
    weekEndDate: Date;
    totalEmployees: number;
    submittedRosters: number;
    pendingRosters: number;
    approvedRosters: number;
    rosters: Roster[];
}

export interface ComplianceReport {
    weekStartDate: Date;
    weekEndDate: Date;
    violations: ComplianceViolation[];
    totalViolations: number;
    compliancePercentage: number;
}

export interface ComplianceViolation {
    userId: string;
    userName: string;
    userEmail: string;
    teamName: string;
    violationType: string;
    description: string;
    wfoDaysCount: number;
    wfhDaysCount: number;
}

export interface TeamInfo {
    id: number;
    name: string;
    description?: string;
} 