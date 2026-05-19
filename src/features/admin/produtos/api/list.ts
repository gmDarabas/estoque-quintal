import usePaginator from "@/lib/use-paginator";
import { GetPageOptions, Page } from "@/types/interfaces";
import { ProdutoEstoque } from "./types";
import { supabase } from "@/supabaseClient";

export type OrderByOption = "nome_asc" | "quantidade_asc" | "quantidade_desc" | "valor_desc";

export type ListProdutoResult = Page<ProdutoEstoque>;
export type ListProdutoParams = GetPageOptions & {
  q?: string;
  categoria_id?: string;
  fornecedor_id?: string;
  abaixo_do_minimo?: boolean;
  orderBy?: OrderByOption;
};

const ORDER_MAP: Record<OrderByOption, { column: string; ascending: boolean; nullsFirst?: boolean }> = {
  nome_asc:       { column: "nome",               ascending: true  },
  quantidade_asc: { column: "quantidade_atual",    ascending: true  },
  quantidade_desc:{ column: "quantidade_atual",    ascending: false },
  valor_desc:     { column: "valor_total_estoque", ascending: false, nullsFirst: false },
};

const listProdutos = async ({
  page,
  rpp,
  q,
  categoria_id,
  fornecedor_id,
  abaixo_do_minimo,
  orderBy = "nome_asc",
}: ListProdutoParams): Promise<ListProdutoResult> => {
  page = page || 1;
  rpp = rpp || 15;

  const from = (page - 1) * rpp;
  const to = from + rpp - 1;

  const { column, ascending, nullsFirst } = ORDER_MAP[orderBy];

  let query = supabase
    .from("v_estoque_atual")
    .select("*, categorias(id, nome), fornecedores(id, nome)", { count: "exact" })
    .order(column, { ascending, nullsFirst })
    .range(from, to);

  if (q)               query = query.or(`codigo.ilike.%${q}%,nome.ilike.%${q}%,descricao.ilike.%${q}%`);
  if (categoria_id)    query = query.eq("categoria_id", categoria_id);
  if (fornecedor_id)   query = query.eq("fornecedor_id", fornecedor_id);
  if (abaixo_do_minimo) query = query.eq("abaixo_do_minimo", true);

  const { data, count, error } = await query;

  if (error) throw error;

  return {
    list: data ?? [],
    totalCount: count ?? 0,
    page,
    rpp,
  };
};

const useListProdutos = ({
  page = 1,
  rpp = 10,
  queryKeys = [],
  defaultParams,
}: GetPageOptions & { queryKeys?: string[]; defaultParams?: Partial<ListProdutoParams> }) => {
  return usePaginator<ProdutoEstoque>({
    queryKey: ["produtos", ...queryKeys],
    fetch: listProdutos,
    page,
    rpp,
    defaultParams,
  });
};

export { listProdutos, useListProdutos };
