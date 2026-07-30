import { notification } from "antd";
import { useMutation, useQueryClient } from "react-query";
import { AbrirInventarioDto } from "./types";
import { supabase } from "@/supabaseClient";

const abrirInventario = async (data: AbrirInventarioDto): Promise<string> => {
  const { data: id, error } = await supabase.rpc("abrir_inventario", {
    p_descricao: data.descricao ?? null,
    p_categoria_ids: data.categoria_ids?.length ? data.categoria_ids : null,
    p_fornecedor_ids: data.fornecedor_ids?.length ? data.fornecedor_ids : null,
  });

  if (error) throw new Error(error.message);
  return id as string;
};

const useAbrirInventario = (options?: Record<string, unknown>) => {
  const queryClient = useQueryClient();
  const mutation = useMutation(
    async (params: AbrirInventarioDto) => abrirInventario(params),
    {
      ...options,
      onSuccess: async () => {
        await queryClient.invalidateQueries("inventarios");
        notification.success({ message: "Inventário aberto com sucesso" });
      },
    },
  );
  return (data: AbrirInventarioDto) => mutation.mutateAsync(data);
};

export { abrirInventario, useAbrirInventario };
