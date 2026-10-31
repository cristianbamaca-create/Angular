import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';

export const authGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const usuario = localStorage.getItem('usuario');

  if (usuario) {
    return true; // Si hay usuario guardado en localStorage, lo deja pasar
  } else {
    router.navigate(['/login']); // Si no hay usuario, lo rebota al login
    return false;
  }
};