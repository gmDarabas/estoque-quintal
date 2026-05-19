import { notification } from "antd";
import { useMutation, useQueryClient } from "react-query";
import { supabase } from "@/supabaseClient";

const deleteFornecedor = async (id: string): Promise<boolean> => {
  const { error } = await supabase
    .from("fornecedores")
    .update({ deleted_at: new Date().toISOString() })
    .eq("id", id);

  if (error) throw new Error(error.message);
  return true;
};

const useDeleteFornecedor = (options?: Record<string, unknown>) => {
  const queryClient = useQueryClient();
  const mutation = useMutation(async (id: string) => deleteFornecedor(id), {
    ...options,
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries("fornecedores"),
        queryClient.invalidateQueries("fornecedores-select"),
      ]);
      notification.warning({ message: "Fornecedor excluído com sucesso" });
    },
  });
  return (id: string) => mutation.mutateAsync(id);
};

export { deleteFornecedor, useDeleteFornecedor };
