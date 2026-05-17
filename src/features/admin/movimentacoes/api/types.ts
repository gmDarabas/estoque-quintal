import { Produto } from "../../produtos/api/types";

export type TipoMovimentacao = "entrada" | "saida" | "perda";

export type Movimentacao = {
  id: string;
  produto_id: string;
  tipo: TipoMovimentacao;
  quantidade: number;
  observacao?: string | null;
  created_at: string;
  deleted_at?: string | null;
};

export type MovimentacaoComProduto = Movimentacao & {
  produtos?: Pick<Produto, "id" | "nome" | "unidade"> | null;
};

export type CreateMovimentacaoDto = Pick<
  Movimentacao,
  "produto_id" | "tipo" | "quantidade" | "observacao"
>;
