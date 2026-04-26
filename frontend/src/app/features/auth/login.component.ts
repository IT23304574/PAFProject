import { Component, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from './auth.service';
import { loadGoogleIdentityScript, resolveGoogleClientId } from '../../core/google-oauth';

@Component({
  standalone: true,
  selector: 'app-login',
  imports: [FormsModule, CommonModule, RouterLink],
  template: `
    <div class="auth-wrapper">
      <div class="auth-card">
        <div class="auth-header">
          <span class="auth-icon">🏫</span>
          <h2>Smart Campus Ops Hub</h2>
          <p>Sign in to your account</p>
        </div>

        <div *ngIf="errorMsg" class="alert alert-error">{{ errorMsg }}</div>
        <div *ngIf="infoMsg"  class="alert alert-info">{{ infoMsg }}</div>

        <form (ngSubmit)="submit()" class="auth-form">
          <div class="form-group">
            <label class="form-label">Email</label>
            <input type="email" [(ngModel)]="username" name="username"
                   placeholder="you@campus.lk" required />
          </div>
          <div class="form-group">
            <label class="form-label">Password</label>
            <input type="password" [(ngModel)]="password" name="password"
                   placeholder="••••••••" required />
          </div>
          <button type="submit" [disabled]="loading" class="btn-full">
            {{ loading ? 'Signing in…' : 'Sign In' }}
          </button>
          <button type="button" [disabled]="googleLoading" class="btn-google" (click)="loginWithGoogle()">
            {{ googleLoading ? 'Opening Google…' : 'Sign in with Google' }}
          </button>
        </form>

        <div class="auth-footer">
          <p>Don't have an account? <a routerLink="/register">Register</a></p>
          <div class="demo-accounts">
            <p><strong>Demo Accounts:</strong></p>
            <div class="demo-row" *ngFor="let d of demos" (click)="fillDemo(d)">
              <span class="demo-badge" [class]="d.role">{{ d.label }}</span>
              <span>{{ d.user }} / {{ d.pass }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .auth-wrapper {
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      background: linear-gradient(135deg, #1f5eff11 0%, #10b98111 100%);
      padding: 24px;
    }
    .auth-card {
      background: white;
      border-radius: 16px;
      padding: 40px;
      width: 100%;
      max-width: 440px;
      box-shadow: 0 8px 32px rgba(0,0,0,0.12);
    }
    .auth-header { text-align: center; margin-bottom: 28px; }
    .auth-icon { font-size: 48px; display: block; margin-bottom: 8px; }
    .auth-header h2 { margin: 0; font-size: 22px; color: #1f2937; }
    .auth-header p  { margin: 4px 0 0; color: #6b7280; font-size: 14px; }
    .auth-form { display: flex; flex-direction: column; gap: 16px; }
    .form-group { display: flex; flex-direction: column; gap: 6px; }
    .form-label { font-weight: 500; font-size: 14px; color: #374151; }
    input {
      padding: 10px 14px; border: 1.5px solid #d1d5db; border-radius: 8px;
      font-size: 14px; transition: border-color .2s;
    }
    input:focus { outline: none; border-color: #1f5eff; box-shadow: 0 0 0 3px #1f5eff22; }
    .btn-full {
      width: 100%; padding: 12px; background: #1f5eff; color: white;
      border: none; border-radius: 8px; font-size: 15px; font-weight: 600;
      cursor: pointer; transition: background .2s; margin-top: 4px;
    }
    .btn-full:hover:not(:disabled) { background: #1a47cc; }
    .btn-full:disabled { opacity: .6; cursor: not-allowed; }
    .btn-google {
      width: 100%;
      padding: 12px;
      background: white;
      color: #111827;
      border: 1px solid #d1d5db;
      border-radius: 8px;
      font-size: 15px;
      font-weight: 600;
      cursor: pointer;
    }
    .btn-google:disabled { opacity: .6; cursor: not-allowed; }
    .alert { padding: 10px 14px; border-radius: 8px; font-size: 14px; margin-bottom: 12px; }
    .alert-error { background: #fee2e2; color: #991b1b; border: 1px solid #fecaca; }
    .alert-info  { background: #e0f2fe; color: #0369a1; border: 1px solid #bae6fd; }
    .auth-footer { margin-top: 24px; text-align: center; font-size: 14px; color: #6b7280; }
    .auth-footer a { color: #1f5eff; text-decoration: none; font-weight: 500; }
    .demo-accounts { margin-top: 16px; background: #f9fafb; border-radius: 8px; padding: 12px; text-align: left; }
    .demo-accounts p { margin: 0 0 8px; font-size: 12px; }
    .demo-row { display: flex; align-items: center; gap: 10px; padding: 6px 8px; border-radius: 6px; cursor: pointer; font-size: 12px; transition: background .15s; }
    .demo-row:hover { background: #f3f4f6; }
    .demo-badge { padding: 2px 8px; border-radius: 999px; font-size: 11px; font-weight: 600; }
    .demo-badge.admin { background: #fee2e2; color: #991b1b; }
    .demo-badge.tech  { background: #d1fae5; color: #065f46; }
    .demo-badge.user  { background: #e0f2fe; color: #0369a1; }
  `]
})
export class LoginComponent implements OnInit {
  username = '';
  password = '';
  loading  = false;
  googleLoading = false;
  errorMsg = '';
  infoMsg  = '';
  googleClientId = '';

