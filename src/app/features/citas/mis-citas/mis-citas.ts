import { Component, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';

import {
  Cita,
  Citas as CitasService
} from '../citas';

import {
  Mascota,
  Mascotas as MascotasService
} from '../../mascotas/mascotas';

import {
  Usuario,
  Usuarios as UsuariosService
} from '../../usuarios/usuarios';

import { Auth } from '../../auth/auth';

@Component({
  selector: 'app-mis-citas',
  imports: [FormsModule],
  templateUrl: './mis-citas.html',
  styleUrl: './mis-citas.css',
})
export class MisCitas implements OnInit {

  citas = signal<Cita[]>([]);

  misMascotas = signal<Mascota[]>([]);

  veterinarios = signal<Usuario[]>([]);

  idMascotaNueva: number | null = null;

  idVeterinarioNueva: number | null = null;

  fechaNueva = '';

  horaNueva = '';

  motivoNueva = '';

  mensajeExito: string | null = null;

  mensajeError: string | null = null;

  constructor(
    private citasService: CitasService,
    private mascotasService: MascotasService,
    private usuariosService: UsuariosService,
    private authService: Auth
  ) {}

  ngOnInit(): void {

    this.cargarMisCitas();

    this.cargarMisMascotas();

    this.usuariosService.listar('', '3', 'true').subscribe({
      next: (respuesta) => this.veterinarios.set(respuesta),
      error: (error) => console.error('Error al cargar veterinarios:', error)
    });

  }

  cargarMisCitas(): void {

    this.citasService.misCitas().subscribe({
      next: (respuesta) => this.citas.set(respuesta),
      error: (error) => console.error('Error al cargar mis citas:', error)
    });

  }

  cargarMisMascotas(): void {

    const idCliente = this.authService.usuarioActual()?.idCliente;

    if (!idCliente) {
      return;
    }

    this.mascotasService.listar('', idCliente, 'true').subscribe({
      next: (respuesta) => this.misMascotas.set(respuesta),
      error: (error) => console.error('Error al cargar mis mascotas:', error)
    });

  }

  agendarCita(): void {

    if (
      !this.idMascotaNueva ||
      !this.idVeterinarioNueva ||
      !this.fechaNueva ||
      !this.horaNueva
    ) {
      this.mensajeError = 'Seleccione mascota, veterinario, fecha y hora.';
      this.mensajeExito = null;
      return;
    }

    this.citasService.agendarMiCita({
      fechaCita: this.fechaNueva,
      horaCita: this.horaNueva,
      motivoConsulta: this.motivoNueva,
      idMascota: this.idMascotaNueva,
      idUsuarioVeterinario: this.idVeterinarioNueva
    }).subscribe({
      next: (respuesta) => {

        this.mensajeExito = respuesta.mensaje;
        this.mensajeError = null;

        this.limpiarFormulario();

        this.cargarMisCitas();

      },
      error: (error) => {

        this.mensajeError = error?.error?.mensaje ?? 'No se pudo agendar la cita.';
        this.mensajeExito = null;

      }
    });

  }

  cancelarCita(idCita: number): void {

    if (!confirm('¿Cancelar esta cita?')) {
      return;
    }

    this.citasService.cancelarMiCita(idCita).subscribe({
      next: (respuesta) => {

        this.mensajeExito = respuesta.mensaje;
        this.mensajeError = null;

        this.cargarMisCitas();

      },
      error: (error) => {

        this.mensajeError = error?.error?.mensaje ?? 'No se pudo cancelar la cita.';
        this.mensajeExito = null;

      }
    });

  }

  limpiarFormulario(): void {

    this.idMascotaNueva = null;

    this.idVeterinarioNueva = null;

    this.fechaNueva = '';

    this.horaNueva = '';

    this.motivoNueva = '';

  }
}
