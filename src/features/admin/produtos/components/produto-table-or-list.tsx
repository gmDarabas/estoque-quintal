import { Grid, Image, Table, Tag } from "antd";
import type { ColumnsType, TablePaginationConfig } from "antd/es/table";
import { EyeOutlined, PictureOutlined } from "@ant-design/icons";
import { ProdutoEstoque } from "../api/types";
import TableActions, {
  CustomAction,
  DeleteAction,
  EditAction,
} from "@/components/table-actions/table-actions";
import ProdutoMobileList from "./produto-mobile-list/produto-mobile-list";
import { displayMoney } from "@/lib/utils";

const { useBreakpoint } = Grid;

interface Props {
  data: ProdutoEstoque[] | undefined;
  loading: boolean;
  pagination: TablePaginationConfig;
  onView: (produto: ProdutoEstoque) => void;
  onEdit: (id: string) => void;
  onDelete: (id: string, nome: string) => void;
}

const columns = (
  onView: (produto: ProdutoEstoque) => void,
  onEdit: (id: string) => void,
  onDelete: (id: string, nome: string) => void,
): ColumnsType<ProdutoEstoque> => [
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
  { title: "Nome", dataIndex: "nome", width: "25%" },
  {
    title: "Categoria",
    dataIndex: "categorias",
    width: "15%",
    responsive: ["md"],
    render: (categorias: ProdutoEstoque["categorias"]) =>
      categorias?.nome ?? "—",
  },
  {
    title: "Quantidade",
    dataIndex: "quantidade_atual",
    width: "12%",
    render: (quantidade: number, row: ProdutoEstoque) => (
      <Tag color={row.abaixo_do_minimo ? "red" : "green"}>
        {quantidade} {row.unidade}
      </Tag>
    ),
  },
  {
    title: "Estoque Mínimo",
    dataIndex: "estoque_minimo",
    width: "12%",
    responsive: ["lg"],
    render: (minimo: number, row: ProdutoEstoque) => `${minimo} ${row.unidade}`,
  },
  {
    title: "Custo médio",
    dataIndex: "preco_custo_medio",
    width: "12%",
    responsive: ["lg"],
    render: (value: number | null) => displayMoney(value),
  },
  {
    title: "Preço sugerido",
    width: "12%",
    responsive: ["xl"],
    render: (_: unknown, row: ProdutoEstoque) => {
      if (row.preco_custo_medio == null || row.margem == null) return "—";
      return displayMoney(row.preco_custo_medio * (1 + row.margem / 100));
    },
  },
  {
    title: "Valor em estoque",
    dataIndex: "valor_total_estoque",
    width: "12%",
    responsive: ["xl"],
    render: (value: number | null) => displayMoney(value),
  },
  {
    title: "Ações",
    dataIndex: "action",
    render: (_: unknown, row: ProdutoEstoque) => (
      <TableActions>
        <CustomAction icon={<EyeOutlined />} onClick={() => onView(row)} />
        <EditAction onClick={() => onEdit(row.id)} />
        <DeleteAction onClick={() => onDelete(row.id, row.nome)} />
      </TableActions>
    ),
  },
];

function ProdutoTableOrList({
  data,
  loading,
  pagination,
  onView,
  onEdit,
  onDelete,
}: Props) {
  const screens = useBreakpoint();

  if (screens.xs) {
    return (
      <ProdutoMobileList
        data={data ?? []}
        loading={loading}
        pagination={pagination}
        onView={onView}
        onEdit={onEdit}
        onDelete={onDelete}
      />
    );
  }

  return (
    <Table
      columns={columns(onView, onEdit, onDelete)}
      dataSource={data}
      pagination={pagination}
      rowKey="id"
      loading={loading}
    />
  );
}

export default ProdutoTableOrList;
