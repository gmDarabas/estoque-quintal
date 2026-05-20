import { Table, Tag } from "antd";
import type { ColumnsType, TablePaginationConfig } from "antd/es/table";
import { ProdutoEstoque } from "../../produtos/api/types";
import { displayMoney } from "@/lib/utils";

interface Props {
  data: ProdutoEstoque[] | undefined;
  loading: boolean;
  pagination: TablePaginationConfig;
}

const columns: ColumnsType<ProdutoEstoque> = [
  { title: "Produto", dataIndex: "nome" },
  {
    title: "Categoria",
    dataIndex: "categoria",
    responsive: ["md"],
    render: (c: ProdutoEstoque["categoria"]) => c?.nome ?? "—",
  },
  {
    title: "Unidade",
    dataIndex: "unidade",
    width: 90,
    responsive: ["lg"],
  },
  {
    title: "Qtd Atual",
    dataIndex: "quantidade_atual",
    width: 120,
    render: (qtd: number, row: ProdutoEstoque) => (
      <Tag color={row.abaixo_do_minimo ? "red" : "green"}>
        {qtd} {row.unidade}
      </Tag>
    ),
  },
  {
    title: "Est. Mínimo",
    dataIndex: "estoque_minimo",
    width: 120,
    responsive: ["md"],
    render: (min: number, row: ProdutoEstoque) => `${min} ${row.unidade}`,
  },
  {
    title: "Custo Médio",
    dataIndex: "preco_custo_medio",
    width: 130,
    responsive: ["lg"],
    render: (v: number | null) => displayMoney(v) || "—",
  },
  {
    title: "Valor em Estoque",
    dataIndex: "valor_total_estoque",
    width: 150,
    responsive: ["lg"],
    render: (v: number | null) => displayMoney(v) || "—",
  },
  {
    title: "Status",
    dataIndex: "abaixo_do_minimo",
    width: 130,
    responsive: ["sm"],
    render: (abaixo: boolean) =>
      abaixo ? (
        <Tag color="red">Abaixo do mínimo</Tag>
      ) : (
        <Tag color="green">OK</Tag>
      ),
  },
];

export default function TabelaPosicaoEstoque({
  data,
  loading,
  pagination,
}: Props) {
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
