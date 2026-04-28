import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthService } from './auth.service';

// Declare the global 'google' object for TypeScript
declare global {
  interface Window {
    google: {
      accounts: {
        id: {
          initialize: (config: { client_id: string; callback: (response: { credential?: string }) => void; auto_select?: boolean; ux_mode?: string; context?: string }) => void;
          renderButton: (element: HTMLElement | null, options: { theme: string; size: string; width?: number; shape?: string; text?: string }) => void;
        };
      };
    };
  }
}

export const LoginComponent = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem('sc_token'));
  const navigate = useNavigate();

  useEffect(() => {
    const initGoogle = () => {
      if (window.google) {
        window.google.accounts.id.initialize({
          client_id: '725051219392-u8oac67c5dusdgb9ht9q3u683iss1lfl.apps.googleusercontent.com',
          callback: (res: any) => handleGoogleLogin(res.credential),
        });
        window.google.accounts.id.renderButton(
          document.getElementById('googleBtn'),
          { theme: 'outline', size: 'large', width: 350 }
        );
      }
    };

    const script = document.createElement('script');
    script.src = 'https://accounts.google.com/gsi/client';
    script.async = true;
    script.onload = initGoogle;
    document.head.appendChild(script);
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    try {
      await AuthService.login(email, password);
      onLoginSuccess();
    } catch (err: any) {
      setError(err.message || 'Login failed. Please check your credentials.');
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = async (token: string) => {
    setIsLoading(true);
    setError(null);
    try {
      await AuthService.loginWithGoogleIdToken(token);
      onLoginSuccess();
    } catch (err) {
      setError('Google authentication failed. Please try again.');
      setIsLoading(false);
    }
  };

  const onLoginSuccess = () => {
    setIsLoggedIn(true);
    navigate('/bookings');
  };

  const handleLogout = () => {
    AuthService.logout();
    setIsLoggedIn(false);
  };

  return (
    <div className="login-container">
      <style>{`
        .login-container { display: flex; justify-content: center; align-items: center; min-height: 80vh; padding: 20px; }
        .login-card { background: white; border-radius: 12px; padding: 40px; width: 100%; max-width: 450px; box-shadow: 0 10px 25px rgba(0,0,0,0.05); border: 1px solid #eee; }
        .login-header { text-align: center; margin-bottom: 30px; }
        .login-header h1 { margin: 0; color: #1a1a1a; font-size: 28px; }
        .login-header p { color: #666; margin-top: 8px; }
        .form-group { margin-bottom: 20px; }
        .form-label { display: block; margin-bottom: 8px; font-weight: 500; color: #333; }
        .form-group input { width: 100%; padding: 12px; border: 1px solid #ddd; border-radius: 8px; box-sizing: border-box; font-size: 16px; }
        .btn-submit { width: 100%; padding: 14px; background: #2563eb; color: white; border: none; border-radius: 8px; font-size: 16px; font-weight: 600; cursor: pointer; transition: background 0.2s; }
        .btn-submit:disabled { background: #94a3b8; cursor: not-allowed; }
        .error-message { background: #fef2f2; color: #dc2626; padding: 12px; border-radius: 8px; margin-bottom: 20px; font-size: 14px; border: 1px solid #fee2e2; }
        .auth-switch { text-align: center; margin-top: 20px; font-size: 14px; color: #666; }
        .divider { margin: 25px 0; text-align: center; border-bottom: 1px solid #eee; line-height: 0.1em; }
        .divider span { background: #fff; padding: 0 10px; color: #999; font-size: 12px; }
        .google-btn-container { display: flex; justify-content: center; }
      `}</style>
      <div className="login-card">
        <div className="login-header">
          <h1>🔐 Login</h1>
          <p>Sign in to Smart Campus Ops Hub</p>
        </div>

        {error && <div className="error-message">{error}</div>}

        <form onSubmit={handleLogin}>
          <div className="form-group">
            <label className="form-label">Email Address</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="email@example.com"
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
            />
          </div>

          <div className="button-group">
            <button type="submit" className="btn-submit" disabled={isLoading}>
              {isLoading ? 'Signing in...' : 'Login'}
            </button>
          </div>
        </form>

        <p className="auth-switch">
          Don't have an account? <Link to="/register">Register here</Link>
        </p>

        <div className="divider"><span>OR</span></div>
        <div id="googleBtn" className="google-btn-container"></div>

        {isLoggedIn && (
          <button className="secondary full-width" onClick={handleLogout} style={{ marginTop: '20px' }}>
            Logout
          </button>
        )}
      </div>
    </div>
  );
};
