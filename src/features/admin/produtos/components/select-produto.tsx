import { Select } from "antd";
import { useQuery } from "react-query";
import { supabase } from "@/supabaseClient";

type ProdutoOption = { id: string; nome: string; unidade: string };

type Props = {
  value?: string | null;
  onChange?: (value: string | null) => void;
  placeholder?: string;
};

const fetchProdutos = async (): Promise<ProdutoOption[]> => {
  const { data, error } = await supabase
    .from("v_produtos")
    .select("id, nome, unidade")
    .order("nome", { ascending: true });

  if (error) throw error;
  return data ?? [];
};

export default function SelectProduto({
  value,
  onChange,
  placeholder = "Selecione um produto",
}: Props) {
  const { data: produtos = [], isLoading } = useQuery({
    queryKey: ["produtos-select"],
    queryFn: fetchProdutos,
  });

  const options = produtos.map((p) => ({
    value: p.id,
    label: `${p.nome} (${p.unidade})`,
  }));

  return (
    <Select
      showSearch
      allowClear
      loading={isLoading}
      value={value}
      placeholder={placeholder}
      options={options}
      filterOption={(input, option) =>
        (option?.label ?? "").toLowerCase().includes(input.toLowerCase())
      }
      onChange={(val) => onChange?.(val ?? null)}
    />
  );
}
