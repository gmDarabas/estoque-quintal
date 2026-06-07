import { useState } from "react";
import { Button, Col, Row } from "antd";
import {
  DollarOutlined,
  PlusOutlined,
  ShoppingCartOutlined,
  TagOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import DefaultPageHeader from "@/components/page-header/page-header";
import DefaultPageContainer from "@/components/page-container.tsx/page-container";
import { useListVendas, useVendasResumo } from "./api/list";
import { useDeleteVenda } from "./api/delete";
import { useConfirmDelete } from "@/lib/use-confirm-delete";
import { displayMoney } from "@/lib/utils";
import KpiCard from "../home/components/kpi-card";
import VendaTableOrList from "./components/venda-table-or-list";
import ComprovanteVenda from "./components/comprovante-venda";
import FiltrosVenda, { FiltrosVendaValue } from "./components/filtros-venda";

export default function PageVendas() {
  const navigate = useNavigate();

  const [periodo, setPeriodo] = useState<{
    dataDe?: string;
    dataAte?: string;
  }>({});
  const [comprovanteId, setComprovanteId] = useState<string | null>(null);

  const {
    isLoading,
    data: pageData,
    pagination,
    handleFilterChange,
  } = useListVendas({ page: 1, rpp: 10 });

  const { data: resumo, isLoading: loadingResumo } = useVendasResumo({
    data_de: periodo.dataDe,
    data_ate: periodo.dataAte,
  });

  const deleteVenda = useDeleteVenda();
  const confirmDelete = useConfirmDelete();

  const handleDelete = (id: string) => {
    confirmDelete({
      entidade: "venda",
      identificador: "esta venda",
      onOk: () => deleteVenda(id),
    });
  };

  const onChangeFiltros = (filtros: FiltrosVendaValue) => {
    setPeriodo({ dataDe: filtros.dataDe, dataAte: filtros.dataAte });
    handleFilterChange({
      fetchParams: {
        data_de: filtros.dataDe,
        data_ate: filtros.dataAte,
        orderBy: filtros.orderBy,
      },
    });
  };

  return (
    <>
      <DefaultPageHeader
        title="Vendas"
        extra={[
          <Button
            key="registrar"
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => navigate("/venda/cadastrar")}
          >
            Registrar venda
          </Button>,
        ]}
      />
      <DefaultPageContainer>
        <Row gutter={[16, 16]} style={{ marginBottom: 16 }}>
          <Col xs={24} sm={8}>
            <KpiCard
              title="Total vendido"
              value={displayMoney(resumo?.total) || "R$ 0,00"}
              icon={<DollarOutlined />}
              color="#389e0d"
              loading={loadingResumo}
            />
          </Col>
          <Col xs={24} sm={8}>
            <KpiCard
              title="Vendas"
              value={resumo?.quantidade ?? "—"}
              icon={<ShoppingCartOutlined />}
              loading={loadingResumo}
            />
          </Col>
          <Col xs={24} sm={8}>
            <KpiCard
              title="Ticket médio"
              value={displayMoney(resumo?.ticketMedio) || "R$ 0,00"}
              icon={<TagOutlined />}
              color="#1677ff"
              loading={loadingResumo}
            />
          </Col>
        </Row>

        <FiltrosVenda onChange={onChangeFiltros} />

        <VendaTableOrList
          data={pageData?.list}
          loading={isLoading}
          pagination={pagination}
          onDelete={handleDelete}
          onVerComprovante={setComprovanteId}
        />
      </DefaultPageContainer>

      <ComprovanteVenda
        vendaId={comprovanteId}
        open={!!comprovanteId}
        onClose={() => setComprovanteId(null)}
      />
    </>
  );
}
