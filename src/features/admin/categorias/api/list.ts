import usePaginator from "@/lib/use-paginator";
import { GetPageOptions, Page } from "@/types/interfaces";
import { Categoria } from "./types";
import { supabase } from "@/supabaseClient";

export type ListCategoriasParams = GetPageOptions & { q?: string };

const listCategorias = async ({
  page,
  rpp,
  q,
}: ListCategoriasParams): Promise<Page<Categoria>> => {
  page = page || 1;
  rpp = rpp || 15;

  const from = (page - 1) * rpp;
  const to = from + rpp - 1;

  let query = supabase
    .from("categorias")
    .select("*", { count: "exact" })
    .is("deleted_at", null)
    .order("nome", { ascending: true })
    .range(from, to);

  if (q) query = query.ilike("nome", `%${q}%`);

  const { data, count, error } = await query;

  if (error) throw error;

  return { list: data ?? [], totalCount: count ?? 0, page, rpp };
};

const useListCategorias = ({
  page = 1,
  rpp = 15,
  q,
}: GetPageOptions & { q?: string } = {}) => {
  return usePaginator<Categoria>({
    queryKey: ["categorias"],
    fetch: listCategorias,
    page,
    rpp,
    defaultParams: { q },
  });
};

export { listCategorias, useListCategorias };
