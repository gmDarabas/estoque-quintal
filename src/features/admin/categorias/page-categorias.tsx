import { Button } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import DefaultPageHeader from "@/components/page-header/page-header";
import DefaultPageContainer from "@/components/page-container.tsx/page-container";
import { useConfirmDelete } from "@/lib/use-confirm-delete";
import { useListCategorias } from "./api/list";
import { useDeleteCategoria } from "./api/delete";
import CategoriaTableOrList from "./components/categoria-table";

export default function PageCategorias() {
  const navigate = useNavigate();
  const {
    isLoading,
    data: pageData,
    pagination,
  } = useListCategorias({ page: 1, rpp: 15 });
  const deleteCategoria = useDeleteCategoria();
  const confirmDelete = useConfirmDelete();

  const handleDelete = (id: string, nome: string) => {
    confirmDelete({
      entidade: "categoria",
      identificador: nome,
      onOk: () => deleteCategoria(id),
    });
  };

  return (
    <>
      <DefaultPageHeader
        title="Categorias"
        extra={[
          <Button
            key="cadastrar"
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => navigate("/categoria/cadastrar")}
          >
            Cadastrar
          </Button>,
        ]}
      />
      <DefaultPageContainer>
        <CategoriaTableOrList
          data={pageData?.list}
          loading={isLoading}
          pagination={pagination}
          onEdit={(id) => navigate(`/categoria/${id}`)}
          onDelete={handleDelete}
        />
      </DefaultPageContainer>
    </>
  );
}
