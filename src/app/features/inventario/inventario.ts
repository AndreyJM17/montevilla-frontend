import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { environment } from '../../../environments/environment';

export interface Distribuidor {
  idDistribuidor: number;

  nombreEmpresa: string;

  contacto?: string;

  telefono?: string;

  correo?: string;

  direccion?: string;

  estado: boolean;
}

export interface CrearDistribuidorRequest {
  nombreEmpresa: string;

  contacto?: string;

  telefono?: string;

  correo?: string;

  direccion?: string;
}

export interface ActualizarDistribuidorRequest {
  nombreEmpresa: string;

  contacto?: string;

  telefono?: string;

  correo?: string;

  direccion?: string;
}

export interface Producto {
  idProducto: number;

  codigo: string;

  nombre: string;

  categoria?: string;

  descripcion?: string;

  precio: number;

  stockActual: number;

  stockMinimo: number;

  fechaVencimiento?: string;

  tipoItem: string;

  estado: boolean;

  idDistribuidor?: number | null;

  nombreDistribuidor?: string;

  alertaSinStock: boolean;

  alertaStockBajo: boolean;

  alertaVencido: boolean;

  alertaPorVencer: boolean;
}

export interface CrearProductoRequest {
  codigo: string;

  nombre: string;

  categoria?: string;

  descripcion?: string;

  precio: number;

  stockMinimo: number;

  fechaVencimiento?: string;

  tipoItem?: string;

  idDistribuidor?: number | null;
}

export interface ActualizarProductoRequest {
  codigo: string;

  nombre: string;

  categoria?: string;

  descripcion?: string;

  precio: number;

  stockMinimo: number;

  fechaVencimiento?: string;

  idDistribuidor?: number | null;
}

export interface Movimiento {
  idMovimiento: number;

  tipoMovimiento: string;

  cantidad: number;

  motivo?: string;

  fechaMovimiento: string;

  idProducto: number;

  nombreProducto?: string;

  codigoProducto?: string;
}

export interface CrearMovimientoRequest {
  tipoMovimiento: string;

  cantidad: number;

  motivo?: string;

  idProducto: number;
}

@Injectable({
  providedIn: 'root',
})
export class Inventario {

  private distribuidorUrl = `${environment.apiUrl}/distribuidor`;

  private productoUrl = `${environment.apiUrl}/producto`;

  private movimientoUrl = `${environment.apiUrl}/movimiento`;

  constructor(
    private http: HttpClient
  ) {}

  // ---------- Distribuidores ----------

  listarDistribuidores(
    busqueda?: string,
    estado?: boolean | null
  ): Observable<Distribuidor[]> {

    const params = new URLSearchParams();

    if (busqueda) {
      params.append('busqueda', busqueda);
    }

    if (estado !== undefined && estado !== null) {
      params.append('estado', estado.toString());
    }

    const queryString = params.toString();

    const url = queryString
      ? `${this.distribuidorUrl}?${queryString}`
      : this.distribuidorUrl;

    return this.http.get<Distribuidor[]>(
      url,
      {
        withCredentials: true
      }
    );
  }

  crearDistribuidor(
    datos: CrearDistribuidorRequest
  ): Observable<{ mensaje: string }> {

    return this.http.post<{
      mensaje: string
    }>(
      this.distribuidorUrl,
      datos,
      {
        withCredentials: true
      }
    );
  }

  actualizarDistribuidor(
    id: number,
    datos: ActualizarDistribuidorRequest
  ): Observable<{ mensaje: string }> {

    return this.http.put<{
      mensaje: string
    }>(
      `${this.distribuidorUrl}/${id}`,
      datos,
      {
        withCredentials: true
      }
    );
  }

  cambiarEstadoDistribuidor(
    id: number,
    estado: boolean
  ): Observable<{ mensaje: string }> {

    return this.http.patch<{
      mensaje: string
    }>(
      `${this.distribuidorUrl}/${id}/estado`,
      {
        estado
      },
      {
        withCredentials: true
      }
    );
  }

  // ---------- Productos ----------

  listarProductos(
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
      ? `${this.productoUrl}?${queryString}`
      : this.productoUrl;

    return this.http.get<Producto[]>(
      url,
      {
        withCredentials: true
      }
    );
  }

  crearProducto(
    datos: CrearProductoRequest
  ): Observable<{ mensaje: string }> {

    return this.http.post<{
      mensaje: string
    }>(
      this.productoUrl,
      datos,
      {
        withCredentials: true
      }
    );
  }

  actualizarProducto(
    id: number,
    datos: ActualizarProductoRequest
  ): Observable<{ mensaje: string }> {

    return this.http.put<{
      mensaje: string
    }>(
      `${this.productoUrl}/${id}`,
      datos,
      {
        withCredentials: true
      }
    );
  }

  cambiarEstadoProducto(
    id: number,
    estado: boolean
  ): Observable<{ mensaje: string }> {

    return this.http.patch<{
      mensaje: string
    }>(
      `${this.productoUrl}/${id}/estado`,
      {
        estado
      },
      {
        withCredentials: true
      }
    );
  }

  // ---------- Movimientos ----------

  listarMovimientos(
    idProducto?: number | null,
    tipoMovimiento?: string
  ): Observable<Movimiento[]> {

    const params = new URLSearchParams();

    if (idProducto) {
      params.append(
        'idProducto',
        idProducto.toString()
      );
    }

    if (tipoMovimiento) {
      params.append('tipoMovimiento', tipoMovimiento);
    }

    const queryString = params.toString();

    const url = queryString
      ? `${this.movimientoUrl}?${queryString}`
      : this.movimientoUrl;

    return this.http.get<Movimiento[]>(
      url,
      {
        withCredentials: true
      }
    );
  }

  registrar(
    datos: CrearMovimientoRequest
  ): Observable<{ mensaje: string }> {

    return this.http.post<{
      mensaje: string
    }>(
      this.movimientoUrl,
      datos,
      {
        withCredentials: true
      }
    );
  }
}
