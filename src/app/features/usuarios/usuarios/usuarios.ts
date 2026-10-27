import { Component, OnInit, signal } from '@angular/core';
import {
  FormBuilder,
  ReactiveFormsModule,
  Validators,
  FormsModule
} from '@angular/forms';

import {
  Usuarios as UsuariosService,
  Usuario
} from '../usuarios';


import {
  Roles as RolesService,
  Rol
} from '../../roles/roles';


@Component({
  selector: 'app-usuarios',
  imports: [ReactiveFormsModule,FormsModule],
  templateUrl: './usuarios.html',
  styleUrl: './usuarios.css',
})
export class Usuarios implements OnInit {

  usuarios = signal<Usuario[]>([]);

  roles = signal<Rol[]>([]);

  usuarioSeleccionadoId: number | null = null;

  modoEdicion = false;
  mensajeExito: string | null = null;
  mensajeError: string | null = null;
  busqueda = '';
  idRolFiltro = '';
  estadoFiltro = '';

  private formBuilder = new FormBuilder();

  usuarioForm = this.formBuilder.group({
    nombre: ['', Validators.required],
    apellido1: ['', Validators.required],
    apellido2: [''],
    correo: ['', [Validators.required, Validators.email]],
    contrasena: ['', Validators.required],
    confirmarContrasena: ['', Validators.required],
    idRol: ['', Validators.required],
    estado: [true]
  });

  constructor(
    private usuariosService: UsuariosService,
    private rolesService: RolesService
  ) {}

  ngOnInit(): void {
    this.cargarUsuarios();
    this.cargarRoles();
  }

  cargarUsuarios(): void {
    this.usuariosService.listar(
    this.busqueda,
    this.idRolFiltro,
    this.estadoFiltro
    ).subscribe({
    next: (respuesta) => {
    this.usuarios.set(respuesta);
    },
    error: (error) => {
    console.error('Error al cargar usuarios:', error);
    }
    });
  }

  buscarUsuarios(): void {
    this.cargarUsuarios();
    }

  cargarRoles(): void {

    this.rolesService.listar().subscribe({
      next: (respuesta) => {
        this.roles.set(respuesta);
      },
      error: (error) => {
        console.error('Error al cargar roles:', error);
      }
    });

  }

  guardar(): void {

    if (this.usuarioForm.invalid) {
      return;
    }

    if (this.modoEdicion && this.usuarioSeleccionadoId !== null) {

      const datos = {
        nombre: this.usuarioForm.value.nombre!,
        apellido1: this.usuarioForm.value.apellido1!,
        apellido2: this.usuarioForm.value.apellido2 ?? '',
        correo: this.usuarioForm.value.correo!,
        idRol: Number(this.usuarioForm.value.idRol)
      };

      this.usuariosService.actualizar(
        this.usuarioSeleccionadoId,
        datos
      ).subscribe({
        next: (respuesta) => {

          this.mensajeExito = respuesta.mensaje;
          this.mensajeError = null;

          this.cargarUsuarios();

          this.limpiarFormulario();

        },
        error: (error) => {

          this.mensajeError = error?.error?.mensaje ?? 'No se pudo actualizar el usuario.';
          this.mensajeExito = null;

        }
      });

      return;

    }

    const datos = {
      nombre: this.usuarioForm.value.nombre!,
      apellido1: this.usuarioForm.value.apellido1!,
      apellido2: this.usuarioForm.value.apellido2 ?? '',
      correo: this.usuarioForm.value.correo!,
      contrasena: this.usuarioForm.value.contrasena!,
      idRol: Number(this.usuarioForm.value.idRol)
    };

    this.usuariosService.crear(datos).subscribe({
      next: (respuesta) => {

        this.mensajeExito = respuesta.mensaje;
        this.mensajeError = null;

        this.cargarUsuarios();

        this.limpiarFormulario();

      },
      error: (error) => {

        this.mensajeError = error?.error?.mensaje ?? 'No se pudo crear el usuario.';
        this.mensajeExito = null;

      }
    });

  }
  seleccionarUsuario(usuario: Usuario): void {

    this.usuarioSeleccionadoId = usuario.idUsuario;

    this.modoEdicion = true;

    const nombreCompleto = usuario.nombreCompleto.split(' ');

    // El listado de usuarios solo trae "nombreRol" (texto), no el id.
    // Lo buscamos en la lista de roles ya cargada para poder
    // preseleccionar el <select> correctamente.
    const rolCoincidente = this.roles().find(
      (r) => r.nombre === usuario.nombreRol
    );

    this.usuarioForm.patchValue({
      nombre: nombreCompleto[0] ?? '',
      apellido1: nombreCompleto[1] ?? '',
      apellido2: nombreCompleto[2] ?? '',
      correo: usuario.correo,
      idRol: rolCoincidente ? String(rolCoincidente.idRol) : '',
      estado: usuario.estado
    });

  }

  limpiarFormulario(): void {
    this.usuarioSeleccionadoId = null;
    this.modoEdicion = false;
    this.usuarioForm.reset({
      estado: true
    });
  } 

  cambiarEstado(): void {

    if (this.usuarioSeleccionadoId === null) {
      return;
    }

    const estadoActual =
      this.usuarioForm.value.estado === true;

    this.usuariosService.cambiarEstado(
      this.usuarioSeleccionadoId,
      !estadoActual
    ).subscribe({
      next: (respuesta) => {

        this.mensajeExito = respuesta.mensaje;
        this.mensajeError = null;

        this.cargarUsuarios();

        this.limpiarFormulario();

      },
      error: (error) => {

        this.mensajeError = error?.error?.mensaje ?? 'No se pudo cambiar el estado del usuario.';
        this.mensajeExito = null;

      }
    });

  }

  

}