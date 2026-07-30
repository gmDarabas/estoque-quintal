import { notification } from "antd";
import { useMutation, useQueryClient } from "react-query";
import { supabase } from "@/supabaseClient";

const deleteInventario = async (id: string): Promise<boolean> => {
  const { error } = await supabase
    .from("inventarios")
    .update({ deleted_at: new Date().toISOString() })
    .eq("id", id);

  if (error) throw new Error(error.message);
  return true;
};

const useDeleteInventario = (options?: Record<string, unknown>) => {
  const queryClient = useQueryClient();
  const mutation = useMutation(async (id: string) => deleteInventario(id), {
    ...options,
    onSuccess: async () => {
      await queryClient.invalidateQueries("inventarios");
      notification.warning({ message: "Inventário excluído com sucesso" });
    },
  });
  return (id: string) => mutation.mutateAsync(id);
};

export { deleteInventario, useDeleteInventario };
