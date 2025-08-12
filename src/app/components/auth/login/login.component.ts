import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="login-container">
      <div class="login-background"></div>
      <div class="login-content">
        <div class="login-card">
          <div class="login-header">
            <div class="logo">
              <i class="bi bi-calendar-check"></i>
            </div>
            <h1>WorkWise</h1>
            <p>Sign in to your account</p>
          </div>

          <form (ngSubmit)="onSubmit()" class="login-form">
            <div class="form-group">
              <label for="email">Email address</label>
              <div class="input-group">
                <i class="bi bi-envelope"></i>
                <input
                  type="email"
                  id="email"
                  name="email"
                  [(ngModel)]="loginData.email"
                  required
                  email
                  placeholder="Enter your email"
                  [class.error]="!loginData.email && submitted"
                >
              </div>
              <div class="error-message" *ngIf="!loginData.email && submitted">
                Please enter your email address.
              </div>
            </div>

            <div class="form-group">
              <label for="password">Password</label>
              <div class="input-group">
                <i class="bi bi-lock"></i>
                <input
                  type="password"
                  id="password"
                  name="password"
                  [(ngModel)]="loginData.password"
                  required
                  placeholder="Enter your password"
                  [class.error]="!loginData.password && submitted"
                >
              </div>
              <div class="error-message" *ngIf="!loginData.password && submitted">
                Please enter your password.
              </div>
            </div>

            <button type="submit" class="login-btn" [disabled]="isLoading">
              <span *ngIf="isLoading" class="spinner"></span>
              {{ isLoading ? 'Signing in...' : 'Sign In' }}
            </button>
          </form>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .login-container {
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      position: relative;
      overflow: hidden;
    }

    .login-background {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      z-index: -1;
    }

    .login-background::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><defs><pattern id="grain" width="100" height="100" patternUnits="userSpaceOnUse"><circle cx="25" cy="25" r="1" fill="white" opacity="0.1"/><circle cx="75" cy="75" r="1" fill="white" opacity="0.1"/><circle cx="50" cy="10" r="0.5" fill="white" opacity="0.1"/><circle cx="10" cy="60" r="0.5" fill="white" opacity="0.1"/><circle cx="90" cy="40" r="0.5" fill="white" opacity="0.1"/></pattern></defs><rect width="100" height="100" fill="url(%23grain)"/></svg>');
      opacity: 0.3;
    }

    .login-content {
      width: 100%;
      max-width: 500px;
      padding: 20px;
    }

    .login-card {
      background: rgba(255, 255, 255, 0.95);
      backdrop-filter: blur(20px);
      border-radius: 20px;
      padding: 40px;
      box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
      border: 1px solid rgba(255, 255, 255, 0.2);
    }

    .login-header {
      text-align: center;
      margin-bottom: 30px;
    }

    .logo {
      width: 60px;
      height: 60px;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      margin: 0 auto 20px;
      color: white;
      font-size: 24px;
    }

    .login-header h1 {
      color: #333;
      font-size: 28px;
      font-weight: 700;
      margin: 0 0 10px;
    }

    .login-header p {
      color: #666;
      margin: 0;
      font-size: 16px;
    }

    .login-form {
      margin-bottom: 30px;
    }

    .form-group {
      margin-bottom: 20px;
    }

    .form-group label {
      display: block;
      color: #333;
      font-weight: 600;
      margin-bottom: 8px;
      font-size: 14px;
    }

    .input-group {
      position: relative;
      display: flex;
      align-items: center;
    }

    .input-group i {
      position: absolute;
      left: 15px;
      color: #999;
      font-size: 16px;
      z-index: 1;
    }

    .input-group input {
      width: 100%;
      padding: 15px 15px 15px 45px;
      border: 2px solid #e1e5e9;
      border-radius: 12px;
      font-size: 16px;
      transition: all 0.3s ease;
      background: white;
    }

    .input-group input:focus {
      outline: none;
      border-color: #667eea;
      box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
    }

    .input-group input.error {
      border-color: #dc3545;
    }

    .error-message {
      color: #dc3545;
      font-size: 12px;
      margin-top: 5px;
    }

    .login-btn {
      width: 100%;
      padding: 15px;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      border: none;
      border-radius: 12px;
      font-size: 16px;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.3s ease;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 10px;
    }

    .login-btn:hover:not(:disabled) {
      transform: translateY(-2px);
      box-shadow: 0 10px 20px rgba(102, 126, 234, 0.3);
    }

    .login-btn:disabled {
      opacity: 0.7;
      cursor: not-allowed;
    }

    .spinner {
      width: 20px;
      height: 20px;
      border: 2px solid rgba(255, 255, 255, 0.3);
      border-top: 2px solid white;
      border-radius: 50%;
      animation: spin 1s linear infinite;
    }

    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }

    .demo-credentials {
      background: #f8f9fa;
      border-radius: 12px;
      padding: 20px;
      border: 1px solid #e9ecef;
    }

    .demo-credentials h6 {
      color: #333;
      font-weight: 600;
      margin: 0 0 15px;
      text-align: center;
    }

    .credential-item {
      display: flex;
      align-items: center;
      margin-bottom: 10px;
      gap: 10px;
    }

    .credential-item:last-child {
      margin-bottom: 0;
    }

    .role {
      padding: 4px 8px;
      border-radius: 6px;
      font-size: 12px;
      font-weight: 600;
      color: white;
      min-width: 60px;
      text-align: center;
    }

    .role.admin {
      background: #dc3545;
    }

    .role.teamlead {
      background: #28a745;
    }

    .role.employee {
      background: #007bff;
    }

    .credentials {
      color: #666;
      font-size: 13px;
      font-family: 'Courier New', monospace;
    }

    @media (max-width: 480px) {
      .login-content {
        padding: 10px;
      }
      
      .login-card {
        padding: 30px 20px;
      }
      
      .login-header h1 {
        font-size: 24px;
      }
    }
  `]
})
export class LoginComponent {
  loginData = {
    email: '',
    password: ''
  };
  isLoading = false;
  submitted = false;

  constructor(
    private authService: AuthService,
    private router: Router,
    private toastr: ToastrService
  ) { }

  onSubmit() {
    this.submitted = true;

    if (this.loginData.email && this.loginData.password) {
      this.isLoading = true;
      this.authService.login(this.loginData.email, this.loginData.password).subscribe({
        next: (response: any) => {
          this.isLoading = false;
          if (response.success) {
            this.toastr.success('Login successful!');
            this.router.navigate(['/dashboard']);
          } else {
            this.toastr.error(response.message || 'Login failed');
          }
        },
        error: (error: any) => {
          this.isLoading = false;
          console.error('Login error:', error);
          this.toastr.error('Login failed. Please check your credentials.');
        }
      });
    }
  }
} 