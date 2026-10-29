import { Component, OnInit, signal } from '@angular/core';
import {
  FormBuilder,
  FormsModule,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';

 import { DecimalPipe, DatePipe } from '@angular/common';

import {
  Atencion,
  AtencionProducto,
  ExpedienteRow,
  ProductoAtencionItem,
  Atenciones as AtencionesService
} from '../atencion';

import {
  Mascota,
  Mascotas as MascotasService
} from '../../mascotas/mascotas';

import {
  Usuario,
  Usuarios as UsuariosService
} from '../../usuarios/usuarios';

import {
  Cita,
  Citas as CitasService
} from '../../citas/citas';

import {
  Producto,
  Inventario as InventarioService
} from '../../inventario/inventario';


@Component({
  selector: 'app-atencion',
  imports: [
    FormsModule,
    ReactiveFormsModule,
    DecimalPipe,
    DatePipe
  ],
  templateUrl: './atencion.html',
  styleUrl: './atencion.css'
})
export class Atenciones implements OnInit {

  atenciones = signal<Atencion[]>([]);

  mascotas = signal<Mascota[]>([]);

  veterinarios = signal<Usuario[]>([]);


  // Citas confirmadas disponibles para registrar atención
  citasConfirmadas = signal<Cita[]>([]);

  // Productos de la atención seleccionada (para visualizar)
  productosAtencion = signal<AtencionProducto[]>([]);

  // Expediente clínico de la mascota seleccionada
  expediente = signal<ExpedienteRow[]>([]);

  // Productos en el carrito antes de guardar
  productosEnForm = signal<ProductoAtencionItem[]>([]);

  // Catálogo de Inventario para el selector de productos/servicios
  productosDisponibles = signal<Producto[]>([]);

  atencionSeleccionadaId: number | null = null;

  mensajeExito: string | null = null;

  mensajeError: string | null = null;

  modoVerExpediente = false;

  citaSeleccionada: Cita | null = null;

  // Filtros
  idMascotaFiltro: number | null = null;

  idVeterinarioFiltro: number | null = null;

  // Control del producto que se está agregando al carrito
  idProductoNuevo: number | null = null;

  cantidadProductoNuevo = 1;

  private formBuilder = new FormBuilder();

  atencionForm = this.formBuilder.group({
    idCita: [
      null as number | null,
      Validators.required
    ],
    idUsuarioVeterinario: [
      null as number | null,
      Validators.required
    ],
    pesoActual: [null as number | null],
    sintomas: [''],
    diagnostico: [''],
    tratamiento: [''],
    observaciones: ['']
  });

  // Actualiza la cita seleccionada según el idCita del formulario
  actualizarCitaSeleccionada(): void {
    const idCita =
      this.atencionForm.value.idCita;

    this.citaSeleccionada =
      this.citasConfirmadas().find(
        cita => cita.idCita === idCita
      ) ?? null;
  }

  constructor(
    private atencionesService: AtencionesService,
    private mascotasService: MascotasService,
    private usuariosService: UsuariosService,
    private citasService: CitasService,
    private inventarioService: InventarioService,
  ) {}

  ngOnInit(): void {
    this.cargarMascotas();
    this.cargarVeterinarios();
    this.cargarCitasConfirmadas();
    this.cargarAtenciones();
    this.cargarProductosDisponibles();

  }

  cargarProductosDisponibles(): void {
    this.inventarioService.listarProductos('', undefined, undefined, true).subscribe({
      next: (respuesta) => this.productosDisponibles.set(respuesta),
      error: (error) => console.error('Error al cargar productos:', error)
    });
  }

  // ----------------------------------------------------------------
  // Carga de datos para los selects del formulario
  // ----------------------------------------------------------------

  cargarMascotas(): void {
    this.mascotasService.listar('', null, 'true').subscribe({
      next: (respuesta) => this.mascotas.set(respuesta),
      error: (error) => console.error('Error al cargar mascotas:', error)
    });
  }

  cargarVeterinarios(): void {
    // idRol='3' filtra solo Veterinarios
    this.usuariosService.listar('', '3', 'true').subscribe({
      next: (respuesta) => this.veterinarios.set(respuesta),
      error: (error) => console.error('Error al cargar veterinarios:', error)
    });
  }

  cargarCitasConfirmadas(): void {
    // Solo citas Confirmadas pueden iniciar atención
    this.citasService.listar('', 'Confirmada').subscribe({
      next: (respuesta) => this.citasConfirmadas.set(respuesta),
      error: (error) => console.error('Error al cargar citas:', error)
    });
  }

  // ----------------------------------------------------------------
  // Cargar y buscar atenciones
  // ----------------------------------------------------------------

  cargarAtenciones(): void {
    this.atencionesService.listar(
      null,
      this.idVeterinarioFiltro,
      this.idMascotaFiltro
    ).subscribe({
      next: (respuesta) => this.atenciones.set(respuesta),
      error: (error) => console.error('Error al cargar atenciones:', error)
    });
  }

  buscarAtenciones(): void {
    this.cargarAtenciones();
  }

  // ----------------------------------------------------------------
  // Ver expediente clínico de una mascota
  // ----------------------------------------------------------------

  verExpediente(idMascota: number): void {
    this.modoVerExpediente = true;

    this.atencionesService
      .obtenerExpediente(idMascota)
      .subscribe({
        next: (respuesta) => this.expediente.set(respuesta),
        error: (error) => console.error('Error al cargar expediente:', error)
      });
  }

  cerrarExpediente(): void {
    this.modoVerExpediente = false;
    this.expediente.set([]);
  }

  // ----------------------------------------------------------------
  // Ver productos de una atención desde la tabla
  // ----------------------------------------------------------------

  verProductos(idAtencion: number): void {
    this.atencionSeleccionadaId = idAtencion;

    this.atencionesService
      .listarProductos(idAtencion)
      .subscribe({
        next: (respuesta) => this.productosAtencion.set(respuesta),
        error: (error) => console.error('Error al cargar productos:', error)
      });
  }

  // ----------------------------------------------------------------
  // Gestión del carrito de productos (antes de guardar)
  // ----------------------------------------------------------------

  agregarProductoAlCarrito(): void {
    if (!this.idProductoNuevo || this.cantidadProductoNuevo <= 0) {
      return;
    }

    // Evitar duplicados en el carrito
    const yaAgregado = this.productosEnForm().some(
      p => p.idProducto === this.idProductoNuevo
    );

    if (yaAgregado) {
      this.mensajeError = 'Ese producto ya fue agregado. Eliminalo primero si querés cambiar la cantidad.';
      this.mensajeExito = null;
      return;
    }

    this.productosEnForm.update(lista => [
      ...lista,
      {
        idProducto: this.idProductoNuevo!,
        cantidad: this.cantidadProductoNuevo
      }
    ]);

    // Limpiar el selector
    this.idProductoNuevo = null;
    this.cantidadProductoNuevo = 1;
  }

  quitarProductoDelCarrito(idProducto: number): void {
    this.productosEnForm.update(lista =>
      lista.filter(p => p.idProducto !== idProducto)
    );
  }

  nombreProducto(idProducto: number): string {

    const producto = this.productosDisponibles()
      .find((p) => p.idProducto === idProducto);

    return producto
      ? `${producto.codigo} - ${producto.nombre}`
      : `Producto #${idProducto}`;

  }

  // ----------------------------------------------------------------
  // Guardar: crea la atención y luego registra los productos
  // ----------------------------------------------------------------

  guardar(): void {
    if (this.atencionForm.invalid) {
      return;
    }

    const datos = {
      pesoActual:
        this.atencionForm.value.pesoActual ?? undefined,
      sintomas:
        this.atencionForm.value.sintomas ?? '',
      diagnostico:
        this.atencionForm.value.diagnostico ?? '',
      tratamiento:
        this.atencionForm.value.tratamiento ?? '',
      observaciones:
        this.atencionForm.value.observaciones ?? '',
      idCita: this.atencionForm.value.idCita!,
      idUsuarioVeterinario:
        this.atencionForm.value.idUsuarioVeterinario!
    };

    this.atencionesService.crear(datos).subscribe({
      next: (respuesta) => {

        // Si hay productos en el carrito, los registra en un
        // segundo paso. Primero hay que obtener el id de la
        // atención recién creada buscándola por la cita.
        if (this.productosEnForm().length > 0) {
          this.registrarProductosDespuesDeCrear(datos.idCita);
        } else {
          this.mensajeExito = respuesta.mensaje;
          this.mensajeError = null;
          this.cargarAtenciones();
          this.limpiarFormulario();
        }

      },
      error: (error) => {
        this.mensajeError = error?.error?.mensaje ?? 'Error al registrar la atención';
        this.mensajeExito = null;
      }
    });
  }


  private registrarProductosDespuesDeCrear(idCita: number): void {
    // Buscar la atención recién creada por idCita
    this.atencionesService.listar(null, null, null).subscribe({
      next: (todas) => {

        const nueva = todas.find(a => a.idCita === idCita);

        if (!nueva) {
          this.cargarAtenciones();
          this.limpiarFormulario();
          return;
        }

        this.atencionesService
          .registrarProductos(nueva.idAtencion, this.productosEnForm())
          .subscribe({
            next: (respuesta) => {
              this.mensajeExito = respuesta.mensaje;
              this.mensajeError = null;
              this.cargarAtenciones();
              this.limpiarFormulario();
            },
            error: (error) => {
              this.mensajeError = error?.error?.mensaje
                ?? 'Atención guardada, pero ocurrió un error al registrar los productos';
              this.mensajeExito = null;
              this.cargarAtenciones();
              this.limpiarFormulario();
            }
          });

      },
      error: () => {
        this.cargarAtenciones();
        this.limpiarFormulario();
      }
    });
  }

  // ----------------------------------------------------------------
  // Limpiar formulario
  // ----------------------------------------------------------------

  limpiarFormulario(): void {
    this.atencionSeleccionadaId = null;
    this.productosEnForm.set([]);
    this.productosAtencion.set([]);
    this.idProductoNuevo = null;
    this.cantidadProductoNuevo = 1;
    this.atencionForm.reset();
    this.cargarCitasConfirmadas();
  }
}