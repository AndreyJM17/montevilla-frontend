import { Component, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';

import {
  Producto,
  Reportes as ReportesService
} from '../reportes';

import {
  ColumnaReporte,
  ExportarReporte
} from '../../../core/services/exportar-reporte';

function alertaTexto(p: Producto): string {

  if (p.alertaSinStock) return 'Sin stock';
  if (p.alertaVencido) return 'Vencido';
  if (p.alertaStockBajo) return 'Stock bajo';
  if (p.alertaPorVencer) return 'Por vencer';
  return '';

}

const COLUMNAS: ColumnaReporte<Producto>[] = [
  { encabezado: 'Código', valor: (p) => p.codigo },
  { encabezado: 'Nombre', valor: (p) => p.nombre },
  { encabezado: 'Categoría', valor: (p) => p.categoria },
  { encabezado: 'Tipo', valor: (p) => p.tipoItem },
  { encabezado: 'Stock actual', valor: (p) => p.stockActual },
  { encabezado: 'Stock mínimo', valor: (p) => p.stockMinimo },
  { encabezado: 'Vencimiento', valor: (p) => p.fechaVencimiento },
  { encabezado: 'Distribuidor', valor: (p) => p.nombreDistribuidor },
  { encabezado: 'Alerta', valor: (p) => alertaTexto(p) }
];

@Component({
  selector: 'app-reporte-inventario',
  imports: [
    FormsModule
  ],
  templateUrl: './inventario.html',
  styleUrl: './inventario.css',
})
export class ReporteInventario implements OnInit {

  productos = signal<Producto[]>([]);

  busqueda = '';

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

    this.reportesService.reporteInventario(
      this.busqueda,
      this.categoriaFiltro,
      this.tipoItemFiltro,
      true
    ).subscribe({
      next: (respuesta) => {

        this.productos.set(
          this.ordenarPorAlerta(respuesta)
        );

      },
      error: (error) => {

        console.error(
          'Error al generar el reporte de inventario:',
          error
        );

      }
    });

  }

  // Alertas críticas primero (sin stock, luego vencidos, luego stock
  // bajo, luego por vencer), después alfabético.
  private ordenarPorAlerta(productos: Producto[]): Producto[] {

    const peso = (p: Producto): number => {

      if (p.alertaSinStock) return 0;
      if (p.alertaVencido) return 1;
      if (p.alertaStockBajo) return 2;
      if (p.alertaPorVencer) return 3;
      return 4;

    };

    return [...productos].sort((a, b) => {

      const diferencia = peso(a) - peso(b);

      if (diferencia !== 0) {
        return diferencia;
      }

      return a.nombre.localeCompare(b.nombre);

    });

  }

  exportarCsv(): void {

    this.exportarReporte.exportarCsv(
      'reporte-inventario',
      COLUMNAS,
      this.productos()
    );

  }

  exportarPdf(): void {

    this.exportarReporte.exportarPdf(
      'Reporte de Inventario',
      'Estado actual del stock',
      COLUMNAS,
      this.productos()
    );

  }
}
