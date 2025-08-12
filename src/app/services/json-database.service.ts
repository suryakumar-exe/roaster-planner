import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { UserProfile, LoginResponse } from '../models/user-profile';
import { Roster, CreateRosterRequest } from '../models/roster';
import { Team, CreateTeamRequest } from '../models/team';
import { PublicHoliday, CreateHolidayRequest } from '../models/holiday';
import { Leave, CreateLeaveRequest } from '../models/leave';
import { Notification } from '../models/notification';

export interface DatabaseData {
    users: UserProfile[];
    rosters: Roster[];
    teams: Team[];
    holidays: PublicHoliday[];
    leaves: Leave[];
    notifications: Notification[];
    currentUser: UserProfile | null;
    lastUpdated: string;
}

@Injectable({
    providedIn: 'root'
})
export class JsonDatabaseService {
    private databaseKey = 'workwise_database';
    private currentUserKey = 'workwise_current_user';

    // Default data
    private defaultUsers: UserProfile[] = [
        {
            id: 1,
            firstName: 'System',
            lastName: 'Administrator',
            email: 'admin@workwise.com',
            employeeId: 'ADMIN001',
            role: 'Admin',
            teamId: undefined,
            teamName: undefined,
            isActive: true,
            emailVerified: true,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        },
        {
            id: 2,
            firstName: 'John',
            lastName: 'Doe',
            email: 'john.doe@workwise.com',
            employeeId: 'EMP001',
            role: 'TeamLead',
            teamId: 1,
            teamName: 'Development Team',
            isActive: true,
            emailVerified: true,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        },
        {
            id: 3,
            firstName: 'Jane',
            lastName: 'Smith',
            email: 'jane.smith@workwise.com',
            employeeId: 'EMP002',
            role: 'Employee',
            teamId: 1,
            teamName: 'Development Team',
            isActive: true,
            emailVerified: true,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        },
        {
            id: 4,
            firstName: 'Surya',
            lastName: 'Kumar',
            email: 'skumar302@workwise.com',
            employeeId: '2388544',
            role: 'Employee',
            teamId: 1,
            teamName: 'Development Team',
            isActive: true,
            emailVerified: true,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        }
    ];

    private defaultTeams: Team[] = [
        {
            id: 1,
            name: 'Development Team',
            description: 'Software development team',
            teamLeadId: 2,
            teamLeadName: 'John Doe',
            memberCount: 3,
            isActive: true,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            createdBy: 1
        }
    ];

    private defaultHolidays: PublicHoliday[] = [
        {
            id: 1,
            name: 'New Year\'s Day',
            date: '2025-01-01',
            description: 'New Year\'s Day',
            isActive: true,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            createdBy: 1
        },
        {
            id: 2,
            name: 'Independence Day',
            date: '2025-08-15',
            description: 'Indian Independence Day',
            isActive: true,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            createdBy: 1
        }
    ];

    constructor() {
        this.initializeDatabase();
    }

    private initializeDatabase(): void {
        const existingData = this.getDatabase();
        if (!existingData) {
            const initialData: DatabaseData = {
                users: this.defaultUsers,
                rosters: [],
                teams: this.defaultTeams,
                holidays: this.defaultHolidays,
                leaves: [],
                notifications: [],
                currentUser: null,
                lastUpdated: new Date().toISOString()
            };
            this.saveDatabase(initialData);
        }
    }

    private getDatabase(): DatabaseData | null {
        try {
            const data = localStorage.getItem(this.databaseKey);
            return data ? JSON.parse(data) : null;
        } catch (error) {
            console.error('Error reading database:', error);
            return null;
        }
    }

    private saveDatabase(data: DatabaseData): void {
        try {
            data.lastUpdated = new Date().toISOString();
            localStorage.setItem(this.databaseKey, JSON.stringify(data, null, 2));
        } catch (error) {
            console.error('Error saving database:', error);
        }
    }

    // User Management
    getUsers(): UserProfile[] {
        const db = this.getDatabase();
        return db?.users || [];
    }

    setUsers(users: UserProfile[]): void {
        const db = this.getDatabase();
        if (db) {
            db.users = users;
            this.saveDatabase(db);
        }
    }

