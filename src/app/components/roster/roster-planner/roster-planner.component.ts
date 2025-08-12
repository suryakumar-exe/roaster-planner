import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RostersService } from '../../../services/rosters.service';
import { HolidaysService } from '../../../services/holidays.service';
import { LeavesService } from '../../../services/leaves.service';
import { AuthService } from '../../../services/auth.service';
import { ToastrService } from 'ngx-toastr';
import { Roster, CreateRosterRequest } from '../../../models/roster';
import { PublicHoliday } from '../../../models/holiday';

@Component({
  selector: 'app-roster-planner',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="container-fluid">
      <!-- Header -->
      <div class="row mb-4">
        <div class="col-12">
          <div class="d-flex justify-content-between align-items-center">
            <div>
              <h2>Roster Planner</h2>
              <p class="text-muted mb-0">
                {{ getRoleSpecificMessage() }}
              </p>
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

      <!-- Admin View: All Rosters -->
      <div class="row mb-4" *ngIf="authService.isAdmin()">
        <div class="col-12">
          <div class="card">
            <div class="card-header">
              <h5 class="card-title mb-0">All Employee Rosters</h5>
            </div>
            <div class="card-body">
              <div class="table-responsive">
                <table class="table table-striped">
                  <thead>
                    <tr>
                      <th>Employee</th>
                      <th>Team</th>
                      <th>WFO Days</th>
                      <th>WFH Days</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr *ngFor="let allRoster of allRosters">
                      <td>{{ allRoster.userName }}</td>
                      <td>{{ allRoster.teamName }}</td>
                      <td>
                        <span class="badge bg-primary me-1" *ngFor="let day of allRoster.workFromOfficeDays">
                          {{ day | date:'EEE' }}
                        </span>
                      </td>
                      <td>
                        <span class="badge bg-success me-1" *ngFor="let day of allRoster.workFromHomeDays">
                          {{ day | date:'EEE' }}
                        </span>
                      </td>
                      <td>
                        <span class="badge" 
                              [class.bg-secondary]="allRoster.status === 'Draft'"
                              [class.bg-warning]="allRoster.status === 'Submitted'"
                              [class.bg-success]="allRoster.status === 'Approved'"
                              [class.bg-danger]="allRoster.status === 'Rejected'">
                          {{ allRoster.status }}
                        </span>
                      </td>
                      <td>
                        <div class="btn-group">
                          <button class="btn btn-sm btn-outline-primary" (click)="viewAllRoster(allRoster)">
                            <i class="bi bi-eye"></i> View
                          </button>
                          <button class="btn btn-sm btn-outline-success" 
                                  (click)="approveRoster(allRoster.id)"
                                  *ngIf="allRoster.status === 'Submitted'">
                            <i class="bi bi-check"></i> Approve
                          </button>
                          <button class="btn btn-sm btn-outline-danger" 
                                  (click)="rejectRoster(allRoster.id)"
                                  *ngIf="allRoster.status === 'Submitted'">
                            <i class="bi bi-x"></i> Reject
                          </button>
                        </div>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <div *ngIf="allRosters.length === 0" class="text-center text-muted py-4">
                <i class="bi bi-calendar3 fs-1"></i>
                <p class="mt-2">No rosters found for this week</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- My Roster Section -->
      <div class="row mb-4">
        <div class="col-12">
          <div class="card">
            <div class="card-header">
              <h5 class="card-title mb-0">My Roster - Week of {{ weekStartDate | date:'MMM dd, yyyy' }} - {{ weekEndDate | date:'MMM dd, yyyy' }}</h5>
            </div>
            <div class="card-body">
              <!-- Loading Indicator -->
              <div class="row mb-3" *ngIf="isLoading">
                <div class="col-12 text-center">
                  <div class="spinner-border text-primary" role="status">
                    <span class="visually-hidden">Loading...</span>
                  </div>
                  <p class="mt-2">Loading roster data...</p>
                </div>
              </div>
              
              <!-- Roster Summary Section -->
              <div class="row mb-4">
                <div class="col-12">
                  <div class="card border-primary">
                    <div class="card-header bg-primary text-white">
                      <div class="d-flex justify-content-between align-items-center">
                        <h6 class="mb-0"><i class="bi bi-calendar-check me-2"></i>My Roster Summary</h6>
                        <small class="text-white-50">{{ getRosterSummaryText() }}</small>
                      </div>
                    </div>
                    <div class="card-body">
                      <!-- Progress Indicators -->
                      <div class="row mb-3">
                        <div class="col-md-4 text-center">
                          <div class="progress mb-2" style="height: 25px;">
                            <div class="progress-bar bg-primary" 
                                 [style.width.%]="(workFromOfficeDays.length / getRequiredWFO()) * 100"
                                 role="progressbar">
                              {{ workFromOfficeDays.length }}/{{ getRequiredWFO() }}
                            </div>
                          </div>
                          <strong class="text-primary">Work From Office</strong>
                        </div>
                        <div class="col-md-4 text-center" *ngIf="getRequiredWFH() > 0">
                          <div class="progress mb-2" style="height: 25px;">
                            <div class="progress-bar bg-success" 
                                 [style.width.%]="(workFromHomeDays.length / getRequiredWFH()) * 100"
                                 role="progressbar">
                              {{ workFromHomeDays.length }}/{{ getRequiredWFH() }}
                            </div>
                          </div>
                          <strong class="text-success">Work From Home</strong>
                        </div>
                        <div class="col-md-4 text-center">
                          <div class="progress mb-2" style="height: 25px;">
                            <div class="progress-bar bg-warning" 
                                 [style.width.%]="(leaveDays.length / 5) * 100"
                                 role="progressbar">
                              {{ leaveDays.length }} Days
                            </div>
                          </div>
                          <strong class="text-warning">Leave Days</strong>
                        </div>
                      </div>

                      <!-- Detailed Breakdown -->
                      <div class="row">
                        <!-- Work From Office Days -->
                        <div class="col-md-4">
                          <div class="card border-primary">
                            <div class="card-header bg-primary text-white py-2">
                              <small><i class="bi bi-building me-1"></i>Work From Office ({{ workFromOfficeDays.length }})</small>
                            </div>
                            <div class="card-body p-2">
                              <div *ngIf="workFromOfficeDays.length === 0" class="text-muted small">
                                No WFO days selected
                              </div>
                              <div *ngFor="let day of workFromOfficeDays" class="mb-1">
                                <span class="badge bg-primary">{{ day | date:'EEE, MMM dd' }}</span>
                              </div>
                            </div>
                          </div>
                        </div>

                        <!-- Work From Home Days -->
                        <div class="col-md-4">
                          <div class="card border-success">
                            <div class="card-header bg-success text-white py-2">
                              <small><i class="bi bi-house me-1"></i>Work From Home ({{ workFromHomeDays.length }})</small>
                            </div>
                            <div class="card-body p-2">
                              <div *ngIf="workFromHomeDays.length === 0" class="text-muted small">
                                No WFH days selected
                              </div>
                              <div *ngFor="let day of workFromHomeDays" class="mb-1">
                                <span class="badge bg-success">{{ day | date:'EEE, MMM dd' }}</span>
                              </div>
                            </div>
                          </div>
                        </div>

                        <!-- Leave Days -->
                        <div class="col-md-4">
                          <div class="card border-warning">
                            <div class="card-header bg-warning text-dark py-2">
                              <small><i class="bi bi-calendar-x me-1"></i>Leave Days ({{ leaveDays.length }})</small>
                            </div>
                            <div class="card-body p-2">
                              <div *ngIf="leaveDays.length === 0" class="text-muted small">
                                No leave days selected
                              </div>
                              <div *ngFor="let day of leaveDays" class="mb-1">
                                <span class="badge" 
                                      [ngClass]="isLeaveFromLeaveManagement(day) ? 'bg-info' : 'bg-warning'">
                                  {{ day | date:'EEE, MMM dd' }}
                                  <small *ngIf="isLeaveFromLeaveManagement(day)">(Approved)</small>
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      <!-- Validation Status -->
                      <div class="row mt-3" *ngIf="validationMessages.length > 0">
                        <div class="col-12">
                          <div class="alert alert-warning py-2">
                            <small><i class="bi bi-exclamation-triangle me-1"></i>Please fix the following:</small>
                            <ul class="mb-0 mt-1 small">
                              <li *ngFor="let message of validationMessages">{{ message }}</li>
                            </ul>
                          </div>
                        </div>
                      </div>

                      <!-- Success Status -->
                      <div class="row mt-3" *ngIf="validationMessages.length === 0 && (workFromOfficeDays.length > 0 || workFromHomeDays.length > 0)">
                        <div class="col-12">
                          <div class="alert alert-success py-2">
                            <small><i class="bi bi-check-circle me-1"></i>Your roster is ready to submit!</small>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Week Calendar -->
              <div class="row">
                <div class="col-12">
                  <div class="row">
                    <div class="col-md-12 col-lg-10 mx-auto">
                      <div class="row">
                        <div class="col-md-6 col-lg-3 mb-3" *ngFor="let day of weekDays">
                          <div class="day-card" 
                               [class.holiday]="isHoliday(day.date)"
                               [class.weekend]="isWeekend(day.date)"
                               [class.selected-wfo]="isWorkFromOffice(day.date)"
                               [class.selected-wfh]="isWorkFromHome(day.date)"
                               [class.selected-leave]="isLeaveDay(day.date)"
                               (click)="!isHoliday(day.date) && !isWeekend(day.date) && toggleDay(day.date)">
                            <div class="day-header">
                              <strong>{{ day.date | date:'EEE' }}</strong>
                              <small>{{ day.date | date:'MMM dd' }}</small>
                            </div>
                            <div class="day-status">
                              <span *ngIf="isHoliday(day.date)" class="badge bg-danger">Holiday</span>
                              <span *ngIf="isWeekend(day.date)" class="badge bg-secondary">Weekend</span>
                              <span *ngIf="!isHoliday(day.date) && !isWeekend(day.date) && isWorkFromOffice(day.date)" class="badge bg-primary">WFO</span>
                              <span *ngIf="!isHoliday(day.date) && !isWeekend(day.date) && isWorkFromHome(day.date)" class="badge bg-success">WFH</span>
                              <span *ngIf="!isHoliday(day.date) && !isWeekend(day.date) && isLeaveDay(day.date)" 
                                    class="badge" 
                                    [ngClass]="isLeaveFromLeaveManagement(day.date) ? 'bg-info' : 'bg-warning'">
                                {{ isLeaveFromLeaveManagement(day.date) ? 'Approved Leave' : 'Leave' }}
                              </span>
                              <span *ngIf="!isHoliday(day.date) && !isWeekend(day.date) && !isWorkFromOffice(day.date) && !isWorkFromHome(day.date) && !isLeaveDay(day.date)" class="badge bg-light text-dark">Click to assign</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Business Rules Information -->
              <div class="row mt-3">
                <div class="col-12">
                  <div class="card border-info">
                    <div class="card-header bg-info text-white">
                      <h6 class="card-title mb-0"><i class="bi bi-info-circle me-2"></i>Business Rules</h6>
                    </div>
                    <div class="card-body">
                      <div class="row">
                        <div class="col-md-6">
                          <h6>Default Schedule:</h6>
                          <ul class="mb-0">
                            <li><strong>Minimum 3 WFO days</strong> (Work From Office)</li>
                            <li><strong>Maximum 2 WFH days</strong> (Work From Home)</li>
                            <li><em>You can assign more WFO days if needed</em></li>
                          </ul>
                        </div>
                        <div class="col-md-6">
                          <h6>When Taking Leave:</h6>
                          <ul class="mb-0">
                            <li><strong>1 day leave:</strong> Min 3 WFO + Max 1 WFH</li>
                            <li><strong>2 days leave:</strong> Min 3 WFO + 0 WFH</li>
                            <li><strong>3+ days leave:</strong> All remaining days as WFO</li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Roster Status Section -->
              <div class="row mt-3">
                <div class="col-12">
                  <div class="text-center">
                    <div class="alert" 
                         [class.alert-success]="currentRoster?.status === 'Submitted'"
                         [class.alert-warning]="currentRoster?.status === 'Draft'"
                         [class.alert-info]="currentRoster?.status === 'Approved'"
                         [class.alert-danger]="currentRoster?.status === 'Rejected'"
                         [class.alert-secondary]="!currentRoster">
                      <div *ngIf="currentRoster?.status === 'Submitted'">
                        <i class="bi bi-check-circle me-2"></i>
                        <strong>Roster Submitted Successfully!</strong>
                        <br>
                        <small>Your roster has been submitted and is pending approval.</small>
                      </div>
                      <div *ngIf="currentRoster?.status === 'Draft'">
                        <i class="bi bi-pencil me-2"></i>
                        <strong>Draft Saved</strong>
                        <br>
                        <small>Your roster is saved as a draft. Click "Submit Roster" when ready.</small>
                      </div>
                      <div *ngIf="currentRoster?.status === 'Approved'">
                        <i class="bi bi-check-circle-fill me-2"></i>
                        <strong>Roster Approved</strong>
                        <br>
                        <small>Your roster has been approved by your manager.</small>
                      </div>
                      <div *ngIf="currentRoster?.status === 'Rejected'">
                        <i class="bi bi-x-circle me-2"></i>
                        <strong>Roster Rejected</strong>
                        <br>
                        <small>Your roster has been rejected. Please review and resubmit.</small>
                      </div>
                      <div *ngIf="!currentRoster">
                        <i class="bi bi-calendar-plus me-2"></i>
                        <strong>No Roster Found</strong>
                        <br>
                        <small>Create your roster for this week by assigning days below.</small>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <!-- System Generated Roster Message -->
              <div class="row mt-3" *ngIf="currentRoster?.isSystemGenerated">
                <div class="col-12">
                  <div class="text-center">
                    <div class="alert alert-info">
                      <i class="bi bi-robot me-2"></i>
                      <strong>System Generated Roster</strong>
                      <br>
                      <small>This roster was automatically created by the system due to missed submission deadline.</small>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Validation Messages -->
              <div class="row mt-3" *ngIf="validationMessages.length > 0">
                <div class="col-12">
                  <div class="alert alert-warning">
                    <h6>Please fix the following issues:</h6>
                    <ul class="mb-0">
                      <li *ngFor="let message of validationMessages">{{ message }}</li>
                    </ul>
                  </div>
                </div>
              </div>

              <!-- Action Buttons -->
              <div class="row mt-4">
                <div class="col-12">
                  <div class="d-flex gap-2 flex-wrap">
                    <!-- Submit Button - Only show if no roster or draft status -->
                    <button class="btn btn-primary" 
                            (click)="submitRoster()" 
                            [disabled]="!canSubmit()"
                            *ngIf="!currentRoster || currentRoster.status === 'Draft'">
                      <i class="bi bi-send"></i> Submit Roster
                    </button>
                    
                    <!-- Save Draft Button - Only show if no roster or draft status -->
                    <button class="btn btn-secondary" 
                            (click)="saveDraft()"
                            *ngIf="!currentRoster || currentRoster.status === 'Draft'">
                      <i class="bi bi-save"></i> Save Draft
                    </button>
                    
                    <!-- Apply Business Rules Button - Only show if no roster or draft status -->
                    <button class="btn btn-outline-primary" 
                            (click)="applyDefaultSchedule()"
                            *ngIf="!currentRoster || currentRoster.status === 'Draft'">
                      <i class="bi bi-calendar3"></i> Apply Business Rules
                    </button>
                    
                    <!-- Copy Previous Week Button - Only show if no roster or draft status -->
                    <button class="btn btn-outline-secondary" 
                            (click)="copyFromPreviousWeek()"
                            *ngIf="!currentRoster || currentRoster.status === 'Draft'">
                      <i class="bi bi-arrow-clockwise"></i> Copy Previous Week
                    </button>
                    
                    <!-- View Submitted Roster Button - Show if roster is submitted -->
                    <button class="btn btn-outline-info" 
                            (click)="viewMyRoster()"
                            *ngIf="currentRoster && currentRoster.status === 'Submitted'">
                      <i class="bi bi-eye"></i> View Submitted Roster
                    </button>
                    
                    <!-- Resubmit Button - Show if roster is rejected -->
                    <button class="btn btn-warning" 
                            (click)="resubmitRoster()"
                            *ngIf="currentRoster && currentRoster.status === 'Rejected'">
                      <i class="bi bi-arrow-repeat"></i> Resubmit Roster
                    </button>
                    
                    <!-- Debug Button - Always show for troubleshooting -->
                    <button class="btn btn-outline-dark" 
                            (click)="debugRosterStatus()">
                      <i class="bi bi-bug"></i> Debug Info
                    </button>
                    
                    <!-- Refresh Button - Always show for troubleshooting -->
                    <button class="btn btn-outline-secondary" 
                            (click)="refreshRoster()">
                      <i class="bi bi-arrow-clockwise"></i> Refresh
                    </button>
                    
                    <!-- Refresh Applied Leaves Button -->
                    <button class="btn btn-outline-info" 
                            (click)="refreshAppliedLeaves()">
                      <i class="bi bi-calendar-check"></i> Refresh Applied Leaves
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .day-card {
      border: 2px solid #e9ecef;
      border-radius: 8px;
      padding: 1rem;
      text-align: center;
      cursor: pointer;
      transition: all 0.3s ease;
      margin-bottom: 1rem;
      min-height: 120px;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
    }

    .day-card:hover {
      border-color: #007bff;
      transform: translateY(-2px);
      box-shadow: 0 4px 8px rgba(0,0,0,0.1);
    }

    .day-card.holiday {
      background-color: #f8d7da;
      border-color: #dc3545;
      cursor: not-allowed;
    }

    .day-card.weekend {
      background-color: #f8f9fa;
      border-color: #6c757d;
      cursor: not-allowed;
      opacity: 0.7;
    }

    .day-card.selected-wfo {
      background-color: #cce7ff;
      border-color: #007bff;
    }

    .day-card.selected-wfh {
      background-color: #d4edda;
      border-color: #28a745;
    }

    .day-card.selected-leave {
      background-color: #fff3cd;
      border-color: #ffc107;
    }

    .day-header {
      margin-bottom: 0.5rem;
    }

    .day-header strong {
      display: block;
      font-size: 1.1rem;
    }

    .day-header small {
      color: #6c757d;
    }

    .day-status {
      margin-top: auto;
    }

    .badge {
      font-size: 0.75rem;
        }
    .stats-card {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      border-radius: 10px;
      padding: 1.5rem;
      box-shadow: 0 4px 6px rgba(0,0,0,0.1);
    }

    .stats-number {
      font-size: 2rem;
      font-weight: bold;
      margin-bottom: 0.25rem;
    }

    .stats-label {
      font-size: 0.9rem;
      opacity: 0.9;
    }
  `]
})
export class RosterPlannerComponent implements OnInit {
  currentRoster: Roster | null = null;
  teamMemberRosters: Roster[] = [];
  allRosters: Roster[] = [];
  weekDays: any[] = [];
  workFromOfficeDays: string[] = [];
  workFromHomeDays: string[] = [];
  leaveDays: string[] = [];
  rosterAssignedLeaves: string[] = []; // New array for roster-assigned leaves
  leaveManagementLeaves: string[] = []; // New array for leave management leaves
  holidays: PublicHoliday[] = [];
  validationMessages: string[] = [];
  isLoading: boolean = false;

  weekStartDate: Date = new Date();
  weekEndDate: Date = new Date();

  constructor(
    private rostersService: RostersService,
    private holidaysService: HolidaysService,
    private leavesService: LeavesService,
    public authService: AuthService,
    private toastr: ToastrService,
    private cdr: ChangeDetectorRef
  ) {
    this.initializeWeek();
  }

  ngOnInit() {
    this.loadHolidays();
    this.loadCurrentRoster();
    this.loadTeamMemberRosters();
    this.loadAllRosters();
  }

  getRoleSpecificMessage(): string {
    if (this.authService.isAdmin()) {
      return 'View and manage all employee rosters. You can approve or reject submitted rosters.';
    } else if (this.authService.isTeamLead()) {
      return 'View your team members\' rosters and manage your own roster.';
    } else {
      return 'Plan your work schedule for the week. Select exactly 3 WFO days and 2 WFH days. Your roster will be automatically submitted.';
    }
  }

  initializeWeek() {
    const today = new Date();
    const dayOfWeek = today.getDay();
    const diff = today.getDate() - dayOfWeek + (dayOfWeek === 0 ? -6 : 1); // Monday = 1

    this.weekStartDate = new Date(today.setDate(diff));
    this.weekEndDate = new Date(this.weekStartDate);
    this.weekEndDate.setDate(this.weekStartDate.getDate() + 6);

    this.generateWeekDays();
  }

  generateWeekDays() {
    this.weekDays = [];
    const dayNames = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

    for (let i = 0; i < 7; i++) {
      const date = new Date(this.weekStartDate);
      date.setDate(this.weekStartDate.getDate() + i);

      this.weekDays.push({
        name: dayNames[i],
        date: date.toISOString().split('T')[0]
      });
    }
  }

  loadHolidays() {
    this.holidaysService.getHolidays().subscribe({
      next: (response: any) => {
        // Handle both direct array response and response.data format
        this.holidays = Array.isArray(response) ? response : (response.data || []);
      },
      error: (error: any) => {
        console.error('Error loading holidays:', error);
      }
    });
  }

  loadCurrentRoster() {
    const currentUser = this.authService.getCurrentUser();
    if (!currentUser) {
      console.error('No current user found');
      return;
    }

    this.isLoading = true;
    const weekStart = this.weekStartDate.toISOString().split('T')[0];
    const weekEnd = this.weekEndDate.toISOString().split('T')[0];

    console.log('Loading current roster for week:', weekStart, 'to', weekEnd);
    console.log('Current user ID:', currentUser.id);

    // Get all rosters for the week and filter by current user
    this.rostersService.getRosters().subscribe({
      next: (response: any) => {
        // Handle both direct array response and response.data format
        const allRosters = Array.isArray(response) ? response : (response.data || []);
        console.log('All rosters from service:', allRosters);

        // Find the current user's roster for this week
        this.currentRoster = allRosters.find((roster: Roster) => {
          const matches = roster.userId === currentUser.id && roster.weekStartDate === weekStart;
          console.log('Checking roster:', roster.id, 'User ID:', roster.userId, 'Week Start:', roster.weekStartDate, 'Matches:', matches);
          return matches;
        }) || null;

        console.log('Found current roster:', this.currentRoster);

        if (this.currentRoster) {
          this.workFromOfficeDays = this.currentRoster.workFromOfficeDays || [];
          this.workFromHomeDays = this.currentRoster.workFromHomeDays || [];
          this.leaveDays = this.currentRoster.leaveDays || [];
          this.rosterAssignedLeaves = this.currentRoster.leaveDays || []; // Initialize rosterAssignedLeaves
          this.leaveManagementLeaves = []; // Initialize leaveManagementLeaves

          console.log('Loaded roster data:', {
            workFromOfficeDays: this.workFromOfficeDays,
            workFromHomeDays: this.workFromHomeDays,
            leaveDays: this.leaveDays,
            status: this.currentRoster.status
          });
        } else {
          this.workFromOfficeDays = [];
          this.workFromHomeDays = [];
          this.leaveDays = [];
          this.rosterAssignedLeaves = [];
          this.leaveManagementLeaves = [];
          console.log('No roster found, cleared arrays');
        }

        // Also load leaves from leave management system for this week
        this.loadLeavesForWeek(weekStart, weekEnd);

        // Validate roster after loading
        this.validateRoster();

        this.isLoading = false;
      },
      error: (error: any) => {
        console.error('Error loading roster:', error);
        this.workFromOfficeDays = [];
        this.workFromHomeDays = [];
        this.leaveDays = [];
        this.rosterAssignedLeaves = [];
        this.leaveManagementLeaves = [];
        this.isLoading = false;
      }
    });
  }

  loadLeavesForWeek(weekStart: string, weekEnd: string) {
    this.leavesService.getLeaves().subscribe({
      next: (response: any) => {
        // Handle both direct array response and response.data format
        const allLeaves = Array.isArray(response) ? response : (response.data || []);
        const currentUser = this.authService.getCurrentUser();

        // Filter leaves for current user that overlap with this week
        const userLeaves = allLeaves.filter((leave: any) => {
          if (leave.userId !== currentUser?.id) return false;

          const leaveStart = new Date(leave.startDate);
          const leaveEnd = new Date(leave.endDate);
          const weekStartDate = new Date(weekStart);
          const weekEndDate = new Date(weekEnd);

          // Check if leave overlaps with this week
          return leaveStart <= weekEndDate && leaveEnd >= weekStartDate;
        });

        // Generate leave dates for this week
        const leaveDates: string[] = [];
        userLeaves.forEach((leave: any) => {
          const leaveStart = new Date(leave.startDate);
          const leaveEnd = new Date(leave.endDate);
          const weekStartDate = new Date(weekStart);
          const weekEndDate = new Date(weekEnd);

          // Find overlapping dates
          const startDate = new Date(Math.max(leaveStart.getTime(), weekStartDate.getTime()));
          const endDate = new Date(Math.min(leaveEnd.getTime(), weekEndDate.getTime()));

          const currentDate = new Date(startDate);
          while (currentDate <= endDate) {
            leaveDates.push(currentDate.toISOString().split('T')[0]);
            currentDate.setDate(currentDate.getDate() + 1);
          }
        });

        // Update leave days: prioritize leave management leaves over roster-assigned leaves
        this.leaveManagementLeaves = leaveDates; // Leave dates from leave management system

        // Keep only roster-assigned leaves that are not in leave management
        this.rosterAssignedLeaves = this.rosterAssignedLeaves.filter(date => !this.leaveManagementLeaves.includes(date));

        // Combine all leave days
        this.leaveDays = [...this.leaveManagementLeaves, ...this.rosterAssignedLeaves];

        // Show notification if leaves were loaded
        if (this.leaveManagementLeaves.length > 0) {
          this.toastr.info(`Loaded ${this.leaveManagementLeaves.length} applied leave(s) from leave management system`, 'Leaves Updated');
        }

        // Validate roster after loading leaves
        this.validateRoster();
      },
      error: (error: any) => {
        console.error('Error loading leaves:', error);
      }
    });
  }

  // Method to refresh leaves from leave management system
  refreshAppliedLeaves() {
    const weekStart = this.weekStartDate.toISOString().split('T')[0];
    const weekEnd = this.weekEndDate.toISOString().split('T')[0];
    this.loadLeavesForWeek(weekStart, weekEnd);
  }

  loadTeamMemberRosters() {
    if (this.authService.isTeamLead() && !this.authService.isAdmin()) {
      const weekStart = this.weekStartDate.toISOString().split('T')[0];
      this.rostersService.getRosters().subscribe({
        next: (response: any) => {
          // Handle both direct array response and response.data format
          const allRosters = Array.isArray(response) ? response : (response.data || []);
          // Filter rosters for current week, only Employee rosters (excluding current user and admin users)
          this.teamMemberRosters = allRosters.filter((roster: Roster) =>
            roster.weekStartDate === weekStart &&
            roster.userId !== this.authService.getCurrentUser()?.id &&
            roster.role === 'Employee' // Only show Employee rosters, exclude Admin and TeamLead
          );
        },
        error: (error: any) => {
          console.error('Error loading team member rosters:', error);
        }
      });
    }
  }

  loadAllRosters() {
    if (this.authService.isAdmin()) {
      const weekStart = this.weekStartDate.toISOString().split('T')[0];
      this.rostersService.getRosters().subscribe({
        next: (response: any) => {
          // Handle both direct array response and response.data format
          const allRosters = Array.isArray(response) ? response : (response.data || []);
          this.allRosters = allRosters.filter((roster: Roster) =>
            roster.weekStartDate === weekStart
          );
        },
        error: (error: any) => {
          console.error('Error loading all rosters:', error);
        }
      });
    }
  }

  isHoliday(date: string): boolean {
    return this.holidays.some(holiday => holiday.date === date && holiday.isActive);
  }

  isWeekend(date: string): boolean {
    const dayOfWeek = new Date(date).getDay();
    return dayOfWeek === 0 || dayOfWeek === 6; // Sunday = 0, Saturday = 6
  }

  isWorkFromOffice(date: string): boolean {
    return this.workFromOfficeDays.includes(date);
  }

  isWorkFromHome(date: string): boolean {
    return this.workFromHomeDays.includes(date);
  }

  isLeaveDay(date: string): boolean {
    return this.leaveDays.includes(date);
  }

  toggleDay(date: string) {
    if (this.isHoliday(date)) {
      this.toastr.warning('Cannot select public holidays');
      return;
    }

    // Check if this is a leave day from leave management system
    if (this.isLeaveFromLeaveManagement(date)) {
      this.toastr.warning('Cannot modify leave days that are from approved leave requests');
      return;
    }

    // Prevent modification if roster is already submitted/approved/rejected
    if (this.currentRoster?.status && this.currentRoster.status !== 'Draft') {
      this.toastr.warning('Cannot modify roster after submission');
      return;
    }

    // Check current state BEFORE removing from arrays
    const isCurrentlyWFO = this.isWorkFromOffice(date);
    const isCurrentlyWFH = this.isWorkFromHome(date);
    const isCurrentlyLeave = this.isLeaveDay(date);

    // Remove from all arrays first
    this.workFromOfficeDays = this.workFromOfficeDays.filter(d => d !== date);
    this.workFromHomeDays = this.workFromHomeDays.filter(d => d !== date);
    this.leaveDays = this.leaveDays.filter(d => d !== date);
    this.rosterAssignedLeaves = this.rosterAssignedLeaves.filter(d => d !== date);

    // Cycle through modes: Unassigned → WFO → WFH → Leave → Unassigned (repeat)
    if (isCurrentlyWFO) {
      // Currently WFO, next click makes it WFH
      this.workFromHomeDays.push(date);
    } else if (isCurrentlyWFH) {
      // Currently WFH, next click makes it Leave
      this.leaveDays.push(date);
      this.rosterAssignedLeaves.push(date); // Add to roster-assigned leaves
    } else if (isCurrentlyLeave) {
      // Currently Leave, next click makes it Unassigned (already removed above)
      // No action needed, already removed from leaveDays and rosterAssignedLeaves
    } else {
      // Currently Unassigned, next click makes it WFO
      this.workFromOfficeDays.push(date);
    }

    this.validateRoster();
  }

  isLeaveFromLeaveManagement(date: string): boolean {
    // Check if this date is in the leaveManagementLeaves array
    return this.leaveManagementLeaves.includes(date);
  }

  isRosterAssignedLeave(date: string): boolean {
    // Check if this date is in the rosterAssignedLeaves array
    return this.rosterAssignedLeaves.includes(date);
  }

  getRequiredWFO(): number {
    const availableWorkDays = this.weekDays.filter(day => {
      const dayOfWeek = new Date(day.date).getDay();
      return dayOfWeek !== 0 && dayOfWeek !== 6 && !this.isHoliday(day.date);
    });

    const leaveDaysCount = this.leaveDays.length;
    const remainingWorkDays = availableWorkDays.length - leaveDaysCount;

    if (leaveDaysCount === 0) return 3;
    if (leaveDaysCount === 1) return 3;
    if (leaveDaysCount === 2) return 3;
    if (leaveDaysCount >= 3) return remainingWorkDays;

    return 3;
  }

  getRequiredWFH(): number {
    const leaveDaysCount = this.leaveDays.length;

    if (leaveDaysCount === 0) return 2;
    if (leaveDaysCount === 1) return 1;
    if (leaveDaysCount >= 2) return 0;

    return 2;
  }

  // New methods for flexible validation
  getMinRequiredWFO(): number {
    return this.getRequiredWFO(); // Same as before, but now represents minimum
  }

  getMaxAllowedWFH(): number {
    return this.getRequiredWFH(); // Same as before, but now represents maximum
  }

  validateRoster(): void {
    this.validationMessages = this.checkValidation();
  }

  canSubmit(): boolean {
    // Check validation without modifying component state
    return this.checkValidation().length === 0;
  }

  private checkValidation(): string[] {
    const messages: string[] = [];

    // Calculate available work days (excluding weekends and holidays)
    const availableWorkDays = this.weekDays.filter(day => {
      const dayOfWeek = new Date(day.date).getDay();
      return dayOfWeek !== 0 && dayOfWeek !== 6 && !this.isHoliday(day.date);
    });

    const totalAvailableWorkDays = availableWorkDays.length;
    const leaveDaysCount = this.leaveDays.length;
    const remainingWorkDays = totalAvailableWorkDays - leaveDaysCount;

    // Business rules: Minimum WFO days based on leave taken
    let minRequiredWFO = 3;
    let maxRequiredWFH = 2;

    if (leaveDaysCount > 0) {
      // Adjust requirements based on leave days
      if (leaveDaysCount === 1) {
        // 1 day leave: Minimum 3 WFO + Maximum 1 WFH
        minRequiredWFO = 3;
        maxRequiredWFH = 1;
      } else if (leaveDaysCount === 2) {
        // 2 days leave: Minimum 3 WFO + 0 WFH
        minRequiredWFO = 3;
        maxRequiredWFH = 0;
      } else if (leaveDaysCount >= 3) {
        // 3+ days leave: All remaining days as WFO
        minRequiredWFO = remainingWorkDays;
        maxRequiredWFH = 0;
      }
    }

    // Check minimum WFO days (allow more than minimum)
    if (this.workFromOfficeDays.length < minRequiredWFO) {
      messages.push(`Need at least ${minRequiredWFO} WFO days (currently ${this.workFromOfficeDays.length})`);
    }

    // Check maximum WFH days (allow less than maximum)
    if (maxRequiredWFH > 0 && this.workFromHomeDays.length > maxRequiredWFH) {
      messages.push(`Maximum ${maxRequiredWFH} WFH days allowed (currently ${this.workFromHomeDays.length})`);
    }

    // Check total assigned days
    const totalAssignedDays = this.workFromOfficeDays.length + this.workFromHomeDays.length + this.leaveDays.length;
    if (totalAssignedDays !== totalAvailableWorkDays) {
      messages.push(`Must assign all available work days (${totalAvailableWorkDays} total, currently ${totalAssignedDays})`);
    }

    // Check for overlapping assignments
    const allAssignedDays = [...this.workFromOfficeDays, ...this.workFromHomeDays, ...this.leaveDays];
    const uniqueAssignedDays = new Set(allAssignedDays);
    if (allAssignedDays.length !== uniqueAssignedDays.size) {
      messages.push('Days cannot be assigned to multiple categories');
    }

    return messages;
  }

  submitRoster() {
    if (!this.canSubmit()) {
      this.toastr.error('Please fix validation issues before submitting');
      return;
    }

    const currentUser = this.authService.getCurrentUser();
    if (!currentUser) {
      this.toastr.error('User information not found');
      return;
    }

    const rosterData: CreateRosterRequest = {
      weekStartDate: this.weekStartDate.toISOString().split('T')[0],
      weekEndDate: this.weekEndDate.toISOString().split('T')[0],
      workFromOfficeDays: this.workFromOfficeDays,
      workFromHomeDays: this.workFromHomeDays,
      leaveDays: this.leaveDays || [],
      // Include user information
      userId: currentUser.id,
      userName: `${currentUser.firstName} ${currentUser.lastName}`,
      email: currentUser.email,
      role: currentUser.role,
      teamId: currentUser.teamId,
      teamName: currentUser.teamName
    };

    console.log('Submitting roster with data:', rosterData);
    console.log('Current roster before submission:', this.currentRoster);

    if (this.currentRoster) {
      this.rostersService.updateRoster(this.currentRoster.id, { ...rosterData, status: 'Submitted' }).subscribe({
        next: (response: any) => {
          console.log('Roster update response:', response);
          this.toastr.success('Roster submitted successfully! Your manager will review it.', 'Success', {
            timeOut: 5000,
            extendedTimeOut: 2000
          });
          // Update the current roster status immediately
          if (this.currentRoster) {
            this.currentRoster.status = 'Submitted';
            this.currentRoster.submittedAt = new Date().toISOString();
          }
          this.loadCurrentRoster();
        },
        error: (error: any) => {
          console.error('Error submitting roster:', error);
          this.toastr.error('Failed to submit roster. Please try again.', 'Error');
        }
      });
    } else {
      this.rostersService.createRoster({ ...rosterData, leaveDays: rosterData.leaveDays || [], status: 'Submitted' }).subscribe({
        next: (response: any) => {
          console.log('Roster creation response:', response);
          this.toastr.success('Roster submitted successfully! Your manager will review it.', 'Success', {
            timeOut: 5000,
            extendedTimeOut: 2000
          });

          // Create the current roster object immediately from the response
          const createdRoster = response.data || response;
          this.currentRoster = {
            ...createdRoster,
            id: createdRoster.id,
            userId: currentUser.id,
            userName: `${currentUser.firstName} ${currentUser.lastName}`,
            email: currentUser.email,
            role: currentUser.role,
            teamId: currentUser.teamId,
            teamName: currentUser.teamName,
            weekStartDate: rosterData.weekStartDate,
            weekEndDate: rosterData.weekEndDate,
            workFromOfficeDays: rosterData.workFromOfficeDays,
            workFromHomeDays: rosterData.workFromHomeDays,
            leaveDays: rosterData.leaveDays || [],
            status: 'Submitted',
            submittedAt: new Date().toISOString(),
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          };

          // Update the display arrays to match the submitted roster
          this.workFromOfficeDays = rosterData.workFromOfficeDays;
          this.workFromHomeDays = rosterData.workFromHomeDays;
          this.leaveDays = rosterData.leaveDays || [];
          this.rosterAssignedLeaves = rosterData.leaveDays || [];

          // Validate to update the UI
          this.validateRoster();

          console.log('Current roster after creation:', this.currentRoster);
        },
        error: (error: any) => {
          console.error('Error submitting roster:', error);
          this.toastr.error('Failed to submit roster. Please try again.', 'Error');
        }
      });
    }
  }

  saveDraft() {
    const currentUser = this.authService.getCurrentUser();
    if (!currentUser) {
      this.toastr.error('User not authenticated');
      return;
    }

    const rosterData: CreateRosterRequest = {
      userId: currentUser.id,
      weekStartDate: this.weekStartDate.toISOString().split('T')[0],
      weekEndDate: this.weekEndDate.toISOString().split('T')[0],
      workFromOfficeDays: this.workFromOfficeDays,
      workFromHomeDays: this.workFromHomeDays,
      leaveDays: this.leaveDays || []
    };

    if (this.currentRoster) {
      this.rostersService.updateRoster(this.currentRoster.id, { ...rosterData, status: 'Draft' }).subscribe({
        next: (response: any) => {
          this.toastr.success('Draft saved successfully');
          this.loadCurrentRoster();
        },
        error: (error: any) => {
          console.error('Error saving draft:', error);
          this.toastr.error('Failed to save draft');
        }
      });
    } else {
      this.rostersService.createRoster({ ...rosterData, leaveDays: rosterData.leaveDays || [], status: 'Draft' }).subscribe({
        next: (response: any) => {
          this.toastr.success('Draft saved successfully');
          this.loadCurrentRoster();
        },
        error: (error: any) => {
          console.error('Error saving draft:', error);
          this.toastr.error('Failed to save draft');
        }
      });
    }
  }

  applyDefaultSchedule() {
    // Clear existing assignments
    this.workFromOfficeDays = [];
    this.workFromHomeDays = [];
    this.rosterAssignedLeaves = []; // Clear roster-assigned leaves

    // Get available work days (excluding weekends, holidays, and leave days)
    const availableWorkDays = this.weekDays.filter(day => {
      const dayOfWeek = new Date(day.date).getDay();
      return dayOfWeek !== 0 && dayOfWeek !== 6 &&
        !this.isHoliday(day.date) &&
        !this.leaveDays.includes(day.date);
    });

    const leaveDaysCount = this.leaveDays.length;
    let minRequiredWFO = 3;
    let maxRequiredWFH = 2;

    // Apply business rules based on leave days
    if (leaveDaysCount === 0) {
      // No leaves: 3 WFO + 2 WFH
      minRequiredWFO = 3;
      maxRequiredWFH = 2;
    } else if (leaveDaysCount === 1) {
      // 1 day leave: 3 WFO + 1 WFH
      minRequiredWFO = 3;
      maxRequiredWFH = 1;
    } else if (leaveDaysCount === 2) {
      // 2 days leave: 3 WFO + 0 WFH
      minRequiredWFO = 3;
      maxRequiredWFH = 0;
    } else if (leaveDaysCount >= 3) {
      // 3+ days leave: All remaining days as WFO
      minRequiredWFO = availableWorkDays.length;
      maxRequiredWFH = 0;
    }

    // Assign WFO days first (priority)
    for (let i = 0; i < Math.min(minRequiredWFO, availableWorkDays.length); i++) {
      this.workFromOfficeDays.push(availableWorkDays[i].date);
    }

    // Assign WFH days from remaining available days
    const remainingDays = availableWorkDays.slice(minRequiredWFO);
    for (let i = 0; i < Math.min(maxRequiredWFH, remainingDays.length); i++) {
      this.workFromHomeDays.push(remainingDays[i].date);
    }

    this.validateRoster();
    this.toastr.success('Business rules applied: ' + leaveDaysCount + ' leave days → ' + minRequiredWFO + ' WFO + ' + maxRequiredWFH + ' WFH');
  }

  copyFromPreviousWeek() {
    const prevWeekStart = new Date(this.weekStartDate);
    prevWeekStart.setDate(this.weekStartDate.getDate() - 7);
    const prevWeekStartStr = prevWeekStart.toISOString().split('T')[0];

    this.rostersService.getRostersByWeek(prevWeekStartStr).subscribe({
      next: (response: any) => {
        // Handle both direct array response and response.data format
        const rosterData = Array.isArray(response) ? response[0] : response.data;
        if (rosterData) {
          this.workFromOfficeDays = rosterData.workFromOfficeDays || [];
          this.workFromHomeDays = rosterData.workFromHomeDays || [];
          this.leaveDays = rosterData.leaveDays || [];
          this.validateRoster();
          this.toastr.success('Copied from previous week');
        } else {
          this.toastr.warning('No roster found for previous week');
        }
      },
      error: (error: any) => {
        console.error('Error copying from previous week:', error);
        this.toastr.error('Failed to copy from previous week');
      }
    });
  }

  viewMemberRoster(roster: Roster) {
    // Create a detailed view of the roster
    const weekDays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
    let scheduleDetails = '';

    // Create schedule details
    roster.workFromOfficeDays.forEach(day => {
      const date = new Date(day);
      const dayName = weekDays[date.getDay()];
      scheduleDetails += `• ${dayName} (${date.toLocaleDateString()}): Work From Office\n`;
    });

    roster.workFromHomeDays.forEach(day => {
      const date = new Date(day);
      const dayName = weekDays[date.getDay()];
      scheduleDetails += `• ${dayName} (${date.toLocaleDateString()}): Work From Home\n`;
    });

    roster.leaveDays.forEach(day => {
      const date = new Date(day);
      const dayName = weekDays[date.getDay()];
      scheduleDetails += `• ${dayName} (${date.toLocaleDateString()}): Leave\n`;
    });

    const message = `Roster Details for ${roster.userName}:
    
Status: ${roster.status}
WFO Days: ${roster.workFromOfficeDays.length}/3
WFH Days: ${roster.workFromHomeDays.length}/2
Leave Days: ${roster.leaveDays.length}

Schedule:
${scheduleDetails}

Submitted: ${roster.submittedAt ? new Date(roster.submittedAt).toLocaleString() : 'Not submitted'}`;

    this.toastr.info(message, `${roster.userName}'s Roster`, {
      timeOut: 0,
      extendedTimeOut: 0,
      closeButton: true,
      progressBar: false
    });
  }

  viewAllRoster(roster: Roster) {
    this.toastr.info(`Viewing ${roster.userName}'s roster`);
    // You can implement a modal or navigation to view detailed roster
  }

  approveRoster(rosterId: number) {
    const currentUser = this.authService.getCurrentUser();
    if (!currentUser) {
      this.toastr.error('User not authenticated');
      return;
    }

    this.rostersService.approveRoster(rosterId, currentUser.id, `${currentUser.firstName} ${currentUser.lastName}`).subscribe({
      next: (response: any) => {
        this.toastr.success('Roster approved successfully');
        this.loadAllRosters();
      },
      error: (error: any) => {
        console.error('Error approving roster:', error);
        this.toastr.error('Failed to approve roster');
      }
    });
  }

  rejectRoster(rosterId: number) {
    const reason = prompt('Please provide a reason for rejection:');
    if (reason) {
      const currentUser = this.authService.getCurrentUser();
      if (!currentUser) {
        this.toastr.error('User not authenticated');
        return;
      }

      this.rostersService.rejectRoster(rosterId, currentUser.id, `${currentUser.firstName} ${currentUser.lastName}`).subscribe({
        next: (response: any) => {
          this.toastr.success('Roster rejected successfully');
          this.loadAllRosters();
        },
        error: (error: any) => {
          console.error('Error rejecting roster:', error);
          this.toastr.error('Failed to reject roster');
        }
      });
    }
  }

  previousWeek() {
    // Create new Date objects for proper change detection
    const newWeekStart = new Date(this.weekStartDate);
    newWeekStart.setDate(this.weekStartDate.getDate() - 7);
    this.weekStartDate = newWeekStart;

    const newWeekEnd = new Date(this.weekEndDate);
    newWeekEnd.setDate(this.weekEndDate.getDate() - 7);
    this.weekEndDate = newWeekEnd;

    this.generateWeekDays();
    this.loadCurrentRoster();
    this.loadTeamMemberRosters();
    this.loadAllRosters();

    // Force change detection
    this.cdr.detectChanges();
  }

  nextWeek() {
    // Create new Date objects for proper change detection
    const newWeekStart = new Date(this.weekStartDate);
    newWeekStart.setDate(this.weekStartDate.getDate() + 7);
    this.weekStartDate = newWeekStart;

    const newWeekEnd = new Date(this.weekEndDate);
    newWeekEnd.setDate(this.weekEndDate.getDate() + 7);
    this.weekEndDate = newWeekEnd;

    this.generateWeekDays();
    this.loadCurrentRoster();
    this.loadTeamMemberRosters();
    this.loadAllRosters();

    // Force change detection
    this.cdr.detectChanges();
  }

  currentWeek() {
    this.initializeWeek();
    this.loadCurrentRoster();
    this.loadTeamMemberRosters();
    this.loadAllRosters();
  }

  getWeekStartDate(): Date {
    return this.weekStartDate;
  }

  getWeekEndDate(): Date {
    return this.weekEndDate;
  }

  viewMyRoster() {
    if (!this.currentRoster) {
      this.toastr.warning('No roster found to view');
      return;
    }

    const weekDays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
    let scheduleDetails = '';

    // Create schedule details
    this.currentRoster.workFromOfficeDays.forEach(day => {
      const date = new Date(day);
      const dayName = weekDays[date.getDay()];
      scheduleDetails += `• ${dayName} (${date.toLocaleDateString()}): Work From Office\n`;
    });

    this.currentRoster.workFromHomeDays.forEach(day => {
      const date = new Date(day);
      const dayName = weekDays[date.getDay()];
      scheduleDetails += `• ${dayName} (${date.toLocaleDateString()}): Work From Home\n`;
    });

    this.currentRoster.leaveDays.forEach(day => {
      const date = new Date(day);
      const dayName = weekDays[date.getDay()];
      scheduleDetails += `• ${dayName} (${date.toLocaleDateString()}): Leave\n`;
    });

    const message = `Your Submitted Roster for Week of ${this.weekStartDate.toLocaleDateString()} - ${this.weekEndDate.toLocaleDateString()}:

Status: ${this.currentRoster.status}
Submitted: ${this.currentRoster.submittedAt ? new Date(this.currentRoster.submittedAt).toLocaleString() : 'Not available'}

Schedule:
${scheduleDetails}

Summary:
• Work From Office: ${this.currentRoster.workFromOfficeDays.length} days
• Work From Home: ${this.currentRoster.workFromHomeDays.length} days
• Leave Days: ${this.currentRoster.leaveDays.length} days`;

    this.toastr.info(message, 'Your Submitted Roster', {
      timeOut: 0,
      extendedTimeOut: 0,
      closeButton: true,
      progressBar: false
    });
  }

  resubmitRoster() {
    if (!this.currentRoster) {
      this.toastr.warning('No roster found to resubmit');
      return;
    }

    // Reset the roster status to Draft so it can be modified
    this.currentRoster.status = 'Draft';
    this.toastr.info('Roster status reset to Draft. You can now modify and resubmit.', 'Ready to Resubmit');
  }

  // Debug method to check roster status
  debugRosterStatus() {
    console.log('=== ROSTER DEBUG INFO ===');
    console.log('Current Roster:', this.currentRoster);
    console.log('Week Start Date:', this.weekStartDate);
    console.log('Week End Date:', this.weekEndDate);
    console.log('Work From Office Days:', this.workFromOfficeDays);
    console.log('Work From Home Days:', this.workFromHomeDays);
    console.log('Leave Days:', this.leaveDays);
    console.log('Validation Messages:', this.validationMessages);
    console.log('Can Submit:', this.canSubmit());
    console.log('========================');

    this.toastr.info('Check browser console for roster debug information', 'Debug Info');
  }

  // Refresh roster data
  refreshRoster() {
    this.toastr.info('Refreshing roster data...', 'Refresh');
    this.loadCurrentRoster();
    this.loadTeamMemberRosters();
    this.loadAllRosters();
  }

  // Get roster summary text
  getRosterSummaryText(): string {
    const wfoCount = this.workFromOfficeDays.length;
    const wfhCount = this.workFromHomeDays.length;
    const leaveCount = this.leaveDays.length;

    let summary = '';

    if (wfoCount > 0) {
      summary += `${wfoCount} WFO day${wfoCount > 1 ? 's' : ''}`;
    }

    if (wfhCount > 0) {
      if (summary) summary += ', ';
      summary += `${wfhCount} WFH day${wfhCount > 1 ? 's' : ''}`;
    }

    if (leaveCount > 0) {
      if (summary) summary += ', ';
      summary += `${leaveCount} leave day${leaveCount > 1 ? 's' : ''}`;
    }

    if (!summary) {
      summary = 'No days assigned';
    }

    return summary;
  }

  // Get detailed roster breakdown
  getDetailedRosterBreakdown(): any {
    return {
      workFromOffice: {
        count: this.workFromOfficeDays.length,
        required: this.getRequiredWFO(),
        days: this.workFromOfficeDays.map(day => ({
          date: day,
          formatted: new Date(day).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })
        }))
      },
      workFromHome: {
        count: this.workFromHomeDays.length,
        required: this.getRequiredWFH(),
        days: this.workFromHomeDays.map(day => ({
          date: day,
          formatted: new Date(day).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })
        }))
      },
      leave: {
        count: this.leaveDays.length,
        days: this.leaveDays.map(day => ({
          date: day,
          formatted: new Date(day).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' }),
          isApproved: this.isLeaveFromLeaveManagement(day)
        }))
      },
      totalAssigned: this.workFromOfficeDays.length + this.workFromHomeDays.length + this.leaveDays.length,
      isValid: this.validationMessages.length === 0
    };
  }
} 