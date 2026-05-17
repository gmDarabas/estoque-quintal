import { notification } from "antd";
import { useMutation, useQueryClient } from "react-query";
import { supabase } from "@/supabaseClient";

const deleteMovimentacao = async (id: string): Promise<boolean> => {
  const { error } = await supabase
    .from("movimentacoes")
    .update({ deleted_at: new Date().toISOString() })
    .eq("id", id);

  if (error) throw new Error(error.message);
  return true;
};

const useDeleteMovimentacao = (options?: Record<string, unknown>) => {
  const queryClient = useQueryClient();
  const mutation = useMutation(async (id: string) => deleteMovimentacao(id), {
    ...options,
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries("movimentacoes"),
        queryClient.invalidateQueries("produtos"),
      ]);
      notification.warning({ message: "Movimentação excluída com sucesso" });
    },
  });
  return (id: string) => mutation.mutateAsync(id);
};

export { deleteMovimentacao, useDeleteMovimentacao };