    createUser(user: Omit<UserProfile, 'id' | 'createdAt' | 'updatedAt'>): UserProfile {
        const db = this.getDatabase();
        if (!db) throw new Error('Database not initialized');

        const newUser: UserProfile = {
            ...user,
            id: Math.max(...db.users.map(u => u.id), 0) + 1,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };

        db.users.push(newUser);
        this.saveDatabase(db);
        return newUser;
    }

    updateUser(id: number, updates: Partial<UserProfile>): UserProfile | null {
        const db = this.getDatabase();
        if (!db) return null;

        const userIndex = db.users.findIndex(u => u.id === id);
        if (userIndex === -1) return null;

        db.users[userIndex] = {
            ...db.users[userIndex],
            ...updates,
            updatedAt: new Date().toISOString()
        };

        this.saveDatabase(db);
        return db.users[userIndex];
    }

    deleteUser(id: number): boolean {
        const db = this.getDatabase();
        if (!db) return false;

        const userIndex = db.users.findIndex(u => u.id === id);
        if (userIndex === -1) return false;

        db.users.splice(userIndex, 1);
        this.saveDatabase(db);
        return true;
    }

    getUserById(id: number): UserProfile | null {
        const db = this.getDatabase();
        return db?.users.find(u => u.id === id) || null;
    }

    authenticateUser(email: string, password: string): UserProfile | null {
        const db = this.getDatabase();
        if (!db) return null;

        // For demo purposes, accept any password
        return db.users.find(u => u.email === email && u.isActive) || null;
    }

    // Team Management
    getTeams(): Team[] {
        const db = this.getDatabase();
        return db?.teams || [];
    }

    setTeams(teams: Team[]): void {
        const db = this.getDatabase();
        if (db) {
            db.teams = teams;
            this.saveDatabase(db);
        }
    }

    createTeam(team: Omit<Team, 'id' | 'createdAt' | 'updatedAt'>): Team {
        const db = this.getDatabase();
        if (!db) throw new Error('Database not initialized');

        const newTeam: Team = {
            ...team,
            id: Math.max(...db.teams.map(t => t.id), 0) + 1,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };

        db.teams.push(newTeam);
        this.saveDatabase(db);
        return newTeam;
    }

    updateTeam(id: number, updates: Partial<Team>): Team | null {
        const db = this.getDatabase();
        if (!db) return null;

        const teamIndex = db.teams.findIndex(t => t.id === id);
        if (teamIndex === -1) return null;

        db.teams[teamIndex] = {
            ...db.teams[teamIndex],
            ...updates,
            updatedAt: new Date().toISOString()
        };

        this.saveDatabase(db);
        return db.teams[teamIndex];
    }

    deleteTeam(id: number): boolean {
        const db = this.getDatabase();
        if (!db) return false;

        const teamIndex = db.teams.findIndex(t => t.id === id);
        if (teamIndex === -1) return false;

        db.teams.splice(teamIndex, 1);
        this.saveDatabase(db);
        return true;
    }

    // Roster Management
    getRosters(): Roster[] {
        const db = this.getDatabase();
        return db?.rosters || [];
    }

    setRosters(rosters: Roster[]): void {
        const db = this.getDatabase();
        if (db) {
            db.rosters = rosters;
            this.saveDatabase(db);
        }
    }

    createRoster(roster: Omit<Roster, 'id' | 'createdAt' | 'updatedAt'>): Roster {
        const db = this.getDatabase();
        if (!db) throw new Error('Database not initialized');

        const newRoster: Roster = {
            ...roster,
            id: Math.max(...db.rosters.map(r => r.id), 0) + 1,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };

        db.rosters.push(newRoster);
        this.saveDatabase(db);
        return newRoster;
    }

    updateRoster(id: number, updates: Partial<Roster>): Roster | null {
        const db = this.getDatabase();
        if (!db) return null;

        const rosterIndex = db.rosters.findIndex(r => r.id === id);
        if (rosterIndex === -1) return null;

        db.rosters[rosterIndex] = {
            ...db.rosters[rosterIndex],
            ...updates,
            updatedAt: new Date().toISOString()
        };

        this.saveDatabase(db);
        return db.rosters[rosterIndex];
    }

