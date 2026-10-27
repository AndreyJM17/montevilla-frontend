import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { environment } from '../../../environments/environment';

import { Cita } from '../citas/citas';
import { Atencion } from '../atencion/atencion';
import { Venta } from '../ventas/ventas';
import { Producto } from '../inventario/inventario';

export type { Cita } from '../citas/citas';
export type { Atencion } from '../atencion/atencion';
export type { Venta } from '../ventas/ventas';
export type { Producto } from '../inventario/inventario';

export interface ProductoMasVendido {
  idProducto: number;

  codigo: string;

  nombre: string;

  categoria?: string;

  tipoItem: string;

  cantidadVendida: number;

  ingresosTotales: number;
}

export interface ProductoMasUtilizado {
  idProducto: number;

  codigo: string;

  nombre: string;

  categoria?: string;

  tipoItem: string;

  cantidadUtilizada: number;

  numeroAtenciones: number;
}

@Injectable({
  providedIn: 'root',
})
export class Reportes {

  private apiUrl = `${environment.apiUrl}/reporte`;

  constructor(
    private http: HttpClient
  ) {}

  reporteCitas(
    fechaDesde?: string,
    fechaHasta?: string,
    estado?: string,
    idVeterinario?: number | null
  ): Observable<Cita[]> {

    const params = new URLSearchParams();

    if (fechaDesde) {
      params.append('fechaDesde', fechaDesde);
    }

    if (fechaHasta) {
      params.append('fechaHasta', fechaHasta);
    }

    if (estado) {
      params.append('estado', estado);
    }

    if (idVeterinario) {
      params.append(
        'idVeterinario',
        idVeterinario.toString()
      );
    }

    const queryString = params.toString();

    const url = queryString
      ? `${this.apiUrl}/citas?${queryString}`
      : `${this.apiUrl}/citas`;

    return this.http.get<Cita[]>(
      url,
      {
        withCredentials: true
      }
    );
  }

  reporteAtenciones(
    fechaDesde?: string,
    fechaHasta?: string,
    idVeterinario?: number | null,
    idMascota?: number | null
  ): Observable<Atencion[]> {

    const params = new URLSearchParams();

    if (fechaDesde) {
      params.append('fechaDesde', fechaDesde);
    }

    if (fechaHasta) {
      params.append('fechaHasta', fechaHasta);
    }

    if (idVeterinario) {
      params.append(
        'idVeterinario',
        idVeterinario.toString()
      );
    }

    if (idMascota) {
      params.append(
        'idMascota',
        idMascota.toString()
      );
    }

    const queryString = params.toString();

    const url = queryString
      ? `${this.apiUrl}/atenciones?${queryString}`
      : `${this.apiUrl}/atenciones`;

    return this.http.get<Atencion[]>(
      url,
      {
        withCredentials: true
      }
    );
  }

  reporteVentas(
    fechaDesde?: string,
    fechaHasta?: string,
    idCliente?: number | null,
    estado?: string
  ): Observable<Venta[]> {

    const params = new URLSearchParams();

    if (fechaDesde) {
      params.append('fechaDesde', fechaDesde);
    }

    if (fechaHasta) {
      params.append('fechaHasta', fechaHasta);
    }

    if (idCliente) {
      params.append(
        'idCliente',
        idCliente.toString()
      );
    }

    if (estado) {
      params.append('estado', estado);
    }

    const queryString = params.toString();

    const url = queryString
      ? `${this.apiUrl}/ventas?${queryString}`
      : `${this.apiUrl}/ventas`;

    return this.http.get<Venta[]>(
      url,
      {
        withCredentials: true
      }
    );
  }

  reporteInventario(
    busqueda?: string,
    categoria?: string,
    tipoItem?: string,
    estado?: boolean | null,
    idDistribuidor?: number | null
  ): Observable<Producto[]> {

    const params = new URLSearchParams();

    if (busqueda) {
      params.append('busqueda', busqueda);
    }

    if (categoria) {
      params.append('categoria', categoria);
    }

    if (tipoItem) {
      params.append('tipoItem', tipoItem);
    }

    if (estado !== undefined && estado !== null) {
      params.append('estado', estado.toString());
    }

    if (idDistribuidor) {
      params.append(
        'idDistribuidor',
        idDistribuidor.toString()
      );
    }

    const queryString = params.toString();

    const url = queryString
      ? `${this.apiUrl}/inventario?${queryString}`
      : `${this.apiUrl}/inventario`;

    return this.http.get<Producto[]>(
      url,
      {
        withCredentials: true
      }
    );
  }

  reporteProductosMasVendidos(
    fechaDesde?: string,
    fechaHasta?: string,
    categoria?: string,
    tipoItem?: string
  ): Observable<ProductoMasVendido[]> {

    const params = new URLSearchParams();

    if (fechaDesde) {
      params.append('fechaDesde', fechaDesde);
    }

    if (fechaHasta) {
      params.append('fechaHasta', fechaHasta);
    }

    if (categoria) {
      params.append('categoria', categoria);
    }

    if (tipoItem) {
      params.append('tipoItem', tipoItem);
    }

    const queryString = params.toString();

    const url = queryString
      ? `${this.apiUrl}/productos-mas-vendidos?${queryString}`
      : `${this.apiUrl}/productos-mas-vendidos`;

    return this.http.get<ProductoMasVendido[]>(
      url,
      {
        withCredentials: true
      }
    );
  }

  reporteProductosMasUtilizados(
    fechaDesde?: string,
    fechaHasta?: string,
    tipoItem?: string
  ): Observable<ProductoMasUtilizado[]> {

    const params = new URLSearchParams();

    if (fechaDesde) {
      params.append('fechaDesde', fechaDesde);
    }

    if (fechaHasta) {
      params.append('fechaHasta', fechaHasta);
    }

    if (tipoItem) {
      params.append('tipoItem', tipoItem);
    }

    const queryString = params.toString();

    const url = queryString
      ? `${this.apiUrl}/productos-mas-utilizados?${queryString}`
      : `${this.apiUrl}/productos-mas-utilizados`;

    return this.http.get<ProductoMasUtilizado[]>(
      url,
      {
        withCredentials: true
      }
    );
  }
}
