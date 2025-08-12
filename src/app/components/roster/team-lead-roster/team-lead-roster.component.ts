import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RostersService } from '../../../services/rosters.service';
import { TeamsService } from '../../../services/teams.service';
import { AuthService } from '../../../services/auth.service';
import { ToastrService } from 'ngx-toastr';
import { Roster } from '../../../models/roster';

@Component({
  selector: 'app-team-lead-roster',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="container-fluid">
      <!-- Header -->
      <div class="row mb-4">
        <div class="col-12">
          <div class="d-flex justify-content-between align-items-center">
            <div>
              <h2>Team Lead Roster</h2>
              <p class="text-muted mb-0">View your team lead's roster for the week</p>
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

      <!-- Team Lead Roster Display -->
      <div class="row">
        <div class="col-12">
          <div class="card">
            <div class="card-header">
              <h5 class="card-title mb-0">Week of {{ weekStartDate | date:'MMM dd, yyyy' }} - {{ weekEndDate | date:'MMM dd, yyyy' }}</h5>
            </div>
            <div class="card-body">
              <div *ngIf="teamLeadRoster" class="row">
                <div class="col-md-6">
                  <h6>Team Lead: {{ teamLeadRoster.userName }}</h6>
                  <p class="text-muted">{{ teamLeadRoster.email }}</p>
                  <p class="text-muted" *ngIf="currentUserTeamName">Team: {{ currentUserTeamName }}</p>
                  
                  <div class="mb-3">
                    <strong>Status:</strong>
                    <span class="badge ms-2" 
                          [class.bg-secondary]="teamLeadRoster.status === 'Draft'"
                          [class.bg-warning]="teamLeadRoster.status === 'Submitted'"
                          [class.bg-success]="teamLeadRoster.status === 'Approved'"
                          [class.bg-danger]="teamLeadRoster.status === 'Rejected'">
                      {{ teamLeadRoster.status }}
                    </span>
                  </div>

                  <div class="mb-3">
                    <strong>Work From Office Days:</strong>
                    <div class="mt-2">
                      <span class="badge bg-primary me-2 mb-2" *ngFor="let day of teamLeadRoster.workFromOfficeDays">
                        {{ day | date:'EEEE, MMM dd' }}
                      </span>
                    </div>
                  </div>

                  <div class="mb-3">
                    <strong>Work From Home Days:</strong>
                    <div class="mt-2">
                      <span class="badge bg-success me-2 mb-2" *ngFor="let day of teamLeadRoster.workFromHomeDays">
                        {{ day | date:'EEEE, MMM dd' }}
                      </span>
                    </div>
                  </div>

                  <div class="mb-3" *ngIf="teamLeadRoster.leaveDays.length > 0">
                    <strong>Leave Days:</strong>
                    <div class="mt-2">
                      <span class="badge bg-warning me-2 mb-2" *ngFor="let day of teamLeadRoster.leaveDays">
                        {{ day | date:'EEEE, MMM dd' }}
                      </span>
                    </div>
                  </div>
                </div>

                <div class="col-md-6">
                  <div class="card bg-light">
                    <div class="card-body">
                      <h6>Schedule Summary</h6>
                      <div class="row text-center">
                        <div class="col-4">
                          <div class="border-end">
                            <h4 class="text-primary mb-0">{{ teamLeadRoster.workFromOfficeDays.length }}</h4>
                            <small class="text-muted">WFO Days</small>
                          </div>
                        </div>
                        <div class="col-4">
                          <div class="border-end">
                            <h4 class="text-success mb-0">{{ teamLeadRoster.workFromHomeDays.length }}</h4>
                            <small class="text-muted">WFH Days</small>
                          </div>
                        </div>
                        <div class="col-4">
                          <h4 class="text-warning mb-0">{{ teamLeadRoster.leaveDays.length }}</h4>
                          <small class="text-muted">Leave Days</small>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div class="mt-3">
                    <small class="text-muted">
                      <div *ngIf="teamLeadRoster.submittedAt">
                        <strong>Submitted:</strong> {{ teamLeadRoster.submittedAt | date:'MMM dd, yyyy HH:mm' }}
                      </div>
                      <div *ngIf="teamLeadRoster.approvedAt">
                        <strong>Approved:</strong> {{ teamLeadRoster.approvedAt | date:'MMM dd, yyyy HH:mm' }}
                      </div>
                    </small>
                  </div>
                </div>
              </div>

              <div *ngIf="!teamLeadRoster && !loading" class="text-center text-muted py-5">
                <i class="bi bi-person-x fs-1"></i>
                <h5 class="mt-3">No Team Lead Roster Found</h5>
                <p>Your team lead hasn't submitted a roster for this week yet.</p>
              </div>

              <div *ngIf="loading" class="text-center py-5">
                <div class="spinner-border text-primary" role="status">
                  <span class="visually-hidden">Loading...</span>
                </div>
                <p class="mt-2">Loading team lead roster...</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `
})
export class TeamLeadRosterComponent implements OnInit {
  teamLeadRoster: Roster | null = null;
  weekStartDate: Date = new Date();
  weekEndDate: Date = new Date();
  currentUserTeamName: string | null = null;
  loading: boolean = false;

  constructor(
    private rostersService: RostersService,
    private teamsService: TeamsService,
    public authService: AuthService,
    private toastr: ToastrService
  ) {
    this.initializeWeek();
  }

  ngOnInit() {
    this.loadTeamLeadRoster();
  }

  initializeWeek() {
    const today = new Date();
    const dayOfWeek = today.getDay();
    const diff = today.getDate() - dayOfWeek + (dayOfWeek === 0 ? -6 : 1);

    this.weekStartDate = new Date(today.setDate(diff));
    this.weekEndDate = new Date(this.weekStartDate);
    this.weekEndDate.setDate(this.weekStartDate.getDate() + 6);
  }

  loadTeamLeadRoster() {
    this.loading = true;
    const currentUser = this.authService.getCurrentUser();

    if (!currentUser) {
      this.toastr.error('User not found');
      this.loading = false;
      return;
    }

    // First, get the current user's team information
    this.teamsService.getTeams().subscribe({
      next: (teamsResponse: any) => {
        // Handle both direct array response and response.data format
        const teams = Array.isArray(teamsResponse) ? teamsResponse : (teamsResponse.data || []);
        const userTeam = teams.find((team: any) => team.id === currentUser.teamId);

        if (userTeam) {
          this.currentUserTeamName = userTeam.name;
          console.log('User team found:', userTeam.name);
        } else {
          console.log('User has no team assigned');
          this.loading = false;
          return;
        }

        // Now get all rosters and find the team lead for this specific team
        const weekStart = this.weekStartDate.toISOString().split('T')[0];
        this.rostersService.getRosters().subscribe({
          next: (response: any) => {
            // Handle both direct array response and response.data format
            const allRosters = Array.isArray(response) ? response : (response.data || []);
            console.log('All rosters:', allRosters);

            // Find team lead roster for the current user's team and week
            this.teamLeadRoster = allRosters.find((roster: Roster) =>
              roster.weekStartDate === weekStart &&
              roster.role === 'TeamLead' &&
              roster.teamId === currentUser.teamId
            ) || null;

            console.log('Found team lead roster:', this.teamLeadRoster);
            this.loading = false;
          },
          error: (error: any) => {
            console.error('Error loading rosters:', error);
            this.toastr.error('Failed to load team lead roster');
            this.loading = false;
          }
        });
      },
      error: (error: any) => {
        console.error('Error loading teams:', error);
        this.toastr.error('Failed to load team information');
        this.loading = false;
      }
    });
  }

  previousWeek() {
    const newWeekStart = new Date(this.weekStartDate);
    newWeekStart.setDate(this.weekStartDate.getDate() - 7);
    this.weekStartDate = newWeekStart;

    const newWeekEnd = new Date(this.weekEndDate);
    newWeekEnd.setDate(this.weekEndDate.getDate() - 7);
    this.weekEndDate = newWeekEnd;

    this.loadTeamLeadRoster();
  }

  nextWeek() {
    const newWeekStart = new Date(this.weekStartDate);
    newWeekStart.setDate(this.weekStartDate.getDate() + 7);
    this.weekStartDate = newWeekStart;

    const newWeekEnd = new Date(this.weekEndDate);
    newWeekEnd.setDate(this.weekEndDate.getDate() + 7);
    this.weekEndDate = newWeekEnd;

    this.loadTeamLeadRoster();
  }

  currentWeek() {
    this.initializeWeek();
    this.loadTeamLeadRoster();
  }
} 