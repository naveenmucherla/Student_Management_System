import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, throwError } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { ToastService } from '../services/toast.service';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const toastService = inject(ToastService);

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      let errorMessage = 'An unexpected error occurred';

      if (error.error && typeof error.error === 'object' && error.error.message) {
        errorMessage = error.error.message;
      } else if (error.message) {
        errorMessage = error.message;
      }

      if (error.status === 401) {
        if (!req.url.includes('/login')) {
          toastService.error('Session expired or unauthorized. Please log in.', 'Unauthorized');
          authService.logout();
        }
      } else if (error.status === 403) {
        toastService.error('You do not have permission to perform this action.', 'Access Denied');
      } else if (error.status === 404) {
        // Individual 404s can be handled by components or toast
      } else if (error.status >= 500) {
        toastService.error(errorMessage, 'Server Error');
      }

      return throwError(() => error);
    })
  );
};
