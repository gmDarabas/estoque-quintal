import { Button } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import DefaultPageHeader from "@/components/page-header/page-header";
import DefaultPageContainer from "@/components/page-container.tsx/page-container";
import { useConfirmDelete } from "@/lib/use-confirm-delete";
import { useListFornecedores } from "./api/list";
import { useDeleteFornecedor } from "./api/delete";
import FornecedorTableOrList from "./components/fornecedor-table-or-list";

export default function PageFornecedores() {
  const navigate = useNavigate();
  const { isLoading, data: pageData, pagination } = useListFornecedores({ page: 1, rpp: 15 });
  const deleteFornecedor = useDeleteFornecedor();
  const confirmDelete = useConfirmDelete();

  const handleDelete = (id: string, nome: string) => {
    confirmDelete({
      entidade: "fornecedor",
      identificador: nome,
      onOk: () => deleteFornecedor(id),
    });
  };

  return (
    <>
      <DefaultPageHeader
        title="Fornecedores"
        extra={[
          <Button
            key="cadastrar"
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => navigate("/fornecedor/cadastrar")}
          >
            Cadastrar
          </Button>,
        ]}
      />
      <DefaultPageContainer>
        <FornecedorTableOrList
          data={pageData?.list}
          loading={isLoading}
          pagination={pagination}
          onEdit={(id) => navigate(`/fornecedor/${id}`)}
          onDelete={handleDelete}
        />
      </DefaultPageContainer>
    </>
  );
}
