import { Col, Row, Typography, theme } from "antd";
import {
  AppstoreOutlined,
  DollarOutlined,
  FallOutlined,
  RiseOutlined,
  ShoppingOutlined,
  WarningOutlined,
} from "@ant-design/icons";
import { useState } from "react";
import dayjs from "dayjs";
import { useNavigate } from "react-router-dom";
import {
  useDashboardKpis,
  useEstoquePorCategoria,
  usePeriodKpis,
} from "../relatorios/api/dashboard";
import { displayMoney } from "@/lib/utils";
import EstoquePorCategoriaCard from "../relatorios/components/estoque-por-categoria";
import KpiCard from "./components/kpi-card";
import PeriodSelector from "./components/period-selector";
import DefaultPageHeader from "@/components/page-header/page-header";

function SectionHeader({ label }: { label: string }) {
  const { token } = theme.useToken();
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 8,
        margin: "24px 0 12px",
      }}
    >
      <div
        style={{
          width: 3,
          height: 14,
          borderRadius: 2,
          background: token.colorPrimary,
          flexShrink: 0,
        }}
      />
      <Typography.Text
        style={{
          fontSize: 11,
          fontWeight: 600,
          textTransform: "uppercase",
          letterSpacing: "0.08em",
          color: token.colorTextSecondary,
        }}
      >
        {label}
      </Typography.Text>
    </div>
  );
}

export default function HomePage() {
  const navigate = useNavigate();
  const [dataDe, setDataDe] = useState(() =>
    dayjs().startOf("month").toISOString(),
  );
  const [dataAte, setDataAte] = useState(() =>
    dayjs().endOf("month").toISOString(),
  );

  const { data: kpis, isLoading } = useDashboardKpis();
  const { data: porCategoria, isLoading: loadingCategoria } =
    useEstoquePorCategoria();
  const { data: periodKpis, isLoading: loadingPeriod } = usePeriodKpis(
    dataDe,
    dataAte,
  );

  return (
    <>
      <DefaultPageHeader
        title="Dashboard"
        extra={[
          <PeriodSelector
            onChange={(de, ate) => {
              setDataDe(de);
              setDataAte(ate);
            }}
          />,
        ]}
      />

      <SectionHeader label="Posição do estoque" />

      <Row gutter={[16, 16]}>
        <Col xs={24} sm={8}>
          <KpiCard
            title="Valor em Estoque"
            value={displayMoney(kpis?.valorTotalEstoque) || "—"}
            icon={<ShoppingOutlined />}
            color="#389e0d"
            loading={isLoading}
          />
        </Col>
        <Col xs={24} sm={8}>
          <KpiCard
            title="Total de Produtos"
            value={kpis?.totalProdutos ?? "—"}
            icon={<AppstoreOutlined />}
            loading={isLoading}
          />
        </Col>
        <Col xs={24} sm={8}>
          <KpiCard
            title="Abaixo do Mínimo"
            value={kpis?.produtosAbaixoMinimo ?? "—"}
            icon={<WarningOutlined />}
            color={kpis?.produtosAbaixoMinimo ? "#d46b08" : undefined}
            onClick={() => navigate("/estoque-minimo")}
            loading={isLoading}
          />
        </Col>
      </Row>

      <SectionHeader label="Movimentação do período" />

      <Row gutter={[16, 16]}>
        <Col xs={24} sm={8}>
          <KpiCard
            title="Entradas (custo)"
            value={displayMoney(periodKpis?.valorEntradas) || "—"}
            icon={<RiseOutlined />}
            color="#1677ff"
            loading={loadingPeriod}
          />
        </Col>
        <Col xs={24} sm={8}>
          <KpiCard
            title="Saídas (venda)"
            value={displayMoney(periodKpis?.valorSaidas) || "—"}
            icon={<DollarOutlined />}
            color="#389e0d"
            loading={loadingPeriod}
          />
        </Col>
        <Col xs={24} sm={8}>
          <KpiCard
            title="Perdas (custo)"
            value={displayMoney(periodKpis?.valorPerdas) || "—"}
            icon={<FallOutlined />}
            color={periodKpis?.valorPerdas ? "#cf1322" : undefined}
            loading={loadingPeriod}
          />
        </Col>
      </Row>

      <EstoquePorCategoriaCard data={porCategoria} loading={loadingCategoria} />
    </>
  );
}
