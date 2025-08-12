import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RostersService } from '../../../services/rosters.service';
import { AuthService } from '../../../services/auth.service';
import { ToastrService } from 'ngx-toastr';
import { Roster } from '../../../models/roster';

@Component({
  selector: 'app-team-rosters',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="container-fluid">
      <!-- Header -->
      <div class="row mb-4">
        <div class="col-12">
          <div class="d-flex justify-content-between align-items-center">
            <div>
              <h2>Team Members Rosters</h2>
              <p class="text-muted mb-0">View and monitor your team members' roster submissions</p>
            </div>
            <div class="d-flex gap-2">
              <button class="btn btn-outline-secondary" (click)="previousWeek()">
                <i class="bi bi-chevron-left"></i> Previous
              </button>
              <button class="btn btn-outline-primary" (click)="currentWeek()">
                This Week
              </button>
              <button class="btn btn-outline-secondary" (click)="nextWeek()">
                Next <i class="bi bi-chevron-right"></i>
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Team Members Rosters Table -->
      <div class="row">
        <div class="col-12">
          <div class="card">
            <div class="card-header">
              <h5 class="card-title mb-0">
                Week of {{ weekStartDate | date:'MMM dd, yyyy' }} - {{ weekEndDate | date:'MMM dd, yyyy' }}
                <span *ngIf="authService.getCurrentUser()?.teamName" class="badge bg-secondary ms-2">
                  {{ authService.getCurrentUser()?.teamName }} Team
                </span>
              </h5>
            </div>
            <div class="card-body">
              <div class="table-responsive">
                <table class="table table-striped">
                  <thead>
                    <tr>
                      <th>Employee</th>
                      <th>WFO Days</th>
                      <th>WFH Days</th>
                      <th>Leave Days</th>
                      <th>Submitted</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr *ngFor="let memberRoster of teamMemberRosters">
                      <td>
                        <div>
                          <strong>{{ memberRoster.userName }}</strong>
                          <br>
                          <small class="text-muted">{{ memberRoster.email }}</small>
                        </div>
                      </td>
                      <td>
                        <span class="badge bg-primary me-1" *ngFor="let day of memberRoster.workFromOfficeDays">
                          {{ day | date:'EEE' }}
                        </span>
                      </td>
                      <td>
                        <span class="badge bg-success me-1" *ngFor="let day of memberRoster.workFromHomeDays">
                          {{ day | date:'EEE' }}
                        </span>
                      </td>
                      <td>
                        <span class="badge bg-warning me-1" *ngFor="let day of memberRoster.leaveDays">
                          {{ day | date:'EEE' }}
                        </span>
                        <span *ngIf="memberRoster.leaveDays.length === 0" class="text-muted">None</span>
                      </td>
                      <td>
                        <span *ngIf="memberRoster.submittedAt" class="text-muted">
                          {{ memberRoster.submittedAt | date:'MMM dd, HH:mm' }}
                        </span>
                        <span *ngIf="!memberRoster.submittedAt" class="text-muted">Not submitted</span>
                      </td>
                      <td>
                        <button class="btn btn-sm btn-outline-primary" (click)="viewMemberRoster(memberRoster)">
                          <i class="bi bi-eye"></i> View Details
                        </button>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
              
              <div *ngIf="teamMemberRosters.length === 0" class="text-center text-muted py-5">
                <i class="bi bi-people fs-1"></i>
                <h5 class="mt-3">No team member rosters found</h5>
                <p>No team members have submitted rosters for this week yet.</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Summary Statistics -->
      <div class="row mt-4">
        <div class="col-md-3">
          <div class="card bg-primary text-white">
            <div class="card-body">
              <div class="d-flex justify-content-between">
                <div>
                  <h4 class="mb-0">{{ teamMemberRosters.length }}</h4>
                  <small>Total Team Members</small>
                </div>
                <i class="bi bi-people fs-1"></i>
              </div>
            </div>
          </div>
        </div>
        <div class="col-md-3">
          <div class="card bg-success text-white">
            <div class="card-body">
              <div class="d-flex justify-content-between">
                <div>
                  <h4 class="mb-0">{{ submittedCount }}</h4>
                  <small>Submitted</small>
                </div>
                <i class="bi bi-check-circle fs-1"></i>
              </div>
            </div>
          </div>
        </div>
        <div class="col-md-3">
          <div class="card bg-warning text-white">
            <div class="card-body">
              <div class="d-flex justify-content-between">
                <div>
                  <h4 class="mb-0">{{ draftCount }}</h4>
                  <small>Draft</small>
                </div>
                <i class="bi bi-pencil fs-1"></i>
              </div>
            </div>
          </div>
        </div>
        <div class="col-md-3">
          <div class="card bg-info text-white">
            <div class="card-body">
              <div class="d-flex justify-content-between">
                <div>
                  <h4 class="mb-0">{{ submissionRate }}%</h4>
                  <small>Submission Rate</small>
                </div>
                <i class="bi bi-graph-up fs-1"></i>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `
})
export class TeamRostersComponent implements OnInit {
  teamMemberRosters: Roster[] = [];
  weekStartDate: Date = new Date();
  weekEndDate: Date = new Date();

  constructor(
    private rostersService: RostersService,
    public authService: AuthService,
    private toastr: ToastrService
  ) {
    this.initializeWeek();
  }

  ngOnInit() {
    this.loadTeamMemberRosters();
  }

  initializeWeek() {
    const today = new Date();
    const dayOfWeek = today.getDay();
    const diff = today.getDate() - dayOfWeek + (dayOfWeek === 0 ? -6 : 1);

    this.weekStartDate = new Date(today.setDate(diff));
    this.weekEndDate = new Date(this.weekStartDate);
    this.weekEndDate.setDate(this.weekStartDate.getDate() + 6);
  }

  loadTeamMemberRosters() {
    const weekStart = this.weekStartDate.toISOString().split('T')[0];
    const currentUser = this.authService.getCurrentUser();

    if (!currentUser || !currentUser.teamId) {
      this.toastr.error('Team information not found');
      return;
    }

    this.rostersService.getRosters().subscribe({
      next: (response: any) => {
        // Handle both direct array response and response.data format
        const allRosters = Array.isArray(response) ? response : (response.data || []);
        // Filter rosters for current week, only Employee rosters from the same team
        this.teamMemberRosters = allRosters.filter((roster: Roster) =>
          roster.weekStartDate === weekStart &&
          roster.userId !== currentUser.id &&
          roster.role === 'Employee' && // Only show Employee rosters
          roster.teamId === currentUser.teamId // Only show rosters from the same team
        );
      },
      error: (error: any) => {
        console.error('Error loading team member rosters:', error);
        this.toastr.error('Failed to load team member rosters');
      }
    });
  }

  get submittedCount(): number {
    return this.teamMemberRosters.filter(r => r.status === 'Submitted').length;
  }

  get draftCount(): number {
    return this.teamMemberRosters.filter(r => r.status === 'Draft').length;
  }

  get submissionRate(): number {
    if (this.teamMemberRosters.length === 0) return 0;
    return Math.round((this.submittedCount / this.teamMemberRosters.length) * 100);
  }

  viewMemberRoster(roster: Roster) {
    this.toastr.info(`Viewing ${roster.userName}'s roster details`);
    // You can implement a modal or navigation to view detailed roster
  }

  previousWeek() {
    // Create new Date objects for proper change detection
    const newWeekStart = new Date(this.weekStartDate);
    newWeekStart.setDate(this.weekStartDate.getDate() - 7);
    this.weekStartDate = newWeekStart;

    const newWeekEnd = new Date(this.weekEndDate);
    newWeekEnd.setDate(this.weekEndDate.getDate() - 7);
    this.weekEndDate = newWeekEnd;

    this.loadTeamMemberRosters();
  }

  nextWeek() {
    // Create new Date objects for proper change detection
    const newWeekStart = new Date(this.weekStartDate);
    newWeekStart.setDate(this.weekStartDate.getDate() + 7);
    this.weekStartDate = newWeekStart;

    const newWeekEnd = new Date(this.weekEndDate);
    newWeekEnd.setDate(this.weekEndDate.getDate() + 7);
    this.weekEndDate = newWeekEnd;

    this.loadTeamMemberRosters();
  }

  currentWeek() {
    this.initializeWeek();
    this.loadTeamMemberRosters();
  }
} 