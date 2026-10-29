import { Component } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { Auth } from '../auth';

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class Login {
  private formBuilder = new FormBuilder();

  loginForm = this.formBuilder.group({
    correo: ['', [Validators.required, Validators.email]],
    contrasena: ['', [Validators.required]]
  });

  errorMensaje = '';

  // Pantalla de aterrizaje según el rol: cada uno entra directo a lo
  // que más usa, en vez de todos al Dashboard (que es solo de Administrador).
  private readonly destinoPorRol: Record<string, string> = {
    Administrador: '/dashboard',
    Recepcionista: '/clientes',
    Veterinario: '/mascotas',
    Inventario: '/inventario',
    Cliente: '/mis-citas'
  };

  constructor(
    private authService: Auth,
    private router: Router
  ) {}

  onSubmit() {
    if (this.loginForm.invalid) {
      return;
    }

    const credenciales = {
      correo: this.loginForm.value.correo!,
      contrasena: this.loginForm.value.contrasena!
    };

    this.authService.login(credenciales).subscribe({
      next: (respuesta) => {
        this.authService.guardarUsuario(respuesta.usuario);

        const destino = this.destinoPorRol[respuesta.usuario.nombreRol] ?? '/login';

        this.router.navigate([destino]);
      },
      error: (error) => {
        this.errorMensaje = 'Correo electrónico o contraseña incorrectos. Intente nuevamente.';
        console.error('Error de login:', error);
      }
    });
  }
}