import { Grid, Table } from "antd";
import type { ColumnsType, TablePaginationConfig } from "antd/es/table";
import TableActions, { DeleteAction, EditAction } from "@/components/table-actions/table-actions";
import { displayCpfCnpj } from "@/lib/utils";
import { Fornecedor } from "../api/types";
import FornecedorMobileList from "./fornecedor-mobile-list";

const { useBreakpoint } = Grid;

interface Props {
  data: Fornecedor[] | undefined;
  loading: boolean;
  pagination: TablePaginationConfig;
  onEdit: (id: string) => void;
  onDelete: (id: string, nome: string) => void;
}

const columns = (
  onEdit: (id: string) => void,
  onDelete: (id: string, nome: string) => void,
): ColumnsType<Fornecedor> => [
  { title: "Nome", dataIndex: "nome" },
  {
    title: "CPF / CNPJ",
    dataIndex: "cnpj",
    responsive: ["md"],
    render: (v: string | null) => displayCpfCnpj(v),
  },
  {
    title: "Telefone",
    dataIndex: "telefone",
    responsive: ["md"],
    render: (v: string | null) => v ?? "—",
  },
  {
    title: "E-mail",
    dataIndex: "email",
    responsive: ["lg"],
    render: (v: string | null) => v ?? "—",
  },
  {
    title: "Contato",
    dataIndex: "contato",
    responsive: ["lg"],
    render: (v: string | null) => v ?? "—",
  },
  {
    title: "Ações",
    dataIndex: "action",
    render: (_: unknown, row: Fornecedor) => (
      <TableActions>
        <EditAction onClick={() => onEdit(row.id)} />
        <DeleteAction onClick={() => onDelete(row.id, row.nome)} />
      </TableActions>
    ),
  },
];

export default function FornecedorTableOrList({ data, loading, pagination, onEdit, onDelete }: Props) {
  const screens = useBreakpoint();

  if (screens.xs) {
    return (
      <FornecedorMobileList
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
