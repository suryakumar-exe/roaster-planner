import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TeamsService } from '../../services/teams.service';
import { UsersService } from '../../services/users.service';
import { RostersService } from '../../services/rosters.service';
import { LeavesService } from '../../services/leaves.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="container-fluid">
      <!-- Welcome Section -->
      <div class="row mb-4">
        <div class="col-12">
          <div class="card">
            <div class="card-body">
              <h2 class="card-title mb-2">Welcome back, {{ (authService.currentUser$ | async)?.firstName }}!</h2>
              <p class="card-text text-muted">Here's what's happening with your work schedule today.</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Stats Cards -->
      <div class="row mb-4">
        <div class="col-xl-3 col-md-6 mb-4">
          <div class="stats-card">
            <div class="d-flex justify-content-between align-items-center">
              <div>
                <div class="stats-number">{{ stats.totalWFO }}</div>
                <div class="stats-label">WFO Days</div>
              </div>
              <div class="fs-1 text-white-50">
                <i class="bi bi-building"></i>
              </div>
            </div>
          </div>
        </div>

        <div class="col-xl-3 col-md-6 mb-4">
          <div class="stats-card">
            <div class="d-flex justify-content-between align-items-center">
              <div>
                <div class="stats-number">{{ stats.totalWFH }}</div>
                <div class="stats-label">WFH Days</div>
              </div>
              <div class="fs-1 text-white-50">
                <i class="bi bi-house"></i>
              </div>
            </div>
          </div>
        </div>

        <div class="col-xl-3 col-md-6 mb-4">
          <div class="stats-card">
            <div class="d-flex justify-content-between align-items-center">
              <div>
                <div class="stats-number">{{ stats.totalLeaves }}</div>
                <div class="stats-label">Leave Days</div>
              </div>
              <div class="fs-1 text-white-50">
                <i class="bi bi-calendar-event"></i>
              </div>
            </div>
          </div>
        </div>

        <div class="col-xl-3 col-md-6 mb-4" *ngIf="authService.isTeamLead()">
          <div class="stats-card">
            <div class="d-flex justify-content-between align-items-center">
              <div>
                <div class="stats-number">{{ stats.teamMembersCount }}</div>
                <div class="stats-label">Team Members</div>
              </div>
              <div class="fs-1 text-white-50">
                <i class="bi bi-people"></i>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Quick Actions -->
      <div class="row mb-4">
        <div class="col-12">
          <div class="card">
            <div class="card-header">
              <h5 class="card-title mb-0">Quick Actions</h5>
            </div>
            <div class="card-body">
              <div class="row">
                <div class="col-md-3 mb-3">
                  <a routerLink="/roster" class="btn btn-outline-primary w-100">
                    <i class="bi bi-calendar3 me-2"></i>
                    Plan Roster
                  </a>
                </div>
                <div class="col-md-3 mb-3">
                  <a routerLink="/leaves" class="btn btn-outline-success w-100">
                    <i class="bi bi-calendar-event me-2"></i>
                    Request Leave
                  </a>
                </div>
                <div class="col-md-3 mb-3">
                  <a routerLink="/teams" class="btn btn-outline-info w-100">
                    <i class="bi bi-people me-2"></i>
                    Manage Teams
                  </a>
                </div>
                <div class="col-md-3 mb-3">
                  <a routerLink="/reports" class="btn btn-outline-warning w-100">
                    <i class="bi bi-graph-up me-2"></i>
                    View Reports
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Recent Activity -->
      <div class="row">
        <div class="col-md-6 mb-4">
          <div class="card">
            <div class="card-header">
              <h5 class="card-title mb-0">My Recent Rosters</h5>
            </div>
            <div class="card-body">
              <div *ngIf="recentRosters.length === 0" class="text-center text-muted py-4">
                <i class="bi bi-calendar3 fs-1"></i>
                <p class="mt-2">No recent rosters found</p>
              </div>
              <div *ngFor="let roster of recentRosters" class="d-flex justify-content-between align-items-center py-2 border-bottom">
                <div>
                  <strong>{{ roster.weekStartDate | date:'MMM dd' }} - {{ roster.weekEndDate | date:'MMM dd' }}</strong>
                  <div class="small text-muted">
                    {{ roster.workFromOfficeDays.length }} office days, {{ roster.workFromHomeDays.length }} home days
                  </div>
                </div>
                <span class="badge" [ngClass]="{
                  'bg-secondary': roster.status === 'Draft',
                  'bg-success': roster.status === 'Submitted',
                  'bg-danger': roster.status === 'Rejected'
                }">{{ roster.status }}</span>
              </div>
            </div>
          </div>
        </div>

        <div class="col-md-6 mb-4">
          <div class="card">
            <div class="card-header">
              <h5 class="card-title mb-0">My Recent Leave Requests</h5>
            </div>
            <div class="card-body">
              <div *ngIf="recentLeaves.length === 0" class="text-center text-muted py-4">
                <i class="bi bi-calendar-event fs-1"></i>
                <p class="mt-2">No recent leave requests</p>
              </div>
              <div *ngFor="let leave of recentLeaves" class="d-flex justify-content-between align-items-center py-2 border-bottom">
                <div>
                  <strong>{{ leave.leaveType }}</strong>
                  <div class="small text-muted">
                    {{ leave.startDate | date:'MMM dd' }} - {{ leave.endDate | date:'MMM dd' }}
                  </div>
                </div>
                <span class="badge" [ngClass]="{
                  'bg-warning': leave.status === 'Pending',
                  'bg-success': leave.status === 'Approved',
                  'bg-danger': leave.status === 'Rejected'
                }">{{ leave.status }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `
})
export class DashboardComponent implements OnInit {
  stats = {
    totalUsers: 0,
    totalTeams: 0,
    totalRosters: 0,
    totalLeaves: 0,
    totalWFO: 0,
    totalWFH: 0,
    teamMembersCount: 0
  };

