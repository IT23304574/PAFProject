import { Component, OnInit, NgZone, AfterViewInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

declare var google: any;

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit, AfterViewInit {
  credentials = {
    email: '',
    password: ''
  };

  constructor(
    private ngZone: NgZone,
    private http: HttpClient,
    private router: Router
  ) {}

  ngOnInit() {
    // If user is already logged in, redirect them away from the login page
    if (localStorage.getItem('user')) {
      this.router.navigate(['/dashboard']);
    }
  }

  ngAfterViewInit() {
    this.loadGoogleLibrary();
  }

  private loadGoogleLibrary() {
    console.log('Checking for Google Identity library...');
    if (typeof (window as any).google !== 'undefined' && (window as any).google.accounts) {
      console.log('Google library already loaded.');
      this.initializeGoogleSignIn();
      return;
    }
    const script = document.createElement('script');
    script.src = 'https://accounts.google.com/gsi/client';
    script.async = true;
    script.defer = true;
    script.onload = () => {
      console.log('Google script loaded.');
      this.initializeGoogleSignIn();
    };
    script.onerror = () => {
      console.error('Google Identity Services script failed to load. Check your internet or ad-blocker.');
    };
    document.body.appendChild(script);
  }

  private initializeGoogleSignIn() {
    const container = document.getElementById('google-button-container');

    if (!container) {
      console.warn('Google button container not found in DOM, retrying...');
      setTimeout(() => this.initializeGoogleSignIn(), 100);
      return;
    }

    console.log('Initializing Google Identity Services...');
    google.accounts.id.initialize({
      client_id: '725051219392-u8oac67c5dusdgb9ht9q3u683iss1lfl.apps.googleusercontent.com',
      callback: this.handleCredentialResponse.bind(this),
      auto_select: false,
      use_fedcm_for_prompt: true // Modern standard for better browser compatibility
    });

    console.log('Rendering Google Button...');
    google.accounts.id.renderButton(container, {
      theme: 'outline',
      size: 'large',
      text: 'continue_with',
      shape: 'rectangular',
      width: 350 // Use a fixed width for stability during development
    });

    // Display the One Tap account selector
    google.accounts.id.prompt((notification: any) => {
      if (notification.isNotDisplayed()) {
        console.log('One Tap not displayed:', notification.getNotDisplayedReason());
      }
    });
  }

  private handleCredentialResponse(response: any) {
    this.ngZone.run(() => {
      const idToken = response.credential;
      this.http.post<any>('http://localhost:8080/api/v1/auth/google', { idToken })
        .subscribe({
          next: (user) => this.completeLogin(user),
          error: (err) => {
            console.error('Google Login failed:', err);
            alert('Authentication failed.');
          }
        });
    });
  }

  private completeLogin(user: any) {
    localStorage.setItem('user', JSON.stringify(user));
    this.router.navigate(['/dashboard']);
  }

  handleLogin() {
    this.http.post<any>('http://localhost:8080/api/v1/auth/login', this.credentials)
      .subscribe({
        next: (user) => this.completeLogin(user),
        error: (err) => alert('Login failed: ' + (err.error?.message || 'Invalid credentials'))
      });
  }
}