import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { environment } from '../../../environments/environment';

export interface Rol {
  idRol: number;
  nombre: string;
  descripcion?: string;
  estado: boolean;
}

export interface CrearRolRequest {
nombre: string;
descripcion?: string;
}


export interface ActualizarRolRequest {
  nombre: string;
  descripcion?: string;
}

@Injectable({
  providedIn: 'root',
})
export class Roles {

  private apiUrl = `${environment.apiUrl}/rol`;

  constructor(private http: HttpClient) {}

  listar(
    busqueda?: string,
    estado?: string
    ): Observable<Rol[]> {
    
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
    
    return this.http.get<Rol[]>(
    url,
    {
    withCredentials: true
    }
    );
  
  }
  

  crear(
    datos: CrearRolRequest
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
    datos: ActualizarRolRequest
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