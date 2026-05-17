import { useQuery } from "react-query";
import { supabase } from "@/supabaseClient";

export type ProdutoSelectOption = {
  id: string;
  nome: string;
  unidade: string;
  preco_custo_atual?: number | null;
};

const listProdutosSelect = async (): Promise<ProdutoSelectOption[]> => {
  const { data, error } = await supabase
    .from("produtos")
    .select("id, nome, unidade, preco_custo_atual")
    .is("deleted_at", null)
    .order("nome", { ascending: true });

  if (error) throw error;
  return data ?? [];
};

const useListProdutosSelect = () => {
  return useQuery({
    queryKey: ["produtos-select"],
    queryFn: listProdutosSelect,
  });
};

export { listProdutosSelect, useListProdutosSelect };
