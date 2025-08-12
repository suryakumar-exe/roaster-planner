import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from './services/auth.service';
import { NotificationService } from './services/notification.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink, RouterLinkActive],
  template: `
    <div class="d-flex" *ngIf="authService.isLoggedIn(); else loginView">
      <!-- Sidebar -->
      <div class="sidebar" style="width: 250px;">
        <div class="p-3">
          <h4 class="text-white mb-4">WorkWise</h4>
          <nav class="nav flex-column">
            <a class="nav-link" routerLink="/dashboard" routerLinkActive="active">
              <i class="bi bi-house-door me-2"></i>Dashboard
            </a>

            <!-- Admin Navigation -->
            <ng-container *ngIf="authService.isAdmin()">
              <a class="nav-link" routerLink="/roster" routerLinkActive="active">
                <i class="bi bi-calendar3 me-2"></i>Roster Management
              </a>
              <a class="nav-link" routerLink="/leaves" routerLinkActive="active">
                <i class="bi bi-calendar-event me-2"></i>Leave Management
              </a>
              <a class="nav-link" routerLink="/holidays" routerLinkActive="active">
                <i class="bi bi-calendar-x me-2"></i>Holiday Management
              </a>
              <a class="nav-link" routerLink="/teams" routerLinkActive="active">
                <i class="bi bi-people me-2"></i>Team Management
              </a>
              <a class="nav-link" routerLink="/users" routerLinkActive="active">
                <i class="bi bi-person-gear me-2"></i>User Management
              </a>
              <a class="nav-link" routerLink="/reports" routerLinkActive="active">
                <i class="bi bi-graph-up me-2"></i>Reports
              </a>
            </ng-container>

            <!-- Team Lead Navigation -->
            <ng-container *ngIf="authService.isTeamLead() && !authService.isAdmin()">
              <a class="nav-link" routerLink="/roster" routerLinkActive="active">
                <i class="bi bi-calendar3 me-2"></i>My Roster Plan
              </a>
              <a class="nav-link" routerLink="/team-rosters" routerLinkActive="active">
                <i class="bi bi-calendar-check me-2"></i>Team Members Rosters
              </a>
              <a class="nav-link" routerLink="/leaves" routerLinkActive="active">
                <i class="bi bi-calendar-event me-2"></i>Leave Management
              </a>
              <a class="nav-link" routerLink="/teams" routerLinkActive="active">
                <i class="bi bi-people me-2"></i>Team Management
              </a>
              <a class="nav-link" routerLink="/reports" routerLinkActive="active">
                <i class="bi bi-graph-up me-2"></i>Reports
              </a>
            </ng-container>

            <!-- Employee Navigation -->
            <ng-container *ngIf="authService.isEmployee() && !authService.isTeamLead() && !authService.isAdmin()">
              <a class="nav-link" routerLink="/roster" routerLinkActive="active">
                <i class="bi bi-calendar3 me-2"></i>My Roster Plan
              </a>
              <a class="nav-link" routerLink="/team-lead-roster" routerLinkActive="active">
                <i class="bi bi-calendar-check me-2"></i>Team Lead Roster
              </a>
              <a class="nav-link" routerLink="/leaves" routerLinkActive="active">
                <i class="bi bi-calendar-event me-2"></i>Leave Management
              </a>
              <a class="nav-link" routerLink="/reports" routerLinkActive="active">
                <i class="bi bi-graph-up me-2"></i>Reports
              </a>
            </ng-container>

            <!-- Profile - All Roles -->
            <a class="nav-link" routerLink="/profile" routerLinkActive="active">
              <i class="bi bi-person-circle me-2"></i>Profile
            </a>
          </nav>
        </div>
      </div>

      <!-- Main Content -->
      <div class="flex-grow-1">
        <!-- Top Navigation -->
        <nav class="navbar navbar-expand-lg navbar-light bg-white border-bottom">
          <div class="container-fluid">
            <div class="d-flex align-items-center">
              <span class="navbar-brand">WorkWise</span>
              <span class="badge bg-primary ms-2" *ngIf="(authService.currentUser$ | async)?.teamName">
                {{ (authService.currentUser$ | async)?.teamName }}
              </span>
            </div>
            <div class="ms-auto d-flex align-items-center">
              <!-- Notification Icon -->
              <div class="dropdown me-3" *ngIf="authService.isEmployee() || authService.isTeamLead()">
                <button class="btn btn-outline-secondary position-relative" type="button" data-bs-toggle="dropdown" aria-expanded="false">
                  <i class="bi bi-bell"></i>
                  <span class="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger" 
                        *ngIf="notificationService.unreadCount > 0">
                    {{ notificationService.unreadCount }}
                  </span>
                </button>
                <ul class="dropdown-menu dropdown-menu-end" style="width: 350px; max-height: 400px; overflow-y: auto;">
                  <li><h6 class="dropdown-header">Notifications</h6></li>
                  <li *ngIf="(notificationService.notifications$ | async)?.length === 0">
                    <span class="dropdown-item-text text-muted">No notifications</span>
                  </li>
                  <li *ngFor="let notification of notificationService.notifications$ | async">
                    <a class="dropdown-item" href="#" (click)="markNotificationAsRead(notification.id)">
                      <div class="d-flex w-100 justify-content-between">
                        <strong class="mb-1">{{ notification.title }}</strong>
                        <small class="text-muted">{{ notification.createdAt | date:'MMM dd' }}</small>
                      </div>
                      <p class="mb-1 small">{{ notification.message }}</p>
                      <small class="text-muted" *ngIf="!notification.isRead">New</small>
                    </a>
                  </li>
                  <li><hr class="dropdown-divider"></li>
                  <li><a class="dropdown-item" href="#" (click)="markAllNotificationsAsRead()">Mark all as read</a></li>
                </ul>
              </div>
              
              <!-- User Profile Dropdown -->
              <div class="dropdown">
                <button class="btn btn-outline-secondary dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false">
                  <i class="bi bi-person-circle me-2"></i>
                  {{ (authService.currentUser$ | async)?.firstName }} {{ (authService.currentUser$ | async)?.lastName }}
                  <span class="badge bg-primary ms-2">{{ (authService.currentUser$ | async)?.role }}</span>
                </button>
                <ul class="dropdown-menu dropdown-menu-end">
                  <li><a class="dropdown-item" routerLink="/profile">Profile</a></li>
                  <li><hr class="dropdown-divider"></li>
                  <li><a class="dropdown-item" href="#" (click)="logout()">Logout</a></li>
                </ul>
              </div>
            </div>
          </div>
        </nav>

        <!-- Page Content -->
        <div class="main-content">
          <router-outlet></router-outlet>
        </div>
      </div>
    </div>

    <!-- Login View (no navigation) -->
    <ng-template #loginView>
      <router-outlet></router-outlet>
    </ng-template>
  `
})
export class AppComponent {
  constructor(
    public authService: AuthService,
    public notificationService: NotificationService
  ) { }

  ngOnInit() {
    // Load notifications when component initializes
    if (this.authService.isLoggedIn()) {
      this.notificationService.getNotifications().subscribe();
      this.notificationService.getNotificationCount().subscribe();
    }
  }

  logout() {
    this.authService.logout();
  }

  markNotificationAsRead(notificationId: number) {
    this.notificationService.markAsRead(notificationId).subscribe();
  }

  markAllNotificationsAsRead() {
    this.notificationService.markAllAsRead().subscribe();
  }
} 