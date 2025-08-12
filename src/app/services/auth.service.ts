import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { Router } from '@angular/router';
import { UserProfile, LoginResponse } from '../models/user-profile';
import { JsonDatabaseService } from './json-database.service';

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    private currentUserSubject = new BehaviorSubject<UserProfile | null>(null);
    public currentUser$ = this.currentUserSubject.asObservable();

    constructor(
        private router: Router,
        private jsonDatabaseService: JsonDatabaseService
    ) {
        // Initialize current user from database
        const savedUser = this.jsonDatabaseService.getCurrentUser();
        if (savedUser) {
            this.currentUserSubject.next(savedUser);
        }
    }

    login(email: string, password: string): Observable<LoginResponse> {
        const user = this.jsonDatabaseService.authenticateUser(email, password);

        if (user) {
            this.currentUserSubject.next(user);
            this.jsonDatabaseService.setCurrentUser(user);

            return of({
                success: true,
                message: 'Login successful',
                data: {
                    user: user,
                    token: 'dummy-token-' + Date.now(),
                    expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString()
                }
            });
        } else {
            return of({
                success: false,
                message: 'Invalid credentials',
                data: {
                    user: null,
                    token: null,
                    expiresAt: ''
                }
            });
        }
    }

    logout(): void {
        this.currentUserSubject.next(null);
        this.jsonDatabaseService.setCurrentUser(null);
        this.router.navigate(['/login']);
    }

    register(userData: any): Observable<LoginResponse> {
        const newUser = this.jsonDatabaseService.createUser({
            ...userData,
            role: 'Employee',
            isActive: true,
            emailVerified: true
        });

        this.currentUserSubject.next(newUser);
        this.jsonDatabaseService.setCurrentUser(newUser);

        return of({
            success: true,
            message: 'Registration successful',
            data: {
                user: newUser,
                token: 'dummy-token-' + Date.now(),
                expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString()
            }
        });
    }

    isLoggedIn(): boolean {
        return this.currentUserSubject.value !== null;
    }

    isAdmin(): boolean {
        return this.currentUserSubject.value?.role === 'Admin';
    }

    isTeamLead(): boolean {
        return this.currentUserSubject.value?.role === 'TeamLead';
    }

    isEmployee(): boolean {
        return this.currentUserSubject.value?.role === 'Employee';
    }

    hasRole(role: string): boolean {
        return this.currentUserSubject.value?.role === role;
    }

    getCurrentUser(): UserProfile | null {
        return this.currentUserSubject.value;
    }

    getToken(): string | null {
        const currentUser = this.currentUserSubject.value;
        return currentUser?.token || null;
    }
} 