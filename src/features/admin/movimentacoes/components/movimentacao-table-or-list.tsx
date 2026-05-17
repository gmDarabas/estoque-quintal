import { Grid, Table, Tag } from "antd";
import type { ColumnsType, TablePaginationConfig } from "antd/es/table";
import { MovimentacaoComProduto, TipoMovimentacao } from "../api/types";
import TableActions, {
  DeleteAction,
} from "@/components/table-actions/table-actions";
import MovimentacaoMobileList from "./movimentacao-mobile-list";
import { displayMoney } from "@/lib/utils";

const { useBreakpoint } = Grid;

const TIPO_COLOR: Record<TipoMovimentacao, string> = {
  entrada: "green",
  saida: "orange",
  perda: "red",
};

const TIPO_LABEL: Record<TipoMovimentacao, string> = {
  entrada: "Entrada",
  saida: "Saída",
  perda: "Perda",
};

interface Props {
  data: MovimentacaoComProduto[] | undefined;
  loading: boolean;
  pagination: TablePaginationConfig;
  onDelete: (id: string) => void;
}

const columns = (
  onDelete: (id: string) => void,
): ColumnsType<MovimentacaoComProduto> => [
  {
    title: "Produto",
    dataIndex: "produtos",
    render: (p: MovimentacaoComProduto["produtos"]) => p?.nome ?? "—",
  },
  {
    title: "Tipo",
    dataIndex: "tipo",
    width: 100,
    render: (tipo: TipoMovimentacao) => (
      <Tag color={TIPO_COLOR[tipo]}>{TIPO_LABEL[tipo]}</Tag>
    ),
  },
  {
    title: "Quantidade",
    dataIndex: "quantidade",
    width: 130,
    render: (qtd: number, row: MovimentacaoComProduto) =>
      `${qtd} ${row.produtos?.unidade ?? ""}`,
  },
  {
    title: "Data",
    dataIndex: "created_at",
    width: 170,
    responsive: ["md"],
    render: (date: string) => new Date(date).toLocaleString("pt-BR"),
  },
  {
    title: "Preço de custo",
    dataIndex: "preco_custo_unitario",
    width: 130,
    responsive: ["lg"],
    render: (preco: number | null) => displayMoney(preco),
  },
  {
    title: "Preço de venda",
    dataIndex: "preco_venda_unitario",
    width: 130,
    responsive: ["lg"],
    render: (preco: number | null) => displayMoney(preco),
  },
  {
    title: "Valor total",
    width: 130,
    responsive: ["lg"],
    render: (_: unknown, row: MovimentacaoComProduto) => {
      const preco = row.preco_custo_unitario ?? row.preco_venda_unitario;
      return displayMoney(preco != null ? row.quantidade * preco : null);
    },
  },
  {
    title: "Observação",
    dataIndex: "observacao",
    responsive: ["xl"],
    render: (obs: string | null) => obs ?? "—",
  },
  {
    title: "Ações",
    dataIndex: "action",
    width: 80,
    render: (_: unknown, row: MovimentacaoComProduto) => (
      <TableActions>
        <DeleteAction onClick={() => onDelete(row.id)} />
      </TableActions>
    ),
  },
];

function MovimentacaoTableOrList({
  data,
  loading,
  pagination,
  onDelete,
}: Props) {
  const screens = useBreakpoint();

  if (screens.xs) {
    return (
      <MovimentacaoMobileList
        data={data ?? []}
        loading={loading}
        pagination={pagination}
        onDelete={onDelete}
      />
    );
  }

  return (
    <Table
      columns={columns(onDelete)}
      dataSource={data}
      pagination={pagination}
      rowKey="id"
      loading={loading}
    />
  );
}

export default MovimentacaoTableOrList;
