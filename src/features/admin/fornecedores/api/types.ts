export type Fornecedor = {
  id: string;
  nome: string;
  cnpj?: string | null;
  telefone?: string | null;
  email?: string | null;
  contato?: string | null;
  created_at: string;
  updated_at: string;
  deleted_at?: string | null;
};

export type CreateFornecedorDto = Omit<Fornecedor, 'id' | 'created_at' | 'updated_at' | 'deleted_at'>;
export type UpdateFornecedorDto = Partial<CreateFornecedorDto>;
