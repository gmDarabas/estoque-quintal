import { notification } from "antd";
import { useMutation, useQueryClient } from "react-query";
import { CreateMovimentacaoDto } from "./types";
import { supabase } from "@/supabaseClient";

const createMovimentacao = async (
  data: CreateMovimentacaoDto,
): Promise<string> => {
  const { data: id, error } = await supabase.rpc("registrar_movimentacao", {
    p_produto_id: data.produto_id,
    p_tipo: data.tipo,
    p_quantidade: data.quantidade,
    p_preco_custo_unitario: data.preco_custo_unitario ?? null,
    p_preco_venda_unitario: data.preco_venda_unitario ?? null,
    p_observacao: data.observacao ?? null,
  });

  if (error) throw new Error(error.message);
  return id as string;
};

const useCreateMovimentacao = (options?: Record<string, unknown>) => {
  const queryClient = useQueryClient();
  const mutation = useMutation(
    async (params: CreateMovimentacaoDto) => createMovimentacao(params),
    {
      ...options,
      onSuccess: async () => {
        await Promise.all([
          queryClient.invalidateQueries("movimentacoes"),
          queryClient.invalidateQueries("produtos"),
        ]);
        notification.success({
          message: "Movimentação registrada com sucesso",
        });
      },
    },
  );
  return (data: CreateMovimentacaoDto) => mutation.mutateAsync(data);
};

export { createMovimentacao, useCreateMovimentacao };
