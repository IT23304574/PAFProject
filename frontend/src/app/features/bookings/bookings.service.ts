import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { API_BASE } from '../../core/api';
import { Observable } from 'rxjs';

export interface Booking {
  id: string;
  resourceId: string;
  userId: string;
  startTime: string;
  endTime: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED' | 'CANCELLED';
  createdAt?: string;
}

@Injectable({ providedIn: 'root' })
export class BookingsService {
  private apiUrl = `${API_BASE}/bookings`;

  constructor(private http: HttpClient) {}

  mine(userId: string): Observable<Booking[]> {
    return this.http.get<Booking[]>(`${this.apiUrl}/me?userId=${userId}`);
  }

  create(resourceId: string, startTime: string, endTime: string, userId: string): Observable<Booking> {
    return this.http.post<Booking>(this.apiUrl, { resourceId, startTime, endTime, userId });
  }

  getOccupancy(start: string, end: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/occupancy?start=${start}&end=${end}`);
  }
}
