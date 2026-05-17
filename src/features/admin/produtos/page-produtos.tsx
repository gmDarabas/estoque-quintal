import { Button, Input, Row } from "antd";
import DefaultPageContainer from "../../../components/page-container.tsx/page-container";
import { PlusOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { useListProdutos } from "./api/list";
import DefaultPageHeader from "@/components/page-header/page-header";
import { useDeleteProduto } from "./api/delete";
import { useConfirmDelete } from "@/lib/use-confirm-delete";
import ProdutoTableOrList from "./components/produto-table-or-list";

const { Search } = Input;

export default function PageProdutos() {
  const navigate = useNavigate();

  const {
    isLoading,
    data: pageData,
    pagination,
    handleFilterChange: changePaginatorFilter,
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

  const onSearch = (filter: string) => {
    changePaginatorFilter({ fetchParams: { q: filter } });
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
        <Row style={{ marginBottom: "16px" }}>
          <Search
            allowClear
            placeholder="Buscar..."
            style={{ width: 200 }}
            onSearch={onSearch}
          />
        </Row>
        <ProdutoTableOrList
          data={pageData?.list}
          loading={isLoading}
          pagination={pagination}
          onEdit={(id) => navigate(`/produto/${id}`)}
          onDelete={handleDelete}
        />
      </DefaultPageContainer>
    </>
  );
}
