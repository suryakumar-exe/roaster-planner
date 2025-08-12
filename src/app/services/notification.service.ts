import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { JsonDatabaseService } from './json-database.service';

export interface Notification {
    id: number;
    userId: number;
    title: string;
    message: string;
    type: 'info' | 'warning' | 'error' | 'success';
    isRead: boolean;
    createdAt: string;
}

export interface CreateNotificationRequest {
    userId: number;
    title: string;
    message: string;
    type: 'info' | 'warning' | 'error' | 'success';
    isRead?: boolean;
}

@Injectable({
    providedIn: 'root'
})
export class NotificationService {
    private unreadCountSubject = new BehaviorSubject<number>(0);
    public unreadCount$ = this.unreadCountSubject.asObservable();
    public notifications$ = this.getNotifications();

    constructor(private jsonDatabaseService: JsonDatabaseService) {
        this.updateUnreadCount();
    }

    getNotifications(): Observable<Notification[]> {
        const notifications = this.jsonDatabaseService.getNotifications();
        return of(notifications);
    }

    get unreadCount(): number {
        return this.unreadCountSubject.value;
    }

    getNotificationCount(): Observable<number> {
        const count = this.jsonDatabaseService.getUnreadNotificationCount();
        return of(count);
    }

    markAsRead(id: number): Observable<boolean> {
        const success = this.jsonDatabaseService.markNotificationAsRead(id);
        if (success) {
            this.updateUnreadCount();
        }
        return of(success);
    }

    markAllAsRead(): Observable<void> {
        this.jsonDatabaseService.markAllNotificationsAsRead();
        this.updateUnreadCount();
        return of(void 0);
    }

    private updateUnreadCount(): void {
        const count = this.jsonDatabaseService.getUnreadNotificationCount();
        this.unreadCountSubject.next(count);
    }
} 