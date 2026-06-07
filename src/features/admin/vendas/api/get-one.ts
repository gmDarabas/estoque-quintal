import { useQuery } from "react-query";
import { supabase } from "@/supabaseClient";
import { Venda, VendaComItens, VendaItem } from "./types";

const getVenda = async (id: string): Promise<VendaComItens> => {
  const [{ data: venda, error: e1 }, { data: itens, error: e2 }] =
    await Promise.all([
      supabase.from("operacoes").select("*").eq("id", id).single(),
      supabase
        .from("movimentacoes")
        .select("id, produto_id, quantidade, preco_venda_unitario, produtos(id, nome, unidade)")
        .eq("operacao_id", id)
        .is("deleted_at", null)
        .order("created_at", { ascending: true }),
    ]);

  if (e1) throw e1;
  if (e2) throw e2;

  return {
    ...(venda as Venda),
    itens: (itens ?? []) as unknown as VendaItem[],
  };
};

const useGetVenda = (id: string | undefined) =>
  useQuery(["venda", id], () => getVenda(id as string), {
    enabled: !!id,
  });

export { getVenda, useGetVenda };
