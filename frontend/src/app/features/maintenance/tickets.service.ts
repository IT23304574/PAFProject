import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { API_BASE } from '../../core/api';
import { Observable } from 'rxjs';

export interface Ticket {
  id: string;
  resourceId: string;
  resourceName?: string;
  userId: string;
  category: string;
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
  status: 'OPEN' | 'IN_PROGRESS' | 'RESOLVED' | 'CLOSED' | 'REJECTED';
  description: string;
  assignedTo?: string;
  resolutionNote?: string;
  rejectionReason?: string;
  contactDetails?: string;
  attachments?: string[];
  comments?: Comment[];
  createdAt?: string;
  updatedAt?: string;
}

export interface Comment {
  id: string;
  userId: string;
  userFullName: string;
  text: string;
  createdAt: string;
  updatedAt?: string;
}

@Injectable({ providedIn: 'root' })
export class TicketsService {
  constructor(private http: HttpClient) {}

  mine(): Observable<Ticket[]> {
    return this.http.get<Ticket[]>(`${API_BASE}/ticket/me`);
  }

  assigned(): Observable<Ticket[]> {
    return this.http.get<Ticket[]>(`${API_BASE}/ticket/assigned`);
  }

  all(): Observable<Ticket[]> {
    return this.http.get<Ticket[]>(`${API_BASE}/ticket`);
  }

  get(id: string): Observable<Ticket> {
    return this.http.get<Ticket>(`${API_BASE}/ticket/${id}`);
  }

  create(payload: Partial<Ticket>): Observable<Ticket> {
    return this.http.post<Ticket>(`${API_BASE}/ticket`, payload);
  }

  updateStatus(id: string, status: string, note = ''): Observable<Ticket> {
    return this.http.put<Ticket>(`${API_BASE}/ticket/${id}/status`, { status, note });
  }

  upload(ticketId: string, file: File): Observable<Ticket> {
    const form = new FormData();
    form.append('file', file);
    return this.http.post<Ticket>(`${API_BASE}/ticket/${ticketId}/attachments`, form);
  }

  addComment(ticketId: string, comment: Partial<Comment>): Observable<Ticket> {
    return this.http.post<Ticket>(`${API_BASE}/ticket/${ticketId}/comments`, comment);
  }

  updateComment(ticketId: string, commentId: string, text: string): Observable<Ticket> {
    return this.http.put<Ticket>(`${API_BASE}/ticket/${ticketId}/comments/${commentId}`, { text });
  }

  deleteComment(ticketId: string, commentId: string): Observable<Ticket> {
    return this.http.delete<Ticket>(`${API_BASE}/ticket/${ticketId}/comments/${commentId}`);
  }
}