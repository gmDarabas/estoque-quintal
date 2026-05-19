import { UseQueryResult, useQuery } from "react-query";
import { Categoria } from "./types";
import { supabase } from "@/supabaseClient";

const getOneCategoria = async (id: string | undefined): Promise<Categoria> => {
  if (!id) throw new Error("é necessário informar id");

  const { data, error } = await supabase
    .from("categorias")
    .select("*")
    .eq("id", id)
    .is("deleted_at", null)
    .single();

  if (error) throw new Error(error.message);
  return data;
};

const useGetCategoria = (id: string | undefined): UseQueryResult<Categoria> => {
  return useQuery({
    queryKey: ["categoria", id],
    queryFn: () => getOneCategoria(id),
    enabled: !!id,
  });
};

export { getOneCategoria, useGetCategoria };
