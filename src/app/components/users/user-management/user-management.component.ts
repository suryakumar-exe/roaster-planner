import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UsersService } from '../../../services/users.service';
import { TeamsService } from '../../../services/teams.service';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-user-management',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="container-fluid">
      <div class="row mb-4">
        <div class="col-12">
          <div class="d-flex justify-content-between align-items-center">
            <h2>User Management</h2>
            <button class="btn btn-primary" (click)="showCreateForm = true">
              <i class="bi bi-plus-circle me-2"></i>Add User
            </button>
          </div>
        </div>
      </div>

      <!-- Create User Form -->
      <div class="row mb-4" *ngIf="showCreateForm">
        <div class="col-12">
          <div class="card">
            <div class="card-header">
              <h5 class="card-title mb-0">Add New User</h5>
            </div>
            <div class="card-body">
              <form (ngSubmit)="createUser()" #userForm="ngForm">
                <div class="row">
                  <div class="col-md-6 mb-3">
                    <label for="firstName" class="form-label">First Name</label>
                    <input
                      type="text"
                      class="form-control"
                      id="firstName"
                      name="firstName"
                      [(ngModel)]="newUser.firstName"
                      required
                      minlength="2"
                    >
                  </div>
                  <div class="col-md-6 mb-3">
                    <label for="lastName" class="form-label">Last Name</label>
                    <input
                      type="text"
                      class="form-control"
                      id="lastName"
                      name="lastName"
                      [(ngModel)]="newUser.lastName"
                      required
                      minlength="2"
                    >
                  </div>
                </div>

                <div class="row">
                  <div class="col-md-6 mb-3">
                    <label for="email" class="form-label">Email</label>
                    <input
                      type="email"
                      class="form-control"
                      id="email"
                      name="email"
                      [(ngModel)]="newUser.email"
                      required
                    >
                  </div>
                  <div class="col-md-6 mb-3">
                    <label for="employeeId" class="form-label">Employee ID</label>
                    <input
                      type="text"
                      class="form-control"
                      id="employeeId"
                      name="employeeId"
                      [(ngModel)]="newUser.employeeId"
                    >
                  </div>
                </div>

                <div class="row">
                  <div class="col-md-6 mb-3">
                    <label for="password" class="form-label">Password</label>
                    <input
                      type="password"
                      class="form-control"
                      id="password"
                      name="password"
                      [(ngModel)]="newUser.password"
                      required
                      minlength="8"
                    >
                  </div>
                  <div class="col-md-6 mb-3">
                    <label for="teamId" class="form-label">Team</label>
                    <select
                      class="form-select"
                      id="teamId"
                      name="teamId"
                      [(ngModel)]="newUser.teamId"
                    >
                      <option value="">Select team</option>
                      <option *ngFor="let team of teams" [value]="team.id">{{ team.name }}</option>
                    </select>
                  </div>
                </div>

                <div class="mb-3">
                    <label class="form-label">Role</label>
                    <select class="form-select" [(ngModel)]="newUser.role" name="role" required>
                      <option value="">Select Role</option>
                      <option value="Admin">Admin</option>
                      <option value="TeamLead">Team Lead</option>
                      <option value="Employee">Employee</option>
                    </select>
                  </div>

                <div class="d-flex gap-2">
                  <button type="submit" class="btn btn-primary" [disabled]="!userForm.valid">
                    Create User
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

      <!-- Edit User Form -->
      <div class="row mb-4" *ngIf="showEditForm">
        <div class="col-12">
          <div class="card">
            <div class="card-header">
              <h5 class="card-title mb-0">Edit User</h5>
            </div>
            <div class="card-body">
              <form (ngSubmit)="updateUser()" #editForm="ngForm">
                <div class="row">
                  <div class="col-md-6 mb-3">
                    <label for="editFirstName" class="form-label">First Name</label>
                    <input
                      type="text"
                      class="form-control"
                      id="editFirstName"
                      name="editFirstName"
                      [(ngModel)]="editUserData.firstName"
                      required
                      minlength="2"
                    >
                  </div>
                  <div class="col-md-6 mb-3">
                    <label for="editLastName" class="form-label">Last Name</label>
                    <input
                      type="text"
                      class="form-control"
                      id="editLastName"
                      name="editLastName"
                      [(ngModel)]="editUserData.lastName"
                      required
                      minlength="2"
                    >
                  </div>
                </div>

                <div class="row">
                  <div class="col-md-6 mb-3">
                    <label for="editEmail" class="form-label">Email</label>
                    <input
                      type="email"
                      class="form-control"
                      id="editEmail"
                      name="editEmail"
                      [(ngModel)]="editUserData.email"
                      required
                    >
                  </div>
                  <div class="col-md-6 mb-3">
                    <label for="editEmployeeId" class="form-label">Employee ID</label>
                    <input
                      type="text"
                      class="form-control"
                      id="editEmployeeId"
                      name="editEmployeeId"
                      [(ngModel)]="editUserData.employeeId"
                    >
                  </div>
                </div>

                <div class="row">
                  <div class="col-md-6 mb-3">
                    <label for="editTeamId" class="form-label">Team</label>
                    <select
                      class="form-select"
                      id="editTeamId"
                      name="editTeamId"
                      [(ngModel)]="editUserData.teamId"
                    >
                      <option value="">Select team</option>
                      <option *ngFor="let team of teams" [value]="team.id">{{ team.name }}</option>
                    </select>
                  </div>
                  <div class="col-md-6 mb-3">
                    <label for="editRole" class="form-label">Role</label>
                    <select class="form-select" [(ngModel)]="editUserData.role" name="editRole" required>
                      <option value="">Select Role</option>
                      <option value="Admin">Admin</option>
                      <option value="TeamLead">Team Lead</option>
                      <option value="Employee">Employee</option>
                    </select>
                  </div>
                </div>

                <div class="d-flex gap-2">
                  <button type="submit" class="btn btn-primary" [disabled]="!editForm.valid">
                    Update User
                  </button>
                  <button type="button" class="btn btn-secondary" (click)="cancelEdit()">
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>

      <!-- Users List -->
      <div class="row">
        <div class="col-12">
          <div class="card">
            <div class="card-header">
              <h5 class="card-title mb-0">All Users</h5>
            </div>
            <div class="card-body">
              <div class="table-responsive">
                <table class="table table-striped">
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Name</th>
                      <th>Email</th>
                      <th>Role</th>
                      <th>Team</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr *ngFor="let user of users">
                      <td>{{ user.id }}</td>
                      <td>{{ user.firstName }} {{ user.lastName }}</td>
                      <td>{{ user.email }}</td>
                      <td>
                        <span class="badge bg-primary">{{ user.role }}</span>
                      </td>
                      <td>{{ getTeamName(user.teamId) }}</td>
                      <td>
                        <span class="badge" [class.bg-success]="user.isActive" [class.bg-danger]="!user.isActive">
                          {{ user.isActive ? 'Active' : 'Inactive' }}
                        </span>
                      </td>
                      <td>
                        <div class="btn-group">
                          <button class="btn btn-sm btn-outline-primary" (click)="editUser(user)">
                            <i class="bi bi-pencil"></i>
                          </button>
                          <button class="btn btn-sm btn-outline-danger" (click)="deleteUser(user.id)">
                            <i class="bi bi-trash"></i>
                          </button>
                        </div>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <div *ngIf="users.length === 0" class="text-center text-muted py-5">
                <i class="bi bi-people fs-1"></i>
                <h5 class="mt-3">No users found</h5>
                <p>Add your first user to get started!</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `
})
export class UserManagementComponent implements OnInit {
  users: any[] = [];
  teams: any[] = [];
  showCreateForm = false;
  showEditForm = false;
  editingUser: any = null;

  newUser = {
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    employeeId: '',
    teamId: '',
    role: '' as 'Admin' | 'TeamLead' | 'Employee'
  };

  editUserData = {
    firstName: '',
    lastName: '',
    email: '',
    employeeId: '',
    teamId: '',
    role: '' as 'Admin' | 'TeamLead' | 'Employee'
  };

  constructor(
    private usersService: UsersService,
    private teamsService: TeamsService,
    private toastr: ToastrService,
    private authService: AuthService
  ) { }

  ngOnInit() {
    this.loadUsers();
    this.loadTeams();
    this.testBackendConnection();
  }

  testBackendConnection() {
    console.log('Testing backend connection...');
    this.usersService.getUsers().subscribe({
      next: (response: any) => {
        console.log('Backend connection successful:', response);
      },
      error: (error: any) => {
        console.error('Backend connection failed:', error);
        this.toastr.error('Cannot connect to backend server');
      }
    });
  }

  loadUsers() {
    this.usersService.getUsers().subscribe({
      next: (response: any) => {
        // Handle both direct array response and response.data format
        this.users = Array.isArray(response) ? response : (response.data || []);
        console.log('Loaded users:', this.users);
      },
      error: (error: any) => {
        console.error('Error loading users:', error);
        this.toastr.error('Failed to load users');
      }
    });
  }

  loadTeams() {
    this.teamsService.getTeams().subscribe({
      next: (response: any) => {
        console.log('Teams response:', response);
        // Handle both direct array response and response.data format
        this.teams = Array.isArray(response) ? response : (response.data || []);
        console.log('Teams loaded:', this.teams);
      },
      error: (error: any) => {
        console.error('Error loading teams:', error);
      }
    });
  }

  createUser() {
    if (!this.newUser.firstName || !this.newUser.lastName || !this.newUser.email || !this.newUser.password) {
      this.toastr.error('Please fill in all required fields');
      return;
    }

    if (!this.newUser.role) {
      this.toastr.error('Please select a role for the user');
      return;
    }

    console.log('Sending user data:', this.newUser);

    const userData = {
      ...this.newUser,
      teamId: this.newUser.teamId ? parseInt(this.newUser.teamId) : undefined,
      isActive: true,
      emailVerified: true
    };

    console.log('Processed user data:', userData);
    console.log('Current auth token:', this.authService.getToken());

    this.usersService.createUser(userData).subscribe({
      next: (response: any) => {
        console.log('Create user response:', response);
        this.toastr.success('User created successfully');
        this.loadUsers();
        this.cancelCreate();
      },
      error: (error: any) => {
        console.error('Error creating user:', error);
        console.error('Error status:', error.status);
        console.error('Error statusText:', error.statusText);
        console.error('Error response:', error.error);
        console.error('Error message:', error.message);
        this.toastr.error('Failed to create user');
      }
    });
  }

  editUser(user: any) {
    this.editingUser = user;
    this.editUserData = {
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      employeeId: user.employeeId || '',
      teamId: user.teamId || '',
      role: user.role
    };
    this.showEditForm = true;
    this.showCreateForm = false;
  }

  updateUser() {
    if (!this.editUserData.firstName || !this.editUserData.lastName || !this.editUserData.email || !this.editUserData.role) {
      this.toastr.error('Please fill in all required fields');
      return;
    }

    const updateData = {
      ...this.editUserData,
      teamId: this.editUserData.teamId ? parseInt(this.editUserData.teamId) : undefined
    };

    this.usersService.updateUser(this.editingUser.id, updateData).subscribe({
      next: (response: any) => {
        this.toastr.success('User updated successfully');
        this.loadUsers();
        this.cancelEdit();
      },
      error: (error: any) => {
        console.error('Error updating user:', error);
        this.toastr.error('Failed to update user');
      }
    });
  }

  cancelEdit() {
    this.showEditForm = false;
    this.editingUser = null;
    this.editUserData = {
      firstName: '',
      lastName: '',
      email: '',
      employeeId: '',
      teamId: '',
      role: '' as 'Admin' | 'TeamLead' | 'Employee'
    };
  }

  deleteUser(id: number) {
    console.log('Attempting to delete user with ID:', id);
    console.log('Current user:', this.authService.getCurrentUser());
    console.log('Is admin:', this.authService.isAdmin());

    if (confirm('Are you sure you want to delete this user?')) {
      this.usersService.deleteUser(id).subscribe({
        next: (response: any) => {
          console.log('Delete response:', response);
          this.toastr.success('User deleted successfully');
          this.loadUsers();
        },
        error: (error: any) => {
          console.error('Error deleting user:', error);
          console.error('Error response:', error.error);
          this.toastr.error('Failed to delete user');
        }
      });
    }
  }

  getTeamName(teamId: number): string {
    const team = this.teams.find(t => t.id === teamId);
    return team ? team.name : 'N/A';
  }

  cancelCreate() {
    this.showCreateForm = false;
    this.newUser = {
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      employeeId: '',
      teamId: '',
      role: '' as 'Admin' | 'TeamLead' | 'Employee'
    };
  }
} 