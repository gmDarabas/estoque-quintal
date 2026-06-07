import { Grid, Table } from "antd";
import { FileTextOutlined } from "@ant-design/icons";
import type { ColumnsType, TablePaginationConfig } from "antd/es/table";
import { VendaListItem } from "../api/types";
import TableActions, {
  CustomAction,
  DeleteAction,
} from "@/components/table-actions/table-actions";
import VendaMobileList from "./venda-mobile-list";
import { displayMoney } from "@/lib/utils";

const { useBreakpoint } = Grid;

export const contarItens = (venda: VendaListItem) =>
  venda.itens?.[0]?.count ?? 0;

interface Props {
  data: VendaListItem[] | undefined;
  loading: boolean;
  pagination: TablePaginationConfig;
  onDelete: (id: string) => void;
  onVerComprovante: (id: string) => void;
}

const columns = (
  onDelete: (id: string) => void,
  onVerComprovante: (id: string) => void,
): ColumnsType<VendaListItem> => [
  {
    title: "Data",
    dataIndex: "data_operacao",
    width: 170,
    render: (date: string) => new Date(date).toLocaleString("pt-BR"),
  },
  {
    title: "Itens",
    width: 90,
    render: (_: unknown, row) => contarItens(row),
  },
  {
    title: "Total",
    dataIndex: "total",
    width: 140,
    render: (total: number) => displayMoney(total) || "—",
  },
  {
    title: "Observação",
    dataIndex: "observacao",
    responsive: ["lg"],
    render: (obs: string | null) => obs ?? "—",
  },
  {
    title: "Ações",
    dataIndex: "action",
    width: 110,
    render: (_: unknown, row) => (
      <TableActions>
        <CustomAction
          icon={<FileTextOutlined />}
          onClick={(e) => {
            e.stopPropagation();
            onVerComprovante(row.id);
          }}
        />
        <DeleteAction
          onClick={(e) => {
            e.stopPropagation();
            onDelete(row.id);
          }}
        />
      </TableActions>
    ),
  },
];

function VendaTableOrList({
  data,
  loading,
  pagination,
  onDelete,
  onVerComprovante,
}: Props) {
  const screens = useBreakpoint();

  if (screens.xs) {
    return (
      <VendaMobileList
        data={data ?? []}
        loading={loading}
        pagination={pagination}
        onDelete={onDelete}
        onVerComprovante={onVerComprovante}
      />
    );
  }

  return (
    <Table
      columns={columns(onDelete, onVerComprovante)}
      dataSource={data}
      pagination={pagination}
      rowKey="id"
      loading={loading}
      onRow={(row) => ({
        onClick: () => onVerComprovante(row.id),
        style: { cursor: "pointer" },
      })}
    />
  );
}

export default VendaTableOrList;
