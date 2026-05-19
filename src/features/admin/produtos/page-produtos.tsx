import { Button } from "antd";
import DefaultPageContainer from "../../../components/page-container.tsx/page-container";
import { PlusOutlined } from "@ant-design/icons";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useListProdutos } from "./api/list";
import DefaultPageHeader from "@/components/page-header/page-header";
import { useDeleteProduto } from "./api/delete";
import { useConfirmDelete } from "@/lib/use-confirm-delete";
import ProdutoTableOrList from "./components/produto-table-or-list";
import ModalProduto from "./components/modal-produto/modal-produto";
import { ProdutoEstoque } from "./api/types";
import FiltrosProduto, { FiltrosProdutoValue } from "./components/filtros-produto";

export default function PageProdutos() {
  const navigate = useNavigate();

  const [produtoSelecionado, setProdutoSelecionado] = useState<ProdutoEstoque | null>(null);

  const {
    isLoading,
    data: pageData,
    pagination,
    handleFilterChange,
  } = useListProdutos({ page: 1, rpp: 10 });

  const deleteProduto = useDeleteProduto();
  const confirmDelete = useConfirmDelete();

  const handleDelete = (id: string, nome: string) => {
    confirmDelete({
      entidade: "produto",
      identificador: nome,
      onOk: () => deleteProduto(id),
    });
  };

  const handleFiltrosChange = ({ q, categoriaId, fornecedorId, abaixoMinimo, orderBy }: FiltrosProdutoValue) => {
    handleFilterChange({
      fetchParams: {
        q,
        categoria_id: categoriaId,
        fornecedor_id: fornecedorId,
        abaixo_do_minimo: abaixoMinimo || undefined,
        orderBy,
      },
    });
  };

  return (
    <>
      <DefaultPageHeader
        title="Produtos"
        extra={[
          <Button
            key="cadastrar"
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => navigate("/produto/cadastrar")}
          >
            Cadastrar
          </Button>,
        ]}
      />
      <DefaultPageContainer>
        <FiltrosProduto onChange={handleFiltrosChange} />

        <ProdutoTableOrList
          data={pageData?.list}
          loading={isLoading}
          pagination={pagination}
          onView={setProdutoSelecionado}
          onEdit={(id) => navigate(`/produto/${id}`)}
          onDelete={handleDelete}
        />

        <ModalProduto
          produto={produtoSelecionado}
          onClose={() => setProdutoSelecionado(null)}
          onEdit={(id) => navigate(`/produto/${id}`)}
        />
      </DefaultPageContainer>
    </>
  );
}
