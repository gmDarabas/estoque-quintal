export type OrcamentoItem = {
  key: string;
  /** null = linha de texto livre (não veio do catálogo) */
  produto_id?: string | null;
  descricao: string;
  quantidade: number;
  valor_unitario: number;
};

export type OrcamentoData = {
  dataEmissao: string; // ISO
  clienteNome: string;
  clienteCnpj: string;
  itens: OrcamentoItem[];
};
