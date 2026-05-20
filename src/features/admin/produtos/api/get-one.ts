import { UseQueryResult, useQuery } from "react-query";
import { ProdutoComCategoria } from "./types";
import { supabase } from "@/supabaseClient";

const getOneProduto = async (id: string | undefined): Promise<ProdutoComCategoria> => {
  if (!id) throw new Error("é necessário informar id");

  const { data, error } = await supabase
    .from("produtos")
    .select("*, categoria:categorias(id, nome), fornecedor:fornecedores(id, nome)")
    .eq("id", id)
    .is("deleted_at", null)
    .single();

  if (error) throw new Error(error.message);
  return data;
};

const useGetProduto = (id: string | undefined): UseQueryResult<ProdutoComCategoria> => {
  return useQuery({
    queryKey: ["produto", id],
    queryFn: () => getOneProduto(id),
    enabled: !!id,
  });
};

export { getOneProduto, useGetProduto };
