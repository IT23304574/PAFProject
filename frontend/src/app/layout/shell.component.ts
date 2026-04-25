import { Component, OnInit } from '@angular/core';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../core/auth.service';

@Component({
  standalone: true,
  selector: 'app-shell',
  imports: [RouterLink, RouterLinkActive, RouterOutlet, CommonModule],
  template: `
    <div class="app-container">
      <header class="app-header">
        <div class="container flex-between">
          <div class="logo">
            <h1>🏫 Smart Campus Ops Hub</h1>
          </div>
          <nav class="nav-menu">
            <a routerLink="/facilities" routerLinkActive="active">Facilities</a>
            <a routerLink="/resources" routerLinkActive="active">Resources</a>
            <a routerLink="/bookings" routerLinkActive="active">Bookings</a>
            <a routerLink="/tickets" routerLinkActive="active">Tickets</a>
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
      background: #f5f5f5;
    }

    .app-header {
      background: white;
      border-bottom: 1px solid #ddd;
      padding: 16px 0;
      box-shadow: 0 1px 3px rgba(0,0,0,0.1);
    }

    .logo h1 {
      margin: 0;
      font-size: 22px;
      color: #007bff;
    }

    .nav-menu {
      display: flex;
      gap: 24px;
      align-items: center;
    }

    .nav-menu a {
      padding: 8px 0;
      border-bottom: 2px solid transparent;
      font-weight: 500;
      text-decoration: none;
      color: #333;
    }

    .nav-menu a:hover {
      color: #007bff;
    }

    .nav-menu a.active {
      color: #007bff;
      border-bottom-color: #007bff;
    }

    .app-main {
      flex: 1;
      padding: 32px 0;
    }

    .app-footer {
      background: #333;
      color: white;
      padding: 24px 0;
      margin-top: auto;
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
  constructor(private auth: AuthService, private router: Router) {}

  ngOnInit() {
    // No login needed - default admin mode active
  }
}