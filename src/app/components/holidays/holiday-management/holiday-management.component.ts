import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';

@Component({
    selector: 'app-holiday-management',
    standalone: true,
    imports: [CommonModule, MatCardModule],
    template: `
        <div class="holiday-management-container">
            <mat-card>
                <mat-card-header>
                    <mat-card-title>Holiday Management</mat-card-title>
                </mat-card-header>
                <mat-card-content>
                    <p>Holiday management functionality will be implemented here.</p>
                </mat-card-content>
            </mat-card>
        </div>
    `,
    styles: [`
        .holiday-management-container {
            padding: 20px;
        }
    `]
})
export class HolidayManagementComponent { } 