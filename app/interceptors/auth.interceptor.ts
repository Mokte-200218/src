import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, throwError, tap } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { AuthStateService } from '../services/auth-state.service';

export const authInterceptor: HttpInterceptorFn = (req, next) => {

  const authService = inject(AuthService);
  const authState = inject(AuthStateService);

  const token = authService.getToken();

  if (token) {
    req = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`,
      },
    });
  }

 return next(req).pipe(
  tap(() => {
    // Si la petición fue exitosa, limpiamos el error
    authState.clearForbidden();
  }),
  catchError((err) => {
    if (err.status === 403) {
      authState.setForbidden('No tienes permisos para realizar esta acción');
    }
    return throwError(() => err);
  })
);
};
