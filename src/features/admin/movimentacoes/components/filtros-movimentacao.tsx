import { Badge, Button, Col, DatePicker, Row, Select } from "antd";
import { DownOutlined, FilterOutlined } from "@ant-design/icons";
import { useState } from "react";
import dayjs, { Dayjs } from "dayjs";
import { TipoMovimentacao } from "../api/types";
import { OrderByMovimentacaoOption } from "../api/list";
import SelectProduto from "@/features/admin/produtos/components/select-produto";

const TIPO_OPTIONS = [
  { value: "", label: "Todos os tipos" },
  { value: "entrada", label: "Entrada" },
  { value: "saida", label: "Saída" },
  { value: "perda", label: "Perda" },
];

const ORDER_OPTIONS = [
  { value: "data_desc", label: "Data (mais recente)" },
  { value: "data_asc", label: "Data (mais antiga)" },
  { value: "quantidade_desc", label: "Quantidade (maior)" },
  { value: "valor_desc", label: "Valor total (maior)" },
];

export type FiltrosMovimentacaoValue = {
  produtoId?: string;
  tipo?: TipoMovimentacao;
  dataDe?: string;
  dataAte?: string;
  orderBy: OrderByMovimentacaoOption;
};

type Props = {
  onChange: (filtros: FiltrosMovimentacaoValue) => void;
};

export default function FiltrosMovimentacao({ onChange }: Props) {
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [produtoId, setProdutoId] = useState<string | undefined>();
  const [tipo, setTipo] = useState<TipoMovimentacao | undefined>();
  const [dataDe, setDataDe] = useState<string | undefined>();
  const [dataAte, setDataAte] = useState<string | undefined>();
  const [orderBy, setOrderBy] =
    useState<OrderByMovimentacaoOption>("data_desc");

  const activeFiltersCount = [
    !!produtoId,
    !!tipo,
    !!(dataDe || dataAte),
    orderBy !== "data_desc",
  ].filter(Boolean).length;

  const emit = (
    p: string | undefined,
    t: TipoMovimentacao | undefined,
    de: string | undefined,
    ate: string | undefined,
    ob: OrderByMovimentacaoOption,
  ) =>
    onChange({ produtoId: p, tipo: t, dataDe: de, dataAte: ate, orderBy: ob });

  const onChangeProduto = (value: string | null) => {
    const next = value ?? undefined;
    setProdutoId(next);
    emit(next, tipo, dataDe, dataAte, orderBy);
  };

  const onChangeTipo = (value: string) => {
    const next = (value || undefined) as TipoMovimentacao | undefined;
    setTipo(next);
    emit(produtoId, next, dataDe, dataAte, orderBy);
  };

  const onChangeDataDe = (date: Dayjs | null) => {
    const next = date ? date.startOf("day").toISOString() : undefined;
    setDataDe(next);
    emit(produtoId, tipo, next, dataAte, orderBy);
  };

  const onChangeDataAte = (date: Dayjs | null) => {
    const next = date ? date.endOf("day").toISOString() : undefined;
    setDataAte(next);
    emit(produtoId, tipo, dataDe, next, orderBy);
  };

  const onChangeOrderBy = (value: OrderByMovimentacaoOption) => {
    setOrderBy(value);
    emit(produtoId, tipo, dataDe, dataAte, value);
  };

  return (
    <>
      <Row gutter={[8, 8]} style={{ marginBottom: filtersOpen ? 8 : 16 }}>
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
          <Col xs={12}>
            <SelectProduto
              value={produtoId ?? null}
              onChange={onChangeProduto}
              placeholder="Filtrar por produto"
            />
          </Col>
          <Col xs={12}>
            <Select
              style={{ width: "100%" }}
              value={tipo ?? ""}
              options={TIPO_OPTIONS}
              onChange={onChangeTipo}
            />
          </Col>
          <Col xs={12}>
            <DatePicker
              style={{ width: "100%" }}
              placeholder="De"
              value={dataDe ? dayjs(dataDe) : null}
              onChange={onChangeDataDe}
              format="DD/MM/YYYY"
            />
          </Col>
          <Col xs={12}>
            <DatePicker
              style={{ width: "100%" }}
              placeholder="Até"
              value={dataAte ? dayjs(dataAte) : null}
              onChange={onChangeDataAte}
              format="DD/MM/YYYY"
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
        </Row>
      )}
    </>
  );
}
