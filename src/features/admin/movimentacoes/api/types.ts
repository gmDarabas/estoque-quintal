import { Produto } from "../../produtos/api/types";

export type TipoMovimentacao = "entrada" | "saida" | "perda";

export type Movimentacao = {
  id: string;
  produto_id: string;
  tipo: TipoMovimentacao;
  quantidade: number;
  preco_custo_unitario?: number | null;
  preco_venda_unitario?: number | null;
  observacao?: string | null;
  data_movimentacao: string;
  created_at: string;
  deleted_at?: string | null;
};

export type MovimentacaoComProduto = Movimentacao & {
  produtos?: Pick<Produto, "id" | "nome" | "unidade"> | null;
};

export type CreateMovimentacaoDto = Pick<
  Movimentacao,
  | "produto_id"
  | "tipo"
  | "quantidade"
  | "preco_custo_unitario"
  | "preco_venda_unitario"
  | "observacao"
> & {
  data_movimentacao?: string | null;
};
