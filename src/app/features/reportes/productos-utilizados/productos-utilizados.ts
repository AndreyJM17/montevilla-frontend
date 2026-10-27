import { Component, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';

import {
  ProductoMasUtilizado,
  Reportes as ReportesService
} from '../reportes';

import {
  ColumnaReporte,
  ExportarReporte
} from '../../../core/services/exportar-reporte';

const COLUMNAS: ColumnaReporte<ProductoMasUtilizado>[] = [
  { encabezado: 'Código', valor: (p) => p.codigo },
  { encabezado: 'Nombre', valor: (p) => p.nombre },
  { encabezado: 'Categoría', valor: (p) => p.categoria },
  { encabezado: 'Tipo', valor: (p) => p.tipoItem },
  { encabezado: 'Cantidad utilizada', valor: (p) => p.cantidadUtilizada },
  { encabezado: 'N° de atenciones', valor: (p) => p.numeroAtenciones }
];

@Component({
  selector: 'app-reporte-productos-utilizados',
  imports: [
    FormsModule
  ],
  templateUrl: './productos-utilizados.html',
  styleUrl: './productos-utilizados.css',
})
export class ReporteProductosUtilizados implements OnInit {

  productos = signal<ProductoMasUtilizado[]>([]);

  fechaDesde = '';

  fechaHasta = '';

  tipoItemFiltro = '';

  constructor(
    private reportesService: ReportesService,
    private exportarReporte: ExportarReporte
  ) {}

  ngOnInit(): void {
    this.buscar();

  }

  buscar(): void {

    this.reportesService.reporteProductosMasUtilizados(
      this.fechaDesde,
      this.fechaHasta,
      this.tipoItemFiltro
    ).subscribe({
      next: (respuesta) => {

        this.productos.set(respuesta);

      },
      error: (error) => {

        console.error(
          'Error al generar el reporte de productos más utilizados:',
          error
        );

      }
    });

  }

  exportarCsv(): void {

    this.exportarReporte.exportarCsv(
      'reporte-productos-mas-utilizados',
      COLUMNAS,
      this.productos()
    );

  }

  exportarPdf(): void {

    this.exportarReporte.exportarPdf(
      'Reporte de Productos Más Utilizados en Atención',
      `Del ${this.fechaDesde || 'inicio'} al ${this.fechaHasta || 'hoy'}`,
      COLUMNAS,
      this.productos()
    );

  }
}
