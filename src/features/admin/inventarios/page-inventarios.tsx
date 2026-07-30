import { Button } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import DefaultPageHeader from "@/components/page-header/page-header";
import DefaultPageContainer from "@/components/page-container.tsx/page-container";
import { useConfirmDelete } from "@/lib/use-confirm-delete";
import { useListInventarios } from "./api/list";
import { useDeleteInventario } from "./api/delete";
import InventarioTableOrList from "./components/inventario-table-or-list";

export default function PageInventarios() {
  const navigate = useNavigate();

  const {
    isLoading,
    data: pageData,
    pagination,
  } = useListInventarios({ page: 1, rpp: 10 });

  const deleteInventario = useDeleteInventario();
  const confirmDelete = useConfirmDelete();

  const handleDelete = (id: string) => {
    confirmDelete({
      entidade: "inventário",
      identificador: "este inventário",
      onOk: () => deleteInventario(id),
    });
  };

  return (
    <>
      <DefaultPageHeader
        title="Inventário"
        extra={[
          <Button
            key="novo"
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => navigate("/inventario/cadastrar")}
          >
            Novo inventário
          </Button>,
        ]}
      />
      <DefaultPageContainer>
        <InventarioTableOrList
          data={pageData?.list}
          loading={isLoading}
          pagination={pagination}
          onOpen={(id) => navigate(`/inventario/${id}`)}
          onDelete={handleDelete}
        />
      </DefaultPageContainer>
    </>
  );
}
