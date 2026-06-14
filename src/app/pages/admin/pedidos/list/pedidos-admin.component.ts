import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { PedidosService } from '../../../../services/pedidos.service';
import { Pedido, StatusPedido } from '../../../../models/pedido.model';

@Component({
  selector: 'app-pedidos-admin',
  templateUrl: './pedidos-admin.component.html',
  styleUrls: ['./pedidos-admin.component.scss']
})
export class PedidosAdminComponent implements OnInit {
  pedidos: Pedido[] = [];
  pedidosFiltrados: Pedido[] = [];
  carregando = true;
  readonly placeholders = Array(6).fill(0);

  filtroBusca = '';
  filtroStatus: string | null = null;

  readonly rowsPerPageOptions = [10, 15, 20, 25];
  firstMobile = 0;
  rowsMobile = 10;

  get pedidosMobileVisiveis(): Pedido[] {
    return this.pedidosFiltrados.slice(this.firstMobile, this.firstMobile + this.rowsMobile);
  }

  onPageMobile(event: { first?: number; rows?: number }): void {
    this.firstMobile = event.first ?? 0;
    this.rowsMobile  = event.rows  ?? 10;
  }

  readonly opcoesStatus = [
    { label: 'Todos os status', value: null },
    { label: 'Aguardando Arte', value: 'aguardando_arte' },
    { label: 'Em Produção',     value: 'em_producao' },
    { label: 'Enviado',         value: 'enviado' },
    { label: 'Entregue',        value: 'entregue' },
    { label: 'Cancelado',       value: 'cancelado' },
  ];

  private readonly clienteNomes: Record<number, string> = {
    1: 'Ana Oliveira',
    2: 'Bruno Santos',
    3: 'Carla Mendes',
    4: 'Diego Ferreira',
    5: 'Elaine Costa',
  };

  constructor(
    private pedidosService: PedidosService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.pedidosService.listarTodos().subscribe({
      next: (data) => {
        this.pedidos = data;
        this.aplicarFiltros();
        this.carregando = false;
      }
    });
  }

  aplicarFiltros(): void {
    this.firstMobile = 0;
    this.pedidosFiltrados = this.pedidos.filter(p => {
      const matchBusca = !this.filtroBusca ||
        String(p.id).includes(this.filtroBusca) ||
        this.nomeCliente(p.cliente_id).toLowerCase().includes(this.filtroBusca.toLowerCase());
      const matchStatus = !this.filtroStatus || p.status === this.filtroStatus;
      return matchBusca && matchStatus;
    });
  }

  verDetalhe(id: number): void {
    this.router.navigate(['/admin/pedidos', id]);
  }

  nomeCliente(clienteId: number): string {
    return this.clienteNomes[clienteId] ?? `Cliente #${clienteId}`;
  }

  totalPecas(pedido: Pedido): number {
    return pedido.itens.reduce((acc, item) => acc + item.quantidade, 0);
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

  statusSeverity(status: StatusPedido): 'success' | 'secondary' | 'info' | 'warn' | 'danger' | 'contrast' {
    const map: Record<StatusPedido, 'success' | 'secondary' | 'info' | 'warn' | 'danger' | 'contrast'> = {
      aguardando_arte: 'warn',
      em_producao:     'info',
      enviado:         'info',
      entregue:        'success',
      cancelado:       'danger',
    };
    return map[status];
  }

  formatarTotal(total: number): string {
    return total.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  }

  formatarData(data: Date): string {
    return new Date(data).toLocaleDateString('pt-BR');
  }
}
