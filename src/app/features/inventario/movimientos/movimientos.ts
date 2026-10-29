import { Component, OnInit, signal } from '@angular/core';
import {
  FormBuilder,
  FormsModule,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';
import { DatePipe } from '@angular/common';

import {
  Movimiento,
  Producto,
  Inventario as InventarioService
} from '../inventario';

@Component({
  selector: 'app-movimientos',
  imports: [
    ReactiveFormsModule,
    FormsModule,
    DatePipe
  ],
  templateUrl: './movimientos.html',
  styleUrl: './movimientos.css',
})
export class Movimientos implements OnInit {

  movimientos = signal<Movimiento[]>([]);

  productos = signal<Producto[]>([]);

  mensajeExito: string | null = null;

  mensajeError: string | null = null;

  idProductoFiltro: number | null = null;

  tipoMovimientoFiltro = '';

  private formBuilder = new FormBuilder();

  movimientoForm = this.formBuilder.group({
    idProducto: [null as number | null, Validators.required],
    tipoMovimiento: ['Entrada', Validators.required],
    cantidad: [1, [Validators.required, Validators.min(1)]],
    motivo: ['']
  });

  constructor(
    private inventarioService: InventarioService
  ) {}

  ngOnInit(): void {
    this.cargarProductos();

    this.cargarMovimientos();

  }

  buscar(): void {

    this.cargarMovimientos();

  }

  cargarMovimientos(): void {

    this.inventarioService.listarMovimientos(
      this.idProductoFiltro,
      this.tipoMovimientoFiltro
    ).subscribe({
      next: (respuesta) => {

        this.movimientos.set(respuesta);

      },
      error: (error) => {

        console.error(
          'Error al cargar movimientos:',
          error
        );

      }
    });

  }

  cargarProductos(): void {

    this.inventarioService.listarProductos(
      '',
      undefined,
      'Producto',
      true
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

  limpiarFormulario(): void {

    this.movimientoForm.reset({
      idProducto: null,
      tipoMovimiento: 'Entrada',
      cantidad: 1,
      motivo: ''
    });

  }

  guardar(): void {

    if (this.movimientoForm.invalid) {
      return;
    }

    const datos = {
      idProducto: this.movimientoForm.value.idProducto!,
      tipoMovimiento: this.movimientoForm.value.tipoMovimiento!,
      cantidad: this.movimientoForm.value.cantidad!,
      motivo: this.movimientoForm.value.motivo ?? ''
    };

    this.inventarioService.registrar(
      datos
    ).subscribe({
      next: (respuesta) => {

        this.mensajeExito = respuesta.mensaje;
        this.mensajeError = null;

        this.cargarMovimientos();

        this.limpiarFormulario();

      },
      error: (error) => {

        this.mensajeError = error?.error?.mensaje ?? 'No se pudo registrar el movimiento.';
        this.mensajeExito = null;

      }
    });

  }
}
