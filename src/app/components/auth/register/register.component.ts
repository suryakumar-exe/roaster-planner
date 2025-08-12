import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';

@Component({
    selector: 'app-register',
    standalone: true,
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        MatFormFieldModule,
        MatInputModule,
        MatButtonModule,
        MatCardModule
    ],
    template: `
        <div class="register-container">
            <mat-card>
                <mat-card-header>
                    <mat-card-title>Register</mat-card-title>
                </mat-card-header>
                <mat-card-content>
                    <form>
                        <mat-form-field appearance="outline">
                            <mat-label>Email</mat-label>
                            <input matInput type="email" placeholder="Enter your email">
                        </mat-form-field>
                        
                        <mat-form-field appearance="outline">
                            <mat-label>Password</mat-label>
                            <input matInput type="password" placeholder="Enter your password">
                        </mat-form-field>
                        
                        <mat-form-field appearance="outline">
                            <mat-label>Confirm Password</mat-label>
                            <input matInput type="password" placeholder="Confirm your password">
                        </mat-form-field>
                        
                        <button mat-raised-button color="primary" type="submit">
                            Register
                        </button>
                    </form>
                </mat-card-content>
            </mat-card>
        </div>
    `,
    styles: [`
        .register-container {
            display: flex;
            justify-content: center;
            align-items: center;
            min-height: 100vh;
            padding: 20px;
        }
        
        mat-card {
            max-width: 400px;
            width: 100%;
        }
        
        form {
            display: flex;
            flex-direction: column;
            gap: 16px;
        }
        
        mat-form-field {
            width: 100%;
        }
        
        button {
            margin-top: 16px;
        }
    `]
})
export class RegisterComponent {
    // Component logic will be added here
} 