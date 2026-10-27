import { Component, OnInit, signal } from '@angular/core';
import {
  FormBuilder,
  FormsModule,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';

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

@Component({
  selector: 'app-citas',
  imports: [
    FormsModule,
    ReactiveFormsModule
  ],
  templateUrl: './citas.html',
  styleUrl: './citas.css'
})
export class Citas implements OnInit {

  citas = signal<Cita[]>([]);

  mascotas = signal<Mascota[]>([]);

  veterinarios = signal<Usuario[]>([]);

  citaSeleccionadaId: number | null = null;

  estadoCitaSeleccionada = '';

  modoEdicion = false;

  mensajeExito: string | null = null;

  mensajeError: string | null = null;

  fechaFiltro = '';

  estadoFiltro = '';

  readonly estadosDisponibles = [
    'Programada',
    'Confirmada',
    'Cancelada',
    'Completada',
    'Ausente'
  ];

  private formBuilder = new FormBuilder();

  citaForm = this.formBuilder.group({

    idMascota: [
      null as number | null,
      Validators.required
    ],

    idUsuarioVeterinario: [
      null as number | null,
      Validators.required
    ],

    fechaCita: ['', Validators.required],

    horaCita: ['', Validators.required],

    motivoConsulta: ['']

  });

  constructor(
    private citasService: CitasService,
    private mascotasService: MascotasService,
    private usuariosService: UsuariosService
  ) {}

  ngOnInit(): void {

    this.cargarMascotas();

    this.cargarVeterinarios();

    this.cargarCitas();

  }

  // ----------------------------------------------------------------
  // Cargar datos para los selects del formulario
  // ----------------------------------------------------------------

  cargarMascotas(): void {

    // Solo mascotas activas para poder agendar citas
    this.mascotasService.listar(
      '',
      null,
      'true'
    ).subscribe({
      next: (respuesta) => {

        this.mascotas.set(respuesta);

      },
      error: (error) => {

        console.error('Error al cargar mascotas:', error);

      }
    });

  }

  cargarVeterinarios(): void {

    // idRol='3' filtra solo usuarios con rol Veterinario
    this.usuariosService.listar(
      '',
      '3',
      'true'
    ).subscribe({
      next: (respuesta) => {

        this.veterinarios.set(respuesta);

      },
      error: (error) => {

        console.error('Error al cargar veterinarios:', error);

      }
    });

  }

  // ----------------------------------------------------------------
  // Cargar y buscar citas
  // ----------------------------------------------------------------

  cargarCitas(): void {

    this.citasService.listar(
      this.fechaFiltro,
      this.estadoFiltro
    ).subscribe({
      next: (respuesta) => {

        this.citas.set(respuesta);

      },
      error: (error) => {

        console.error('Error al cargar citas:', error);

      }
    });

  }

  buscarCitas(): void {

    this.cargarCitas();

  }

  // ----------------------------------------------------------------
  // Seleccionar una cita de la tabla para editar
  // ----------------------------------------------------------------

  seleccionarCita(cita: Cita): void {

    this.citaSeleccionadaId = cita.idCita;

    this.estadoCitaSeleccionada = cita.estado;

    this.modoEdicion = true;

    this.citaForm.patchValue({
      idMascota: cita.idMascota,
      idUsuarioVeterinario: cita.idUsuarioVeterinario,
      fechaCita: cita.fechaCita,
      horaCita: cita.horaCita,
      motivoConsulta: cita.motivoConsulta ?? ''
    });

  }

  // ----------------------------------------------------------------
  // Guardar: crea o actualiza según el modo
  // ----------------------------------------------------------------

  guardar(): void {

    if (this.citaForm.invalid) {
      return;
    }

    const datos = {
      fechaCita: this.citaForm.value.fechaCita!,
      horaCita: this.citaForm.value.horaCita!,
      motivoConsulta: this.citaForm.value.motivoConsulta ?? '',
      idMascota: this.citaForm.value.idMascota!,
      idUsuarioVeterinario: this.citaForm.value.idUsuarioVeterinario!
    };

    if (
      this.modoEdicion &&
      this.citaSeleccionadaId !== null
    ) {

      this.citasService.actualizar(
        this.citaSeleccionadaId,
        {
          fechaCita: datos.fechaCita,
          horaCita: datos.horaCita,
          motivoConsulta: datos.motivoConsulta,
          idUsuarioVeterinario: datos.idUsuarioVeterinario
        }
      ).subscribe({
        next: (respuesta) => {

          this.mensajeExito = respuesta.mensaje;
          this.mensajeError = null;

          this.cargarCitas();

          this.limpiarFormulario();

        },
        error: (error) => {

          this.mensajeError = error?.error?.mensaje ?? 'No se pudo actualizar la cita.';
          this.mensajeExito = null;

        }
      });

      return;

    }

    this.citasService.crear(datos).subscribe({
      next: (respuesta) => {

        this.mensajeExito = respuesta.mensaje;
        this.mensajeError = null;

        this.cargarCitas();

        this.limpiarFormulario();

      },
      error: (error) => {

        this.mensajeError = error?.error?.mensaje ?? 'No se pudo crear la cita.';
        this.mensajeExito = null;

      }
    });

  }

  // ----------------------------------------------------------------
  // Cambiar estado de la cita seleccionada
  // ----------------------------------------------------------------

  cambiarEstado(nuevoEstado: string): void {

    if (this.citaSeleccionadaId === null) {
      return;
    }

    this.citasService.cambiarEstado(
      this.citaSeleccionadaId,
      nuevoEstado
    ).subscribe({
      next: (respuesta) => {

        this.mensajeExito = respuesta.mensaje;
        this.mensajeError = null;

        this.cargarCitas();

        this.limpiarFormulario();

      },
      error: (error) => {

        this.mensajeError = error?.error?.mensaje ?? 'No se pudo cambiar el estado de la cita.';
        this.mensajeExito = null;

      }
    });

  }

  // ----------------------------------------------------------------
  // Emergencia con reprogramación en cascada
  // ----------------------------------------------------------------

  declararEmergencia(cita: Cita): void {

    const minutosTexto = prompt(
      `Se correrán las citas siguientes de ${cita.nombreVeterinario} este día.\n¿Cuántos minutos de atraso?`,
      '20'
    );

    if (!minutosTexto) {
      return;
    }

    const minutos = Number(minutosTexto);

    if (!Number.isInteger(minutos) || minutos <= 0) {
      this.mensajeError = 'Ingrese un número de minutos válido.';
      this.mensajeExito = null;
      return;
    }

    this.citasService.declararEmergencia(cita.idCita, minutos).subscribe({
      next: (respuesta) => {

        this.mensajeExito = respuesta.mensaje;
        this.mensajeError = null;

        this.cargarCitas();

      },
      error: (error) => {

        this.mensajeError = error?.error?.mensaje ?? 'No se pudo declarar la emergencia.';
        this.mensajeExito = null;

      }
    });

  }

  // ----------------------------------------------------------------
  // Limpiar el formulario y salir del modo edición
  // ----------------------------------------------------------------

  limpiarFormulario(): void {

    this.citaSeleccionadaId = null;

    this.estadoCitaSeleccionada = '';

    this.modoEdicion = false;

    this.citaForm.reset();

  }

  // ----------------------------------------------------------------
  // Helper: clase CSS del badge de estado
  // ----------------------------------------------------------------

  claseBadgeEstado(estado: string): string {

    switch (estado) {

      case 'Confirmada':
        return 'bg-purple-100 text-primary font-medium px-3 py-1 rounded-full text-sm';

      case 'Programada':
        return 'bg-gray-100 text-gray-600 font-medium px-3 py-1 rounded-full text-sm';

      case 'Cancelada':
        return 'bg-red-100 text-red-600 font-medium px-3 py-1 rounded-full text-sm';

      case 'Completada':
        return 'bg-green-100 text-green-700 font-medium px-3 py-1 rounded-full text-sm';

      case 'Ausente':
        return 'bg-yellow-100 text-yellow-700 font-medium px-3 py-1 rounded-full text-sm';

      default:
        return 'bg-gray-100 text-gray-500 font-medium px-3 py-1 rounded-full text-sm';

    }

  }

}