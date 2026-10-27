import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

import { Auth } from '../../features/auth/auth';

// Solo usuarios con rol Cliente pueden entrar al portal de autogestión.
// authGuard ya corrió antes y confirmó que hay sesión válida.
export const rolClienteGuard: CanActivateFn = () => {
  const authService = inject(Auth);
  const router = inject(Router);

  if (authService.usuarioActual()?.nombreRol === 'Cliente') {
    return true;
  }

  router.navigate(['/dashboard']);
  return false;
};
