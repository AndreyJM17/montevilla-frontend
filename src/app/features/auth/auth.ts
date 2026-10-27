import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

interface LoginRequest {
  correo: string;
  contrasena: string;
}

interface LoginResponse {
  usuario: {
    idUsuario: number;
    nombreCompleto: string;
    correo: string;
    nombreRol: string;
    idCliente?: number | null;
  };
}

@Injectable({
  providedIn: 'root',
})
export class Auth {
  private apiUrl = `${environment.apiUrl}/auth`;

  usuarioActual = signal<LoginResponse['usuario'] | null>(null);

  constructor(private http: HttpClient) {}

  login(credenciales: LoginRequest): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(
      `${this.apiUrl}/login`,
      credenciales,
      { withCredentials: true }
    );
  }

  me(): Observable<LoginResponse['usuario']> {
    return this.http.get<LoginResponse['usuario']>(`${this.apiUrl}/me`, {
    withCredentials: true
  });
  }
  
  logout(): Observable<{ mensaje: string }> {
    return this.http.post<{ mensaje: string }>(
    `${this.apiUrl}/logout`,
    {},
    { withCredentials: true }
    );
  }

  guardarUsuario(usuario: LoginResponse['usuario']) {
    this.usuarioActual.set(usuario);
  }
}