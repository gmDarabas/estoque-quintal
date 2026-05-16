import { Button, Image, Input, Modal, Row, Table, Tag } from "antd";
import { ColumnsType } from "antd/es/table";
import DefaultPageContainer from "../../../components/page-container.tsx/page-container";
import { PictureOutlined, PlusOutlined } from "@ant-design/icons";
import TableActions, { DeleteAction, EditAction } from "../../../components/table-actions/table-actions";
import { useNavigate } from "react-router-dom";
import { ProdutoComCategoria } from "./api/types";
import { useListProdutos } from "./api/list";
import DefaultPageHeader from "@/components/page-header/page-header";
import { useDeleteProduto } from "./api/delete";

const { Search } = Input;

export default function PageProdutos() {
  const navigate = useNavigate();
  const criar = () => navigate("/produto/cadastrar");
  const editar = (id: string) => navigate(`/produto/${id}`);

  const {
    isLoading,
    data: pageData,
    pagination,
    handleFilterChange: changePaginatorFilter,
  } = useListProdutos({ page: 1, rpp: 10 });

  const deleteProduto = useDeleteProduto();

  const onDelete = (id: string) => {
    Modal.confirm({
      content: "Tem certeza de que deseja excluir este produto?",
      cancelText: "Cancelar",
      okText: "Excluir",
      onOk: () => deleteProduto(id),
    });
  };

  const onSearch = (filter: string) => {
    changePaginatorFilter({ fetchParams: { q: filter } });
  };

  const columns: ColumnsType<ProdutoComCategoria> = [
    {
      title: "Foto",
      dataIndex: "foto_url",
      width: 64,
      render: (url: string | null) =>
        url ? (
          <Image
            src={url}
            width={48}
            height={48}
            style={{ objectFit: "cover", borderRadius: 4 }}
          />
        ) : (
          <div
            style={{
              width: 48,
              height: 48,
              background: "#f5f5f5",
              borderRadius: 4,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              border: "1px solid #e0e0e0",
            }}
          >
            <PictureOutlined style={{ color: "#bbb", fontSize: 20 }} />
          </div>
        ),
    },
    {
      title: "Nome",
      dataIndex: "nome",
      width: "30%",
    },
    {
      title: "Categoria",
      dataIndex: "categorias",
      width: "20%",
      responsive: ["md"],
      render: (categorias: ProdutoComCategoria['categorias']) => categorias?.nome ?? "—",
    },
    {
      title: "Quantidade",
      dataIndex: "quantidade_atual",
      width: "15%",
      render: (quantidade: number, row: ProdutoComCategoria) => {
        const abaixoMinimo = quantidade < row.estoque_minimo;
        return (
          <Tag color={abaixoMinimo ? "red" : "green"}>
            {quantidade} {row.unidade}
          </Tag>
        );
      },
    },
    {
      title: "Estoque Mínimo",
      dataIndex: "estoque_minimo",
      width: "15%",
      responsive: ["lg"],
      render: (minimo: number, row: ProdutoComCategoria) => `${minimo} ${row.unidade}`,
    },
    {
      title: "Ações",
      dataIndex: "action",
      render: (_value: unknown, row: ProdutoComCategoria) => (
        <TableActions>
          <EditAction onClick={() => editar(row.id)} />
          <DeleteAction onClick={() => onDelete(row.id)} />
        </TableActions>
      ),
    },
  ];

  return (
    <>
      <DefaultPageHeader
        title="Produtos"
        extra={[
          <Button key="cadastrar" type="primary" icon={<PlusOutlined />} onClick={criar}>
            Cadastrar
          </Button>,
        ]}
      />
      <DefaultPageContainer>
        <Row style={{ marginBottom: "16px" }}>
          <Search allowClear placeholder="Buscar..." style={{ width: 200 }} onSearch={onSearch} />
        </Row>
        <Table
          columns={columns}
          dataSource={pageData?.list}
          pagination={pagination}
          rowKey="id"
          loading={isLoading}
        />
      </DefaultPageContainer>
    </>
  );
}
