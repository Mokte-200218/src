import { inject } from '@angular/core';
import { CanActivateFn } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const roleGuard: CanActivateFn = (route) => {
  const authService = inject(AuthService);
  const allowedRoles = route.data?.['roles'] as string[];

  const userRole = authService.getRol();

  if (!allowedRoles || allowedRoles.includes(userRole!)) {
    return true;
  }

  return false;
};
