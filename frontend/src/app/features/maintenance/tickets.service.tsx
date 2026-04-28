import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { API_BASE } from '../../core/api';
import { Observable } from 'rxjs';

export interface Ticket {
  id: string;
  resourceId: string;
  userId: string;
  category: string;
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
  status: 'OPEN' | 'IN_PROGRESS' | 'RESOLVED' | 'CLOSED';
  description: string;
  createdAt?: string;
}

@Injectable({ providedIn: 'root' })
export class TicketsService {
  constructor(private http: HttpClient) {}

  mine(userId: string): Observable<Ticket[]> {
    return this.http.get<Ticket[]>(`${API_BASE}/tickets/me`, { params: { userId } });
  }

  create(payload: { resourceId: string; category: string; priority: string; description: string; userId: string }): Observable<Ticket> {
    return this.http.post<Ticket>(`${API_BASE}/tickets`, payload);
  }

  upload(ticketId: string, file: File) {
    const form = new FormData();
    form.append('file', file);
    return this.http.post<Ticket>(`${API_BASE}/tickets/${ticketId}/attachments`, form);
  }
}
