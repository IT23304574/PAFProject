import { Component, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from './auth.service';
import { loadGoogleIdentityScript, resolveGoogleClientId } from '../../core/google-oauth';

@Component({
  standalone: true,
  selector: 'app-register',
  imports: [FormsModule, CommonModule, RouterLink],
  template: `
    <div class="auth-wrapper">
      <div class="auth-card">
        <div class="auth-header">
          <span class="auth-icon">🏫</span>
          <h2>Create Account</h2>
          <p>Join Smart Campus Ops Hub</p>
        </div>

        <div *ngIf="successMsg" class="alert alert-success">{{ successMsg }}</div>
        <div *ngIf="errorMsg"   class="alert alert-error">{{ errorMsg }}</div>

        <form (ngSubmit)="submit()" class="auth-form">
          <div class="form-row">
            <div class="form-group">
              <label class="form-label">Full Name</label>
              <input [(ngModel)]="form.fullName" name="fullName" placeholder="John Doe" required />
            </div>
            <div class="form-group">
              <label class="form-label">Email</label>
              <input type="email" [(ngModel)]="form.username" name="username" placeholder="you@campus.lk" required />
            </div>
          </div>
          <div class="form-row">
            <div class="form-group">
              <label class="form-label">Password</label>
              <input type="password" [(ngModel)]="form.password" name="password" placeholder="Min 6 chars" required />
            </div>
            <div class="form-group">
              <label class="form-label">Phone (optional)</label>
              <input [(ngModel)]="form.phone" name="phone" placeholder="+94 77 000 0000" />
            </div>
          </div>
          <div class="form-row">
            <div class="form-group">
              <label class="form-label">Department (optional)</label>
              <input [(ngModel)]="form.department" name="department" placeholder="Engineering" />
            </div>
            <div class="form-group">
              <label class="form-label">Register as</label>
              <select [(ngModel)]="form.role" name="role">
                <option value="ROLE_USER">Student / Staff</option>
                <option value="ROLE_TECHNICIAN">Technician (requires approval)</option>
                <option value="ROLE_ADMIN">Admin</option>
              </select>
            </div>
          </div>

          <div *ngIf="form.role === 'ROLE_TECHNICIAN'" class="info-box">
            ℹ️ Technician accounts require admin approval before login is allowed.
          </div>

          <button type="submit" [disabled]="loading" class="btn-full">
            {{ loading ? 'Creating account…' : 'Register' }}
          </button>
          <button type="button" [disabled]="googleLoading" class="btn-google" (click)="registerWithGoogle()">
            {{ googleLoading ? 'Opening Google…' : 'Register with Google' }}
          </button>
        </form>

        <div class="auth-footer">
          <p>Already have an account? <a routerLink="/login">Sign in</a></p>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .auth-wrapper {
      min-height: 100vh; display: flex; align-items: center;
      justify-content: center; background: linear-gradient(135deg,#1f5eff11,#10b98111); padding: 24px;
    }
    .auth-card { background: white; border-radius: 16px; padding: 40px; width: 100%; max-width: 560px; box-shadow: 0 8px 32px rgba(0,0,0,.12); }
    .auth-header { text-align: center; margin-bottom: 28px; }
    .auth-icon { font-size: 48px; display: block; margin-bottom: 8px; }
    .auth-header h2 { margin: 0; font-size: 22px; }
    .auth-header p  { margin: 4px 0 0; color: #6b7280; font-size: 14px; }
    .auth-form { display: flex; flex-direction: column; gap: 16px; }
    .form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
    .form-group { display: flex; flex-direction: column; gap: 6px; }
    .form-label { font-weight: 500; font-size: 14px; color: #374151; }
    input, select { padding: 10px 14px; border: 1.5px solid #d1d5db; border-radius: 8px; font-size: 14px; }
    input:focus, select:focus { outline: none; border-color: #1f5eff; box-shadow: 0 0 0 3px #1f5eff22; }
    .btn-full { width: 100%; padding: 12px; background: #1f5eff; color: white; border: none; border-radius: 8px; font-size: 15px; font-weight: 600; cursor: pointer; }
    .btn-full:hover:not(:disabled) { background: #1a47cc; }
    .btn-full:disabled { opacity: .6; cursor: not-allowed; }
    .btn-google { width: 100%; padding: 12px; background: white; color: #111827; border: 1px solid #d1d5db; border-radius: 8px; font-size: 15px; font-weight: 600; cursor: pointer; }
    .btn-google:disabled { opacity: .6; cursor: not-allowed; }
    .alert { padding: 10px 14px; border-radius: 8px; font-size: 14px; margin-bottom: 12px; }
    .alert-success { background: #d1fae5; color: #065f46; border: 1px solid #a7f3d0; }
    .alert-error   { background: #fee2e2; color: #991b1b; border: 1px solid #fecaca; }
    .info-box { background: #e0f2fe; color: #0369a1; padding: 10px 14px; border-radius: 8px; font-size: 13px; }
    .auth-footer { margin-top: 20px; text-align: center; font-size: 14px; color: #6b7280; }
    .auth-footer a { color: #1f5eff; text-decoration: none; font-weight: 500; }
    @media(max-width:500px){ .form-row { grid-template-columns: 1fr; } }
  `]
})
export class RegisterComponent implements OnInit {
  form = { fullName: '', username: '', password: '', phone: '', department: '', role: 'ROLE_USER' };
  loading    = false;
  googleLoading = false;
  errorMsg   = '';
  successMsg = '';
  googleClientId = '';

  constructor(private auth: AuthService, private router: Router) {}

  ngOnInit() {
    this.googleClientId = resolveGoogleClientId();
  }

  submit() {
    this.errorMsg = '';
    this.successMsg = '';
    if (this.form.password.length < 6) { this.errorMsg = 'Password must be at least 6 characters'; return; }
    this.loading = true;
    this.auth.register(this.form).subscribe({
      next: user => {
        this.loading = false;
        if (user.role === 'ROLE_TECHNICIAN' && user.approvalStatus === 'PENDING_APPROVAL') {
          this.successMsg = '✅ Registration successful! Your technician account is pending admin approval.';
        } else {
          this.router.navigate(['/login']);
        }
      },
      error: err => {
        this.loading = false;
        this.errorMsg = err.error?.message || 'Registration failed';
      }
    });
  }

  registerWithGoogle() {
    this.errorMsg = '';
    this.successMsg = '';
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
              this.errorMsg = 'Google sign-up failed to return an ID token';
              return;
            }
            this.auth.loginWithGoogleIdToken(token, this.form.role).subscribe({
              next: user => {
                this.googleLoading = false;
                if (user.role === 'ROLE_TECHNICIAN' && user.approvalStatus === 'PENDING_APPROVAL') {
                  this.successMsg = 'Google sign-up successful. Technician account is pending admin approval.';
                  return;
                }
                if (user.role === 'ROLE_ADMIN') this.router.navigate(['/admin']);
                else if (user.role === 'ROLE_TECHNICIAN') this.router.navigate(['/ticket']);
                else this.router.navigate(['/facilities']);
              },
              error: err => {
                this.googleLoading = false;
                this.errorMsg = err.error?.message || 'Google sign-up failed';
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