import { notification } from "antd";
import { useMutation, useQueryClient } from "react-query";
import { supabase } from "@/supabaseClient";

const fecharInventario = async (id: string): Promise<boolean> => {
  const { error } = await supabase.rpc("fechar_inventario", {
    p_inventario_id: id,
  });

  if (error) throw new Error(error.message);
  return true;
};

const useFecharInventario = () => {
  const queryClient = useQueryClient();
  const mutation = useMutation(async (id: string) => fecharInventario(id), {
    onSuccess: async (_data, id) => {
      await Promise.all([
        queryClient.invalidateQueries("inventarios"),
        queryClient.invalidateQueries(["inventario", id]),
        queryClient.invalidateQueries(["inventario-itens", id]),
        queryClient.invalidateQueries("movimentacoes"),
        queryClient.invalidateQueries("produtos"),
      ]);
      notification.success({
        message: "Inventário fechado e estoque ajustado",
      });
    },
  });
  return (id: string) => mutation.mutateAsync(id);
};

export { fecharInventario, useFecharInventario };
