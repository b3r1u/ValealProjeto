import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { Pedido, StatusPedido } from '../models/pedido.model';
import { PEDIDOS_MOCK } from 'src/assets/mocks/pedidos.mock';

const USE_MOCK = environment.useMock;

@Injectable({ providedIn: 'root' })
export class PedidosService {
  constructor(private http: HttpClient) {}

  listarTodos(): Observable<Pedido[]> {
    if (USE_MOCK) return of(PEDIDOS_MOCK).pipe(delay(300));
    return this.http.get<Pedido[]>(`${environment.apiUrl}/pedidos`);
  }

  listarMeus(): Observable<Pedido[]> {
    if (USE_MOCK) return of(PEDIDOS_MOCK.filter(p => p.cliente_id === 1)).pipe(delay(300));
    return this.http.get<Pedido[]>(`${environment.apiUrl}/pedidos/meus`);
  }

  buscarPorId(id: number): Observable<Pedido> {
    if (USE_MOCK) return of(PEDIDOS_MOCK.find(p => p.id === id)!).pipe(delay(300));
    return this.http.get<Pedido>(`${environment.apiUrl}/pedidos/${id}`);
  }

  criar(formData: FormData): Observable<Pedido> {
    if (USE_MOCK) return of(PEDIDOS_MOCK[0]).pipe(delay(300));
    return this.http.post<Pedido>(`${environment.apiUrl}/pedidos`, formData);
  }

  atualizarStatus(id: number, status: StatusPedido): Observable<Pedido> {
    if (USE_MOCK) return of({ ...PEDIDOS_MOCK.find(p => p.id === id)!, status }).pipe(delay(300));
    return this.http.patch<Pedido>(`${environment.apiUrl}/pedidos/${id}/status`, { status });
  }
}
