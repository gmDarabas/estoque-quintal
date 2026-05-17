import usePaginator from "@/lib/use-paginator";
import { GetPageOptions, Page } from "@/types/interfaces";
import { MovimentacaoComProduto, TipoMovimentacao } from "./types";
import { supabase } from "@/supabaseClient";

export type OrderByMovimentacaoOption =
  | "data_desc"
  | "data_asc"
  | "quantidade_desc"
  | "valor_desc";

export type ListMovimentacaoResult = Page<MovimentacaoComProduto>;
export type ListMovimentacaoParams = GetPageOptions & {
  tipo?: TipoMovimentacao;
  produto_id?: string;
  data_de?: string;
  data_ate?: string;
  orderBy?: OrderByMovimentacaoOption;
};

const ORDER_MAP: Record<OrderByMovimentacaoOption, { column: string; ascending: boolean }> = {
  data_desc:       { column: "created_at",          ascending: false },
  data_asc:        { column: "created_at",          ascending: true  },
  quantidade_desc: { column: "quantidade",           ascending: false },
  valor_desc:      { column: "preco_custo_unitario", ascending: false },
};

const listMovimentacoes = async ({
  page,
  rpp,
  tipo,
  produto_id,
  data_de,
  data_ate,
  orderBy = "data_desc",
}: ListMovimentacaoParams): Promise<ListMovimentacaoResult> => {
  page = page || 1;
  rpp = rpp || 15;

  const from = (page - 1) * rpp;
  const to = from + rpp - 1;

  const { column, ascending } = ORDER_MAP[orderBy];

  let query = supabase
    .from("movimentacoes")
    .select("*, produtos(id, nome, unidade)", { count: "exact" })
    .order(column, { ascending, nullsFirst: false })
    .is("deleted_at", null)
    .range(from, to);

  if (tipo)       query = query.eq("tipo", tipo);
  if (produto_id) query = query.eq("produto_id", produto_id);
  if (data_de)    query = query.gte("created_at", data_de);
  if (data_ate)   query = query.lte("created_at", data_ate);

  const { data, count, error } = await query;

  if (error) throw error;

  return {
    list: data ?? [],
    totalCount: count ?? 0,
    page,
    rpp,
  };
};

const useListMovimentacoes = ({
  page = 1,
  rpp = 10,
  queryKeys = [],
}: GetPageOptions & { queryKeys?: string[] }) => {
  return usePaginator<MovimentacaoComProduto>({
    queryKey: ["movimentacoes", ...queryKeys],
    fetch: listMovimentacoes,
    page,
    rpp,
  });
};

export { listMovimentacoes, useListMovimentacoes };
