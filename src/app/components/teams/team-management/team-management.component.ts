import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TeamsService, Team } from '../../../services/teams.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-team-management',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="container-fluid">
      <div class="row mb-4">
        <div class="col-12">
          <div class="d-flex justify-content-between align-items-center">
            <h2>Team Management</h2>
            <button class="btn btn-primary" (click)="showAddForm = true">
              <i class="bi bi-plus-circle me-2"></i>Add Team
            </button>
          </div>
        </div>
      </div>

      <!-- Add Team Form -->
      <div class="row mb-4" *ngIf="showAddForm">
        <div class="col-12">
          <div class="card">
            <div class="card-header">
              <h5 class="card-title mb-0">Add New Team</h5>
            </div>
            <div class="card-body">
              <form (ngSubmit)="addTeam()" #teamForm="ngForm">
                <div class="row">
                  <div class="col-md-6 mb-3">
                    <label for="name" class="form-label">Team Name</label>
                    <input
                      type="text"
                      class="form-control"
                      id="name"
                      name="name"
                      [(ngModel)]="newTeam.name"
                      required
                      minlength="2"
                    >
                  </div>
                  <div class="col-md-6 mb-3">
                    <label for="description" class="form-label">Description</label>
                    <input
                      type="text"
                      class="form-control"
                      id="description"
                      name="description"
                      [(ngModel)]="newTeam.description"
                    >
                  </div>
                </div>

                <div class="row">
                  <div class="col-md-6 mb-3">
                    <label for="isActive" class="form-label">Status</label>
                    <select
                      class="form-select"
                      id="isActive"
                      name="isActive"
                      [(ngModel)]="newTeam.isActive"
                    >
                      <option [value]="true">Active</option>
                      <option [value]="false">Inactive</option>
                    </select>
                  </div>
                </div>

                <div class="d-flex gap-2">
                  <button type="submit" class="btn btn-primary" [disabled]="!teamForm.valid">
                    Add Team
                  </button>
                  <button type="button" class="btn btn-secondary" (click)="cancelAdd()">
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>

      <!-- Edit Team Form -->
      <div class="row mb-4" *ngIf="showEditForm">
        <div class="col-12">
          <div class="card">
            <div class="card-header">
              <h5 class="card-title mb-0">Edit Team</h5>
            </div>
            <div class="card-body">
              <form (ngSubmit)="updateTeam()" #editForm="ngForm">
                <div class="row">
                  <div class="col-md-6 mb-3">
                    <label for="editName" class="form-label">Team Name</label>
                    <input
                      type="text"
                      class="form-control"
                      id="editName"
                      name="editName"
                      [(ngModel)]="editTeamData.name"
                      required
                      minlength="2"
                    >
                  </div>
                  <div class="col-md-6 mb-3">
                    <label for="editDescription" class="form-label">Description</label>
                    <input
                      type="text"
                      class="form-control"
                      id="editDescription"
                      name="editDescription"
                      [(ngModel)]="editTeamData.description"
                    >
                  </div>
                </div>

                <div class="row">
                  <div class="col-md-6 mb-3">
                    <label for="editIsActive" class="form-label">Status</label>
                    <select
                      class="form-select"
                      id="editIsActive"
                      name="editIsActive"
                      [(ngModel)]="editTeamData.isActive"
                    >
                      <option [value]="true">Active</option>
                      <option [value]="false">Inactive</option>
                    </select>
                  </div>
                </div>

                <div class="d-flex gap-2">
                  <button type="submit" class="btn btn-primary" [disabled]="!editForm.valid">
                    Update Team
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

      <!-- Teams List -->
      <div class="row">
        <div class="col-12">
          <div class="card">
            <div class="card-header">
              <h5 class="card-title mb-0">All Teams</h5>
            </div>
            <div class="card-body">
              <div class="table-responsive">
                <table class="table table-striped">
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Name</th>
                      <th>Description</th>
                      <th>Status</th>
                      <th>Created</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr *ngFor="let team of teams">
                      <td>{{ team.id }}</td>
                      <td>{{ team.name }}</td>
                      <td>{{ team.description || 'N/A' }}</td>
                      <td>
                        <span class="badge" [class.bg-success]="team.isActive" [class.bg-danger]="!team.isActive">
                          {{ team.isActive ? 'Active' : 'Inactive' }}
                        </span>
                      </td>
                      <td>{{ team.createdAt | date:'MMM dd, yyyy' }}</td>
                      <td>
                        <div class="btn-group">
                          <button class="btn btn-sm btn-outline-primary" (click)="editTeam(team)">
                            <i class="bi bi-pencil"></i>
                          </button>
                          <button class="btn btn-sm btn-outline-danger" (click)="deleteTeam(team.id)">
                            <i class="bi bi-trash"></i>
                          </button>
                        </div>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <div *ngIf="teams.length === 0" class="text-center text-muted py-5">
                <i class="bi bi-diagram-3 fs-1"></i>
                <h5 class="mt-3">No teams found</h5>
                <p>Add your first team to get started!</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `
})
export class TeamManagementComponent implements OnInit {
  teams: Team[] = [];
  showAddForm = false;
  showEditForm = false;
  editingTeam: Team | null = null;

  newTeam = {
    name: '',
    description: '',
    isActive: true,
    memberCount: 0,
    createdBy: 1 // Default to admin user ID
  };

  editTeamData = {
    name: '',
    description: '',
    isActive: true
  };

  constructor(
    private teamsService: TeamsService,
    private toastr: ToastrService
  ) { }

  ngOnInit() {
    this.loadTeams();
  }

  loadTeams() {
    this.teamsService.getTeams().subscribe({
      next: (response: any) => {
        // Handle both direct array response and response.data format
        this.teams = Array.isArray(response) ? response : (response.data || []);
        console.log('Loaded teams:', this.teams);
      },
      error: (error: any) => {
        console.error('Error loading teams:', error);
        this.toastr.error('Failed to load teams');
      }
    });
  }

  addTeam() {
    if (!this.newTeam.name) {
      this.toastr.error('Please enter a team name');
      return;
    }

    this.teamsService.createTeam(this.newTeam).subscribe({
      next: (response: any) => {
        this.toastr.success('Team created successfully');
        this.loadTeams();
        this.cancelAdd();
      },
      error: (error: any) => {
        console.error('Error creating team:', error);
        this.toastr.error('Failed to create team');
      }
    });
  }

  editTeam(team: Team) {
    this.editingTeam = team;
    this.editTeamData = {
      name: team.name,
      description: team.description || '',
      isActive: team.isActive
    };
    this.showEditForm = true;
    this.showAddForm = false;
  }

  updateTeam() {
    if (!this.editTeamData.name) {
      this.toastr.error('Please enter a team name');
      return;
    }

    if (!this.editingTeam) {
      this.toastr.error('No team selected for editing');
      return;
    }

    this.teamsService.updateTeam(this.editingTeam.id, this.editTeamData).subscribe({
      next: (response: any) => {
        this.toastr.success('Team updated successfully');
        this.loadTeams();
        this.cancelEdit();
      },
      error: (error: any) => {
        console.error('Error updating team:', error);
        this.toastr.error('Failed to update team');
      }
    });
  }

  deleteTeam(id: number) {
    if (confirm('Are you sure you want to delete this team?')) {
      this.teamsService.deleteTeam(id).subscribe({
        next: (response: any) => {
          this.toastr.success('Team deleted successfully');
          this.loadTeams();
        },
        error: (error: any) => {
          console.error('Error deleting team:', error);
          this.toastr.error('Failed to delete team');
        }
      });
    }
  }

  cancelAdd() {
    this.showAddForm = false;
    this.newTeam = {
      name: '',
      description: '',
      isActive: true,
      memberCount: 0,
      createdBy: 1
    };
  }

  cancelEdit() {
    this.showEditForm = false;
    this.editingTeam = null;
    this.editTeamData = {
      name: '',
      description: '',
      isActive: true
    };
  }
} 