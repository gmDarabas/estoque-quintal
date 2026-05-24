import { useQuery } from "react-query";
import { supabase } from "@/supabaseClient";

export type ProdutoSelectOption = {
  id: string;
  nome: string;
  unidade: string;
  preco_custo_atual?: number | null;
  codigo?: string;
  foto_url?: string | null;
};

const listProdutosSelect = async (
  q?: string,
): Promise<ProdutoSelectOption[]> => {
  let query = supabase
    .from("produtos")
    .select("id, nome, unidade, preco_custo_atual, codigo, foto_url")
    .is("deleted_at", null)
    .order("nome", { ascending: true });

  if (q) {
    query = query.or(
      `codigo.ilike.%${q}%,nome.ilike.%${q}%,descricao.ilike.%${q}%`,
    );
  }

  const { data, error } = await query.limit(10);
  if (error) throw error;
  return data ?? [];
};

const useListProdutosSelect = (q?: string) => {
  return useQuery({
    queryKey: ["produtos-select", q],
    queryFn: () => listProdutosSelect(q),
  });
};

export { listProdutosSelect, useListProdutosSelect };
