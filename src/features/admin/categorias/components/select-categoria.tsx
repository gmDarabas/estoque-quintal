import { useMemo, useState } from "react";
import { Select, notification } from "antd";
import { useListCategorias } from "../api/list";
import { useCreateCategoria } from "../api/create";

type Props = {
  value?: string | null;
  onChange?: (value: string | null) => void;
  placeholder?: string;
  allowCreate?: boolean;
  style?: React.CSSProperties;
};

export default function SelectCategoria({
  value,
  onChange,
  placeholder = "Selecione ou crie uma categoria",
  allowCreate = true,
  style,
}: Props) {
  const [search, setSearch] = useState("");

  const { data: pageData } = useListCategorias({ page: 1, rpp: 15 });
  const categorias = pageData?.list ?? [];
  const createCategoria = useCreateCategoria();

  const options = useMemo(() => {
    const existing = categorias.map((c) => ({ value: c.id, label: c.nome }));
    const hasExactMatch = categorias.some(
      (c) => c.nome.toLowerCase() === search.toLowerCase()
    );
    if (search && !hasExactMatch && allowCreate) {
      existing.push({ value: `__novo__:${search}`, label: `Criar "${search}"` });
    }
    return existing;
  }, [categorias, search]);

  const handleChange = async (selected: string | null) => {
    if (!selected) {
      onChange?.(null);
      return;
    }

    if (selected.startsWith("__novo__:")) {
      const nome = selected.replace("__novo__:", "");
      try {
        const novaCategoria = await createCategoria({ nome });
        onChange?.(novaCategoria.id);
        setSearch("");
      } catch {
        notification.error({ message: "Erro ao criar categoria" });
      }
      return;
    }

    onChange?.(selected);
  };

  return (
    <Select
      showSearch
      allowClear
      value={value}
      placeholder={placeholder}
      options={options}
      filterOption={false}
      onSearch={setSearch}
      onChange={handleChange}
      onBlur={() => setSearch("")}
      style={style}
    />
  );
}
