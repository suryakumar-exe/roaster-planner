import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';

@Component({
    selector: 'app-roster-management',
    standalone: true,
    imports: [CommonModule, MatCardModule],
    template: `
        <div class="roster-management-container">
            <mat-card>
                <mat-card-header>
                    <mat-card-title>Roster Management</mat-card-title>
                </mat-card-header>
                <mat-card-content>
                    <p>Roster management functionality will be implemented here.</p>
                </mat-card-content>
            </mat-card>
        </div>
    `,
    styles: [`
        .roster-management-container {
            padding: 20px;
        }
    `]
})
export class RosterManagementComponent { } 