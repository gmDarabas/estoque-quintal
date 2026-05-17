import { Button } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import DefaultPageHeader from "@/components/page-header/page-header";
import DefaultPageContainer from "@/components/page-container.tsx/page-container";
import { useListMovimentacoes } from "./api/list";
import { useDeleteMovimentacao } from "./api/delete";
import { useConfirmDelete } from "@/lib/use-confirm-delete";
import MovimentacaoTableOrList from "./components/movimentacao-table-or-list";
import FiltrosMovimentacao, { FiltrosMovimentacaoValue } from "./components/filtros-movimentacao";

export default function PageMovimentacoes() {
  const navigate = useNavigate();

  const {
    isLoading,
    data: pageData,
    pagination,
    handleFilterChange,
  } = useListMovimentacoes({ page: 1, rpp: 10 });

  const deleteMovimentacao = useDeleteMovimentacao();
  const confirmDelete = useConfirmDelete();

  const handleDelete = (id: string) => {
    confirmDelete({
      entidade: "movimentação",
      identificador: "este registro",
      onOk: () => deleteMovimentacao(id),
    });
  };

  const onChangeFiltros = (filtros: FiltrosMovimentacaoValue) => {
    handleFilterChange({
      fetchParams: {
        tipo: filtros.tipo,
        produto_id: filtros.produtoId,
        data_de: filtros.dataDe,
        data_ate: filtros.dataAte,
        orderBy: filtros.orderBy,
      },
    });
  };

  return (
    <>
      <DefaultPageHeader
        title="Movimentações"
        extra={[
          <Button
            key="registrar"
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => navigate("/movimentacao/cadastrar")}
          >
            Registrar
          </Button>,
        ]}
      />
      <DefaultPageContainer>
        <FiltrosMovimentacao onChange={onChangeFiltros} />

        <MovimentacaoTableOrList
          data={pageData?.list}
          loading={isLoading}
          pagination={pagination}
          onDelete={handleDelete}
        />
      </DefaultPageContainer>
    </>
  );
}
