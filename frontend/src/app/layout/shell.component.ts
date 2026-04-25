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
}

/* Header */
.app-header {
  background: var(--primary);
  border-bottom: 3px solid var(--secondary);
  padding: 0;
  position: sticky;
  top: 0;
  z-index: 100;
}

.header-inner {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 64px;
  padding: 0 24px;
  max-width: 1400px;
  margin: 0 auto;
}

/* Logo / Crest */
.logo {
  display: flex;
  align-items: center;
  gap: 12px;
  text-decoration: none;
}

.logo-crest {
  width: 38px;
  height: 38px;
  background: var(--secondary);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: 'Playfair Display', Georgia, serif;
  font-weight: 700;
  font-size: 14px;
  color: var(--primary);
  flex-shrink: 0;
}

.logo h1 {
  font-family: 'Playfair Display', Georgia, serif;
  font-size: 17px;
  font-weight: 600;
  color: var(--white);
  letter-spacing: 0.02em;
  line-height: 1.2;
}

.logo h1 span {
  display: block;
  font-family: 'Inter', sans-serif;
  font-size: 10px;
  font-weight: 400;
  color: var(--secondary-light);
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

/* Nav Menu */
.nav-menu {
  display: flex;
  gap: 4px;
  align-items: center;
}

.nav-menu a {
  font-size: 13px;
  font-weight: 500;
  color: rgba(255, 255, 255, 0.7);
  text-decoration: none;
  padding: 6px 14px;
  border-radius: var(--radius-md);
  border-bottom: 2px solid transparent;
  transition: all 0.2s ease;
  letter-spacing: 0.01em;
}

.nav-menu a:hover {
  color: var(--secondary-light);
  background: rgba(255, 255, 255, 0.06);
}

.nav-menu a.active {
  color: var(--secondary-light);
  border-bottom-color: var(--secondary);
  background: rgba(255, 255, 255, 0.06);
}

/* User Section */
.nav-user {
  display: flex;
  align-items: center;
  gap: 10px;
}

.nav-avatar {
  width: 34px;
  height: 34px;
  background: var(--secondary);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  font-weight: 600;
  color: var(--primary);
  cursor: pointer;
  transition: opacity 0.2s;
}

.nav-avatar:hover {
  opacity: 0.85;
}

.nav-user-name {
  font-size: 13px;
  font-weight: 500;
  color: rgba(255, 255, 255, 0.85);
}

.nav-user-role {
  font-size: 11px;
  color: rgba(255, 255, 255, 0.45);
  letter-spacing: 0.03em;
}

/* Main Content */
.app-main {
  flex: 1;
  padding: 32px 0;
}

/* Footer */
.app-footer {
  background: var(--primary-dark);
  padding: 24px 0;
  margin-top: auto;
}

.footer-inner {
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 24px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 12px;
}

.footer-brand {
  display: flex;
  align-items: center;
  gap: 14px;
}

.footer-brand .name {
  font-family: 'Playfair Display', Georgia, serif;
  font-size: 14px;
  font-weight: 600;
  color: rgba(255, 255, 255, 0.75);
}

.footer-divider {
  width: 1px;
  height: 18px;
  background: var(--secondary);
  opacity: 0.6;
}

.footer-brand p {
  font-size: 12px;
  color: rgba(255, 255, 255, 0.35);
}

.footer-links {
  display: flex;
  gap: 20px;
}

.footer-links a {
  font-size: 12px;
  color: rgba(255, 255, 255, 0.35);
  text-decoration: none;
  transition: color 0.2s;
}

.footer-links a:hover {
  color: var(--secondary-light);
}

/* Responsive */
@media (max-width: 768px) {
  .nav-menu {
    display: none;
  }

  .logo h1 {
    font-size: 14px;
  }

  .footer-inner {
    flex-direction: column;
    align-items: flex-start;
  }
}
  .btn-logout {
  background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
  color: white;
  border: none;
  padding: 8px 20px;
  border-radius: 30px;
  cursor: pointer;
  font-size: 13px;
  font-weight: 500;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 8px;
}

.btn-logout:hover {
  background: linear-gradient(135deg, #dc2626 0%, #b91c1c 100%);
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(220, 38, 38, 0.3);
}

.btn-logout:active {
  transform: translateY(0);
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