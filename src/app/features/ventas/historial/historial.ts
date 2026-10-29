import { Component, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { DatePipe } from '@angular/common';

import {
  Venta,
  Ventas as VentasService
} from '../ventas';

@Component({
  selector: 'app-historial-ventas',
  imports: [
    FormsModule,
    DatePipe
  ],
  templateUrl: './historial.html',
  styleUrl: './historial.css',
})
export class Historial implements OnInit {

  ventas = signal<Venta[]>([]);

  fechaDesde = '';

  fechaHasta = '';

  estadoFiltro = '';

  constructor(
    private ventasService: VentasService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.cargarVentas();

  }

  buscar(): void {

    this.cargarVentas();

  }

  cargarVentas(): void {

    this.ventasService.listar(
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
          'Error al cargar ventas:',
          error
        );

      }
    });

  }

  verComprobante(idVenta: number): void {

    this.router.navigateByUrl(`/ventas/comprobante/${idVenta}`);

  }
}
