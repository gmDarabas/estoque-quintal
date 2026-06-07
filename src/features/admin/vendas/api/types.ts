import { Produto } from "../../produtos/api/types";

export type Venda = {
  id: string;
  tipo: "saida";
  data_operacao: string;
  observacao?: string | null;
  total: number;
  created_at: string;
  deleted_at?: string | null;
};

export type VendaListItem = Venda & {
  /** Contagem agregada de itens (movimentações filhas) vinda do Supabase. */
  itens?: { count: number }[];
};

export type VendaItem = {
  id: string;
  produto_id: string;
  quantidade: number;
  preco_venda_unitario?: number | null;
  produtos?: Pick<Produto, "id" | "nome" | "unidade"> | null;
};

export type VendaComItens = Venda & {
  itens: VendaItem[];
};

export type CreateVendaItemDto = {
  produto_id: string;
  quantidade: number;
  preco_venda_unitario: number;
};

export type CreateVendaDto = {
  data?: string | null;
  observacao?: string | null;
  itens: CreateVendaItemDto[];
};
