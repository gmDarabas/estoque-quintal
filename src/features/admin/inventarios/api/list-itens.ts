import { UseQueryResult, useQuery } from "react-query";
import { InventarioItemComProduto } from "./types";
import { supabase } from "@/supabaseClient";

const listInventarioItens = async (
  inventarioId: string | undefined,
): Promise<InventarioItemComProduto[]> => {
  if (!inventarioId) throw new Error("é necessário informar inventario_id");

  const { data, error } = await supabase
    .from("inventario_itens")
    .select("*, produtos(id, nome, codigo, unidade, foto_url)")
    .eq("inventario_id", inventarioId)
    .order("created_at", { ascending: true });

  if (error) throw new Error(error.message);
  return data ?? [];
};

const useListInventarioItens = (
  inventarioId: string | undefined,
): UseQueryResult<InventarioItemComProduto[]> => {
  return useQuery({
    queryKey: ["inventario-itens", inventarioId],
    queryFn: () => listInventarioItens(inventarioId),
    enabled: !!inventarioId,
  });
};

export { listInventarioItens, useListInventarioItens };
