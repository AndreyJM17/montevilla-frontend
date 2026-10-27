import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { environment } from '../../../environments/environment';

export interface DashboardResumen {
  citasHoyTotal: number;

  citasHoyCompletadas: number;

  citasHoyPendientes: number;

  ventasHoy: number;

  ventasMes: number;

  atencionesMes: number;

  ticketPromedioMes: number;

  tasaAusentismoMes: number;

  productosSinStock: number;

  productosStockBajo: number;

  productosVencidos: number;

  productosPorVencer: number;
}

export interface DashboardVentaDia {
  fecha: string;

  totalDia: number;
}

export interface DashboardCitaEstado {
  estado: string;

  total: number;
}

export interface DashboardProductoTop {
  idProducto: number;

  codigo: string;

  nombre: string;

  categoria?: string;

  tipoItem: string;

  cantidadVendida: number;

  ingresosTotales: number;
}

export interface Dashboard {
  resumen: DashboardResumen;

  ventasUltimosDias: DashboardVentaDia[];

  citasHoyPorEstado: DashboardCitaEstado[];

  topProductosMes: DashboardProductoTop[];
}

@Injectable({
  providedIn: 'root',
})
export class DashboardService {

  private apiUrl = `${environment.apiUrl}/dashboard`;

  constructor(
    private http: HttpClient
  ) {}

  obtenerResumen(): Observable<Dashboard> {

    return this.http.get<Dashboard>(
      `${this.apiUrl}/resumen`,
      {
        withCredentials: true
      }
    );
  }
}
