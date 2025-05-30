import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivateChildFn, RouterStateSnapshot } from '@angular/router';

import { AuthService } from '../services/auth.service';

export const authGuard: CanActivateChildFn = (route: ActivatedRouteSnapshot, state: RouterStateSnapshot) => {
  const auth = inject(AuthService);
  const token = auth.get();
  if (token) {
    return true;
  } else {
    auth.login(state.url);
    return false;
  }
};
