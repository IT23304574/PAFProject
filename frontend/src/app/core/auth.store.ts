import { Injectable } from '@angular/core';

const KEY = 'sc_token';

@Injectable({ providedIn: 'root' })
export class AuthStore {
  get token(): string | null {
    return localStorage.getItem(KEY);
  }

  set token(v: string | null) {
    if (!v) localStorage.removeItem(KEY);
    else localStorage.setItem(KEY, v);
  }

  logout() {
    this.token = null;
  }
}

