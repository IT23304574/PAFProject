import { Component, OnInit, NgZone } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';

declare var google: any;

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  credentials = {
    email: '',
    password: ''
  };

  constructor(
    private ngZone: NgZone,
    private http: HttpClient
  ) {}

  ngOnInit() {
    this.loadGoogleLibrary();
  }

  private loadGoogleLibrary() {
    if (typeof (window as any).google !== 'undefined') {
      this.initializeGoogleSignIn();
      return;
    }
    const script = document.createElement('script');
    script.src = 'https://accounts.google.com/gsi/client';
    script.type = 'text/javascript';
    script.async = true;
    script.defer = true;
    script.onload = () => this.initializeGoogleSignIn();
    document.body.appendChild(script);
  }

  private initializeGoogleSignIn() {
    const container = document.getElementById('google-button-container');
    
    if (!container) {
      // If the element isn't ready yet, wait a tiny bit and try again
      setTimeout(() => this.initializeGoogleSignIn(), 50);
      return;
    }

    google.accounts.id.initialize({
      client_id: '725051219392-u8oac67c5dusdgb9ht9q3u683iss1lfl.apps.googleusercontent.com',
      callback: this.handleCredentialResponse.bind(this),
      auto_select: false, 
      cancel_on_tap_outside: true,
      use_fedcm_for_prompt: true
    });

    console.log('Rendering Google Button...');
    google.accounts.id.renderButton(
      container,
      { 
        theme: 'outline', 
        size: 'large', 
        text: 'continue_with', 
        shape: 'rectangular',
        width: container.offsetWidth || 360 
      }
    );

    // This triggers the "One Tap" prompt to suggest saved emails automatically
    google.accounts.id.prompt();
  }

  private handleCredentialResponse(response: any) {
    this.ngZone.run(() => {
      const idToken = response.credential;
      console.log('Google ID Token received, authenticating with backend...');
      
      this.http.post<any>('http://localhost:8080/api/v1/auth/google', { idToken })
        .subscribe({
          next: (user) => {
            console.log('Google Login successful:', user);
            // Save user info/token and navigate to dashboard
          },
          error: (err) => {
            console.error('Google Login failed:', err);
          }
        });
    });
  }

  handleLogin() {
    console.log('Login attempt for:', this.credentials.email);
  }
}