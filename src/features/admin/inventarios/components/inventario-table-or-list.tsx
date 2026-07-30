import { Grid, Table, Tag } from "antd";
import type { ColumnsType, TablePaginationConfig } from "antd/es/table";
import { Inventario } from "../api/types";
import { STATUS_COLOR, STATUS_LABEL } from "./status";
import TableActions, {
  DeleteAction,
  EditAction,
} from "@/components/table-actions/table-actions";
import InventarioMobileList from "./inventario-mobile-list";

const { useBreakpoint } = Grid;

interface Props {
  data: Inventario[] | undefined;
  loading: boolean;
  pagination: TablePaginationConfig;
  onOpen: (id: string) => void;
  onDelete: (id: string) => void;
}

const formatDateTime = (date?: string | null) =>
  date ? new Date(date).toLocaleString("pt-BR") : "—";

const columns = (
  onOpen: (id: string) => void,
  onDelete: (id: string) => void,
): ColumnsType<Inventario> => [
  {
    title: "Descrição",
    dataIndex: "descricao",
    render: (descricao: string | null) => descricao || "Inventário",
  },
  {
    title: "Status",
    dataIndex: "status",
    width: 120,
    render: (status: Inventario["status"]) => (
      <Tag color={STATUS_COLOR[status]}>{STATUS_LABEL[status]}</Tag>
    ),
  },
  {
    title: "Iniciado em",
    dataIndex: "iniciado_em",
    width: 180,
    responsive: ["md"],
    render: formatDateTime,
  },
  {
    title: "Fechado em",
    dataIndex: "fechado_em",
    width: 180,
    responsive: ["lg"],
    render: formatDateTime,
  },
  {
    title: "Ações",
    dataIndex: "action",
    width: 100,
    render: (_: unknown, row: Inventario) => (
      <TableActions>
        <EditAction onClick={() => onOpen(row.id)} />
        <DeleteAction onClick={() => onDelete(row.id)} />
      </TableActions>
    ),
  },
];

function InventarioTableOrList({
  data,
  loading,
  pagination,
  onOpen,
  onDelete,
}: Props) {
  const screens = useBreakpoint();

  if (screens.xs) {
    return (
      <InventarioMobileList
        data={data ?? []}
        loading={loading}
        pagination={pagination}
        onOpen={onOpen}
        onDelete={onDelete}
      />
    );
  }

  return (
    <Table
      columns={columns(onOpen, onDelete)}
      dataSource={data}
      pagination={pagination}
      rowKey="id"
      loading={loading}
    />
  );
}

export default InventarioTableOrList;
