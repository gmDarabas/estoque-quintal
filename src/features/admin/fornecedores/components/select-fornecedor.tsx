import { Select } from "antd";
import { useMemo } from "react";
import { useListFornecedores } from "../api/list";
import { Fornecedor } from "../api/types";

type Props = {
  value?: string | null;
  onChange?: (value: string | null) => void;
  placeholder?: string;
  initialOption?: Pick<Fornecedor, "id" | "nome"> | null;
  style?: React.CSSProperties;
};

export default function SelectFornecedor({
  value,
  onChange,
  placeholder = "Selecione um fornecedor",
  initialOption,
  style,
}: Props) {
  const { data: pageData } = useListFornecedores({ page: 1, rpp: 15 });
  const fornecedores = pageData?.list ?? [];

  const options = useMemo(() => {
    const existing = fornecedores.map((f) => ({ value: f.id, label: f.nome }));
    if (initialOption && !existing.find((o) => o.value === initialOption.id)) {
      existing.unshift({ value: initialOption.id, label: initialOption.nome });
    }
    return existing;
  }, [fornecedores, initialOption]);

  return (
    <Select
      showSearch
      allowClear
      value={value}
      placeholder={placeholder}
      options={options}
      filterOption={(input, option) =>
        String(option?.label ?? "").toLowerCase().includes(input.toLowerCase())
      }
      onChange={(val) => onChange?.(val ?? null)}
      style={style}
    />
  );
}
