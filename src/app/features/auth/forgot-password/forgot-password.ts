import { Component } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';

import { Recuperacion } from '../recuperacion';

@Component({
  selector: 'app-forgot-password',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './forgot-password.html',
  styleUrl: './forgot-password.css',
})
export class ForgotPassword {

  private formBuilder = new FormBuilder();

  forgotPasswordForm = this.formBuilder.group({
    correo: ['', [Validators.required, Validators.email]]
  });

  errorMensaje = '';

  constructor(
    private router: Router,
    private recuperacionService: Recuperacion
  ) {}

  onSubmit() {

    if (this.forgotPasswordForm.invalid) {
      return;
    }

    const datos = {
      correo: this.forgotPasswordForm.value.correo!
    };

    this.recuperacionService.solicitar(datos).subscribe({
      next: () => {
        this.router.navigate(['/forgot-password-sent']);
      },
      error: (error) => {
        this.errorMensaje =
          'Ocurrió un error al procesar la solicitud. Intente nuevamente.';

        console.error(error);
      }
    });
  }
}