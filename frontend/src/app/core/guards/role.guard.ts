import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { ToastService } from '../services/toast.service';

export const roleGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const toastService = inject(ToastService);
  const router = inject(Router);

  const expectedRoles = route.data['roles'] as Array<string>;
  const user = authService.currentUser();

  if (user && expectedRoles && expectedRoles.includes(user.role)) {
    return true;
  }

  toastService.warning('You do not have the required role to access this page.', 'Access Restricted');
  router.navigate(['/dashboard']);
  return false;
};
