import { Component } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Recuperacion } from '../recuperacion';

@Component({
  selector: 'app-reset-password',
  imports: [ReactiveFormsModule],
  templateUrl: './reset-password.html',
  styleUrl: './reset-password.css',
})
export class ResetPassword {

  private formBuilder = new FormBuilder();
  token = '';

  tokenValido = false;

  errorMensaje = '';

  resetPasswordForm = this.formBuilder.group({
    nuevaContrasena: ['', [Validators.required]],
    confirmarContrasena: ['', [Validators.required]]
  });

  constructor(
  private router: Router,
  private route: ActivatedRoute,
  private recuperacionService: Recuperacion
) {

  this.token = this.route.snapshot.queryParamMap.get('token') ?? '';

  if (!this.token) {
    this.errorMensaje = 'El enlace de recuperación no es válido.';
    return;
  }

  this.recuperacionService.validar(this.token).subscribe({
    next: () => {
      this.tokenValido = true;
    },
    error: () => {
      this.errorMensaje =
        'El enlace de recuperación no es válido o ha expirado.';
    }
  });
}

  onSubmit() {

    if (this.resetPasswordForm.invalid) {
      return;
    }

    const nuevaContrasena =
      this.resetPasswordForm.value.nuevaContrasena!;

    const confirmarContrasena =
      this.resetPasswordForm.value.confirmarContrasena!;

    if (nuevaContrasena !== confirmarContrasena) {

      this.errorMensaje =
        'Las contraseñas ingresadas no coinciden.';

      return;
    }

    this.recuperacionService
      .actualizarContrasena(this.token, nuevaContrasena)
      .subscribe({
        next: () => {
          this.router.navigate(['/reset-password-success']);
        },
        error: () => {
          this.errorMensaje =
            'No fue posible actualizar la contraseña.';
        }
      });
  }
}
