import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { Material } from '../models/material.model';
import { MATERIAIS_MOCK } from 'src/assets/mocks/materiais.mock';

const USE_MOCK = environment.useMock;

@Injectable({ providedIn: 'root' })
export class MateriaisService {
  constructor(private http: HttpClient) {}

  listar(): Observable<Material[]> {
    if (USE_MOCK) return of(MATERIAIS_MOCK).pipe(delay(300));
    return this.http.get<Material[]>(`${environment.apiUrl}/materiais`);
  }

  buscarPorId(id: number): Observable<Material> {
    if (USE_MOCK) return of(MATERIAIS_MOCK.find(m => m.id === id)!).pipe(delay(300));
    return this.http.get<Material>(`${environment.apiUrl}/materiais/${id}`);
  }

  criar(material: Partial<Material>): Observable<Material> {
    if (USE_MOCK) return of({ ...material, id: Date.now() } as Material).pipe(delay(300));
    return this.http.post<Material>(`${environment.apiUrl}/materiais`, material);
  }

  editar(id: number, material: Partial<Material>): Observable<Material> {
    if (USE_MOCK) return of({ ...material, id } as Material).pipe(delay(300));
    return this.http.put<Material>(`${environment.apiUrl}/materiais/${id}`, material);
  }

  toggleAtivo(id: number): Observable<Material> {
    if (USE_MOCK) {
      const m = MATERIAIS_MOCK.find(x => x.id === id)!;
      return of({ ...m, ativo: !m.ativo }).pipe(delay(300));
    }
    return this.http.patch<Material>(`${environment.apiUrl}/materiais/${id}/toggle`, {});
  }

  remover(id: number): Observable<void> {
    if (USE_MOCK) return of(undefined).pipe(delay(300));
    return this.http.delete<void>(`${environment.apiUrl}/materiais/${id}`);
  }
}
