export type PerfilUsuario = 'cliente' | 'funcionario' | 'admin';

export interface Usuario {
  id: number;
  nome: string;
  email: string;
  perfil: PerfilUsuario;
  ativo: boolean;
  criado_em: Date;
}

export interface SessaoChat {
  id: number;
  cliente_id: number;
  funcionario_id: number | null;
  status: 'aguardando' | 'ativo' | 'encerrado';
  criado_em: Date;
  mensagens: MensagemChat[];
}

export interface MensagemChat {
  id: number;
  sessao_id: number;
  autor_id: number;
  texto: string;
  criado_em: Date;
}
