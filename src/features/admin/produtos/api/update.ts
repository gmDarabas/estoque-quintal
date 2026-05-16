import { notification } from "antd";
import { useMutation, useQueryClient } from "react-query";
import { Produto, UpdateProdutoDto } from "./types";
import { supabase } from "@/supabaseClient";

type UpdateParams = { id: string; data: UpdateProdutoDto };

const updateProduto = async ({ id, data }: UpdateParams): Promise<Produto> => {
  const { data: updated, error } = await supabase
    .from("produtos")
    .update(data)
    .eq("id", id)
    .select()
    .single();

  if (error) throw new Error(error.message);
  return updated;
};

const useUpdateProduto = (options?: Record<string, unknown>) => {
  const queryClient = useQueryClient();
  const mutation = useMutation(async (params: UpdateParams) => updateProduto(params), {
    ...options,
    onSuccess: async () => {
      await queryClient.invalidateQueries("produtos");
      notification.success({ message: "Produto atualizado com sucesso" });
    },
  });
  return (id: string, data: UpdateProdutoDto) => mutation.mutateAsync({ id, data });
};

export { updateProduto, useUpdateProduto };
