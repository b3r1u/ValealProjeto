import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, Subject } from 'rxjs';
import { delay } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { SessaoChat, MensagemChat } from '../models/usuario.model';
import { SESSOES_CHAT_MOCK } from 'src/assets/mocks/usuarios.mock';

const USE_MOCK = environment.useMock;

@Injectable({ providedIn: 'root' })
export class ChatService {
  private mensagemRecebida$ = new Subject<MensagemChat>();

  constructor(private http: HttpClient) {}

  criarSessao(): Observable<SessaoChat> {
    if (USE_MOCK) {
      const mock: SessaoChat = {
        id: Date.now(),
        cliente_id: 1,
        funcionario_id: null,
        status: 'aguardando',
        criado_em: new Date(),
        mensagens: []
      };
      return of(mock).pipe(delay(300));
    }
    return this.http.post<SessaoChat>(`${environment.apiUrl}/chat/sessoes`, {});
  }

  listarSessoes(): Observable<SessaoChat[]> {
    if (USE_MOCK) return of(SESSOES_CHAT_MOCK).pipe(delay(300));
    return this.http.get<SessaoChat[]>(`${environment.apiUrl}/chat/sessoes`);
  }

  onMensagemRecebida(): Observable<MensagemChat> {
    return this.mensagemRecebida$.asObservable();
  }

  // In Phase 3 replace with socket.emit('nova_mensagem', ...)
  emitirMensagem(sessaoId: number, texto: string): void {
    if (USE_MOCK) {
      setTimeout(() => {
        this.mensagemRecebida$.next({
          id: Date.now(),
          sessao_id: sessaoId,
          autor_id: 2,
          texto: 'Resposta automática do designer (mock)',
          criado_em: new Date()
        });
      }, 1000);
    }
  }
}
