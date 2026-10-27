import { Component, OnInit, signal } from '@angular/core';
import {
  FormBuilder,
  FormsModule,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';

import {
  Roles as RolesService,
  Rol
} from '../roles';

@Component({
  selector: 'app-roles',
  imports: [ReactiveFormsModule, FormsModule],
  templateUrl: './roles.html',
  styleUrl: './roles.css',
})
export class Roles implements OnInit {

  roles = signal<Rol[]>([]);

  rolSeleccionadoId: number | null = null;

  estadoRolSeleccionado = true;

  modoEdicion = false;

  mensajeExito: string | null = null;

  mensajeError: string | null = null;

  busqueda = '';

  estadoFiltro = '';

  private formBuilder = new FormBuilder();

  rolForm = this.formBuilder.group({
    nombre: ['', Validators.required],
    descripcion: ['']
  });

  constructor(
    private rolesService: RolesService
  ) {}

  ngOnInit(): void {

    this.cargarRoles();

  }

  buscarRoles(): void {
    console.log('BUSQUEDA:', this.busqueda);
  this.cargarRoles();
  }

  cargarRoles(): void {
    this.rolesService.listar(this.busqueda, this.estadoFiltro).subscribe({
      next: (respuesta) => {

        this.roles.set(respuesta);

      },
      error: (error) => {

        console.error(
          'Error al cargar roles:',
          error
        );

      }
    });

  }

  guardar(): void {
    if (this.rolForm.invalid) {
      return;
    }

    if (
      this.modoEdicion &&
      this.rolSeleccionadoId !== null
    ) {

      const datos = {
        nombre: this.rolForm.value.nombre!,
        descripcion: this.rolForm.value.descripcion ?? ''
      };

      this.rolesService.actualizar(
        this.rolSeleccionadoId,
        datos
      ).subscribe({
        next: (respuesta) => {

          this.mensajeExito = respuesta.mensaje;
          this.mensajeError = null;

          this.cargarRoles();

          this.limpiarFormulario();

        },
        error: (error) => {

          this.mensajeError = error?.error?.mensaje ?? 'No se pudo actualizar el rol.';
          this.mensajeExito = null;

        }
      });

      return;

    }

    const datos = {
      nombre: this.rolForm.value.nombre!,
      descripcion: this.rolForm.value.descripcion ?? ''
    };

    this.rolesService.crear(datos).subscribe({
      next: (respuesta) => {

        this.mensajeExito = respuesta.mensaje;
        this.mensajeError = null;

        this.cargarRoles();

        this.limpiarFormulario();

      },
      error: (error) => {

        this.mensajeError = error?.error?.mensaje ?? 'No se pudo crear el rol.';
        this.mensajeExito = null;

      }
    });

  }

  seleccionarRol(rol: Rol): void {

    this.rolSeleccionadoId = rol.idRol;

    this.estadoRolSeleccionado = rol.estado;

    this.modoEdicion = true;

    this.rolForm.patchValue({
      nombre: rol.nombre,
      descripcion: rol.descripcion ?? ''
    });

  }

  limpiarFormulario(): void {

    this.rolSeleccionadoId = null;

    this.modoEdicion = false;

    this.rolForm.reset();
  }  


  cambiarEstado(): void {
    
    if (this.rolSeleccionadoId === null) {
    return;
    }
    
    this.rolesService.cambiarEstado(
    this.rolSeleccionadoId,
    !this.estadoRolSeleccionado
    ).subscribe({
    next: (respuesta) => {

    this.mensajeExito = respuesta.mensaje;
    this.mensajeError = null;

    this.cargarRoles();

    this.limpiarFormulario();

    },
    error: (error) => {

    this.mensajeError = error?.error?.mensaje ?? 'No se pudo cambiar el estado del rol.';
    this.mensajeExito = null;

    }
    });
    
  }

}