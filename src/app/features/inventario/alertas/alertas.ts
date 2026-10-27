import { Component, OnInit, signal } from '@angular/core';

import {
  Producto,
  Inventario as InventarioService
} from '../inventario';

@Component({
  selector: 'app-alertas',
  imports: [],
  templateUrl: './alertas.html',
  styleUrl: './alertas.css',
})
export class Alertas implements OnInit {

  productosConAlerta = signal<Producto[]>([]);

  constructor(
    private inventarioService: InventarioService
  ) {}

  ngOnInit(): void {
    this.cargarAlertas();

  }

  cargarAlertas(): void {

    this.inventarioService.listarProductos(
      '',
      undefined,
      undefined,
      true
    ).subscribe({
      next: (respuesta) => {

        this.productosConAlerta.set(
          respuesta.filter((producto) =>
            producto.alertaSinStock ||
            producto.alertaStockBajo ||
            producto.alertaVencido ||
            producto.alertaPorVencer
          )
        );

      },
      error: (error) => {

        console.error(
          'Error al cargar alertas:',
          error
        );

      }
    });

  }

  contarSinStock(): number {

    return this.productosConAlerta()
      .filter((p) => p.alertaSinStock)
      .length;

  }

  contarStockBajo(): number {

    return this.productosConAlerta()
      .filter((p) => p.alertaStockBajo)
      .length;

  }

  contarVencidos(): number {

    return this.productosConAlerta()
      .filter((p) => p.alertaVencido)
      .length;

  }

  contarPorVencer(): number {

    return this.productosConAlerta()
      .filter((p) => p.alertaPorVencer)
      .length;

  }
}
