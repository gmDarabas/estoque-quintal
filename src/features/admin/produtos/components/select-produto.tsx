import { Avatar, Flex, Select, Typography } from "antd";
import { ProdutoSelectOption, useListProdutosSelect } from "../api/list-select";
import { useMemo, useState } from "react";
import { useDebounce } from "@/lib/use-debounce";
import { ShoppingOutlined } from "@ant-design/icons";

type Props = {
  value?: string | null;
  onChange?: (value: string | null) => void;
  onSelect?: (product: ProdutoSelectOption | null) => void;
  placeholder?: string;
};

type ProdutoOption = {
  value: string;
  label: string;
  foto_url?: string | null;
};

function ProdutoImage({ option }: { option: ProdutoOption }) {
  return (
    <Flex align="center" gap={8}>
      <Avatar
        size={32}
        src={option.foto_url ?? undefined}
        icon={!option.foto_url && <ShoppingOutlined />}
        shape="square"
      />
      <Typography.Text>{option.label}</Typography.Text>
    </Flex>
  );
}

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

  const options = useMemo<ProdutoOption[]>(() => {
    return produtos.map((p) => ({
      value: p.id,
      label: `${p.nome}${p.codigo ? " - " + p.codigo : ""}`,
      foto_url: p.foto_url,
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
      optionRender={(option) => <ProdutoImage option={option.data} />}
    />
  );
}
