import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { environment } from '../../../environments/environment';

interface SolicitarRecuperacionRequest {
  correo: string;
}

interface SolicitarRecuperacionResponse {
  mensaje: string;
  token?: string;
}

interface ValidarTokenRequest {
  token: string;
}

interface ActualizarContrasenaRequest {
  token: string;
  nuevaContrasena: string;
}

@Injectable({
  providedIn: 'root',
})
export class Recuperacion {

  private apiUrl = `${environment.apiUrl}/recuperacion`;

  constructor(private http: HttpClient) {}

  solicitar(
    datos: SolicitarRecuperacionRequest
  ): Observable<SolicitarRecuperacionResponse> {

    return this.http.post<SolicitarRecuperacionResponse>(
      `${this.apiUrl}/solicitar`,
      datos
    );
  }
  validar(
    token: string
    ): Observable<{ mensaje: string }> {
    
    return this.http.post<{ mensaje: string }>(
      `${this.apiUrl}/validar`,
       { token }
    );
  }
  actualizarContrasena(
    token: string,
    nuevaContrasena: string
    ): Observable<{ mensaje: string }> {

    return this.http.post<{ mensaje: string }>(
      `${this.apiUrl}/actualizar-contrasena`,
        {
          token,
          nuevaContrasena
        }
    );
  }
  
}