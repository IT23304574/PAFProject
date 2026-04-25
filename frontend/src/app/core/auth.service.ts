import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

export interface User {
  id: string;
  username: string;
  fullName: string;
  role: string;
}

export interface LoginRequest {
  username: string;
  password: string;
}

export interface RegisterRequest {
  username: string;
  password: string;
  fullName: string;
  role: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:8080/api/v1/auth';
  private currentUser: User | null = null;

  constructor(private http: HttpClient) {
    // Set Default Admin User (No login required)
    this.setDefaultAdmin();
  }

  // Set Default Admin User
  private setDefaultAdmin(): void {
    const defaultAdmin: User = {
      id: 'default-admin-001',
      username: 'admin@smartcampus.com',
      fullName: 'System Administrator',
      role: 'ROLE_ADMIN'
    };
    this.currentUser = defaultAdmin;
    localStorage.setItem('user', JSON.stringify(defaultAdmin));
    console.log('Default Admin Mode: Active');
  }

  // Register new user
  register(userData: RegisterRequest): Observable<User> {
    return this.http.post<User>(`${this.apiUrl}/register`, userData);
  }

  // Login user
  login(credentials: LoginRequest): Observable<User> {
    return this.http.post<User>(`${this.apiUrl}/login`, credentials).pipe(
      tap(user => {
        this.currentUser = user;
        localStorage.setItem('user', JSON.stringify(user));
        console.log('Login successful:', user);
      })
    );
  }

  // Google OAuth Login
  loginWithGoogleIdToken(token: string): Observable<User> {
    return this.http.post<User>(`${this.apiUrl}/google`, { idToken: token }).pipe(
      tap(user => {
        this.currentUser = user;
        localStorage.setItem('user', JSON.stringify(user));
        console.log('Google login successful:', user);
      })
    );
  }

  // Logout (reset to default admin)
  logout(): void {
    this.setDefaultAdmin();
    console.log('Reset to Default Admin Mode');
  }

  // Get current user
  getCurrentUser(): User | null {
    return this.currentUser;
  }

  // Check if user is admin (always true in default mode)
  isAdmin(): boolean {
    return true;  // Always admin in default mode
  }

  // Check if user is logged in (always true in default mode)
  isLoggedIn(): boolean {
    return true;  // Always logged in
  }
}