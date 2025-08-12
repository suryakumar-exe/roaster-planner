import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { JsonDatabaseService } from './json-database.service';
import { Roster as ModelRoster } from '../models/roster';

export interface Roster {
    id: number;
    userId: number;
    userName?: string;
    email?: string;
    role?: 'Admin' | 'TeamLead' | 'Employee';
    teamId?: number;
    teamName?: string;
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
    isSystemGenerated?: boolean;
    createdAt: string;
    updatedAt: string;
    createdBy?: number;
    updatedBy?: number;
}

export interface CreateRosterRequest {
    userId: number;
    userName?: string;
    email?: string;
    role?: 'Admin' | 'TeamLead' | 'Employee';
    teamId?: number;
    teamName?: string;
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
    isSystemGenerated?: boolean;
    createdBy?: number;
    updatedBy?: number;
}

export interface UpdateRosterRequest {
    workFromOfficeDays?: string[];
    workFromHomeDays?: string[];
    leaveDays?: string[];
    status?: 'Draft' | 'Submitted' | 'Approved' | 'Rejected';
    submittedAt?: string;
    approvedAt?: string;
    approvedBy?: number;
    approvedByName?: string;
    updatedBy?: number;
}

@Injectable({
    providedIn: 'root'
})
export class RostersService {
    constructor(private jsonDatabaseService: JsonDatabaseService) { }

    getRosters(): Observable<Roster[]> {
        return of(this.jsonDatabaseService.getRosters());
    }

    getRosterById(id: number): Observable<Roster | null> {
        const rosters = this.jsonDatabaseService.getRosters();
        const roster = rosters.find((r: Roster) => r.id === id) || null;
        return of(roster);
    }

    getRostersByWeek(weekStartDate: string): Observable<Roster[]> {
        return of(this.jsonDatabaseService.getRostersByWeek(weekStartDate));
    }

    getRostersByUser(userId: number): Observable<Roster[]> {
        return of(this.jsonDatabaseService.getRostersByUser(userId));
    }

    getRostersByTeam(teamId: number): Observable<Roster[]> {
        return of(this.jsonDatabaseService.getRostersByTeam(teamId));
    }

    createRoster(roster: CreateRosterRequest): Observable<Roster> {
        // Ensure all required properties are present
        const rosterData: Omit<ModelRoster, 'id' | 'createdAt' | 'updatedAt'> = {
            ...roster,
            teamId: roster.teamId || 0, // Provide default value
            userName: roster.userName || '',
            email: roster.email || '',
            role: roster.role || 'Employee',
            teamName: roster.teamName || '',
            createdBy: roster.createdBy || roster.userId,
            updatedBy: roster.updatedBy || roster.userId
        };
        const newRoster = this.jsonDatabaseService.createRoster(rosterData);
        return of(newRoster);
    }

    updateRoster(id: number, roster: UpdateRosterRequest): Observable<Roster | null> {
        const updatedRoster = this.jsonDatabaseService.updateRoster(id, roster);
        return of(updatedRoster);
    }

    deleteRoster(id: number): Observable<boolean> {
        const success = this.jsonDatabaseService.deleteRoster(id);
        return of(success);
    }

    approveRoster(id: number, approvedBy: number, approvedByName: string): Observable<Roster | null> {
        const roster = this.jsonDatabaseService.updateRoster(id, {
            status: 'Approved',
            approvedAt: new Date().toISOString(),
            approvedBy: approvedBy,
            approvedByName: approvedByName
        });
        return of(roster);
    }

    rejectRoster(id: number, approvedBy: number, approvedByName: string): Observable<Roster | null> {
        const roster = this.jsonDatabaseService.updateRoster(id, {
            status: 'Rejected',
            approvedAt: new Date().toISOString(),
            approvedBy: approvedBy,
            approvedByName: approvedByName
        });
        return of(roster);
    }
} 