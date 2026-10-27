import { Component, OnInit, signal } from '@angular/core';
import {
  FormBuilder,
  FormsModule,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';

import {
  Distribuidor,
  Inventario as InventarioService
} from '../inventario';

@Component({
  selector: 'app-distribuidores',
  imports: [
    ReactiveFormsModule,
    FormsModule
  ],
  templateUrl: './distribuidores.html',
  styleUrl: './distribuidores.css',
})
export class Distribuidores implements OnInit {

  distribuidores = signal<Distribuidor[]>([]);

  distribuidorSeleccionadoId: number | null = null;

  estadoDistribuidorSeleccionado = true;

  modoEdicion = false;

  mensajeExito: string | null = null;

  mensajeError: string | null = null;

  busqueda = '';

  estadoFiltro = '';

  private formBuilder = new FormBuilder();

  distribuidorForm = this.formBuilder.group({
    nombreEmpresa: ['', Validators.required],
    contacto: [''],
    telefono: [''],
    correo: [''],
    direccion: ['']
  });

  constructor(
    private inventarioService: InventarioService
  ) {}

  ngOnInit(): void {
    this.cargarDistribuidores();

  }

  buscar(): void {

    this.cargarDistribuidores();

  }

  cargarDistribuidores(): void {

    const estado =
      this.estadoFiltro === ''
        ? null
        : this.estadoFiltro === 'true';

    this.inventarioService.listarDistribuidores(
      this.busqueda,
      estado
    ).subscribe({
      next: (respuesta) => {

        this.distribuidores.set(respuesta);

      },
      error: (error) => {

        console.error(
          'Error al cargar distribuidores:',
          error
        );

      }
    });

  }

  limpiarFormulario(): void {

    this.distribuidorSeleccionadoId = null;

    this.estadoDistribuidorSeleccionado = true;

    this.modoEdicion = false;

    this.distribuidorForm.reset();

  }

  seleccionarDistribuidor(
    distribuidor: Distribuidor
  ): void {

    this.distribuidorSeleccionadoId =
      distribuidor.idDistribuidor;

    this.estadoDistribuidorSeleccionado =
      distribuidor.estado;

    this.modoEdicion = true;

    this.distribuidorForm.patchValue({
      nombreEmpresa: distribuidor.nombreEmpresa,
      contacto: distribuidor.contacto ?? '',
      telefono: distribuidor.telefono ?? '',
      correo: distribuidor.correo ?? '',
      direccion: distribuidor.direccion ?? ''
    });

  }

  guardar(): void {

    if (this.distribuidorForm.invalid) {
      return;
    }

    const datos = {
      nombreEmpresa: this.distribuidorForm.value.nombreEmpresa!,
      contacto: this.distribuidorForm.value.contacto ?? '',
      telefono: this.distribuidorForm.value.telefono ?? '',
      correo: this.distribuidorForm.value.correo ?? '',
      direccion: this.distribuidorForm.value.direccion ?? ''
    };

    if (
      this.modoEdicion &&
      this.distribuidorSeleccionadoId !== null
    ) {

      this.inventarioService.actualizarDistribuidor(
        this.distribuidorSeleccionadoId,
        datos
      ).subscribe({
        next: (respuesta) => {

          this.mensajeExito = respuesta.mensaje;
          this.mensajeError = null;

          this.cargarDistribuidores();

          this.limpiarFormulario();

        },
        error: (error) => {

          this.mensajeError = error?.error?.mensaje ?? 'No se pudo actualizar el distribuidor.';
          this.mensajeExito = null;

        }
      });

      return;

    }

    this.inventarioService.crearDistribuidor(
      datos
    ).subscribe({
      next: (respuesta) => {

        this.mensajeExito = respuesta.mensaje;
        this.mensajeError = null;

        this.cargarDistribuidores();

        this.limpiarFormulario();

      },
      error: (error) => {

        this.mensajeError = error?.error?.mensaje ?? 'No se pudo crear el distribuidor.';
        this.mensajeExito = null;

      }
    });

  }

  cambiarEstado(): void {

    if (
      this.distribuidorSeleccionadoId === null
    ) {
      return;
    }

    this.inventarioService.cambiarEstadoDistribuidor(
      this.distribuidorSeleccionadoId,
      !this.estadoDistribuidorSeleccionado
    ).subscribe({
      next: (respuesta) => {

        this.mensajeExito = respuesta.mensaje;
        this.mensajeError = null;

        this.cargarDistribuidores();

        this.limpiarFormulario();

      },
      error: (error) => {

        this.mensajeError = error?.error?.mensaje ?? 'No se pudo cambiar el estado del distribuidor.';
        this.mensajeExito = null;

      }
    });

  }
}
