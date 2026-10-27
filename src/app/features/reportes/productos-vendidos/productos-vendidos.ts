import { Component, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';

import {
  ProductoMasVendido,
  Reportes as ReportesService
} from '../reportes';

import {
  ColumnaReporte,
  ExportarReporte
} from '../../../core/services/exportar-reporte';

const COLUMNAS: ColumnaReporte<ProductoMasVendido>[] = [
  { encabezado: 'Código', valor: (p) => p.codigo },
  { encabezado: 'Nombre', valor: (p) => p.nombre },
  { encabezado: 'Categoría', valor: (p) => p.categoria },
  { encabezado: 'Tipo', valor: (p) => p.tipoItem },
  { encabezado: 'Cantidad vendida', valor: (p) => p.cantidadVendida },
  { encabezado: 'Ingresos totales', valor: (p) => p.ingresosTotales }
];

@Component({
  selector: 'app-reporte-productos-vendidos',
  imports: [
    FormsModule
  ],
  templateUrl: './productos-vendidos.html',
  styleUrl: './productos-vendidos.css',
})
export class ReporteProductosVendidos implements OnInit {

  productos = signal<ProductoMasVendido[]>([]);

  fechaDesde = '';

  fechaHasta = '';

  categoriaFiltro = '';

  tipoItemFiltro = '';

  constructor(
    private reportesService: ReportesService,
    private exportarReporte: ExportarReporte
  ) {}

  ngOnInit(): void {
    this.buscar();

  }

  buscar(): void {

    this.reportesService.reporteProductosMasVendidos(
      this.fechaDesde,
      this.fechaHasta,
      this.categoriaFiltro,
      this.tipoItemFiltro
    ).subscribe({
      next: (respuesta) => {

        this.productos.set(respuesta);

      },
      error: (error) => {

        console.error(
          'Error al generar el reporte de productos más vendidos:',
          error
        );

      }
    });

  }

  exportarCsv(): void {

    this.exportarReporte.exportarCsv(
      'reporte-productos-mas-vendidos',
      COLUMNAS,
      this.productos()
    );

  }

  exportarPdf(): void {

    this.exportarReporte.exportarPdf(
      'Reporte de Productos Más Vendidos',
      `Del ${this.fechaDesde || 'inicio'} al ${this.fechaHasta || 'hoy'}`,
      COLUMNAS,
      this.productos()
    );

  }
}
