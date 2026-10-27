import { Component, signal } from '@angular/core';
import { RouterLink, RouterOutlet, RouterLinkActive } from '@angular/router';
import { Auth } from '../../features/auth/auth';
import { Router } from '@angular/router';

@Component({
  selector: 'app-cliente-layout',
  standalone: true,
  imports: [RouterLink, RouterOutlet, RouterLinkActive],
  templateUrl: './cliente-layout.html',
  styleUrl: './cliente-layout.css',
})
export class ClienteLayout {
  sidebarAbierto = signal(false);

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
}
