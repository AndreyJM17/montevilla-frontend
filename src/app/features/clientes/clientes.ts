import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { environment } from '../../../environments/environment';

export interface Cliente {
  idCliente: number;

  nombre: string;

  apellido1: string;

  apellido2?: string;

  telefono?: string;

  correo?: string;

  direccion?: string;

  nombreCompleto: string;

  estado: boolean;
}

export interface CrearClienteRequest {
  nombre: string;
  apellido1: string;
  apellido2?: string;
  telefono?: string;
  correo?: string;
  direccion?: string;
}

export interface ActualizarClienteRequest {
  nombre: string;
  apellido1: string;
  apellido2?: string;
  telefono?: string;
  correo?: string;
  direccion?: string;
}

@Injectable({
  providedIn: 'root',
})
export class Clientes {

  private apiUrl = `${environment.apiUrl}/cliente`;

  constructor(
    private http: HttpClient
  ) {}

  listar(
    busqueda?: string,
    estado?: string
  ): Observable<Cliente[]> {

    const params = new URLSearchParams();

    if (busqueda) {
      params.append('busqueda', busqueda);
    }

    if (estado) {
      params.append('estado', estado);
    }

    const queryString = params.toString();

    const url = queryString
      ? `${this.apiUrl}?${queryString}`
      : this.apiUrl;

    return this.http.get<Cliente[]>(
      url,
      {
        withCredentials: true
      }
    );
  }

  crear(
    datos: CrearClienteRequest
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

  actualizar(
    id: number,
    datos: ActualizarClienteRequest
  ): Observable<{ mensaje: string }> {

    return this.http.put<{
      mensaje: string
    }>(
      `${this.apiUrl}/${id}`,
      datos,
      {
        withCredentials: true
      }
    );
  }

  cambiarEstado(
    id: number,
    estado: boolean
  ): Observable<{ mensaje: string }> {

    return this.http.patch<{
      mensaje: string
    }>(
      `${this.apiUrl}/${id}/estado`,
      {
        estado
      },
      {
        withCredentials: true
      }
    );
  }
}