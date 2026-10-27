import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { environment } from '../../../environments/environment';

export interface Cita {
  idCita: number;

  fechaCita: string;

  horaCita: string;

  motivoConsulta?: string;

  estado: string;

  idMascota: number;

  nombreMascota?: string;

  idCliente: number;

  nombreCliente?: string;

  idUsuarioVeterinario: number;

  nombreVeterinario?: string;
}

export interface CrearCitaRequest {
  fechaCita: string;

  horaCita: string;

  motivoConsulta?: string;

  idMascota: number;

  idUsuarioVeterinario: number;
}

export interface ActualizarCitaRequest {
  fechaCita: string;

  horaCita: string;

  motivoConsulta?: string;

  idUsuarioVeterinario: number;
}

@Injectable({
  providedIn: 'root'
})
export class Citas {

  private apiUrl = `${environment.apiUrl}/cita`;

  constructor(
    private http: HttpClient
  ) {}

  listar(
    fechaCita?: string,
    estado?: string,
    idVeterinario?: number | null,
    idMascota?: number | null
  ): Observable<Cita[]> {

    const params = new URLSearchParams();

    if (fechaCita) {
      params.append('fechaCita', fechaCita);
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

    if (idMascota) {
      params.append(
        'idMascota',
        idMascota.toString()
      );
    }

    const queryString = params.toString();

    const url = queryString
      ? `${this.apiUrl}?${queryString}`
      : this.apiUrl;

    return this.http.get<Cita[]>(
      url,
      {
        withCredentials: true
      }
    );
  }

  obtenerPorId(
    id: number
  ): Observable<Cita> {

    return this.http.get<Cita>(
      `${this.apiUrl}/${id}`,
      {
        withCredentials: true
      }
    );
  }

  crear(
    datos: CrearCitaRequest
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
    datos: ActualizarCitaRequest
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
    nuevoEstado: string
  ): Observable<{ mensaje: string }> {

    return this.http.patch<{
      mensaje: string
    }>(
      `${this.apiUrl}/${id}/estado`,
      {
        nuevoEstado
      },
      {
        withCredentials: true
      }
    );
  }

  // ----------------------------------------------------------------
  // Portal de autogestión del Cliente
  // ----------------------------------------------------------------

  misCitas(): Observable<Cita[]> {

    return this.http.get<Cita[]>(
      `${this.apiUrl}/mis-citas`,
      {
        withCredentials: true
      }
    );
  }

  agendarMiCita(
    datos: CrearCitaRequest
  ): Observable<{ mensaje: string }> {

    return this.http.post<{
      mensaje: string
    }>(
      `${this.apiUrl}/mis-citas`,
      datos,
      {
        withCredentials: true
      }
    );
  }

  cancelarMiCita(
    id: number
  ): Observable<{ mensaje: string }> {

    return this.http.put<{
      mensaje: string
    }>(
      `${this.apiUrl}/mis-citas/${id}/cancelar`,
      {},
      {
        withCredentials: true
      }
    );
  }

  // ----------------------------------------------------------------
  // Emergencia con reprogramación en cascada
  // ----------------------------------------------------------------

  declararEmergencia(
    id: number,
    minutosRetraso: number
  ): Observable<{ mensaje: string; citasAfectadas: Cita[] }> {

    return this.http.post<{
      mensaje: string;
      citasAfectadas: Cita[];
    }>(
      `${this.apiUrl}/${id}/declarar-emergencia`,
      { minutosRetraso },
      {
        withCredentials: true
      }
    );
  }
}