import { useQuery } from "react-query";
import { supabase } from "@/supabaseClient";

export type ProdutoSelectOption = {
  id: string;
  nome: string;
  unidade: string;
  quantidade_atual: number;
  preco_custo_atual?: number | null;
  margem?: number | null;
  codigo?: string;
  foto_url?: string | null;
};

const listProdutosSelect = async (
  q?: string,
): Promise<ProdutoSelectOption[]> => {
  let query = supabase
    .from("v_estoque_atual")
    .select(
      "id, nome, unidade, quantidade_atual, preco_custo_atual, margem, codigo, foto_url",
    )
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
