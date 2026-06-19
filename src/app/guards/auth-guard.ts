import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { environment } from '../../environments/environment.development';

export const authGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const token = sessionStorage.getItem(environment.TOKEN_NAME);

  if (token) {
    return true;
  }

  router.navigate(['/login']);
  return false;
};