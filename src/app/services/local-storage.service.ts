import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { UserProfile, LoginResponse } from '../models/user-profile';
import { Roster, CreateRosterRequest } from '../models/roster';
import { Team, CreateTeamRequest } from '../models/team';
import { PublicHoliday, CreateHolidayRequest } from '../models/holiday';
import { Leave, CreateLeaveRequest } from '../models/leave';
import { Notification } from '../models/notification';

@Injectable({
    providedIn: 'root'
})
export class LocalStorageService {
    private usersKey = 'workwise_users';
    private rostersKey = 'workwise_rosters';
    private teamsKey = 'workwise_teams';
    private holidaysKey = 'workwise_holidays';
    private leavesKey = 'workwise_leaves';
    private notificationsKey = 'workwise_notifications';
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
            description: 'New Year celebration',
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
        this.initializeDefaultData();
    }

    private initializeDefaultData() {
        // Initialize users if not exists
        if (!this.getUsers().length) {
            this.setUsers(this.defaultUsers);
        }

        // Initialize teams if not exists
        if (!this.getTeams().length) {
            this.setTeams(this.defaultTeams);
        }

        // Initialize holidays if not exists
        if (!this.getHolidays().length) {
            this.setHolidays(this.defaultHolidays);
        }
    }

    // User operations
    getUsers(): UserProfile[] {
        const users = localStorage.getItem(this.usersKey);
        return users ? JSON.parse(users) : [];
    }

    setUsers(users: UserProfile[]): void {
        localStorage.setItem(this.usersKey, JSON.stringify(users));
    }

    createUser(user: Omit<UserProfile, 'id' | 'createdAt' | 'updatedAt'>): UserProfile {
        const users = this.getUsers();
        const newUser: UserProfile = {
            ...user,
            id: Math.max(...users.map(u => u.id), 0) + 1,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };
        users.push(newUser);
        this.setUsers(users);
        return newUser;
    }

    updateUser(id: number, updates: Partial<UserProfile>): UserProfile | null {
        const users = this.getUsers();
        const index = users.findIndex(u => u.id === id);
        if (index !== -1) {
            users[index] = { ...users[index], ...updates, updatedAt: new Date().toISOString() };
            this.setUsers(users);
            return users[index];
        }
        return null;
    }

    deleteUser(id: number): boolean {
        const users = this.getUsers();
        const filteredUsers = users.filter(u => u.id !== id);
        if (filteredUsers.length !== users.length) {
            this.setUsers(filteredUsers);
            return true;
        }
        return false;
    }

    getUserById(id: number): UserProfile | null {
        const users = this.getUsers();
        return users.find(u => u.id === id) || null;
    }

    authenticateUser(email: string, password: string): UserProfile | null {
        const users = this.getUsers();
        // For demo purposes, accept any password for existing users
        const user = users.find(u => u.email === email && u.isActive);
        return user || null;
    }

    // Team operations
    getTeams(): Team[] {
        const teams = localStorage.getItem(this.teamsKey);
        return teams ? JSON.parse(teams) : [];
    }

    setTeams(teams: Team[]): void {
        localStorage.setItem(this.teamsKey, JSON.stringify(teams));
    }

    createTeam(team: Omit<Team, 'id' | 'createdAt' | 'updatedAt'>): Team {
        const teams = this.getTeams();
        const newTeam: Team = {
            ...team,
            id: Math.max(...teams.map(t => t.id), 0) + 1,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };
        teams.push(newTeam);
        this.setTeams(teams);
        return newTeam;
    }

    updateTeam(id: number, updates: Partial<Team>): Team | null {
        const teams = this.getTeams();
        const index = teams.findIndex(t => t.id === id);
        if (index !== -1) {
            teams[index] = { ...teams[index], ...updates, updatedAt: new Date().toISOString() };
            this.setTeams(teams);
            return teams[index];
        }
        return null;
    }

    deleteTeam(id: number): boolean {
        const teams = this.getTeams();
        const filteredTeams = teams.filter(t => t.id !== id);
        if (filteredTeams.length !== teams.length) {
            this.setTeams(filteredTeams);
            return true;
        }
        return false;
    }

    // Roster operations
    getRosters(): Roster[] {
        const rosters = localStorage.getItem(this.rostersKey);
        return rosters ? JSON.parse(rosters) : [];
    }

    setRosters(rosters: Roster[]): void {
        localStorage.setItem(this.rostersKey, JSON.stringify(rosters));
    }

    createRoster(roster: Omit<Roster, 'id' | 'createdAt' | 'updatedAt'>): Roster {
        const rosters = this.getRosters();
        const newRoster: Roster = {
            ...roster,
            id: Math.max(...rosters.map(r => r.id), 0) + 1,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };
        rosters.push(newRoster);
        this.setRosters(rosters);
        return newRoster;
    }

    updateRoster(id: number, updates: Partial<Roster>): Roster | null {
        const rosters = this.getRosters();
        const index = rosters.findIndex(r => r.id === id);
        if (index !== -1) {
            rosters[index] = { ...rosters[index], ...updates, updatedAt: new Date().toISOString() };
            this.setRosters(rosters);
            return rosters[index];
        }
        return null;
    }

    deleteRoster(id: number): boolean {
        const rosters = this.getRosters();
        const filteredRosters = rosters.filter(r => r.id !== id);
        if (filteredRosters.length !== rosters.length) {
            this.setRosters(filteredRosters);
            return true;
        }
        return false;
    }

    getRostersByWeek(weekStartDate: string): Roster[] {
        const rosters = this.getRosters();
        return rosters.filter(r => r.weekStartDate === weekStartDate);
    }

    getRostersByUser(userId: number): Roster[] {
        const rosters = this.getRosters();
        return rosters.filter(r => r.userId === userId);
    }

    getRostersByTeam(teamId: number): Roster[] {
        const rosters = this.getRosters();
        return rosters.filter(r => r.teamId === teamId);
    }

    // Holiday operations
    getHolidays(): PublicHoliday[] {
        const holidays = localStorage.getItem(this.holidaysKey);
        return holidays ? JSON.parse(holidays) : [];
    }

    setHolidays(holidays: PublicHoliday[]): void {
        localStorage.setItem(this.holidaysKey, JSON.stringify(holidays));
    }

    createHoliday(holiday: Omit<PublicHoliday, 'id' | 'createdAt' | 'updatedAt'>): PublicHoliday {
        const holidays = this.getHolidays();
        const newHoliday: PublicHoliday = {
            ...holiday,
            id: Math.max(...holidays.map(h => h.id), 0) + 1,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };
        holidays.push(newHoliday);
        this.setHolidays(holidays);
        return newHoliday;
    }

    updateHoliday(id: number, updates: Partial<PublicHoliday>): PublicHoliday | null {
        const holidays = this.getHolidays();
        const index = holidays.findIndex(h => h.id === id);
        if (index !== -1) {
            holidays[index] = { ...holidays[index], ...updates, updatedAt: new Date().toISOString() };
            this.setHolidays(holidays);
            return holidays[index];
        }
        return null;
    }

    deleteHoliday(id: number): boolean {
        const holidays = this.getHolidays();
        const filteredHolidays = holidays.filter(h => h.id !== id);
        if (filteredHolidays.length !== holidays.length) {
            this.setHolidays(filteredHolidays);
            return true;
        }
        return false;
    }

    // Leave operations
    getLeaves(): Leave[] {
        const leaves = localStorage.getItem(this.leavesKey);
        return leaves ? JSON.parse(leaves) : [];
    }

    setLeaves(leaves: Leave[]): void {
        localStorage.setItem(this.leavesKey, JSON.stringify(leaves));
    }

    createLeave(leave: Omit<Leave, 'id' | 'createdAt' | 'updatedAt'>): Leave {
        const leaves = this.getLeaves();
        const newLeave: Leave = {
            ...leave,
            id: Math.max(...leaves.map(l => l.id), 0) + 1,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };
        leaves.push(newLeave);
        this.setLeaves(leaves);
        return newLeave;
    }

    updateLeave(id: number, updates: Partial<Leave>): Leave | null {
        const leaves = this.getLeaves();
        const index = leaves.findIndex(l => l.id === id);
        if (index !== -1) {
            leaves[index] = { ...leaves[index], ...updates, updatedAt: new Date().toISOString() };
            this.setLeaves(leaves);
            return leaves[index];
        }
        return null;
    }

    deleteLeave(id: number): boolean {
        const leaves = this.getLeaves();
        const filteredLeaves = leaves.filter(l => l.id !== id);
        if (filteredLeaves.length !== leaves.length) {
            this.setLeaves(filteredLeaves);
            return true;
        }
        return false;
    }

    getLeavesByUser(userId: number): Leave[] {
        const leaves = this.getLeaves();
        return leaves.filter(l => l.userId === userId);
    }

    // Notification operations
    getNotifications(): Notification[] {
        const notifications = localStorage.getItem(this.notificationsKey);
        return notifications ? JSON.parse(notifications) : [];
    }

    setNotifications(notifications: Notification[]): void {
        localStorage.setItem(this.notificationsKey, JSON.stringify(notifications));
    }

    createNotification(notification: Omit<Notification, 'id' | 'createdAt'>): Notification {
        const notifications = this.getNotifications();
        const newNotification: Notification = {
            ...notification,
            id: Math.max(...notifications.map(n => n.id), 0) + 1,
            createdAt: new Date().toISOString()
        };
        notifications.push(newNotification);
        this.setNotifications(notifications);
        return newNotification;
    }

    markNotificationAsRead(id: number): boolean {
        const notifications = this.getNotifications();
        const index = notifications.findIndex(n => n.id === id);
        if (index !== -1) {
            notifications[index].isRead = true;
            this.setNotifications(notifications);
            return true;
        }
        return false;
    }

    markAllNotificationsAsRead(): void {
        const notifications = this.getNotifications();
        notifications.forEach(n => n.isRead = true);
        this.setNotifications(notifications);
    }

    getUnreadNotificationCount(): number {
        const notifications = this.getNotifications();
        return notifications.filter(n => !n.isRead).length;
    }

    // Current user operations
    getCurrentUser(): UserProfile | null {
        const user = localStorage.getItem(this.currentUserKey);
        return user ? JSON.parse(user) : null;
    }

    setCurrentUser(user: UserProfile | null): void {
        if (user) {
            localStorage.setItem(this.currentUserKey, JSON.stringify(user));
        } else {
            localStorage.removeItem(this.currentUserKey);
        }
    }

    // Utility methods
    clearAllData(): void {
        localStorage.removeItem(this.usersKey);
        localStorage.removeItem(this.rostersKey);
        localStorage.removeItem(this.teamsKey);
        localStorage.removeItem(this.holidaysKey);
        localStorage.removeItem(this.leavesKey);
        localStorage.removeItem(this.notificationsKey);
        localStorage.removeItem(this.currentUserKey);
    }

    exportData(): any {
        return {
            users: this.getUsers(),
            rosters: this.getRosters(),
            teams: this.getTeams(),
            holidays: this.getHolidays(),
            leaves: this.getLeaves(),
            notifications: this.getNotifications()
        };
    }

    importData(data: any): void {
        if (data.users) this.setUsers(data.users);
        if (data.rosters) this.setRosters(data.rosters);
        if (data.teams) this.setTeams(data.teams);
        if (data.holidays) this.setHolidays(data.holidays);
        if (data.leaves) this.setLeaves(data.leaves);
        if (data.notifications) this.setNotifications(data.notifications);
    }
} 