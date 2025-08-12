export interface Leave {
    id: number;
    userId: number;
    userName: string;
    email: string;
    role: 'Admin' | 'TeamLead' | 'Employee';
    teamId?: number;
    teamName?: string;
    leaveType: string;
    startDate: string;
    endDate: string;
    totalDays: number;
    reason: string;
    status: 'Pending' | 'Approved' | 'Rejected';
    createdAt: string;
    updatedAt: string;
}

export interface CreateLeaveRequest {
    userId: number;
    userName: string;
    email: string;
    role: 'Admin' | 'TeamLead' | 'Employee';
    teamId?: number;
    teamName?: string;
    leaveType: string;
    startDate: string;
    endDate: string;
    totalDays: number;
    reason: string;
    status: 'Pending' | 'Approved' | 'Rejected';
}

export interface UpdateLeaveRequest {
    userId?: number;
    userName?: string;
    email?: string;
    role?: 'Admin' | 'TeamLead' | 'Employee';
    teamId?: number;
    teamName?: string;
    leaveType?: string;
    startDate?: string;
    endDate?: string;
    totalDays?: number;
    reason?: string;
    status?: 'Pending' | 'Approved' | 'Rejected';
} 