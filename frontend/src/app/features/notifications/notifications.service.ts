import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { API_BASE } from '../../core/api';

export interface Notification {
  id: string;
  title: string;
  message: string;
  read: boolean;
  createdAt: string;
  type?: string;
}

@Injectable({ providedIn: 'root' })
export class NotificationsService {
  constructor(private http: HttpClient) {}

  unread(userId: string) {
    return this.http.get<Notification[]>(`${API_BASE}/notifications/unread`, { params: { userId } });
  }

  markAllRead(userId: string) {
    return this.http.post<void>(`${API_BASE}/notifications/mark-all-read`, {}, { params: { userId } });
  }

  markAsRead(notificationId: string, userId: string) {
    return this.http.post<void>(`${API_BASE}/notifications/${notificationId}/mark-read`, {}, { params: { userId } });
  }
}
