import { Component, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';

import {
  Venta,
  Reportes as ReportesService
} from '../reportes';

import {
  ColumnaReporte,
  ExportarReporte
} from '../../../core/services/exportar-reporte';

const COLUMNAS: ColumnaReporte<Venta>[] = [
  { encabezado: 'Comprobante', valor: (v) => v.numeroComprobante },
  { encabezado: 'Fecha', valor: (v) => v.fechaVenta },
  { encabezado: 'Cliente', valor: (v) => v.nombreCliente },
  { encabezado: 'Mascota', valor: (v) => v.nombreMascota },
  { encabezado: 'Subtotal', valor: (v) => v.subtotal },
  { encabezado: 'Descuento', valor: (v) => v.descuento },
  { encabezado: 'Total', valor: (v) => v.total },
  { encabezado: 'Método de pago', valor: (v) => v.metodoPago },
  { encabezado: 'Recepcionista', valor: (v) => v.nombreRecepcionista },
  { encabezado: 'Estado', valor: (v) => v.estado }
];

@Component({
  selector: 'app-reporte-ventas',
  imports: [
    FormsModule
  ],
  templateUrl: './ventas.html',
  styleUrl: './ventas.css',
})
export class ReporteVentas implements OnInit {

  ventas = signal<Venta[]>([]);

  fechaDesde = '';

  fechaHasta = '';

  estadoFiltro = '';

  constructor(
    private reportesService: ReportesService,
    private exportarReporte: ExportarReporte
  ) {}

  ngOnInit(): void {
    this.buscar();

  }

  buscar(): void {

    this.reportesService.reporteVentas(
      this.fechaDesde,
      this.fechaHasta,
      null,
      this.estadoFiltro
    ).subscribe({
      next: (respuesta) => {

        this.ventas.set(respuesta);

      },
      error: (error) => {

        console.error(
          'Error al generar el reporte de ventas:',
          error
        );

      }
    });

  }

  totalGeneral(): number {

    return this.ventas().reduce(
      (suma, venta) => suma + venta.total,
      0
    );

  }

  exportarCsv(): void {

    this.exportarReporte.exportarCsv(
      'reporte-ventas',
      COLUMNAS,
      this.ventas()
    );

  }

  exportarPdf(): void {

    this.exportarReporte.exportarPdf(
      'Reporte de Ventas',
      `Del ${this.fechaDesde || 'inicio'} al ${this.fechaHasta || 'hoy'}`,
      COLUMNAS,
      this.ventas()
    );

  }
}
