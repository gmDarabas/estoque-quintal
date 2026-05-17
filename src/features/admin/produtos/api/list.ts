import usePaginator from "@/lib/use-paginator";
import { GetPageOptions, Page } from "@/types/interfaces";
import { ProdutoEstoque } from "./types";
import { supabase } from "@/supabaseClient";

export type ListProdutoResult = Page<ProdutoEstoque>;
export type ListProdutoParams = GetPageOptions & { q?: string };

const listProdutos = async ({
  page,
  rpp,
  q,
}: ListProdutoParams): Promise<ListProdutoResult> => {
  page = page || 1;
  rpp = rpp || 15;

  const from = (page - 1) * rpp;
  const to = from + rpp - 1;

  let query = supabase
    .from("v_estoque_atual")
    .select("*, categorias(id, nome)", { count: "exact" })
    .order("nome", { ascending: true })
    .range(from, to);

  if (q) {
    query = query.or(`nome.ilike.%${q}%,descricao.ilike.%${q}%`);
  }

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
}: GetPageOptions & { queryKeys?: string[] }) => {
  return usePaginator<ProdutoEstoque>({
    queryKey: ["produtos", ...queryKeys],
    fetch: listProdutos,
    page,
    rpp,
  });
};

export { listProdutos, useListProdutos };
