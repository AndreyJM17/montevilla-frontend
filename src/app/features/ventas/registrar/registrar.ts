import { Component, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

import {
  VentaIniciar,
  LineaAdicional,
  Ventas as VentasService
} from '../ventas';

import {
  Cita,
  Citas as CitasService
} from '../../citas/citas';

import {
  Producto,
  Inventario as InventarioService
} from '../../inventario/inventario';

import { Auth } from '../../auth/auth';

@Component({
  selector: 'app-registrar-venta',
  imports: [
    FormsModule
  ],
  templateUrl: './registrar.html',
  styleUrl: './registrar.css',
})
export class Registrar implements OnInit {

  citasCompletadas = signal<Cita[]>([]);

  productosDisponibles = signal<Producto[]>([]);

  ventaIniciada = signal<VentaIniciar | null>(null);

  lineasAdicionales = signal<LineaAdicional[]>([]);

  idCitaSeleccionada: number | null = null;

  idProductoNuevo: number | null = null;

  cantidadProductoNuevo = 1;

  metodoPago = '';

  montoDescuento = 0;

  mostrarAutorizacion = false;

  correoAutorizador = '';

  contrasenaAutorizador = '';

  idUsuarioAutorizaDescuento: number | null = null;

  nombreAutorizador = '';

  mensajeExito: string | null = null;

  mensajeError: string | null = null;

  constructor(
    private ventasService: VentasService,
    private citasService: CitasService,
    private inventarioService: InventarioService,
    private authService: Auth,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.cargarCitasCompletadas();
    this.cargarProductosDisponibles();

  }

  cargarCitasCompletadas(): void {

    this.citasService.listar('', 'Completada').subscribe({
      next: (citas) => {

        // Una cita Completada puede ya tener venta registrada
        // (uq_venta_cita) — se excluyen del selector para que el
        // recepcionista no elija una que el backend igual rechazará.
        this.ventasService.listar().subscribe({
          next: (ventas) => {

            const citasConVenta = new Set(
              ventas.map((v) => v.idCita)
            );

            this.citasCompletadas.set(
              citas.filter((c) => !citasConVenta.has(c.idCita))
            );

          },
          error: (error) => {

            console.error(
              'Error al cargar ventas existentes:',
              error
            );

            // Ante un error al validar, mostrar igual las citas
            // completadas — el backend sigue siendo la última barrera.
            this.citasCompletadas.set(citas);

          }
        });

      },
      error: (error) => {

        console.error(
          'Error al cargar citas completadas:',
          error
        );

      }
    });

  }

  cargarProductosDisponibles(): void {

    this.inventarioService.listarProductos(
      '',
      undefined,
      'Producto',
      true
    ).subscribe({
      next: (respuesta) => {

        this.productosDisponibles.set(respuesta);

      },
      error: (error) => {

        console.error(
          'Error al cargar productos:',
          error
        );

      }
    });

  }

  iniciarVenta(): void {

    if (!this.idCitaSeleccionada) {
      return;
    }

    this.ventasService.iniciar(
      this.idCitaSeleccionada
    ).subscribe({
      next: (respuesta) => {

        this.ventaIniciada.set(respuesta);

      },
      error: (error) => {

        this.mensajeError = error?.error?.mensaje ?? 'Error al iniciar la venta';
        this.mensajeExito = null;

        this.ventaIniciada.set(null);

      }
    });

  }

  nombreProductoAdicional(idProducto: number): string {

    const producto = this.productosDisponibles()
      .find((p) => p.idProducto === idProducto);

    return producto?.nombre ?? `Producto #${idProducto}`;

  }

  precioProductoAdicional(idProducto: number): number {

    const producto = this.productosDisponibles()
      .find((p) => p.idProducto === idProducto);

    return producto?.precio ?? 0;

  }

  agregarLineaAdicional(): void {

    if (!this.idProductoNuevo || this.cantidadProductoNuevo <= 0) {
      return;
    }

    const yaAgregado = this.lineasAdicionales().some(
      (l) => l.idProducto === this.idProductoNuevo
    );

    if (yaAgregado) {
      this.mensajeError = 'Ese producto ya fue agregado. Elimínalo primero si querés cambiar la cantidad.';
      this.mensajeExito = null;
      return;
    }

    this.lineasAdicionales.update((lista) => [
      ...lista,
      {
        idProducto: this.idProductoNuevo!,
        cantidad: this.cantidadProductoNuevo
      }
    ]);

    this.idProductoNuevo = null;
    this.cantidadProductoNuevo = 1;

  }

  quitarLineaAdicional(idProducto: number): void {

    this.lineasAdicionales.update((lista) =>
      lista.filter((l) => l.idProducto !== idProducto)
    );

  }

  subtotalAtencion(): number {

    return (this.ventaIniciada()?.lineas ?? [])
      .reduce((suma, linea) => suma + linea.subtotal, 0);

  }

  subtotalAdicionales(): number {

    return this.lineasAdicionales().reduce(
      (suma, linea) =>
        suma + (linea.cantidad * this.precioProductoAdicional(linea.idProducto)),
      0
    );

  }

  subtotalTotal(): number {

    return this.subtotalAtencion() + this.subtotalAdicionales();

  }

  totalConDescuento(): number {

    return this.subtotalTotal() - (this.montoDescuento || 0);

  }

  abrirAutorizacion(): void {

    this.mostrarAutorizacion = true;

  }

  cancelarAutorizacion(): void {

    this.mostrarAutorizacion = false;

    this.correoAutorizador = '';

    this.contrasenaAutorizador = '';

  }

  confirmarAutorizacion(): void {

    this.ventasService.autorizarDescuento(
      this.correoAutorizador,
      this.contrasenaAutorizador
    ).subscribe({
      next: (respuesta) => {

        this.idUsuarioAutorizaDescuento = respuesta.idUsuario;

        this.nombreAutorizador = respuesta.nombreCompleto;

        this.mostrarAutorizacion = false;

        this.correoAutorizador = '';

        this.contrasenaAutorizador = '';

        this.mensajeExito = `Descuento autorizado por ${respuesta.nombreCompleto}.`;
        this.mensajeError = null;

      },
      error: (error) => {

        this.mensajeError = error?.error?.mensaje ?? 'No se pudo autorizar el descuento';
        this.mensajeExito = null;

      }
    });

  }

  quitarDescuento(): void {

    this.montoDescuento = 0;

    this.idUsuarioAutorizaDescuento = null;

    this.nombreAutorizador = '';

  }

  guardar(): void {

    const venta = this.ventaIniciada();

    if (!venta || !this.metodoPago) {
      return;
    }

    const idUsuarioRecepcionista =
      this.authService.usuarioActual()?.idUsuario;

    if (!idUsuarioRecepcionista) {
      this.mensajeError = 'No se pudo determinar el usuario de la sesión actual';
      this.mensajeExito = null;
      return;
    }

    if (this.montoDescuento > 0 && !this.idUsuarioAutorizaDescuento) {
      this.mensajeError = 'El descuento requiere autorización de un Administrador';
      this.mensajeExito = null;
      return;
    }

    this.ventasService.registrar({
      idCita: venta.idCita,
      idUsuarioRecepcionista,
      metodoPago: this.metodoPago,
      descuento: this.montoDescuento || 0,
      idUsuarioAutorizaDescuento: this.idUsuarioAutorizaDescuento,
      lineasAdicionales: this.lineasAdicionales()
    }).subscribe({
      next: (respuesta) => {

        this.mensajeExito = respuesta.mensaje;
        this.mensajeError = null;

        this.limpiarFormulario();

        // Pequeña espera para que el usuario alcance a leer el mensaje
        // de éxito antes de navegar al historial.
        setTimeout(() => this.router.navigateByUrl('/ventas/historial'), 1200);

      },
      error: (error) => {

        this.mensajeError = error?.error?.mensaje ?? 'Error al registrar la venta';
        this.mensajeExito = null;

      }
    });

  }

  limpiarFormulario(): void {

    this.idCitaSeleccionada = null;

    this.ventaIniciada.set(null);

    this.lineasAdicionales.set([]);

    this.metodoPago = '';

    this.quitarDescuento();

    this.cargarCitasCompletadas();

  }
}
