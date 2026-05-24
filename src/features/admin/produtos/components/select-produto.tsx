import { Select } from "antd";
import { ProdutoSelectOption, useListProdutosSelect } from "../api/list-select";
import { useMemo, useState } from "react";
import { useDebounce } from "@/lib/use-debounce";

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
  const [query, setQuery] = useState<string>();
  const { data: produtos = [], isLoading } = useListProdutosSelect(query);

  const handleSearch = useDebounce(setQuery, 400);

  const handleChange = (val: string | null) => {
    onChange?.(val ?? null);
    if (onSelect) {
      const found = val ? (produtos.find((p) => p.id === val) ?? null) : null;
      onSelect(found);
    }
  };

  const options = useMemo(() => {
    return produtos.map((p) => ({
      value: p.id,
      label: `${p.nome} ${p.codigo ? " - " + p.codigo : ""}`,
    }));
  }, [produtos]);

  return (
    <Select
      showSearch={{
        onSearch: handleSearch,
        filterOption: false,
      }}
      allowClear
      loading={isLoading}
      value={value}
      placeholder={placeholder}
      options={options}
      onChange={handleChange}
      style={{ width: "100%" }}
    />
  );
}
