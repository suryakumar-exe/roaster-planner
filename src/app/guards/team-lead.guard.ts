import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const teamLeadGuard = () => {
    const authService = inject(AuthService);
    const router = inject(Router);

    if (authService.isLoggedIn() && (authService.isAdmin() || authService.isTeamLead())) {
        return true;
    } else {
        router.navigate(['/dashboard']);
        return false;
    }
}; 