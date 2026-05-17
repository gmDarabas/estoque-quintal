import { Grid, Image, Table, Tag } from "antd";
import type { ColumnsType, TablePaginationConfig } from "antd/es/table";
import { PictureOutlined } from "@ant-design/icons";
import { ProdutoComCategoria } from "../api/types";
import TableActions, { DeleteAction, EditAction } from "@/components/table-actions/table-actions";
import ProdutoMobileList from "./produto-mobile-list";

const { useBreakpoint } = Grid;

interface Props {
  data: ProdutoComCategoria[] | undefined;
  loading: boolean;
  pagination: TablePaginationConfig;
  onEdit: (id: string) => void;
  onDelete: (id: string, nome: string) => void;
}

const columns = (
  onEdit: (id: string) => void,
  onDelete: (id: string, nome: string) => void,
): ColumnsType<ProdutoComCategoria> => [
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
  { title: "Nome", dataIndex: "nome", width: "30%" },
  {
    title: "Categoria",
    dataIndex: "categorias",
    width: "20%",
    responsive: ["md"],
    render: (categorias: ProdutoComCategoria["categorias"]) =>
      categorias?.nome ?? "—",
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
    render: (minimo: number, row: ProdutoComCategoria) =>
      `${minimo} ${row.unidade}`,
  },
  {
    title: "Ações",
    dataIndex: "action",
    render: (_: unknown, row: ProdutoComCategoria) => (
      <TableActions>
        <EditAction onClick={() => onEdit(row.id)} />
        <DeleteAction onClick={() => onDelete(row.id, row.nome)} />
      </TableActions>
    ),
  },
];

function ProdutoTableOrList({ data, loading, pagination, onEdit, onDelete }: Props) {
  const screens = useBreakpoint();

  if (screens.xs) {
    return (
      <ProdutoMobileList
        data={data ?? []}
        loading={loading}
        pagination={pagination}
        onEdit={onEdit}
        onDelete={onDelete}
      />
    );
  }

  return (
    <Table
      columns={columns(onEdit, onDelete)}
      dataSource={data}
      pagination={pagination}
      rowKey="id"
      loading={loading}
    />
  );
}

export default ProdutoTableOrList;
