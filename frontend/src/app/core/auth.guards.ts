import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../features/auth/auth.service';

export const authGuard: CanActivateFn = () => {
  const auth = inject(AuthService);
  const router = inject(Router);
  if (auth.getCurrentUser()) {
    return true;
  }
  return router.createUrlTree(['/login']);
};

export const roleGuard = (roles: string[]): CanActivateFn => {
  return () => {
    const auth = inject(AuthService);
    const router = inject(Router);
    const user = auth.getCurrentUser();
    if (!user) {
      return router.createUrlTree(['/login']);
    }
    if (roles.includes(user.role)) {
      return true;
    }
    if (user.role === 'ROLE_ADMIN') {
      return router.createUrlTree(['/admin']);
    }
    if (user.role === 'ROLE_TECHNICIAN') {
      return router.createUrlTree(['/ticket']);
    }
    return router.createUrlTree(['/facilities']);
  };
};
