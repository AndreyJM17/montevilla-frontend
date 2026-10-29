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

// Pantalla de aterrizaje por rol: cada uno entra a lo que más usa.
// Se usa tanto al hacer login como cuando un guard bloquea una ruta,
// para no rebotar nunca hacia una página que ese rol tampoco puede ver.
const DESTINO_POR_ROL: Record<string, string> = {
  Administrador: '/dashboard',
  Recepcionista: '/clientes',
  Veterinario: '/mascotas',
  Inventario: '/inventario',
  Cliente: '/mis-citas'
};

@Injectable({
  providedIn: 'root',
})
export class Auth {
  private apiUrl = `${environment.apiUrl}/auth`;

  usuarioActual = signal<LoginResponse['usuario'] | null>(null);

  rutaPorRol(nombreRol: string | undefined): string {
    return (nombreRol && DESTINO_POR_ROL[nombreRol]) ?? '/login';
  }

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