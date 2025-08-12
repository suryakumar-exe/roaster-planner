import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TeamsService } from '../../../services/teams.service';
import { UsersService } from '../../../services/users.service';
import { RostersService } from '../../../services/rosters.service';
import { LeavesService } from '../../../services/leaves.service';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-compliance-report',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="container-fluid">
      <!-- Header -->
      <div class="row mb-4">
        <div class="col-12">
          <h2>Reports & Analytics</h2>
          <p class="text-muted">{{ getRoleSpecificMessage() }}</p>
        </div>
      </div>

      <!-- Employee View - Simplified Reports -->
      <div class="row" *ngIf="isEmployeeView()">
        <!-- Leave Request Statistics -->
        <div class="col-lg-6 mb-4">
          <div class="card">
            <div class="card-header">
              <h5 class="card-title mb-0">Leave Request Statistics</h5>
            </div>
            <div class="card-body">
              <div class="row text-center">
                <div class="col-4">
                  <div class="border-end">
                    <h4 class="text-primary mb-0">{{ leaveStats.total }}</h4>
                    <small class="text-muted">Total Leaves</small>
                  </div>
                </div>
                <div class="col-4">
                  <div class="border-end">
                    <h4 class="text-success mb-0">{{ leaveStats.approved }}</h4>
                    <small class="text-muted">Approved</small>
                  </div>
                </div>
                <div class="col-4">
                  <h4 class="text-warning mb-0">{{ leaveStats.pending }}</h4>
                  <small class="text-muted">Pending</small>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Work Pattern Analysis -->
        <div class="col-lg-6 mb-4">
          <div class="card">
            <div class="card-header">
              <h5 class="card-title mb-0">Work Pattern Analysis</h5>
            </div>
            <div class="card-body">
              <div class="row text-center">
                <div class="col-4">
                  <div class="border-end">
                    <h4 class="text-primary mb-0">{{ workPatternStats.wfoDays }}</h4>
                    <small class="text-muted">WFO Days</small>
                  </div>
                </div>
                <div class="col-4">
                  <div class="border-end">
                    <h4 class="text-success mb-0">{{ workPatternStats.wfhDays }}</h4>
                    <small class="text-muted">WFH Days</small>
                  </div>
                </div>
                <div class="col-4">
                  <h4 class="text-info mb-0">{{ workPatternStats.complianceRate }}%</h4>
                  <small class="text-muted">Compliance</small>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Admin/Team Lead View - Full Reports -->
      <div class="row" *ngIf="!isEmployeeView()">
        <!-- Summary Statistics -->
        <div class="col-lg-3 col-md-6 mb-4">
          <div class="card bg-primary text-white">
            <div class="card-body">
              <div class="d-flex justify-content-between">
                <div>
                  <h4 class="mb-0">{{ summaryStats.totalEmployees }}</h4>
                  <small>Total Employees</small>
                </div>
                <i class="bi bi-people fs-1"></i>
              </div>
            </div>
          </div>
        </div>

        <div class="col-lg-3 col-md-6 mb-4">
          <div class="card bg-success text-white">
            <div class="card-body">
              <div class="d-flex justify-content-between">
                <div>
                  <h4 class="mb-0">{{ summaryStats.compliantEmployees }}</h4>
                  <small>Compliant</small>
                </div>
                <i class="bi bi-check-circle fs-1"></i>
              </div>
            </div>
          </div>
        </div>

        <div class="col-lg-3 col-md-6 mb-4">
          <div class="card bg-warning text-white">
            <div class="card-body">
              <div class="d-flex justify-content-between">
                <div>
                  <h4 class="mb-0">{{ summaryStats.pendingApprovals }}</h4>
                  <small>Pending Approval</small>
                </div>
                <i class="bi bi-clock fs-1"></i>
              </div>
            </div>
          </div>
        </div>

        <div class="col-lg-3 col-md-6 mb-4">
          <div class="card bg-info text-white">
            <div class="card-body">
              <div class="d-flex justify-content-between">
                <div>
                  <h4 class="mb-0">{{ summaryStats.complianceRate }}%</h4>
                  <small>Compliance Rate</small>
                </div>
                <i class="bi bi-graph-up fs-1"></i>
              </div>
            </div>
          </div>
        </div>

        <!-- Team Compliance Overview -->
        <div class="col-lg-8 mb-4">
          <div class="card">
            <div class="card-header">
              <h5 class="card-title mb-0">Team Compliance Overview</h5>
            </div>
            <div class="card-body">
              <div class="table-responsive">
                <table class="table">
                  <thead>
                    <tr>
                      <th>Team</th>
                      <th>Members</th>
                      <th>Compliant</th>
                      <th>Progress</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr *ngFor="let team of teamCompliance">
                      <td>{{ team.name }}</td>
                      <td>{{ team.totalMembers }}</td>
                      <td>{{ team.compliantMembers }}</td>
                      <td>
                        <div class="progress">
                          <div class="progress-bar" [style.width.%]="team.complianceRate"></div>
                        </div>
                        <small>{{ team.complianceRate }}%</small>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>

        <!-- Leave Statistics -->
        <div class="col-lg-4 mb-4">
          <div class="card">
            <div class="card-header">
              <h5 class="card-title mb-0">Leave Statistics</h5>
            </div>
            <div class="card-body">
              <div class="mb-3">
                <div class="d-flex justify-content-between">
                  <span>Total Requests</span>
                  <span class="fw-bold">{{ leaveStats.total }}</span>
                </div>
              </div>
              <div class="mb-3">
                <div class="d-flex justify-content-between">
                  <span>Approved</span>
                  <span class="fw-bold text-success">{{ leaveStats.approved }}</span>
                </div>
              </div>
              <div class="mb-3">
                <div class="d-flex justify-content-between">
                  <span>Pending</span>
                  <span class="fw-bold text-warning">{{ leaveStats.pending }}</span>
                </div>
              </div>
              <div class="mb-3">
                <div class="d-flex justify-content-between">
                  <span>Rejected</span>
                  <span class="fw-bold text-danger">{{ leaveStats.rejected }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Work Pattern Analysis -->
        <div class="col-12 mb-4">
          <div class="card">
            <div class="card-header">
              <h5 class="card-title mb-0">Work Pattern Analysis</h5>
            </div>
            <div class="card-body">
              <div class="row">
                <div class="col-md-3 text-center">
                  <h4 class="text-primary">{{ workPatternStats.wfoDays }}</h4>
                  <p class="text-muted">Average WFO Days</p>
                </div>
                <div class="col-md-3 text-center">
                  <h4 class="text-success">{{ workPatternStats.wfhDays }}</h4>
                  <p class="text-muted">Average WFH Days</p>
                </div>
                <div class="col-md-3 text-center">
                  <h4 class="text-warning">{{ workPatternStats.leaveDays }}</h4>
                  <p class="text-muted">Average Leave Days</p>
                </div>
                <div class="col-md-3 text-center">
                  <h4 class="text-info">{{ workPatternStats.complianceRate }}%</h4>
                  <p class="text-muted">Overall Compliance</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
        </div>
    `,
  styles: [`
    .border-left-primary {
      border-left: 0.25rem solid #4e73df !important;
    }
    .border-left-success {
      border-left: 0.25rem solid #1cc88a !important;
    }
    .border-left-info {
      border-left: 0.25rem solid #36b9cc !important;
    }
    .border-left-warning {
      border-left: 0.25rem solid #f6c23e !important;
    }
    .text-gray-300 {
      color: #dddfeb !important;
    }
    .text-gray-800 {
      color: #5a5c69 !important;
        }
    `]
})
export class ComplianceReportComponent implements OnInit {
  summary = {
    totalUsers: 0,
    activeTeams: 0,
    activeRosters: 0,
    pendingLeaves: 0
  };

  teams: any[] = [];
  users: any[] = [];
  rosters: any[] = [];
  leaves: any[] = [];

  leaveStats = {
    total: 0,
    pending: 0,
    approved: 0,
    rejected: 0
  };

  workPatterns = {
    avgOfficeDays: 0,
    avgHomeDays: 0,
    hybridAdoption: 0
  };

  summaryStats = {
    totalEmployees: 0,
    compliantEmployees: 0,
    pendingApprovals: 0,
    complianceRate: 0
  };

  workPatternStats = {
    wfoDays: 0,
    wfhDays: 0,
    leaveDays: 0,
    complianceRate: 0
  };

  teamCompliance: any[] = [];

  constructor(
    private teamsService: TeamsService,
    private usersService: UsersService,
    private rostersService: RostersService,
    private leavesService: LeavesService,
    public authService: AuthService
  ) { }

  ngOnInit() {
    this.loadData();
  }

  isEmployeeView(): boolean {
    return this.authService.isEmployee() && !this.authService.isTeamLead() && !this.authService.isAdmin();
  }

  loadData() {
    this.loadTeams();
    this.loadUsers();
    this.loadRosters();
    this.loadLeaves();
  }

  loadTeams() {
    this.teamsService.getTeams().subscribe({
      next: (response: any) => {
        // Handle both direct array response and response.data format
        this.teams = Array.isArray(response) ? response : (response.data || []);
        this.summaryStats.totalEmployees = this.teams.length;
      }
    });
  }

  loadUsers() {
    this.usersService.getUsers().subscribe({
      next: (response: any) => {
        // Handle both direct array response and response.data format
        this.users = Array.isArray(response) ? response : (response.data || []);
        this.summaryStats.totalEmployees = this.users.length;
      }
    });
  }

  loadRosters() {
    this.rostersService.getRosters().subscribe({
      next: (response: any) => {
        // Handle both direct array response and response.data format
        this.rosters = Array.isArray(response) ? response : (response.data || []);
        this.summaryStats.totalEmployees = this.rosters.length;
        this.calculateWorkPatterns();
      }
    });
  }

  loadLeaves() {
    this.leavesService.getLeaves().subscribe({
      next: (response: any) => {
        // Handle both direct array response and response.data format
        this.leaves = Array.isArray(response) ? response : (response.data || []);
        this.calculateLeaveStats();
      }
    });
  }

  calculateLeaveStats() {
    this.leaveStats.total = this.leaves.length;
    this.leaveStats.pending = this.leaves.filter(l => l.status === 'Pending').length;
    this.leaveStats.approved = this.leaves.filter(l => l.status === 'Approved').length;
    this.leaveStats.rejected = this.leaves.filter(l => l.status === 'Rejected').length;
    this.summaryStats.pendingApprovals = this.leaveStats.pending;
  }

  calculateWorkPatterns() {
    if (this.rosters.length === 0) return;

    const totalOfficeDays = this.rosters.reduce((sum, roster) =>
      sum + roster.workFromOfficeDays.length, 0);
    const totalHomeDays = this.rosters.reduce((sum, roster) =>
      sum + roster.workFromHomeDays.length, 0);

    this.workPatternStats.wfoDays = Math.round(totalOfficeDays / this.rosters.length);
    this.workPatternStats.wfhDays = Math.round(totalHomeDays / this.rosters.length);
    this.workPatternStats.leaveDays = Math.round(this.leaves.length / this.users.length);
    this.workPatternStats.complianceRate = Math.round((this.rosters.length / this.users.length) * 100);
  }

  getRoleSpecificMessage(): string {
    if (this.authService.isEmployee()) {
      return 'View your personal leave requests and work patterns.';
    } else if (this.authService.isTeamLead()) {
      return 'View team compliance and work patterns across your team.';
    } else if (this.authService.isAdmin()) {
      return 'View comprehensive reports on team compliance and work patterns.';
    }
    return '';
  }

  getTeamMemberCount(teamId: number): number {
    return this.users.filter(user => user.teamId === teamId).length;
  }

  getTeamRosterCount(teamId: number): number {
    return this.rosters.filter(roster => roster.userId &&
      this.users.find(u => u.id === roster.userId)?.teamId === teamId).length;
  }

  getComplianceRate(teamId: number): number {
    const teamMembers = this.users.filter(user => user.teamId === teamId);
    const teamRosters = this.rosters.filter(roster => roster.userId &&
      this.users.find(u => u.id === roster.userId)?.teamId === teamId);

    if (teamMembers.length === 0) return 0;
    return Math.round((teamRosters.length / teamMembers.length) * 100);
  }

  getComplianceStatus(teamId: number): string {
    const rate = this.getComplianceRate(teamId);
    if (rate >= 80) return 'Excellent';
    if (rate >= 60) return 'Good';
    return 'Needs Attention';
  }
} 