import { Categoria } from "../../categorias/api/types";

export type Produto = {
  id: string;
  nome: string;
  descricao?: string | null;
  categoria_id?: string | null;
  quantidade_atual: number;
  estoque_minimo: number;
  unidade: string;
  foto_url?: string | null;
  created_at: string;
  updated_at: string;
  deleted_at?: string | null;
};

export type ProdutoComCategoria = Produto & {
  categorias?: Pick<Categoria, 'id' | 'nome'> | null;
};

export type CreateProdutoDto = Omit<Produto, 'id' | 'created_at' | 'updated_at' | 'deleted_at'>;
export type UpdateProdutoDto = Partial<CreateProdutoDto>;
