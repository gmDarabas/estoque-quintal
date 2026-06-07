import { notification } from "antd";
import { useMutation, useQueryClient } from "react-query";
import { supabase } from "@/supabaseClient";
import { invalidateVendaQueries } from "./invalidate";

const deleteVenda = async (id: string): Promise<boolean> => {
  const { error } = await supabase.rpc("excluir_venda", { p_id: id });

  if (error) throw new Error(error.message);
  return true;
};

const useDeleteVenda = (options?: Record<string, unknown>) => {
  const queryClient = useQueryClient();
  const mutation = useMutation(async (id: string) => deleteVenda(id), {
    ...options,
    onSuccess: async () => {
      await invalidateVendaQueries(queryClient);
      notification.warning({ message: "Venda excluída com sucesso" });
    },
  });
  return (id: string) => mutation.mutateAsync(id);
};

export { deleteVenda, useDeleteVenda };
