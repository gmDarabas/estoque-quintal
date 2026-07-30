import { useMutation } from "react-query";
import { supabase } from "@/supabaseClient";

export type UpdateInventarioItemDto = {
  id: string;
  qtd_contada: number | null;
  observacao?: string | null;
};

const updateInventarioItem = async ({
  id,
  qtd_contada,
  observacao,
}: UpdateInventarioItemDto): Promise<boolean> => {
  const { error } = await supabase
    .from("inventario_itens")
    .update({
      qtd_contada,
      contado_em: qtd_contada != null ? new Date().toISOString() : null,
      ...(observacao !== undefined ? { observacao } : {}),
    })
    .eq("id", id);

  if (error) throw new Error(error.message);
  return true;
};

// Sem invalidação de query: a tela de contagem mantém o estado local dos inputs
// como fonte da verdade; o refetch acontece só ao fechar o inventário.
const useUpdateInventarioItem = () => {
  const mutation = useMutation(async (dto: UpdateInventarioItemDto) =>
    updateInventarioItem(dto),
  );
  return (dto: UpdateInventarioItemDto) => mutation.mutateAsync(dto);
};

export { updateInventarioItem, useUpdateInventarioItem };
