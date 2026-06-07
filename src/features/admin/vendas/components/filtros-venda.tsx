import { Badge, Button, Col, DatePicker, Row, Select } from "antd";
import { DownOutlined, FilterOutlined } from "@ant-design/icons";
import { useState } from "react";
import dayjs, { Dayjs } from "dayjs";
import { OrderByVendaOption } from "../api/list";

const ORDER_OPTIONS = [
  { value: "data_desc", label: "Data (mais recente)" },
  { value: "data_asc", label: "Data (mais antiga)" },
  { value: "total_desc", label: "Total (maior)" },
];

export type FiltrosVendaValue = {
  dataDe?: string;
  dataAte?: string;
  orderBy: OrderByVendaOption;
};

type Props = {
  onChange: (filtros: FiltrosVendaValue) => void;
};

export default function FiltrosVenda({ onChange }: Props) {
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [dataDe, setDataDe] = useState<string | undefined>();
  const [dataAte, setDataAte] = useState<string | undefined>();
  const [orderBy, setOrderBy] = useState<OrderByVendaOption>("data_desc");

  const activeFiltersCount = [
    !!(dataDe || dataAte),
    orderBy !== "data_desc",
  ].filter(Boolean).length;

  const emit = (
    de: string | undefined,
    ate: string | undefined,
    ob: OrderByVendaOption,
  ) => onChange({ dataDe: de, dataAte: ate, orderBy: ob });

  const onChangeDataDe = (date: Dayjs | null) => {
    const next = date ? date.startOf("day").toISOString() : undefined;
    setDataDe(next);
    emit(next, dataAte, orderBy);
  };

  const onChangeDataAte = (date: Dayjs | null) => {
    const next = date ? date.endOf("day").toISOString() : undefined;
    setDataAte(next);
    emit(dataDe, next, orderBy);
  };

  const onChangeOrderBy = (value: OrderByVendaOption) => {
    setOrderBy(value);
    emit(dataDe, dataAte, value);
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
