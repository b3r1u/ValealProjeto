import { Pedido } from '../../app/models/pedido.model';

export const PEDIDOS_MOCK: Pedido[] = [
  {
    id: 1,
    cliente_id: 1,
    status: 'aguardando_arte',
    tem_arte: false,
    arte_url: null,
    observacoes: 'Pedido de teste',
    total: 350.00,
    criado_em: new Date('2024-01-15'),
    itens: [
      { id: 1, pedido_id: 1, material_id: 1, tamanho: 'M', quantidade: 10, preco_unitario: 35.00, subtotal: 350.00 }
    ]
  },
  {
    id: 2,
    cliente_id: 1,
    status: 'em_producao',
    tem_arte: true,
    arte_url: 'uploads/arte-pedido-2.png',
    observacoes: '',
    total: 720.00,
    criado_em: new Date('2024-01-20'),
    itens: [
      { id: 2, pedido_id: 2, material_id: 4, tamanho: 'M', quantidade: 15, preco_unitario: 48.00, subtotal: 720.00 }
    ]
  },
  {
    id: 3,
    cliente_id: 2,
    status: 'enviado',
    tem_arte: true,
    arte_url: 'uploads/arte-pedido-3.pdf',
    observacoes: 'Urgente',
    total: 550.00,
    criado_em: new Date('2024-02-01'),
    itens: [
      { id: 3, pedido_id: 3, material_id: 3, tamanho: 'G', quantidade: 10, preco_unitario: 55.00, subtotal: 550.00 }
    ]
  }
];
