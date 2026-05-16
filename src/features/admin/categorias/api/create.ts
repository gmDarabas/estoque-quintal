import { useMutation, useQueryClient } from "react-query";
import { Categoria, CreateCategoriaDto } from "./types";
import { supabase } from "@/supabaseClient";

const createCategoria = async (data: CreateCategoriaDto): Promise<Categoria> => {
  const { data: inserted, error } = await supabase
    .from("categorias")
    .insert(data)
    .select()
    .single();

  if (error) throw new Error(error.message);
  return inserted;
};

const useCreateCategoria = (options?: Record<string, unknown>) => {
  const queryClient = useQueryClient();
  const mutation = useMutation(async (params: CreateCategoriaDto) => createCategoria(params), {
    ...options,
    onSuccess: async () => {
      await queryClient.invalidateQueries("categorias");
    },
  });
  return (data: CreateCategoriaDto) => mutation.mutateAsync(data);
};

export { createCategoria, useCreateCategoria };
