import { Component, computed, signal } from '@angular/core';
import { RouterLink, RouterOutlet, RouterLinkActive } from '@angular/router';
import { Router } from '@angular/router';
import { Auth } from '../../features/auth/auth';

@Component({
  selector: 'app-main-layout',
  standalone: true,
  imports: [RouterLink, RouterOutlet, RouterLinkActive],
  templateUrl: './main-layout.html',
  styleUrl: './main-layout.css',
})



export class MainLayout {
  sidebarAbierto = signal(false);

  // Iniciales del usuario logueado (ej. "Andrey Jimenez" -> "AJ"),
  // se recalcula solo cuando cambia usuarioActual().
  iniciales = computed(() => {
    const nombreCompleto = this.auth.usuarioActual()?.nombreCompleto;

    if (!nombreCompleto) {
      return '';
    }

    const palabras = nombreCompleto.trim().split(/\s+/);

    const primeraLetra = palabras[0]?.[0] ?? '';
    const segundaLetra = palabras[1]?.[0] ?? '';

    return (primeraLetra + segundaLetra).toUpperCase();
  });

  constructor(
    public auth: Auth,
    private router: Router
  ) {}

  toggleSidebar() {
    this.sidebarAbierto.update(v => !v);
  }

  cerrarSidebar() {
    this.sidebarAbierto.set(false);
  }

  cerrarSesion() {
      this.auth.logout().subscribe({
      next: () => {
      this.auth.usuarioActual.set(null);
      this.router.navigate(['/login']);
      },
      error: (error) => {
      console.error('Error al cerrar sesión', error);
      }
      });
  }

  esAdministrador() {
  return this.auth.usuarioActual()?.nombreRol === 'Administrador';
  }

  esRecepcionista() {
    return this.auth.usuarioActual()?.nombreRol === 'Recepcionista';
  }

  esVeterinario() {
    return this.auth.usuarioActual()?.nombreRol === 'Veterinario';
  }

  esInventario() {
    return this.auth.usuarioActual()?.nombreRol === 'Inventario';
  }

  esCliente() {
    return this.auth.usuarioActual()?.nombreRol === 'Cliente';
  }
}