import { Table } from "antd";
import type { ColumnsType, TablePaginationConfig } from "antd/es/table";
import { PerdaComCusto } from "../api/perdas";
import { displayMoney } from "@/lib/utils";

interface Props {
  data: PerdaComCusto[] | undefined;
  loading: boolean;
  pagination: TablePaginationConfig;
}

const columns: ColumnsType<PerdaComCusto> = [
  {
    // Data do evento, não do lançamento: as perdas são registradas depois.
    title: "Data",
    dataIndex: "data_movimentacao",
    width: 160,
    render: (d: string) => new Date(d).toLocaleString("pt-BR"),
  },
  {
    title: "Produto",
    dataIndex: "produtos",
    render: (p: PerdaComCusto["produtos"]) => p?.nome ?? "—",
  },
  {
    title: "Quantidade",
    dataIndex: "quantidade",
    width: 120,
    render: (qtd: number, row: PerdaComCusto) =>
      `${qtd} ${row.produtos?.unidade ?? ""}`,
  },
  {
    title: "Custo Unit.",
    dataIndex: "custo_unitario",
    width: 130,
    responsive: ["md"],
    render: (v: number | null) => displayMoney(v) || "—",
  },
  {
    title: "Valor Perdido",
    width: 140,
    render: (_: unknown, row: PerdaComCusto) => {
      if (row.custo_unitario == null) return "—";
      return displayMoney(row.quantidade * row.custo_unitario);
    },
  },
  {
    title: "Observação",
    dataIndex: "observacao",
    responsive: ["lg"],
    render: (obs: string | null) => obs ?? "—",
  },
];

export default function TabelaPerdas({ data, loading, pagination }: Props) {
  return (
    <Table
      columns={columns}
      dataSource={data}
      pagination={pagination}
      rowKey="id"
      loading={loading}
      size="small"
    />
  );
}
