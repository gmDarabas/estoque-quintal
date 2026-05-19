import { Badge, Button, Col, Input, Row, Select, Switch, Typography } from "antd";
import { DownOutlined, FilterOutlined } from "@ant-design/icons";
import { useState } from "react";
import { OrderByOption } from "../api/list";
import SelectCategoria from "@/features/admin/categorias/components/select-categoria";
import SelectFornecedor from "@/features/admin/fornecedores/components/select-fornecedor";

const { Search } = Input;

const ORDER_OPTIONS = [
  { value: "nome_asc",        label: "Nome (A→Z)" },
  { value: "quantidade_asc",  label: "Estoque: menor primeiro" },
  { value: "quantidade_desc", label: "Estoque: maior primeiro" },
  { value: "valor_desc",      label: "Valor em estoque (maior)" },
];

export type FiltrosProdutoValue = {
  q?: string;
  categoriaId?: string;
  fornecedorId?: string;
  abaixoMinimo: boolean;
  orderBy: OrderByOption;
};

type Props = {
  onChange: (filtros: FiltrosProdutoValue) => void;
};

export default function FiltrosProduto({ onChange }: Props) {
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [q, setQ] = useState<string | undefined>();
  const [categoriaId, setCategoriaId] = useState<string | undefined>();
  const [fornecedorId, setFornecedorId] = useState<string | undefined>();
  const [abaixoMinimo, setAbaixoMinimo] = useState(false);
  const [orderBy, setOrderBy] = useState<OrderByOption>("nome_asc");

  const activeFiltersCount = [
    !!categoriaId,
    !!fornecedorId,
    abaixoMinimo,
    orderBy !== "nome_asc",
  ].filter(Boolean).length;

  const emit = (
    newQ: string | undefined,
    newCategoriaId: string | undefined,
    newFornecedorId: string | undefined,
    newAbaixoMinimo: boolean,
    newOrderBy: OrderByOption,
  ) => {
    onChange({ q: newQ, categoriaId: newCategoriaId, fornecedorId: newFornecedorId, abaixoMinimo: newAbaixoMinimo, orderBy: newOrderBy });
  };

  const onSearch = (value: string) => {
    const next = value || undefined;
    setQ(next);
    emit(next, categoriaId, fornecedorId, abaixoMinimo, orderBy);
  };

  const onChangeCategoria = (value: string | null) => {
    const next = value ?? undefined;
    setCategoriaId(next);
    emit(q, next, fornecedorId, abaixoMinimo, orderBy);
  };

  const onChangeFornecedor = (value: string | null) => {
    const next = value ?? undefined;
    setFornecedorId(next);
    emit(q, categoriaId, next, abaixoMinimo, orderBy);
  };

  const onChangeAbaixoMinimo = (checked: boolean) => {
    setAbaixoMinimo(checked);
    emit(q, categoriaId, fornecedorId, checked, orderBy);
  };

  const onChangeOrderBy = (value: OrderByOption) => {
    setOrderBy(value);
    emit(q, categoriaId, fornecedorId, abaixoMinimo, value);
  };

  return (
    <>
      <Row gutter={[8, 8]} style={{ marginBottom: filtersOpen ? 8 : 16 }}>
        <Col flex={1}>
          <Search
            allowClear
            placeholder="Buscar por nome ou descrição..."
            onSearch={onSearch}
          />
        </Col>
        <Col>
          <Badge count={activeFiltersCount} size="small">
            <Button
              icon={<FilterOutlined />}
              onClick={() => setFiltersOpen((v) => !v)}
            >
              Filtros
              <DownOutlined
                style={{
                  fontSize: 10,
                  transition: "transform 0.2s",
                  transform: filtersOpen ? "rotate(180deg)" : "rotate(0deg)",
                }}
              />
            </Button>
          </Badge>
        </Col>
      </Row>

      {filtersOpen && (
        <Row gutter={[8, 8]} style={{ marginBottom: 16 }}>
          <Col xs={24} sm={12}>
            <SelectCategoria
              allowCreate={false}
              value={categoriaId ?? null}
              onChange={onChangeCategoria}
              placeholder="Filtrar por categoria"
              style={{ width: "100%" }}
            />
          </Col>
          <Col xs={24} sm={12}>
            <SelectFornecedor
              value={fornecedorId ?? null}
              onChange={onChangeFornecedor}
              placeholder="Filtrar por fornecedor"
              style={{ width: "100%" }}
            />
          </Col>
          <Col xs={24} sm={12}>
            <Select
              style={{ width: "100%" }}
              value={orderBy}
              options={ORDER_OPTIONS}
              onChange={onChangeOrderBy}
            />
          </Col>
          <Col xs={24}>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <Switch
                size="small"
                checked={abaixoMinimo}
                onChange={onChangeAbaixoMinimo}
              />
              <Typography.Text>Apenas abaixo do mínimo</Typography.Text>
            </div>
          </Col>
        </Row>
      )}
    </>
  );
}
