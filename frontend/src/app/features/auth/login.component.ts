import { Component, OnInit, NgZone, AfterViewInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgIf } from '@angular/common';
import { AuthService } from './auth.service';
import { ToastService } from '../../core/toast.service';
import { Router, RouterLink } from '@angular/router';

declare var google: any;

@Component({
  standalone: true,
  selector: 'app-login',
  imports: [FormsModule, NgIf, RouterLink],
  template: `
    <div class="login-container">
      <div class="login-card">
        <div class="login-header">
          <h1>🔐 Login</h1>
          <p>Sign in to Smart Campus Ops Hub</p>
        </div>

        <div *ngIf="toast.message" [class]="'alert ' + (toast.message.includes('success') ? 'alert-success' : 'alert-error')">
          {{toast.message}}
        </div>

        <form (ngSubmit)="login()" #loginForm="ngForm">
          <div class="form-group">
            <label class="form-label">Email Address</label>
            <input type="email" [(ngModel)]="email" name="email" placeholder="email@example.com" required>
          </div>

          <div class="form-group">
            <label class="form-label">Password</label>
            <input type="password" [(ngModel)]="password" name="password" placeholder="••••••••" required>
          </div>

          <div class="button-group">
            <button type="submit" [disabled]="!loginForm.valid || isLoading">
              {{isLoading ? 'Signing in...' : 'Login'}}
            </button>
          </div>
        </form>

        <p class="auth-switch">
          Don't have an account? <a routerLink="/register">Register here</a>
        </p>

        <div class="divider"><span>OR</span></div>

        <div id="googleBtn" class="google-btn-container"></div>

        <button class="secondary full-width" (click)="logout()" *ngIf="isLoggedIn" style="margin-top: 20px;">
          Logout
        </button>

        <div *ngIf="isLoggedIn" class="alert alert-success">
          ✅ You are logged in successfully!
        </div>
      </div>
    </div>
  `,
  styles: [`
    .login-container {
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: 60vh;
    }

    .login-card {
      background: white;
      border: 1px solid var(--gray-200);
      border-radius: 8px;
      padding: 40px;
      width: 100%;
      max-width: 500px;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    }

    .login-header {
      text-align: center;
      margin-bottom: 32px;
    }

    .login-header h1 {
      margin: 0 0 8px 0;
      color: var(--primary);
    }

    .login-header p {
      color: var(--gray-500);
      margin: 0;
    }

    textarea {
      font-family: 'Monaco', 'Courier New', monospace !important;
      font-size: 12px !important;
    }

    .button-group {
      display: flex;
      gap: 12px;
      margin-top: 24px;
    }

    .auth-switch {
      text-align: center;
      margin-top: 16px;
      font-size: 14px;
    }

    .button-group button {
      flex: 1;
    }
  `]
})
export class LoginComponent implements OnInit, AfterViewInit {
  email = '';
  password = '';
  isLoading = false;
  isLoggedIn = false;

  constructor(
    public toast: ToastService,
    private auth: AuthService,
    private router: Router,
    private ngZone: NgZone
  ) {
    this.checkLoginStatus();
  }
  
  ngOnInit() {
  }

  ngAfterViewInit() {
    this.loadGoogleLibrary();
  }

  private loadGoogleLibrary() {
    if ((window as any).google?.accounts?.id) {
      this.initGoogleAuth();
      return;
    }
    const script = document.createElement('script');
    script.src = 'https://accounts.google.com/gsi/client';
    script.async = true;
    script.defer = true;
    script.onload = () => this.initGoogleAuth();
    document.body.appendChild(script);
  }

  initGoogleAuth() {
    const g = (window as any).google?.accounts?.id;
    if (!g) {
      setTimeout(() => this.initGoogleAuth(), 100);
      return;
    }
    
    g.initialize({
      client_id: '725051219392-u8oac67c5dusdgb9ht9q3u683iss1lfl.apps.googleusercontent.com',
      callback: (response: any) => {
        this.ngZone.run(() => this.handleGoogleLogin(response.credential));
      },
      use_fedcm_for_prompt: true
    });

    const btnElement = document.getElementById('googleBtn');
    if (btnElement) {
      g.renderButton(
        btnElement,
        { 
          theme: 'outline', 
          size: 'large', 
          width: btnElement.offsetWidth || 350, 
          text: 'continue_with' 
        }
      );
    }

    // Display the One Tap account selector automatically
    g.prompt();
  }

  checkLoginStatus() {
    this.isLoggedIn = !!localStorage.getItem('sc_token');
  }

  login() {
    this.isLoading = true;
    this.auth.login(this.email, this.password).subscribe({
      next: () => this.onLoginSuccess(),
      error: (e: any) => this.onLoginError(e)
    });
  }

  handleGoogleLogin(token: string) {
    this.isLoading = true;
    // This method sends the token to /api/v1/auth/google
    this.auth.loginWithGoogleIdToken(token).subscribe({
      next: () => this.onLoginSuccess(),
      error: (e: any) => this.onLoginError(e)
    });
  }

  private onLoginSuccess() {
    this.isLoading = false;
    this.toast.show('✅ Login successful!');
    this.isLoggedIn = true;
    setTimeout(() => this.router.navigate(['/resources']), 1000);
  }

  private onLoginError(e: any) {
    this.isLoading = false;
    this.toast.show('❌ Login failed: ' + (e?.error?.detail ?? e.message ?? 'Unknown error'));
  }

  logout() {
    this.auth.logout();
    this.isLoggedIn = false;
    this.toast.show('✅ Logged out successfully');
  }
}
