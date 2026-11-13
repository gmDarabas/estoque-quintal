import usePaginator from "@/lib/use-paginator";
import { GetPageOptions, Page } from "@/types/interfaces";
import { supabase } from "@/supabaseClient";
import { MovimentacaoComProduto } from "../../movimentacoes/api/types";
import { useQuery } from "react-query";
import { custoUnitario, resolveCustosPorProduto } from "./custos";

export type ListPerdasParams = GetPageOptions & {
  produto_id?: string;
  data_de?: string;
  data_ate?: string;
};

/** A perda não guarda o próprio custo; ele vem resolvido de `./custos`. */
export type PerdaComCusto = MovimentacaoComProduto & {
  custo_unitario: number | null;
};

export type PerdasTotais = {
  totalQuantidade: number;
  totalValor: number;
};

const listPerdas = async (params: ListPerdasParams): Promise<Page<PerdaComCusto>> => {
  const page = params.page || 1;
  const rpp = params.rpp || 15;
  const from = (page - 1) * rpp;
  const to = from + rpp - 1;

  let query = supabase
    .from("movimentacoes")
    .select("*, produtos(id, nome, unidade)", { count: "exact" })
    .eq("tipo", "perda")
    .is("deleted_at", null)
    .order("data_movimentacao", { ascending: false })
    .range(from, to);

  if (params.produto_id) query = query.eq("produto_id", params.produto_id);
  if (params.data_de)    query = query.gte("data_movimentacao", params.data_de);
  if (params.data_ate)   query = query.lte("data_movimentacao", params.data_ate);

  const { data, count, error } = await query;
  if (error) throw error;

  const perdas = data ?? [];
  const custos = await resolveCustosPorProduto(perdas.map((p) => p.produto_id));

  return {
    list: perdas.map((p) => ({ ...p, custo_unitario: custoUnitario(p, custos) })),
    totalCount: count ?? 0,
    page,
    rpp,
  };
};

const fetchPerdasTotais = async (
  params: Omit<ListPerdasParams, "page" | "rpp">,
): Promise<PerdasTotais> => {
  let query = supabase
    .from("movimentacoes")
    .select("produto_id,quantidade,preco_custo_unitario")
    .eq("tipo", "perda")
    .is("deleted_at", null);

  if (params.produto_id) query = query.eq("produto_id", params.produto_id);
  if (params.data_de)    query = query.gte("data_movimentacao", params.data_de);
  if (params.data_ate)   query = query.lte("data_movimentacao", params.data_ate);

  const { data, error } = await query;
  if (error) throw error;

  const perdas = data ?? [];
  const custos = await resolveCustosPorProduto(perdas.map((p) => p.produto_id));

  return {
    totalQuantidade: perdas.reduce((s, p) => s + p.quantidade, 0),
    totalValor: perdas.reduce(
      (s, p) => s + p.quantidade * (custoUnitario(p, custos) ?? 0),
      0,
    ),
  };
};

export const useListPerdas = ({
  page = 1,
  rpp = 15,
  queryKeys = [],
}: GetPageOptions & { queryKeys?: string[] }) =>
  usePaginator<PerdaComCusto>({
    queryKey: ["perdas", ...queryKeys],
    fetch: listPerdas,
    page,
    rpp,
  });

export const usePerdasTotais = (params: Omit<ListPerdasParams, "page" | "rpp">) =>
  useQuery(["perdas-totais", params], () => fetchPerdasTotais(params));
