import { useState } from "react";
import { Card, Col, Row, Statistic } from "antd";
import DefaultPageHeader from "@/components/page-header/page-header";
import DefaultPageContainer from "@/components/page-container.tsx/page-container";
import { useListPerdas, usePerdasTotais } from "./api/perdas";
import FiltrosPerdas, { FiltrosPerdasValue } from "./components/filtros-perdas";
import TabelaPerdas from "./components/tabela-perdas";
import { displayMoney } from "@/lib/utils";

export default function PagePerdas() {
  const [filtros, setFiltros] = useState<{
    produto_id?: string;
    data_de?: string;
    data_ate?: string;
  }>({});

  const { isLoading, data: pageData, pagination, handleFilterChange } = useListPerdas({
    page: 1,
    rpp: 15,
  });

  const { data: totais } = usePerdasTotais(filtros);

  const onChangeFiltros = ({ produtoId, dataDe, dataAte }: FiltrosPerdasValue) => {
    const params = { produto_id: produtoId, data_de: dataDe, data_ate: dataAte };
    setFiltros(params);
    handleFilterChange({ fetchParams: params });
  };

  return (
    <>
      <DefaultPageHeader title="Registro de Perdas" />
      <DefaultPageContainer>
        <FiltrosPerdas onChange={onChangeFiltros} />

        {totais && (
          <Row gutter={16} style={{ marginBottom: 16 }}>
            <Col xs={12} sm={8}>
              <Card size="small">
                <Statistic
                  title="Registros no período"
                  value={pageData?.totalCount ?? 0}
                />
              </Card>
            </Col>
            <Col xs={12} sm={8}>
              <Card size="small">
                <Statistic
                  title="Quantidade total perdida"
                  value={totais.totalQuantidade}
                />
              </Card>
            </Col>
            <Col xs={24} sm={8}>
              <Card size="small">
                <Statistic
                  title="Valor total perdido (custo)"
                  value={displayMoney(totais.totalValor)}
                  valueStyle={{ color: "#cf1322" }}
                />
              </Card>
            </Col>
          </Row>
        )}

        <TabelaPerdas
          data={pageData?.list}
          loading={isLoading}
          pagination={pagination}
        />
      </DefaultPageContainer>
    </>
  );
}
