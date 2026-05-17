import usePaginator from "@/lib/use-paginator";
import { GetPageOptions, Page } from "@/types/interfaces";
import { MovimentacaoComProduto, TipoMovimentacao } from "./types";
import { supabase } from "@/supabaseClient";

export type ListMovimentacaoResult = Page<MovimentacaoComProduto>;
export type ListMovimentacaoParams = GetPageOptions & {
  tipo?: TipoMovimentacao;
  produto_id?: string;
};

const listMovimentacoes = async ({
  page,
  rpp,
  tipo,
  produto_id,
}: ListMovimentacaoParams): Promise<ListMovimentacaoResult> => {
  page = page || 1;
  rpp = rpp || 15;

  const from = (page - 1) * rpp;
  const to = from + rpp - 1;

  let query = supabase
    .from("movimentacoes")
    .select("*, produtos(id, nome, unidade)", { count: "exact" })
    .order("created_at", { ascending: false })
    .is("deleted_at", null)
    .range(from, to);

  if (tipo) {
    query = query.eq("tipo", tipo);
  }

  if (produto_id) {
    query = query.eq("produto_id", produto_id);
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
