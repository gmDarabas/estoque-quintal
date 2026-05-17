import { Select } from "antd";
import {
  ProdutoSelectOption,
  useListProdutosSelect,
} from "../api/list-select";

type Props = {
  value?: string | null;
  onChange?: (value: string | null) => void;
  onSelect?: (product: ProdutoSelectOption | null) => void;
  placeholder?: string;
};

export default function SelectProduto({
  value,
  onChange,
  onSelect,
  placeholder = "Selecione um produto",
}: Props) {
  const { data: produtos = [], isLoading } = useListProdutosSelect();

  const options = produtos.map((p) => ({
    value: p.id,
    label: `${p.nome} (${p.unidade})`,
  }));

  const handleChange = (val: string | null) => {
    onChange?.(val ?? null);
    if (onSelect) {
      const found = val ? (produtos.find((p) => p.id === val) ?? null) : null;
      onSelect(found);
    }
  };

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
      onChange={handleChange}
    />
  );
}
