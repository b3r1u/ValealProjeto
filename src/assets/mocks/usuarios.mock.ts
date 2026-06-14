import { Usuario, SessaoChat } from '../../app/models/usuario.model';

export const USUARIOS_MOCK: Usuario[] = [
  { id: 1, nome: 'João Cliente',   email: 'cliente@teste.com',    perfil: 'cliente',     ativo: true, criado_em: new Date('2024-01-01') },
  { id: 2, nome: 'Maria Designer', email: 'funcionario@teste.com', perfil: 'funcionario', ativo: true, criado_em: new Date('2024-01-01') },
  { id: 3, nome: 'Carlos Admin',   email: 'admin@teste.com',       perfil: 'admin',       ativo: true, criado_em: new Date('2024-01-01') },
];

export const SESSOES_CHAT_MOCK: SessaoChat[] = [
  {
    id: 1,
    cliente_id: 1,
    funcionario_id: null,
    status: 'aguardando',
    criado_em: new Date('2024-01-15T10:00:00'),
    mensagens: [
      { id: 1, sessao_id: 1, autor_id: 1, texto: 'Olá, preciso de ajuda com minha arte', criado_em: new Date('2024-01-15T10:01:00') }
    ]
  }
];
