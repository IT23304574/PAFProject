import { API_BASE } from '../../core/api';

export const AuthService = {
  async login(username: string, password: string) {
    const res = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password })
    });
    if (!res.ok) {
      // Try to get specific error message from Spring Boot
      const errorBody = await res.json().catch(() => ({}));
      const message = errorBody.message || errorBody.detail || `Server error (${res.status})`;
      console.error('Login Error Response:', errorBody);
      throw new Error(message);
    }
    const user = await res.json();
    localStorage.setItem('user', JSON.stringify(user));
    localStorage.setItem('sc_token', 'logged_in');
    return user;
  },

  async register(user: { fullName: string; username: string; password: string; role: string }) {
    const res = await fetch(`${API_BASE}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(user)
    });
    if (!res.ok) {
      const errorData = await res.json().catch(() => ({ message: res.statusText }));
      throw new Error(`Registration failed: ${errorData.message || res.statusText}`);
    }
    return res.json();
  },

  async loginWithGoogleIdToken(token: string) {
    const res = await fetch(`${API_BASE}/auth/google`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ idToken: token, token: token })
    });
    if (!res.ok) {
      const errorData = await res.json().catch(() => ({ message: res.statusText }));
      throw new Error(`Google login failed: ${errorData.message || res.statusText}`);
    }
    const user = await res.json();
    localStorage.setItem('user', JSON.stringify(user));
    localStorage.setItem('sc_token', 'logged_in');
    return user;
  },

  logout() {
    localStorage.removeItem('user');
    localStorage.removeItem('sc_token');
  }
};
