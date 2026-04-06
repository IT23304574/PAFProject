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
  constructor(private http: HttpClient) {}

  mine(userId: string): Observable<Booking[]> {
    return this.http.get<Booking[]>(`${API_BASE}/bookings/me`, { params: { userId } });
  }

  create(resourceId: string, startTime: string, endTime: string, userId: string): Observable<Booking> {
    return this.http.post<Booking>(`${API_BASE}/bookings`, { resourceId, startTime, endTime, userId });
  }
}
