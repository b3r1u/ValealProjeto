import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { delay, tap } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { Usuario, PerfilUsuario } from '../models/usuario.model';

const USE_MOCK = environment.useMock;

export interface LoginResponse {
  token: string;
  usuario: Usuario;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly TOKEN_KEY = 'token';
  private readonly USUARIO_KEY = 'usuario';

  constructor(private http: HttpClient) {}

  login(email: string, senha: string): Observable<LoginResponse> {
    if (USE_MOCK) {
      const perfil: PerfilUsuario = email.includes('admin')
        ? 'admin'
        : email.includes('func')
        ? 'funcionario'
        : 'cliente';

      const mockResponse: LoginResponse = {
        token: 'mock-jwt-token',
        usuario: { id: 1, nome: 'Usuário Mock', email, perfil, ativo: true, criado_em: new Date() }
      };
      return of(mockResponse).pipe(delay(300), tap(res => this.salvarSessao(res)));
    }
    return this.http
      .post<LoginResponse>(`${environment.apiUrl}/auth/login`, { email, senha })
      .pipe(tap(res => this.salvarSessao(res)));
  }

  logout(): void {
    localStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem(this.USUARIO_KEY);
  }

  isAuthenticated(): boolean {
    return !!localStorage.getItem(this.TOKEN_KEY);
  }

  getUsuario(): Usuario | null {
    const raw = localStorage.getItem(this.USUARIO_KEY);
    return raw ? JSON.parse(raw) : null;
  }

  getPerfil(): PerfilUsuario | null {
    return this.getUsuario()?.perfil ?? null;
  }

  private salvarSessao(res: LoginResponse): void {
    localStorage.setItem(this.TOKEN_KEY, res.token);
    localStorage.setItem(this.USUARIO_KEY, JSON.stringify(res.usuario));
  }
}
