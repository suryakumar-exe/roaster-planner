import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { JsonDatabaseService } from '../../services/json-database.service';
import { ToastrService } from 'ngx-toastr';

@Component({
    selector: 'app-database-management',
    standalone: true,
    imports: [CommonModule, FormsModule],
    template: `
    <div class="container-fluid">
      <!-- Header -->
      <div class="row mb-4">
        <div class="col-12">
          <div class="d-flex justify-content-between align-items-center">
            <div>
              <h2>Database Management</h2>
              <p class="text-muted mb-0">Export and import your roster planner data as JSON files</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Database Statistics -->
      <div class="row mb-4">
        <div class="col-12">
          <div class="card">
            <div class="card-header">
              <h5 class="card-title mb-0"><i class="bi bi-graph-up me-2"></i>Database Statistics</h5>
            </div>
            <div class="card-body">
              <div class="row" *ngIf="databaseStats">
                <div class="col-md-2 col-sm-4 col-6 mb-3">
                  <div class="text-center">
                    <div class="h4 text-primary">{{ databaseStats.totalUsers }}</div>
                    <small class="text-muted">Users</small>
                  </div>
                </div>
                <div class="col-md-2 col-sm-4 col-6 mb-3">
                  <div class="text-center">
                    <div class="h4 text-success">{{ databaseStats.totalRosters }}</div>
                    <small class="text-muted">Rosters</small>
                  </div>
                </div>
                <div class="col-md-2 col-sm-4 col-6 mb-3">
                  <div class="text-center">
                    <div class="h4 text-info">{{ databaseStats.totalTeams }}</div>
                    <small class="text-muted">Teams</small>
                  </div>
                </div>
                <div class="col-md-2 col-sm-4 col-6 mb-3">
                  <div class="text-center">
                    <div class="h4 text-warning">{{ databaseStats.totalHolidays }}</div>
                    <small class="text-muted">Holidays</small>
                  </div>
                </div>
                <div class="col-md-2 col-sm-4 col-6 mb-3">
                  <div class="text-center">
                    <div class="h4 text-danger">{{ databaseStats.totalLeaves }}</div>
                    <small class="text-muted">Leaves</small>
                  </div>
                </div>
                <div class="col-md-2 col-sm-4 col-6 mb-3">
                  <div class="text-center">
                    <div class="h4 text-secondary">{{ databaseStats.totalNotifications }}</div>
                    <small class="text-muted">Notifications</small>
                  </div>
                </div>
              </div>
              <div class="row mt-3" *ngIf="databaseStats">
                <div class="col-12">
                  <div class="alert alert-info">
                    <small><i class="bi bi-clock me-1"></i>Last Updated: {{ databaseStats.lastUpdated | date:'medium' }}</small>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Export Section -->
      <div class="row mb-4">
        <div class="col-md-6">
          <div class="card border-success">
            <div class="card-header bg-success text-white">
              <h5 class="card-title mb-0"><i class="bi bi-download me-2"></i>Export Database</h5>
            </div>
            <div class="card-body">
              <p class="text-muted">Export all your data to a JSON file for backup or migration purposes.</p>
              <div class="d-grid">
                <button class="btn btn-success" (click)="exportDatabase()">
                  <i class="bi bi-file-earmark-arrow-down me-2"></i>Export to JSON File
                </button>
              </div>
              <div class="mt-3">
                <small class="text-muted">
                  <i class="bi bi-info-circle me-1"></i>
                  This will download a JSON file containing all users, rosters, teams, holidays, leaves, and notifications.
                </small>
              </div>
            </div>
          </div>
        </div>

        <!-- Import Section -->
        <div class="col-md-6">
          <div class="card border-primary">
            <div class="card-header bg-primary text-white">
              <h5 class="card-title mb-0"><i class="bi bi-upload me-2"></i>Import Database</h5>
            </div>
            <div class="card-body">
              <p class="text-muted">Import data from a previously exported JSON file.</p>
              <div class="mb-3">
                <input type="file" 
                       class="form-control" 
                       accept=".json"
                       (change)="onFileSelected($event)"
                       #fileInput>
              </div>
              <div class="d-grid">
                <button class="btn btn-primary" 
                        (click)="importDatabase()"
                        [disabled]="!selectedFile">
                  <i class="bi bi-file-earmark-arrow-up me-2"></i>Import from JSON File
                </button>
              </div>
              <div class="mt-3">
                <small class="text-muted">
                  <i class="bi bi-exclamation-triangle me-1"></i>
                  Warning: This will replace all existing data with the imported data.
                </small>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Database Actions -->
      <div class="row mb-4">
        <div class="col-12">
          <div class="card border-warning">
            <div class="card-header bg-warning text-dark">
              <h5 class="card-title mb-0"><i class="bi bi-gear me-2"></i>Database Actions</h5>
            </div>
            <div class="card-body">
              <div class="row">
                <div class="col-md-4">
                  <div class="d-grid">
                    <button class="btn btn-outline-info" (click)="refreshStats()">
                      <i class="bi bi-arrow-clockwise me-2"></i>Refresh Statistics
                    </button>
                  </div>
                </div>
                <div class="col-md-4">
                  <div class="d-grid">
                    <button class="btn btn-outline-secondary" (click)="viewDatabaseStructure()">
                      <i class="bi bi-eye me-2"></i>View Database Structure
                    </button>
                  </div>
                </div>
                <div class="col-md-4">
                  <div class="d-grid">
                    <button class="btn btn-outline-danger" (click)="clearDatabase()">
                      <i class="bi bi-trash me-2"></i>Clear All Data
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Database Structure Modal -->
      <div class="modal fade" id="databaseStructureModal" tabindex="-1">
        <div class="modal-dialog modal-lg">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title">Database Structure</h5>
              <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
            </div>
            <div class="modal-body">
              <pre class="bg-light p-3 rounded">{{ databaseStructure | json }}</pre>
            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
    styles: [`
    .card {
      box-shadow: 0 0.125rem 0.25rem rgba(0, 0, 0, 0.075);
    }
    
    .card-header {
      border-bottom: 1px solid rgba(0, 0, 0, 0.125);
    }
    
    pre {
      font-size: 0.875rem;
      max-height: 400px;
      overflow-y: auto;
    }
  `]
})
export class DatabaseManagementComponent implements OnInit {
    databaseStats: any = null;
    selectedFile: File | null = null;
    databaseStructure: any = null;

    constructor(
        private jsonDatabaseService: JsonDatabaseService,
        private toastr: ToastrService
    ) { }

    ngOnInit() {
        this.loadDatabaseStats();
    }

    loadDatabaseStats() {
        this.databaseStats = this.jsonDatabaseService.getDatabaseStats();
    }

    refreshStats() {
        this.loadDatabaseStats();
        this.toastr.success('Database statistics refreshed', 'Success');
    }

    exportDatabase() {
        try {
            this.jsonDatabaseService.exportToJsonFile();
            this.toastr.success('Database exported successfully', 'Success');
        } catch (error) {
            console.error('Error exporting database:', error);
            this.toastr.error('Failed to export database', 'Error');
        }
    }

    onFileSelected(event: any) {
        const file = event.target.files[0];
        if (file && file.type === 'application/json') {
            this.selectedFile = file;
            this.toastr.info(`File selected: ${file.name}`, 'File Selected');
        } else {
            this.toastr.error('Please select a valid JSON file', 'Error');
            this.selectedFile = null;
        }
    }

    async importDatabase() {
        if (!this.selectedFile) {
            this.toastr.error('Please select a file first', 'Error');
            return;
        }

        try {
            await this.jsonDatabaseService.importFromJsonFile(this.selectedFile);
            this.toastr.success('Database imported successfully', 'Success');
            this.loadDatabaseStats();
            this.selectedFile = null;
            // Reset file input
            const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
            if (fileInput) {
                fileInput.value = '';
            }
        } catch (error) {
            console.error('Error importing database:', error);
            this.toastr.error('Failed to import database. Please check the file format.', 'Error');
        }
    }

    viewDatabaseStructure() {
        try {
            const data = this.jsonDatabaseService.exportData();
            this.databaseStructure = data;

            // Show modal using Bootstrap
            const modal = new (window as any).bootstrap.Modal(document.getElementById('databaseStructureModal'));
            modal.show();
        } catch (error) {
            console.error('Error viewing database structure:', error);
            this.toastr.error('Failed to load database structure', 'Error');
        }
    }

    clearDatabase() {
        if (confirm('Are you sure you want to clear all data? This action cannot be undone.')) {
            try {
                this.jsonDatabaseService.clearAllData();
                this.toastr.success('All data cleared successfully', 'Success');
                this.loadDatabaseStats();
            } catch (error) {
                console.error('Error clearing database:', error);
                this.toastr.error('Failed to clear database', 'Error');
            }
        }
    }
} 