import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { Usuario } from '../models/usuario.model';
import { USUARIOS_MOCK } from 'src/assets/mocks/usuarios.mock';

const USE_MOCK = environment.useMock;

@Injectable({ providedIn: 'root' })
export class FuncionariosService {
  private mockData: Usuario[] = USUARIOS_MOCK
    .filter(u => u.perfil === 'funcionario')
    .map(u => ({ ...u }));

  constructor(private http: HttpClient) {}

  listar(): Observable<Usuario[]> {
    if (USE_MOCK) return of([...this.mockData]).pipe(delay(300));
    return this.http.get<Usuario[]>(`${environment.apiUrl}/usuarios?perfil=funcionario`);
  }

  criar(dados: { nome: string; email: string; senha: string }): Observable<Usuario> {
    if (USE_MOCK) {
      const novo: Usuario = {
        id: Date.now(),
        nome: dados.nome,
        email: dados.email,
        perfil: 'funcionario',
        ativo: true,
        criado_em: new Date(),
      };
      this.mockData.push(novo);
      return of({ ...novo }).pipe(delay(300));
    }
    return this.http.post<Usuario>(
      `${environment.apiUrl}/usuarios`,
      { ...dados, perfil: 'funcionario' }
    );
  }

  editar(id: number, dados: { nome: string; email: string }): Observable<Usuario> {
    if (USE_MOCK) {
      const idx = this.mockData.findIndex(u => u.id === id);
      if (idx >= 0) {
        this.mockData[idx] = { ...this.mockData[idx], ...dados };
        return of({ ...this.mockData[idx] }).pipe(delay(300));
      }
      return of({} as Usuario).pipe(delay(300));
    }
    return this.http.put<Usuario>(`${environment.apiUrl}/usuarios/${id}`, dados);
  }

  toggleAtivo(id: number): Observable<Usuario> {
    if (USE_MOCK) {
      const idx = this.mockData.findIndex(u => u.id === id);
      if (idx >= 0) {
        this.mockData[idx] = { ...this.mockData[idx], ativo: !this.mockData[idx].ativo };
        return of({ ...this.mockData[idx] }).pipe(delay(300));
      }
      return of({} as Usuario).pipe(delay(300));
    }
    return this.http.patch<Usuario>(`${environment.apiUrl}/usuarios/${id}/toggle`, {});
  }

  remover(id: number): Observable<void> {
    if (USE_MOCK) {
      this.mockData = this.mockData.filter(u => u.id !== id);
      return of(undefined).pipe(delay(300));
    }
    return this.http.delete<void>(`${environment.apiUrl}/usuarios/${id}`);
  }
}
