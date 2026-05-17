import DefaultPageHeader from "@/components/page-header/page-header";
import DefaultPageContainer from "@/components/page-container.tsx/page-container";
import { useListProdutos } from "../produtos/api/list";
import FiltrosProduto, { FiltrosProdutoValue } from "../produtos/components/filtros-produto";
import TabelaPosicaoEstoque from "./components/tabela-posicao-estoque";

export default function PagePosicaoEstoque() {
  const { isLoading, data: pageData, pagination, handleFilterChange } = useListProdutos({
    page: 1,
    rpp: 20,
  });

  const onChangeFiltros = ({ q, categoriaId, abaixoMinimo, orderBy }: FiltrosProdutoValue) => {
    handleFilterChange({
      fetchParams: {
        q,
        categoria_id: categoriaId,
        abaixo_do_minimo: abaixoMinimo || undefined,
        orderBy,
      },
    });
  };

  return (
    <>
      <DefaultPageHeader title="Posição de Estoque" />
      <DefaultPageContainer>
        <FiltrosProduto onChange={onChangeFiltros} />
        <TabelaPosicaoEstoque
          data={pageData?.list}
          loading={isLoading}
          pagination={pagination}
        />
      </DefaultPageContainer>
    </>
  );
}
