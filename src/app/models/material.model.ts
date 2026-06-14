export interface Material {
  id: number;
  nome: string;
  tipo: 'liso' | 'sublimacao';
  descricao: string;
  imagem_url: string;
  ativo: boolean;
  permite_sublimacao: boolean;
  tamanhos: TamanhoMaterial[];
  criado_em: Date;
}

export interface TamanhoMaterial {
  id: number;
  material_id: number;
  tamanho: 'PP' | 'P' | 'M' | 'G' | 'GG' | 'XGG';
  preco_unitario: number;
  preco_atacado: number;
  qtd_minima_atacado: number;
  estoque: number;
  ativo: boolean;
}
