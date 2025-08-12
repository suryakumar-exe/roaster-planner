import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { JsonDatabaseService } from './json-database.service';

export interface PublicHoliday {
    id: number;
    name: string;
    date: string;
    description?: string;
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
}

export interface CreateHolidayRequest {
    name: string;
    date: string;
    description?: string;
    isActive: boolean;
    createdBy: number;
}

export interface UpdateHolidayRequest {
    name?: string;
    date?: string;
    description?: string;
    isActive?: boolean;
}

@Injectable({
    providedIn: 'root'
})
export class HolidaysService {
    constructor(private jsonDatabaseService: JsonDatabaseService) { }

    getHolidays(): Observable<PublicHoliday[]> {
        return of(this.jsonDatabaseService.getHolidays());
    }

    getHolidayById(id: number): Observable<PublicHoliday | null> {
        const holidays = this.jsonDatabaseService.getHolidays();
        const holiday = holidays.find((h: PublicHoliday) => h.id === id) || null;
        return of(holiday);
    }

    createHoliday(holiday: CreateHolidayRequest): Observable<PublicHoliday> {
        const newHoliday = this.jsonDatabaseService.createHoliday(holiday);
        return of(newHoliday);
    }

    updateHoliday(id: number, holiday: UpdateHolidayRequest): Observable<PublicHoliday | null> {
        const updatedHoliday = this.jsonDatabaseService.updateHoliday(id, holiday);
        return of(updatedHoliday);
    }

    deleteHoliday(id: number): Observable<boolean> {
        const success = this.jsonDatabaseService.deleteHoliday(id);
        return of(success);
    }
} 