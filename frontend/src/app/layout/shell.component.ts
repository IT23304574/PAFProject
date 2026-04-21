import { Component, OnInit } from '@angular/core';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { NotificationsPanel } from '../features/notifications/notifications.panel';
import { AuthService } from '../features/auth/auth.service';

@Component({
  standalone: true,
  selector: 'app-shell',
  imports: [RouterLink, RouterLinkActive, RouterOutlet, CommonModule, NotificationsPanel],
  template: `
    <div class="app-container">
      <header class="app-header">
        <div class="container flex-between">
          <div class="logo">
            <h1>🏫 Smart Campus Ops Hub</h1>
          </div>
          <nav class="nav-menu">
            <a routerLink="/facilities" routerLinkActive="active" [routerLinkActiveOptions]="{exact: false}">Facilities</a>
            <a routerLink="/resources" routerLinkActive="active" [routerLinkActiveOptions]="{exact: false}">Resources</a>
            <a routerLink="/bookings" routerLinkActive="active" [routerLinkActiveOptions]="{exact: false}">Bookings</a>
            <a routerLink="/tickets" routerLinkActive="active" [routerLinkActiveOptions]="{exact: false}">Tickets</a>
            <app-notifications-panel></app-notifications-panel>
            
            <div class="user-menu" *ngIf="userName; else loginBtn">
              <span class="user-name" [title]="'User ID: ' + currentUserId">Hi, {{userName}}</span>
              <button (click)="logout()" class="btn-secondary">Logout</button>
            </div>

            <ng-template #loginBtn>
              <a routerLink="/login" class="btn-secondary">Login</a>
            </ng-template>
          </nav>
        </div>
      </header>

      <main class="app-main">
        <div class="container">
          <router-outlet></router-outlet>
        </div>
      </main>

      <footer class="app-footer">
        <div class="container flex-between">
          <p>&copy; 2026 Smart Campus Operations. All rights reserved.</p>
          <p>Version 1.0.0</p>
        </div>
      </footer>
    </div>
  `,
  styles: [`
    .app-container {
      display: flex;
      flex-direction: column;
      min-height: 100vh;
      background: var(--gray-50);
    }

    .app-header {
      background: white;
      border-bottom: 1px solid var(--gray-200);
      padding: 16px 0;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
    }

    .logo h1 {
      margin: 0;
      font-size: 22px;
      color: var(--primary);
    }

    .nav-menu {
      display: flex;
      gap: 24px;
      align-items: center;
    }

    .nav-menu a {
      padding: 8px 0;
      border-bottom: 2px solid transparent;
      transition: all 0.2s;
      font-weight: 500;
      text-decoration: none;
      color: var(--gray-700);
    }

    .nav-menu a:hover {
      color: var(--primary-dark);
      text-decoration: none;
    }

    .nav-menu a.active {
      color: var(--primary);
      border-bottom-color: var(--primary);
    }

    .user-menu {
      display: flex;
      align-items: center;
      gap: 12px;
    }

    .user-name {
      font-size: 14px;
      color: var(--gray-600);
    }

    .btn-secondary {
      background: var(--gray-200) !important;
      color: var(--gray-800) !important;
      padding: 8px 16px !important;
      border-radius: 4px;
      border: none;
      cursor: pointer;
    }

    .btn-secondary:hover {
      background: var(--gray-300) !important;
    }

    .app-main {
      flex: 1;
      padding: 32px 0;
    }

    .app-footer {
      background: var(--gray-800);
      color: white;
      padding: 24px 0;
      border-top: 1px solid var(--gray-700);
      margin-top: auto;
    }

    .app-footer p {
      margin: 0;
      font-size: 13px;
    }

    .container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 0 20px;
    }

    .flex-between {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
  `]
})
export class ShellComponent implements OnInit {
  userName: string | null = null;
  currentUserId: string | null = null;

  constructor(private auth: AuthService, private router: Router) {}

  ngOnInit() {
    this.updateUser();
    // Refresh user name if login happens in another tab
    window.addEventListener('storage', () => this.updateUser());
  }

  updateUser() {
    const userStr = localStorage.getItem('user');
    if (userStr && userStr !== 'undefined') {
      const user = JSON.parse(userStr);
      if (user.id && user.id.match(/^[0-9a-fA-F]{24}$/)) {
        this.userName = user.fullName || user.username;
        this.currentUserId = user.id;
        console.log('Current Session User ID:', this.currentUserId);
      } else {
        this.logout();
      }
    } else {
      this.userName = null;
      this.currentUserId = null;
    }
  }

  logout() {
    this.auth.logout();
    this.userName = null;
    this.router.navigate(['/login']);
  }
}