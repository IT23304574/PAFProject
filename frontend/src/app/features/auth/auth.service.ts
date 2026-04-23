import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { API_BASE } from '../../core/api';
import { AuthStore } from '../../core/auth.store';
import { map, tap } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AuthService {
  constructor(private http: HttpClient, private store: AuthStore) {}

  login(username: string, password: string) {
    return this.http.post<any>(`${API_BASE}/auth/login`, { username, password }).pipe(
      tap(user => {
        // Store user info and set a placeholder token
        localStorage.setItem('user', JSON.stringify(user));
        localStorage.setItem('sc_token', 'logged_in');
        this.store.token = 'logged_in';
      })
    );
  }

  register(user: any) {
    return this.http.post<any>(`${API_BASE}/auth/register`, user);
  }

  loginWithGoogleIdToken(token: string) {
    console.log('Sending Google Token to backend...');
    // Sending as 'idToken' is the standard for most Spring Boot tutorials/libraries
    return this.http.post<any>(`${API_BASE}/auth/google`, { 
      idToken: token,
      token: token 
    }).pipe(
      tap(user => {
        localStorage.setItem('user', JSON.stringify(user));
        localStorage.setItem('sc_token', 'logged_in');
        this.store.token = 'logged_in';
      })
    );
  }

  logout() {
    localStorage.removeItem('user');
    localStorage.removeItem('sc_token');
    this.store.logout();
  }
}
