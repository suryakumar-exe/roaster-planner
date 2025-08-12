import { Routes } from '@angular/router';
import { authGuard } from './guards/auth.guard';
import { adminGuard } from './guards/admin.guard';
import { teamLeadGuard } from './guards/team-lead.guard';

export const routes: Routes = [
    { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
    { path: 'login', loadComponent: () => import('./components/auth/login/login.component').then(m => m.LoginComponent) },
    { path: 'register', loadComponent: () => import('./components/auth/register/register.component').then(m => m.RegisterComponent) },

    // Protected routes
    {
        path: 'dashboard',
        loadComponent: () => import('./components/dashboard/dashboard.component').then(m => m.DashboardComponent),
        canActivate: [authGuard]
    },

    {
        path: 'roster',
        loadComponent: () => import('./components/roster/roster-planner/roster-planner.component').then(m => m.RosterPlannerComponent),
        canActivate: [authGuard]
    },

    {
        path: 'team-rosters',
        loadComponent: () => import('./components/roster/team-rosters/team-rosters.component').then(m => m.TeamRostersComponent),
        canActivate: [authGuard, teamLeadGuard]
    },

    {
        path: 'team-lead-roster',
        loadComponent: () => import('./components/roster/team-lead-roster/team-lead-roster.component').then(m => m.TeamLeadRosterComponent),
        canActivate: [authGuard]
    },

    {
        path: 'leaves',
        loadComponent: () => import('./components/leaves/leave-management/leave-management.component').then(m => m.LeaveManagementComponent),
        canActivate: [authGuard]
    },

    {
        path: 'teams',
        loadComponent: () => import('./components/teams/team-management/team-management.component').then(m => m.TeamManagementComponent),
        canActivate: [authGuard]
    },

    {
        path: 'users',
        loadComponent: () => import('./components/users/user-management/user-management.component').then(m => m.UserManagementComponent),
        canActivate: [authGuard, adminGuard]
    },

    {
        path: 'reports',
        loadComponent: () => import('./components/reports/compliance-report/compliance-report.component').then(m => m.ComplianceReportComponent),
        canActivate: [authGuard]
    },

    {
        path: 'profile',
        loadComponent: () => import('./components/profile/profile.component').then(m => m.ProfileComponent),
        canActivate: [authGuard]
    },

    {
        path: 'database',
        loadComponent: () => import('./components/database-management/database-management.component').then(m => m.DatabaseManagementComponent),
        canActivate: [authGuard, adminGuard]
    },

    { path: '**', redirectTo: '/dashboard' }
]; 