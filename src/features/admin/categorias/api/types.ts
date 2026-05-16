export type Categoria = {
  id: string;
  nome: string;
  created_at: string;
  updated_at: string;
  deleted_at?: string | null;
};

export type CreateCategoriaDto = Pick<Categoria, 'nome'>;
