import { inject } from '@angular/core';
import {
  CanActivateFn,
  ActivatedRouteSnapshot,
  Router
} from '@angular/router';

import { Auth } from '../../features/auth/auth';

export const rolesGuard: CanActivateFn =
  (route: ActivatedRouteSnapshot) => {

    const authService = inject(Auth);
    const router = inject(Router);

    const rolActual =
      authService.usuarioActual()?.nombreRol;

    const rolesPermitidos =
      route.data?.['roles'] as string[];

    if (
      rolActual &&
      rolesPermitidos?.includes(rolActual)
    ) {
      return true;
    }

    // Nunca rebotar a una ruta fija: si ese rol tampoco puede verla
    // (ej. /dashboard es solo Administrador), queda en loop infinito.
    // Se manda a la pantalla que SÍ le corresponde a este rol.
    router.navigate([authService.rutaPorRol(rolActual)]);
    return false;
  };