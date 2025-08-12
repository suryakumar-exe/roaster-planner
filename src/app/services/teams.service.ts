import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { JsonDatabaseService } from './json-database.service';

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
    teamLeadName?: string;
    memberCount: number;
    isActive: boolean;
    createdBy: number;
}

export interface UpdateTeamRequest {
    name?: string;
    description?: string;
    teamLeadId?: number;
    teamLeadName?: string;
    memberCount?: number;
    isActive?: boolean;
}

@Injectable({
    providedIn: 'root'
})
export class TeamsService {
    constructor(private jsonDatabaseService: JsonDatabaseService) { }

    getTeams(): Observable<Team[]> {
        return of(this.jsonDatabaseService.getTeams());
    }

    getTeamById(id: number): Observable<Team | null> {
        const teams = this.jsonDatabaseService.getTeams();
        const team = teams.find((t: Team) => t.id === id) || null;
        return of(team);
    }

    createTeam(newTeam: CreateTeamRequest): Observable<Team> {
        const team = this.jsonDatabaseService.createTeam(newTeam);
        return of(team);
    }

    updateTeam(id: number, editTeamData: UpdateTeamRequest): Observable<Team | null> {
        const team = this.jsonDatabaseService.updateTeam(id, editTeamData);
        return of(team);
    }

    deleteTeam(id: number): Observable<boolean> {
        const success = this.jsonDatabaseService.deleteTeam(id);
        return of(success);
    }
} 