  recentRosters: any[] = [];
  recentLeaves: any[] = [];

  constructor(
    private teamsService: TeamsService,
    private usersService: UsersService,
    private rostersService: RostersService,
    private leavesService: LeavesService,
    public authService: AuthService
  ) { }

  ngOnInit() {
    this.loadStats();
    this.loadRecentData();
  }

  loadStats() {
    // Load personal roster statistics
    this.rostersService.getRosters().subscribe({
      next: (response: any) => {
        // Handle both direct array response and response.data format
        const allRosters = Array.isArray(response) ? response : (response.data || []);
        const currentUser = this.authService.getCurrentUser();

        if (currentUser) {
          // Get current user's rosters
          const userRosters = allRosters.filter((roster: any) =>
            roster.userId === currentUser.id
          );

          // Calculate total WFO, WFH, and Leave days
          this.stats.totalWFO = userRosters.reduce((total: number, roster: any) =>
            total + (roster.workFromOfficeDays?.length || 0), 0
          );

          this.stats.totalWFH = userRosters.reduce((total: number, roster: any) =>
            total + (roster.workFromHomeDays?.length || 0), 0
          );

          this.stats.totalLeaves = userRosters.reduce((total: number, roster: any) =>
            total + (roster.leaveDays?.length || 0), 0
          );

          console.log('Dashboard stats loaded:', {
            totalWFO: this.stats.totalWFO,
            totalWFH: this.stats.totalWFH,
            totalLeaves: this.stats.totalLeaves,
            userRosters: userRosters.length
          });
        } else {
          this.stats.totalWFO = 0;
          this.stats.totalWFH = 0;
          this.stats.totalLeaves = 0;
        }
      },
      error: (error: any) => {
        console.error('Error loading roster statistics:', error);
        this.stats.totalWFO = 0;
        this.stats.totalWFH = 0;
        this.stats.totalLeaves = 0;
      }
    });

    // Load team members count if user is a team lead
    if (this.authService.isTeamLead()) {
      const currentUser = this.authService.getCurrentUser();
      if (currentUser && currentUser.teamId) {
        this.usersService.getUsers().subscribe({
          next: (response: any) => {
            // Handle both direct array response and response.data format
            const allUsers = Array.isArray(response) ? response : (response.data || []);
            // Count users in the same team with role 'Employee' (excluding the team lead)
            this.stats.teamMembersCount = allUsers.filter((user: any) =>
              user.teamId === currentUser.teamId &&
              user.role === 'Employee' &&
              user.id !== currentUser.id
            ).length;
          },
          error: (error: any) => {
            console.error('Error loading team members count:', error);
            this.stats.teamMembersCount = 0;
          }
        });
      } else {
        this.stats.teamMembersCount = 0;
      }
    } else {
      this.stats.teamMembersCount = 0;
    }
  }

  loadRecentData() {
    // Load recent rosters for current user
    this.rostersService.getRosters().subscribe({
      next: (response: any) => {
        // Handle both direct array response and response.data format
        const allRosters = Array.isArray(response) ? response : (response.data || []);
        const currentUser = this.authService.getCurrentUser();

        if (currentUser) {
          // Filter rosters by current user
          const userRosters = allRosters.filter((roster: any) =>
            roster.userId === currentUser.id
          );

          // Sort by most recent (newest first) and take first 5
          this.recentRosters = userRosters
            .sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
            .slice(0, 5);
        } else {
          this.recentRosters = [];
        }
      },
      error: (error: any) => {
        console.error('Error loading recent rosters:', error);
      }
    });

    // Load recent leaves for current user
    this.leavesService.getLeaves().subscribe({
      next: (response: any) => {
        // Handle both direct array response and response.data format
        const allLeaves = Array.isArray(response) ? response : (response.data || []);
        const currentUser = this.authService.getCurrentUser();

        if (currentUser) {
          // Filter leaves by current user
          const userLeaves = allLeaves.filter((leave: any) =>
            leave.userId === currentUser.id
          );

          // Sort by most recent (newest first) and take first 5
          this.recentLeaves = userLeaves
            .sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
            .slice(0, 5);
        } else {
          this.recentLeaves = [];
        }
      },
      error: (error: any) => {
        console.error('Error loading recent leaves:', error);
      }
    });
  }
} 