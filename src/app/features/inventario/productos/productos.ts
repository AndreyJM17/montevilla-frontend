import { Component, OnInit, signal } from '@angular/core';
import {
  FormBuilder,
  FormsModule,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';

import {
  Distribuidor,
  Producto,
  Inventario as InventarioService
} from '../inventario';

@Component({
  selector: 'app-productos',
  imports: [
    ReactiveFormsModule,
    FormsModule
  ],
  templateUrl: './productos.html',
  styleUrl: './productos.css',
})
export class Productos implements OnInit {

  productos = signal<Producto[]>([]);

  distribuidores = signal<Distribuidor[]>([]);

  productoSeleccionadoId: number | null = null;

  estadoProductoSeleccionado = true;

  modoEdicion = false;

  mensajeExito: string | null = null;

  mensajeError: string | null = null;

  busqueda = '';

  tipoItemFiltro = '';

  estadoFiltro = '';

  readonly categorias = [
  'Medicamentos',
  'Vacunas',
  'Alimentos',
  'Accesorios',
  'Higiene',
  'Suplementos',
  'Servicios'
  ];

  private formBuilder = new FormBuilder();

  productoForm = this.formBuilder.group({
    codigo: ['', Validators.required],
    nombre: ['', Validators.required],
    categoria: [''],
    descripcion: [''],
    precio: [0, Validators.required],
    stockMinimo: [0, Validators.required],
    fechaVencimiento: [''],
    idDistribuidor: [null as number | null],
    tipoItem: ['Producto', Validators.required]
  });

  constructor(
    private inventarioService: InventarioService
  ) {}

  ngOnInit(): void {
    this.cargarDistribuidores();

    this.cargarProductos();

  }

  buscar(): void {

    this.cargarProductos();

  }

  cargarProductos(): void {

    const estado =
      this.estadoFiltro === ''
        ? null
        : this.estadoFiltro === 'true';

    this.inventarioService.listarProductos(
      this.busqueda,
      undefined,
      this.tipoItemFiltro,
      estado
    ).subscribe({
      next: (respuesta) => {

        this.productos.set(respuesta);

      },
      error: (error) => {

        console.error(
          'Error al cargar productos:',
          error
        );

      }
    });

  }

  cargarDistribuidores(): void {

    this.inventarioService.listarDistribuidores(
      '',
      true
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

    this.productoSeleccionadoId = null;

    this.estadoProductoSeleccionado = true;

    this.modoEdicion = false;

    this.productoForm.reset({
      codigo: '',
      nombre: '',
      categoria: '',
      descripcion: '',
      precio: 0,
      stockMinimo: 0,
      fechaVencimiento: '',
      idDistribuidor: null,
      tipoItem: 'Producto'
    });

  }

  seleccionarProducto(
    producto: Producto
  ): void {

    this.productoSeleccionadoId =
      producto.idProducto;

    this.estadoProductoSeleccionado =
      producto.estado;

    this.modoEdicion = true;

    this.productoForm.patchValue({
      codigo: producto.codigo,
      nombre: producto.nombre,
      categoria: producto.categoria ?? '',
      descripcion: producto.descripcion ?? '',
      precio: producto.precio,
      stockMinimo: producto.stockMinimo,
      fechaVencimiento: producto.fechaVencimiento ?? '',
      idDistribuidor: producto.idDistribuidor ?? null,
      tipoItem: producto.tipoItem
    });

  }

  guardar(): void {

    if (this.productoForm.invalid) {
      return;
    }

    const esServicio =
      this.productoForm.value.tipoItem === 'Servicio';

    if (
      this.modoEdicion &&
      this.productoSeleccionadoId !== null
    ) {

      const datos = {
        codigo: this.productoForm.value.codigo!,
        nombre: this.productoForm.value.nombre!,
        categoria: this.productoForm.value.categoria ?? '',
        descripcion: this.productoForm.value.descripcion ?? '',
        precio: this.productoForm.value.precio!,
        stockMinimo: this.productoForm.value.stockMinimo!,
        fechaVencimiento:
          esServicio
            ? ''
            : this.productoForm.value.fechaVencimiento ?? '',
        idDistribuidor:
          esServicio
            ? null
            : this.productoForm.value.idDistribuidor ?? null
      };

      this.inventarioService.actualizarProducto(
        this.productoSeleccionadoId,
        datos
      ).subscribe({
        next: (respuesta) => {

          this.mensajeExito = respuesta.mensaje;
          this.mensajeError = null;

          this.cargarProductos();

          this.limpiarFormulario();

        },
        error: (error) => {

          this.mensajeError = error?.error?.mensaje ?? 'No se pudo actualizar el producto.';
          this.mensajeExito = null;

        }
      });

      return;

    }

    const datos = {
      codigo: this.productoForm.value.codigo!,
      nombre: this.productoForm.value.nombre!,
      categoria: this.productoForm.value.categoria ?? '',
      descripcion: this.productoForm.value.descripcion ?? '',
      precio: this.productoForm.value.precio!,
      stockMinimo: this.productoForm.value.stockMinimo!,
      fechaVencimiento:
        esServicio
          ? undefined
          : this.productoForm.value.fechaVencimiento ?? undefined,
      idDistribuidor:
        esServicio
          ? null
          : this.productoForm.value.idDistribuidor ?? null,
      tipoItem: this.productoForm.value.tipoItem!
    };

    this.inventarioService.crearProducto(
      datos
    ).subscribe({
      next: (respuesta) => {

        this.mensajeExito = respuesta.mensaje;
        this.mensajeError = null;

        this.cargarProductos();

        this.limpiarFormulario();

      },
      error: (error) => {

        this.mensajeError = error?.error?.mensaje ?? 'No se pudo crear el producto.';
        this.mensajeExito = null;

      }
    });

  }

  cambiarEstado(): void {

    if (
      this.productoSeleccionadoId === null
    ) {
      return;
    }

    this.inventarioService.cambiarEstadoProducto(
      this.productoSeleccionadoId,
      !this.estadoProductoSeleccionado
    ).subscribe({
      next: (respuesta) => {

        this.mensajeExito = respuesta.mensaje;
        this.mensajeError = null;

        this.cargarProductos();

        this.limpiarFormulario();

      },
      error: (error) => {

        this.mensajeError = error?.error?.mensaje ?? 'No se pudo cambiar el estado del producto.';
        this.mensajeExito = null;

      }
    });

  }
}