    deleteRoster(id: number): boolean {
        const db = this.getDatabase();
        if (!db) return false;

        const rosterIndex = db.rosters.findIndex(r => r.id === id);
        if (rosterIndex === -1) return false;

        db.rosters.splice(rosterIndex, 1);
        this.saveDatabase(db);
        return true;
    }

    getRostersByWeek(weekStartDate: string): Roster[] {
        const db = this.getDatabase();
        return db?.rosters.filter(r => r.weekStartDate === weekStartDate) || [];
    }

    getRostersByUser(userId: number): Roster[] {
        const db = this.getDatabase();
        return db?.rosters.filter(r => r.userId === userId) || [];
    }

    getRostersByTeam(teamId: number): Roster[] {
        const db = this.getDatabase();
        return db?.rosters.filter(r => r.teamId === teamId) || [];
    }

    // Holiday Management
    getHolidays(): PublicHoliday[] {
        const db = this.getDatabase();
        return db?.holidays || [];
    }

    setHolidays(holidays: PublicHoliday[]): void {
        const db = this.getDatabase();
        if (db) {
            db.holidays = holidays;
            this.saveDatabase(db);
        }
    }

    createHoliday(holiday: Omit<PublicHoliday, 'id' | 'createdAt' | 'updatedAt'>): PublicHoliday {
        const db = this.getDatabase();
        if (!db) throw new Error('Database not initialized');

        const newHoliday: PublicHoliday = {
            ...holiday,
            id: Math.max(...db.holidays.map(h => h.id), 0) + 1,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };

        db.holidays.push(newHoliday);
        this.saveDatabase(db);
        return newHoliday;
    }

    updateHoliday(id: number, updates: Partial<PublicHoliday>): PublicHoliday | null {
        const db = this.getDatabase();
        if (!db) return null;

        const holidayIndex = db.holidays.findIndex(h => h.id === id);
        if (holidayIndex === -1) return null;

        db.holidays[holidayIndex] = {
            ...db.holidays[holidayIndex],
            ...updates,
            updatedAt: new Date().toISOString()
        };

        this.saveDatabase(db);
        return db.holidays[holidayIndex];
    }

    deleteHoliday(id: number): boolean {
        const db = this.getDatabase();
        if (!db) return false;

        const holidayIndex = db.holidays.findIndex(h => h.id === id);
        if (holidayIndex === -1) return false;

        db.holidays.splice(holidayIndex, 1);
        this.saveDatabase(db);
        return true;
    }

    // Leave Management
    getLeaves(): Leave[] {
        const db = this.getDatabase();
        return db?.leaves || [];
    }

    setLeaves(leaves: Leave[]): void {
        const db = this.getDatabase();
        if (db) {
            db.leaves = leaves;
            this.saveDatabase(db);
        }
    }

    createLeave(leave: Omit<Leave, 'id' | 'createdAt' | 'updatedAt'>): Leave {
        const db = this.getDatabase();
        if (!db) throw new Error('Database not initialized');

        const newLeave: Leave = {
            ...leave,
            id: Math.max(...db.leaves.map(l => l.id), 0) + 1,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };

        db.leaves.push(newLeave);
        this.saveDatabase(db);
        return newLeave;
    }

    updateLeave(id: number, updates: Partial<Leave>): Leave | null {
        const db = this.getDatabase();
        if (!db) return null;

        const leaveIndex = db.leaves.findIndex(l => l.id === id);
        if (leaveIndex === -1) return null;

        db.leaves[leaveIndex] = {
            ...db.leaves[leaveIndex],
            ...updates,
            updatedAt: new Date().toISOString()
        };

        this.saveDatabase(db);
        return db.leaves[leaveIndex];
    }

    deleteLeave(id: number): boolean {
        const db = this.getDatabase();
        if (!db) return false;

        const leaveIndex = db.leaves.findIndex(l => l.id === id);
        if (leaveIndex === -1) return false;

        db.leaves.splice(leaveIndex, 1);
        this.saveDatabase(db);
        return true;
    }

