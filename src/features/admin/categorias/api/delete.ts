import { notification } from "antd";
import { useMutation, useQueryClient } from "react-query";
import { supabase } from "@/supabaseClient";

const deleteCategoria = async (id: string): Promise<boolean> => {
  const { error } = await supabase
    .from("categorias")
    .update({ deleted_at: new Date().toISOString() })
    .eq("id", id);

  if (error) throw new Error(error.message);
  return true;
};

const useDeleteCategoria = (options?: Record<string, unknown>) => {
  const queryClient = useQueryClient();
  const mutation = useMutation(async (id: string) => deleteCategoria(id), {
    ...options,
    onSuccess: async () => {
      await queryClient.invalidateQueries("categorias");
      notification.warning({ message: "Categoria excluída com sucesso" });
    },
  });
  return (id: string) => mutation.mutateAsync(id);
};

export { deleteCategoria, useDeleteCategoria };
