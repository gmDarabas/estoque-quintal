import { notification } from "antd";
import { useMutation, useQueryClient } from "react-query";
import { CreateMovimentacaoDto, Movimentacao } from "./types";
import { supabase } from "@/supabaseClient";

const createMovimentacao = async (
  data: CreateMovimentacaoDto
): Promise<Movimentacao> => {
  const { data: inserted, error } = await supabase
    .from("movimentacoes")
    .insert(data)
    .select()
    .single();

  if (error) throw new Error(error.message);
  return inserted;
};

const useCreateMovimentacao = (options?: Record<string, unknown>) => {
  const queryClient = useQueryClient();
  const mutation = useMutation(
    async (params: CreateMovimentacaoDto) => createMovimentacao(params),
    {
      ...options,
      onSuccess: async () => {
        await queryClient.invalidateQueries("movimentacoes");
        notification.success({ message: "Movimentação registrada com sucesso" });
      },
    }
  );
  return (data: CreateMovimentacaoDto) => mutation.mutateAsync(data);
};

export { createMovimentacao, useCreateMovimentacao };
