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
    title: "Qtd Atual",
    dataIndex: "quantidade_atual",
    width: 120,
    render: (qtd: number, row: ProdutoEstoque) => (
      <Tag color="red">
        {qtd} {row.unidade}
      </Tag>
    ),
  },
  {
    title: "Est. Mínimo",
    dataIndex: "estoque_minimo",
    width: 120,
    render: (min: number, row: ProdutoEstoque) => `${min} ${row.unidade}`,
  },
  {
    title: "Falta",
    width: 110,
    render: (_: unknown, row: ProdutoEstoque) => {
      const falta = row.estoque_minimo - row.quantidade_atual;
      return (
        <Tag color="orange">
          {falta > 0 ? falta : 0} {row.unidade}
        </Tag>
      );
    },
  },
  {
    title: "Custo de Reposição",
    width: 160,
    responsive: ["md"],
    render: (_: unknown, row: ProdutoEstoque) => {
      const falta = Math.max(0, row.estoque_minimo - row.quantidade_atual);
      const custo = row.preco_custo_atual ?? row.preco_custo_medio;
      if (custo == null || falta === 0) return "—";
      return displayMoney(falta * custo);
    },
  },
];

export default function TabelaEstoqueMinimo({
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
