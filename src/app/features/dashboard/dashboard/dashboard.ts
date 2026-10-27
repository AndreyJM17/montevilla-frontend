import { Component, OnInit, signal } from '@angular/core';
import { ChartConfiguration } from 'chart.js';

import { Auth } from '../../auth/auth';

import {
  Dashboard as DashboardDatos,
  DashboardService
} from '../dashboard';

import { Grafico } from '../../../core/components/grafico/grafico';

@Component({
  selector: 'app-dashboard',
  imports: [
    Grafico
  ],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})
export class Dashboard implements OnInit {

  datos = signal<DashboardDatos | null>(null);

  configVentas: ChartConfiguration | null = null;

  configCitas: ChartConfiguration | null = null;

  constructor(
    private authService: Auth,
    private dashboardService: DashboardService
  ) {}

  get usuario() {
    return this.authService.usuarioActual();
  }

  ngOnInit(): void {

    this.dashboardService.obtenerResumen().subscribe({
      next: (respuesta) => {

        this.datos.set(respuesta);

        this.configVentas = this.construirConfigVentas(respuesta);

        this.configCitas = this.construirConfigCitas(respuesta);

      },
      error: (error) => {

        console.error(
          'Error al cargar el dashboard:',
          error
        );

      }
    });

  }

  private construirConfigVentas(
    datos: DashboardDatos
  ): ChartConfiguration {

    return {
      type: 'line',
      data: {
        labels: datos.ventasUltimosDias.map((v) => v.fecha),
        datasets: [
          {
            label: 'Ventas por día',
            data: datos.ventasUltimosDias.map((v) => v.totalDia),
            borderColor: '#7c3aed',
            backgroundColor: 'rgba(124, 58, 237, 0.15)',
            fill: true,
            tension: 0.3
          }
        ]
      },
      options: {
        responsive: true,
        plugins: {
          legend: { display: false }
        }
      }
    };

  }

  private construirConfigCitas(
    datos: DashboardDatos
  ): ChartConfiguration {

    return {
      type: 'doughnut',
      data: {
        labels: datos.citasHoyPorEstado.map((c) => c.estado),
        datasets: [
          {
            data: datos.citasHoyPorEstado.map((c) => c.total),
            backgroundColor: [
              '#7c3aed',
              '#a78bfa',
              '#22c55e',
              '#ef4444',
              '#f59e0b'
            ]
          }
        ]
      },
      options: {
        responsive: true
      }
    };

  }
}
