import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgIf } from '@angular/common';
import { AuthService } from './auth.service';
import { ToastService } from '../../core/toast.service';
import { Router, RouterLink } from '@angular/router';

declare var google: any;

@Component({
  standalone: true,
  selector: 'app-register',
  imports: [FormsModule, NgIf, RouterLink],
  template: `
    <div class="login-container">
      <div class="login-card">
        <div class="login-header">
          <h1>📝 Create Account</h1>
          <p>Join Smart Campus Ops Hub</p>
        </div>

        <div *ngIf="toast.message" [class]="'alert ' + (toast.message.includes('success') ? 'alert-success' : 'alert-error')">
          {{toast.message}}
        </div>

        <form (ngSubmit)="register()" #regForm="ngForm">
          <div class="form-group">
            <label class="form-label">Full Name</label>
            <input type="text" [(ngModel)]="fullName" name="fullName" placeholder="John Doe" required>
          </div>

          <div class="form-group">
            <label class="form-label">Email Address</label>
            <input type="email" [(ngModel)]="email" name="email" placeholder="email@example.com" required>
          </div>

          <div class="form-group">
            <label class="form-label">Password</label>
            <input type="password" [(ngModel)]="password" name="password" placeholder="••••••••" required>
          </div>

          <div class="button-group">
            <button type="submit" [disabled]="!regForm.valid || isLoading">
              {{isLoading ? 'Creating account...' : 'Register'}}
            </button>
          </div>
        </form>

        <p class="auth-switch">
          Already have an account? <a routerLink="/login">Login here</a>
        </p>

        <div class="divider"><span>OR</span></div>

        <div id="googleBtnReg" class="google-btn-container"></div>
      </div>
    </div>
  `,
  styles: [`
    .login-container { display: flex; justify-content: center; align-items: center; min-height: 60vh; }
    .login-card { background: white; border: 1px solid var(--gray-200); border-radius: 8px; padding: 40px; width: 100%; max-width: 500px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); }
    .login-header { text-align: center; margin-bottom: 32px; }
    .login-header h1 { margin: 0 0 8px 0; color: var(--primary); }
    .login-header p { color: var(--gray-500); margin: 0; }
    .button-group { display: flex; gap: 12px; margin-top: 24px; }
    .button-group button { flex: 1; }
    .auth-switch { text-align: center; margin-top: 16px; font-size: 14px; }
    .divider { margin: 24px 0; text-align: center; border-bottom: 1px solid var(--gray-200); line-height: 0.1em; }
    .divider span { background:#fff; padding:0 10px; color: var(--gray-500); font-size: 12px; }
    .google-btn-container { display: flex; justify-content: center; }
  `]
})
export class RegisterComponent implements OnInit {
  fullName = '';
  email = '';
  password = '';
  isLoading = false;

  constructor(
    public toast: ToastService,
    private auth: AuthService,
    private router: Router
  ) {}

  ngOnInit() {
    this.initGoogleAuth();
  }

  initGoogleAuth() {
    if (typeof google !== 'undefined') {
      google.accounts.id.initialize({
        client_id: '407408718192.apps.googleusercontent.com',
        callback: (response: any) => this.handleGoogleLogin(response.credential)
      });
      google.accounts.id.renderButton(
        document.getElementById('googleBtnReg'),
        { theme: 'outline', size: 'large', width: '100%' }
      );
    }
  }

  register() {
    this.isLoading = true;
    const payload = {
      fullName: this.fullName,
      username: this.email,
      password: this.password,
      role: 'ROLE_USER'
    };
    this.auth.register(payload).subscribe({
      next: () => {
        this.isLoading = false;
        this.toast.show('✅ Registration successful! Please login.');
        this.router.navigate(['/login']);
      },
      error: (e) => {
        this.isLoading = false;
        this.toast.show('❌ Registration failed: ' + (e?.error?.detail ?? e.message ?? 'Unknown error'));
      }
    });
  }

  handleGoogleLogin(token: string) {
    this.isLoading = true;
    this.auth.loginWithGoogleIdToken(token).subscribe({
      next: () => {
        this.isLoading = false;
        this.toast.show('✅ Login successful!');
        this.router.navigate(['/resources']);
      },
      error: (e) => {
        this.isLoading = false;
        this.toast.show('❌ Login failed: ' + (e?.error?.detail ?? e.message ?? 'Unknown error'));
      }
    });
  }
}