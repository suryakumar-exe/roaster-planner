import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LeavesService } from '../../../services/leaves.service';
import { AuthService } from '../../../services/auth.service';
import { RostersService } from '../../../services/rosters.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-leave-management',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="container-fluid">
      <div class="row mb-4">
        <div class="col-12">
          <div class="d-flex justify-content-between align-items-center">
            <div>
              <h2>Leave Management</h2>
              <p class="text-muted mb-0">Apply for leave and manage your leave requests</p>
            </div>
            <button class="btn btn-primary" (click)="showCreateForm = true">
              <i class="bi bi-plus-circle me-2"></i>Apply for Leave
            </button>
          </div>
        </div>
      </div>

      <!-- Create Leave Request Form -->
      <div class="row mb-4" *ngIf="showCreateForm">
        <div class="col-12">
          <div class="card">
            <div class="card-header">
              <h5 class="card-title mb-0">Apply for Leave</h5>
            </div>
            <div class="card-body">
              <form (ngSubmit)="createLeave()" #leaveForm="ngForm">
                <div class="row">
                  <div class="col-md-6 mb-3">
                    <label for="leaveType" class="form-label">Leave Type</label>
                    <select
                      class="form-select"
                      id="leaveType"
                      name="leaveType"
                      [(ngModel)]="newLeave.leaveType"
                      required
                    >
                      <option value="">Select leave type</option>
                      <option value="Annual">Annual Leave</option>
                      <option value="Sick">Sick Leave</option>
                      <option value="Personal">Personal Leave</option>
                      <option value="Maternity">Maternity Leave</option>
                      <option value="Paternity">Paternity Leave</option>
                      <option value="Bereavement">Bereavement Leave</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                  <div class="col-md-6 mb-3">
                    <label for="totalDays" class="form-label">Total Days</label>
                    <input
                      type="number"
                      class="form-control"
                      id="totalDays"
                      name="totalDays"
                      [(ngModel)]="newLeave.totalDays"
                      min="0.5"
                      step="0.5"
                      required
                    >
                  </div>
                </div>

                <div class="row">
                  <div class="col-md-6 mb-3">
                    <label for="startDate" class="form-label">Start Date</label>
                    <input
                      type="date"
                      class="form-control"
                      id="startDate"
                      name="startDate"
                      [(ngModel)]="newLeave.startDate"
                      (change)="calculateTotalDays()"
                      required
                    >
                  </div>
                  <div class="col-md-6 mb-3">
                    <label for="endDate" class="form-label">End Date</label>
                    <input
                      type="date"
                      class="form-control"
                      id="endDate"
                      name="endDate"
                      [(ngModel)]="newLeave.endDate"
                      (change)="calculateTotalDays()"
                      required
                    >
                  </div>
                </div>

                <div class="mb-3">
                  <label for="reason" class="form-label">Reason</label>
                  <textarea
                    class="form-control"
                    id="reason"
                    name="reason"
                    [(ngModel)]="newLeave.reason"
                    rows="3"
                    placeholder="Please provide a reason for your leave request"
                    required
                  ></textarea>
                </div>

                <div class="alert alert-info" *ngIf="newLeave.startDate && newLeave.endDate">
                  <i class="bi bi-info-circle me-2"></i>
                  <strong>Leave will be automatically approved and reflected in your roster calendar.</strong>
                </div>

                <div class="d-flex gap-2">
                  <button type="submit" class="btn btn-primary" [disabled]="!leaveForm.valid">
                    Submit Leave Request
                  </button>
                  <button type="button" class="btn btn-secondary" (click)="cancelCreate()">
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>

      <!-- Leave Requests List -->
      <div class="row">
        <div class="col-12">
          <div class="card">
            <div class="card-header">
              <h5 class="card-title mb-0">My Leave Requests</h5>
            </div>
            <div class="card-body">
              <div *ngIf="userLeaves.length === 0" class="text-center text-muted py-5">
                <i class="bi bi-calendar-event fs-1"></i>
                <h5 class="mt-3">No leave requests found</h5>
                <p>Submit your first leave request to get started!</p>
              </div>

              <div *ngFor="let leave of userLeaves" class="leave-item border rounded p-3 mb-3">
                <div class="row align-items-center">
                  <div class="col-md-3">
                    <h6 class="mb-1">{{ leave.leaveType }}</h6>
                    <small class="text-muted">{{ leave.startDate | date:'MMM dd, yyyy' }} - {{ leave.endDate | date:'MMM dd, yyyy' }}</small>
                  </div>
                  <div class="col-md-2">
                    <strong>{{ leave.totalDays }}</strong>
                    <div class="small text-muted">Days</div>
                  </div>
                  <div class="col-md-4">
                    <p class="mb-1 text-truncate">{{ leave.reason }}</p>
                  </div>
                  <div class="col-md-3 text-end">
                    <span class="badge bg-success">Approved</span>
                    <div class="mt-2">
                      <button class="btn btn-sm btn-outline-danger" (click)="deleteLeave(leave.id)">
                        <i class="bi bi-trash"></i> Delete
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `
})
export class LeaveManagementComponent implements OnInit {
  leaves: any[] = [];
  userLeaves: any[] = [];
  showCreateForm = false;
  currentUser: any;

  newLeave = {
    leaveType: '',
    startDate: '',
    endDate: '',
    totalDays: 1,
    reason: ''
  };

  constructor(
    private leavesService: LeavesService,
    private authService: AuthService,
    private rostersService: RostersService,
    private toastr: ToastrService
  ) { }

  ngOnInit() {
    this.currentUser = this.authService.getCurrentUser();
    this.loadLeaves();
  }

  loadLeaves() {
    this.leavesService.getLeaves().subscribe({
      next: (response: any) => {
        // Handle both direct array response and response.data format
        this.leaves = Array.isArray(response) ? response : (response.data || []);
        // Filter leaves for current user
        this.userLeaves = this.leaves.filter(leave =>
          leave.userId === this.currentUser?.id
        );
        console.log('Loaded leaves:', this.leaves);
        console.log('User leaves:', this.userLeaves);
      },
      error: (error: any) => {
        console.error('Error loading leaves:', error);
        this.toastr.error('Failed to load leave requests');
      }
    });
  }

  calculateTotalDays() {
    if (this.newLeave.startDate && this.newLeave.endDate) {
      const startDate = new Date(this.newLeave.startDate);
      const endDate = new Date(this.newLeave.endDate);

      if (endDate >= startDate) {
        const timeDiff = endDate.getTime() - startDate.getTime();
        const daysDiff = Math.ceil(timeDiff / (1000 * 3600 * 24)) + 1;
        this.newLeave.totalDays = daysDiff;
      }
    }
  }

  createLeave() {
    if (!this.newLeave.leaveType || !this.newLeave.startDate || !this.newLeave.endDate || !this.newLeave.reason) {
      this.toastr.error('Please fill in all required fields');
      return;
    }

    if (this.newLeave.totalDays <= 0) {
      this.toastr.error('Total days must be greater than 0');
      return;
    }

    // Add current user information
    const leaveData = {
      ...this.newLeave,
      userId: this.currentUser.id,
      userName: `${this.currentUser.firstName} ${this.currentUser.lastName}`,
      email: this.currentUser.email,
      role: this.currentUser.role,
      teamId: this.currentUser.teamId,
      teamName: this.currentUser.teamName,
      status: 'Pending' as 'Pending' | 'Approved' | 'Rejected'
    };

    this.leavesService.createLeave(leaveData).subscribe({
      next: (response: any) => {
        this.toastr.success('Leave request submitted and approved successfully!');
        this.loadLeaves();
        this.cancelCreate();
        // Update roster to reflect leave days
        this.updateRosterWithLeave(response.data);
      },
      error: (error: any) => {
        console.error('Error creating leave request:', error);
        this.toastr.error('Failed to submit leave request');
      }
    });
  }

  updateRosterWithLeave(leave: any) {
    // Get the current week's roster and update it with leave days
    const startDate = new Date(leave.startDate);
    const endDate = new Date(leave.endDate);

    // Generate all dates between start and end date
    const leaveDates: string[] = [];
    const currentDate = new Date(startDate);

    while (currentDate <= endDate) {
      leaveDates.push(currentDate.toISOString().split('T')[0]);
      currentDate.setDate(currentDate.getDate() + 1);
    }

    // Update roster for each week that contains leave dates
    leaveDates.forEach(date => {
      this.updateRosterForDate(date, leave);
    });
  }

  updateRosterForDate(date: string, leave: any) {
    // Find the week that contains this date
    const targetDate = new Date(date);
    const dayOfWeek = targetDate.getDay();
    const weekStart = new Date(targetDate);
    weekStart.setDate(targetDate.getDate() - dayOfWeek + (dayOfWeek === 0 ? -6 : 1));
    const weekStartString = weekStart.toISOString().split('T')[0];

    // Get current roster for this week
    this.rostersService.getRosters().subscribe({
      next: (response: any) => {
        // Handle both direct array response and response.data format
        const allRosters = Array.isArray(response) ? response : (response.data || []);
        const currentRoster = allRosters.find((roster: any) =>
          roster.userId === this.currentUser.id &&
          roster.weekStartDate === weekStartString
        );

        if (currentRoster) {
          // Update existing roster
          const updatedRoster = {
            ...currentRoster,
            leaveDays: [...(currentRoster.leaveDays || []), date],
            updatedAt: new Date().toISOString(),
            updatedBy: this.currentUser.id
          };

          this.rostersService.updateRoster(currentRoster.id, updatedRoster).subscribe({
            next: () => {
              console.log(`Updated roster for week ${weekStartString} with leave date ${date}`);
            },
            error: (error: any) => {
              console.error('Error updating roster with leave:', error);
            }
          });
        } else {
          // Create new roster for this week if it doesn't exist
          const weekEnd = new Date(weekStart);
          weekEnd.setDate(weekStart.getDate() + 6);
          const weekEndString = weekEnd.toISOString().split('T')[0];

          const newRoster = {
            userId: this.currentUser.id,
            userName: `${this.currentUser.firstName} ${this.currentUser.lastName}`,
            email: this.currentUser.email,
            role: this.currentUser.role,
            teamId: this.currentUser.teamId,
            teamName: this.currentUser.teamName,
            weekStartDate: weekStartString,
            weekEndDate: weekEndString,
            workFromOfficeDays: [],
            workFromHomeDays: [],
            leaveDays: [date],
            status: 'Draft' as const,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            createdBy: this.currentUser.id,
            updatedBy: this.currentUser.id
          };

          this.rostersService.createRoster(newRoster).subscribe({
            next: () => {
              console.log(`Created new roster for week ${weekStartString} with leave date ${date}`);
            },
            error: (error: any) => {
              console.error('Error creating roster with leave:', error);
            }
          });
        }
      },
      error: (error: any) => {
        console.error('Error getting rosters for leave update:', error);
      }
    });
  }

  deleteLeave(id: number) {
    if (confirm('Are you sure you want to delete this leave request?')) {
      this.leavesService.deleteLeave(id).subscribe({
        next: (response: any) => {
          this.toastr.success('Leave request deleted successfully');
          this.loadLeaves();
        },
        error: (error: any) => {
          console.error('Error deleting leave request:', error);
          this.toastr.error('Failed to delete leave request');
        }
      });
    }
  }

  cancelCreate() {
    this.showCreateForm = false;
    this.newLeave = {
      leaveType: '',
      startDate: '',
      endDate: '',
      totalDays: 1,
      reason: ''
    };
  }
} 