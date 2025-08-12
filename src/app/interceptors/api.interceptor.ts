import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';

export const apiInterceptor: HttpInterceptorFn = (req, next) => {
    const router = inject(Router);

    // Add auth token to requests
    let modifiedReq = req;
    const token = localStorage.getItem('token');
    if (token) {
        modifiedReq = req.clone({
            setHeaders: {
                Authorization: `Bearer ${token}`
            }
        });
    }

    return next(modifiedReq).pipe(
        catchError((error: HttpErrorResponse) => {
            if (error.status === 401) {
                // Unauthorized - redirect to login
                localStorage.removeItem('token');
                localStorage.removeItem('expiresAt');
                router.navigate(['/login']);
            }
            return throwError(() => error);
        })
    );
}; 