import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { API_BASE } from '../../core/api';
import { AuthStore } from '../../core/auth.store';
import { tap } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AuthService {
  constructor(private http: HttpClient, private store: AuthStore) {}

  login(username: string, password: string) {
    return this.http.post<any>(`${API_BASE}/auth/login`, { username, password }).pipe(
      tap(user => {
        localStorage.setItem('user', JSON.stringify(user));
        this.store.token = user.id || 'logged_in';
      })
    );
  }

  register(payload: any) {
    return this.http.post<any>(`${API_BASE}/auth/register`, payload);
  }

  loginWithGoogleIdToken(token: string, role?: string) {
    return this.http.post<any>(`${API_BASE}/auth/google`, { idToken: token, role }).pipe(
      tap(user => {
        localStorage.setItem('user', JSON.stringify(user));
        this.store.token = user.id || 'logged_in';
      })
    );
  }

  logout() {
    localStorage.removeItem('user');
    this.store.logout();
  }

  getCurrentUser(): any {
    const raw = localStorage.getItem('user');
    return raw ? JSON.parse(raw) : null;
  }

  isAdmin(): boolean {
    return this.getCurrentUser()?.role === 'ROLE_ADMIN';
  }

  isTechnician(): boolean {
    return this.getCurrentUser()?.role === 'ROLE_TECHNICIAN';
  }
}