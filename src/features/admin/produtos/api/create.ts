import { notification } from "antd";
import { useMutation, useQueryClient } from "react-query";
import { CreateProdutoDto, Produto } from "./types";
import { supabase } from "@/supabaseClient";

const createProduto = async (data: CreateProdutoDto): Promise<Produto> => {
  const { data: inserted, error } = await supabase
    .from("produtos")
    .insert(data)
    .select()
    .single();

  if (error) throw new Error(error.message);
  return inserted;
};

const useCreateProduto = (options?: Record<string, unknown>) => {
  const queryClient = useQueryClient();
  const mutation = useMutation(async (params: CreateProdutoDto) => createProduto(params), {
    ...options,
    onSuccess: async () => {
      await queryClient.invalidateQueries("produtos");
      notification.success({ message: "Produto cadastrado com sucesso" });
    },
  });
  return (data: CreateProdutoDto) => mutation.mutateAsync(data);
};

export { createProduto, useCreateProduto };
