import { Component, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';

import {
  Cita,
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

const COLUMNAS: ColumnaReporte<Cita>[] = [
  { encabezado: 'Fecha', valor: (c) => c.fechaCita },
  { encabezado: 'Hora', valor: (c) => c.horaCita },
  { encabezado: 'Mascota', valor: (c) => c.nombreMascota },
  { encabezado: 'Cliente', valor: (c) => c.nombreCliente },
  { encabezado: 'Veterinario', valor: (c) => c.nombreVeterinario },
  { encabezado: 'Motivo', valor: (c) => c.motivoConsulta },
  { encabezado: 'Estado', valor: (c) => c.estado }
];

@Component({
  selector: 'app-reporte-citas',
  imports: [
    FormsModule
  ],
  templateUrl: './citas.html',
  styleUrl: './citas.css',
})
export class ReporteCitas implements OnInit {

  citas = signal<Cita[]>([]);

  veterinarios = signal<Usuario[]>([]);

  fechaDesde = '';

  fechaHasta = '';

  estadoFiltro = '';

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

    // idRol='2' filtra solo Veterinarios
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

    this.reportesService.reporteCitas(
      this.fechaDesde,
      this.fechaHasta,
      this.estadoFiltro,
      this.idVeterinarioFiltro
    ).subscribe({
      next: (respuesta) => {

        this.citas.set(respuesta);

      },
      error: (error) => {

        console.error(
          'Error al generar el reporte de citas:',
          error
        );

      }
    });

  }

  exportarCsv(): void {

    this.exportarReporte.exportarCsv(
      'reporte-citas',
      COLUMNAS,
      this.citas()
    );

  }

  exportarPdf(): void {

    this.exportarReporte.exportarPdf(
      'Reporte de Citas',
      `Del ${this.fechaDesde || 'inicio'} al ${this.fechaHasta || 'hoy'}`,
      COLUMNAS,
      this.citas()
    );

  }
}
