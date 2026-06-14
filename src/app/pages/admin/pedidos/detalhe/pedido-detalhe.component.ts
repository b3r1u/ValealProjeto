import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { forkJoin } from 'rxjs';
import { MessageService } from 'primeng/api';
import { PedidosService } from '../../../../services/pedidos.service';
import { MateriaisService } from '../../../../services/materiais.service';
import { Pedido, StatusPedido } from '../../../../models/pedido.model';

type TagSeverity = 'success' | 'secondary' | 'info' | 'warn' | 'danger' | 'contrast';

@Component({
  selector: 'app-pedido-detalhe',
  templateUrl: './pedido-detalhe.component.html',
  styleUrls: ['./pedido-detalhe.component.scss']
})
export class PedidoDetalheComponent implements OnInit {
  pedido: Pedido | null = null;
  materiaisMap: Record<number, string> = {};
  carregando = true;
  salvando = false;
  statusSelecionado: StatusPedido | null = null;

  readonly opcoesStatus = [
    { label: 'Aguardando Arte', value: 'aguardando_arte' },
    { label: 'Em Produção',     value: 'em_producao'     },
    { label: 'Enviado',         value: 'enviado'         },
    { label: 'Entregue',        value: 'entregue'        },
    { label: 'Cancelado',       value: 'cancelado'       },
  ];

  private readonly clienteNomes: Record<number, string> = {
    1: 'Ana Oliveira',
    2: 'Bruno Santos',
    3: 'Carla Mendes',
    4: 'Diego Ferreira',
    5: 'Elaine Costa',
  };

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private pedidosService: PedidosService,
    private materiaisService: MateriaisService,
    private messageService: MessageService
  ) {}

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));

    forkJoin({
      pedido:    this.pedidosService.buscarPorId(id),
      materiais: this.materiaisService.listar()
    }).subscribe({
      next: ({ pedido, materiais }) => {
        this.pedido = pedido;
        this.statusSelecionado = pedido.status;
        this.materiaisMap = materiais.reduce(
          (acc, m) => ({ ...acc, [m.id]: m.nome }), {} as Record<number, string>
        );
        this.carregando = false;
      }
    });
  }

  nomeMaterial(materialId: number): string {
    return this.materiaisMap[materialId] ?? `Material #${materialId}`;
  }

  nomeCliente(clienteId: number): string {
    return this.clienteNomes[clienteId] ?? `Cliente #${clienteId}`;
  }

  statusLabel(status: StatusPedido): string {
    const map: Record<StatusPedido, string> = {
      aguardando_arte: 'Aguardando Arte',
      em_producao:     'Em Produção',
      enviado:         'Enviado',
      entregue:        'Entregue',
      cancelado:       'Cancelado',
    };
    return map[status];
  }

  statusSeverity(status: StatusPedido): TagSeverity {
    const map: Record<StatusPedido, TagSeverity> = {
      aguardando_arte: 'warn',
      em_producao:     'info',
      enviado:         'info',
      entregue:        'success',
      cancelado:       'danger',
    };
    return map[status];
  }

  formatarValor(valor: number): string {
    return valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  }

  formatarData(data: Date): string {
    return new Date(data).toLocaleDateString('pt-BR');
  }

  statusAlterado(): boolean {
    return this.statusSelecionado !== this.pedido?.status;
  }

  atualizarStatus(): void {
    if (!this.pedido || !this.statusSelecionado || !this.statusAlterado()) return;

    this.salvando = true;
    this.pedidosService.atualizarStatus(this.pedido.id, this.statusSelecionado).subscribe({
      next: (atualizado) => {
        this.pedido = { ...this.pedido!, status: atualizado.status };
        this.salvando = false;
        this.messageService.add({
          severity: 'success',
          summary: 'Status atualizado',
          detail: `Pedido #${this.pedido.id} → ${this.statusLabel(atualizado.status)}`
        });
      },
      error: () => {
        this.salvando = false;
        this.messageService.add({
          severity: 'error', summary: 'Erro',
          detail: 'Não foi possível atualizar o status.'
        });
      }
    });
  }

  voltar(): void {
    this.router.navigate(['/admin/pedidos']);
  }
}
