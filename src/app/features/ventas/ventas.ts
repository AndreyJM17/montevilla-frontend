import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { environment } from '../../../environments/environment';

export interface VentaLineaIniciar {
  idProducto: number;

  nombreProducto?: string;

  categoria?: string;

  tipoItem: string;

  cantidad: number;

  precioUnitario: number;

  subtotal: number;
}

export interface VentaIniciar {
  idCita: number;

  idMascota: number;

  nombreMascota?: string;

  idCliente: number;

  nombreCliente?: string;

  idAtencion: number;

  lineas: VentaLineaIniciar[];
}

export interface DetalleVenta {
  idDetalleVenta: number;

  idProducto: number;

  nombreProducto?: string;

  tipoItem: string;

  cantidad: number;

  precioUnitario: number;

  subtotal: number;

  origen: string;
}

export interface VentaDetalle {
  idVenta: number;

  fechaVenta: string;

  subtotal: number;

  descuento: number;

  total: number;

  estado: string;

  metodoPago?: string;

  numeroComprobante?: string;

  idCita: number;

  nombreMascota?: string;

  nombreCliente?: string;

  nombreRecepcionista?: string;

  nombreAutorizaDescuento?: string;

  lineas: DetalleVenta[];
}

export interface Venta {
  idVenta: number;

  fechaVenta: string;

  subtotal: number;

  descuento: number;

  total: number;

  estado: string;

  metodoPago?: string;

  numeroComprobante?: string;

  idCita: number;

  idMascota: number;

  nombreMascota?: string;

  idCliente: number;

  nombreCliente?: string;

  idUsuarioRecepcionista: number;

  nombreRecepcionista?: string;
}

export interface LineaAdicional {
  idProducto: number;

  cantidad: number;
}

export interface VentaRegistrarRequest {
  idCita: number;

  idUsuarioRecepcionista: number;

  metodoPago: string;

  descuento: number;

  idUsuarioAutorizaDescuento?: number | null;

  lineasAdicionales: LineaAdicional[];
}

export interface AutorizarDescuentoResponse {
  idUsuario: number;

  nombreCompleto: string;
}

@Injectable({
  providedIn: 'root',
})
export class Ventas {

  private apiUrl = `${environment.apiUrl}/venta`;

  constructor(
    private http: HttpClient
  ) {}

  iniciar(
    idCita: number
  ): Observable<VentaIniciar> {

    return this.http.get<VentaIniciar>(
      `${this.apiUrl}/iniciar/${idCita}`,
      {
        withCredentials: true
      }
    );
  }

  listar(
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
      ? `${this.apiUrl}?${queryString}`
      : this.apiUrl;

    return this.http.get<Venta[]>(
      url,
      {
        withCredentials: true
      }
    );
  }

  obtenerDetalle(
    id: number
  ): Observable<VentaDetalle> {

    return this.http.get<VentaDetalle>(
      `${this.apiUrl}/${id}`,
      {
        withCredentials: true
      }
    );
  }

  registrar(
    datos: VentaRegistrarRequest
  ): Observable<{ mensaje: string }> {

    return this.http.post<{
      mensaje: string
    }>(
      this.apiUrl,
      datos,
      {
        withCredentials: true
      }
    );
  }

  autorizarDescuento(
    correo: string,
    contrasena: string
  ): Observable<AutorizarDescuentoResponse> {

    return this.http.post<AutorizarDescuentoResponse>(
      `${this.apiUrl}/autorizar-descuento`,
      {
        correo,
        contrasena
      },
      {
        withCredentials: true
      }
    );
  }
}
