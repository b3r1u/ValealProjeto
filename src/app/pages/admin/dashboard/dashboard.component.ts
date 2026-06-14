import { Component, OnInit } from '@angular/core';
import { forkJoin } from 'rxjs';
import { PedidosService } from '../../../services/pedidos.service';
import { MateriaisService } from '../../../services/materiais.service';
import { Pedido, StatusPedido } from '../../../models/pedido.model';

interface KpiCard {
  label: string;
  valor: string;
  icone: string;
  cor: 'primary' | 'success' | 'warning' | 'info';
}

const STATUS_LABEL: Record<StatusPedido, string> = {
  aguardando_arte: 'Aguardando Arte',
  em_producao:     'Em Produção',
  enviado:         'Enviado',
  entregue:        'Entregue',
  cancelado:       'Cancelado',
};

type TagSeverity = 'success' | 'info' | 'secondary' | 'warn' | 'danger' | 'contrast';

const STATUS_SEVERITY: Record<StatusPedido, TagSeverity> = {
  aguardando_arte: 'warn',
  em_producao:     'info',
  enviado:         'info',
  entregue:        'success',
  cancelado:       'danger',
};

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  carregando = true;
  kpis: KpiCard[] = [];
  ultimosPedidos: Pedido[] = [];
  readonly placeholders = Array(4).fill(0);

  constructor(
    private pedidosService: PedidosService,
    private materiaisService: MateriaisService
  ) {}

  ngOnInit(): void {
    forkJoin({
      pedidos:   this.pedidosService.listarTodos(),
      materiais: this.materiaisService.listar()
    }).subscribe({
      next: ({ pedidos, materiais }) => {
        const receita = pedidos.reduce((s, p) => s + p.total, 0);
        const ativos  = materiais.filter(m => m.ativo).length;

        this.kpis = [
          { label: 'Total de Pedidos',  valor: String(pedidos.length),          icone: 'pi-shopping-cart', cor: 'info'    },
          { label: 'Receita do Mês',    valor: this.moeda(receita),             icone: 'pi-dollar',        cor: 'success' },
          { label: 'Materiais Ativos',  valor: String(ativos),                  icone: 'pi-box',           cor: 'warning' },
          { label: 'Funcionários',      valor: '1',                             icone: 'pi-users',         cor: 'primary' },
        ];

        this.ultimosPedidos = [...pedidos].reverse().slice(0, 5);
        this.carregando = false;
      }
    });
  }

  statusLabel(status: StatusPedido): string        { return STATUS_LABEL[status]; }
  statusSeverity(status: StatusPedido): TagSeverity { return STATUS_SEVERITY[status]; }

  private moeda(valor: number): string {
    return valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  }
}
