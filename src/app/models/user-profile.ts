export interface UserProfile {
    id: number;
    email: string;
    firstName: string;
    lastName: string;
    role: 'Admin' | 'TeamLead' | 'Employee';
    teamId?: number;
    teamName?: string;
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
    lastLoginAt?: string;
    emailVerified: boolean;
    token?: string;
    employeeId?: string;
}

export interface LoginRequest {
    email: string;
    password: string;
}

export interface LoginResponse {
    success: boolean;
    message: string;
    data: {
        user: UserProfile | null;
        token: string | null;
        expiresAt: string;
    };
}

export interface CreateUserRequest {
    email: string;
    firstName: string;
    lastName: string;
    password: string;
    role: 'Admin' | 'TeamLead' | 'Employee';
    teamId?: number;
    isActive?: boolean;
    emailVerified?: boolean;
    employeeId?: string;
}

export interface UpdateUserRequest {
    firstName?: string;
    lastName?: string;
    role?: 'Admin' | 'TeamLead' | 'Employee';
    teamId?: number | null;
    isActive?: boolean;
    employeeId?: string;
} 