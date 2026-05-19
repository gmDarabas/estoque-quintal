import { UseQueryResult, useQuery } from "react-query";
import { Fornecedor } from "./types";
import { supabase } from "@/supabaseClient";

const getOneFornecedor = async (id: string | undefined): Promise<Fornecedor> => {
  if (!id) throw new Error("é necessário informar id");

  const { data, error } = await supabase
    .from("fornecedores")
    .select("*")
    .eq("id", id)
    .is("deleted_at", null)
    .single();

  if (error) throw new Error(error.message);
  return data;
};

const useGetFornecedor = (id: string | undefined): UseQueryResult<Fornecedor> => {
  return useQuery({
    queryKey: ["fornecedor", id],
    queryFn: () => getOneFornecedor(id),
    enabled: !!id,
  });
};

export { getOneFornecedor, useGetFornecedor };
