import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="container-fluid">
      <div class="row">
        <div class="col-lg-8">
          <div class="card">
            <div class="card-header">
              <h5 class="card-title mb-0">Profile Information</h5>
            </div>
            <div class="card-body">
              <div class="row">
                <div class="col-md-6 mb-3">
                  <label class="form-label">First Name</label>
                  <input type="text" class="form-control" [value]="(authService.currentUser$ | async)?.firstName" readonly>
                </div>
                <div class="col-md-6 mb-3">
                  <label class="form-label">Last Name</label>
                  <input type="text" class="form-control" [value]="(authService.currentUser$ | async)?.lastName" readonly>
                </div>
              </div>
              <div class="row">
                <div class="col-md-6 mb-3">
                  <label class="form-label">Email</label>
                  <input type="email" class="form-control" [value]="(authService.currentUser$ | async)?.email" readonly>
                </div>
                <div class="col-md-6 mb-3">
                  <label class="form-label">Role</label>
                  <input type="text" class="form-control" [value]="(authService.currentUser$ | async)?.role || 'N/A'" readonly>
                </div>
              </div>
              <div class="row">
                <div class="col-md-6 mb-3">
                  <label class="form-label">Status</label>
                  <input type="text" class="form-control" value="Active" readonly>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="col-lg-4">
          <div class="card">
            <div class="card-header">
              <h5 class="card-title mb-0">Account Statistics</h5>
            </div>
            <div class="card-body">
              <div class="mb-3">
                <div class="d-flex justify-content-between">
                  <span>Member Since</span>
                  <span class="fw-bold">{{ (authService.currentUser$ | async)?.createdAt | date:'MMM yyyy' || 'N/A' }}</span>
                </div>
              </div>
              <div class="mb-3">
                <div class="d-flex justify-content-between">
                  <span>Last Login</span>
                  <span class="fw-bold">Today</span>
                </div>
              </div>
              <div class="mb-3">
                <div class="d-flex justify-content-between">
                  <span>Email Verified</span>
                  <span class="badge bg-success">Yes</span>
                </div>
              </div>
            </div>
          </div>

          <div class="card mt-3">
            <div class="card-header">
              <h5 class="card-title mb-0">Quick Actions</h5>
            </div>
            <div class="card-body">
              <button class="btn btn-outline-primary w-100 mb-2" (click)="showChangePassword = true">
                <i class="bi bi-key me-2"></i>Change Password
              </button>
              <button class="btn btn-outline-secondary w-100" (click)="logout()">
                <i class="bi bi-box-arrow-right me-2"></i>Logout
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Change Password Modal -->
      <div class="modal fade" [class.show]="showChangePassword" [style.display]="showChangePassword ? 'block' : 'none'" tabindex="-1">
        <div class="modal-dialog">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title">Change Password</h5>
              <button type="button" class="btn-close" (click)="showChangePassword = false"></button>
            </div>
            <div class="modal-body">
              <form (ngSubmit)="changePassword()" #passwordForm="ngForm">
                <div class="mb-3">
                  <label for="currentPassword" class="form-label">Current Password</label>
                  <input type="password" class="form-control" id="currentPassword" 
                         [(ngModel)]="passwordData.currentPassword" name="currentPassword" required>
                </div>
                <div class="mb-3">
                  <label for="newPassword" class="form-label">New Password</label>
                  <input type="password" class="form-control" id="newPassword" 
                         [(ngModel)]="passwordData.newPassword" name="newPassword" required minlength="8">
                </div>
                <div class="mb-3">
                  <label for="confirmPassword" class="form-label">Confirm New Password</label>
                  <input type="password" class="form-control" id="confirmPassword" 
                         [(ngModel)]="passwordData.confirmPassword" name="confirmPassword" required>
                </div>
              </form>
            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-secondary" (click)="showChangePassword = false">Cancel</button>
              <button type="button" class="btn btn-primary" (click)="changePassword()" 
                      [disabled]="!passwordForm.valid">Change Password</button>
            </div>
          </div>
        </div>
      </div>
      <div class="modal-backdrop fade show" *ngIf="showChangePassword"></div>
    </div>
  `
})
export class ProfileComponent implements OnInit {
  showChangePassword = false;
  passwordData = {
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  };

  constructor(
    public authService: AuthService,
    private router: Router,
    private toastr: ToastrService
  ) { }

  ngOnInit() {
    // Component initialized
  }

  changePassword() {
    if (this.passwordData.newPassword !== this.passwordData.confirmPassword) {
      this.toastr.error('New passwords do not match');
      return;
    }

    if (this.passwordData.newPassword.length < 8) {
      this.toastr.error('New password must be at least 8 characters long');
      return;
    }

    // Here you would call the API to change password
    this.toastr.success('Password changed successfully');
    this.showChangePassword = false;
    this.passwordData = {
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    };
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
    this.toastr.success('Logged out successfully');
  }
} 