import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { JsonDatabaseService } from './json-database.service';

export interface User {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
    employeeId?: string;
    role: 'Admin' | 'TeamLead' | 'Employee';
    teamId?: number | null;
    teamName?: string | null;
    isActive: boolean;
    emailVerified: boolean;
    createdAt: string;
    updatedAt: string;
}

export interface CreateUserRequest {
    firstName: string;
    lastName: string;
    email: string;
    employeeId?: string;
    role: 'Admin' | 'TeamLead' | 'Employee';
    teamId?: number | null;
    teamName?: string | null;
    isActive: boolean;
    emailVerified: boolean;
}

export interface UpdateUserRequest {
    firstName?: string;
    lastName?: string;
    email?: string;
    employeeId?: string;
    role?: 'Admin' | 'TeamLead' | 'Employee';
    teamId?: number | null;
    teamName?: string | null;
    isActive?: boolean;
    emailVerified?: boolean;
}

@Injectable({
    providedIn: 'root'
})
export class UsersService {
    constructor(private jsonDatabaseService: JsonDatabaseService) { }

    getUsers(): Observable<User[]> {
        return of(this.jsonDatabaseService.getUsers());
    }

    getUserById(id: number): Observable<User | null> {
        return of(this.jsonDatabaseService.getUserById(id));
    }

    createUser(newUser: CreateUserRequest): Observable<User> {
        // Convert null teamId to undefined for compatibility
        const userData = {
            ...newUser,
            teamId: newUser.teamId === null ? undefined : newUser.teamId,
            teamName: newUser.teamName === null ? undefined : newUser.teamName
        };
        const user = this.jsonDatabaseService.createUser(userData);
        return of(user);
    }

    updateUser(id: number, editUserData: UpdateUserRequest): Observable<User | null> {
        // Convert null teamId to undefined for compatibility
        const userData = {
            ...editUserData,
            teamId: editUserData.teamId === null ? undefined : editUserData.teamId,
            teamName: editUserData.teamName === null ? undefined : editUserData.teamName
        };
        const user = this.jsonDatabaseService.updateUser(id, userData);
        return of(user);
    }

    deleteUser(id: number): Observable<boolean> {
        const success = this.jsonDatabaseService.deleteUser(id);
        return of(success);
    }

    activateUser(id: number): Observable<boolean> {
        const user = this.jsonDatabaseService.updateUser(id, { isActive: true });
        return of(user !== null);
    }

    deactivateUser(id: number): Observable<boolean> {
        const user = this.jsonDatabaseService.updateUser(id, { isActive: false });
        return of(user !== null);
    }
} 