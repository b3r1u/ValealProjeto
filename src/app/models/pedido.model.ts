export type StatusPedido =
  | 'aguardando_arte'
  | 'em_producao'
  | 'enviado'
  | 'entregue'
  | 'cancelado';

export interface Pedido {
  id: number;
  cliente_id: number;
  status: StatusPedido;
  tem_arte: boolean;
  arte_url: string | null;
  observacoes: string;
  total: number;
  criado_em: Date;
  itens: ItemPedido[];
}

export interface ItemPedido {
  id: number;
  pedido_id: number;
  material_id: number;
  tamanho: string;
  quantidade: number;
  preco_unitario: number;
  subtotal: number;
}
