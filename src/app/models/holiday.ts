export interface PublicHoliday {
    id: number;
    name: string;
    date: string;
    description?: string;
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
    createdBy: number;
}

export interface CreateHolidayRequest {
    name: string;
    date: string;
    description?: string;
    createdBy: number;
}

export interface UpdateHolidayRequest {
    name?: string;
    date?: string;
    description?: string;
    isActive?: boolean;
} 