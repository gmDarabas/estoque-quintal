import { Col, DatePicker, Row } from "antd";
import dayjs, { Dayjs } from "dayjs";
import { useState } from "react";
import SelectProduto from "@/features/admin/produtos/components/select-produto";

export type FiltrosPerdasValue = {
  produtoId?: string;
  dataDe?: string;
  dataAte?: string;
};

type Props = {
  onChange: (filtros: FiltrosPerdasValue) => void;
};

export default function FiltrosPerdas({ onChange }: Props) {
  const [produtoId, setProdutoId] = useState<string | undefined>();
  const [dataDe, setDataDe] = useState<string | undefined>();
  const [dataAte, setDataAte] = useState<string | undefined>();

  const emit = (p: string | undefined, de: string | undefined, ate: string | undefined) =>
    onChange({ produtoId: p, dataDe: de, dataAte: ate });

  const onChangeProduto = (value: string | null) => {
    const next = value ?? undefined;
    setProdutoId(next);
    emit(next, dataDe, dataAte);
  };

  const onChangeDataDe = (date: Dayjs | null) => {
    const next = date ? date.startOf("day").toISOString() : undefined;
    setDataDe(next);
    emit(produtoId, next, dataAte);
  };

  const onChangeDataAte = (date: Dayjs | null) => {
    const next = date ? date.endOf("day").toISOString() : undefined;
    setDataAte(next);
    emit(produtoId, dataDe, next);
  };

  return (
    <Row gutter={[8, 8]} style={{ marginBottom: 16 }}>
      <Col xs={24} sm={12} md={8}>
        <SelectProduto
          value={produtoId ?? null}
          onChange={onChangeProduto}
          placeholder="Filtrar por produto"
        />
      </Col>
      <Col xs={12} sm={6} md={4}>
        <DatePicker
          style={{ width: "100%" }}
          placeholder="De"
          value={dataDe ? dayjs(dataDe) : null}
          onChange={onChangeDataDe}
          format="DD/MM/YYYY"
        />
      </Col>
      <Col xs={12} sm={6} md={4}>
        <DatePicker
          style={{ width: "100%" }}
          placeholder="Até"
          value={dataAte ? dayjs(dataAte) : null}
          onChange={onChangeDataAte}
          format="DD/MM/YYYY"
        />
      </Col>
    </Row>
  );
}
