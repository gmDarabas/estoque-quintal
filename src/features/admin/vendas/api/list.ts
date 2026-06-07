import { useQuery } from "react-query";
import usePaginator from "@/lib/use-paginator";
import { GetPageOptions, Page } from "@/types/interfaces";
import { VendaListItem } from "./types";
import { supabase } from "@/supabaseClient";

export type OrderByVendaOption = "data_desc" | "data_asc" | "total_desc";

export type ListVendaResult = Page<VendaListItem>;
export type ListVendaParams = GetPageOptions & {
  data_de?: string;
  data_ate?: string;
  orderBy?: OrderByVendaOption;
};

const ORDER_MAP: Record<
  OrderByVendaOption,
  { column: string; ascending: boolean }
> = {
  data_desc: { column: "data_operacao", ascending: false },
  data_asc: { column: "data_operacao", ascending: true },
  total_desc: { column: "total", ascending: false },
};

const listVendas = async ({
  page,
  rpp,
  data_de,
  data_ate,
  orderBy = "data_desc",
}: ListVendaParams): Promise<ListVendaResult> => {
  page = page || 1;
  rpp = rpp || 15;

  const from = (page - 1) * rpp;
  const to = from + rpp - 1;

  const { column, ascending } = ORDER_MAP[orderBy];

  let query = supabase
    .from("operacoes")
    .select("*, itens:movimentacoes(count)", { count: "exact" })
    .eq("tipo", "saida")
    .is("deleted_at", null)
    .order(column, { ascending })
    .range(from, to);

  if (data_de) query = query.gte("data_operacao", data_de);
  if (data_ate) query = query.lte("data_operacao", data_ate);

  const { data, count, error } = await query;

  if (error) throw error;

  return {
    list: (data ?? []) as VendaListItem[],
    totalCount: count ?? 0,
    page,
    rpp,
  };
};

const useListVendas = ({
  page = 1,
  rpp = 10,
  queryKeys = [],
}: GetPageOptions & { queryKeys?: string[] }) => {
  return usePaginator<VendaListItem>({
    queryKey: ["vendas", ...queryKeys],
    fetch: listVendas,
    page,
    rpp,
  });
};

export type VendasResumo = {
  quantidade: number;
  total: number;
  ticketMedio: number;
};

export type VendasResumoParams = {
  data_de?: string;
  data_ate?: string;
};

const fetchVendasResumo = async ({
  data_de,
  data_ate,
}: VendasResumoParams): Promise<VendasResumo> => {
  let query = supabase
    .from("operacoes")
    .select("total")
    .eq("tipo", "saida")
    .is("deleted_at", null);

  if (data_de) query = query.gte("data_operacao", data_de);
  if (data_ate) query = query.lte("data_operacao", data_ate);

  const { data, error } = await query;
  if (error) throw error;

  const quantidade = data?.length ?? 0;
  const total = data?.reduce((s, v) => s + (v.total ?? 0), 0) ?? 0;

  return {
    quantidade,
    total,
    ticketMedio: quantidade > 0 ? total / quantidade : 0,
  };
};

const useVendasResumo = (params: VendasResumoParams) =>
  useQuery(["vendas-resumo", params], () => fetchVendasResumo(params), {
    staleTime: 60_000,
  });

export { listVendas, useListVendas, fetchVendasResumo, useVendasResumo };
