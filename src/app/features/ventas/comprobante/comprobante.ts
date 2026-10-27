import { Component, OnInit, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import {
  VentaDetalle,
  Ventas as VentasService
} from '../ventas';

@Component({
  selector: 'app-comprobante-venta',
  imports: [],
  templateUrl: './comprobante.html',
  styleUrl: './comprobante.css',
})
export class Comprobante implements OnInit {

  venta = signal<VentaDetalle | null>(null);

  constructor(
    private ventasService: VentasService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {

    const idVenta = Number(
      this.route.snapshot.paramMap.get('id')
    );

    this.ventasService.obtenerDetalle(idVenta).subscribe({
      next: (respuesta) => {

        this.venta.set(respuesta);

      },
      error: (error) => {

        console.error(
          'Error al cargar el comprobante:',
          error
        );

      }
    });

  }

  imprimir(): void {

    window.print();

  }
}
