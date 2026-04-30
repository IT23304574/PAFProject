import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthStore } from './auth.store';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const store = inject(AuthStore);
  const token = store.token;
  const user = store.user;
  if (!token && !user) return next(req);
  return next(req.clone({
    setHeaders: {
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(user?.id ? { 'X-User-Id': user.id } : {}),
      ...(user?.role ? { 'X-User-Role': user.role } : {}),
      ...(user?.fullName ? { 'X-User-Name': user.fullName } : {})
    }
  }));
};

