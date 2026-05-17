import { Table } from "antd";
import type { ColumnsType, TablePaginationConfig } from "antd/es/table";
import { MovimentacaoComProduto } from "../../movimentacoes/api/types";
import { displayMoney } from "@/lib/utils";

interface Props {
  data: MovimentacaoComProduto[] | undefined;
  loading: boolean;
  pagination: TablePaginationConfig;
}

const columns: ColumnsType<MovimentacaoComProduto> = [
  {
    title: "Data",
    dataIndex: "created_at",
    width: 160,
    render: (d: string) => new Date(d).toLocaleString("pt-BR"),
  },
  {
    title: "Produto",
    dataIndex: "produtos",
    render: (p: MovimentacaoComProduto["produtos"]) => p?.nome ?? "—",
  },
  {
    title: "Quantidade",
    dataIndex: "quantidade",
    width: 120,
    render: (qtd: number, row: MovimentacaoComProduto) =>
      `${qtd} ${row.produtos?.unidade ?? ""}`,
  },
  {
    title: "Custo Unit.",
    dataIndex: "preco_custo_unitario",
    width: 130,
    responsive: ["md"],
    render: (v: number | null) => displayMoney(v) || "—",
  },
  {
    title: "Valor Perdido",
    width: 140,
    render: (_: unknown, row: MovimentacaoComProduto) => {
      if (row.preco_custo_unitario == null) return "—";
      return displayMoney(row.quantidade * row.preco_custo_unitario);
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
