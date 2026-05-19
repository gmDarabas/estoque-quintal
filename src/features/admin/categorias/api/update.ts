import { notification } from "antd";
import { useMutation, useQueryClient } from "react-query";
import { Categoria, UpdateCategoriaDto } from "./types";
import { supabase } from "@/supabaseClient";

type UpdateParams = { id: string; data: UpdateCategoriaDto };

const updateCategoria = async ({ id, data }: UpdateParams): Promise<Categoria> => {
  const { data: updated, error } = await supabase
    .from("categorias")
    .update(data)
    .eq("id", id)
    .select()
    .single();

  if (error) throw new Error(error.message);
  return updated;
};

const useUpdateCategoria = (options?: Record<string, unknown>) => {
  const queryClient = useQueryClient();
  const mutation = useMutation(async (params: UpdateParams) => updateCategoria(params), {
    ...options,
    onSuccess: async () => {
      await queryClient.invalidateQueries("categorias");
      notification.success({ message: "Categoria atualizada com sucesso" });
    },
  });
  return (id: string, data: UpdateCategoriaDto) => mutation.mutateAsync({ id, data });
};

export { updateCategoria, useUpdateCategoria };
