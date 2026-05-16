import { notification } from "antd";
import { useMutation, useQueryClient } from "react-query";
import { supabase } from "@/supabaseClient";

const deleteProduto = async (id: string): Promise<boolean> => {
  const { error } = await supabase
    .from("produtos")
    .update({ deleted_at: new Date().toISOString() })
    .eq("id", id);

  if (error) throw new Error(error.message);
  return true;
};

const useDeleteProduto = (options?: Record<string, unknown>) => {
  const queryClient = useQueryClient();
  const mutation = useMutation(async (id: string) => deleteProduto(id), {
    ...options,
    onSuccess: async () => {
      await queryClient.invalidateQueries("produtos");
      notification.warning({ message: "Produto excluído com sucesso" });
    },
  });
  return (id: string) => mutation.mutateAsync(id);
};

export { deleteProduto, useDeleteProduto };
