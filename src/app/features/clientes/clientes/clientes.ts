import { Component, OnInit, signal } from '@angular/core';
import {
  FormBuilder,
  FormsModule,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';

import {
  Cliente,
  Clientes as ClientesService
} from '../clientes';

import {
  Usuarios as UsuariosService
} from '../../usuarios/usuarios';

import {
  Roles as RolesService
} from '../../roles/roles';

@Component({
  selector: 'app-clientes',
  imports: [FormsModule, ReactiveFormsModule  ],
  templateUrl: './clientes.html',
  styleUrl: './clientes.css',
})
export class Clientes implements OnInit {

  clientes = signal<Cliente[]>([]);

  private idRolCliente: number | null = null;

  clienteSeleccionadoId: number | null = null;

  estadoClienteSeleccionado = true;

  modoEdicion = false;

  mensajeExito: string | null = null;

  mensajeError: string | null = null;

  busqueda = '';

  estadoFiltro = '';

  private formBuilder = new FormBuilder();

  clienteForm = this.formBuilder.group({
    nombre: ['', Validators.required],
    apellido1: ['', Validators.required],
    apellido2: [''],
    telefono: [''],
    correo: [''],
    direccion: ['']
  });

  constructor(
    private clientesService: ClientesService,
    private usuariosService: UsuariosService,
    private rolesService: RolesService
  ) {}

  ngOnInit(): void {

    this.cargarClientes();

    this.rolesService.listar('Cliente').subscribe({
      next: (respuesta) => {

        this.idRolCliente = respuesta[0]?.idRol ?? null;

      },
      error: (error) => {

        console.error('Error al cargar el rol Cliente:', error);

      }
    });

  }

  darAccesoPortal(cliente: Cliente): void {

    if (!cliente.correo) {
      this.mensajeError = 'El cliente debe tener un correo electrónico registrado para darle acceso al portal.';
      this.mensajeExito = null;
      return;
    }

    if (this.idRolCliente === null) {
      this.mensajeError = 'No se pudo determinar el rol Cliente. Intente de nuevo en un momento.';
      this.mensajeExito = null;
      return;
    }

    if (!confirm(`¿Dar acceso al portal a ${cliente.nombre} ${cliente.apellido1}? Se le enviará un correo para configurar su contraseña.`)) {
      return;
    }

    // Contraseña temporal aleatoria: el cliente nunca la usa, configura la
    // suya propia con el enlace que recibe por correo.
    const contrasenaTemporal = crypto.randomUUID();

    this.usuariosService.crear({
      nombre: cliente.nombre,
      apellido1: cliente.apellido1,
      apellido2: cliente.apellido2,
      correo: cliente.correo,
      contrasena: contrasenaTemporal,
      idRol: this.idRolCliente,
      idCliente: cliente.idCliente
    }).subscribe({
      next: () => {

        this.mensajeExito = 'Acceso al portal creado. Se envió un correo al cliente para configurar su contraseña.';
        this.mensajeError = null;

      },
      error: (error) => {

        this.mensajeError = error?.error?.mensaje ?? 'No se pudo dar acceso al portal.';
        this.mensajeExito = null;

      }
    });

  }

  buscarClientes(): void {

    this.cargarClientes();

  }

  cargarClientes(): void {

    this.clientesService.listar(
      this.busqueda,
      this.estadoFiltro
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

    this.clienteSeleccionadoId = null;

    this.estadoClienteSeleccionado = true;

    this.modoEdicion = false;

    this.clienteForm.reset();

  }

  seleccionarCliente(cliente: Cliente): void {

    this.clienteSeleccionadoId = cliente.idCliente;

    this.estadoClienteSeleccionado = cliente.estado;

    this.modoEdicion = true;

    this.clienteForm.patchValue({
      nombre: cliente.nombre,
      apellido1: cliente.apellido1,
      apellido2: cliente.apellido2 ?? '',
      telefono: cliente.telefono ?? '',
      correo: cliente.correo ?? '',
      direccion: cliente.direccion ?? ''
    });

  }

  guardar(): void {

    if (this.clienteForm.invalid) {
      return;
    }

    const datos = {
      nombre: this.clienteForm.value.nombre!,
      apellido1: this.clienteForm.value.apellido1!,
      apellido2: this.clienteForm.value.apellido2 ?? '',
      telefono: this.clienteForm.value.telefono ?? '',
      correo: this.clienteForm.value.correo ?? '',
      direccion: this.clienteForm.value.direccion ?? ''
    };

    if (
      this.modoEdicion &&
      this.clienteSeleccionadoId !== null
    ) {

      this.clientesService.actualizar(
        this.clienteSeleccionadoId,
        datos
      ).subscribe({
        next: (respuesta) => {

          this.mensajeExito = respuesta.mensaje;
          this.mensajeError = null;

          this.cargarClientes();

          this.limpiarFormulario();

        },
        error: (error) => {

          this.mensajeError = error?.error?.mensaje ?? 'No se pudo actualizar el cliente.';
          this.mensajeExito = null;

        }
      });

      return;

    }

    this.clientesService.crear(datos).subscribe({
      next: (respuesta) => {

        this.mensajeExito = respuesta.mensaje;
        this.mensajeError = null;

        this.cargarClientes();

        this.limpiarFormulario();

      },
      error: (error) => {

        this.mensajeError = error?.error?.mensaje ?? 'No se pudo crear el cliente.';
        this.mensajeExito = null;

      }
    });

  }

  cambiarEstado(): void {

    if (this.clienteSeleccionadoId === null) {
      return;
    }

    this.clientesService.cambiarEstado(
      this.clienteSeleccionadoId,
      !this.estadoClienteSeleccionado
    ).subscribe({
      next: (respuesta) => {

        this.mensajeExito = respuesta.mensaje;
        this.mensajeError = null;

        this.cargarClientes();

        this.limpiarFormulario();

      },
      error: (error) => {

        this.mensajeError = error?.error?.mensaje ?? 'No se pudo cambiar el estado del cliente.';
        this.mensajeExito = null;

      }
    });

  }
    
    



}