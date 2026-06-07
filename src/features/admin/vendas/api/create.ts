import { notification } from "antd";
import { useMutation, useQueryClient } from "react-query";
import { CreateVendaDto } from "./types";
import { supabase } from "@/supabaseClient";
import { invalidateVendaQueries } from "./invalidate";

const createVenda = async (data: CreateVendaDto): Promise<string> => {
  const { data: id, error } = await supabase.rpc("registrar_venda", {
    p_observacao: data.observacao ?? null,
    p_data: data.data ?? null,
    p_itens: data.itens,
  });

  if (error) throw new Error(error.message);
  return id as string;
};

const useCreateVenda = (options?: Record<string, unknown>) => {
  const queryClient = useQueryClient();
  const mutation = useMutation(
    async (params: CreateVendaDto) => createVenda(params),
    {
      ...options,
      onSuccess: async () => {
        await invalidateVendaQueries(queryClient);
        notification.success({ message: "Venda registrada com sucesso" });
      },
    },
  );
  return (data: CreateVendaDto) => mutation.mutateAsync(data);
};

export { createVenda, useCreateVenda };
