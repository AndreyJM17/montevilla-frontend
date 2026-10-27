import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { environment } from '../../../environments/environment';

export interface Atencion {
  idAtencion: number;
  fechaAtencion: string;
  pesoActual?: number;
  sintomas?: string;
  diagnostico?: string;
  tratamiento?: string;
  observaciones?: string;
  idCita: number;
  idExpediente: number;
  idUsuarioVeterinario: number;
  nombreVeterinario?: string;
  motivoConsulta?: string;
  idMascota: number;
  nombreMascota?: string;
  nombreCliente?: string;
}

export interface AtencionProducto {
  idAtencionProducto: number;
  idAtencion: number;
  idProducto: number;
  nombreProducto?: string;
  categoria?: string;
  tipoItem: string;
  cantidadUtilizada: number;
  precioUnitario: number;
  subtotal: number;
}

export interface ExpedienteRow {
  idExpediente: number;
  fechaApertura: string;
  alergias?: string;
  antecedentesMedicos?: string;
  estadoExpediente: boolean;
  idMascota: number;
  nombreMascota?: string;
  especie?: string;
  raza?: string;
  nombreCliente?: string;
  // Campos de atención — null si no hay atenciones aún
  idAtencion?: number;
  fechaAtencion?: string;
  pesoActual?: number;
  sintomas?: string;
  diagnostico?: string;
  tratamiento?: string;
  observacionesAtencion?: string;
  motivoConsulta?: string;
  nombreVeterinario?: string;
}
export interface CrearAtencionRequest {
  pesoActual?: number;
  sintomas?: string;
  diagnostico?: string;
  tratamiento?: string;
  observaciones?: string;
  idCita: number;
  idUsuarioVeterinario: number;
}

export interface ProductoAtencionItem {
  idProducto: number;
  cantidad: number;
}

@Injectable({
  providedIn: 'root'
})
export class Atenciones {

  private apiUrl = `${environment.apiUrl}/atencion`;

  constructor(private http: HttpClient) {}

  listar(
    idExpediente?: number | null,
    idVeterinario?: number | null,
    idMascota?: number | null
  ): Observable<Atencion[]> {

    const params = new URLSearchParams();

    if (idExpediente) {
      params.append('idExpediente', idExpediente.toString());
    }

    if (idVeterinario) {
      params.append('idVeterinario', idVeterinario.toString());
    }

    if (idMascota) {
      params.append('idMascota', idMascota.toString());
    }

    const queryString = params.toString();
    const url = queryString
      ? `${this.apiUrl}?${queryString}`
      : this.apiUrl;

    return this.http.get<Atencion[]>(url, { withCredentials: true });
  }

  obtenerPorId(id: number): Observable<Atencion> {
    return this.http.get<Atencion>(
      `${this.apiUrl}/${id}`,
      { withCredentials: true }
    );
  }

  obtenerExpediente(idMascota: number): Observable<ExpedienteRow[]> {
    return this.http.get<ExpedienteRow[]>(
      `${this.apiUrl}/expediente/${idMascota}`,
      { withCredentials: true }
    );
  }

  crear(datos: CrearAtencionRequest): Observable<{ mensaje: string }> {
    return this.http.post<{ mensaje: string }>(
      this.apiUrl,
      datos,
      { withCredentials: true }
    );
  }

  registrarProductos(
    idAtencion: number,
    productos: ProductoAtencionItem[]
  ): Observable<{ mensaje: string }> {
    return this.http.post<{ mensaje: string }>(
      `${this.apiUrl}/${idAtencion}/productos`,
      { productos },
      { withCredentials: true }
    );
  }

  listarProductos(idAtencion: number): Observable<AtencionProducto[]> {
    return this.http.get<AtencionProducto[]>(
      `${this.apiUrl}/${idAtencion}/productos`,
      { withCredentials: true }
    );
  }
}