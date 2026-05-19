import { useMutation, useQueryClient } from "react-query";
import { Fornecedor, CreateFornecedorDto } from "./types";
import { supabase } from "@/supabaseClient";

const createFornecedor = async (data: CreateFornecedorDto): Promise<Fornecedor> => {
  const { data: inserted, error } = await supabase
    .from("fornecedores")
    .insert(data)
    .select()
    .single();

  if (error) throw new Error(error.message);
  return inserted;
};

const useCreateFornecedor = (options?: Record<string, unknown>) => {
  const queryClient = useQueryClient();
  const mutation = useMutation(async (params: CreateFornecedorDto) => createFornecedor(params), {
    ...options,
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries("fornecedores"),
        queryClient.invalidateQueries("fornecedores-select"),
      ]);
    },
  });
  return (data: CreateFornecedorDto) => mutation.mutateAsync(data);
};

export { createFornecedor, useCreateFornecedor };
