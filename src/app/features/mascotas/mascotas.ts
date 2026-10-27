import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { environment } from '../../../environments/environment';

export interface Mascota {
  idMascota: number;

  nombre: string;

  especie: string;

  raza?: string;

  sexo?: string;

  fechaNacimiento?: string;

  observaciones?: string;

  idCliente: number;

  nombreCliente: string;

  estado: boolean;
}

export interface CrearMascotaRequest {
  nombre: string;

  especie: string;

  raza?: string;

  sexo?: string;

  fechaNacimiento?: string;

  observaciones?: string;

  idCliente: number;
}

export interface ActualizarMascotaRequest {
  nombre: string;

  especie: string;

  raza?: string;

  sexo?: string;

  fechaNacimiento?: string;

  observaciones?: string;

  idCliente: number;
}

@Injectable({
  providedIn: 'root',
})
export class Mascotas {

  private apiUrl = `${environment.apiUrl}/mascota`;

  constructor(
    private http: HttpClient
  ) {}

  listar(
    busqueda?: string,
    idCliente?: number | null,
    estado?: string
  ): Observable<Mascota[]> {

    const params = new URLSearchParams();

    if (busqueda) {
      params.append('busqueda', busqueda);
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

    return this.http.get<Mascota[]>(
      url,
      {
        withCredentials: true
      }
    );
  }

  crear(
    datos: CrearMascotaRequest
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
    datos: ActualizarMascotaRequest
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