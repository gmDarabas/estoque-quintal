import { notification } from "antd";
import { useMutation, useQueryClient } from "react-query";
import { supabase } from "@/supabaseClient";

const cancelarInventario = async (id: string): Promise<boolean> => {
  const { error } = await supabase
    .from("inventarios")
    .update({ status: "cancelado" })
    .eq("id", id);

  if (error) throw new Error(error.message);
  return true;
};

const useCancelarInventario = () => {
  const queryClient = useQueryClient();
  const mutation = useMutation(async (id: string) => cancelarInventario(id), {
    onSuccess: async (_data, id) => {
      await Promise.all([
        queryClient.invalidateQueries("inventarios"),
        queryClient.invalidateQueries(["inventario", id]),
      ]);
      notification.warning({ message: "Inventário cancelado" });
    },
  });
  return (id: string) => mutation.mutateAsync(id);
};

export { cancelarInventario, useCancelarInventario };
