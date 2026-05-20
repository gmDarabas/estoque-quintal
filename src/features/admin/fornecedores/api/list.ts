import usePaginator from "@/lib/use-paginator";
import { GetPageOptions, Page } from "@/types/interfaces";
import { Fornecedor } from "./types";
import { supabase } from "@/supabaseClient";

export type ListFornecedorParams = GetPageOptions & { q?: string };

const listFornecedores = async ({ page, rpp, q }: ListFornecedorParams): Promise<Page<Fornecedor>> => {
  page = page || 1;
  rpp = rpp || 15;

  const from = (page - 1) * rpp;
  const to = from + rpp - 1;

  let query = supabase
    .from("fornecedores")
    .select("*", { count: "exact" })
    .is("deleted_at", null)
    .order("nome", { ascending: true })
    .range(from, to);

  if (q) query = query.ilike("nome", `%${q}%`);

  const { data, count, error } = await query;

  if (error) throw error;

  return { list: data ?? [], totalCount: count ?? 0, page, rpp };
};

const useListFornecedores = ({ page = 1, rpp = 15 }: GetPageOptions) => {
  return usePaginator<Fornecedor>({
    queryKey: ["fornecedores"],
    fetch: listFornecedores,
    page,
    rpp,
  });
};

export { listFornecedores, useListFornecedores };
