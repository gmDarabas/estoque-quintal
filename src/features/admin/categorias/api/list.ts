import { useQuery } from "react-query";
import { Categoria } from "./types";
import { supabase } from "@/supabaseClient";

const listCategorias = async (): Promise<Categoria[]> => {
  const { data, error } = await supabase
    .from("categorias")
    .select("*")
    .is("deleted_at", null)
    .order("nome", { ascending: true });

  if (error) throw error;
  return data ?? [];
};

const useListCategorias = () => {
  return useQuery({
    queryKey: ["categorias"],
    queryFn: listCategorias,
  });
};

export { listCategorias, useListCategorias };
