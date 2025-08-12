import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { JsonDatabaseService } from './json-database.service';

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
    approvedAt?: string;
    approvedBy?: number;
    approvedByName?: string;
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
    approvedAt?: string;
    approvedBy?: number;
    approvedByName?: string;
}

export interface UpdateLeaveRequest {
    startDate?: string;
    endDate?: string;
    totalDays?: number;
    reason?: string;
    status?: 'Pending' | 'Approved' | 'Rejected';
    approvedAt?: string;
    approvedBy?: number;
    approvedByName?: string;
}

@Injectable({
    providedIn: 'root'
})
export class LeavesService {
    constructor(private jsonDatabaseService: JsonDatabaseService) { }

    getLeaves(): Observable<Leave[]> {
        return of(this.jsonDatabaseService.getLeaves());
    }

    getLeaveById(id: number): Observable<Leave | null> {
        const leaves = this.jsonDatabaseService.getLeaves();
        const leave = leaves.find((l: Leave) => l.id === id) || null;
        return of(leave);
    }

    getLeavesByUser(userId: number): Observable<Leave[]> {
        return of(this.jsonDatabaseService.getLeavesByUser(userId));
    }

    createLeave(leave: CreateLeaveRequest): Observable<Leave> {
        const newLeave = this.jsonDatabaseService.createLeave(leave);
        return of(newLeave);
    }

    updateLeave(id: number, leave: UpdateLeaveRequest): Observable<Leave | null> {
        const updatedLeave = this.jsonDatabaseService.updateLeave(id, leave);
        return of(updatedLeave);
    }

    deleteLeave(id: number): Observable<boolean> {
        const success = this.jsonDatabaseService.deleteLeave(id);
        return of(success);
    }
} 