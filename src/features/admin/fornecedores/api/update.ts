import { notification } from "antd";
import { useMutation, useQueryClient } from "react-query";
import { Fornecedor, UpdateFornecedorDto } from "./types";
import { supabase } from "@/supabaseClient";

type UpdateParams = { id: string; data: UpdateFornecedorDto };

const updateFornecedor = async ({ id, data }: UpdateParams): Promise<Fornecedor> => {
  const { data: updated, error } = await supabase
    .from("fornecedores")
    .update(data)
    .eq("id", id)
    .select()
    .single();

  if (error) throw new Error(error.message);
  return updated;
};

const useUpdateFornecedor = (options?: Record<string, unknown>) => {
  const queryClient = useQueryClient();
  const mutation = useMutation(async (params: UpdateParams) => updateFornecedor(params), {
    ...options,
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries("fornecedores"),
        queryClient.invalidateQueries("fornecedores-select"),
      ]);
      notification.success({ message: "Fornecedor atualizado com sucesso" });
    },
  });
  return (id: string, data: UpdateFornecedorDto) => mutation.mutateAsync({ id, data });
};

export { updateFornecedor, useUpdateFornecedor };
