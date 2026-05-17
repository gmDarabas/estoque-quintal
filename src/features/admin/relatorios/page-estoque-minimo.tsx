import { Alert } from "antd";
import DefaultPageHeader from "@/components/page-header/page-header";
import DefaultPageContainer from "@/components/page-container.tsx/page-container";
import { useListProdutos } from "../produtos/api/list";
import TabelaEstoqueMinimo from "./components/tabela-estoque-minimo";

export default function PageEstoqueMinimo() {
  const { isLoading, data: pageData, pagination } = useListProdutos({
    page: 1,
    rpp: 20,
    queryKeys: ["estoque-minimo"],
    defaultParams: { abaixo_do_minimo: true, orderBy: "quantidade_asc" },
  });

  const semItens = !isLoading && pageData?.totalCount === 0;

  return (
    <>
      <DefaultPageHeader title="Estoque Mínimo" />
      <DefaultPageContainer>
        {semItens ? (
          <Alert
            type="success"
            message="Todos os produtos estão acima do estoque mínimo."
            showIcon
          />
        ) : (
          <TabelaEstoqueMinimo
            data={pageData?.list}
            loading={isLoading}
            pagination={pagination}
          />
        )}
      </DefaultPageContainer>
    </>
  );
}
