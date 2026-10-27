import { Component, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';

import {
  Atencion,
  Reportes as ReportesService
} from '../reportes';

import {
  Usuario,
  Usuarios as UsuariosService
} from '../../usuarios/usuarios';

import {
  ColumnaReporte,
  ExportarReporte
} from '../../../core/services/exportar-reporte';

const COLUMNAS: ColumnaReporte<Atencion>[] = [
  { encabezado: 'Fecha', valor: (a) => a.fechaAtencion },
  { encabezado: 'Mascota', valor: (a) => a.nombreMascota },
  { encabezado: 'Cliente', valor: (a) => a.nombreCliente },
  { encabezado: 'Veterinario', valor: (a) => a.nombreVeterinario },
  { encabezado: 'Diagnóstico', valor: (a) => a.diagnostico },
  { encabezado: 'Tratamiento', valor: (a) => a.tratamiento }
];

@Component({
  selector: 'app-reporte-atenciones',
  imports: [
    FormsModule
  ],
  templateUrl: './atenciones.html',
  styleUrl: './atenciones.css',
})
export class ReporteAtenciones implements OnInit {

  atenciones = signal<Atencion[]>([]);

  veterinarios = signal<Usuario[]>([]);

  fechaDesde = '';

  fechaHasta = '';

  idVeterinarioFiltro: number | null = null;

  constructor(
    private reportesService: ReportesService,
    private usuariosService: UsuariosService,
    private exportarReporte: ExportarReporte
  ) {}

  ngOnInit(): void {
    this.cargarVeterinarios();

    this.buscar();

  }

  cargarVeterinarios(): void {

    this.usuariosService.listar('', '2', 'true').subscribe({
      next: (respuesta) => {

        this.veterinarios.set(respuesta);

      },
      error: (error) => {

        console.error(
          'Error al cargar veterinarios:',
          error
        );

      }
    });

  }

  buscar(): void {

    this.reportesService.reporteAtenciones(
      this.fechaDesde,
      this.fechaHasta,
      this.idVeterinarioFiltro,
      null
    ).subscribe({
      next: (respuesta) => {

        this.atenciones.set(respuesta);

      },
      error: (error) => {

        console.error(
          'Error al generar el reporte de atenciones:',
          error
        );

      }
    });

  }

  exportarCsv(): void {

    this.exportarReporte.exportarCsv(
      'reporte-atenciones',
      COLUMNAS,
      this.atenciones()
    );

  }

  exportarPdf(): void {

    this.exportarReporte.exportarPdf(
      'Reporte de Atenciones Veterinarias',
      `Del ${this.fechaDesde || 'inicio'} al ${this.fechaHasta || 'hoy'}`,
      COLUMNAS,
      this.atenciones()
    );

  }
}
