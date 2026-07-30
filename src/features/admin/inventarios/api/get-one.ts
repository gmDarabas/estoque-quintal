import { UseQueryResult, useQuery } from "react-query";
import { Inventario } from "./types";
import { supabase } from "@/supabaseClient";

const getOneInventario = async (
  id: string | undefined,
): Promise<Inventario> => {
  if (!id) throw new Error("é necessário informar id");

  const { data, error } = await supabase
    .from("inventarios")
    .select("*")
    .eq("id", id)
    .is("deleted_at", null)
    .single();

  if (error) throw new Error(error.message);
  return data;
};

const useGetInventario = (
  id: string | undefined,
): UseQueryResult<Inventario> => {
  return useQuery({
    queryKey: ["inventario", id],
    queryFn: () => getOneInventario(id),
    enabled: !!id,
  });
};

export { getOneInventario, useGetInventario };
