import usePaginator from "@/lib/use-paginator";
import { GetPageOptions, Page } from "@/types/interfaces";
import { Inventario } from "./types";
import { supabase } from "@/supabaseClient";

export type ListInventarioParams = GetPageOptions;

const listInventarios = async ({
  page,
  rpp,
}: ListInventarioParams): Promise<Page<Inventario>> => {
  page = page || 1;
  rpp = rpp || 10;

  const from = (page - 1) * rpp;
  const to = from + rpp - 1;

  const { data, count, error } = await supabase
    .from("inventarios")
    .select("*", { count: "exact" })
    .is("deleted_at", null)
    .order("iniciado_em", { ascending: false })
    .range(from, to);

  if (error) throw error;

  return { list: data ?? [], totalCount: count ?? 0, page, rpp };
};

const useListInventarios = ({ page = 1, rpp = 10 }: GetPageOptions = {}) => {
  return usePaginator<Inventario>({
    queryKey: ["inventarios"],
    fetch: listInventarios,
    page,
    rpp,
  });
};

export { listInventarios, useListInventarios };