    getLeavesByUser(userId: number): Leave[] {
        const db = this.getDatabase();
        return db?.leaves.filter(l => l.userId === userId) || [];
    }

    // Notification Management
    getNotifications(): Notification[] {
        const db = this.getDatabase();
        return db?.notifications || [];
    }

    setNotifications(notifications: Notification[]): void {
        const db = this.getDatabase();
        if (db) {
            db.notifications = notifications;
            this.saveDatabase(db);
        }
    }

    createNotification(notification: Omit<Notification, 'id' | 'createdAt' | 'updatedAt'>): Notification {
        const db = this.getDatabase();
        if (!db) throw new Error('Database not initialized');

        const newNotification: Notification = {
            ...notification,
            id: Math.max(...db.notifications.map(n => n.id), 0) + 1,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };

        db.notifications.push(newNotification);
        this.saveDatabase(db);
        return newNotification;
    }

    markNotificationAsRead(id: number): boolean {
        const db = this.getDatabase();
        if (!db) return false;

        const notificationIndex = db.notifications.findIndex(n => n.id === id);
        if (notificationIndex === -1) return false;

        db.notifications[notificationIndex].isRead = true;
        db.notifications[notificationIndex].updatedAt = new Date().toISOString();
        this.saveDatabase(db);
        return true;
    }

    markAllNotificationsAsRead(): void {
        const db = this.getDatabase();
        if (!db) return;

        db.notifications.forEach(notification => {
            notification.isRead = true;
            notification.updatedAt = new Date().toISOString();
        });

        this.saveDatabase(db);
    }

    getUnreadNotificationCount(): number {
        const db = this.getDatabase();
        return db?.notifications.filter(n => !n.isRead).length || 0;
    }

    // Current User Management
    getCurrentUser(): UserProfile | null {
        try {
            const data = localStorage.getItem(this.currentUserKey);
            return data ? JSON.parse(data) : null;
        } catch (error) {
            console.error('Error reading current user:', error);
            return null;
        }
    }

    setCurrentUser(user: UserProfile | null): void {
        try {
            if (user) {
                localStorage.setItem(this.currentUserKey, JSON.stringify(user));
            } else {
                localStorage.removeItem(this.currentUserKey);
            }
        } catch (error) {
            console.error('Error saving current user:', error);
        }
    }

    // Database Management
    clearAllData(): void {
        try {
            localStorage.removeItem(this.databaseKey);
            localStorage.removeItem(this.currentUserKey);
            this.initializeDatabase();
        } catch (error) {
            console.error('Error clearing data:', error);
        }
    }

    exportData(): DatabaseData {
        const db = this.getDatabase();
        if (!db) {
            throw new Error('Database not initialized');
        }
        return { ...db };
    }

    importData(data: DatabaseData): void {
        try {
            this.saveDatabase(data);
        } catch (error) {
            console.error('Error importing data:', error);
            throw error;
        }
    }

    // Export to JSON file
    exportToJsonFile(): void {
        const data = this.exportData();
        const dataStr = JSON.stringify(data, null, 2);
        const dataBlob = new Blob([dataStr], { type: 'application/json' });

        const link = document.createElement('a');
        link.href = URL.createObjectURL(dataBlob);
        link.download = `workwise_database_${new Date().toISOString().split('T')[0]}.json`;
        link.click();
    }

    // Import from JSON file
    importFromJsonFile(file: File): Promise<void> {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = (e) => {
                try {
                    const data = JSON.parse(e.target?.result as string);
                    this.importData(data);
                    resolve();
                } catch (error) {
                    reject(error);
                }
            };
            reader.onerror = () => reject(new Error('Failed to read file'));
            reader.readAsText(file);
        });
    }

    // Get database statistics
    getDatabaseStats(): any {
        const db = this.getDatabase();
        if (!db) return null;

        return {
            totalUsers: db.users.length,
            totalRosters: db.rosters.length,
            totalTeams: db.teams.length,
            totalHolidays: db.holidays.length,
            totalLeaves: db.leaves.length,
            totalNotifications: db.notifications.length,
            unreadNotifications: this.getUnreadNotificationCount(),
            lastUpdated: db.lastUpdated
        };
    }
} 