  demos = [
    { label: 'Admin',      role: 'admin', user: 'admin@campus.lk',   pass: 'admin123' },
    { label: 'Technician', role: 'tech',  user: 'tech@campus.lk',    pass: 'tech123'  },
    { label: 'Student',    role: 'user',  user: 'student@campus.lk', pass: 'student123' },
  ];

  constructor(private auth: AuthService, private router: Router) {}

  ngOnInit() {
    this.googleClientId = resolveGoogleClientId();
  }

  fillDemo(d: any) {
    this.username = d.user;
    this.password = d.pass;
  }

  submit() {
    this.errorMsg = '';
    this.infoMsg  = '';
    this.loading  = true;
    this.auth.login(this.username, this.password).subscribe({
      next: user => {
        this.loading = false;
        if (user.role === 'ROLE_ADMIN') this.router.navigate(['/admin']);
        else if (user.role === 'ROLE_TECHNICIAN') this.router.navigate(['/ticket']);
        else this.router.navigate(['/facilities']);
      },
      error: err => {
        this.loading = false;
        const msg: string = err.error?.message || 'Login failed';
        if (msg.includes('PENDING_APPROVAL')) {
          this.infoMsg = '⏳ Your technician account is awaiting admin approval. Please check back later.';
        } else {
          this.errorMsg = msg;
        }
      }
    });
  }

  loginWithGoogle() {
    this.errorMsg = '';
    this.infoMsg = '';
    this.googleLoading = true;
    this.googleClientId = resolveGoogleClientId();
    if (!this.googleClientId) {
      this.googleLoading = false;
      this.errorMsg = 'Google client ID is missing in frontend config.';
      return;
    }

    loadGoogleIdentityScript()
      .then(() => {
        window.google.accounts.id.initialize({
          client_id: this.googleClientId,
          callback: (resp: any) => {
            const token = resp?.credential;
            if (!token) {
              this.googleLoading = false;
              this.errorMsg = 'Google sign-in failed to return an ID token';
              return;
            }
            this.auth.loginWithGoogleIdToken(token).subscribe({
              next: user => {
                this.googleLoading = false;
                if (user.role === 'ROLE_ADMIN') this.router.navigate(['/admin']);
                else if (user.role === 'ROLE_TECHNICIAN') this.router.navigate(['/ticket']);
                else this.router.navigate(['/facilities']);
              },
              error: err => {
                this.googleLoading = false;
                const msg: string = err.error?.message || 'Google login failed';
                if (msg.includes('PENDING_APPROVAL')) {
                  this.infoMsg = 'Your technician account is awaiting admin approval.';
                } else {
                  this.errorMsg = msg;
                }
              }
            });
          }
        });
        window.google.accounts.id.prompt();
      })
      .catch((err: any) => {
        this.googleLoading = false;
        this.errorMsg = err?.message || 'Unable to load Google sign-in';
      });
  }
}