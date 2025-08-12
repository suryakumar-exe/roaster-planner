export interface Team {
    id: number;
    name: string;
    description?: string;
    teamLeadId?: number;
    teamLeadName?: string;
    memberCount: number;
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
    createdBy: number;
}

export interface CreateTeamRequest {
    name: string;
    description?: string;
    teamLeadId?: number;
    createdBy: number;
}

export interface UpdateTeamRequest {
    name?: string;
    description?: string;
    teamLeadId?: number;
    isActive?: boolean;
}

export interface TeamMember {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
    employeeId?: string;
    role: 'Admin' | 'TeamLead' | 'Employee';
    isActive: boolean;
    joinedAt: string;
} 