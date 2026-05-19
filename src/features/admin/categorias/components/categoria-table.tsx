import { Table } from "antd";
import type { ColumnsType, TablePaginationConfig } from "antd/es/table";
import TableActions, {
  DeleteAction,
  EditAction,
} from "@/components/table-actions/table-actions";
import { Categoria } from "../api/types";

interface Props {
  data: Categoria[] | undefined;
  loading: boolean;
  pagination: TablePaginationConfig;
  onEdit: (id: string) => void;
  onDelete: (id: string, nome: string) => void;
}

const columns = (
  onEdit: (id: string) => void,
  onDelete: (id: string, nome: string) => void,
): ColumnsType<Categoria> => [
  { title: "Nome", dataIndex: "nome" },
  {
    title: "Ações",
    dataIndex: "action",
    render: (_: unknown, row: Categoria) => (
      <TableActions>
        <EditAction onClick={() => onEdit(row.id)} />
        <DeleteAction onClick={() => onDelete(row.id, row.nome)} />
      </TableActions>
    ),
  },
];

export default function CategoriaTable({
  data,
  loading,
  pagination,
  onEdit,
  onDelete,
}: Props) {
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
