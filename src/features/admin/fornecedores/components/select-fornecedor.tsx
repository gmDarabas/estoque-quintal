import { Select } from "antd";
import { useMemo } from "react";
import { useListFornecedoresSelect } from "../api/list";

type Props = {
  value?: string | null;
  onChange?: (value: string | null) => void;
  placeholder?: string;
  style?: React.CSSProperties;
};

export default function SelectFornecedor({
  value,
  onChange,
  placeholder = "Selecione um fornecedor",
  style,
}: Props) {
  const { data: fornecedores = [] } = useListFornecedoresSelect();

  const options = useMemo(
    () => fornecedores.map((f) => ({ value: f.id, label: f.nome })),
    [fornecedores],
  );

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
