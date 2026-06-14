import { Pedido } from '../../app/models/pedido.model';

export const PEDIDOS_MOCK: Pedido[] = [
  {
    id: 1,
    cliente_id: 1,
    status: 'aguardando_arte',
    tem_arte: false,
    arte_url: null,
    observacoes: 'Camisas para equipe de vendas, logotipo nas costas.',
    total: 350.00,
    criado_em: new Date('2024-03-01'),
    itens: [
      { id: 1, pedido_id: 1, material_id: 1, tamanho: 'M', quantidade: 10, preco_unitario: 35.00, subtotal: 350.00 }
    ]
  },
  {
    id: 2,
    cliente_id: 2,
    status: 'em_producao',
    tem_arte: true,
    arte_url: 'uploads/arte-pedido-2.png',
    observacoes: '',
    total: 720.00,
    criado_em: new Date('2024-03-05'),
    itens: [
      { id: 2, pedido_id: 2, material_id: 4, tamanho: 'M', quantidade: 15, preco_unitario: 48.00, subtotal: 720.00 }
    ]
  },
  {
    id: 3,
    cliente_id: 3,
    status: 'enviado',
    tem_arte: true,
    arte_url: 'uploads/arte-pedido-3.pdf',
    observacoes: 'Urgente — evento dia 20.',
    total: 550.00,
    criado_em: new Date('2024-03-08'),
    itens: [
      { id: 3, pedido_id: 3, material_id: 3, tamanho: 'G', quantidade: 10, preco_unitario: 55.00, subtotal: 550.00 }
    ]
  },
  {
    id: 4,
    cliente_id: 1,
    status: 'entregue',
    tem_arte: false,
    arte_url: null,
    observacoes: '',
    total: 1680.00,
    criado_em: new Date('2024-02-10'),
    itens: [
      { id: 4, pedido_id: 4, material_id: 2, tamanho: 'P',  quantidade: 20, preco_unitario: 42.00, subtotal: 840.00 },
      { id: 5, pedido_id: 4, material_id: 2, tamanho: 'M',  quantidade: 20, preco_unitario: 42.00, subtotal: 840.00 }
    ]
  },
  {
    id: 5,
    cliente_id: 4,
    status: 'cancelado',
    tem_arte: false,
    arte_url: null,
    observacoes: 'Cliente cancelou por prazo.',
    total: 280.00,
    criado_em: new Date('2024-02-15'),
    itens: [
      { id: 6, pedido_id: 5, material_id: 1, tamanho: 'G', quantidade: 8, preco_unitario: 35.00, subtotal: 280.00 }
    ]
  },
  {
    id: 6,
    cliente_id: 2,
    status: 'aguardando_arte',
    tem_arte: false,
    arte_url: null,
    observacoes: 'Sublimação frente e costas.',
    total: 960.00,
    criado_em: new Date('2024-03-12'),
    itens: [
      { id: 7, pedido_id: 6, material_id: 4, tamanho: 'GG', quantidade: 20, preco_unitario: 48.00, subtotal: 960.00 }
    ]
  },
  {
    id: 7,
    cliente_id: 3,
    status: 'em_producao',
    tem_arte: true,
    arte_url: 'uploads/arte-pedido-7.ai',
    observacoes: '',
    total: 440.00,
    criado_em: new Date('2024-03-14'),
    itens: [
      { id: 8, pedido_id: 7, material_id: 3, tamanho: 'M', quantidade: 8, preco_unitario: 55.00, subtotal: 440.00 }
    ]
  },
  {
    id: 8,
    cliente_id: 5,
    status: 'entregue',
    tem_arte: true,
    arte_url: 'uploads/arte-pedido-8.png',
    observacoes: 'Entrega confirmada pelo cliente.',
    total: 2160.00,
    criado_em: new Date('2024-02-20'),
    itens: [
      { id: 9,  pedido_id: 8, material_id: 4, tamanho: 'P',  quantidade: 15, preco_unitario: 48.00, subtotal: 720.00 },
      { id: 10, pedido_id: 8, material_id: 4, tamanho: 'M',  quantidade: 15, preco_unitario: 48.00, subtotal: 720.00 },
      { id: 11, pedido_id: 8, material_id: 4, tamanho: 'G',  quantidade: 10, preco_unitario: 51.00, subtotal: 510.00 },
      { id: 12, pedido_id: 8, material_id: 4, tamanho: 'GG', quantidade: 4,  preco_unitario: 53.00, subtotal: 212.00 },
    ]
  },
  {
    id: 9,
    cliente_id: 4,
    status: 'enviado',
    tem_arte: false,
    arte_url: null,
    observacoes: 'Rastreio enviado por e-mail.',
    total: 630.00,
    criado_em: new Date('2024-03-10'),
    itens: [
      { id: 13, pedido_id: 9, material_id: 2, tamanho: 'M', quantidade: 15, preco_unitario: 42.00, subtotal: 630.00 }
    ]
  },
  {
    id: 10,
    cliente_id: 5,
    status: 'aguardando_arte',
    tem_arte: false,
    arte_url: null,
    observacoes: 'Aguardando vetor em alta resolução.',
    total: 1148.00,
    criado_em: new Date('2024-03-15'),
    itens: [
      { id: 14, pedido_id: 10, material_id: 4, tamanho: 'P',  quantidade: 10, preco_unitario: 48.00, subtotal: 480.00 },
      { id: 15, pedido_id: 10, material_id: 4, tamanho: 'M',  quantidade: 10, preco_unitario: 48.00, subtotal: 480.00 },
      { id: 16, pedido_id: 10, material_id: 4, tamanho: 'G',  quantidade: 4,  preco_unitario: 47.00, subtotal: 188.00 },
    ]
  },
];
