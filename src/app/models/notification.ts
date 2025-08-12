export interface Notification {
    id: number;
    userId: number;
    title: string;
    message: string;
    type: 'info' | 'success' | 'warning' | 'error';
    isRead: boolean;
    createdAt: string;
    updatedAt: string;
}

export interface CreateNotificationRequest {
    userId: number;
    title: string;
    message: string;
    type: 'info' | 'success' | 'warning' | 'error';
    isRead?: boolean;
}

export interface UpdateNotificationRequest {
    title?: string;
    message?: string;
    type?: 'info' | 'success' | 'warning' | 'error';
    isRead?: boolean;
} 