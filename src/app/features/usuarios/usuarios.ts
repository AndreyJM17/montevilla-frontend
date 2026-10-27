import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { environment } from '../../../environments/environment';

export interface Usuario {
  idUsuario: number;
  nombreCompleto: string;
  correo: string;
  nombreRol: string;
  estado: boolean;
}

export interface CrearUsuarioRequest {
  nombre: string;
  apellido1: string;
  apellido2?: string;
  correo: string;
  contrasena: string;
  idRol: number;
  idCliente?: number | null;
}

export interface ActualizarUsuarioRequest {
  nombre: string;
  apellido1: string;
  apellido2?: string;
  correo: string;
  idRol: number;
}

@Injectable({
  providedIn: 'root',
})
export class Usuarios {

  private apiUrl = `${environment.apiUrl}/usuario`;

  constructor(private http: HttpClient) {}

  listar(
    busqueda?: string,
    idRol?: string,
    estado?: string
  ): Observable<Usuario[]> {

    const params = new URLSearchParams();

    if (busqueda) {
      params.append('busqueda', busqueda);
    }

    if (idRol) {
      params.append('idRol', idRol);
    }

    if (estado) {
      params.append('estado', estado);
    }

    const queryString = params.toString();

    const url = queryString
      ? `${this.apiUrl}?${queryString}`
      : this.apiUrl;

    return this.http.get<Usuario[]>(
      url,
      {
        withCredentials: true
      }
    );

  }

  crear(
    datos: CrearUsuarioRequest
  ): Observable<{ mensaje: string }> {

    return this.http.post<{ mensaje: string }>(
      this.apiUrl,
      datos,
      {
        withCredentials: true
      }
    );

  }

  actualizar(
    id: number,
    datos: ActualizarUsuarioRequest
  ): Observable<{ mensaje: string }> {

    return this.http.put<{ mensaje: string }>(
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
    return this.http.patch<{ mensaje: string }>(
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