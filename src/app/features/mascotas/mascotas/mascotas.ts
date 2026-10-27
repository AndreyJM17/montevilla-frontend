import { Component, OnInit, signal } from '@angular/core';
import {
  FormBuilder,
  FormsModule,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';

import {
  Mascota,
  Mascotas as MascotasService
} from '../mascotas';

import {
  Cliente,
  Clientes as ClientesService
} from '../../clientes/clientes';

@Component({
  selector: 'app-mascotas',
  imports: [
    ReactiveFormsModule,
    FormsModule
  ],
  templateUrl: './mascotas.html',
  styleUrl: './mascotas.css',
})
export class Mascotas implements OnInit {

  mascotas = signal<Mascota[]>([]);

  clientes = signal<Cliente[]>([]);

  mascotaSeleccionadaId: number | null = null;

  estadoMascotaSeleccionada = true;
  
  readonly especies = [
    'Canino',
    'Felino',
    'Ave',
    'Roedor'
  ];

  modoEdicion = false;

  mensajeExito: string | null = null;

  mensajeError: string | null = null;

  busqueda = '';

  estadoFiltro = '';

  idClienteFiltro: number | null = null;

  private formBuilder = new FormBuilder();

  mascotaForm = this.formBuilder.group({
    nombre: ['', Validators.required],
    especie: ['', Validators.required],
    raza: [''],
    sexo: [''],
    fechaNacimiento: [''],
    observaciones: [''],
    idCliente: [null as number | null, Validators.required]
  });

  constructor(
    private mascotasService: MascotasService,
    private clientesService: ClientesService
  ) {}

  ngOnInit(): void {
    this.cargarClientes();

    this.cargarMascotas();

  }

  buscarMascotas(): void {

    this.cargarMascotas();

  }

  cargarMascotas(): void {

    this.mascotasService.listar(
      this.busqueda,
      this.idClienteFiltro,
      this.estadoFiltro
    ).subscribe({
      next: (respuesta) => {

        this.mascotas.set(respuesta);

      },
      error: (error) => {

        console.error(
          'Error al cargar mascotas:',
          error
        );

      }
    });

  }

  cargarClientes(): void {

    this.clientesService.listar(
      '',
      'true'
    ).subscribe({
      next: (respuesta) => {

        this.clientes.set(respuesta);

      },
      error: (error) => {

        console.error(
          'Error al cargar clientes:',
          error
        );

      }
    });

  }

  limpiarFormulario(): void {

    this.mascotaSeleccionadaId = null;

    this.estadoMascotaSeleccionada = true;

    this.modoEdicion = false;

    this.mascotaForm.reset();

  }

  seleccionarMascota(
    mascota: Mascota
  ): void {

    this.mascotaSeleccionadaId =
      mascota.idMascota;

    this.estadoMascotaSeleccionada =
      mascota.estado;

    this.modoEdicion = true;

    this.mascotaForm.patchValue({
      nombre: mascota.nombre,
      especie: mascota.especie,
      raza: mascota.raza ?? '',
      sexo: mascota.sexo ?? '',
      fechaNacimiento: mascota.fechaNacimiento ?? '',
      observaciones: mascota.observaciones ?? '',
      idCliente: mascota.idCliente
    });

  }

  guardar(): void {

    if (this.mascotaForm.invalid) {
      return;
    }

    const datos = {
      nombre: this.mascotaForm.value.nombre!,
      especie: this.mascotaForm.value.especie!,
      raza: this.mascotaForm.value.raza ?? '',
      sexo: this.mascotaForm.value.sexo ?? '',
      fechaNacimiento:
        this.mascotaForm.value.fechaNacimiento ?? '',
      observaciones:
        this.mascotaForm.value.observaciones ?? '',
      idCliente:
        this.mascotaForm.value.idCliente!
    };

    if (
      this.modoEdicion &&
      this.mascotaSeleccionadaId !== null
    ) {

      this.mascotasService.actualizar(
        this.mascotaSeleccionadaId,
        datos
      ).subscribe({
        next: (respuesta) => {

          this.mensajeExito = respuesta.mensaje;
          this.mensajeError = null;

          this.cargarMascotas();

          this.limpiarFormulario();

        },
        error: (error) => {

          this.mensajeError = error?.error?.mensaje ?? 'No se pudo actualizar la mascota.';
          this.mensajeExito = null;

        }
      });

      return;

    }

    this.mascotasService.crear(
      datos
    ).subscribe({
      next: (respuesta) => {

        this.mensajeExito = respuesta.mensaje;
        this.mensajeError = null;

        this.cargarMascotas();

        this.limpiarFormulario();

      },
      error: (error) => {

        this.mensajeError = error?.error?.mensaje ?? 'No se pudo crear la mascota.';
        this.mensajeExito = null;

      }
    });

  }

  cambiarEstado(): void {

    if (
      this.mascotaSeleccionadaId === null
    ) {
      return;
    }

    this.mascotasService.cambiarEstado(
      this.mascotaSeleccionadaId,
      !this.estadoMascotaSeleccionada
    ).subscribe({
      next: (respuesta) => {

        this.mensajeExito = respuesta.mensaje;
        this.mensajeError = null;

        this.cargarMascotas();

        this.limpiarFormulario();

      },
      error: (error) => {

        this.mensajeError = error?.error?.mensaje ?? 'No se pudo cambiar el estado de la mascota.';
        this.mensajeExito = null;

      }
    });

  }
}